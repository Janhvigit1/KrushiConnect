import express from 'express';
import {
  createPost,
  getFeedPosts,
  getPostById,
  deletePost
} from '../controllers/postController.js';
import {
  likePost,
  unlikePost,
  getComments,
  addComment,
  deleteComment
} from '../controllers/likeCommentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadMedia.array('images', 4), createPost);
router.get('/feed', protect, getFeedPosts);
router.get('/:id', protect, getPostById);
router.delete('/:id', protect, deletePost);

// Likes
router.post('/:id/like', protect, likePost);
router.delete('/:id/like', protect, unlikePost);

// Comments
router.get('/:id/comments', protect, getComments);
router.post('/:id/comments', protect, addComment);

export default router;
