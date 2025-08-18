'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-03-15',
      status: 'Delivered',
      items: [
        { name: 'Mystery Snack Box', quantity: 1, price: '₹599' },
        { name: 'Birthday Surprise Box', quantity: 1, price: '₹700' }
      ],
      total: '₹1,299',
      tracking: 'DLVR-123456789',
      deliveryDate: '2024-03-18',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-03-10',
      status: 'Shipped',
      items: [
        { name: 'Valentine Special Box', quantity: 1, price: '₹899' }
      ],
      total: '₹899',
      tracking: 'SHIP-987654321',
      deliveryDate: null,
      paymentMethod: 'COD'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-03-05',
      status: 'Packed',
      items: [
        { name: 'Friendship Day Box', quantity: 1, price: '₹599' }
      ],
      total: '₹599',
      tracking: null,
      deliveryDate: null,
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-02-28',
      status: 'Delivered',
      items: [
        { name: 'Diwali Special Box', quantity: 2, price: '₹799' }
      ],
      total: '₹1,598',
      tracking: 'DLVR-456789123',
      deliveryDate: '2024-03-02',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-2024-005',
      date: '2024-02-20',
      status: 'Delivered',
      items: [
        { name: 'Holi Celebration Box', quantity: 1, price: '₹499' }
      ],
      total: '₹499',
      tracking: 'DLVR-789123456',
      deliveryDate: '2024-02-23',
      paymentMethod: 'COD'
    },
    {
      id: 'ORD-2024-006',
      date: '2024-02-15',
      status: 'Delivered',
      items: [
        { name: 'New Year Surprise Box', quantity: 1, price: '₹999' }
      ],
      total: '₹999',
      tracking: 'DLVR-321654987',
      deliveryDate: '2024-02-18',
      paymentMethod: 'UPI'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Shipped': return 'text-blue-600 bg-blue-100';
      case 'Packed': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✅';
      case 'Shipped': return '🚚';
      case 'Packed': return '📦';
      case 'Pending': return '⏳';
      default: return '⏳';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status.toLowerCase() === activeFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    packed: orders.filter(o => o.status === 'Packed').length,
    pending: orders.filter(o => o.status === 'Pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track your order history and status</p>
            </div>
            <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by ID or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3 top-2.5">🔍</span>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'You haven\'t placed any orders yet.'}
              </p>
              <Link 
                href="/boxes" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="text-2xl">{getStatusIcon(order.status)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <Link 
                        href={`/orders/${order.id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🎁</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">{item.price}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Payment: {order.paymentMethod}
                        </p>
                        {order.tracking && (
                          <p className="text-sm text-gray-600">
                            Tracking: {order.tracking}
                          </p>
                        )}
                        {order.deliveryDate && (
                          <p className="text-sm text-gray-600">
                            Delivered: {order.deliveryDate}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">Total: {order.total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link 
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    {order.status === 'Delivered' && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        Reorder
                      </button>
                    )}
                    {order.tracking && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Status Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-medium text-gray-900">Pending</p>
                <p className="text-sm text-gray-600">Order confirmed, processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-medium text-gray-900">Packed</p>
                <p className="text-sm text-gray-600">Items packed, ready to ship</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-medium text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">On the way to you</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-gray-900">Delivered</p>
                <p className="text-sm text-gray-600">Successfully delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 