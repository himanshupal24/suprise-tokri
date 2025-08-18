import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Fetch all orders with filtering and pagination
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
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Calculate summary stats
    const totalRevenue = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const statusStats = await Order.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const paymentStats = await Order.aggregate([
      { $match: query },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          user: order.user,
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          discount: order.discount,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          shippingAddress: order.shippingAddress,
          tracking: order.tracking,
          deliveryDate: order.deliveryDate,
          estimatedDelivery: order.estimatedDelivery,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        summary: {
          totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
          statusStats,
          paymentStats
        }
      }
    });

  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 