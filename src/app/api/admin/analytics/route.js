import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Order from '../../../../models/Order.js';
import Box from '../../../../models/Box.js';
import Review from '../../../../models/Review.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Advanced analytics
export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const type = searchParams.get('type') || 'overview'; // overview, sales, customers, products

    // Calculate date ranges
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let analytics = {};

    if (type === 'overview' || type === 'all') {
      // Revenue analytics
      const revenueData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Conversion funnel
      const totalVisitors = await User.countDocuments({
        createdAt: { $gte: startDate }
      });
      
      const usersWithCart = await User.countDocuments({
        createdAt: { $gte: startDate },
        'cart.0': { $exists: true }
      });
      
      const usersWithOrders = await Order.distinct('user', {
        createdAt: { $gte: startDate }
      });

      analytics.overview = {
        revenueData,
        conversionFunnel: {
          visitors: totalVisitors,
          addedToCart: usersWithCart,
          purchased: usersWithOrders.length,
          conversionRate: totalVisitors > 0 ? (usersWithOrders.length / totalVisitors * 100).toFixed(2) : 0
        }
      };
    }

    if (type === 'sales' || type === 'all') {
      // Sales by category
      const salesByCategory = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'boxes',
            localField: 'items.box',
            foreignField: '_id',
            as: 'boxDetails'
          }
        },
        { $unwind: '$boxDetails' },
        {
          $group: {
            _id: '$boxDetails.category',
            revenue: { $sum: '$items.total' },
            quantity: { $sum: '$items.quantity' },
            orders: { $addToSet: '$_id' }
          }
        },
        {
          $project: {
            category: '$_id',
            revenue: 1,
            quantity: 1,
            orderCount: { $size: '$orders' }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      // Payment method distribution
      const paymentMethods = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        }
      ]);

      // Order status distribution
      const orderStatuses = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      analytics.sales = {
        salesByCategory,
        paymentMethods,
        orderStatuses
      };
    }

    if (type === 'customers' || type === 'all') {
      // Customer segments
      const customerSegments = await User.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'user',
            as: 'orders'
          }
        },
        {
          $addFields: {
            orderCount: { $size: '$orders' },
            totalSpent: { $sum: '$orders.total' }
          }
        },
        {
          $bucket: {
            groupBy: '$totalSpent',
            boundaries: [0, 500, 1000, 2000, 5000, Infinity],
            default: 'Unknown',
            output: {
              count: { $sum: 1 },
              avgOrderValue: { $avg: '$totalSpent' }
            }
          }
        }
      ]);

      // New vs returning customers
      const newCustomers = await User.countDocuments({
        createdAt: { $gte: startDate }
      });

      const returningCustomers = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$user',
            orderCount: { $sum: 1 }
          }
        },
        {
          $match: { orderCount: { $gt: 1 } }
        },
        {
          $count: 'returningCustomers'
        }
      ]);

      // Top customers
      const topCustomers = await User.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'user',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalSpent: { $sum: '$orders.total' },
            orderCount: { $size: '$orders' }
          }
        },
        { $match: { totalSpent: { $gt: 0 } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            email: 1,
            totalSpent: 1,
            orderCount: 1,
            tier: 1,
            lastOrderDate: { $max: '$orders.createdAt' }
          }
        }
      ]);

      analytics.customers = {
        customerSegments,
        newCustomers,
        returningCustomers: returningCustomers[0]?.returningCustomers || 0,
        topCustomers
      };
    }

    if (type === 'products' || type === 'all') {
      // Product performance
      const productPerformance = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.box',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.total' },
            orderCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'boxes',
            localField: '_id',
            foreignField: '_id',
            as: 'box'
          }
        },
        { $unwind: '$box' },
        {
          $project: {
            name: '$box.name',
            category: '$box.category',
            price: '$box.price',
            totalSold: 1,
            revenue: 1,
            orderCount: 1,
            rating: '$box.rating',
            reviewCount: '$box.reviewCount'
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 20 }
      ]);

      // Low stock alerts
      const lowStockProducts = await Box.find({
        stock: { $lt: 10 },
        isActive: true
      }).select('name category stock price').sort({ stock: 1 }).limit(10);

      // Review analytics
      const reviewStats = await Review.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        },
        {
          $project: {
            totalReviews: 1,
            avgRating: { $round: ['$avgRating', 1] },
            ratingDistribution: {
              5: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    cond: { $eq: ['$$this', 5] }
                  }
                }
              },
              4: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    cond: { $eq: ['$$this', 4] }
                  }
                }
              },
              3: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    cond: { $eq: ['$$this', 3] }
                  }
                }
              },
              2: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    cond: { $eq: ['$$this', 2] }
                  }
                }
              },
              1: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    cond: { $eq: ['$$this', 1] }
                  }
                }
              }
            }
          }
        }
      ]);

      analytics.products = {
        productPerformance,
        lowStockProducts,
        reviewStats: reviewStats[0] || {
          totalReviews: 0,
          avgRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      };
    }

    return NextResponse.json({
      success: true,
      period,
      type,
      data: analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}