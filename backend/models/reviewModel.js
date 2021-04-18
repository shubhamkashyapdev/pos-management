import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxLength: [100, 'Title should not be greater than 100 characters'],
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// prevent user from adding more than one review per product //
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
