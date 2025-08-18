export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Returns & Refunds Policy</h1>
              <p className="text-purple-100">Last updated: December 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                At Surprise Tokri, we want you to be completely satisfied with your mystery box experience. 
                We understand that sometimes a product may not meet your expectations, and we're here to help 
                make it right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Eligibility for Returns</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Returns are accepted within 7 days of delivery</li>
                    <li>Product must be in original, unopened condition</li>
                    <li>Original packaging must be intact</li>
                    <li>Return request must be submitted through your account dashboard</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Non-Returnable Items</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Opened or partially consumed mystery boxes</li>
                    <li>Personalized or custom boxes</li>
                    <li>Items damaged due to customer handling</li>
                    <li>Perishable items or snacks with expired dates</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Process</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Submit Request</h3>
                  <p className="text-gray-600 text-sm">
                    Log into your account and submit a return request through the order details page
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Get Approval</h3>
                  <p className="text-gray-600 text-sm">
                    Our team will review your request and provide return instructions within 24 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Ship & Refund</h3>
                  <p className="text-gray-600 text-sm">
                    Ship the item back and receive your refund once we process the return
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Policy</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-2">Refund Processing</h3>
                  <ul className="list-disc list-inside text-green-800 space-y-1">
                    <li>Refunds are processed within 3-5 business days after receiving the return</li>
                    <li>Full refund of the product price (excluding shipping costs)</li>
                    <li>Refund method will match your original payment method</li>
                    <li>You will receive an email confirmation once the refund is processed</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Shipping Costs</h3>
                  <p className="text-yellow-800">
                    Return shipping costs are the responsibility of the customer unless the return is due to 
                    our error (wrong item, damaged item, etc.). In such cases, we will provide a prepaid 
                    return label.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Defective Items</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-900 mb-2">Immediate Action Required</h3>
                <p className="text-red-800 mb-3">
                  If you receive a damaged or defective item, please:
                </p>
                <ul className="list-disc list-inside text-red-800 space-y-1">
                  <li>Take photos of the damage within 24 hours of delivery</li>
                  <li>Contact our support team immediately</li>
                  <li>Do not open or consume damaged items</li>
                  <li>We will arrange for a replacement or full refund</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-3">
                  For any questions about returns or refunds, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> support@surprisetokri.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +91-9876543210
                  </p>
                  <p className="text-gray-600">
                    <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notes</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">⚠️</span>
                  <p className="text-gray-600">
                    Return requests must be submitted within 7 days of delivery. Late requests will not be accepted.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">📦</span>
                  <p className="text-gray-600">
                    Items must be returned in their original packaging with all seals intact.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">💳</span>
                  <p className="text-gray-600">
                    Refunds may take 5-10 business days to appear in your account, depending on your bank.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">🎁</span>
                  <p className="text-gray-600">
                    Mystery boxes are designed to be a surprise experience. We cannot guarantee specific items in each box.
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