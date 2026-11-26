import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Post from '../models/Post.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    // Check if the requesting user is following this farmer
    let isFollowing = false;
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      const followRecord = await Follow.findOne({
        follower: req.user._id,
        following: user._id
      });
      isFollowing = !!followRecord;
    }

    // Fetch user's posts
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar village district state');

    const safeUser = user.toSafeObject();
    safeUser.isFollowing = isFollowing;
    safeUser.posts = posts;

    res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farmer profile
// @route   PUT /api/users/:id
// @access  Private (Owner only)
export const updateUserProfile = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own profile'
      });
    }

    const { name, bio, village, district, state, crops, latitude, longitude } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (village) updates.village = village.trim();
    if (district) updates.district = district.trim();
    if (state) updates.state = state.trim();

    if (crops) {
      if (Array.isArray(crops)) {
        updates.crops = crops.map((c) => c.trim()).filter(Boolean);
      } else if (typeof crops === 'string') {
        updates.crops = crops.split(',').map((c) => c.trim()).filter(Boolean);
      }
    }

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile avatar
// @route   POST /api/users/:id/avatar
// @access  Private (Owner only)
export const uploadAvatar = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only change your own photo'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please choose an image file to upload'
      });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      avatar: avatarUrl,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};
