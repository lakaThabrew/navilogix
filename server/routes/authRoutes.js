import express from 'express';
import { registerUser, loginUser, processPayment, forgotPassword, resetPassword, getBranches } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/pay', protect, processPayment);
router.get('/branches', getBranches);

export default router;
