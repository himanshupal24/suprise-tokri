'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function InfluencersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', handle: '', platform: 'Instagram', followersNumber: '', commissionRate: '', email: '' });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getInfluencers();
        setList(res?.data || []);
      } catch (e) {
        console.error('Load influencers failed', e);
        setError('Failed to load influencers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const influencers = [
    {
      id: 1,
      name: 'Priya Sharma',
      handle: '@priya_sharma',
      platform: 'Instagram',
      followers: '125K',
      engagement: '4.2%',
      category: 'Lifestyle',
      status: 'active',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      commission: '10%',
      totalSales: 45000,
      lastCampaign: '2024-03-15'
    },
    {
      id: 2,
      name: 'Rahul Patel',
      handle: '@rahul_foodie',
      platform: 'YouTube',
      followers: '89K',
      engagement: '6.8%',
      category: 'Food',
      status: 'active',
      email: 'rahul.patel@email.com',
      phone: '+91 87654 32109',
      commission: '12%',
      totalSales: 32000,
      lastCampaign: '2024-03-18'
    },
    {
      id: 3,
      name: 'Neha Singh',
      handle: '@neha_lifestyle',
      platform: 'Instagram',
      followers: '67K',
      engagement: '3.9%',
      category: 'Lifestyle',
      status: 'pending',
      email: 'neha.singh@email.com',
      phone: '+91 76543 21098',
      commission: '8%',
      totalSales: 18000,
      lastCampaign: '2024-02-28'
    },
    {
      id: 4,
      name: 'Amit Kumar',
      handle: '@amit_tech',
      platform: 'YouTube',
      followers: '234K',
      engagement: '5.1%',
      category: 'Technology',
      status: 'active',
      email: 'amit.kumar@email.com',
      phone: '+91 65432 10987',
      commission: '15%',
      totalSales: 78000,
      lastCampaign: '2024-03-20'
    },
    {
      id: 5,
      name: 'Sneha Reddy',
      handle: '@sneha_beauty',
      platform: 'Instagram',
      followers: '156K',
      engagement: '4.7%',
      category: 'Beauty',
      status: 'inactive',
      email: 'sneha.reddy@email.com',
      phone: '+91 54321 09876',
      commission: '10%',
      totalSales: 25000,
      lastCampaign: '2024-01-15'
    }
  ];

  const categories = ['All', 'Lifestyle', 'Food', 'Technology', 'Beauty', 'Fashion'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Influencer Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add Influencer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Influencers</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹2.1M</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold text-gray-900">4.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category.toLowerCase())}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === category.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search influencers..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Influencers Grid */}
        {error && (
          <div className="mb-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3">{error}</div>
        )}
        {loading ? (
          <div className="text-sm text-gray-600">Loading influencers...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((influencer) => (
            <div key={influencer._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {influencer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                      <p className="text-sm text-gray-600">{influencer.handle || ''}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    influencer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : influencer.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {influencer.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">{influencer.platform}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-medium">{influencer.followersNumber?.toLocaleString?.() || influencer.followersNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement:</span>
                    <span className="font-medium">{influencer.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium">{influencer.commissionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-medium">₹{(influencer.totalSales || 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button onClick={async () => {
                    try {
                      await adminAPI.updateInfluencer(influencer._id, { status: influencer.status === 'pending' ? 'active' : 'inactive' });
                      const res = await adminAPI.getInfluencers();
                      setList(res.data || []);
                    } catch (e) { console.error(e); }
                  }} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    {influencer.status === 'pending' ? 'Approve' : 'Toggle Active'}
                  </button>
                  <button onClick={async () => { try { await adminAPI.deleteInfluencer(influencer._id); const res = await adminAPI.getInfluencers(); setList(res.data || []);} catch (e) {} }} className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Add Influencer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Influencer</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const payload = {
                    name: form.name,
                    handle: form.handle,
                    platform: form.platform,
                    followersNumber: Number(String(form.followersNumber).replace(/[^0-9]/g, '')) || 0,
                    commissionRate: Number(String(form.commissionRate).replace(/[^0-9.]/g, '')) || 0,
                    email: form.email,
                    status: 'active',
                  };
                  await adminAPI.createInfluencer(payload);
                  setShowAddModal(false);
                  const res = await adminAPI.getInfluencers();
                  setList(res.data || []);
                  setForm({ name: '', handle: '', platform: 'Instagram', followersNumber: '', commissionRate: '', email: '' });
                } catch (e) {
                  console.error('Create influencer failed', e);
                }
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter influencer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={(e) => setForm(f => ({ ...f, handle: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select value={form.platform} onChange={(e) => setForm(f => ({ ...f, platform: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Followers
                  </label>
                  <input
                    type="text"
                    value={form.followersNumber}
                    onChange={(e) => setForm(f => ({ ...f, followersNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="100K"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate
                  </label>
                  <input
                    type="text"
                    value={form.commissionRate}
                    onChange={(e) => setForm(f => ({ ...f, commissionRate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="10%"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="influencer@email.com"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add Influencer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 