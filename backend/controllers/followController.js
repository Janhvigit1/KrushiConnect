import Follow from '../models/Follow.js';
import User from '../models/User.js';

// @desc    Follow a farmer
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: targetUserId
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this farmer'
      });
    }

    await Follow.create({
      follower: req.user._id,
      following: targetUserId
    });

    // Update counts
    await Promise.all([
      User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } }),
      User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } })
    ]);

    res.status(200).json({
      success: true,
      message: `Now following ${targetUser.name}`,
      isFollowing: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a farmer
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    const followRecord = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: targetUserId
    });

    if (!followRecord) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this farmer'
      });
    }

    // Decrement counts
    await Promise.all([
      User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } }),
      User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } })
    ]);

    res.status(200).json({
      success: true,
      message: 'Unfollowed farmer successfully',
      isFollowing: false
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer's followers
// @route   GET /api/users/:id/followers
// @access  Private
export const getFollowers = async (req, res, next) => {
  try {
    const followers = await Follow.find({ following: req.params.id })
      .populate('follower', 'name avatar village district state crops')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: followers.length,
      followers: followers.map((f) => f.follower)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer's following list
// @route   GET /api/users/:id/following
// @access  Private
export const getFollowing = async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.params.id })
      .populate('following', 'name avatar village district state crops')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: following.length,
      following: following.map((f) => f.following)
    });
  } catch (error) {
    next(error);
  }
};
