import express from 'express';
import { createMessage, getMessages, markAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);

export default router;
