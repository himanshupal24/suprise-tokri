export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Shipping Information</h1>
              <p className="text-purple-100">Fast and reliable delivery across India</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                We understand that you're excited to receive your mystery box! We work with trusted 
                logistics partners to ensure your order reaches you safely and on time. Here's everything 
                you need to know about our shipping process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🚚</span>
                    <h3 className="text-lg font-medium text-green-900">Standard Delivery</h3>
                  </div>
                  <ul className="space-y-2 text-green-800">
                    <li>• 3-5 business days</li>
                    <li>• Free on orders above ₹499</li>
                    <li>• ₹99 for orders below ₹499</li>
                    <li>• Tracking number provided</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">⚡</span>
                    <h3 className="text-lg font-medium text-blue-900">Express Delivery</h3>
                  </div>
                  <ul className="space-y-2 text-blue-800">
                    <li>• 1-2 business days</li>
                    <li>• Additional ₹150 charge</li>
                    <li>• Priority processing</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Areas</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Metro Cities</h3>
                  <p className="text-gray-600 mb-2">Next-day delivery available in:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <span className="text-gray-600">• Mumbai</span>
                    <span className="text-gray-600">• Delhi</span>
                    <span className="text-gray-600">• Bangalore</span>
                    <span className="text-gray-600">• Chennai</span>
                    <span className="text-gray-600">• Kolkata</span>
                    <span className="text-gray-600">• Hyderabad</span>
                    <span className="text-gray-600">• Pune</span>
                    <span className="text-gray-600">• Ahmedabad</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tier 2 & 3 Cities</h3>
                  <p className="text-gray-600">
                    Standard delivery (3-5 days) available across all major cities and towns in India. 
                    We deliver to over 25,000+ pin codes across the country.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Remote Areas</h3>
                  <p className="text-yellow-800">
                    For remote locations, delivery may take 5-7 business days. Additional charges may apply 
                    for very remote areas. We'll notify you during checkout if any additional charges apply.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Processing</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Placed</h3>
                  <p className="text-gray-600 text-sm">
                    Order confirmation sent immediately
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Processing</h3>
                  <p className="text-gray-600 text-sm">
                    Order prepared within 24 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipped</h3>
                  <p className="text-gray-600 text-sm">
                    Tracking number sent via email
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">4</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivered</h3>
                  <p className="text-gray-600 text-sm">
                    Package delivered to your doorstep
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Real-Time Tracking</h3>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Track your order through your account dashboard</li>
                    <li>Receive SMS and email updates at each stage</li>
                    <li>Get delivery notifications and estimated arrival time</li>
                    <li>Contact delivery partner directly if needed</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking Information</h3>
                  <p className="text-gray-600 mb-3">
                    Once your order is shipped, you'll receive:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Tracking number via email and SMS</li>
                    <li>Link to track your package in real-time</li>
                    <li>Estimated delivery date and time</li>
                    <li>Delivery partner contact information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Instructions</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-2">Successful Delivery</h3>
                  <ul className="list-disc list-inside text-green-800 space-y-1">
                    <li>Ensure someone is available at the delivery address</li>
                    <li>Keep your phone number active for delivery calls</li>
                    <li>Provide clear delivery instructions in your address</li>
                    <li>Check the package for any visible damage before accepting</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Failed Delivery</h3>
                  <p className="text-yellow-800 mb-3">
                    If delivery fails, we will:
                  </p>
                  <ul className="list-disc list-inside text-yellow-800 space-y-1">
                    <li>Attempt delivery again the next business day</li>
                    <li>Contact you to reschedule delivery</li>
                    <li>Hold the package for 3 days before returning</li>
                    <li>Process refund if delivery cannot be completed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Charges</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Value</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Standard Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Express Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Below ₹499</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹99</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹249</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">₹499 - ₹999</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">FREE</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹150</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Above ₹999</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">FREE</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notes</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">📅</span>
                  <p className="text-gray-600">
                    Delivery times are estimates and may vary due to weather, holidays, or other factors.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">📦</span>
                  <p className="text-gray-600">
                    All packages are carefully packed to ensure your mystery box arrives in perfect condition.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">🔒</span>
                  <p className="text-gray-600">
                    We use tamper-evident packaging to ensure the surprise element is maintained.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">📞</span>
                  <p className="text-gray-600">
                    For any shipping-related queries, contact us at support@surprisetokri.com or call +91-9876543210.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 