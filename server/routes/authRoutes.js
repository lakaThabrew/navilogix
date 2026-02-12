import express from 'express';
import { registerUser, loginUser, processPayment } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/pay', protect, processPayment);

export default router;
