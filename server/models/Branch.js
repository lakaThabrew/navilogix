import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    assignedAreas: [{ type: String }], // List of area names/postcodes handled by this branch
});

export default mongoose.model('Branch', branchSchema);
