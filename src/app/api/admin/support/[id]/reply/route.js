import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { requireAdmin } from '@/lib/auth';

// POST - Admin reply to a ticket
export async function POST(request, { params }) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const { message, attachments = [] } = body || {};

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await ticket.addMessage('admin', message.trim(), attachments);

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Admin reply error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}


