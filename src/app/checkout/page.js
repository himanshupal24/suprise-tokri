'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart data
  const cartItems = [
    {
      id: 1,
      name: 'Mystery Snack Box',
      price: 599,
      quantity: 2,
      image: '🎁'
    },
    {
      id: 2,
      name: 'Valentine Special Box',
      price: 899,
      quantity: 1,
      image: '💝'
    }
  ];

  // Mock addresses
  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Priya Sharma',
      address: '123, Sunshine Apartments, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Priya Sharma',
      address: '456, Tech Park, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = deliveryOption === 'express' ? 100 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your order</p>
            </div>
            <Link href="/cart" className="text-purple-600 hover:text-purple-700">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`ml-2 ${activeStep >= 1 ? 'text-purple-600' : 'text-gray-600'}`}>
                Address
              </div>
            </div>
            <div className={`w-16 h-1 mx-4 ${activeStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`ml-2 ${activeStep >= 2 ? 'text-purple-600' : 'text-gray-600'}`}>
                Payment
              </div>
            </div>
            <div className={`w-16 h-1 mx-4 ${activeStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div className={`ml-2 ${activeStep >= 3 ? 'text-purple-600' : 'text-gray-600'}`}>
                Review
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            {activeStep === 1 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-900">{address.type}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium text-gray-900">{address.name}</p>
                              <p>{address.address}</p>
                              <p>{address.city}, {address.state} {address.pincode}</p>
                              <p>{address.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      + Add New Address
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">📱</span>
                            <span className="font-medium text-gray-900">UPI Payment</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay using UPI apps like Google Pay, PhonePe, Paytm
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">💵</span>
                            <span className="font-medium text-gray-900">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {activeStep === 3 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Review Order</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {(() => {
                          const address = addresses.find(a => a.id === selectedAddress);
                          return (
                            <div className="text-sm text-gray-600">
                              <p className="font-medium text-gray-900">{address.name}</p>
                              <p>{address.address}</p>
                              <p>{address.city}, {address.state} {address.pincode}</p>
                              <p>{address.phone}</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">{item.image}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Delivery Options */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Delivery Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'standard'}
                      onChange={() => setDeliveryOption('standard')}
                    />
                    <span className="text-sm">Standard Delivery (3-5 days) - ₹50</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'express'}
                      onChange={() => setDeliveryOption('express')}
                    />
                    <span className="text-sm">Express Delivery (1-2 days) - ₹100</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{shipping}</span>
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
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Privacy</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">Your payment information is encrypted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-medium text-gray-900">Privacy Protected</p>
                    <p className="text-sm text-gray-600">We never share your personal data</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-medium text-gray-900">Money Back Guarantee</p>
                    <p className="text-sm text-gray-600">30-day return policy for damaged items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 