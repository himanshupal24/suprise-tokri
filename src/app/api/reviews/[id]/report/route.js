import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Review from '../../../../../models/Review.js';
import { verifyToken } from '../../../../../lib/auth.js';

// POST - Report review
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
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'Report reason is required' },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Increment report count
    review.reportedCount += 1;

    // Auto-hide review if it gets too many reports
    if (review.reportedCount >= 5) {
      review.status = 'reported';
    }

    await review.save();

    return NextResponse.json({
      message: 'Review reported successfully',
      reportedCount: review.reportedCount,
      status: review.status
    });

  } catch (error) {
    console.error('Report review error:', error);
    return NextResponse.json(
      { error: 'Failed to report review' },
      { status: 500 }
    );
  }
}