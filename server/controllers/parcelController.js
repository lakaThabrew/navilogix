import Parcel from '../models/Parcel.js';
import Branch from '../models/Branch.js';

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
    try {
        const branchId = await determineBranch(receiverInfo.address);
        const trackingId = 'NV-' + Date.now() + Math.floor(Math.random() * 1000);
        console.log(`🔖 [CREATE PARCEL] Generated tracking ID: ${trackingId}`);
        console.log(`🏢 [CREATE PARCEL] Assigned branch ID: ${branchId}`);

        const parcel = await Parcel.create({
            trackingId,
            senderInfo,
            receiverInfo,
            branchId,
            weight,
            type,
            codAmount,
            status: 'In Main Branch',
            history: [{ status: 'In Main Branch', location: 'Main Office', timestamp: new Date() }]
        });
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

        parcel.riderId = riderId;
        parcel.status = 'Out for Delivery';
        parcel.history.push({
            status: 'Out for Delivery',
            location: 'Assigned to Rider',
            timestamp: new Date()
        });

        await parcel.save();
        console.log(`✅ [ASSIGN RIDER] Rider assigned successfully to parcel: ${parcel.trackingId}`);
        res.json(parcel);
    } catch (error) {
        console.error(`❌ [ASSIGN RIDER] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};
