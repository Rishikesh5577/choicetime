import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ user: 1, productId: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ status: 1 });

reviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

