import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Address type is required'],
    enum: ['Home', 'Office', 'Parents', 'Other']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'PIN code is required'],
    trim: true,
    match: [/^\d{6}$/, 'PIN code must be 6 digits']
  },
  landmark: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Remove default from other addresses of the same user
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Method to set as default
addressSchema.methods.setAsDefault = async function() {
  // Remove default from other addresses
  await this.constructor.updateMany(
    { user: this.user },
    { isDefault: false }
  );
  
  // Set this as default
  this.isDefault = true;
  return this.save();
};

// Method to get formatted address
addressSchema.methods.getFormattedAddress = function() {
  const parts = [
    this.address,
    this.city,
    this.state,
    this.pincode
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Virtual for full address
addressSchema.virtual('fullAddress').get(function() {
  return this.getFormattedAddress();
});

// Ensure virtual fields are serialized
addressSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.models.Address || mongoose.model('Address', addressSchema); 