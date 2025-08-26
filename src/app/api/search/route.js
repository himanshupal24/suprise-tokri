import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Box from '../../../models/Box.js';

// GET - Advanced search with filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const gender = searchParams.get('gender');
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const minRating = parseFloat(searchParams.get('minRating'));
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Build search query
    const searchQuery = { isActive: true };

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { category: { $regex: query, $options: 'i' } },
        { occasion: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      searchQuery.category = category;
    }

    // Occasion filter
    if (occasion && occasion !== 'all') {
      searchQuery.occasion = occasion;
    }

    // Gender filter
    if (gender && gender !== 'all') {
      searchQuery.gender = gender;
    }

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      searchQuery.price = {};
      if (!isNaN(minPrice)) searchQuery.price.$gte = minPrice;
      if (!isNaN(maxPrice)) searchQuery.price.$lte = maxPrice;
    }

    // Rating filter
    if (!isNaN(minRating)) {
      searchQuery.rating = { $gte: minRating };
    }

    // Stock filter
    if (inStock === 'true') {
      searchQuery.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price_low':
        sortOptions = { price: 1 };
        break;
      case 'price_high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { reviewCount: -1, rating: -1 };
        break;
      case 'name':
        sortOptions = { name: sortOrder };
        break;
      case 'relevance':
      default:
        if (query) {
          // Use text score for relevance when searching
          searchQuery.$text = { $search: query };
          sortOptions = { score: { $meta: 'textScore' } };
        } else {
          // Default sort by popularity when no search query
          sortOptions = { reviewCount: -1, rating: -1 };
        }
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute search
    const boxes = await Box.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('name slug description price originalPrice image category occasion gender rating reviewCount stock tags createdAt')
      .lean();

    // Get total count for pagination
    const totalBoxes = await Box.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBoxes / limit);

    // Get filter aggregations for faceted search
    const filterAggregations = await Box.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          occasions: [
            { $group: { _id: '$occasion', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          genders: [
            { $group: { _id: '$gender', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: '$price',
                boundaries: [0, 500, 1000, 2000, 5000, 10000],
                default: '10000+',
                output: {
                  count: { $sum: 1 },
                  minPrice: { $min: '$price' },
                  maxPrice: { $max: '$price' }
                }
              }
            }
          ],
          ratings: [
            {
              $bucket: {
                groupBy: '$rating',
                boundaries: [0, 1, 2, 3, 4, 5],
                default: 'unrated',
                output: {
                  count: { $sum: 1 }
                }
              }
            }
          ],
          stockStatus: [
            {
              $group: {
                _id: { $cond: [{ $gt: ['$stock', 0] }, 'in_stock', 'out_of_stock'] },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const aggregations = filterAggregations[0] || {};

    // Format results
    const formattedBoxes = boxes.map(box => ({
      id: box._id,
      name: box.name,
      slug: box.slug,
      description: box.description,
      price: box.price,
      originalPrice: box.originalPrice,
      image: box.image,
      category: box.category,
      occasion: box.occasion,
      gender: box.gender,
      rating: box.rating || 0,
      reviewCount: box.reviewCount || 0,
      stock: box.stock,
      isInStock: box.stock > 0,
      tags: box.tags || [],
      discount: box.originalPrice ? Math.round(((box.originalPrice - box.price) / box.originalPrice) * 100) : 0,
      createdAt: box.createdAt
    }));

    // Search suggestions based on query
    let suggestions = [];
    if (query && query.length >= 2) {
      const suggestionBoxes = await Box.find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .select('name tags')
      .limit(5);

      suggestions = [
        ...new Set([
          ...suggestionBoxes.map(box => box.name),
          ...suggestionBoxes.flatMap(box => box.tags || [])
            .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ])
      ].slice(0, 8);
    }

    return NextResponse.json({
      query: {
        searchTerm: query,
        filters: {
          category,
          occasion,
          gender,
          minPrice,
          maxPrice,
          minRating,
          inStock
        },
        sorting: {
          sortBy,
          sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        },
        pagination: {
          page,
          limit
        }
      },
      results: {
        boxes: formattedBoxes,
        totalBoxes,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        currentPage: page
      },
      filters: {
        categories: aggregations.categories || [],
        occasions: aggregations.occasions || [],
        genders: aggregations.genders || [],
        priceRanges: aggregations.priceRanges || [],
        ratings: aggregations.ratings || [],
        stockStatus: aggregations.stockStatus || []
      },
      suggestions,
      searchTime: Date.now()
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

// POST - Save search query for analytics (optional)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { query, filters, resultCount, userId } = body;

    // Here you could save search analytics
    // For now, we'll just return success
    console.log('Search analytics:', { query, filters, resultCount, userId, timestamp: new Date() });

    return NextResponse.json({
      message: 'Search query recorded'
    });

  } catch (error) {
    console.error('Search analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to record search' },
      { status: 500 }
    );
  }
}