import express from 'express';
import {
  getIceServerConfig,
  getCallHistory,
  logCall
} from '../controllers/callController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ice-servers', protect, getIceServerConfig);
router.get('/history', protect, getCallHistory);
router.post('/log', protect, logCall);

export default router;
