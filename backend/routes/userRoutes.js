import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar
} from '../controllers/userController.js';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from '../controllers/followController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/avatar', protect, uploadMedia.single('avatar'), uploadAvatar);

// Follow / Unfollow / Lists
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);

export default router;
