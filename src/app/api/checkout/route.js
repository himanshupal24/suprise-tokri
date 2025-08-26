import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Box from '../../../models/Box.js';
import Order from '../../../models/Order.js';
import { verifyToken } from '../../../lib/auth.js';
import { sendEmail } from '../../../lib/email.js';

// POST - Process checkout
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
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      paymentDetails,
      useCartItems = true,
      customItems = [],
      notes,
      referralCode 
    } = body;

    // Validation
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

    // Get user with cart
    const user = await User.findById(decoded.userId).populate({
      path: 'cart.box',
      select: 'name price image category isActive stock'
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let orderItems = [];
    
    if (useCartItems) {
      // Use items from user's cart
      const activeCartItems = user.cart.filter(item => item.box && item.box.isActive);
      
      if (activeCartItems.length === 0) {
        return NextResponse.json(
          { error: 'Cart is empty' },
          { status: 400 }
        );
      }

      // Check stock availability for all items
      for (const cartItem of activeCartItems) {
        if (cartItem.box.stock < cartItem.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${cartItem.box.name}. Only ${cartItem.box.stock} available.` },
            { status: 400 }
          );
        }
      }

      orderItems = activeCartItems.map(item => ({
        box: item.box._id,
        quantity: item.quantity,
        price: item.box.price,
        total: item.box.price * item.quantity
      }));
    } else {
      // Use custom items (for direct purchase)
      if (!customItems || customItems.length === 0) {
        return NextResponse.json(
          { error: 'No items specified for checkout' },
          { status: 400 }
        );
      }

      // Validate custom items
      for (const item of customItems) {
        const box = await Box.findById(item.boxId);
        if (!box || !box.isActive) {
          return NextResponse.json(
            { error: `Box not found or not available` },
            { status: 404 }
          );
        }
        
        if (box.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${box.name}. Only ${box.stock} available.` },
            { status: 400 }
          );
        }

        orderItems.push({
          box: box._id,
          quantity: item.quantity,
          price: box.price,
          total: box.price * item.quantity
        });
      }
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const tax = Math.round(subtotal * 0.18); // 18% GST
    
    // Apply referral discount if provided
    let referralDiscount = 0;
    let referralData = null;
    
    if (referralCode) {
      try {
        const Referral = (await import('../../../models/Referral.js')).default;
        const validation = await Referral.validateAndApply(referralCode, decoded.userId, subtotal);
        referralDiscount = validation.discountAmount;
        referralData = validation.referral;
      } catch (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }
    
    const total = subtotal + shipping + tax - referralDiscount;

    // Create order
    const order = new Order({
      user: decoded.userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      shipping,
      tax,
      total,
      notes,
      referralCode: referralCode || null,
      referralDiscount,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'awaiting_verification'
    });

    await order.save();

    // Update box stock
    for (const item of orderItems) {
      await Box.findByIdAndUpdate(
        item.box,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Record referral usage if applicable
    if (referralCode && referralData && referralDiscount > 0) {
      try {
        await referralData.recordUsage(decoded.userId, order._id, referralDiscount);
      } catch (error) {
        console.error('Error recording referral usage:', error);
      }
    }

    // Clear user's cart if using cart items
    if (useCartItems) {
      user.cart = [];
      await user.save();
    }

    // Populate box details for response
    await order.populate('items.box', 'name image price');

    // Send order confirmation email
    try {
      await sendEmail(user.email, 'orderConfirmation', order, user);
      console.log('Order confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        items: order.items.map(item => ({
          box: {
            id: item.box._id,
            name: item.box.name,
            image: item.box.image,
            price: item.box.price
          },
          quantity: item.quantity,
          total: item.total
        })),
        createdAt: order.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Validate checkout (check cart, calculate totals)
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const boxId = searchParams.get('boxId');
    const quantity = parseInt(searchParams.get('quantity')) || 1;

    // Get user with cart
    const user = await User.findById(decoded.userId).populate({
      path: 'cart.box',
      select: 'name price image category isActive stock'
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let checkoutItems = [];
    let hasStockIssues = false;
    let stockIssues = [];

    if (boxId) {
      // Direct purchase validation
      const box = await Box.findById(boxId);
      if (!box || !box.isActive) {
        return NextResponse.json(
          { error: 'Box not found or not available' },
          { status: 404 }
        );
      }

      if (box.stock < quantity) {
        hasStockIssues = true;
        stockIssues.push({
          boxId: box._id,
          name: box.name,
          requested: quantity,
          available: box.stock
        });
      }

      checkoutItems = [{
        box: {
          id: box._id,
          name: box.name,
          price: box.price,
          image: box.image,
          category: box.category,
          stock: box.stock
        },
        quantity: quantity,
        total: box.price * quantity
      }];
    } else {
      // Cart checkout validation
      const activeCartItems = user.cart.filter(item => item.box && item.box.isActive);
      
      if (activeCartItems.length === 0) {
        return NextResponse.json(
          { error: 'Cart is empty' },
          { status: 400 }
        );
      }

      // Check stock for each item
      for (const cartItem of activeCartItems) {
        if (cartItem.box.stock < cartItem.quantity) {
          hasStockIssues = true;
          stockIssues.push({
            boxId: cartItem.box._id,
            name: cartItem.box.name,
            requested: cartItem.quantity,
            available: cartItem.box.stock
          });
        }

        checkoutItems.push({
          box: {
            id: cartItem.box._id,
            name: cartItem.box.name,
            price: cartItem.box.price,
            image: cartItem.box.image,
            category: cartItem.box.category,
            stock: cartItem.box.stock
          },
          quantity: cartItem.quantity,
          total: cartItem.box.price * cartItem.quantity
        });
      }
    }

    // Calculate totals
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.total, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      valid: !hasStockIssues,
      items: checkoutItems,
      summary: {
        itemCount: checkoutItems.length,
        totalQuantity: checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
      },
      stockIssues: hasStockIssues ? stockIssues : null
    });

  } catch (error) {
    console.error('Checkout validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate checkout' },
      { status: 500 }
    );
  }
}