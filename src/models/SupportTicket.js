import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'support', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['Order Issue', 'Product Question', 'Payment Problem', 'Delivery Issue', 'Return/Refund', 'Technical Support', 'General Inquiry'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  messages: [messageSchema],
  tags: [String],
  estimatedResolution: Date,
  resolutionTime: Number, // in hours
  customerSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    submittedAt: Date
  },
  internalNotes: String,
  isEscalated: {
    type: Boolean,
    default: false
  },
  escalationReason: String,
  escalationDate: Date
}, {
  timestamps: true
});

// Generate ticket number before validation so required constraint passes
supportTicketSchema.pre('validate', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of tickets for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const ticketCount = await this.constructor.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });
    
    this.ticketNumber = `TKT-${year}${month}${day}-${String(ticketCount + 1).padStart(3, '0')}`;
  }
  next();
});

// Method to add message
supportTicketSchema.methods.addMessage = function(sender, message, attachments = []) {
  this.messages.push({
    sender,
    message,
    attachments
  });
  
  // Update status if it's a support/admin message
  if (sender === 'support' || sender === 'admin') {
    if (this.status === 'Waiting for Customer') {
      this.status = 'In Progress';
    }
  } else if (sender === 'user') {
    if (this.status === 'In Progress') {
      this.status = 'Waiting for Customer';
    }
  }
  
  return this.save();
};

// Method to update status
supportTicketSchema.methods.updateStatus = function(newStatus, updatedBy = null) {
  this.status = newStatus;
  
  if (newStatus === 'Resolved') {
    this.resolutionTime = Math.round((Date.now() - this.createdAt) / (1000 * 60 * 60)); // hours
  }
  
  return this.save();
};

// Method to assign ticket
supportTicketSchema.methods.assignTo = function(adminId) {
  this.assignedTo = adminId;
  this.status = 'In Progress';
  return this.save();
};

// Method to escalate ticket
supportTicketSchema.methods.escalate = function(reason) {
  this.isEscalated = true;
  this.escalationReason = reason;
  this.escalationDate = new Date();
  this.priority = 'Urgent';
  return this.save();
};

// Method to add satisfaction rating
supportTicketSchema.methods.addSatisfactionRating = function(rating, feedback) {
  this.customerSatisfaction = {
    rating,
    feedback,
    submittedAt: new Date()
  };
  return this.save();
};

// Virtual for unread messages count
supportTicketSchema.virtual('unreadCount').get(function() {
  return this.messages.filter(msg => !msg.isRead && msg.sender !== 'user').length;
});

// Virtual for last message
supportTicketSchema.virtual('lastMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual for response time
supportTicketSchema.virtual('responseTime').get(function() {
  const firstSupportMessage = this.messages.find(msg => msg.sender === 'support' || msg.sender === 'admin');
  if (!firstSupportMessage) return null;
  
  return Math.round((firstSupportMessage.createdAt - this.createdAt) / (1000 * 60 * 60)); // hours
});

// Ensure virtual fields are serialized
supportTicketSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema); 