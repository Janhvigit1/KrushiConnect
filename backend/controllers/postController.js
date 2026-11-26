import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Follow from '../models/Follow.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: 'You can upload a maximum of 4 images per post'
        });
      }
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    if ((!text || text.trim().length === 0) && images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A post must contain either text or at least one image'
      });
    }

    if (text && text.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Post text cannot exceed 1000 characters'
      });
    }

    const post = await Post.create({
      author: req.user._id,
      text: text ? text.trim() : '',
      images
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar village district state crops'
    );

    res.status(201).json({
      success: true,
      post: {
        ...populatedPost.toObject(),
        hasLiked: false
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get home feed posts (own posts + followed farmers)
// @route   GET /api/posts/feed
// @access  Private
export const getFeedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get IDs of users followed by current user
    const follows = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = follows.map((f) => f.following);

    // Include self in feed
    const authorIds = [req.user._id, ...followingIds];

    const totalPosts = await Post.countDocuments({ author: { $in: authorIds } });
    const posts = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar village district state crops');

    // Check likes for current user
    const postIds = posts.map((p) => p._id);
    const userLikes = await Like.find({
      post: { $in: postIds },
      user: req.user._id
    });
    const likedPostIdSet = new Set(userLikes.map((l) => l.post.toString()));

    const postsWithLikes = posts.map((p) => ({
      ...p.toObject(),
      hasLiked: likedPostIdSet.has(p._id.toString())
    }));

    res.status(200).json({
      success: true,
      count: postsWithLikes.length,
      total: totalPosts,
      page,
      pages: Math.ceil(totalPosts / limit) || 1,
      posts: postsWithLikes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name avatar village district state crops'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeRecord = await Like.findOne({
      post: post._id,
      user: req.user._id
    });

    res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        hasLiked: !!likeRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own posts'
      });
    }

    // Cascade delete likes and comments
    await Promise.all([
      Like.deleteMany({ post: post._id }),
      Comment.deleteMany({ post: post._id }),
      Post.findByIdAndDelete(post._id)
    ]);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
