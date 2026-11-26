import express from 'express';
import {
  discoverFarmers,
  discoverNearby
} from '../controllers/discoverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, discoverFarmers);
router.get('/nearby', protect, discoverNearby);

export default router;
