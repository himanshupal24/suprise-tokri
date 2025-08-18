'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState(null);

  const handleTrackByTrackingNumber = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/orders/tracking?tracking=${trackingNumber}`);
      const data = await response.json();

      if (response.ok) {
        setTrackingData(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to fetch tracking information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackByOrderNumber = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/orders/${orderNumber}/tracking`);
      const data = await response.json();

      if (response.ok) {
        setTrackingData(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to fetch tracking information');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'packed': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'packed': return '📦';
      case 'processing': return '⚙️';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your tracking number or order number to track your package
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Track by Tracking Number */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Track by Tracking Number</h2>
            <form onSubmit={handleTrackByTrackingNumber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter tracking number"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Tracking...' : 'Track Package'}
              </button>
            </form>
          </div>

          {/* Track by Order Number */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Track by Order Number</h2>
            <form onSubmit={handleTrackByOrderNumber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter order number"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tracking Information</h2>
                <p className="text-gray-600">Order #{trackingData.orderNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                {getStatusIcon(trackingData.status)} {trackingData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tracking Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Tracking Number:</span> {trackingData.trackingNumber}</p>
                  <p><span className="font-medium">Customer:</span> {trackingData.customerName}</p>
                  <p><span className="font-medium">Estimated Delivery:</span> {trackingData.estimatedDelivery ? new Date(trackingData.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {trackingData.timeline && trackingData.timeline.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Tracking Timeline</h3>
                <div className="space-y-4">
                  {trackingData.timeline.map((update, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm">{getStatusIcon(update.status)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{update.status}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {update.location && (
                          <p className="text-sm text-gray-600">📍 {update.location}</p>
                        )}
                        {update.description && (
                          <p className="text-sm text-gray-600">{update.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-2">
                If you have any questions about your order or tracking information, our support team is here to help.
              </p>
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Contact Support →
              </Link>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order History</h3>
              <p className="text-sm text-gray-600 mb-2">
                View your complete order history and manage your account.
              </p>
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 