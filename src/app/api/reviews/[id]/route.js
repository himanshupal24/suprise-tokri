import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Review from '../../../../models/Review.js';
import { verifyToken, requireAdmin } from '../../../../lib/auth.js';

// GET - Get single review
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const review = await Review.findById(id)
      .populate('user', 'firstName lastName')
      .populate('box', 'name slug image');

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: review._id,
      user: {
        name: `${review.user.firstName} ${review.user.lastName}`,
        initial: review.user.firstName.charAt(0).toUpperCase()
      },
      box: {
        name: review.box.name,
        slug: review.box.slug,
        image: review.box.image
      },
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulVotes: review.helpfulVotes,
      reportedCount: review.reportedCount,
      status: review.status,
      createdAt: review.createdAt,
      adminResponse: review.adminResponse
    });

  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT - Update review (user can edit their own review)
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

    const { id } = params;
    const body = await request.json();
    const { rating, title, comment, images } = body;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns this review
    if (review.user.toString() !== decoded.userId.toString()) {
      return NextResponse.json(
        { error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Update review
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    // Populate for response
    await review.populate('user', 'firstName lastName');

    return NextResponse.json({
      message: 'Review updated successfully',
      review: {
        id: review._id,
        user: {
          name: `${review.user.firstName} ${review.user.lastName}`,
          initial: review.user.firstName.charAt(0).toUpperCase()
        },
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        images: review.images,
        isVerifiedPurchase: review.isVerifiedPurchase,
        helpfulVotes: review.helpfulVotes,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }
    });

  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (user can delete their own review or admin can delete any)
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

    const { id } = params;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check permissions (user can delete own review, admin can delete any)
    const isOwner = review.user.toString() === decoded.userId.toString();
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}