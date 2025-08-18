import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import SupportTicket from '../../../../models/SupportTicket.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Fetch all support tickets with filtering and pagination
export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const category = searchParams.get('category') || '';
    const assignedTo = searchParams.get('assignedTo') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const tickets = await SupportTicket.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName')
      .populate('order', 'orderNumber')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await SupportTicket.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get ticket statistics
    const ticketStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          openTickets: { $sum: { $cond: [{ $in: ['$status', ['Open', 'In Progress']] }, 1, 0] } },
          resolvedTickets: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    // Get status distribution
    const statusDistribution = await SupportTicket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get priority distribution
    const priorityDistribution = await SupportTicket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get category distribution
    const categoryDistribution = await SupportTicket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tickets: tickets.map(ticket => ({
          id: ticket._id,
          ticketNumber: ticket.ticketNumber,
          user: ticket.user,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          assignedTo: ticket.assignedTo,
          order: ticket.order,
          messages: ticket.messages,
          tags: ticket.tags,
          estimatedResolution: ticket.estimatedResolution,
          resolutionTime: ticket.resolutionTime,
          customerSatisfaction: ticket.customerSatisfaction,
          internalNotes: ticket.internalNotes,
          isEscalated: ticket.isEscalated,
          escalationReason: ticket.escalationReason,
          escalationDate: ticket.escalationDate,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats: ticketStats.length > 0 ? ticketStats[0] : {
          totalTickets: 0,
          openTickets: 0,
          resolvedTickets: 0,
          avgResolutionTime: 0
        },
        statusDistribution,
        priorityDistribution,
        categoryDistribution
      }
    });

  } catch (error) {
    console.error('Admin support tickets fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
} 