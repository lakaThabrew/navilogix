import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import parcelRoutes from './routes/parcelRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import Branch from './models/Branch.js';

console.log('🚀 Starting NaviLogix Server...');

dotenv.config();
console.log('✓ Environment variables loaded');

connectDB();

const app = express();

app.use(cors());
console.log('✓ CORS enabled');

app.use(express.json());
console.log('✓ JSON parser enabled');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered at /api/auth');

app.use('/api/parcels', parcelRoutes);
console.log('✓ Parcel routes registered at /api/parcels');

app.use('/api/messages', messageRoutes);
console.log('✓ Message routes registered at /api/messages');

app.use('/api/ai', aiRoutes);
console.log('✓ AI Assistant routes registered at /api/ai');

// Seed Branches if empty
const seedBranches = async () => {
    console.log('🔍 Checking for existing branches...');
    const count = await Branch.countDocuments();
    console.log(`📊 Found ${count} branches in database`);
    if (count === 0) {
        console.log('🌱 Seeding initial branches...');
        await Branch.create([
            {
                branchName: 'Main Office',
                coordinates: { lat: 6.9271, lng: 79.8612 },
                assignedAreas: ['Colombo 1', 'Colombo 2', 'Fort']
            },
            {
                branchName: 'Kandy Branch',
                coordinates: { lat: 7.2906, lng: 80.6337 },
                assignedAreas: ['Kandy', 'Peradeniya']
            },
            {
                branchName: 'Galle Branch',
                coordinates: { lat: 6.0535, lng: 80.2210 },
                assignedAreas: ['Galle', 'Hikkaduwa']
            }
        ]);
        console.log('✓ Branches seeded successfully');
    } else {
        console.log('✓ Branches already exist, skipping seed');
    }
};
seedBranches();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('====================================================================');
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ API Base URL: http://localhost:${PORT}`);
    console.log(`✓ Auth Routes: http://localhost:${PORT}/api/auth`);
    console.log(`✓ Parcel Routes: http://localhost:${PORT}/api/parcels`);
    console.log('====================================================================');
});
