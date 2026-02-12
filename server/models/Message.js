import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    parcelData: { type: Object }, // Optional: specific data for system actions
    receiverRole: { type: String, enum: ['main_admin', 'branch_head', 'delivery_person', 'regular'], required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
