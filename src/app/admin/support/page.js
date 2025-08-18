'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '../../../lib/api.js';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketStats, setTicketStats] = useState({
    openTickets: 0,
    inProgress: 0,
    resolved: 0,
    avgResponse: '2.3h'
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [manageOpen, setManageOpen] = useState(false);
  const [manageForm, setManageForm] = useState({ status: '', priority: '', assignedTo: '', tags: '', estimatedResolution: '', internalNotes: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch support tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeTab !== 'all') {
          params.category = activeTab;
        }
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }
        
        const response = await adminAPI.getSupportTickets(params);
        setTickets(response.data.tickets);
        
        // Set stats from response
        if (response.data.stats) {
          setTicketStats({
            openTickets: response.data.stats.openTickets || 0,
            inProgress: response.data.stats.inProgress || 0,
            resolved: response.data.stats.resolvedTickets || 0,
            avgResponse: response.data.stats.avgResponseTime || '2.3h'
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch support tickets:', err);
        setError('Failed to load support tickets');
        // Fallback to mock data if API fails
        setTickets([
          {
            _id: 'TKT-2024-001',
            ticketNumber: 'TKT-2024-001',
            user: {
              firstName: 'Rahul',
              lastName: 'Sharma',
              email: 'rahul.sharma@email.com',
              phone: '+91 98765 43210'
            },
            subject: 'Order not delivered on time',
            description: 'I ordered a mystery box on March 20th and it was supposed to be delivered by March 23rd, but I haven\'t received it yet. Can you please check the status?',
            category: 'Delivery',
            priority: 'High',
            status: 'Open',
            createdAt: '2024-03-24',
            updatedAt: '2024-03-24',
            assignedTo: 'Support Team',
            order: { orderNumber: 'ORD-2024-003' }
          },
          {
            _id: 'TKT-2024-002',
            ticketNumber: 'TKT-2024-002',
            user: {
              firstName: 'Priya',
              lastName: 'Patel',
              email: 'priya.patel@email.com',
              phone: '+91 87654 32109'
            },
            subject: 'Wrong items in mystery box',
            description: 'I received my mystery box today but it contained items that were not what I expected. Some snacks were expired and others were damaged. Please help me with a replacement.',
            category: 'Quality',
            priority: 'High',
            status: 'In Progress',
            createdAt: '2024-03-23',
            updatedAt: '2024-03-24',
            assignedTo: 'Quality Team',
            order: { orderNumber: 'ORD-2024-002' }
          }
        ]);
        setTicketStats({
          openTickets: 12,
          inProgress: 8,
          resolved: 156,
          avgResponse: '2.3h'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [activeTab, statusFilter]);

  const categories = ['All', 'Delivery', 'Quality', 'Payment', 'Subscription', 'Technical'];
  const statuses = ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting for customer': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReply = (ticket) => {
    setSelectedTicket(ticket);
    setShowReplyModal(true);
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      await adminAPI.replyToTicket(selectedTicket.id || selectedTicket._id, { message: replyMessage.trim() });
      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedTicket(null);
      // Refresh tickets after reply
      const params = {};
      if (activeTab !== 'all') params.category = activeTab;
      const response = await adminAPI.getSupportTickets(params);
      setTickets(response.data.tickets);
    } catch (err) {
      console.error('Failed to send reply:', err);
      setError('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support tickets...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Support Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                New Ticket
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
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">📞</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.openTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.resolved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Response</p>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.avgResponse}</p>
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for Customer">Waiting for Customer</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <input
                type="text"
                placeholder="Search tickets..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.user.firstName} {ticket.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{ticket.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {ticket.description?.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.assignedTo || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleReply(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Reply
                        </button>
                        <button onClick={() => handleView(ticket)} className="text-gray-600 hover:text-gray-900">View</button>
                        <button onClick={() => { setSelectedTicket(ticket); setManageOpen(true); setManageForm({ status: ticket.status || '', priority: ticket.priority || '', assignedTo: ticket.assignedTo || '', tags: (ticket.tags||[]).join(', '), estimatedResolution: ticket.estimatedResolution ? new Date(ticket.estimatedResolution).toISOString().slice(0,16) : '', internalNotes: ticket.internalNotes || '' }); }} className="text-green-600 hover:text-green-900">Manage</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reply to Ticket</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Original Message</h4>
              <p className="text-sm text-gray-600">{selectedTicket.description}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="4"
                placeholder="Type your response here..."
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSendReply}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Send Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                  setSelectedTicket(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                <p className="text-sm text-gray-600">#{selectedTicket.ticketNumber}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <div className="text-sm text-gray-700">
                  <div className="mb-1"><span className="text-gray-500">Subject:</span> {selectedTicket.subject}</div>
                  <div className="mb-1"><span className="text-gray-500">Category:</span> {selectedTicket.category}</div>
                  <div className="mb-1"><span className="text-gray-500">Priority:</span> {selectedTicket.priority}</div>
                  <div className="mb-1"><span className="text-gray-500">Status:</span> {selectedTicket.status}</div>
                  <div className="mb-1"><span className="text-gray-500">Assigned To:</span> {selectedTicket.assignedTo || 'Unassigned'}</div>
                  <div className="mb-1"><span className="text-gray-500">Order:</span> {selectedTicket.order?.orderNumber || '—'}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                <div className="text-sm text-gray-700">
                  <div className="mb-1">{selectedTicket.user?.firstName} {selectedTicket.user?.lastName}</div>
                  <div className="mb-1">{selectedTicket.user?.email}</div>
                  <div className="mb-1">{selectedTicket.user?.phone}</div>
                  <div className="mb-1 text-gray-500">Created: {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : ''}</div>
                  <div className="mb-1 text-gray-500">Updated: {selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString() : ''}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Conversation</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedTicket.messages?.length ? selectedTicket.messages.map((msg, idx) => (
                  <div key={msg._id || idx} className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded text-xs ${msg.sender === 'user' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {msg.sender}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500">No messages yet.</div>
                )}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {manageOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Ticket</h3>
              <button onClick={() => setManageOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={manageForm.status} onChange={e => setManageForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={manageForm.priority} onChange={e => setManageForm(f => ({ ...f, priority: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input value={manageForm.tags} onChange={e => setManageForm(f => ({ ...f, tags: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Resolution</label>
                <input type="datetime-local" value={manageForm.estimatedResolution} onChange={e => setManageForm(f => ({ ...f, estimatedResolution: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea rows={3} value={manageForm.internalNotes} onChange={e => setManageForm(f => ({ ...f, internalNotes: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={async () => {
                try {
                  const payload = {
                    status: manageForm.status,
                    priority: manageForm.priority,
                    internalNotes: manageForm.internalNotes,
                    estimatedResolution: manageForm.estimatedResolution || undefined,
                    tags: manageForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                  };
                  await adminAPI.updateSupportTicket(selectedTicket.id, payload);
                  setManageOpen(false);
                  // refresh
                  const params = {};
                  if (activeTab !== 'all') params.category = activeTab;
                  const response = await adminAPI.getSupportTickets(params);
                  setTickets(response.data.tickets);
                } catch (e) {
                  console.error('Update ticket failed', e);
                  setError('Failed to update ticket');
                }
              }} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Save</button>
              <button onClick={() => setManageOpen(false)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 