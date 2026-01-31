import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/reviews/health
// @desc    Health check for reviews route
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reviews route is working',
  });
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, productCategory, rating, title, comment, images } = req.body;

    // Validation
    if (!productId || !productCategory || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, productCategory, rating, title, and comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Create review
    const review = await Review.create({
      productId,
      productCategory,
      user: req.user._id,
      userName: req.user.name || 'Anonymous',
      userEmail: req.user.email,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      status: 'approved', // Auto-approve for now, can be changed to 'pending' for moderation
    });

    // Populate user data
    await review.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message,
    });
  }
});

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'newest', limit = 50 } = req.query;

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { helpful: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({
      productId: productId,
      status: 'approved',
    })
      .sort(sortOption)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .lean();

    // Calculate review statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        statistics: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
});

// @route   PUT /api/reviews/:reviewId/helpful
// @desc    Mark a review as helpful
// @access  Private
router.put('/:reviewId/helpful', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user already marked as helpful
    const alreadyHelpful = review.helpfulUsers.some(
      userId => userId.toString() === req.user._id.toString()
    );

    if (alreadyHelpful) {
      // Remove helpful
      review.helpfulUsers = review.helpfulUsers.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful
      review.helpfulUsers.push(req.user._id);
      review.helpful += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: {
        helpful: review.helpful,
        isHelpful: !alreadyHelpful,
      },
    });
  } catch (error) {
    console.error('Error updating helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating helpful status',
      error: error.message,
    });
  }
});

export default router;

