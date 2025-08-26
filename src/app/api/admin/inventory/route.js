import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import InventoryTransaction, { StockAlert } from '../../../../models/Inventory.js';
import Box from '../../../../models/Box.js';
import { requireAdmin } from '../../../../lib/auth.js';

// GET - Get inventory transactions and alerts
export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'transactions'; // transactions, alerts, summary
    const boxId = searchParams.get('boxId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const days = parseInt(searchParams.get('days')) || 30;

    if (type === 'alerts') {
      // Get stock alerts
      const alertQuery = { isActive: true };
      if (boxId) alertQuery.box = boxId;

      const alerts = await StockAlert.find(alertQuery)
        .populate('box', 'name slug image price stock')
        .populate('acknowledgedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(100);

      const formattedAlerts = alerts.map(alert => ({
        id: alert._id,
        box: {
          id: alert.box._id,
          name: alert.box.name,
          slug: alert.box.slug,
          image: alert.box.image,
          price: alert.box.price,
          currentStock: alert.box.stock
        },
        alertType: alert.alertType,
        currentStock: alert.currentStock,
        threshold: alert.threshold,
        isActive: alert.isActive,
        acknowledgedBy: alert.acknowledgedBy ? {
          name: `${alert.acknowledgedBy.firstName} ${alert.acknowledgedBy.lastName}`
        } : null,
        acknowledgedAt: alert.acknowledgedAt,
        createdAt: alert.createdAt
      }));

      return NextResponse.json({
        alerts: formattedAlerts,
        summary: {
          total: alerts.length,
          lowStock: alerts.filter(a => a.alertType === 'low_stock').length,
          outOfStock: alerts.filter(a => a.alertType === 'out_of_stock').length,
          overstock: alerts.filter(a => a.alertType === 'overstock').length
        }
      });
    }

    if (type === 'summary') {
      // Get inventory summary
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const transactionSummary = await InventoryTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            ...(boxId && { box: new mongoose.Types.ObjectId(boxId) })
          }
        },
        {
          $group: {
            _id: '$type',
            totalQuantity: { $sum: '$quantity' },
            transactionCount: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$quantity', { $ifNull: ['$cost', 0] }] } }
          }
        }
      ]);

      // Get low stock items
      const lowStockItems = await Box.find({
        isActive: true,
        $expr: { $lte: ['$stock', { $ifNull: ['$lowStockThreshold', 10] }] }
      })
      .select('name slug stock lowStockThreshold price')
      .sort({ stock: 1 })
      .limit(20);

      // Get stock value
      const stockValue = await Box.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalItems: { $sum: 1 },
            totalStock: { $sum: '$stock' },
            totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
          }
        }
      ]);

      return NextResponse.json({
        period: `${days} days`,
        transactions: transactionSummary,
        lowStockItems: lowStockItems.map(item => ({
          id: item._id,
          name: item.name,
          slug: item.slug,
          stock: item.stock,
          threshold: item.lowStockThreshold || 10,
          price: item.price
        })),
        stockValue: stockValue[0] || { totalItems: 0, totalStock: 0, totalValue: 0 }
      });
    }

    // Get transactions (default)
    const skip = (page - 1) * limit;
    const query = {};
    if (boxId) query.box = boxId;

    const transactions = await InventoryTransaction.find(query)
      .populate('box', 'name slug image')
      .populate('performedBy', 'firstName lastName email')
      .populate('reference.orderId', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await InventoryTransaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      box: {
        id: transaction.box._id,
        name: transaction.box.name,
        slug: transaction.box.slug,
        image: transaction.box.image
      },
      type: transaction.type,
      quantity: transaction.quantity,
      previousStock: transaction.previousStock,
      newStock: transaction.newStock,
      reason: transaction.reason,
      reference: transaction.reference,
      performedBy: {
        name: `${transaction.performedBy.firstName} ${transaction.performedBy.lastName}`,
        email: transaction.performedBy.email
      },
      cost: transaction.cost,
      notes: transaction.notes,
      createdAt: transaction.createdAt
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    );
  }
}

// POST - Record inventory transaction
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
      boxId,
      type,
      quantity,
      reason,
      reference,
      cost,
      notes
    } = body;

    // Validation
    if (!boxId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Box ID, type, and quantity are required' },
        { status: 400 }
      );
    }

    if (!['restock', 'adjustment', 'damaged', 'expired', 'return'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // Record the transaction
    const transaction = await InventoryTransaction.recordTransaction({
      boxId,
      type,
      quantity: parseFloat(quantity),
      reason,
      performedBy: request.adminId, // Set by requireAdmin middleware
      reference,
      cost: cost ? parseFloat(cost) : undefined,
      notes
    });

    // Populate for response
    await transaction.populate([
      { path: 'box', select: 'name slug image stock' },
      { path: 'performedBy', select: 'firstName lastName email' }
    ]);

    return NextResponse.json({
      message: 'Inventory transaction recorded successfully',
      transaction: {
        id: transaction._id,
        box: {
          id: transaction.box._id,
          name: transaction.box.name,
          slug: transaction.box.slug,
          image: transaction.box.image,
          newStock: transaction.box.stock
        },
        type: transaction.type,
        quantity: transaction.quantity,
        previousStock: transaction.previousStock,
        newStock: transaction.newStock,
        reason: transaction.reason,
        performedBy: {
          name: `${transaction.performedBy.firstName} ${transaction.performedBy.lastName}`
        },
        cost: transaction.cost,
        createdAt: transaction.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Record inventory transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record inventory transaction' },
      { status: 500 }
    );
  }
}