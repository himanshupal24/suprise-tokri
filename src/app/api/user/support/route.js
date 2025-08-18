import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - List current user's support tickets
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find({ user: decoded.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SupportTicket.countDocuments({ user: decoded.userId });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        tickets: tickets.map(t => ({
          id: t._id,
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          description: t.description,
          category: t.category,
          priority: t.priority,
          status: t.status,
          messages: t.messages,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
        pagination: { page, limit, total, totalPages },
      },
    });
  } catch (error) {
    console.error('User support tickets fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
  }
}

// POST - Create a new support ticket
export async function POST(request) {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { subject, description, category, priority = 'Medium', orderId } = body || {};

    if (!subject || !description || !category) {
      return NextResponse.json({ error: 'Subject, description and category are required' }, { status: 400 });
    }

    const ticket = new SupportTicket({
      user: user._id,
      subject,
      description,
      category,
      priority,
      ...(orderId ? { order: orderId } : {}),
    });

    await ticket.save();

    return NextResponse.json({
      success: true,
      data: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        messages: ticket.messages,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create support ticket error:', error);
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
  }
}


