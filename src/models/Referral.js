import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 6,
    maxlength: 12
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: null // null means no expiry
  },
  reward: {
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'points'],
      default: 'percentage'
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    maxAmount: {
      type: Number,
      default: null // Maximum discount amount for percentage rewards
    }
  },
  referrerReward: {
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'points'],
      default: 'points'
    },
    value: {
      type: Number,
      required: true,
      min: 0
    }
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin who created the referral program
  }
}, {
  timestamps: true
});

// Referral Usage tracking
const referralUsageSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  referrerRewardAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled'],
    default: 'pending'
  },
  confirmedAt: Date,
  paidAt: Date
}, {
  timestamps: true
});

// Indexes
referralSchema.index({ referrer: 1 });
referralSchema.index({ code: 1 });
referralSchema.index({ isActive: 1 });
referralSchema.index({ expiresAt: 1 });

referralUsageSchema.index({ referral: 1 });
referralUsageSchema.index({ referrer: 1 });
referralUsageSchema.index({ referee: 1 });
referralUsageSchema.index({ order: 1 });
referralUsageSchema.index({ status: 1 });

// Virtual to check if referral is expired
referralSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual to check if referral is valid
referralSchema.virtual('isValid').get(function() {
  if (!this.isActive) return false;
  if (this.isExpired) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  return true;
});

// Static method to generate unique referral code
referralSchema.statics.generateCode = async function(baseCode = null) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    if (baseCode && attempts === 0) {
      // Try the base code first
      code = baseCode.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12);
      if (code.length < 6) {
        // Pad with random characters if too short
        while (code.length < 6) {
          code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      }
    } else {
      // Generate random code
      code = '';
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }
    
    attempts++;
    const existing = await this.findOne({ code });
    if (!existing) break;
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique referral code');
    }
  } while (true);

  return code;
};

// Static method to validate and apply referral
referralSchema.statics.validateAndApply = async function(code, userId, orderValue) {
  const referral = await this.findOne({ 
    code: code.toUpperCase(),
    isActive: true
  }).populate('referrer', 'firstName lastName email');

  if (!referral) {
    throw new Error('Invalid referral code');
  }

  if (referral.isExpired) {
    throw new Error('Referral code has expired');
  }

  if (referral.usageLimit && referral.usageCount >= referral.usageLimit) {
    throw new Error('Referral code usage limit exceeded');
  }

  if (referral.referrer._id.toString() === userId.toString()) {
    throw new Error('Cannot use your own referral code');
  }

  if (orderValue < referral.minimumOrderValue) {
    throw new Error(`Minimum order value of ₹${referral.minimumOrderValue} required`);
  }

  // Check if user has already used this referral code
  const ReferralUsage = mongoose.model('ReferralUsage');
  const existingUsage = await ReferralUsage.findOne({
    referral: referral._id,
    referee: userId
  });

  if (existingUsage) {
    throw new Error('You have already used this referral code');
  }

  // Calculate discount
  let discountAmount = 0;
  switch (referral.reward.type) {
    case 'percentage':
      discountAmount = (orderValue * referral.reward.value) / 100;
      if (referral.reward.maxAmount) {
        discountAmount = Math.min(discountAmount, referral.reward.maxAmount);
      }
      break;
    case 'fixed':
      discountAmount = Math.min(referral.reward.value, orderValue);
      break;
    case 'points':
      discountAmount = 0; // Points don't provide immediate discount
      break;
  }

  return {
    referral,
    discountAmount: Math.round(discountAmount),
    isValid: true
  };
};

// Method to record referral usage
referralSchema.methods.recordUsage = async function(refereeId, orderId, discountAmount) {
  const ReferralUsage = mongoose.model('ReferralUsage');
  
  // Calculate referrer reward
  let referrerRewardAmount = 0;
  switch (this.referrerReward.type) {
    case 'percentage':
      referrerRewardAmount = (discountAmount * this.referrerReward.value) / 100;
      break;
    case 'fixed':
      referrerRewardAmount = this.referrerReward.value;
      break;
    case 'points':
      referrerRewardAmount = this.referrerReward.value;
      break;
  }

  // Create usage record
  const usage = new ReferralUsage({
    referral: this._id,
    referrer: this.referrer,
    referee: refereeId,
    order: orderId,
    discountAmount,
    referrerRewardAmount: Math.round(referrerRewardAmount)
  });

  await usage.save();

  // Update usage count
  this.usageCount += 1;
  await this.save();

  return usage;
};

const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
const ReferralUsage = mongoose.models.ReferralUsage || mongoose.model('ReferralUsage', referralUsageSchema);

export { Referral, ReferralUsage };
export default Referral;