import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [30, 'Name cannot be more than 30 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['guest', 'regular', 'delivery_person', 'branch_head', 'main_admin'],
        default: 'regular'
    },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    selectedPlan: { type: String, enum: ['free', 'plus', 'pro'], default: 'free' },
    isPlanReserved: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
