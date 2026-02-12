import express from 'express';
import { createParcel, getParcels, trackParcel, updateParcelStatus, assignRider } from '../controllers/parcelController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createParcel);
router.get('/', protect, getParcels);
router.get('/track/:trackingId', trackParcel); // Public
router.put('/:id/status', protect, updateParcelStatus);
router.post('/assign', protect, assignRider);

export default router;
