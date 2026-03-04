import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Parcel from './models/Parcel.js';
import Branch from './models/Branch.js';
import logger from './utils/logger.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/navilogix', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB Connected');
    } catch (error) {
        logger.error(`Error: ${error.message}`);
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
        logger.info('Cleared existing data');

        // Seed Branches
        const branches = await Branch.create([
            {
                branchName: 'Main Office',
                contactNumber: '011-2345678',
                coordinates: { lat: 6.9271, lng: 79.8612 },
                assignedAreas: ['Colombo 1', 'Colombo 2', 'Fort', 'Pettah']
            },
            {
                branchName: 'Kandy Branch',
                contactNumber: '081-2234567',
                coordinates: { lat: 7.2906, lng: 80.6337 },
                assignedAreas: ['Kandy', 'Peradeniya', 'Katugastota']
            },
            {
                branchName: 'Galle Branch',
                contactNumber: '091-2245678',
                coordinates: { lat: 6.0535, lng: 80.2210 },
                assignedAreas: ['Galle', 'Hikkaduwa', 'Unawatuna']
            },
            {
                branchName: 'Kurunegala Branch',
                contactNumber: '037-2211223',
                coordinates: { lat: 7.4818, lng: 80.3609 },
                assignedAreas: ['Kurunegala', 'Kuliyapitiya', 'Narammala']
            },
            {
                branchName: 'Matara Branch',
                contactNumber: '041-2233445',
                coordinates: { lat: 5.9549, lng: 80.5469 },
                assignedAreas: ['Matara', 'Weligama', 'Dikwella']
            },
            {
                branchName: 'Anuradhapura Branch',
                contactNumber: '025-2244556',
                coordinates: { lat: 8.3114, lng: 80.4037 },
                assignedAreas: ['Anuradhapura', 'Mihintale', 'Thambuttegama']
            },
            {
                branchName: 'Jaffna Branch',
                contactNumber: '021-2212345',
                coordinates: { lat: 9.6615, lng: 80.0255 },
                assignedAreas: ['Jaffna', 'Chavakachcheri', 'Point Pedro']
            },
            {
                branchName: 'Trincomalee Branch',
                contactNumber: '026-2245678',
                coordinates: { lat: 8.5811, lng: 81.2330 },
                assignedAreas: ['Trincomalee', 'Kinniya', 'Muttur']
            },
            {
                branchName: 'Badulla Branch',
                contactNumber: '055-2223344',
                coordinates: { lat: 6.9934, lng: 81.0550 },
                assignedAreas: ['Badulla', 'Bandarawela', 'Ella']
            }
        ]);
        logger.info('✓ Branches seeded');

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
            },
            {
                name: 'Heshan Silva',
                email: 'heshan@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[3]._id // Kurunegala Branch
            },
            {
                name: 'Saman Kumara',
                email: 'saman@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[3]._id // Kurunegala
            },
            {
                name: 'Kasun Kalhara',
                email: 'kasun@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[4]._id // Matara Branch
            },
            {
                name: 'Pathum Nissanka',
                email: 'pathum@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[4]._id // Matara
            },
            {
                name: 'Oshada Fernando',
                email: 'oshada@example.com',
                password: hashedPassword,
                role: 'regular',
                paymentStatus: 'paid'
            },
            {
                name: 'Mahela Jayawardene',
                email: 'mahela@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[5]._id // Anuradhapura
            },
            {
                name: 'Lasith Malinga',
                email: 'lasith@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[5]._id // Anuradhapura
            },
            {
                name: 'Muttiah Muralitharan',
                email: 'murali@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[6]._id // Jaffna
            },
            {
                name: 'Rangana Herath',
                email: 'rangana@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[6]._id // Jaffna
            },
            {
                name: 'Angelo Mathews',
                email: 'angelo@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[7]._id // Trincomalee
            },
            {
                name: 'Suranga Lakmal',
                email: 'suranga@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[7]._id // Trincomalee
            },
            {
                name: 'Kusal Perera',
                email: 'kusal@example.com',
                password: hashedPassword,
                role: 'branch_head',
                branchId: branches[8]._id // Badulla
            },
            {
                name: 'Nuwan Pradeep',
                email: 'nuwan@example.com',
                password: hashedPassword,
                role: 'delivery_person',
                branchId: branches[8]._id // Badulla
            }
        ]);
        logger.info('✓ Users seeded (password for all: password123)');

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
            },
            {
                trackingId: 'NL2026006',
                senderInfo: {
                    name: 'Ashen Bandara',
                    address: 'Level 4, City Center, Kurunegala',
                    contact: '0711122334'
                },
                receiverInfo: {
                    name: 'Sachini Perera',
                    address: 'Temple Road, Matara',
                    contact: '0779988776'
                },
                branchId: branches[3]._id,
                riderId: null,
                status: 'In Sub Branch',
                weight: 1.5,
                type: 'Document',
                codAmount: 500,
                tourDate: new Date('2026-02-14'),
                history: [
                    { status: 'Pending', location: 'Kurunegala', timestamp: new Date('2026-02-12T09:00:00') },
                    { status: 'In Sub Branch', location: 'Kurunegala Branch', timestamp: new Date('2026-02-12T11:30:00') }
                ]
            },
            {
                trackingId: 'NL2026007',
                senderInfo: {
                    name: 'Dilshan Madushanka',
                    address: 'Weligama Beach Road, Weligama',
                    contact: '0701122334'
                },
                receiverInfo: {
                    name: 'Kusal Mendis',
                    address: 'Reid Avenue, Colombo 7',
                    contact: '0773344556'
                },
                branchId: branches[4]._id,
                riderId: users[3]._id,
                status: 'Out for Delivery',
                weight: 4.0,
                type: 'Package',
                codAmount: 2000,
                tourDate: new Date('2026-02-15'),
                history: [
                    { status: 'Pending', location: 'Weligama', timestamp: new Date('2026-02-13T08:00:00') },
                    { status: 'In Sub Branch', location: 'Matara Branch', timestamp: new Date('2026-02-13T10:00:00') },
                    { status: 'Transmitting', location: 'Matara Branch', timestamp: new Date('2026-02-13T13:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-14T09:00:00') },
                    { status: 'Out for Delivery', location: 'Main Office', timestamp: new Date('2026-02-14T10:30:00') }
                ]
            },
            {
                trackingId: 'NL2026008',
                senderInfo: {
                    name: 'Charith Asalanka',
                    address: 'High Level Road, Nugegoda',
                    contact: '0755566778'
                },
                receiverInfo: {
                    name: 'Bhanuka Rajapaksa',
                    address: 'Lake View, Kandy',
                    contact: '0722233445'
                },
                branchId: branches[0]._id,
                riderId: null,
                status: 'Returned',
                weight: 2.0,
                type: 'Package',
                codAmount: 1200,
                tourDate: new Date('2026-02-12'),
                history: [
                    { status: 'Pending', location: 'Nugegoda', timestamp: new Date('2026-02-10T09:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-10T12:00:00') },
                    { status: 'Transmitting', location: 'Main Office', timestamp: new Date('2026-02-11T08:00:00') },
                    { status: 'In Sub Branch', location: 'Kandy Branch', timestamp: new Date('2026-02-11T13:00:00') },
                    { status: 'Out for Delivery', location: 'Kandy Branch', timestamp: new Date('2026-02-12T09:00:00') },
                    { status: 'Returned', location: 'Kandy', timestamp: new Date('2026-02-12T14:30:00') }
                ]
            },
            {
                trackingId: 'NL2026009',
                senderInfo: { name: 'Aravinda De Silva', address: 'Borella Cross Road, Colombo 8', contact: '0714445566' },
                receiverInfo: { name: 'Sanath Jayasuriya', address: 'Main Street, Jaffna', contact: '0778889900' },
                branchId: branches[0]._id,
                riderId: null,
                status: 'In Main Branch',
                weight: 5.5,
                type: 'Package',
                codAmount: 4500,
                tourDate: new Date('2026-02-14'),
                history: [
                    { status: 'Pending', location: 'Colombo 8', timestamp: new Date('2026-02-13T09:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-13T14:30:00') }
                ]
            },
            {
                trackingId: 'NL2026010',
                senderInfo: { name: 'Nuwan Kulasekara', address: 'Station Road, Anuradhapura', contact: '0702223344' },
                receiverInfo: { name: 'Dimuth Karunaratne', address: 'Temple Road, Kandy', contact: '0761112233' },
                branchId: branches[5]._id,
                riderId: users[4]._id,
                status: 'Out for Delivery',
                weight: 1.2,
                type: 'Document',
                codAmount: 0,
                tourDate: new Date('2026-02-15'),
                history: [
                    { status: 'Pending', location: 'Anuradhapura', timestamp: new Date('2026-02-13T08:00:00') },
                    { status: 'In Sub Branch', location: 'Anuradhapura Branch', timestamp: new Date('2026-02-13T11:00:00') },
                    { status: 'Transmitting', location: 'Anuradhapura Branch', timestamp: new Date('2026-02-14T07:00:00') },
                    { status: 'In Sub Branch', location: 'Kandy Branch', timestamp: new Date('2026-02-14T14:00:00') },
                    { status: 'Out for Delivery', location: 'Kandy Branch', timestamp: new Date('2026-02-15T09:00:00') }
                ]
            },
            {
                trackingId: 'NL2026011',
                senderInfo: { name: 'Dushmantha Chameera', address: 'Harbor Road, Trincomalee', contact: '0723344556' },
                receiverInfo: { name: 'Thisara Perera', address: 'Market Road, Galle', contact: '0789900112' },
                branchId: branches[7]._id,
                riderId: null,
                status: 'Transmitting',
                weight: 8.0,
                type: 'Package',
                codAmount: 12500,
                tourDate: new Date('2026-02-16'),
                history: [
                    { status: 'Pending', location: 'Trincomalee', timestamp: new Date('2026-02-14T10:00:00') },
                    { status: 'In Sub Branch', location: 'Trincomalee Branch', timestamp: new Date('2026-02-14T15:00:00') },
                    { status: 'Transmitting', location: 'Trincomalee Branch', timestamp: new Date('2026-02-15T08:30:00') }
                ]
            },
            {
                trackingId: 'NL2026012',
                senderInfo: { name: 'Wanindu Hasaranga', address: 'Galle Face, Colombo 1', contact: '0751231234' },
                receiverInfo: { name: 'Pramodya Wickramasinghe', address: 'Old Town, Anuradhapura', contact: '0714564567' },
                branchId: branches[0]._id,
                riderId: users[14]._id,
                status: 'Delivered',
                weight: 0.8,
                type: 'Document',
                codAmount: 0,
                tourDate: new Date('2026-02-13'),
                history: [
                    { status: 'Pending', location: 'Colombo 1', timestamp: new Date('2026-02-11T09:00:00') },
                    { status: 'In Main Branch', location: 'Main Office', timestamp: new Date('2026-02-11T13:00:00') },
                    { status: 'Transmitting', location: 'Main Office', timestamp: new Date('2026-02-12T07:30:00') },
                    { status: 'In Sub Branch', location: 'Anuradhapura Branch', timestamp: new Date('2026-02-12T14:00:00') },
                    { status: 'Out for Delivery', location: 'Anuradhapura Branch', timestamp: new Date('2026-02-13T09:00:00') },
                    { status: 'Delivered', location: 'Anuradhapura', timestamp: new Date('2026-02-13T11:45:00') }
                ]
            },
            {
                trackingId: 'NL2026013',
                senderInfo: { name: 'Upul Tharanga', address: 'College Road, Jaffna', contact: '0776655443' },
                receiverInfo: { name: 'Chaminda Vaas', address: 'Beach Way, Matara', contact: '0719988776' },
                branchId: branches[6]._id,
                riderId: users[11]._id,
                status: 'Out for Delivery',
                weight: 3.2,
                type: 'Package',
                codAmount: 8000,
                tourDate: new Date('2026-02-16'),
                history: [
                    { status: 'Pending', location: 'Jaffna', timestamp: new Date('2026-02-13T10:00:00') },
                    { status: 'In Sub Branch', location: 'Jaffna Branch', timestamp: new Date('2026-02-13T15:00:00') },
                    { status: 'Transmitting', location: 'Jaffna Branch', timestamp: new Date('2026-02-14T06:00:00') },
                    { status: 'In Sub Branch', location: 'Matara Branch', timestamp: new Date('2026-02-15T13:00:00') },
                    { status: 'Out for Delivery', location: 'Matara Branch', timestamp: new Date('2026-02-16T08:30:00') }
                ]
            }
        ]);
        logger.info('✓ Parcels seeded');

        logger.info('\n========================================');
        logger.info('✓ Database seeded successfully!');
        logger.info('========================================');
        logger.info('\n📦 Sample Data Summary:');
        logger.info(`- ${branches.length} Branches`);
        logger.info(`- ${users.length} Users`);
        logger.info(`- ${parcels.length} Parcels`);
        logger.info('\n👤 Login Credentials:');
        logger.info('  Admin: admin@navilogix.com / password123');
        logger.info('  Branch Head: kamal@example.com / password123');
        logger.info('  Delivery Person: sunil@example.com / password123');
        logger.info('  Regular User: chamara@example.com / password123');
        logger.info('\n📍 Track Sample Parcels:');
        logger.info('  NL2026001 - Out for Delivery');
        logger.info('  NL2026002 - In Sub Branch');
        logger.info('  NL2026003 - Delivered');
        logger.info('  NL2026004 - In Main Branch');
        logger.info('  NL2026005 - Out for Delivery');
        logger.info('========================================\n');

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database: ' + error.message, { error });
        process.exit(1);
    }
};

seedDatabase();
