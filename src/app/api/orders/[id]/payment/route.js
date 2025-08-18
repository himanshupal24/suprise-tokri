import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Order from '../../../../../models/Order.js';
import { authenticateToken } from '../../../../../lib/auth.js';
import { uploadImage } from '../../../../../lib/cloudinary.js';

// POST - Upload payment proof
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Check authentication
    const authResult = await authenticateToken(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    
    const {
      transactionId,
      paymentMethod,
      paymentAmount,
      paymentDate,
      screenshotUrl,
      notes
    } = body;

    // Validation
    if (!transactionId || !paymentMethod || !paymentAmount || !screenshotUrl) {
      return NextResponse.json(
        { error: 'Transaction ID, payment method, amount, and screenshot are required' },
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

    // Check if order belongs to authenticated user
    if (order.user.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    // Check if payment proof already exists
    if (order.paymentProof) {
      return NextResponse.json(
        { error: 'Payment proof already uploaded for this order' },
        { status: 409 }
      );
    }

    // Upload screenshot to Cloudinary if it's a base64 string
    let uploadedScreenshot = screenshotUrl;
    if (screenshotUrl.startsWith('data:image')) {
      try {
        const uploadResult = await uploadImage(screenshotUrl, 'payment-proofs');
        uploadedScreenshot = uploadResult.url;
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to upload payment screenshot' },
          { status: 500 }
        );
      }
    }

    // Update order with payment proof
    order.paymentProof = {
      transactionId,
      paymentMethod,
      paymentAmount: parseFloat(paymentAmount),
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      screenshotUrl: uploadedScreenshot,
      notes: notes || '',
      uploadedAt: new Date(),
      status: 'Pending Verification'
    };

    // Update order status to payment pending verification
    if (order.status === 'Pending') {
      order.status = 'Payment Pending Verification';
      await order.updateStatus('Payment Pending Verification', 'Payment proof uploaded, awaiting verification');
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentProof: order.paymentProof
      }
    });

  } catch (error) {
    console.error('Payment proof upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}

// GET - Get payment proof for an order
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Check authentication
    const authResult = await authenticateToken(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order belongs to authenticated user
    if (order.user.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentProof: order.paymentProof,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error) {
    console.error('Payment proof fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment proof' },
      { status: 500 }
    );
  }
} 