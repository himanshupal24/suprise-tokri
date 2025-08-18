import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Box from '../../../../../models/Box.js';
import { requireAdmin } from '../../../../../lib/auth.js';

// GET - Fetch single box by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    
    const box = await Box.findById(id);
    if (!box) {
      return NextResponse.json(
        { error: 'Box not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: box
    });

  } catch (error) {
    console.error('Admin box fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch box' },
      { status: 500 }
    );
  }
}

// PUT - Update box
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      occasion,
      gender,
      ageGroup,
      images,
      mainImage,
      items,
      totalItems,
      weight,
      dimensions,
      stock,
      isActive,
      isFeatured,
      isTrending,
      tags,
      metaTitle,
      metaDescription,
      seoKeywords,
      estimatedDelivery,
      returnPolicy,
      shippingInfo,
      customization
    } = body;

    // Find and update box
    const box = await Box.findById(id);
    if (!box) {
      return NextResponse.json(
        { error: 'Box not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) box.name = name;
    if (description !== undefined) box.description = description;
    if (shortDescription !== undefined) box.shortDescription = shortDescription;
    if (price !== undefined) box.price = price;
    if (originalPrice !== undefined) box.originalPrice = originalPrice;
    if (category !== undefined) box.category = category;
    if (occasion !== undefined) box.occasion = occasion;
    if (gender !== undefined) box.gender = gender;
    if (ageGroup !== undefined) box.ageGroup = ageGroup;
    if (images !== undefined) box.images = images;
    if (mainImage !== undefined) box.mainImage = mainImage;
    if (items !== undefined) box.items = items;
    if (totalItems !== undefined) box.totalItems = totalItems;
    if (weight !== undefined) box.weight = weight;
    if (dimensions !== undefined) box.dimensions = dimensions;
    if (stock !== undefined) box.stock = stock;
    if (isActive !== undefined) box.isActive = isActive;
    if (isFeatured !== undefined) box.isFeatured = isFeatured;
    if (isTrending !== undefined) box.isTrending = isTrending;
    if (tags !== undefined) box.tags = tags;
    if (metaTitle !== undefined) box.metaTitle = metaTitle;
    if (metaDescription !== undefined) box.metaDescription = metaDescription;
    if (seoKeywords !== undefined) box.seoKeywords = seoKeywords;
    if (estimatedDelivery !== undefined) box.estimatedDelivery = estimatedDelivery;
    if (returnPolicy !== undefined) box.returnPolicy = returnPolicy;
    if (shippingInfo !== undefined) box.shippingInfo = shippingInfo;
    if (customization !== undefined) box.customization = customization;

    // Update slug if name changed
    if (name && name !== box.name) {
      const newSlug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug already exists
      const existingBox = await Box.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBox) {
        return NextResponse.json(
          { error: 'A box with this name already exists' },
          { status: 409 }
        );
      }
      
      box.slug = newSlug;
    }

    await box.save();

    return NextResponse.json({
      success: true,
      message: 'Box updated successfully',
      data: box
    });

  } catch (error) {
    console.error('Admin box update error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A box with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update box' },
      { status: 500 }
    );
  }
}

// DELETE - Delete box
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    
    const box = await Box.findById(id);
    if (!box) {
      return NextResponse.json(
        { error: 'Box not found' },
        { status: 404 }
      );
    }

    // Check if box has any orders
    const Order = (await import('../../../../../models/Order.js')).default;
    const orderCount = await Order.countDocuments({
      'items.box': id
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete box that has associated orders' },
        { status: 400 }
      );
    }

    await Box.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Box deleted successfully'
    });

  } catch (error) {
    console.error('Admin box delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete box' },
      { status: 500 }
    );
  }
} 