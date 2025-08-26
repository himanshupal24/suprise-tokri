import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'order_confirmed',
      'order_shipped',
      'order_delivered',
      'payment_verified',
      'payment_failed',
      'new_box',
      'price_drop',
      'stock_alert',
      'review_response',
      'support_response',
      'promotional',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  data: {
    // Additional data related to notification
    orderId: mongoose.Schema.Types.ObjectId,
    boxId: mongoose.Schema.Types.ObjectId,
    ticketId: mongoose.Schema.Types.ObjectId,
    url: String,
    image: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  channel: {
    type: [String],
    enum: ['in-app', 'email', 'sms', 'push'],
    default: ['in-app']
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'cancelled'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiry: 30 days from creation
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for checking if notification is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = new this(notificationData);
    await notification.save();
    
    // Mark as sent immediately for in-app notifications
    if (notification.channel.includes('in-app')) {
      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds = null) {
  try {
    const query = { user: userId, isRead: false };
    
    if (notificationIds) {
      query._id = { $in: notificationIds };
    }
    
    const result = await this.updateMany(
      query,
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({
      user: userId,
      isRead: false,
      status: 'sent',
      expiresAt: { $gt: new Date() }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = async function() {
  try {
    const result = await this.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    console.log(`Cleaned up ${result.deletedCount} expired notifications`);
    return result;
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    throw error;
  }
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;