import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Order from '../../../../../models/Order.js';
import { verifyToken } from '../../../../../lib/auth.js';

export async function GET(request, { params }) {
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

    const { id } = params;

    // Find order and ensure it belongs to the authenticated user
    const order = await Order.findOne({
      _id: id,
      user: decoded.userId
    }).populate('items.box', 'name image price description');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        status: order.status,
        items: order.items.map(item => ({
          name: item.box.name,
          description: item.box.description,
          quantity: item.quantity,
          price: `₹${item.price}`,
          image: item.box.image
        })),
        subtotal: `₹${order.subtotal}`,
        shipping: `₹${order.shipping}`,
        tax: `₹${order.tax}`,
        total: `₹${order.total}`,
        tracking: order.trackingNumber,
        deliveryDate: order.estimatedDelivery,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        timeline: order.timeline || []
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 