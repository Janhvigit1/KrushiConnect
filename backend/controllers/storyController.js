import Story from '../models/Story.js';
import Follow from '../models/Follow.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create / upload a story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image or video file for your story'
      });
    }

    const { caption } = req.body;
    const isVideo = req.file.mimetype.startsWith('video');

    const story = await Story.create({
      user: req.user._id,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType: isVideo ? 'video' : 'image',
      caption: caption ? caption.trim() : '',
      viewers: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });

    const populatedStory = await Story.findById(story._id).populate(
      'user',
      'name avatar village district state'
    );

    res.status(201).json({
      success: true,
      story: populatedStory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stories feed (self + followed users)
// @route   GET /api/stories/feed
// @access  Private
export const getStoriesFeed = async (req, res, next) => {
  try {
    const follows = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = follows.map((f) => f.following);
    const authorIds = [req.user._id, ...followingIds];

    // Only unexpired stories
    const stories = await Story.find({
      user: { $in: authorIds },
      expiresAt: { $gt: new Date() }
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar village district state');

    // Group stories by farmer user
    const groupedByUser = {};
    for (const story of stories) {
      const uId = story.user._id.toString();
      if (!groupedByUser[uId]) {
        groupedByUser[uId] = {
          user: story.user,
          stories: [],
          hasUnviewed: false
        };
      }
      const isViewed = story.viewers.some(
        (viewerId) => viewerId.toString() === req.user._id.toString()
      );
      if (!isViewed) {
        groupedByUser[uId].hasUnviewed = true;
      }
      groupedByUser[uId].stories.push({
        ...story.toObject(),
        isViewed
      });
    }

    res.status(200).json({
      success: true,
      usersWithStories: Object.values(groupedByUser)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single story by ID
// @route   GET /api/stories/:id
// @access  Private
export const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('user', 'name avatar village district state')
      .populate('viewers', 'name avatar');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found or expired'
      });
    }

    res.status(200).json({
      success: true,
      story
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark story as viewed
// @route   POST /api/stories/:id/view
// @access  Private
export const markStoryViewed = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found or expired'
      });
    }

    // Add current user to viewers if not already present
    const alreadyViewed = story.viewers.some(
      (v) => v.toString() === req.user._id.toString()
    );

    if (!alreadyViewed) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.status(200).json({
      success: true,
      viewersCount: story.viewers.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private (Owner only)
export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own stories'
      });
    }

    // Try to remove media file from disk
    try {
      const filename = path.basename(story.mediaUrl);
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.warn('Could not remove story file from disk:', fsErr.message);
    }

    await Story.findByIdAndDelete(story._id);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
