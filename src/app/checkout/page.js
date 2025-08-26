'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { userAPI, cartAPI } from '@/lib/api';

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ itemCount: 0, totalQuantity: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError('');
      // Load addresses
      const addrRes = await userAPI.getAddresses();
      const fetchedAddresses = addrRes.addresses || [];
      setAddresses(fetchedAddresses);
      const defaultAddress = fetchedAddresses.find(a => a.isDefault) || fetchedAddresses[0] || null;
      setSelectedAddress(defaultAddress ? defaultAddress.id : null);

      // Validate checkout from cart
      const validateRes = await fetch('/api/checkout', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } });
      if (!validateRes.ok) {
        const err = await validateRes.json().catch(() => ({ error: 'Checkout validation failed' }));
        throw new Error(err.error || 'Checkout validation failed');
      }
      const validateData = await validateRes.json();
      setItems(validateData.items || []);
      setSummary(validateData.summary || { itemCount: 0, totalQuantity: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 });
    } catch (e) {
      setError(e?.message || 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const shippingAmount = useMemo(() => (deliveryOption === 'express' ? summary.shipping + 50 : summary.shipping), [deliveryOption, summary.shipping]);
  const totalAmount = useMemo(() => summary.subtotal + shippingAmount + summary.tax, [summary.subtotal, shippingAmount, summary.tax]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    try {
      setIsProcessing(true);
      const shippingAddress = addresses.find(a => a.id === selectedAddress);
      const orderRes = await cartAPI.createOrder({
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
        paymentDetails: {},
        useCartItems: true,
        notes: ''
      });
      alert('Order placed successfully! Order Number: ' + orderRes?.order?.orderNumber);
      setIsProcessing(false);
    } catch (e) {
      setIsProcessing(false);
      alert(e?.message || 'Failed to place order');
    }
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
              
 Back to Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading checkout...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
        <>
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

                    <div className="mt-6">
                      <button
                        onClick={() => setActiveStep(3)}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {activeStep === 3 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                    <div className="space-y-3">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                              <span>{it.box?.image || '🎁'}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{it.box?.name}</p>
                              <p className="text-sm text-gray-600">Qty: {it.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900">
{it.total}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isProcessing}
                      onClick={handlePlaceOrder}
                      className={`w-full ${isProcessing ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white py-3 rounded-lg font-semibold`}
                    >
                      {isProcessing ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({summary.totalQuantity} items)</span>
                  <span className="text-gray-900">
{summary.subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping ({deliveryOption === 'express' ? 'Express' : 'Standard'})</span>
                  <span className="text-gray-900">
{shippingAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">
{summary.tax}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
{totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
} 