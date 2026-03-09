import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI ;
        const databaseName = process.env.MONGO_DB_NAME;

        logger.info(`📍 Connection URI: ${mongoUri}`);
        const conn = await mongoose.connect(mongoUri, {
            dbName: databaseName,
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
