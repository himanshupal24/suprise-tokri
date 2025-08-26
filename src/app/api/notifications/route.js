import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Notification from '../../../models/Notification.js';
import { verifyToken, requireAdmin } from '../../../lib/auth.js';

// GET - Get user notifications
export async function GET(request) {
  try {
    await connectDB();
    
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');

    const skip = (page - 1) * limit;
    const query = { 
      user: decoded.userId,
      status: 'sent',
      expiresAt: { $gt: new Date() }
    };

    if (type) query.type = type;
    if (isRead !== null) query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);
    const unreadCount = await Notification.getUnreadCount(decoded.userId);

    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      priority: notification.priority,
      createdAt: notification.createdAt,
      readAt: notification.readAt
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotifications,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create notification (Admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const body = await request.json();
    const { 
      userId, 
      userIds, 
      type, 
      title, 
      message, 
      data, 
      priority = 'normal',
      channel = ['in-app'],
      scheduledFor,
      expiresAt
    } = body;

    // Validation
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    if (!userId && !userIds) {
      return NextResponse.json(
        { error: 'Either userId or userIds must be provided' },
        { status: 400 }
      );
    }

    const notifications = [];
    const targetUsers = userId ? [userId] : userIds;

    // Create notifications for each user
    for (const targetUserId of targetUsers) {
      const notificationData = {
        user: targetUserId,
        type,
        title,
        message,
        data: data || {},
        priority,
        channel,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      };

      const notification = await Notification.createNotification(notificationData);
      notifications.push(notification);
    }

    return NextResponse.json({
      message: `${notifications.length} notification(s) created successfully`,
      notifications: notifications.map(n => ({
        id: n._id,
        user: n.user,
        type: n.type,
        title: n.title,
        status: n.status
      }))
    }, { status: 201 });

  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT - Mark notifications as read
export async function PUT(request) {
  try {
    await connectDB();
    
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationIds, markAllAsRead = false } = body;

    if (!markAllAsRead && (!notificationIds || !Array.isArray(notificationIds))) {
      return NextResponse.json(
        { error: 'notificationIds array is required unless markAllAsRead is true' },
        { status: 400 }
      );
    }

    const result = await Notification.markAsRead(
      decoded.userId, 
      markAllAsRead ? null : notificationIds
    );

    const unreadCount = await Notification.getUnreadCount(decoded.userId);

    return NextResponse.json({
      message: `${result.modifiedCount} notification(s) marked as read`,
      modifiedCount: result.modifiedCount,
      unreadCount
    });

  } catch (error) {
    console.error('Mark notifications as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}