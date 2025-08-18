'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI, userAPI } from '../../lib/api.js';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get user profile
        const userData = await authAPI.getCurrentUser();
        setUser(userData.user);

        // Get recent orders
        const ordersData = await userAPI.getOrders({ limit: 5 });
        setRecentOrders(ordersData.orders);

        // Get saved addresses
        const addressesData = await userAPI.getAddresses();
        setSavedAddresses(addressesData.addresses);

        // Set rewards data based on user data
        setRewards({
          currentPoints: userData.user.rewardsPoints || 0,
          nextTier: getNextTier(userData.user.tier),
          pointsNeeded: getPointsNeeded(userData.user.tier, userData.user.rewardsPoints),
          availableRewards: [
            { name: '₹100 off on next order', points: 500 },
            { name: 'Free shipping', points: 300 },
            { name: 'Birthday surprise box', points: 1000 }
          ]
        });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getNextTier = (currentTier) => {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : 'Platinum';
  };

  const getPointsNeeded = (currentTier, currentPoints) => {
    const tierPoints = { 'Bronze': 0, 'Silver': 1000, 'Gold': 2500, 'Platinum': 5000 };
    const nextTier = getNextTier(currentTier);
    const pointsNeeded = tierPoints[nextTier] - currentPoints;
    return Math.max(0, pointsNeeded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Shipped': return 'text-blue-600 bg-blue-100';
      case 'Packed': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
          <Link href="/login" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/wishlist" className="text-purple-600 hover:text-purple-700">
                ❤️ Wishlist
              </Link>
              <Link href="/logout" className="text-red-600 hover:text-red-700">
                🚪 Logout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{user.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{(user.totalSpent || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rewards Points</p>
                <p className="text-2xl font-bold text-gray-900">{user.rewardsPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Member Tier</p>
                <p className="text-2xl font-bold text-gray-900">{user.tier || 'Bronze'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <Link href="/orders" className="text-purple-600 hover:text-purple-700 text-sm">
                    View All →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            {order.items.map(item => item.box.name).join(', ')}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            Total: ₹{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Link 
                            href={`/orders/${order.id}`}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                          {order.trackingNumber && (
                            <span className="text-xs text-gray-500">
                              Tracking: {order.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No orders yet</p>
                      <Link href="/boxes" className="text-purple-600 hover:text-purple-700 text-sm">
                        Start shopping →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards */}
            {rewards && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rewards & Benefits</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Current Points</span>
                      <span className="text-2xl font-bold">{rewards.currentPoints}</span>
                    </div>
                    <div className="text-sm opacity-90">
                      {rewards.pointsNeeded} more points to reach {rewards.nextTier}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Available Rewards</h4>
                    <div className="space-y-2">
                      {rewards.availableRewards.map((reward, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{reward.name}</span>
                          <span className="text-purple-600 font-medium">{reward.points} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/cart"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl mr-3">🛒</span>
                  <span className="text-gray-900">View Cart</span>
                </Link>
                <Link 
                  href="/account/profile"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl mr-3">👤</span>
                  <span className="text-gray-900">Edit Profile</span>
                </Link>
                <Link 
                  href="/account/addresses"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl mr-3">📍</span>
                  <span className="text-gray-900">Manage Addresses</span>
                </Link>
                <Link 
                  href="/account/support"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl mr-3">📩</span>
                  <span className="text-gray-900">Get Support</span>
                </Link>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                <Link href="/account/addresses" className="text-purple-600 hover:text-purple-700 text-sm">
                  Manage →
                </Link>
              </div>
              <div className="space-y-3">
                {savedAddresses.length > 0 ? (
                  savedAddresses.slice(0, 2).map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{address.firstName} {address.lastName}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} {address.pincode}</p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No addresses saved</p>
                    <Link href="/account/addresses" className="text-purple-600 hover:text-purple-700 text-sm">
                      Add Address →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 