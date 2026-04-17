import User from '../models/User.js';
import Branch from '../models/Branch.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const registerUser = async (req, res) => {
    const { name, email, password, role, branchId } = req.body;
    logger.info(`📝 [REGISTER] Attempting to register user: ${email}`);

    // Type Validation & Length Limits
    if (typeof name !== 'string' || name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: 'Invalid name format or length' });
    }
    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Role Whitelisting
    const allowedRoles = ['guest', 'regular', 'delivery_person', 'branch_head', 'main_admin'];
    const finalRole = role && allowedRoles.includes(role) ? role : 'regular';

    try {
        const userExists = await User.findOne({ email });
        logger.info(`🔍 [REGISTER] Checking if user exists: ${!!userExists}`);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: finalRole,
            branchId
        });

        if (user) {
            logger.info(`✅ [REGISTER] User created successfully: ${email} (Role: ${user.role})`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        logger.error(`❌ [REGISTER] Error: ${error.message}`);
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

export const addBranch = async (req, res) => {
    const { branchName, contactNumber, lat, lng, assignedAreas } = req.body;
    try {
        const branchExists = await Branch.findOne({ branchName });
        if (branchExists) return res.status(400).json({ message: 'Branch already exists' });

        const newBranch = await Branch.create({
            branchName,
            contactNumber,
            coordinates: { lat: Number(lat), lng: Number(lng) },
            assignedAreas: assignedAreas ? assignedAreas.split(',').map(a => a.trim()) : []
        });

        logger.info(`🏢 [BRANCH] New branch added: ${branchName}`);
        res.status(201).json(newBranch);
    } catch (error) {
        logger.error(`❌ [BRANCH] Add error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const reservePackage = async (req, res) => {
    const { plan } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.selectedPlan = plan;
            user.isPlanReserved = true;
            await user.save();
            logger.info(`📝 [RESERVE] User ${user.email} reserved plan: ${plan}`);
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                paymentStatus: user.paymentStatus,
                selectedPlan: user.selectedPlan,
                isPlanReserved: user.isPlanReserved,
                token: generateToken(user._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const processPayment = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            logger.info(`💳 [PAYMENT] Attempting payment processing for: ${user.email}`);
            user.paymentStatus = 'paid';
            user.isPlanReserved = false;
            await user.save();
            logger.info(`✅ [PAYMENT] Payment successful and plan activated for: ${user.email}`);
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                paymentStatus: user.paymentStatus,
                selectedPlan: user.selectedPlan,
                token: generateToken(user._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error(`❌ [PAYMENT] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    logger.info(`🔐 [LOGIN] Attempting login for: ${email}`);

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Email and password must be strings' });
    }

    try {
        // Select password explicitly since it's hidden by default
        const user = await User.findOne({ email }).select('+password').populate('branchId', 'branchName');
        logger.info(`🔍 [LOGIN] User found: ${!!user}`);

        if (user && (await bcrypt.compare(password, user.password))) {
            logger.info(`✅ [LOGIN] Login successful: ${email} (Role: ${user.role})`);
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                paymentStatus: user.paymentStatus || 'unpaid',
                selectedPlan: user.selectedPlan,
                isPlanReserved: user.isPlanReserved,
                token: generateToken(user._id)
            });
        } else {
            logger.info(`❌ [LOGIN] Invalid credentials for: ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        logger.error(`❌ [LOGIN] Error: ${error.message}`);
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

        logger.info(`🔑 [FORGOT PASSWORD] Reset token for ${email}: ${resetToken}`);
        res.json({ message: 'Reset token generated (check server log)', resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        logger.info(`🛡️ [PASSWORD RESET] Attempting password reset with token`);
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            logger.info(`❌ [PASSWORD RESET] Invalid or expired token attempt`);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        logger.info(`✅ [PASSWORD RESET] Password successfully updated for: ${user.email}`);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        logger.error(`❌ [PASSWORD RESET] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Admin User Management Endpoints
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).populate('branchId', 'branchName');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role, branchId } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role || user.role;
        user.branchId = branchId || user.branchId;

        await user.save();

        // Return populated user for frontend
        const updatedUser = await User.findById(id).populate('branchId', 'branchName');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        res.json({ message: 'User removed completely' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Profile Management Endpoint
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            logger.info(`🔄 [PROFILE] Update request received for: ${user.email}`);
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                logger.info(`🔑 [PROFILE] Password change requested for: ${user.email}`);
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            await user.save();
            const updatedUser = await User.findById(user._id).populate('branchId', 'branchName');

            logger.info(`✅ [PROFILE] User profile updated: ${updatedUser.email}`);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                role: updatedUser.role,
                paymentStatus: updatedUser.paymentStatus,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error(`❌ [PROFILE] Update error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
