import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
wishlistSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist; 