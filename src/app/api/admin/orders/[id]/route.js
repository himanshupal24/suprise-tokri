import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Order from '../../../../../models/Order.js';
import { requireAdmin } from '../../../../../lib/auth.js';

// GET - Fetch single order by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.box', 'name price category');
      
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Admin order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order status and details
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    
    const {
      status,
      paymentStatus,
      tracking,
      deliveryDate,
      estimatedDelivery,
      notes,
      adminNotes,
      refundReason,
      refundAmount
    } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    if (status && status !== order.status) {
      await order.updateStatus(status, adminNotes || 'Status updated by admin');
    }

    // Update other fields
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
    if (tracking !== undefined) order.tracking = tracking;
    if (deliveryDate !== undefined) order.deliveryDate = deliveryDate;
    if (estimatedDelivery !== undefined) order.estimatedDelivery = estimatedDelivery;
    if (notes !== undefined) order.notes = notes;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (refundReason !== undefined) order.refundReason = refundReason;
    if (refundAmount !== undefined) order.refundAmount = refundAmount;

    // If refunding, update payment status
    if (refundAmount && refundAmount > 0) {
      order.paymentStatus = 'Refunded';
      order.refundDate = new Date();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// POST - Add tracking update
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    
    const { status, location, description } = body;

    if (!status || !description) {
      return NextResponse.json(
        { error: 'Status and description are required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Add tracking update
    await order.addTrackingUpdate(status, location, description);

    return NextResponse.json({
      success: true,
      message: 'Tracking update added successfully',
      data: order
    });

  } catch (error) {
    console.error('Admin tracking update error:', error);
    return NextResponse.json(
      { error: 'Failed to add tracking update' },
      { status: 500 }
    );
  }
} 