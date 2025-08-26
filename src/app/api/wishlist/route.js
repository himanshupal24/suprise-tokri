import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Wishlist from '../../../models/Wishlist.js';
import Box from '../../../models/Box.js';
import { verifyToken } from '../../../lib/auth.js';

// GET - Get user's wishlist
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

    // Get user's wishlist
    const wishlist = await Wishlist.findOne({ user: decoded.userId })
      .populate({
        path: 'boxes',
        select: 'name price image category isActive stock rating reviewCount',
        match: { isActive: true }
      });

    if (!wishlist) {
      return NextResponse.json({
        wishlist: [],
        itemCount: 0
      });
    }

    // Filter out inactive boxes
    const activeWishlistItems = wishlist.boxes.filter(box => box && box.isActive);

    const wishlistItems = activeWishlistItems.map(box => ({
      id: box._id,
      name: box.name,
      price: box.price,
      image: box.image,
      category: box.category,
      stock: box.stock,
      rating: box.rating || 0,
      reviewCount: box.reviewCount || 0,
      addedAt: wishlist.createdAt
    }));

    return NextResponse.json({
      wishlist: wishlistItems,
      itemCount: wishlistItems.length
    });

  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
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
    const { boxId } = body;

    if (!boxId) {
      return NextResponse.json(
        { error: 'Box ID is required' },
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

    // Find or create user's wishlist
    let wishlist = await Wishlist.findOne({ user: decoded.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: decoded.userId,
        boxes: [boxId]
      });
    } else {
      // Check if item already exists in wishlist
      if (wishlist.boxes.includes(boxId)) {
        return NextResponse.json(
          { error: 'Item already in wishlist' },
          { status: 409 }
        );
      }
      
      wishlist.boxes.push(boxId);
    }

    await wishlist.save();

    return NextResponse.json({
      message: 'Item added to wishlist successfully',
      boxId: boxId
    }, { status: 201 });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
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

    const { searchParams } = new URL(request.url);
    const boxId = searchParams.get('boxId');

    if (!boxId) {
      return NextResponse.json(
        { error: 'Box ID is required' },
        { status: 400 }
      );
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: decoded.userId });
    
    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Remove item from wishlist
    const initialLength = wishlist.boxes.length;
    wishlist.boxes = wishlist.boxes.filter(id => id.toString() !== boxId.toString());
    
    if (wishlist.boxes.length === initialLength) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    await wishlist.save();

    return NextResponse.json({
      message: 'Item removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    );
  }
}