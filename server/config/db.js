import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        logger.info('🔌 Attempting to connect to MongoDB...');
        logger.info(`📍 Connection URI: ${process.env.MONGO_URI || 'mongodb://localhost:27017/navilogix'}`);
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/navilogix', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        logger.info(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        logger.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
