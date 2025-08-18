import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Box from '@/models/Box';

export async function GET(_, { params }) {
  try {
    await connectDB();

    const { slug } = params; // ✅ no need for await
    const box = await Box.findOne({ slug }, 'reviews');

    if (!box) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    return NextResponse.json(box.reviews || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();

    const { user, comment, rating } = body;
    const { slug } = params; // ✅ fix: get slug from params

    if (!user || !comment || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const box = await Box.findOne({ slug });
    if (!box) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    box.reviews.push({ user, comment, rating });
    await box.updateRating(rating); // ✅ assuming this method exists in schema
    await box.save();

    return NextResponse.json({ message: 'Review added' });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
