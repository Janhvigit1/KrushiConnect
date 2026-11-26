import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    mediaUrl: {
      type: String,
      required: [true, 'Story media is required']
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    },
    caption: {
      type: String,
      maxlength: [200, 'Story caption cannot exceed 200 characters'],
      default: ''
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

// MongoDB TTL index for automatic expiry after 24h
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', storySchema);
export default Story;
