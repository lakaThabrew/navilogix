import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    senderInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true }
    },
    receiverInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true }
    },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'In Main Branch', 'Transmitting', 'In Sub Branch', 'Out for Delivery', 'Delivered', 'Returned'],
        default: 'Pending'
    },
    weight: { type: Number },
    type: { type: String },
    codAmount: { type: Number, default: 0 },
    tourDate: { type: Date },
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, { timestamps: true });

export default mongoose.model('Parcel', parcelSchema);
