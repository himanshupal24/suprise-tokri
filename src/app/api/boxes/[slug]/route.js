// app/api/boxes/[slug]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Box from '@/models/Box';

export async function GET(req, context) {
  try {
    await connectDB();

    const { slug } = await context.params; // ✅ Await params

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Valid slug is required' },
        { status: 400 }
      );
    }

    const box = await Box.findOne({ slug, isActive: true })
      .lean({ virtuals: true })
      .exec();

    if (!box) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    return NextResponse.json(box);
  } catch (error) {
    console.error('Error fetching box:', error);
    return NextResponse.json(
      { error: 'Failed to fetch box', details: error.message },
      { status: 500 }
    );
  }
}
