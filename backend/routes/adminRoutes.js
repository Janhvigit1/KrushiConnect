import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  toggleUserVerification,
  updateUserRole,
  deleteUserByAdmin,
  getAllPostsAdmin,
  deletePostByAdmin,
  getAllStoriesAdmin,
  deleteStoryByAdmin
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All Admin routes require valid JWT AND role === 'admin'
router.use(protect, isAdmin);

// Metrics & Stats
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/verify', toggleUserVerification);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

// Content Moderation (Posts)
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:id', deletePostByAdmin);

// Stories Moderation
router.get('/stories', getAllStoriesAdmin);
router.delete('/stories/:id', deleteStoryByAdmin);

export default router;
