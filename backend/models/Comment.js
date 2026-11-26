import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [300, 'Comment cannot exceed 300 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

commentSchema.index({ post: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
