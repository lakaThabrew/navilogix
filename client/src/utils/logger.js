// Frontend Logger Utility
// This sends logs to the backend to be written into the frontend.log file

const sendLog = async (level, message, meta = {}) => {
    try {
        const response = await fetch('http://localhost:5000/api/logs/frontend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ level, message, ...meta }),
        });

        if (!response.ok) {
            throw new Error('Server responded with an error');
        }
    } catch (error) {
        // Fallback: If backend is not running or logging fails, log to browser console
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const logMsg = `${timestamp} [FRONTEND (Fallback)] [${level.toUpperCase()}]: ${message}`;

        if (level === 'error') {
            console.error(logMsg, Object.keys(meta).length ? meta : '');
        } else if (level === 'warn') {
            console.warn(logMsg, Object.keys(meta).length ? meta : '');
        } else {
            console.log(logMsg, Object.keys(meta).length ? meta : '');
        }
    }
};

const logger = {
    info: (message, meta) => sendLog('info', message, meta),
    warn: (message, meta) => sendLog('warn', message, meta),
    error: (message, meta) => sendLog('error', message, meta)
};

export default logger;
