import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['guest', 'regular', 'delivery_person', 'branch_head', 'main_admin'],
        default: 'regular'
    },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null }, // For branch_head and delivery_person
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }, // For regular users
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
