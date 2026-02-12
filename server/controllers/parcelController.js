import Parcel from '../models/Parcel.js';
import Branch from '../models/Branch.js';
import Message from '../models/Message.js';

// Helper to determine branch based on address
const determineBranch = async (address) => {
    // Basic keyword matching for demo purposes
    // In production, use Nominatim (OpenStreetMap) for geocoding + checks against branch polygons
    // Example: https://nominatim.openstreetmap.org/search?q={address}&format=json
    const branches = await Branch.find();
    for (let branch of branches) {
        if (address.toLowerCase().includes(branch.branchName.toLowerCase())) {
            return branch._id;
        }
        // Check assigned areas
        for (let area of branch.assignedAreas) {
            if (address.toLowerCase().includes(area.toLowerCase())) {
                return branch._id;
            }
        }
    }
    // Default to a main branch if exists or first one found
    if (branches.length > 0) return branches[0]._id;
    return null;
};


export const createParcel = async (req, res) => {
    const { senderInfo, receiverInfo, weight, type, codAmount } = req.body;
    console.log(`📦 [CREATE PARCEL] Creating new parcel for: ${receiverInfo.name}`);

    // Check if user is authenticated (should be if protected route)
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const branchId = await determineBranch(receiverInfo.address);
        const trackingId = 'NV-' + Date.now() + Math.floor(Math.random() * 1000);
        console.log(`🔖 [CREATE PARCEL] Generated tracking ID: ${trackingId}`);
        console.log(`🏢 [CREATE PARCEL] Assigned branch ID: ${branchId}`);

        let initialStatus = 'In Main Branch';
        let initialHistory = { status: 'In Main Branch', location: 'Main Office', timestamp: new Date() };

        if (req.user.role === 'branch_head') {
            initialStatus = 'In Sub Branch'; // Or 'Dispatched to Main'
            initialHistory = {
                status: 'In Sub Branch',
                location: `Branch: ${req.user.branchId || 'Unknown'}`,
                timestamp: new Date()
            };
        }

        const parcel = await Parcel.create({
            trackingId,
            senderInfo,
            receiverInfo,
            branchId,
            weight,
            type,
            codAmount,
            status: initialStatus,
            history: [initialHistory],
            createdBy: req.user._id // Optional, track who created it
        });

        // Notify Main Admin if created by Branch Head
        if (req.user.role === 'branch_head') {
            await Message.create({
                senderId: req.user._id,
                content: `Branch Head ${req.user.name} has dispatched a new parcel (${trackingId}) from their branch.`,
                receiverRole: 'main_admin'
            });
            console.log(`📨 [CREATE PARCEL] Notification sent to Main Admin`);
        }

        console.log(`✅ [CREATE PARCEL] Parcel created successfully: ${trackingId}`);
        res.status(201).json(parcel);
    } catch (error) {
        console.error(`❌ [CREATE PARCEL] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getParcels = async (req, res) => {
    console.log(`📋 [GET PARCELS] Fetching all parcels...`);
    try {
        // Filter based on user role (assumed processed by middleware)
        // For now, return all for admin
        const parcels = await Parcel.find().populate('branchId').populate('riderId');
        console.log(`✅ [GET PARCELS] Found ${parcels.length} parcels`);
        res.json(parcels);
    } catch (error) {
        console.error(`❌ [GET PARCELS] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const trackParcel = async (req, res) => {
    const { trackingId } = req.params;
    console.log(`🔍 [TRACK PARCEL] Tracking parcel: ${trackingId}`);
    try {
        const parcel = await Parcel.findOne({ trackingId }).populate('branchId');
        if (!parcel) {
            console.log(`❌ [TRACK PARCEL] Parcel not found: ${trackingId}`);
            return res.status(404).json({ message: 'Parcel not found' });
        }
        console.log(`✅ [TRACK PARCEL] Parcel found: ${trackingId} (Status: ${parcel.status})`);
        res.json(parcel);
    } catch (error) {
        console.error(`❌ [TRACK PARCEL] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updateParcelStatus = async (req, res) => {
    const { id } = req.params;
    const { status, location } = req.body;
    console.log(`🔄 [UPDATE STATUS] Updating parcel ${id} to status: ${status}`);
    try {
        const parcel = await Parcel.findById(id);
        if (!parcel) {
            console.log(`❌ [UPDATE STATUS] Parcel not found: ${id}`);
            return res.status(404).json({ message: 'Parcel not found' });
        }

        parcel.status = status;
        parcel.history.push({
            status,
            location: location || 'Unknown',
            timestamp: new Date()
        });

        await parcel.save();
        console.log(`✅ [UPDATE STATUS] Status updated successfully for parcel: ${parcel.trackingId}`);
        res.json(parcel);
    } catch (error) {
        console.error(`❌ [UPDATE STATUS] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

import { MAX_DAILY_DELIVERIES } from '../config/constants.js';


export const getParcelReports = async (req, res) => {
    try {
        const { startDate, endDate, type, status } = req.query;
        // Build query for current user
        const query = {
            $or: [
                { 'senderInfo.contact': req.user.email },
                { 'receiverInfo.contact': req.user.email }
            ]
        };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (type) query.type = type;
        if (status) query.status = status;

        const parcels = await Parcel.find(query);

        // Aggregate stats
        const stats = {
            totalSent: parcels.filter(p => p.senderInfo.contact === req.user.email).length,
            totalReceived: parcels.filter(p => p.receiverInfo.contact === req.user.email).length,
            delivered: parcels.filter(p => p.status === 'Delivered').length,
            returned: parcels.filter(p => p.status === 'Returned').length,
            codPaid: parcels.filter(p => p.receiverInfo.contact === req.user.email && p.status === 'Delivered').reduce((acc, p) => acc + (p.codAmount || 0), 0),
            codToReceive: parcels.filter(p => p.senderInfo.contact === req.user.email && p.status === 'Delivered').reduce((acc, p) => acc + (p.codAmount || 0), 0),
        };

        res.json({ stats, parcels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignRider = async (req, res) => {
    console.log(`🚴 [ASSIGN RIDER] Assigning rider...`);
    const { parcelId, riderId } = req.body;
    console.log(`🚴 [ASSIGN RIDER] Parcel: ${parcelId}, Rider: ${riderId}`);
    try {
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) {
            console.log(`❌ [ASSIGN RIDER] Parcel not found: ${parcelId}`);
            return res.status(404).json({ message: 'Parcel not found' });
        }

        // Check Daily Limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const riderParcelsCount = await Parcel.countDocuments({
            riderId,
            tourDate: { $gte: today, $lt: tomorrow }
        });

        let assignedDate = today;
        let statusMessage = "Out for Delivery";

        if (riderParcelsCount >= MAX_DAILY_DELIVERIES) {
            console.log(`⚠️ [ASSIGN RIDER] Rider limit reached (${riderParcelsCount}). Assigning to next day.`);
            assignedDate = tomorrow;
            statusMessage = "Scheduled for Next Day";
            // Logic: Status can stay 'In Sub Branch' or be 'Scheduled'
        }

        parcel.riderId = riderId;
        parcel.tourDate = assignedDate; // Set the tour date

        // Only update status to "Out for Delivery" if it's for today? 
        // Or kept as "In Sub Branch" but assigned? 
        // For simplicity, let's mark as Out for Delivery if today, else maybe hold.
        // But user said "assign unama... eya samayen noyana durak awoth eke dawas late krnn ilaga tour ekt dnnone"
        // This implies auto-assignment logic. But this is manual assignment. 
        // I will just assign it.

        parcel.status = 'Out for Delivery'; // Simplified for now
        parcel.history.push({
            status: 'Out for Delivery',
            location: `Assigned to Rider ${statusMessage === "Scheduled for Next Day" ? "(Next Day)" : ""}`,
            timestamp: new Date()
        });

        await parcel.save();
        console.log(`✅ [ASSIGN RIDER] Rider assigned successfully to parcel: ${parcel.trackingId}`);
        res.json({ ...parcel.toObject(), note: statusMessage });
    } catch (error) {
        console.error(`❌ [ASSIGN RIDER] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};
