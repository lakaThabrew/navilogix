import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the app.log file
const logPath = path.join(__dirname, '../../logs/app.log');

// 3 days in milliseconds
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

export const cleanOldLogRecords = () => {
    if (!fs.existsSync(logPath)) {
        logger.warn('Log file does not exist.');
        return;
    }

    const now = new Date().getTime();
    try {
        const data = fs.readFileSync(logPath, 'utf8');
        const lines = data.split('\n');
        let initialLineCount = lines.length;

        const recentLines = lines.filter(line => {
            if (!line.trim()) return false;

            // Extract the date from the beginning of the line "YYYY-MM-DD HH:mm:ss"
            const dateString = line.substring(0, 19);
            const logDate = new Date(dateString).getTime();

            // If the date cannot be parsed (e.g., lines with different formats), keep the line
            if (isNaN(logDate)) {
                return true;
            }

            // Keep only records that are not older than 3 days
            return (now - logDate) <= MAX_AGE_MS;
        });

        // Write the recent lines back to the file
        fs.writeFileSync(logPath, recentLines.join('\n') + '\n', 'utf8');

        // Log the result back into the log file using the Winston logger
        logger.info(`Old log records successfully removed! (Lines reduced: ${initialLineCount} -> ${recentLines.length})`);
    } catch (error) {
        logger.error(`Error cleaning logs: ${error.message}`);
    }
};

// Execute if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    cleanOldLogRecords();
}
