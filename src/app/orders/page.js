'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userAPI } from '@/lib/api';

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await userAPI.getOrders({ limit: 50 });
      setOrders(res.orders || []);
    } catch (e) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'packed': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'packed': return '📦';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  const normalizedOrders = orders.map(o => ({
    id: o.id || o.orderNumber || o._id,
    date: new Date(o.createdAt).toISOString().slice(0,10),
    status: o.status || 'pending',
    items: (o.items || []).map(it => ({ name: it.box?.name || 'Item', quantity: it.quantity, price: `₹${it.price || it.total || 0}` })),
    total: `₹${o.totalAmount || o.total || 0}`,
    tracking: o.trackingNumber || null,
    deliveryDate: o.estimatedDelivery || null,
    paymentMethod: o.paymentMethod || 'UPI',
  }));

  const filteredOrders = normalizedOrders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status.toLowerCase() === activeFilter;
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: normalizedOrders.length,
    delivered: normalizedOrders.filter(o => o.status.toLowerCase() === 'delivered').length,
    shipped: normalizedOrders.filter(o => o.status.toLowerCase() === 'shipped').length,
    packed: normalizedOrders.filter(o => o.status.toLowerCase() === 'packed').length,
    pending: normalizedOrders.filter(o => o.status.toLowerCase() === 'pending').length
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
              
 Back to Dashboard
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
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">Loading orders...</div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-red-600">{error}</div>
        ) : (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'You\'t placed any orders yet.'}
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
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🎁</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-gray-50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>Total: <span className="font-semibold text-gray-900">{order.total}</span></p>
                      {order.tracking && (
                        <p>Tracking: <span className="font-semibold text-gray-900">{order.tracking}</span></p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link 
                        href={`/orders/${order.id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
} 