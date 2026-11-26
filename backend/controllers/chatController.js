import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all conversations for logged in user
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .sort({ updatedAt: -1 })
      .populate('participants', 'name avatar village district state')
      .populate('lastMessage');

    // Calculate unread count for each conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user._id },
          readAt: null
        });

        // Other participant
        const otherParticipant = conv.participants.find(
          (p) => p._id.toString() !== req.user._id.toString()
        );

        return {
          ...conv.toObject(),
          unreadCount,
          otherParticipant
        };
      })
    );

    res.status(200).json({
      success: true,
      count: result.length,
      conversations: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or get existing 1-to-1 conversation
// @route   POST /api/conversations
// @access  Private
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient farmer ID is required'
      });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot start a conversation with yourself'
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient farmer not found'
      });
    }

    // Find if conversation already exists between the two users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId], $size: 2 }
    })
      .populate('participants', 'name avatar village district state')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId]
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar village district state');
    }

    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        otherParticipant,
        unreadCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Ensure requesting user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments({ conversation: conversation._id });

    // Fetch messages in chronological order
    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar');

    // Mark unread messages sent by others as read
    await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        readAt: null
      },
      {
        $set: { readAt: new Date() }
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      total: totalMessages,
      page,
      pages: Math.ceil(totalMessages / limit) || 1,
      messages: messages.reverse() // Reverse to return in chronological ascending order
    });
  } catch (error) {
    next(error);
  }
};
