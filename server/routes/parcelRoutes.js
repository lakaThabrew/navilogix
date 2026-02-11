import express from 'express';
import { createParcel, getParcels, trackParcel, updateParcelStatus, assignRider } from '../controllers/parcelController.js';

const router = express.Router();

router.post('/', createParcel);
router.get('/', getParcels);
router.get('/track/:trackingId', trackParcel);
router.put('/:id/status', updateParcelStatus);
router.post('/assign', assignRider);

export default router;
