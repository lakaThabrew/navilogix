import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists at the root of the project (NaviLogix/logs)
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'app.log');

const { combine, timestamp, printf, colorize } = winston.format;

// Define the custom format for logs
const logFormat = printf(({ level, message, timestamp, source, ...meta }) => {
    // Default to BACKEND if source is not provided
    const logSource = source ? source.toUpperCase() : 'BACKEND';

    let typeTag = typeof level === 'string' ? level.toUpperCase() : 'INFO';
    let emoji = 'ℹ️';

    // Identify exceptions and errors specifically
    if (meta && (meta.exception || meta.isException || meta.stack)) {
        typeTag = 'EXCEPTION';
        emoji = '💥';
    } else if (typeTag.includes('ERROR')) {
        typeTag = 'ERROR';
        emoji = '🛑';
    } else if (typeTag.includes('WARN')) {
        typeTag = 'WARNING';
        emoji = '⚠️';
    }

    let logMessage = `${timestamp} [${logSource}] ${emoji} [${typeTag}]: ${message}`;

    // Clean up unnecessary meta properties for cleaner logs
    const displayMeta = { ...meta };
    delete displayMeta.exception;
    delete displayMeta.os;
    delete displayMeta.trace;
    delete displayMeta.process;
    delete displayMeta.memoryUsage;

    if (Object.keys(displayMeta).length > 0) {
        logMessage += ` | Details: ${JSON.stringify(displayMeta)}`;
    }
    return logMessage;
});

// Create the Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Write ALL logs to a single file named 'app.log'
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            )
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        })
    ]
});

// Helper for frontend logs so it automatically appends source: 'frontend'
export const frontendLogger = {
    info: (msg, meta) => logger.info(msg, { ...meta, source: 'frontend' }),
    warn: (msg, meta) => logger.warn(msg, { ...meta, source: 'frontend' }),
    error: (msg, meta) => logger.error(msg, { ...meta, source: 'frontend' })
};

export default logger;
