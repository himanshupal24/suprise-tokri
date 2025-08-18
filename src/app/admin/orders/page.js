'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '../../../lib/api.js';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    delivered: 0,
    inTransit: 0,
    cancelled: 0
  });

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filterStatus !== 'all') {
          params.status = filterStatus;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        const response = await adminAPI.getOrders(params);
        setOrders(response.data.orders);
        
        // Calculate stats from summary data
        if (response.data.summary) {
          const stats = response.data.summary.statusStats || [];
          const totalRevenue = response.data.summary.totalRevenue || 0;
          
          setOrderStats({
            totalOrders: response.data.pagination?.total || 0,
            delivered: stats.find(s => s.status === 'Delivered')?.count || 0,
            inTransit: stats.find(s => s.status === 'Shipped')?.count || 0,
            cancelled: stats.find(s => s.status === 'Cancelled')?.count || 0
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
        // Fallback to mock data if API fails
        setOrders([
          {
            _id: 'ORD-2024-001',
            orderNumber: 'ORD-2024-001',
            user: {
              firstName: 'Rahul',
              lastName: 'Sharma',
              email: 'rahul.sharma@email.com',
              phone: '+91 98765 43210'
            },
            items: [
              {
                name: 'Mystery Snack Box',
                quantity: 2,
                price: 299,
                total: 598
              },
              {
                name: 'Premium Box',
                quantity: 1,
                price: 599,
                total: 599
              }
            ],
            createdAt: '2024-03-22',
            deliveryDate: '2024-03-25',
            status: 'Delivered',
            paymentMethod: 'Credit Card',
            subtotal: 1197,
            shipping: 50,
            tax: 120,
            total: 1367,
            tracking: { number: 'TRK123456789' },
            notes: 'Handle with care, fragile items'
          },
          {
            _id: 'ORD-2024-002',
            orderNumber: 'ORD-2024-002',
            user: {
              firstName: 'Priya',
              lastName: 'Patel',
              email: 'priya.patel@email.com',
              phone: '+91 87654 32109'
            },
            items: [
              {
                name: 'Mini Mystery Box',
                quantity: 3,
                price: 199,
                total: 597
              }
            ],
            createdAt: '2024-03-21',
            deliveryDate: '2024-03-24',
            status: 'Shipped',
            paymentMethod: 'UPI',
            subtotal: 597,
            shipping: 50,
            tax: 60,
            total: 707,
            tracking: { number: 'TRK987654321' },
            notes: 'Delivery before 6 PM'
          }
        ]);
        setOrderStats({
          totalOrders: 1234,
          delivered: 856,
          inTransit: 234,
          cancelled: 45
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filterStatus, searchTerm]);

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  const printOrderDetails = () => {
    const printWindow = window.open('', '_blank');
    const order = selectedOrder;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Details - ${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; }
            .order-info { margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; }
            .status { padding: 5px 10px; border-radius: 3px; color: white; }
            .delivered { background-color: #28a745; }
            .shipped { background-color: #007bff; }
            .processing { background-color: #ffc107; color: #333; }
            .cancelled { background-color: #dc3545; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Surprise Tokri</div>
            <div>हर बॉक्स में खुशी</div>
            <div>Order Details</div>
          </div>
          
          <div class="order-info">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <strong>Order ID:</strong> ${order.orderNumber}<br>
                <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                <strong>Status:</strong> <span class="status ${order.status.toLowerCase()}">${order.status.toUpperCase()}</span>
              </div>
              <div>
                <strong>Expected Delivery:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}<br>
                <strong>Payment Method:</strong> ${order.paymentMethod}<br>
                ${order.tracking?.number ? `<strong>Tracking:</strong> ${order.tracking.number}` : ''}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Customer Information</h3>
            <strong>Name:</strong> ${order.user.firstName} ${order.user.lastName}<br>
            <strong>Email:</strong> ${order.user.email}<br>
            <strong>Phone:</strong> ${order.user.phone}<br>
            <strong>Address:</strong> ${order.shippingAddress?.address || 'Address not available'}
          </div>
          
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Order Summary</h3>
            <table style="width: 300px; margin-left: auto;">
              <tr>
                <td>Subtotal:</td>
                <td>₹${order.subtotal}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td>₹${order.shipping}</td>
              </tr>
              <tr>
                <td>Tax:</td>
                <td>₹${order.tax}</td>
              </tr>
              <tr class="total-row">
                <td>Total:</td>
                <td>₹${order.total}</td>
              </tr>
            </table>
          </div>
          
          ${order.notes ? `
            <div class="section">
              <h3>Notes</h3>
              <p>${order.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Thank you for choosing Surprise Tokri!</p>
            <p>For support, contact us at support@surprisetokri.com</p>
            <p>Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    setShowPrintModal(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Export Orders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.delivered.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.inTransit.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.cancelled.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Pending">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handlePrint(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Print
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">View</button>
                        <button className="text-green-600 hover:text-green-900">Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Print Order Details</h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-medium">{selectedOrder.orderNumber}</span>
              </p>
              <p className="text-sm text-gray-600">
                Customer: <span className="font-medium">{selectedOrder.user.firstName} {selectedOrder.user.lastName}</span>
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={printOrderDetails}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Print Order Details
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 