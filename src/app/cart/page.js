'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Mystery Snack Box',
      price: 599,
      originalPrice: 799,
      image: '🎁',
      description: 'A delightful collection of premium snacks and treats',
      quantity: 2,
      occasion: 'Birthday',
      estimatedDelivery: '3-5 days'
    },
    {
      id: 2,
      name: 'Valentine Special Box',
      price: 899,
      originalPrice: 999,
      image: '💝',
      description: 'Romantic surprises for your special someone',
      quantity: 1,
      occasion: 'Valentine\'s Day',
      estimatedDelivery: '2-4 days'
    },
    {
      id: 3,
      name: 'Friendship Day Box',
      price: 499,
      originalPrice: 599,
      image: '🤝',
      description: 'Perfect gifts to celebrate friendship',
      quantity: 1,
      occasion: 'Friendship Day',
      estimatedDelivery: '3-5 days'
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 10 });
      alert('Coupon applied! 10% discount added.');
    } else if (couponCode.toLowerCase() === 'first50') {
      setAppliedCoupon({ code: 'FIRST50', discount: 50 });
      alert('Coupon applied! ₹50 discount added.');
    } else {
      alert('Invalid coupon code. Please try again.');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (appliedCoupon.code === 'WELCOME10' ? subtotal * 0.1 : appliedCoupon.discount) : 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + shipping + tax;

  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{cartItems.length} items in your cart</p>
            </div>
            <Link href="/boxes" className="text-purple-600 hover:text-purple-700">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
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
                          <span className="text-3xl">{item.image}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-purple-600 font-medium">{item.occasion}</span>
                                <span className="text-sm text-gray-500">Delivery: {item.estimatedDelivery}</span>
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
                                <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                              </div>
                              <p className="text-sm text-gray-600">Total: ₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              {savings > 0 && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <p className="font-medium text-green-800">You're saving ₹{savings}!</p>
                      <p className="text-sm text-green-600">Great deals on selected items</p>
                    </div>
                  </div>
                </div>
              )}
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
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="text-gray-900">₹{subtotal}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    💳 Proceed to Checkout
                  </Link>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-medium text-gray-900">Free shipping on orders above ₹1000</p>
                      <p className="text-sm text-gray-600">Standard delivery: 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="font-medium text-gray-900">Easy returns</p>
                      <p className="text-sm text-gray-600">30-day return policy for damaged items</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="font-medium text-gray-900">Secure checkout</p>
                      <p className="text-sm text-gray-600">Your data is protected with SSL encryption</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎂</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Birthday Cake Box</p>
                      <p className="text-sm text-gray-600">₹699</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Add
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎉</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Party Essentials Box</p>
                      <p className="text-sm text-gray-600">₹599</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Add
                    </button>
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