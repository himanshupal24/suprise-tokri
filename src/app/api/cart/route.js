import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Box from '../../../models/Box.js';
import { verifyToken } from '../../../lib/auth.js';

// GET - Get user's cart
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

    // Get user with populated cart
    const user = await User.findById(decoded.userId)
      .populate({
        path: 'cart.box',
        select: 'name price image category isActive stock'
      });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Filter out inactive boxes and calculate totals
    const activeCartItems = user.cart.filter(item => item.box && item.box.isActive);
    
    let subtotal = 0;
    const cartItems = activeCartItems.map(item => {
      const itemTotal = item.box.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        id: item._id,
        box: {
          id: item.box._id,
          name: item.box.name,
          price: item.box.price,
          image: item.box.image,
          category: item.box.category,
          stock: item.box.stock
        },
        quantity: item.quantity,
        total: itemTotal,
        addedAt: item.addedAt
      };
    });

    return NextResponse.json({
      cart: cartItems,
      summary: {
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: subtotal,
        shipping: subtotal > 500 ? 0 : 50, // Free shipping over ₹500
        tax: Math.round(subtotal * 0.18), // 18% GST
        total: subtotal + (subtotal > 500 ? 0 : 50) + Math.round(subtotal * 0.18)
      }
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
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
    const { boxId, quantity = 1 } = body;

    if (!boxId) {
      return NextResponse.json(
        { error: 'Box ID is required' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Check if box exists and is active
    const box = await Box.findById(boxId);
    if (!box || !box.isActive) {
      return NextResponse.json(
        { error: 'Box not found or not available' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (box.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${box.stock} items available in stock` },
        { status: 400 }
      );
    }

    // Get user and check if item already exists in cart
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingCartItem = user.cart.find(item => 
      item.box.toString() === boxId.toString()
    );

    if (existingCartItem) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > 10) {
        return NextResponse.json(
          { error: 'Cannot add more than 10 of the same item' },
          { status: 400 }
        );
      }
      if (newQuantity > box.stock) {
        return NextResponse.json(
          { error: `Only ${box.stock} items available in stock` },
          { status: 400 }
        );
      }
      
      existingCartItem.quantity = newQuantity;
      existingCartItem.addedAt = new Date();
    } else {
      // Add new item to cart
      user.cart.push({
        box: boxId,
        quantity: quantity,
        addedAt: new Date()
      });
    }

    await user.save();

    // Return updated cart item
    await user.populate({
      path: 'cart.box',
      select: 'name price image category'
    });

    const updatedItem = user.cart.find(item => 
      item.box._id.toString() === boxId.toString()
    );

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cartItem: {
        id: updatedItem._id,
        box: {
          id: updatedItem.box._id,
          name: updatedItem.box.name,
          price: updatedItem.box.price,
          image: updatedItem.box.image,
          category: updatedItem.box.category
        },
        quantity: updatedItem.quantity,
        total: updatedItem.box.price * updatedItem.quantity,
        addedAt: updatedItem.addedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE(request) {
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

    // Clear user's cart
    await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { cart: [] } }
    );

    return NextResponse.json({
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}