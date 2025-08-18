// app/api/admin/boxes/route.js
import { NextResponse } from 'next/server';

import connectDB from '../../../../lib/db.js';
import Box from '../../../../models/Box.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Fetch all boxes
export async function GET(request) {
  try {
    await connectDB();

    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const boxes = await Box.find({});
    return NextResponse.json({ success: true, data: boxes });
  } catch (error) {
    console.error('Failed to fetch boxes:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


// POST - Create new box
export async function POST(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const body = await request.json();
    console.log('Received box creation data:', body); // Add this for debugging

    // Destructure with default values
    const {
      name = '',
      description = '',
      price = 0,
      category = '',
      occasion = '',
      totalItems = 0,
      weight = 0,
      stock = 0,
      // Optional fields with defaults
      shortDescription = '',
      originalPrice = 0,
      gender = 'unisex',
      ageGroup = 'all',
      images = [],
      mainImage = '',
      items = [],
      dimensions = {},
      tags = [],
      metaTitle = '',
      metaDescription = '',
      seoKeywords = [],
      estimatedDelivery = '3-5 days',
      returnPolicy = '30 days return for damaged items',
      shippingInfo = {},
      customization = {}
    } = body;

    // Enhanced validation with specific messages
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!description) missingFields.push('description');
    if (!price) missingFields.push('price');
    if (!category) missingFields.push('category');
    // if (!occasion) missingFields.push('occasion');
    // if (!totalItems) missingFields.push('totalItems');
    // if (!weight) missingFields.push('weight');
    if (!stock) missingFields.push('stock');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields,
          message: `Please provide: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Type validation
    if (isNaN(price) || isNaN(totalItems) || isNaN(weight) || isNaN(stock)) {
      return NextResponse.json(
        { error: 'Price, totalItems, weight, and stock must be numbers' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBox = await Box.findOne({ slug });
    if (existingBox) {
      return NextResponse.json(
        { error: 'A box with this name already exists' },
        { status: 409 }
      );
    }

    // Create new box with all fields
    const box = new Box({
      name,
      slug,
      description,
      shortDescription,
      price: Number(price),
      originalPrice: Number(originalPrice),
      category,
      occasion,
      gender,
      ageGroup,
      images,
      mainImage,
      items,
      totalItems: Number(totalItems),
      weight: Number(weight),
      dimensions,
      stock: Number(stock),
      tags,
      metaTitle,
      metaDescription,
      seoKeywords,
      estimatedDelivery,
      returnPolicy,
      shippingInfo,
      customization
    });

    // Explicit validation
    try {
      await box.validate();
    } catch (validationError) {
      console.error('Validation error:', validationError.errors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationError.errors 
        },
        { status: 400 }
      );
    }

    await box.save();

    return NextResponse.json({
      success: true,
      message: 'Box created successfully',
      data: box
    }, { status: 201 });

  } catch (error) {
    console.error('Admin box creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A box with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create box',
        details: error.message 
      },
      { status: 500 }
    );
  }
}