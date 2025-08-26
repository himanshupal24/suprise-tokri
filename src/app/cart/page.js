'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cartAPI } from '@/lib/api';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ itemCount: 0, totalQuantity: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await cartAPI.getCart();
      setCartItems(data.cart || []);
      setSummary(data.summary || { itemCount: 0, totalQuantity: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 });
    } catch (err) {
      setError(err?.message || 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateCartItem(id, newQuantity);
      await loadCart();
    } catch (err) {
      alert(err?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await cartAPI.removeFromCart(id);
      await loadCart();
    } catch (err) {
      alert(err?.message || 'Failed to remove item');
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 10 });
      alert('Coupon applied! 10% discount added (display only).');
    } else if (couponCode.toLowerCase() === 'first50') {
      setAppliedCoupon({ code: 'FIRST50', discount: 50 });
      alert('Coupon applied! 50 discount added (display only).');
    } else {
      alert('Invalid coupon code. Please try again.');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const displayedSubtotal = summary.subtotal;
  const displayedDiscount = appliedCoupon ? (appliedCoupon.code === 'WELCOME10' ? Math.round(displayedSubtotal * 0.1) : appliedCoupon.discount) : 0;
  const displayedShipping = summary.shipping;
  const displayedTax = summary.tax;
  const displayedTotal = displayedSubtotal - displayedDiscount + displayedShipping + displayedTax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{summary.totalQuantity} items in your cart</p>
            </div>
            <Link href="/boxes" className="text-purple-600 hover:text-purple-700">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading your cart...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/boxes" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">{item.box?.image || '🎁'}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.box?.name}</h3>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-purple-600 font-medium">{item.box?.category || 'Box'}</span>
                                {typeof item.box?.stock === 'number' && (
                                  <span className="text-sm text-gray-500">Stock: {item.box.stock}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">₹{item.box?.price}</span>
                              </div>
                              <p className="text-sm text-gray-600">Total: ₹{item.total}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Coupon Section */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm text-green-800">
                        Coupon {appliedCoupon.code} applied
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({summary.totalQuantity} items)</span>
                    <span className="text-gray-900">₹{displayedSubtotal}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{displayedDiscount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {displayedShipping === 0 ? 'Free' : `₹${displayedShipping}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₹{displayedTax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">₹{displayedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Proceed to Checkout
                </Link>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="font-medium text-purple-800">Free shipping on orders over ₹500</p>
                    <p className="text-sm text-purple-700">Secure checkout and easy returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 