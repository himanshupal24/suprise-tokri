import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Influencer from '@/models/Influencer';
import { requireAdmin } from '@/lib/auth';

// GET list
export async function GET(request) {
  try {
    await connectDB();
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { handle: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const list = await Influencer.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (e) {
    console.error('Admin influencers GET error:', e);
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 });
  }
}

// POST create
export async function POST(request) {
  try {
    await connectDB();
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    const body = await request.json();
    const influencer = new Influencer(body);
    await influencer.save();
    return NextResponse.json({ success: true, data: influencer }, { status: 201 });
  } catch (e) {
    console.error('Admin influencers POST error:', e);
    return NextResponse.json({ error: 'Failed to create influencer' }, { status: 500 });
  }
}


