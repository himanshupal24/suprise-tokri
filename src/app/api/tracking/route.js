import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Order from '../../../models/Order.js';

// GET - Public order tracking (by order number)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find order by order number
    const order = await Order.findOne({ orderNumber })
      .populate('items.box', 'name image price')
      .select('-paymentDetails -adminNotes');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If phone is provided, verify it matches
    if (phone && order.shippingAddress.phone !== phone) {
      return NextResponse.json(
        { error: 'Phone number does not match order records' },
        { status: 403 }
      );
    }

    // Create tracking timeline
    const timeline = [];
    
    // Order placed
    timeline.push({
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: order.createdAt,
      completed: true
    });

    // Payment verification
    if (order.paymentStatus === 'verified') {
      timeline.push({
        status: 'payment_verified',
        title: 'Payment Verified',
        description: 'Your payment has been verified',
        timestamp: order.paymentVerifiedAt || order.createdAt,
        completed: true
      });
    }

    // Order confirmed
    if (['confirmed', 'processing', 'shipped', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        timestamp: order.confirmedAt || order.createdAt,
        completed: true
      });
    }

    // Processing
    if (['processing', 'shipped', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being processed and packed',
        timestamp: order.processingAt || order.confirmedAt || order.createdAt,
        completed: true
      });
    }

    // Shipped
    if (['shipped', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        title: 'Shipped',
        description: order.trackingNumber ? 
          `Your order has been shipped. Tracking: ${order.trackingNumber}` :
          'Your order has been shipped',
        timestamp: order.shippedAt,
        completed: true
      });
    }

    // Out for delivery
    if (['out_for_delivery', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        timestamp: order.outForDeliveryAt,
        completed: true
      });
    }

    // Delivered
    if (['delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: order.deliveredAt,
        completed: true
      });
    }

    // Add pending steps
    const allSteps = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentStepIndex = allSteps.indexOf(order.status);
    
    for (let i = currentStepIndex + 1; i < allSteps.length; i++) {
      const step = allSteps[i];
      let title, description;
      
      switch (step) {
        case 'confirmed':
          title = 'Order Confirmation';
          description = 'Waiting for order confirmation';
          break;
        case 'processing':
          title = 'Processing';
          description = 'Order will be processed and packed';
          break;
        case 'shipped':
          title = 'Shipping';
          description = 'Order will be shipped';
          break;
        case 'out_for_delivery':
          title = 'Out for Delivery';
          description = 'Order will be out for delivery';
          break;
        case 'delivered':
          title = 'Delivery';
          description = 'Order will be delivered';
          break;
      }
      
      timeline.push({
        status: step,
        title,
        description,
        timestamp: null,
        completed: false
      });
    }

    const trackingInfo = {
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      },
      items: order.items.map(item => ({
        name: item.box.name,
        image: item.box.image,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      timeline: timeline.sort((a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return new Date(a.timestamp) - new Date(b.timestamp);
      })
    };

    return NextResponse.json({
      success: true,
      data: trackingInfo
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}