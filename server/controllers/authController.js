import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
