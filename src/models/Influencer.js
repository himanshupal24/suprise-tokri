import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  handle: { type: String, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  platform: { type: String, enum: ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'Other'], required: true },
  followersNumber: { type: Number, required: true, min: 0 },
  engagementRate: { type: Number, default: 0 }, // percent
  category: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'active', 'inactive', 'rejected'], default: 'pending' },
  commissionRate: { type: Number, default: 0 }, // percent
  totalSales: { type: Number, default: 0 },
  lastCampaign: { type: Date },
  links: [{ label: String, url: String }],
  bio: { type: String },
}, { timestamps: true });

export default mongoose.models.Influencer || mongoose.model('Influencer', influencerSchema);


