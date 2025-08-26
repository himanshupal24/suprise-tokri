import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  type: {
    type: String,
    enum: ['restock', 'sale', 'adjustment', 'return', 'damaged', 'expired'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reference: {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    batchNumber: String,
    supplierInfo: String
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cost: {
    type: Number,
    min: 0 // Cost per unit for restocking
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

const stockAlertSchema = new mongoose.Schema({
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  alertType: {
    type: String,
    enum: ['low_stock', 'out_of_stock', 'overstock'],
    required: true
  },
  currentStock: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
inventoryTransactionSchema.index({ box: 1, createdAt: -1 });
inventoryTransactionSchema.index({ type: 1 });
inventoryTransactionSchema.index({ performedBy: 1 });
inventoryTransactionSchema.index({ 'reference.orderId': 1 });

stockAlertSchema.index({ box: 1, isActive: 1 });
stockAlertSchema.index({ alertType: 1, isActive: 1 });
stockAlertSchema.index({ createdAt: -1 });

// Static methods for inventory transactions
inventoryTransactionSchema.statics.recordTransaction = async function(transactionData) {
  const { boxId, type, quantity, reason, performedBy, reference, cost, notes } = transactionData;
  
  try {
    const Box = mongoose.model('Box');
    const box = await Box.findById(boxId);
    
    if (!box) {
      throw new Error('Box not found');
    }

    const previousStock = box.stock;
    let newStock;

    // Calculate new stock based on transaction type
    switch (type) {
      case 'restock':
      case 'return':
        newStock = previousStock + Math.abs(quantity);
        break;
      case 'sale':
      case 'damaged':
      case 'expired':
        newStock = previousStock - Math.abs(quantity);
        break;
      case 'adjustment':
        newStock = quantity; // Direct stock adjustment
        break;
      default:
        throw new Error('Invalid transaction type');
    }

    // Ensure stock doesn't go negative
    if (newStock < 0) {
      throw new Error('Insufficient stock for this operation');
    }

    // Create transaction record
    const transaction = new this({
      box: boxId,
      type,
      quantity: type === 'adjustment' ? newStock - previousStock : Math.abs(quantity),
      previousStock,
      newStock,
      reason,
      reference: reference || {},
      performedBy,
      cost,
      notes
    });

    await transaction.save();

    // Update box stock
    box.stock = newStock;
    await box.save();

    // Check for stock alerts
    await this.checkStockAlerts(boxId, newStock);

    return transaction;
  } catch (error) {
    console.error('Error recording inventory transaction:', error);
    throw error;
  }
};

// Check and create stock alerts
inventoryTransactionSchema.statics.checkStockAlerts = async function(boxId, currentStock) {
  try {
    const Box = mongoose.model('Box');
    const StockAlert = mongoose.model('StockAlert');
    
    const box = await Box.findById(boxId);
    if (!box) return;

    const lowStockThreshold = box.lowStockThreshold || 10;
    const overstockThreshold = box.overstockThreshold || 1000;

    // Check for low stock or out of stock
    if (currentStock === 0) {
      await StockAlert.findOneAndUpdate(
        { box: boxId, alertType: 'out_of_stock', isActive: true },
        {
          box: boxId,
          alertType: 'out_of_stock',
          currentStock,
          threshold: 0,
          isActive: true
        },
        { upsert: true, new: true }
      );
    } else if (currentStock <= lowStockThreshold) {
      await StockAlert.findOneAndUpdate(
        { box: boxId, alertType: 'low_stock', isActive: true },
        {
          box: boxId,
          alertType: 'low_stock',
          currentStock,
          threshold: lowStockThreshold,
          isActive: true
        },
        { upsert: true, new: true }
      );
    } else {
      // Resolve low stock and out of stock alerts if stock is sufficient
      await StockAlert.updateMany(
        { 
          box: boxId, 
          alertType: { $in: ['low_stock', 'out_of_stock'] }, 
          isActive: true 
        },
        { 
          isActive: false, 
          resolvedAt: new Date() 
        }
      );
    }

    // Check for overstock
    if (currentStock > overstockThreshold) {
      await StockAlert.findOneAndUpdate(
        { box: boxId, alertType: 'overstock', isActive: true },
        {
          box: boxId,
          alertType: 'overstock',
          currentStock,
          threshold: overstockThreshold,
          isActive: true
        },
        { upsert: true, new: true }
      );
    } else {
      // Resolve overstock alert
      await StockAlert.updateMany(
        { 
          box: boxId, 
          alertType: 'overstock', 
          isActive: true 
        },
        { 
          isActive: false, 
          resolvedAt: new Date() 
        }
      );
    }
  } catch (error) {
    console.error('Error checking stock alerts:', error);
  }
};

// Get inventory summary for a box
inventoryTransactionSchema.statics.getInventorySummary = async function(boxId, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const summary = await this.aggregate([
      {
        $match: {
          box: new mongoose.Types.ObjectId(boxId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          totalQuantity: { $sum: '$quantity' },
          transactionCount: { $sum: 1 },
          totalCost: { $sum: { $multiply: ['$quantity', '$cost'] } }
        }
      }
    ]);

    return summary;
  } catch (error) {
    console.error('Error getting inventory summary:', error);
    return [];
  }
};

const InventoryTransaction = mongoose.models.InventoryTransaction || 
  mongoose.model('InventoryTransaction', inventoryTransactionSchema);

const StockAlert = mongoose.models.StockAlert || 
  mongoose.model('StockAlert', stockAlertSchema);

export { InventoryTransaction, StockAlert };
export default InventoryTransaction;