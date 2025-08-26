import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';
import { requireAdmin } from '../../../../lib/auth.js';

// POST - Verify payment (Admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const body = await request.json();
    const { orderId, status, adminNotes, transactionId } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "verified" or "rejected"' },
        { status: 400 }
      );
    }

    // Find and update order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update payment status
    order.paymentStatus = status;
    order.paymentVerifiedAt = new Date();
    order.adminNotes = adminNotes || '';
    
    if (transactionId) {
      order.transactionId = transactionId;
    }

    // Update order status based on payment verification
    if (status === 'verified') {
      order.status = 'confirmed';
      order.confirmedAt = new Date();
    } else if (status === 'rejected') {
      order.status = 'payment_failed';
      // Restore stock for rejected payments
      for (const item of order.items) {
        await Box.findByIdAndUpdate(
          item.box,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    await order.save();

    // Populate for response
    await order.populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'items.box', select: 'name image price' }
    ]);

    return NextResponse.json({
      message: `Payment ${status} successfully`,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentVerifiedAt: order.paymentVerifiedAt,
        customer: `${order.user.firstName} ${order.user.lastName}`,
        total: order.total,
        adminNotes: order.adminNotes
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// GET - Get pending payment verifications (Admin only)
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
    const status = searchParams.get('status') || 'awaiting_verification';

    const skip = (page - 1) * limit;

    // Get orders with pending payment verification
    const orders = await Order.find({ paymentStatus: status })
      .populate('user', 'firstName lastName email phone')
      .populate('items.box', 'name image price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ paymentStatus: status });
    const totalPages = Math.ceil(totalOrders / limit);

    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.items.map(item => ({
        name: item.box.name,
        image: item.box.image,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      paymentProof: order.paymentProof,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      adminNotes: order.adminNotes
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get pending payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending payments' },
      { status: 500 }
    );
  }
}