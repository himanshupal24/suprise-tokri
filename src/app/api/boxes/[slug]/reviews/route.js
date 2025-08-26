import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Box from '../../../../../models/Box.js';
import Review from '../../../../../models/Review.js';
import Order from '../../../../../models/Order.js';
import { verifyToken } from '../../../../../lib/auth.js';

export async function GET(_, { params }) {
  try {
    await connectDB();

    const { slug } = params;
    const box = await Box.findOne({ slug });

    if (!box) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    // Get reviews with pagination
    const page = parseInt(request?.url?.searchParams?.get('page')) || 1;
    const limit = parseInt(request?.url?.searchParams?.get('limit')) || 10;
    const sortBy = request?.url?.searchParams?.get('sortBy') || 'createdAt';
    const sortOrder = request?.url?.searchParams?.get('sortOrder') === 'asc' ? 1 : -1;
    const rating = parseInt(request?.url?.searchParams?.get('rating'));

    const skip = (page - 1) * limit;
    const query = { box: box._id, status: 'active' };
    
    if (rating && rating >= 1 && rating <= 5) {
      query.rating = rating;
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { box: box._id, status: 'active' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    ratingStats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    const formattedReviews = reviews.map(review => ({
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
      adminResponse: review.adminResponse
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      summary: {
        averageRating: box.rating || 0,
        totalReviews: box.reviewCount || 0,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

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

    const body = await request.json();
    const { rating, title, comment, images, orderId } = body;
    const { slug } = params;

    // Validation
    if (!rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Rating, title, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find box
    const box = await Box.findOne({ slug });
    if (!box) {
      return NextResponse.json(
        { error: 'Box not found' },
        { status: 404 }
      );
    }

    // Verify user has purchased this box
    let verifiedOrder = null;
    if (orderId) {
      verifiedOrder = await Order.findOne({
        _id: orderId,
        user: decoded.userId,
        'items.box': box._id,
        status: { $in: ['delivered', 'completed'] }
      });
    } else {
      verifiedOrder = await Order.findOne({
        user: decoded.userId,
        'items.box': box._id,
        status: { $in: ['delivered', 'completed'] }
      });
    }

    if (!verifiedOrder) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased and received' },
        { status: 403 }
      );
    }

    // Check if user already reviewed this box
    const existingReview = await Review.findOne({
      user: decoded.userId,
      box: box._id
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Create review
    const review = new Review({
      user: decoded.userId,
      box: box._id,
      order: verifiedOrder._id,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true
    });

    await review.save();

    // Populate user for response
    await review.populate('user', 'firstName lastName');

    return NextResponse.json({
      message: 'Review added successfully',
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
        createdAt: review.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error posting review:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
