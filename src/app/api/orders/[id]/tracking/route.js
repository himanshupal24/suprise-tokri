import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';
import { verifyToken } from '../../../../lib/auth.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('tracking');

    // Find order by ID or tracking number
    let order;
    if (trackingNumber) {
      order = await Order.findOne({ trackingNumber }).populate('user', 'firstName lastName');
    } else {
      order = await Order.findById(id).populate('user', 'firstName lastName');
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Return tracking information
    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A',
        timeline: order.timeline || []
      }
    });

  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status, location, description, timestamp } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Add tracking update
    const trackingUpdate = {
      status,
      location,
      description,
      timestamp: timestamp || new Date()
    };

    order.timeline.push(trackingUpdate);
    order.status = status;
    
    await order.save();

    return NextResponse.json({
      message: 'Tracking update added successfully',
      trackingUpdate
    });

  } catch (error) {
    console.error('Tracking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking information' },
      { status: 500 }
    );
  }
} 