import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Parcel from './models/Parcel.js';
import Branch from './models/Branch.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/navilogix', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        await Parcel.deleteMany({});
        await Branch.deleteMany({});
        console.log('Cleared existing data');

        // Seed Branches
        const branches = await Branch.create([
            {
                branchName: 'Main Office',
                coordinates: { lat: 6.9271, lng: 79.8612 },
                assignedAreas: ['Colombo 1', 'Colombo 2', 'Fort', 'Pettah']
            },
            {
                branchName: 'Kandy Branch',
                coordinates: { lat: 7.2906, lng: 80.6337 },
                assignedAreas: ['Kandy', 'Peradeniya', 'Katugastota']
            },
            {
                branchName: 'Galle Branch',
                coordinates: { lat: 6.0535, lng: 80.2210 },
                assignedAreas: ['Galle', 'Hikkaduwa', 'Unawatuna']
            }
        ]);
        console.log('✓ Branches seeded');

        // Hash password for users
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Seed Users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@navilogix.com',
                password: hashedPassword,
                role: 'main_admin'
            },
            {
                name: 'Kamal Silva',
                email: 'kamal@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[0]._id // Main Office
            },
            {
                name: 'Nimal Perera',
                email: 'nimal@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[1]._id // Kandy Branch
            },
            {
                name: 'Sunil Bandara',
                email: 'sunil@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[0]._id // Main Office
            },
            {
                name: 'Pradeep Fernando',
                email: 'pradeep@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[1]._id // Kandy Branch
            },
            {
                name: 'Ruwan Dias',
                email: 'ruwan@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[2]._id // Galle Branch
            },
            {
                name: 'Chamara Weerasinghe',
                email: 'chamara@example.com',
                password: hashedPassword,
                role: 'regular',
                paymentStatus: 'paid'
            },
            {
                name: 'Sanduni Jayasinghe',
                email: 'sanduni@example.com',
                password: hashedPassword,
                role: 'regular',
                paymentStatus: 'unpaid'
            }
        ]);
        console.log('✓ Users seeded (password for all: password123)');

        // Seed Parcels
        const parcels = await Parcel.create([
            {
                trackingId: 'NL2026001',
                senderInfo: {
                    name: 'Amal Jayawardena',
                    address: '123 Galle Road, Colombo 3',
                    contact: '0771234567'
                },
                receiverInfo: {
                    name: 'Kumari Wijesinghe',
                    address: '456 Main Street, Kandy',
                    contact: '0779876543'
                },
                branchId: branches[0]._id,
                riderId: users[4]._id,
                status: 'Out for Delivery',
                weight: 2.5,
                type: 'Document',
                codAmount: 0,
                tourDate: new Date('2026-02-11'),
                history: [
                    { status: 'Pending', location: 'Colombo 3', timestamp: new Date('2026-02-10T08:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-10T10:30:00') },
                    { status: 'Transmitting', location: 'Main Office', timestamp: new Date('2026-02-10T14:00:00') },
                    { status: 'In Sub Branch', location: 'Kandy Branch', timestamp: new Date('2026-02-11T08:00:00') },
                    { status: 'Out for Delivery', location: 'Kandy Branch', timestamp: new Date('2026-02-11T09:00:00') }
                ]
            },
            {
                trackingId: 'NL2026002',
                senderInfo: {
                    name: 'Nilantha Perera',
                    address: '789 Lake Road, Kandy',
                    contact: '0712345678'
                },
                receiverInfo: {
                    name: 'Rashmi Fernando',
                    address: '321 Sea View Road, Galle',
                    contact: '0778765432'
                },
                branchId: branches[1]._id,
                riderId: users[5]._id,
                status: 'In Sub Branch',
                weight: 5.0,
                type: 'Package',
                codAmount: 5000,
                tourDate: new Date('2026-02-12'),
                history: [
                    { status: 'Pending', location: 'Kandy', timestamp: new Date('2026-02-10T12:00:00') },
                    { status: 'In Sub Branch', location: 'Kandy Branch', timestamp: new Date('2026-02-10T16:00:00') },
                    { status: 'Transmitting', location: 'Kandy Branch', timestamp: new Date('2026-02-11T07:00:00') },
                    { status: 'In Sub Branch', location: 'Galle Branch', timestamp: new Date('2026-02-11T11:00:00') }
                ]
            },
            {
                trackingId: 'NL2026003',
                senderInfo: {
                    name: 'Malini Rodrigo',
                    address: '555 Duplication Road, Colombo 4',
                    contact: '0763456789'
                },
                receiverInfo: {
                    name: 'Thilak Rathnayake',
                    address: '888 Temple Road, Colombo 2',
                    contact: '0779998877'
                },
                branchId: branches[0]._id,
                riderId: users[3]._id,
                status: 'Delivered',
                weight: 1.0,
                type: 'Document',
                codAmount: 1500,
                tourDate: new Date('2026-02-10'),
                history: [
                    { status: 'Pending', location: 'Colombo 4', timestamp: new Date('2026-02-09T10:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-09T14:00:00') },
                    { status: 'Out for Delivery', location: 'Main Office', timestamp: new Date('2026-02-10T08:00:00') },
                    { status: 'Delivered', location: 'Colombo 2', timestamp: new Date('2026-02-10T10:30:00') }
                ]
            },
            {
                trackingId: 'NL2026004',
                senderInfo: {
                    name: 'Dinesh Gunasekara',
                    address: '111 Beach Road, Hikkaduwa',
                    contact: '0714567890'
                },
                receiverInfo: {
                    name: 'Shalini Amarasinghe',
                    address: '222 Hill Street, Peradeniya',
                    contact: '0776543210'
                },
                branchId: branches[2]._id,
                riderId: null,
                status: 'In Main Branch',
                weight: 3.5,
                type: 'Package',
                codAmount: 3000,
                tourDate: new Date('2026-02-13'),
                history: [
                    { status: 'Pending', location: 'Hikkaduwa', timestamp: new Date('2026-02-11T09:00:00') },
                    { status: 'In Sub Branch', location: 'Galle Branch', timestamp: new Date('2026-02-11T11:00:00') },
                    { status: 'Transmitting', location: 'Galle Branch', timestamp: new Date('2026-02-11T14:00:00') }
                ]
            },
            {
                trackingId: 'NL2026005',
                senderInfo: {
                    name: 'Upul Gamage',
                    address: '999 New Road, Fort',
                    contact: '0772233445'
                },
                receiverInfo: {
                    name: 'Yasmin Hassan',
                    address: '777 Park Avenue, Colombo 7',
                    contact: '0775566778'
                },
                branchId: branches[0]._id,
                riderId: users[3]._id,
                status: 'Out for Delivery',
                weight: 0.5,
                type: 'Document',
                codAmount: 0,
                tourDate: new Date('2026-02-11'),
                history: [
                    { status: 'Pending', location: 'Fort', timestamp: new Date('2026-02-11T07:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-11T09:30:00') },
                    { status: 'Out for Delivery', location: 'Main Office', timestamp: new Date('2026-02-11T11:00:00') }
                ]
            }
        ]);
        console.log('✓ Parcels seeded');

        console.log('\n========================================');
        console.log('✓ Database seeded successfully!');
        console.log('========================================');
        console.log('\n📦 Sample Data Summary:');
        console.log(`- ${branches.length} Branches`);
        console.log(`- ${users.length} Users`);
        console.log(`- ${parcels.length} Parcels`);
        console.log('\n👤 Login Credentials:');
        console.log('  Admin: admin@navilogix.com / password123');
        console.log('  Branch Head: kamal@example.com / password123');
        console.log('  Delivery Person: sunil@example.com / password123');
        console.log('  Regular User: chamara@example.com / password123');
        console.log('\n📍 Track Sample Parcels:');
        console.log('  NL2026001 - Out for Delivery');
        console.log('  NL2026002 - In Sub Branch');
        console.log('  NL2026003 - Delivered');
        console.log('  NL2026004 - In Main Branch');
        console.log('  NL2026005 - Out for Delivery');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
