import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Box from '@/models/Box';

export async function GET(_, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const currentBox = await Box.findOne({ slug: slug });

    if (!currentBox) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    const related = await Box.find({
      _id: { $ne: currentBox._id },
      isActive: true,
      category: currentBox.category,
      occasion: currentBox.occasion
    })
    .sort({ createdAt: -1 })
    .limit(4);

    return NextResponse.json(related);
  } catch (error) {
    console.error('Error fetching related boxes:', error);
    return NextResponse.json({ error: 'Failed to fetch related boxes' }, { status: 500 });
  }
}
