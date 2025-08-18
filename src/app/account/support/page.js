'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { userAPI } from '@/lib/api';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const categories = useMemo(() => [
    'Order Issue',
    'Product Question',
    'Payment Problem',
    'Delivery Issue',
    'Return/Refund',
    'Technical Support',
    'General Inquiry',
  ], []);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: categories[0],
    priority: 'Medium',
    orderId: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await userAPI.getSupportTickets();
        const list = res?.data?.tickets || [];
        if (mounted) setTickets(list);
      } catch (e) {
        console.error('Load tickets failed', e);
        if (mounted) setError('Failed to load your support tickets');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-yellow-600 bg-yellow-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      setSending(true);
      const res = await userAPI.addMessage(selectedTicket.id, { message: newMessage.trim() });
      const updated = res?.data;
      if (updated) {
        setTickets(prev => prev.map(t => t.id === updated._id || t.id === updated.id ? {
          ...t,
          messages: updated.messages,
          status: updated.status,
          updatedAt: updated.updatedAt,
        } : t));
        setSelectedTicket(prev => prev && prev.id === (updated._id || updated.id) ? {
          ...prev,
          messages: updated.messages,
          status: updated.status,
          updatedAt: updated.updatedAt,
        } : prev);
      }
      setNewMessage('');
    } catch (e) {
      console.error('Send message failed', e);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;
    try {
      setCreating(true);
      const payload = {
        subject: newTicket.subject.trim(),
        description: newTicket.description.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
        ...(newTicket.orderId ? { orderId: newTicket.orderId } : {}),
      };
      const res = await userAPI.createSupportTicket(payload);
      const created = res?.data;
      if (created) {
        setTickets(prev => [created, ...prev]);
        setSelectedTicket(created);
        setShowNewTicket(false);
        setNewTicket({ subject: '', description: '', category: categories[0], priority: 'Medium', orderId: '' });
      }
    } catch (e) {
      console.error('Create ticket failed', e);
      setError('Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600">Get help with your orders and account</p>
            </div>
            <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-6 text-sm text-gray-600">Loading your tickets...</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Tickets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
                  <button onClick={() => setShowNewTicket(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    ➕ New Ticket
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTicket?.id === ticket.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{ticket.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>{ticket.order?.orderNumber || 'General'}</span>
                        <span>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat/Messages */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedTicket.subject}</h2>
                      <p className="text-sm text-gray-600">
                        Ticket #{selectedTicket.id} • {selectedTicket.orderId && `Order ${selectedTicket.orderId}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {selectedTicket.messages.map((message, idx) => (
                      <div
                        key={message._id || idx}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedTicket.status !== 'Resolved' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                          {sending ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-600">Choose a support ticket from the list to view the conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Help */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">📞</span>
              <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
            <p className="font-medium text-gray-900">+91 1800-123-4567</p>
            <p className="text-sm text-gray-600">Mon-Sat: 9 AM - 8 PM</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">💬</span>
              <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
            </div>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Start Chat
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">📧</span>
              <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Send us an email</p>
            <p className="font-medium text-gray-900">support@surprisetokri.com</p>
            <p className="text-sm text-gray-600">Response within 24 hours</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">How do I track my order?</h3>
                <p className="text-sm text-gray-600">
                  You can track your order by going to your dashboard and clicking on the order details. 
                  You'll find the tracking number and current status there.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">What if I receive damaged items?</h3>
                <p className="text-sm text-gray-600">
                  If you receive damaged items, please take photos and contact our support team immediately. 
                  We'll arrange a replacement or refund.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Can I cancel my order?</h3>
                <p className="text-sm text-gray-600">
                  You can cancel your order within 2 hours of placing it. After that, please contact our 
                  support team for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showNewTicket && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create Support Ticket</h3>
            <button onClick={() => setShowNewTicket(false)} className="text-gray-500">✕</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket(t => ({ ...t, subject: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Briefly describe your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket(t => ({ ...t, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket(t => ({ ...t, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (optional)</label>
              <input
                type="text"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket(t => ({ ...t, orderId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="If related to an order"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket(t => ({ ...t, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={4}
                placeholder="Please provide details about your issue"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleCreateTicket}
              disabled={creating || !newTicket.subject.trim() || !newTicket.description.trim()}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Ticket'}
            </button>
            <button
              onClick={() => setShowNewTicket(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
} 