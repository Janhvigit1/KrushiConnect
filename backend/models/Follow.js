import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Prevent self-follow
followSchema.pre('validate', function (next) {
  if (this.follower && this.following && this.follower.toString() === this.following.toString()) {
    this.invalidate('following', 'Farmers cannot follow themselves.');
  }
  next();
});

const Follow = mongoose.model('Follow', followSchema);
export default Follow;
