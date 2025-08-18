import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/auth';

// POST - Add a message to a user's own ticket
export async function POST(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { message, attachments = [] } = body || {};

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await SupportTicket.findOne({ _id: id, user: decoded.userId });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await ticket.addMessage('user', message.trim(), attachments);

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Add message to ticket error:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}


