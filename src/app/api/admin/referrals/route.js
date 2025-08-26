import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Referral, { ReferralUsage } from '../../../../models/Referral.js';
import User from '../../../../models/User.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Get all referrals with analytics (Admin)
export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status'); // active, inactive, expired
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query = {};

    if (status === 'active') {
      query.isActive = true;
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ];
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'expired') {
      query.expiresAt = { $lt: new Date() };
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const referrals = await Referral.find(query)
      .populate('referrer', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReferrals = await Referral.countDocuments(query);
    const totalPages = Math.ceil(totalReferrals / limit);

    // Get overall statistics
    const overallStats = await ReferralUsage.aggregate([
      {
        $group: {
          _id: null,
          totalUsages: { $sum: 1 },
          totalDiscountGiven: { $sum: '$discountAmount' },
          totalRewardsPaid: { $sum: '$referrerRewardAmount' },
          activeReferrals: { $sum: 1 }
        }
      }
    ]);

    const stats = overallStats[0] || {
      totalUsages: 0,
      totalDiscountGiven: 0,
      totalRewardsPaid: 0,
      activeReferrals: 0
    };

    // Get top performing referrals
    const topReferrals = await ReferralUsage.aggregate([
      {
        $group: {
          _id: '$referral',
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: '$discountAmount' },
          totalRewards: { $sum: '$referrerRewardAmount' }
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'referrals',
          localField: '_id',
          foreignField: '_id',
          as: 'referral'
        }
      },
      { $unwind: '$referral' },
      {
        $lookup: {
          from: 'users',
          localField: 'referral.referrer',
          foreignField: '_id',
          as: 'referrer'
        }
      },
      { $unwind: '$referrer' }
    ]);

    const formattedReferrals = referrals.map(referral => ({
      id: referral._id,
      code: referral.code,
      referrer: {
        id: referral.referrer._id,
        name: `${referral.referrer.firstName} ${referral.referrer.lastName}`,
        email: referral.referrer.email
      },
      isActive: referral.isActive,
      usageCount: referral.usageCount,
      usageLimit: referral.usageLimit,
      reward: referral.reward,
      referrerReward: referral.referrerReward,
      minimumOrderValue: referral.minimumOrderValue,
      description: referral.description,
      expiresAt: referral.expiresAt,
      isExpired: referral.isExpired,
      isValid: referral.isValid,
      createdBy: referral.createdBy ? {
        name: `${referral.createdBy.firstName} ${referral.createdBy.lastName}`,
        email: referral.createdBy.email
      } : null,
      createdAt: referral.createdAt
    }));

    return NextResponse.json({
      referrals: formattedReferrals,
      pagination: {
        currentPage: page,
        totalPages,
        totalReferrals,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      statistics: {
        ...stats,
        activeReferralsCount: await Referral.countDocuments({ isActive: true })
      },
      topReferrals: topReferrals.map(item => ({
        code: item.referral.code,
        referrer: `${item.referrer.firstName} ${item.referrer.lastName}`,
        usageCount: item.usageCount,
        totalDiscount: item.totalDiscount,
        totalRewards: item.totalRewards
      }))
    });

  } catch (error) {
    console.error('Admin get referrals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

// POST - Create referral program (Admin)
export async function POST(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const body = await request.json();
    const {
      userId,
      customCode,
      description,
      reward,
      referrerReward,
      minimumOrderValue = 0,
      usageLimit,
      expiresAt
    } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!reward || !reward.type || !reward.value) {
      return NextResponse.json(
        { error: 'Reward configuration is required' },
        { status: 400 }
      );
    }

    if (!referrerReward || !referrerReward.type || !referrerReward.value) {
      return NextResponse.json(
        { error: 'Referrer reward configuration is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate referral code
    const code = await Referral.generateCode(customCode);

    // Create referral
    const referral = new Referral({
      referrer: userId,
      code,
      description: description || `Referral code for ${user.firstName} ${user.lastName}`,
      reward,
      referrerReward,
      minimumOrderValue,
      usageLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: request.adminId // Set by requireAdmin middleware
    });

    await referral.save();

    // Populate for response
    await referral.populate('referrer', 'firstName lastName email');

    return NextResponse.json({
      message: 'Referral program created successfully',
      referral: {
        id: referral._id,
        code: referral.code,
        referrer: {
          id: referral.referrer._id,
          name: `${referral.referrer.firstName} ${referral.referrer.lastName}`,
          email: referral.referrer.email
        },
        description: referral.description,
        reward: referral.reward,
        referrerReward: referral.referrerReward,
        minimumOrderValue: referral.minimumOrderValue,
        usageLimit: referral.usageLimit,
        expiresAt: referral.expiresAt,
        createdAt: referral.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create referral error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Referral code already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create referral program' },
      { status: 500 }
    );
  }
}