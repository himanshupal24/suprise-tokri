'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const getAuthToken = () => localStorage.getItem('token');

  const formatAddressFromBackend = (addr) => ({
    id: addr.id,
    type: addr.type,
    name: addr.name,
    address: addr.address + (addr.landmark ? `, ${addr.landmark}` : ''),
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    phone: addr.phone,
    isDefault: addr.isDefault,
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch('/api/user/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch addresses');

        setAddresses(data.addresses.map(formatAddressFromBackend));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = getAuthToken();

  const body = {
    type: formData.type,
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    landmark: formData.landmark,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    isDefault: addresses.length === 0,
  };

  try {
    const url = editingAddress
      ? `/api/user/addresses/${editingAddress.id}`
      : '/api/user/addresses';

    const method = editingAddress ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save address');

    if (editingAddress) {
      // update existing address in state
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? formatAddressFromBackend(data.address) : a))
      );
    } else {
      // add new address
      setAddresses((prev) => [
        ...prev.map((a) => ({ ...a, isDefault: false })),
        formatAddressFromBackend(data.address),
      ]);
    }

    // reset form
    setShowAddModal(false);
    setEditingAddress(null);
    setFormData({
      type: '',
      name: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
    });
  } catch (err) {
    console.error('Save address error:', err);
    alert(err.message);
  }
};


const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this address?')) return;

  try {
    const token = getAuthToken();
    const res = await fetch(`/api/user/addresses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete address');

    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  } catch (err) {
    console.error('Delete error:', err);
    alert(err.message);
  }
};


  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address.split(',')[0]?.trim(),
      landmark: address.address.split(',')[1]?.trim() || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone
    });
    setShowAddModal(true);
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const getAddressIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'home': return '🏠';
      case 'office': return '🏢';
      case 'parents': return '👨‍👩‍👧‍👦';
      default: return '📍';
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading addresses...</div>;
  }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
                <p className="text-gray-600">Manage your delivery addresses</p>
              </div>
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add Address Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              ➕ Add New Address
            </button>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getAddressIcon(address.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{address.type}</h3>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.phone}</p>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      >
                        Set as Default
                      </button>
                    )}
                    <button className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                      Use for Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {addresses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No addresses saved</h2>
              <p className="text-gray-600 mb-8">Add your first delivery address to get started.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select type</option>
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Parents">Parents</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter complete address"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select state</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        maxLength="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter PIN code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingAddress(null);
                      setFormData({
                        type: '',
                        name: '',
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        phone: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } 