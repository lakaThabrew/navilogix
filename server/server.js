import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import parcelRoutes from './routes/parcelRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import Branch from './models/Branch.js';
import logger, { frontendLogger } from './utils/logger.js';

dotenv.config();
logger.info('✓ Environment variables loaded');

connectDB();

const app = express();

app.use(cors());
logger.info('✓ CORS enabled');

app.use(express.json());
logger.info('✓ JSON parser enabled');

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`📥 ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
logger.info('✓ Auth routes registered at /api/auth');

app.get('/api/branches', async (req, res) => {
    try {
        const branches = await Branch.find({});
        res.json(branches);
    } catch (error) {
        logger.error(`Error fetching branches: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});
logger.info('✓ Branch routes registered at /api/branches');

app.use('/api/parcels', parcelRoutes);
logger.info('✓ Parcel routes registered at /api/parcels');

app.use('/api/messages', messageRoutes);
logger.info('✓ Message routes registered at /api/messages');

app.use('/api/ai', aiRoutes);
logger.info('✓ AI Assistant routes registered at /api/ai');

app.post('/api/logs/frontend', (req, res) => {
    const { level, message, ...meta } = req.body;
    if (level && message) {
        if (level === 'error') {
            frontendLogger.error(message, meta);
        } else if (level === 'warn') {
            frontendLogger.warn(message, meta);
        } else {
            frontendLogger.info(message, meta);
        }
    }
    res.status(200).send('Log received');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`✓ Server running on port ${PORT}`);
});
