import Parcel from '../models/Parcel.js';
import Branch from '../models/Branch.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { MAX_DAILY_DELIVERIES } from '../config/constants.js';

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

// Auto-assign rider logic
const autoAssignRider = async (parcelId, branchId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find all delivery persons in this branch
        const riders = await User.find({ role: 'delivery_person', branchId });

        if (riders.length === 0) {
            logger.info(`⚠️ [AUTO ASSIGN] No riders found for branch: ${branchId}`);
            return false;
        }

        let selectedRider = null;
        let minParcels = Infinity;
        let assignedDate = today;
        let statusMessage = "Out for Delivery";

        // Try to find a rider for today
        for (const rider of riders) {
            const count = await Parcel.countDocuments({
                riderId: rider._id,
                tourDate: { $gte: today, $lt: tomorrow }
            });
            logger.info(`📊 [AUTO ASSIGN] Rider ${rider.name} has ${count} parcels assigned for today`);

            if (count < MAX_DAILY_DELIVERIES && count < minParcels) {
                minParcels = count;
                selectedRider = rider;
            }
        }

        // If all riders have reached today's limit, assign for tomorrow
        if (!selectedRider) {
            minParcels = Infinity;
            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

            for (const rider of riders) {
                const countTomorrow = await Parcel.countDocuments({
                    riderId: rider._id,
                    tourDate: { $gte: tomorrow, $lt: dayAfterTomorrow }
                });

                if (countTomorrow < minParcels) {
                    minParcels = countTomorrow;
                    selectedRider = rider;
                }
            }
            assignedDate = tomorrow;
            statusMessage = "Scheduled for Next Day";
        }

        if (selectedRider) {
            const parcel = await Parcel.findById(parcelId);
            if (!parcel) return false;

            parcel.riderId = selectedRider._id;
            parcel.tourDate = assignedDate;
            parcel.status = 'Out for Delivery';
            parcel.history.push({
                status: 'Out for Delivery',
                location: `Assigned to Rider ${selectedRider.name} ${statusMessage === "Scheduled for Next Day" ? "(Next Day)" : ""}`,
                timestamp: new Date()
            });
            await parcel.save();
            logger.info(`✅ [AUTO ASSIGN] Rider ${selectedRider.name} assigned to parcel: ${parcel.trackingId}`);
            logger.info(`📅 [AUTO ASSIGN] Assigned date: ${assignedDate.toDateString()} (${statusMessage})`);
            return true;
        }
    } catch (error) {
        logger.error(`❌ [AUTO ASSIGN] Error during auto-assignment: ${error.message}`);
    }
    return false;
};


export const createParcel = async (req, res) => {
    const { senderInfo, receiverInfo, weight, type, codAmount } = req.body;
    logger.info(`📦 [CREATE PARCEL] Creating new parcel for: ${receiverInfo.name}`);

    // Check if user is authenticated (should be if protected route)
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const senderBranchId = await determineBranch(senderInfo.address);
        const receiverBranchId = await determineBranch(receiverInfo.address);

        const trackingId =
            "NV-" +
            Date.now().toString(36).toUpperCase() + "-" +
            Math.random().toString(36).slice(3, 4).toUpperCase();

        logger.info(`🔖 [CREATE PARCEL] Generated tracking ID: ${trackingId}`);

        let initialStatus = 'In Main Branch';
        let initialHistory = { status: 'In Main Branch', location: 'Main Office', timestamp: new Date() };
        let initialBranchId = senderBranchId;

        if (req.user.role === 'branch_head') {
            initialStatus = 'In Sub Branch'; // Or 'Dispatched to Main'
            initialBranchId = req.user.branchId;
            initialHistory = {
                status: 'In Sub Branch',
                location: `Branch: ${req.user.branchId || 'Unknown'}`,
                timestamp: new Date()
            };
        } else if (req.user.role === 'main_admin') {
            const mainOffice = await Branch.findOne({ branchName: 'Main Office' });
            initialBranchId = mainOffice ? mainOffice._id : senderBranchId;
        }

        logger.info(`🏢 [CREATE PARCEL] Assigned initial branch ID: ${initialBranchId}`);

        const parcel = await Parcel.create({
            trackingId,
            senderInfo,
            receiverInfo,
            branchId: initialBranchId,
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
            logger.info(`📨 [CREATE PARCEL] Notification sent to Main Admin`);
        }

        logger.info(`✅ [CREATE PARCEL] Parcel created successfully: ${trackingId}`);

        // Try auto-assign immediately if it started in a sub-branch AND is a local delivery
        if (parcel.status === 'In Sub Branch') {
            const isLocalDelivery = req.user.role === 'branch_head' && req.user.branchId && req.user.branchId.toString() === branchId.toString();
            if (isLocalDelivery) {
                await autoAssignRider(parcel._id, branchId);
            }
        }

        res.status(201).json(parcel);
    } catch (error) {
        logger.error(`❌ [CREATE PARCEL] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const getParcels = async (req, res) => {
    logger.info(`📋 [GET PARCELS] Fetching all parcels...`);
    try {
        // Filter based on user role (assumed processed by middleware)
        // For now, return all for admin
        const parcels = await Parcel.find().populate('branchId').populate('riderId');
        logger.info(`✅ [GET PARCELS] Found ${parcels.length} parcels`);
        res.json(parcels);
    } catch (error) {
        logger.error(`❌ [GET PARCELS] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const trackParcel = async (req, res) => {
    const { trackingId } = req.params;
    logger.info(`🔍 [TRACK PARCEL] Tracking parcel: ${trackingId}`);
    try {
        const parcel = await Parcel.findOne({ trackingId }).populate('branchId');
        if (!parcel) {
            logger.info(`❌ [TRACK PARCEL] Parcel not found: ${trackingId}`);
            return res.status(404).json({ message: 'Parcel not found' });
        }
        logger.info(`✅ [TRACK PARCEL] Parcel found: ${trackingId} (Status: ${parcel.status})`);
        res.json(parcel);
    } catch (error) {
        logger.error(`❌ [TRACK PARCEL] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const updateParcelStatus = async (req, res) => {
    const { id } = req.params;
    const { status, location } = req.body;
    logger.info(`🔄 [UPDATE STATUS] Updating parcel ${id} to status: ${status}`);
    try {
        const parcel = await Parcel.findById(id);
        if (!parcel) {
            logger.info(`❌ [UPDATE STATUS] Parcel not found: ${id}`);
            return res.status(404).json({ message: 'Parcel not found' });
        }

        // Role-based status validation based on user requirements
        const userRole = req.user.role;
        if (userRole === 'main_admin' && (status === 'Delivered' || status === 'Out for Delivery')) {
            return res.status(403).json({ message: 'Main Admin cannot change status to Delivered or Out for Delivery' });
        }
        if (userRole === 'branch_head' && status === 'Delivered') {
            return res.status(403).json({ message: 'Branch Head cannot change status to Delivered' });
        }
        if (userRole === 'delivery_person' && status !== 'Delivered' && status !== 'Returned') {
            return res.status(403).json({ message: 'Delivery Person can only change status to Delivered or Returned' });
        }

        const previousStatus = parcel.status;
        
        // Update branchId based on status progression
        if (status === 'Transmitting') {
             if (previousStatus === 'In Sub Branch') {
                 // From Sender branch -> Main Office
                 const mainOffice = await Branch.findOne({ branchName: 'Main Office' });
                 if (mainOffice) parcel.branchId = mainOffice._id;
             } else if (previousStatus === 'In Main Branch') {
                 // From Main Office -> Receiver branch
                 parcel.branchId = await determineBranch(parcel.receiverInfo.address);
             }
        } else if (status === 'In Main Branch') {
             const mainOffice = await Branch.findOne({ branchName: 'Main Office' });
             if (mainOffice) parcel.branchId = mainOffice._id;
        } else if (status === 'In Sub Branch') {
             if (previousStatus === 'Transmitting' || previousStatus === 'In Main Branch') {
                 parcel.branchId = await determineBranch(parcel.receiverInfo.address);
             }
        }

        parcel.status = status;
        parcel.history.push({
            status,
            location: location || 'Unknown',
            timestamp: new Date()
        });

        await parcel.save();
        logger.info(`✅ [UPDATE STATUS] Status updated successfully for parcel: ${parcel.trackingId}`);

        // If moving to sub branch, maybe we need to assign a rider now
        if (status === 'In Sub Branch' && !parcel.riderId) {
            await autoAssignRider(parcel._id, parcel.branchId);
        }

        res.json(parcel);
    } catch (error) {
        logger.error(`❌ [UPDATE STATUS] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};


export const getParcelReports = async (req, res) => {
    try {
        const { startDate, endDate, type, status } = req.query;
        let query = {};

        // Admin View: All parcels (optionally filtered by dates/status)
        if (req.user.role === 'main_admin') {
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            if (type) query.type = type;
            if (status) query.status = status;
        } else if (req.user.role === 'branch_head') {
            // Branch Head View: Only parcels for their branch
            query.branchId = req.user.branchId;
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            if (type) query.type = type;
            if (status) query.status = status;
        } else {
            // Regular User View
            query = {
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
        }

        const parcels = await Parcel.find(query).populate('branchId').populate('riderId');

        let stats = {};

        if (req.user.role === 'main_admin' || req.user.role === 'branch_head') {
            // Admin and Branch Head Stats
            stats = {
                totalParcels: parcels.length,
                totalDelivered: parcels.filter(p => p.status === 'Delivered').length,
                totalReturned: parcels.filter(p => p.status === 'Returned').length,
                totalPending: parcels.filter(p => p.status !== 'Delivered' && p.status !== 'Returned').length,
                totalRevenue: parcels.reduce((acc, p) => acc + (p.codAmount || 0), 0),

                // Branch Performance (For branch head this will mostly be their own branch, which is fine)
                branchBreakdown: parcels.reduce((acc, p) => {
                    const branchName = p.branchId ? p.branchId.branchName : 'Main Office';
                    if (!acc[branchName]) acc[branchName] = 0;
                    acc[branchName]++;
                    return acc;
                }, {}),

                // Rider Performance
                riderPerformance: parcels.reduce((acc, p) => {
                    if (p.riderId) {
                        const riderName = p.riderId.name;
                        if (!acc[riderName]) acc[riderName] = { delivered: 0, assigned: 0 };
                        acc[riderName].assigned++;
                        if (p.status === 'Delivered') acc[riderName].delivered++;
                    }
                    return acc;
                }, {}),

                // Status Breakdown
                statusBreakdown: parcels.reduce((acc, p) => {
                    if (!acc[p.status]) acc[p.status] = 0;
                    acc[p.status]++;
                    return acc;
                }, {}),

                // Type Breakdown
                typeBreakdown: parcels.reduce((acc, p) => {
                    const t = p.type || 'Standard';
                    if (!acc[t]) acc[t] = 0;
                    acc[t]++;
                    return acc;
                }, {})
            };
        } else {
            // Regular User Stats
            stats = {
                totalSent: parcels.filter(p => p.senderInfo.contact === req.user.email).length,
                totalReceived: parcels.filter(p => p.receiverInfo.contact === req.user.email).length,
                delivered: parcels.filter(p => p.status === 'Delivered').length,
                returned: parcels.filter(p => p.status === 'Returned').length,
                codPaid: parcels.filter(p => p.receiverInfo.contact === req.user.email && p.status === 'Delivered').reduce((acc, p) => acc + (p.codAmount || 0), 0),
                codToReceive: parcels.filter(p => p.senderInfo.contact === req.user.email && p.status === 'Delivered').reduce((acc, p) => acc + (p.codAmount || 0), 0),
            };
        }

        res.json({ stats, parcels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignRider = async (req, res) => {
    logger.info(`🚴 [ASSIGN RIDER] Assigning rider...`);
    const { parcelId, riderId } = req.body;
    logger.info(`🚴 [ASSIGN RIDER] Parcel: ${parcelId}, Rider: ${riderId}`);
    try {
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) {
            logger.info(`❌ [ASSIGN RIDER] Parcel not found: ${parcelId}`);
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
            logger.info(`⚠️ [ASSIGN RIDER] Rider limit reached (${riderParcelsCount}). Assigning to next day.`);
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
        logger.info(`✅ [ASSIGN RIDER] Rider assigned successfully to parcel: ${parcel.trackingId}`);
        res.json({ ...parcel.toObject(), note: statusMessage });
    } catch (error) {
        logger.error(`❌ [ASSIGN RIDER] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
