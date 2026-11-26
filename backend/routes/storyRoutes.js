import express from 'express';
import {
  createStory,
  getStoriesFeed,
  getStoryById,
  markStoryViewed,
  deleteStory
} from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadMedia.single('media'), createStory);
router.get('/feed', protect, getStoriesFeed);
router.get('/:id', protect, getStoryById);
router.post('/:id/view', protect, markStoryViewed);
router.delete('/:id', protect, deleteStory);

export default router;
