'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { boxesAPI } from '../../lib/api.js';

// --- Filter & Sort Options ---
const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-200', label: 'Under ₹200' },
  { value: '200-400', label: '₹200 - ₹400' },
  { value: '400-600', label: '₹400 - ₹600' },
  { value: '600+', label: 'Above ₹600' }
];

const OCCASIONS = [
  { value: 'all', label: 'All Occasions' },
  { value: 'any', label: 'Any Occasion' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'gift', label: 'Gift' },
  { value: 'special', label: 'Special Occasions' },
  { value: 'quick', label: 'Quick Treat' }
];

const BOX_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'premium', label: 'Premium' },
  { value: 'mini', label: 'Mini' },
  { value: 'gift', label: 'Gift' },
  { value: 'occasion', label: 'Occasion Specific' }
];

const GENDERS = [
  { value: 'all', label: 'All' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'couple', label: 'Couple' }
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
];

export default function BoxesPage() {
  const [filters, setFilters] = useState({
    priceRange: 'all',
    occasion: 'all',
    boxType: 'all',
    gender: 'all',
    sortBy: 'popular'
  });
  
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch Data ---
  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          category: filters.boxType !== 'all' ? filters.boxType : '',
          occasion: filters.occasion !== 'all' ? filters.occasion : '',
          minPrice: filters.priceRange.includes('-') ? filters.priceRange.split('-')[0] : '',
          maxPrice: filters.priceRange.includes('-') ? filters.priceRange.split('-')[1] : '',
          sortBy: filters.sortBy,
          sortOrder: filters.sortBy.includes('high') ? 'desc' : 'asc',
        });
        const data = await boxesAPI.getBoxes(`?${queryParams.toString()}`);
        setBoxes(data.boxes || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load boxes');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoxes();
  }, [filters]);
  
  // --- Filtering & Sorting ---
  const filteredBoxes = useMemo(() => {
    return boxes.filter(box => {
      const { priceRange, occasion, boxType, gender } = filters;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === '0-200' && box.price <= 200) ||
        (priceRange === '200-400' && box.price > 200 && box.price <= 400) ||
        (priceRange === '400-600' && box.price > 400 && box.price <= 600) ||
        (priceRange === '600+' && box.price > 600);

      const matchesOccasion = occasion === 'all' || box.occasion === occasion;
      const matchesType = boxType === 'all' || box.type === boxType;
      const matchesGender = gender === 'all' || box.gender === gender;

      return matchesPrice && matchesOccasion && matchesType && matchesGender;
    });
  }, [boxes, filters]);

  const sortedBoxes = useMemo(() => {
    const { sortBy } = filters;
    return [...filteredBoxes].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'newest': return b.id - a.id;
        default: return (b.popular || 0) - (a.popular || 0);
      }
    });
  }, [filteredBoxes, filters]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading mystery boxes...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 text-red-600">⚠️</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Explore Our Mystery Boxes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect surprise box for every occasion. Each box is carefully curated to bring joy and excitement.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Price Range', name: 'priceRange', options: PRICE_RANGES },
            { label: 'Occasion', name: 'occasion', options: OCCASIONS },
            { label: 'Box Type', name: 'boxType', options: BOX_TYPES },
            { label: 'For', name: 'gender', options: GENDERS },
            { label: 'Sort By', name: 'sortBy', options: SORT_OPTIONS }
          ].map(({ label, name, options }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <select
                value={filters[name]}
                onChange={e => setFilters(f => ({ ...f, [name]: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {sortedBoxes.length} of {boxes.length} boxes
            </p>
          </div>

          {/* Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBoxes.length > 0 ? (
              sortedBoxes.map(box => (
                <div key={box._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden relative">
                  {box.isPopular && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs">Popular</span>
                  )}
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-2">{box.image || '📦'}</div>
                    <h3 className="text-lg font-semibold mb-2">{box.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{box.shortDescription}</p>

                    {/* Rating */}
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < Math.floor(box.rating || 4.5) ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({box.reviews || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold">₹{box.price}</span>
                      {box.originalPrice > box.price && (
                        <>
                          <span className="ml-2 text-lg text-gray-500 line-through">₹{box.originalPrice}</span>
                          <div className="text-sm text-green-600 font-medium">
                            {Math.round(((box.originalPrice - box.price) / box.originalPrice) * 100)}% OFF
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <Link
                      href={`/boxes/${box.slug || box._id}`}
                      className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      View Details
                    </Link>
                    <button className="mt-2 w-full bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No boxes found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find what you’re looking for.</p>
                <button
                  onClick={() => setFilters({
                    priceRange: 'all',
                    occasion: 'all',
                    boxType: 'all',
                    gender: 'all',
                    sortBy: 'popular'
                  })}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
