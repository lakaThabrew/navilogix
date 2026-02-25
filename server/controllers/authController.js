import User from '../models/User.js';
import Branch from '../models/Branch.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    const { name, email, password, role, branchId } = req.body;
    console.log(`📝 [REGISTER] Attempting to register user: ${email}`);
    try {
        const userExists = await User.findOne({ email });
        console.log(`🔍 [REGISTER] Checking if user exists: ${!!userExists}`);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'regular',
            branchId
        });

        if (user) {
            console.log(`✅ [REGISTER] User created successfully: ${email} (Role: ${user.role})`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error(`❌ [REGISTER] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const processPayment = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.paymentStatus = 'paid';
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                paymentStatus: user.paymentStatus,
                token: generateToken(user._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔐 [LOGIN] Attempting login for: ${email}`);
    try {
        const user = await User.findOne({ email });
        console.log(`🔍 [LOGIN] User found: ${!!user}`);

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`✅ [LOGIN] Login successful: ${email} (Role: ${user.role})`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branchId: user.branchId,
                paymentStatus: user.paymentStatus || 'unpaid',
                token: generateToken(user._id)
            });
        } else {
            console.log(`❌ [LOGIN] Invalid credentials for: ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(`❌ [LOGIN] Error:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        console.log(`🔑 [FORGOT PASSWORD] Reset token for ${email}: ${resetToken}`);
        res.json({ message: 'Reset token generated (check server console)', resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
