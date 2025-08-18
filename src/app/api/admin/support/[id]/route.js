import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch single ticket
export async function GET(request, { params }) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    const { id } = await params;
    const ticket = await SupportTicket.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName')
      .populate('order', 'orderNumber');

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Admin support ticket get error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

// PUT - Update ticket fields
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    const { id } = await params;
    const body = await request.json();

    const allowed = ['status', 'priority', 'assignedTo', 'internalNotes', 'tags', 'estimatedResolution', 'isEscalated', 'escalationReason'];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    // Normalize tags
    if (Array.isArray(updates.tags)) {
      updates.tags = updates.tags.map(t => String(t).trim()).filter(Boolean);
    }

    // Normalize date
    if (updates.estimatedResolution) {
      updates.estimatedResolution = new Date(updates.estimatedResolution);
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    Object.assign(ticket, updates);
    await ticket.save();

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Admin support ticket update error:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}


