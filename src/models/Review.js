import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String, // Cloudinary URLs
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported'],
    default: 'active'
  },
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ box: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Ensure one review per user per box
reviewSchema.index({ user: 1, box: 1 }, { unique: true });

// Update box rating when review is saved
reviewSchema.post('save', async function(doc) {
  try {
    const Box = mongoose.model('Box');
    const Review = mongoose.model('Review');
    
    const stats = await Review.aggregate([
      { $match: { box: doc.box, status: 'active' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length > 0) {
      await Box.findByIdAndUpdate(doc.box, {
        rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: stats[0].reviewCount
      });
    }
  } catch (error) {
    console.error('Error updating box rating:', error);
  }
});

// Update box rating when review is deleted
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const Box = mongoose.model('Box');
      const Review = mongoose.model('Review');
      
      const stats = await Review.aggregate([
        { $match: { box: doc.box, status: 'active' } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
          }
        }
      ]);
      
      if (stats.length > 0) {
        await Box.findByIdAndUpdate(doc.box, {
          rating: Math.round(stats[0].avgRating * 10) / 10,
          reviewCount: stats[0].reviewCount
        });
      } else {
        await Box.findByIdAndUpdate(doc.box, {
          rating: 0,
          reviewCount: 0
        });
      }
    } catch (error) {
      console.error('Error updating box rating after deletion:', error);
    }
  }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;