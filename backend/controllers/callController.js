import Call from '../models/Call.js';
import { getIceServers } from '../config/webrtc.js';

// @desc    Get WebRTC ICE servers (STUN/TURN)
// @route   GET /api/calls/ice-servers
// @access  Private
export const getIceServerConfig = async (req, res, next) => {
  try {
    const iceServers = getIceServers();
    res.status(200).json({
      success: true,
      iceServers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's call history
// @route   GET /api/calls/history
// @access  Private
export const getCallHistory = async (req, res, next) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user._id }, { receiver: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('caller', 'name avatar village district state')
      .populate('receiver', 'name avatar village district state');

    res.status(200).json({
      success: true,
      count: calls.length,
      calls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log or complete a call
// @route   POST /api/calls/log
// @access  Private
export const logCall = async (req, res, next) => {
  try {
    const { receiverId, callType, status, duration } = req.body;

    const call = await Call.create({
      caller: req.user._id,
      receiver: receiverId,
      callType: callType || 'audio',
      status: status || 'ended',
      duration: duration || 0,
      endedAt: new Date()
    });

    const populatedCall = await Call.findById(call._id)
      .populate('caller', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      call: populatedCall
    });
  } catch (error) {
    next(error);
  }
};
