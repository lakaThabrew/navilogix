import express from 'express';
import { createMessage, getMessages, markAsRead, approveMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/approve', protect, approveMessage);

export default router;
