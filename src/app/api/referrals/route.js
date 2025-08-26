import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Referral, { ReferralUsage } from '../../../models/Referral.js';
import User from '../../../models/User.js';
import { verifyToken, requireAdmin } from '../../../lib/auth.js';

// GET - Get user's referrals or validate referral code
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const validate = searchParams.get('validate');
    const orderValue = parseFloat(searchParams.get('orderValue'));

    // Public referral code validation
    if (code && validate === 'true') {
      try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        let userId = null;
        
        if (token) {
          const decoded = verifyToken(token);
          userId = decoded?.userId;
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'Authentication required for referral validation' },
            { status: 401 }
          );
        }

        const validation = await Referral.validateAndApply(code, userId, orderValue || 0);
        
        return NextResponse.json({
          valid: true,
          referral: {
            code: validation.referral.code,
            description: validation.referral.description,
            discountAmount: validation.discountAmount,
            referrer: validation.referral.referrer.firstName
          }
        });
      } catch (error) {
        return NextResponse.json({
          valid: false,
          error: error.message
        });
      }
    }

    // Get user's referrals (requires authentication)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's referral codes
    const referrals = await Referral.find({ referrer: decoded.userId })
      .sort({ createdAt: -1 });

    // Get referral usage statistics
    const usageStats = await ReferralUsage.aggregate([
      {
        $match: { referrer: decoded.userId }
      },
      {
        $group: {
          _id: null,
          totalUsages: { $sum: 1 },
          totalDiscountGiven: { $sum: '$discountAmount' },
          totalRewardEarned: { $sum: '$referrerRewardAmount' },
          pendingReward: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                '$referrerRewardAmount',
                0
              ]
            }
          },
          confirmedReward: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'confirmed'] },
                '$referrerRewardAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    const stats = usageStats[0] || {
      totalUsages: 0,
      totalDiscountGiven: 0,
      totalRewardEarned: 0,
      pendingReward: 0,
      confirmedReward: 0
    };

    const formattedReferrals = referrals.map(referral => ({
      id: referral._id,
      code: referral.code,
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
      createdAt: referral.createdAt
    }));

    return NextResponse.json({
      referrals: formattedReferrals,
      statistics: stats
    });

  } catch (error) {
    console.error('Get referrals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

// POST - Create referral code (User can create their own)
export async function POST(request) {
  try {
    await connectDB();
    
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customCode, description } = body;

    // Check if user already has an active referral code
    const existingReferral = await Referral.findOne({
      referrer: decoded.userId,
      isActive: true
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: 'You already have an active referral code' },
        { status: 409 }
      );
    }

    // Generate referral code
    const code = await Referral.generateCode(customCode);

    // Create referral with default settings
    const referral = new Referral({
      referrer: decoded.userId,
      code,
      description: description || `${decoded.firstName || 'User'}'s referral code`,
      reward: {
        type: 'percentage',
        value: 10, // 10% discount for referee
        maxAmount: 500 // Maximum ₹500 discount
      },
      referrerReward: {
        type: 'points',
        value: 100 // 100 points for referrer
      },
      minimumOrderValue: 299 // Minimum ₹299 order
    });

    await referral.save();

    return NextResponse.json({
      message: 'Referral code created successfully',
      referral: {
        id: referral._id,
        code: referral.code,
        description: referral.description,
        reward: referral.reward,
        referrerReward: referral.referrerReward,
        minimumOrderValue: referral.minimumOrderValue
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create referral error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Referral code already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create referral code' },
      { status: 500 }
    );
  }
}