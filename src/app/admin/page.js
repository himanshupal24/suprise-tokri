'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboard();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
        // Fallback to mock data if API fails
        setDashboardData({
          overview: {
            currentMonthRevenue: 45678,
            currentMonthOrders: 1234,
            totalUsers: 567,
            totalOrders: 1234,
            totalRevenue: 45678,
            revenueGrowth: 12.5,
            ordersGrowth: 8.3
          },
          recentOrders: [
            {
              id: '1',
              orderNumber: 'ORD-20241201-001',
              customer: 'John Doe',
              total: 1299,
              status: 'Pending',
              createdAt: new Date()
            },
            {
              id: '2',
              orderNumber: 'ORD-20241201-002',
              customer: 'Jane Smith',
              total: 899,
              status: 'Shipped',
              createdAt: new Date(Date.now() - 15 * 60 * 1000)
            }
          ],
          topSellingBoxes: [
            {
              name: 'Birthday Surprise Box',
              category: 'Birthday',
              price: 1299,
              totalSold: 45,
              totalRevenue: 58455
            }
          ],
          pendingTickets: [
            {
              id: '1',
              ticketNumber: 'TKT-001',
              subject: 'Order Delivery Issue',
              priority: 'High',
              status: 'Open',
              customer: 'John Doe',
              createdAt: new Date()
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const adminSections = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: '📊',
      description: 'Overview and key metrics'
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: '📈',
      description: 'Sales and performance analytics'
    },
    {
      title: 'Boxes',
      href: '/admin/boxes',
      icon: '📦',
      description: 'Manage mystery boxes and products'
    },
    {
      title: 'Customers',
      href: '/admin/customers',
      icon: '👥',
      description: 'Customer management and profiles'
    },
    {
      title: 'Influencers',
      href: '/admin/influencers',
      icon: '🌟',
      description: 'Influencer partnerships and campaigns'
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: '🛒',
      description: 'Order management and tracking'
    },
    {
      title: 'Support',
      href: '/admin/support',
      icon: '💬',
      description: 'Customer support and inquiries'
    }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                Logout
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.totalOrders?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.totalRevenue ? formatCurrency(dashboardData.overview.totalRevenue) : '₹0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.totalUsers?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{section.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.recentOrders?.slice(0, 3).map((order, index) => (
                <div key={order.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'Pending' ? 'bg-yellow-400' :
                    order.status === 'Shipped' ? 'bg-blue-400' :
                    order.status === 'Delivered' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    New order {order.orderNumber} received from {order.customer}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(order.createdAt)}
                  </span>
                </div>
              ))}
              {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">New order #1234 received from John Doe</span>
                    <span className="text-xs text-gray-400">2 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Box #567 shipped to Mumbai</span>
                    <span className="text-xs text-gray-400">15 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">New customer registration: Jane Smith</span>
                    <span className="text-xs text-gray-400">1 hour ago</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 