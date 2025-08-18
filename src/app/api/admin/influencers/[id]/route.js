import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Influencer from '@/models/Influencer';
import { requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;
    const { id } = await params;
    const doc = await Influencer.findById(id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: doc });
  } catch (e) {
    console.error('Admin influencer GET error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;
    const { id } = await params;
    const body = await request.json();
    const doc = await Influencer.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: doc });
  } catch (e) {
    console.error('Admin influencer PUT error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;
    const { id } = await params;
    await Influencer.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin influencer DELETE error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


