import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Order from '../../../../models/Order.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Fetch all customers with filtering and pagination
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
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const tier = searchParams.get('tier') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = { role: 'user' };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tier) {
      query.tier = tier;
    }
    
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const customers = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get customer statistics
    const customerStats = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          activeCustomers: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalRevenue: { $sum: '$totalSpent' },
          avgOrderValue: { $avg: { $cond: [{ $gt: ['$totalOrders', 0] }, { $divide: ['$totalSpent', '$totalOrders'] }, 0] } }
        }
      }
    ]);

    // Get tier distribution
    const tierDistribution = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$tier', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent registrations
    const recentRegistrations = await User.find({ role: 'user' })
      .select('firstName lastName email memberSince tier')
      .sort({ memberSince: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        customers: customers.map(customer => ({
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          tier: customer.tier,
          rewardsPoints: customer.rewardsPoints,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          memberSince: customer.memberSince,
          lastLogin: customer.lastLogin,
          isActive: customer.isActive,
          isEmailVerified: customer.isEmailVerified,
          isPhoneVerified: customer.isPhoneVerified,
          newsletter: customer.newsletter,
          marketing: customer.marketing
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats: customerStats.length > 0 ? customerStats[0] : {
          totalCustomers: 0,
          activeCustomers: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        },
        tierDistribution,
        recentRegistrations
      }
    });

  } catch (error) {
    console.error('Admin customers fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
} 