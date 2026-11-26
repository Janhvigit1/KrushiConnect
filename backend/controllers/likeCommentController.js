import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingLike = await Like.findOne({
      post: post._id,
      user: req.user._id
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this post'
      });
    }

    await Like.create({
      post: post._id,
      user: req.user._id
    });

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      likesCount: updatedPost.likesCount,
      hasLiked: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const deletedLike = await Like.findOneAndDelete({
      post: post._id,
      user: req.user._id
    });

    if (!deletedLike) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this post yet'
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { $inc: { likesCount: -1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      likesCount: Math.max(0, updatedPost.likesCount),
      hasLiked: false
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', 'name avatar village district state');

    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty'
      });
    }

    if (text.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 300 characters'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text: text.trim()
    });

    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name avatar village district state'
    );

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Author only)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own comments'
      });
    }

    await Comment.findByIdAndDelete(comment._id);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
