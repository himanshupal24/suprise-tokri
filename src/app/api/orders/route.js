import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Order from '../../../models/Order.js';
import { verifyToken } from '../../../lib/auth.js';

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
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      paymentDetails,
      subtotal,
      shipping,
      tax,
      total,
      notes 
    } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Create new order
    const order = new Order({
      user: decoded.userId,
      items: items.map(item => ({
        box: item.boxId,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      shipping,
      tax,
      total,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Populate box details for response
    await order.populate('items.box', 'name image price');

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
} 