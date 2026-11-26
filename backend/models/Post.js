import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    text: {
      type: String,
      maxlength: [1000, 'Post text cannot exceed 1000 characters'],
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      validate: [
        (val) => val.length <= 4,
        'Cannot upload more than 4 images per post'
      ],
      default: []
    },
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Require at least text or one image
postSchema.pre('validate', function (next) {
  if ((!this.text || this.text.trim().length === 0) && (!this.images || this.images.length === 0)) {
    this.invalidate('text', 'A post must contain either text or at least one image.');
  }
  next();
});

postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
