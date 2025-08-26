import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Review from '../../../../../models/Review.js';
import { verifyToken } from '../../../../../lib/auth.js';

// POST - Mark review as helpful
export async function POST(request, { params }) {
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

    // Find and update review
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review marked as helpful',
      helpfulVotes: review.helpfulVotes
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    return NextResponse.json(
      { error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}