'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userAPI } from '../../lib/api.js';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const data = await userAPI.getWishlist();
        setWishlist(data.wishlist);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await userAPI.removeFromWishlist(itemId);
      // Remove item from local state
      setWishlist(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId),
        itemCount: prev.itemCount - 1
      }));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (boxId) => {
    try {
      // This would integrate with cart API when implemented
      alert('Add to cart functionality will be implemented');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlist ? `${wishlist.itemCount} item${wishlist.itemCount !== 1 ? 's' : ''}` : 'Your saved items'}
              </p>
            </div>
            <Link href="/boxes" className="text-purple-600 hover:text-purple-700">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {wishlist && wishlist.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding items to your wishlist to save them for later!
            </p>
            <Link 
              href="/boxes" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Browse Mystery Boxes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist?.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.box.image} 
                    alt={item.box.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    ×
                  </button>
                  {item.box.isPopular && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.box.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.box.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{item.box.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    {item.box.category && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {item.box.category}
                      </span>
                    )}
                    {item.box.occasion && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {item.box.occasion}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item.box.id)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/boxes/${item.box.id}`}
                      className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {wishlist && wishlist.items.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 mb-4">
                Based on your wishlist, here are some recommendations for you:
              </p>
              <Link 
                href="/boxes" 
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Browse More Boxes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 