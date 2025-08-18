  import mongoose from 'mongoose';

  const boxSchema = new mongoose.Schema({
    name: {
      type: String,
      // required: [true, 'Box name is required'],
      trim: true
    },
    slug: {
      type: String,
      // required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      // required: [true, 'Description is required']
    },
    shortDescription: {
      type: String,
      maxlength: 200
    },
    price: {
      type: Number,
      // required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    category: {
      type: String,
      // required: [true, 'Category is required'],
      enum: ['Snacks', 'Premium', 'Mini', 'Gift']
    },
    occasion: {
      type: String,
      enum: ['Birthday', 'Valentine', 'Friendship', 'Diwali', 'Holi', 'New Year', 'Anniversary', 'Graduation', 'Wedding', 'Other'],
      // required: [true, 'Occasion is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex'
    },
    ageGroup: {
      type: String,
      enum: ['kids', 'teens', 'adults', 'all'],
      default: 'all'
    },
    images: [{
      type: String,
      // required: [true, 'At least one image is required']
    }],
    mainImage: {
      type: String,
      // required: [true, 'Main image is required']
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      quantity: {
        type: Number,
        default: 1
      },
      isHidden: {
        type: Boolean,
        default: true
      }
    }],
    totalItems: {
      type: Number,
      // required: [true, 'Total items count is required'],
      min: [1, 'Box must contain at least one item']
    },
    weight: {
      type: Number,
      // required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0
    },
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    seoKeywords: [String],
    estimatedDelivery: {
      type: String, 
      default: '3-5 days'
    },
    returnPolicy: {
      type: String,
      default: '30 days return for damaged items'
    },
    shippingInfo: {
      weight: Number,
      dimensions: String,
      restrictions: [String]
    },
    customization: {
      allowPersonalization: {
        type: Boolean,
        default: false
      },
      personalizationFields: [String],
      maxCharacters: Number
    }
  }, {
    timestamps: true
  });

  // Index for search
  boxSchema.index({ name: 'text', description: 'text', tags: 'text' });

  // Virtual for discount percentage
  boxSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  });

  // Virtual for average rating
  boxSchema.virtual('averageRating').get(function() {
    return this.rating || 0;
  });

  // Method to update stock
  boxSchema.methods.updateStock = function(quantity) {
    this.stock = Math.max(0, this.stock - quantity);
    return this.save();
  };

  // Method to check if in stock
  boxSchema.methods.isInStock = function() {
    return this.stock > 0;
  };

  // Method to update rating
  boxSchema.methods.updateRating = function(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
    return this.save();
  };

  // Ensure virtual fields are serialized
  boxSchema.set('toJSON', {
    virtuals: true
  });

  export default mongoose.models.Box || mongoose.model('Box', boxSchema); 