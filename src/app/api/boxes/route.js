// app/api/boxes/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Box from '@/models/Box';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const category = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const gender = searchParams.get('gender');
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const query = { isActive: true };

    if (category) query.category = category;
    if (occasion) query.occasion = occasion;
    if (gender) query.gender = gender;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const boxes = await Box.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const totalBoxes = await Box.countDocuments(query);
    const totalPages = Math.ceil(totalBoxes / limit);

    return NextResponse.json({
      boxes,
      pagination: {
        currentPage: page,
        totalPages,
        totalBoxes,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Boxes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch boxes' }, { status: 500 });
  }
}
