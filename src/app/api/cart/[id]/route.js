import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Box from '../../../../models/Box.js';
import { verifyToken } from '../../../../lib/auth.js';

// PUT - Update cart item quantity
export async function PUT(request, { params }) {
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

    const { id: cartItemId } = params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Get user and find cart item
    const user = await User.findById(decoded.userId).populate({
      path: 'cart.box',
      select: 'name price image category stock'
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (cartItem.box.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${cartItem.box.stock} items available in stock` },
        { status: 400 }
      );
    }

    // Update quantity
    cartItem.quantity = quantity;
    await user.save();

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cartItem: {
        id: cartItem._id,
        box: {
          id: cartItem.box._id,
          name: cartItem.box.name,
          price: cartItem.box.price,
          image: cartItem.box.image,
          category: cartItem.box.category
        },
        quantity: cartItem.quantity,
        total: cartItem.box.price * cartItem.quantity,
        addedAt: cartItem.addedAt
      }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item
export async function DELETE(request, { params }) {
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

    const { id: cartItemId } = params;

    // Get user and remove cart item
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Remove the cart item
    cartItem.deleteOne();
    await user.save();

    return NextResponse.json({
      message: 'Cart item removed successfully'
    });

  } catch (error) {
    console.error('Remove cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}