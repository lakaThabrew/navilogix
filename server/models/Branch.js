import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true },
    contactNumber: { type: String, required: false },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    assignedAreas: [{ type: String }],
});

export default mongoose.model('Branch', branchSchema);
