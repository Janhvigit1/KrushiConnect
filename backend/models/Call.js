import mongoose from 'mongoose';

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    callType: {
      type: String,
      enum: ['audio', 'video'],
      required: true,
      default: 'audio'
    },
    status: {
      type: String,
      enum: [
        'calling',
        'ringing',
        'accepted',
        'connected',
        'rejected',
        'missed',
        'ended'
      ],
      default: 'calling'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    },
    duration: {
      type: Number, // In seconds
      default: 0
    }
  },
  {
    timestamps: true
  }
);

callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });

const Call = mongoose.model('Call', callSchema);
export default Call;
