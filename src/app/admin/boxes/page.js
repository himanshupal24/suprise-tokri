'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../../lib/api.js';

// Default form function
function getDefaultForm() {
  return {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    occasion: '',
    gender: 'unisex',
    ageGroup: 'all',
    images: [],
    mainImage: '',
    items: [],
    totalItems: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    stock: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    seoKeywords: [],
    estimatedDelivery: '3-5 days',
    returnPolicy: '30 days return for damaged items',
    shippingInfo: { cost: '', method: '' },
    customization: {
      allowPersonalization: false,
      personalizationFields: [],
      maxCharacters: ''
    },
    isActive: true,
    isFeatured: false,
    isTrending: false
  };
}

// Modal component
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        {children}
        </div>
      </div>
    </div>
  );
}

// BoxForm component
function BoxForm({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  onCancel, 
  submitting, 
  formErrors,
  occasions,
  genders,
  ageGroups,
  categories,
  isEdit = false
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Box Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter box name"
            required
          />
          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
        <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.originalPrice ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {formErrors.originalPrice && <p className="mt-1 text-sm text-red-600">{formErrors.originalPrice}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            min="0"
            required
          />
          {formErrors.stock && <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select occasion</option>
            {occasions.map(occasion => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            formErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter detailed description of the box"
          required
        />
        {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          rows={2}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description (max 200 characters)"
          maxLength={200}
        />
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
            ))}
      </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
          <select
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ageGroups.map(age => (
              <option key={age} value={age}>{age.charAt(0).toUpperCase() + age.slice(1)}</option>
        ))}
      </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Items</label>
          <input
            type="number"
            name="totalItems"
            value={formData.totalItems}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.totalItems ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            min="1"
          />
          {formErrors.totalItems && <p className="mt-1 text-sm text-red-600">{formErrors.totalItems}</p>}
        </div>
      </div>

      {/* Dimensions and Weight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (g)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            min="0"
          />
          {formErrors.weight && <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
          <input
            type="number"
            name="dimensions.length"
            value={formData.dimensions.length}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
          <input
            type="number"
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      {/* Shipping Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (₹)</label>
          <input
            type="number"
            name="shippingInfo.cost"
            value={formData.shippingInfo.cost}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
          <input
            type="text"
            name="shippingInfo.method"
            value={formData.shippingInfo.method}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Standard, Express"
          />
        </div>
      </div>

      {/* Status Toggles */}
      <div className="flex space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Featured</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="isTrending"
            checked={formData.isTrending}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Trending</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Box' : 'Create Box')}
        </button>
      </div>
    </form>
  );
}

// BoxViewModal component
function BoxViewModal({ box, formatCurrency }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{box.name}</h2>
        <div className="flex items-center space-x-4 mt-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            box.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {box.isActive ? 'Active' : 'Inactive'}
          </span>
          {box.isFeatured && (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
          {box.isTrending && (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="text-sm text-gray-900">{box.category}</dd>
            </div>
            {box.occasion && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Occasion</dt>
                <dd className="text-sm text-gray-900">{box.occasion}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="text-sm text-gray-900 capitalize">{box.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Age Group</dt>
              <dd className="text-sm text-gray-900 capitalize">{box.ageGroup}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing & Stock</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Price</dt>
              <dd className="text-lg font-semibold text-gray-900">{formatCurrency(box.price)}</dd>
            </div>
            {box.originalPrice > box.price && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Original Price</dt>
                <dd className="text-sm text-gray-500 line-through">{formatCurrency(box.originalPrice)}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Stock</dt>
              <dd className="text-sm text-gray-900">{box.stock} units</dd>
            </div>
            {box.totalItems && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Items</dt>
                <dd className="text-sm text-gray-900">{box.totalItems} items</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700">{box.description}</p>
        {box.shortDescription && (
          <p className="text-gray-600 text-sm mt-2">{box.shortDescription}</p>
        )}
      </div>

      {/* Physical Details */}
      {(box.weight || box.dimensions?.length || box.dimensions?.width || box.dimensions?.height) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {box.weight && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="text-sm text-gray-900">{box.weight}g</dd>
              </div>
            )}
            {box.dimensions?.length && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Length</dt>
                <dd className="text-sm text-gray-900">{box.dimensions.length}cm</dd>
              </div>
            )}
            {box.dimensions?.width && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Width</dt>
                <dd className="text-sm text-gray-900">{box.dimensions.width}cm</dd>
              </div>
            )}
            {box.dimensions?.height && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Height</dt>
                <dd className="text-sm text-gray-900">{box.dimensions.height}cm</dd>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Information */}
      {(box.shippingInfo?.cost || box.shippingInfo?.method) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
          <dl className="space-y-2">
            {box.shippingInfo?.cost && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Shipping Cost</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(box.shippingInfo.cost)}</dd>
              </div>
            )}
            {box.shippingInfo?.method && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Shipping Method</dt>
                <dd className="text-sm text-gray-900">{box.shippingInfo.method}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Additional Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h3>
        <dl className="space-y-2">
          {box.estimatedDelivery && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
              <dd className="text-sm text-gray-900">{box.estimatedDelivery}</dd>
            </div>
          )}
          {box.returnPolicy && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Return Policy</dt>
              <dd className="text-sm text-gray-900">{box.returnPolicy}</dd>
            </div>
          )}
          {box.tags && box.tags.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="text-sm text-gray-900">
                <div className="flex flex-wrap gap-2 mt-1">
                  {box.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Timestamps */}
      <div className="border-t border-gray-200 pt-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <dt>Created</dt>
            <dd>{new Date(box.createdAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{new Date(box.updatedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function BoxesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(getDefaultForm());
  const [selectedBox, setSelectedBox] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const categories = ['All', 'Snacks', 'Premium', 'Mini', 'Gift'];
  const occasions = ['Birthday', 'Valentine', 'Friendship', 'Diwali', 'Holi', 'New Year', 'Anniversary', 'Graduation', 'Wedding', 'Other'];
  const genders = ['male', 'female', 'unisex'];
  const ageGroups = ['kids', 'teens', 'adults', 'all'];

  // Memoized fetch function
  const fetchBoxes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'all') params.category = activeTab;
      if (searchTerm) params.search = searchTerm;

      const res = await adminAPI.getBoxes(params);
      setBoxes(Array.isArray(res?.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch boxes:', err);
      setError('Failed to load boxes');
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm]);

  useEffect(() => {
    const delay = setTimeout(fetchBoxes, 300); // debounce search
    return () => clearTimeout(delay);
  }, [fetchBoxes]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) errors.name = 'Box name is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Valid stock quantity is required';
    if (formData.originalPrice && formData.originalPrice <= 0) errors.originalPrice = 'Original price must be greater than 0';
    if (formData.totalItems && formData.totalItems <= 0) errors.totalItems = 'Total items must be greater than 0';
    if (formData.weight && formData.weight <= 0) errors.weight = 'Weight must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminAPI.createBox(formData);
      setSuccess('Box created successfully!');
      setShowAddModal(false);
      resetForm();
      fetchBoxes();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to create box:', err);
      setError(err.message || 'Failed to create box');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBox?._id || !validateForm()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await adminAPI.updateBox(selectedBox._id, formData);
      setSuccess('Box updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchBoxes();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update box:', err);
      setError(err.message || 'Failed to update box');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBox?._id) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await adminAPI.deleteBox(selectedBox._id);
      setSuccess('Box deleted successfully!');
      setShowDeleteModal(false);
      setSelectedBox(null);
      fetchBoxes();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete box:', err);
      setError(err.message || 'Failed to delete box');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(getDefaultForm());
    setSelectedBox(null);
    setFormErrors({});
  };

  const openEditModal = (box) => {
    if (!box) return;
    setSelectedBox(box);
    setFormData({
      ...getDefaultForm(),
      ...box,
      dimensions: box.dimensions || { length: '', width: '', height: '' },
      shippingInfo: box.shippingInfo || { cost: '', method: '' },
      customization: box.customization || { allowPersonalization: false, personalizationFields: [], maxCharacters: '' }
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openViewModal = async (boxId) => {
    if (!boxId) return;
    try {
      const res = await adminAPI.getBoxById(boxId);
      setSelectedBox(res?.data?.box || null);
      setShowViewModal(true);
    } catch (err) {
      console.error('Failed to fetch box details:', err);
      setError('Failed to fetch box details');
    }
  };

  const openDeleteModal = (box) => {
    setSelectedBox(box);
    setShowDeleteModal(true);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading boxes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Box Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            + Add New Box
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        </div>
      )}
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat.toLowerCase())}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === cat.toLowerCase() 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search boxes by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {boxes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4m0 0L4 7m16 0v10l-8 4m0 0l-8-4m8 4V3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No boxes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new box.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Add New Box
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boxes.map((box) => (
              <div key={box._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{box.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      box.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {box.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{box.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {box.category}
                    </span>
                    <span className="font-semibold text-gray-900">{formatCurrency(box.price)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Stock: {box.stock}</span>
                    {box.originalPrice > box.price && (
                      <span className="line-through">{formatCurrency(box.originalPrice)}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(box)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openViewModal(box._id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openDeleteModal(box)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Box" onClose={() => setShowAddModal(false)}>
          <BoxForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            onCancel={() => setShowAddModal(false)}
            submitting={submitting}
            formErrors={formErrors}
            occasions={occasions}
            genders={genders}
            ageGroups={ageGroups}
            categories={categories.filter(cat => cat !== 'All')}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBox && (
        <Modal title="Edit Box" onClose={() => setShowEditModal(false)}>
          <BoxForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleEditSubmit}
            onCancel={() => setShowEditModal(false)}
            submitting={submitting}
            formErrors={formErrors}
            occasions={occasions}
            genders={genders}
            ageGroups={ageGroups}
            categories={categories.filter(cat => cat !== 'All')}
            isEdit={true}
          />
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedBox && (
        <Modal title="Box Details" onClose={() => setShowViewModal(false)}>
          <BoxViewModal box={selectedBox} formatCurrency={formatCurrency} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBox && (
        <Modal title="Delete Box" onClose={() => setShowDeleteModal(false)}>
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Delete Box</h3>
            <p className="mt-1 text-sm text-gray-500">
              Are you sure you want to delete &quot;{selectedBox.name}&quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
