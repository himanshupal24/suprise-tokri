import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true
  },
  personalization: {
    message: String,
    recipientName: String,
    specialInstructions: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'Card', 'Net Banking'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },
  billingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  tracking: {
    number: String,
    carrier: String,
    url: String,
    status: String,
    updates: [{
      status: String,
      location: String,
      timestamp: Date,
      description: String
    }]
  },
  deliveryDate: Date,
  estimatedDelivery: Date,
  notes: String,
  adminNotes: String,
  refundReason: String,
  refundAmount: Number,
  refundDate: Date,
  rewardsEarned: {
    type: Number,
    default: 0
  },
  rewardsUsed: {
    type: Number,
    default: 0
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });
    
    this.orderNumber = `ORD-${year}${month}${day}-${String(orderCount + 1).padStart(3, '0')}`;
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, description = '', updatedBy = null) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    description,
    updatedBy
  });
  return this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.shipping + this.tax - this.discount;
  return this;
};

// Method to add tracking update
orderSchema.methods.addTrackingUpdate = function(status, location, description) {
  this.tracking.updates.push({
    status,
    location,
    timestamp: new Date(),
    description
  });
  this.tracking.status = status;
  return this.save();
};

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
  return {
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    itemCount: this.items.length,
    status: this.status,
    total: this.total
  };
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema); 