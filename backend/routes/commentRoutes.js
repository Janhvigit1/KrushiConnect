import express from 'express';
import { deleteComment } from '../controllers/likeCommentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.delete('/:id', protect, deleteComment);

export default router;
