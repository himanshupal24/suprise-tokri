import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Order from '../../../../models/Order.js';
import Box from '../../../../models/Box.js';
import SupportTicket from '../../../../models/SupportTicket.js';
import { requireAdmin } from '../../../../lib/auth.js';

export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    // Get current date and date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month stats
    const currentMonthOrders = await Order.find({
      createdAt: { $gte: startOfMonth }
    });

    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const currentMonthOrdersCount = currentMonthOrders.length;

    // Get last month stats for comparison
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthOrdersCount = lastMonthOrders.length;

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    
    const ordersGrowth = lastMonthOrdersCount > 0 
      ? ((currentMonthOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100 
      : 0;

    // Get total stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top selling boxes
    const topSellingBoxes = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.box',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Populate box details for top sellers
    const topBoxesWithDetails = await Box.populate(topSellingBoxes, {
      path: '_id',
      select: 'name price category'
    });

    // Get pending support tickets
    const pendingTickets = await SupportTicket.find({
      status: { $in: ['Open', 'In Progress'] }
    })
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user registration trend (last 7 days)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          role: 'user'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get revenue trend (last 7 days)
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get category-wise sales
    const categorySales = await Order.aggregate([
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
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const dashboardData = {
      overview: {
        currentMonthRevenue,
        currentMonthOrders: currentMonthOrdersCount,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenueAmount,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: `${order.user.firstName} ${order.user.lastName}`,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      })),
      topSellingBoxes: topBoxesWithDetails.map(item => ({
        name: item._id.name,
        category: item._id.category,
        price: item._id.price,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue
      })),
      pendingTickets: pendingTickets.map(ticket => ({
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        priority: ticket.priority,
        status: ticket.status,
        customer: `${ticket.user.firstName} ${ticket.user.lastName}`,
        createdAt: ticket.createdAt
      })),
      orderStatusDistribution: orderStatusStats.map(stat => ({
        status: stat._id,
        count: stat.count
      })),
      userRegistrations,
      revenueTrend,
      categorySales
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 