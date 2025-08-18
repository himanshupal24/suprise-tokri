'use client';

import Link from 'next/link';

export default function RefundPolicyPage() {
  const lastUpdated = "March 24, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Refund & Return Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 mb-4">
                  At Surprise Tokri, we want you to be completely satisfied with your mystery box experience. Due to the unique nature of our products, we have specific policies regarding returns and refunds. Please read this policy carefully before making a purchase.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">General Policy</h2>
                <p className="text-gray-600 mb-4">
                  Due to the surprise nature of our mystery boxes, we generally do not accept returns or provide refunds unless the product is damaged, defective, or there is an error on our part. This policy is designed to maintain the integrity of the surprise experience for all our customers.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">When Refunds Are Available</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Damaged or Defective Products</h3>
                <p className="text-gray-600 mb-4">
                  If your mystery box arrives damaged or contains defective items, we will provide a full refund or replacement. Please contact us within 48 hours of delivery with photos of the damage.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Shipping Errors</h3>
                <p className="text-gray-600 mb-4">
                  If we ship the wrong product or if your order is lost in transit, we will provide a full refund or replacement at no additional cost.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Cancellation Before Shipping</h3>
                <p className="text-gray-600 mb-4">
                  Orders can be cancelled within 2 hours of placement for a full refund. After 2 hours, cancellation depends on whether the order has been processed for shipping.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Quality Issues</h3>
                <p className="text-gray-600 mb-4">
                  If items in your box are expired, contaminated, or of unacceptable quality, we will provide a refund or replacement.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">When Refunds Are Not Available</h2>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>You simply don't like the items in your mystery box</li>
                  <li>You expected different items than what was included</li>
                  <li>You changed your mind after receiving the box</li>
                  <li>The box was opened and items were consumed</li>
                  <li>More than 48 hours have passed since delivery</li>
                  <li>You ordered the wrong product or size</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund</h2>
                <p className="text-gray-600 mb-4">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Contact our customer support within 48 hours of delivery</li>
                  <li>Provide your order number and reason for the refund request</li>
                  <li>Include photos if the issue is damage or quality-related</li>
                  <li>We will review your request and respond within 24 hours</li>
                  <li>If approved, we will process your refund within 5-7 business days</li>
                </ol>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing</h2>
                <p className="text-gray-600 mb-4">
                  Approved refunds will be processed as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                  <li><strong>UPI:</strong> 2-3 business days</li>
                  <li><strong>Net Banking:</strong> 3-5 business days</li>
                  <li><strong>Digital Wallets:</strong> 1-2 business days</li>
                </ul>
                <p className="text-gray-600">
                  Refunds will be credited to the original payment method used for the purchase.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns Process</h2>
                <p className="text-gray-600 mb-4">
                  In cases where a return is required (damaged/defective items):
                </p>
                <ol className="list-decimal pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Do not open or consume any items from the box</li>
                  <li>Take photos of the damage or issue</li>
                  <li>Contact our customer support team</li>
                  <li>We will provide a prepaid return shipping label if needed</li>
                  <li>Package the items securely and ship them back</li>
                  <li>Once we receive the return, we will process your refund</li>
                </ol>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Costs</h2>
                <p className="text-gray-600 mb-4">
                  <strong>For approved returns/refunds:</strong> We cover all return shipping costs.<br/>
                  <strong>For non-approved returns:</strong> Customer is responsible for return shipping costs.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exceptions</h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to make exceptions to this policy on a case-by-case basis. Special circumstances may be considered, but this is at our sole discretion.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  For refund and return inquiries, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> support@surprisetokri.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>WhatsApp:</strong> +91 98765 43210</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Remember:</strong> Mystery boxes are designed to be a surprise experience. The contents are intentionally kept secret to maintain the excitement and anticipation. If you prefer to know exactly what you're getting, we recommend our regular snack boxes or gift boxes with detailed descriptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <p className="text-sm text-gray-500">
                  This Refund & Return Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-8 text-sm">
            <Link href="/policy/privacy" className="text-purple-600 hover:text-purple-800">
              Privacy Policy
            </Link>
            <Link href="/policy/terms" className="text-purple-600 hover:text-purple-800">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="text-purple-600 hover:text-purple-800">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 