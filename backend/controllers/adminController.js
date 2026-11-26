import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Story from '../models/Story.js';
import Call from '../models/Call.js';
import Message from '../models/Message.js';

// ============================================================================
// KRUSHICONNECT ADMIN & PLATFORM MODERATION CONTROLLER
// Comprehensive control over users, content, stories, and platform metrics
// ============================================================================

// 1. Get Platform Dashboard Overview Metrics
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      verifiedUsers,
      totalPosts,
      totalComments,
      totalLikes,
      totalStories,
      totalCalls,
      totalMessages
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'banned' }),
      User.countDocuments({ isVerified: true }),
      Post.countDocuments(),
      Comment.countDocuments(),
      Like.countDocuments(),
      Story.countDocuments(),
      Call.countDocuments(),
      Message.countDocuments()
    ]);

    // Recent 5 farmers joined
    const recentFarmers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email village district state role status isVerified createdAt avatar');

    // Recent 5 posts
    const recentPosts = await Post.find()
      .populate('author', 'name village district avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: totalUsers - bannedUsers,
        bannedUsers,
        verifiedUsers,
        totalPosts,
        totalComments,
        totalLikes,
        totalStories,
        totalCalls,
        totalMessages
      },
      recentFarmers,
      recentPosts
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get All Farmers with Filtering, Searching and Pagination
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim().length > 0) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { village: { $regex: s, $options: 'i' } },
        { district: { $regex: s, $options: 'i' } },
        { state: { $regex: s, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

// 3. Toggle Ban / Active Status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed: active, banned.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Farmer account not found' });
    }

    // Do not allow banning yourself if super admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Administrators cannot ban their own account' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Farmer account ${status === 'banned' ? 'suspended' : 'activated'} successfully.`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// 4. Toggle Verified Farmer Badge
export const toggleUserVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Farmer account not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Farmer badge ${user.isVerified ? 'verified' : 'unverified'} successfully.`,
      isVerified: user.isVerified
    });
  } catch (error) {
    next(error);
  }
};

// 5. Change Role (Farmer vs Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Allowed: farmer, admin.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Farmer account not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

// 6. Permanently Delete User and Their Content
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    // Delete user's posts, likes, comments, stories
    await Promise.all([
      Post.deleteMany({ author: id }),
      Comment.deleteMany({ author: id }),
      Like.deleteMany({ user: id }),
      Story.deleteMany({ user: id }),
      User.findByIdAndDelete(id)
    ]);

    res.status(200).json({
      success: true,
      message: 'Farmer account and all associated posts/stories permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get All Posts for Moderation
export const getAllPostsAdmin = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (search && search.trim().length > 0) {
      query.text = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email village district avatar role status isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

// 8. Delete Inappropriate Post as Admin
export const deletePostByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Delete associated comments and likes
    await Promise.all([
      Comment.deleteMany({ post: id }),
      Like.deleteMany({ post: id }),
      Post.findByIdAndDelete(id)
    ]);

    res.status(200).json({
      success: true,
      message: 'Post and all associated comments removed by Admin successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 9. Get Active 24-hr Stories for Moderation
export const getAllStoriesAdmin = async (req, res, next) => {
  try {
    const stories = await Story.find()
      .populate('user', 'name village district avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories
    });
  } catch (error) {
    next(error);
  }
};

// 10. Purge Inappropriate Story
export const deleteStoryByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Story.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Story removed by Admin successfully.'
    });
  } catch (error) {
    next(error);
  }
};
