'use client';

import Link from 'next/link';

export default function TermsPage() {
  const lastUpdated = "March 24, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Terms & Conditions
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using the Surprise Tokri website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-600 mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Surprise Tokri's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                <p className="text-gray-600 mb-4">
                  To use certain features of our service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Information</h2>
                <p className="text-gray-600 mb-4">
                  While we strive to provide accurate product information, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to contact us for a refund or replacement.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pricing and Payment</h2>
                <p className="text-gray-600 mb-4">
                  All prices are in Indian Rupees (₹) and are subject to change without notice. Payment must be made at the time of order placement. We accept various payment methods as displayed on our website. By placing an order, you authorize us to charge your payment method for the total amount of your order.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
                <p className="text-gray-600 mb-4">
                  We aim to process and ship orders within 1-2 business days. Delivery times vary by location and are estimates only. We are not responsible for delays beyond our control, including but not limited to weather, natural disasters, or carrier delays.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
                <p className="text-gray-600 mb-4">
                  Due to the nature of our mystery boxes, returns are generally not accepted unless the product is damaged or defective. Please refer to our <Link href="/policy/refund" className="text-purple-600 hover:text-purple-800">Refund Policy</Link> for detailed information about returns and refunds.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Uses</h2>
                <p className="text-gray-600 mb-4">
                  You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You agree not to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>Submit false or misleading information</li>
                  <li>Upload or transmit viruses or any other type of malicious code</li>
                  <li>Collect or track the personal information of others</li>
                  <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-600 mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Surprise Tokri and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Please review our <Link href="/policy/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</Link>, which also governs your use of the Service, to understand our practices.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-600 mb-4">
                  In no event shall Surprise Tokri, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Disclaimer</h2>
                <p className="text-gray-600 mb-4">
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms whether express or implied.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-600 mb-4">
                  These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> legal@surprisetokri.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> 123, Mystery Lane, Surprise Street, Mumbai, Maharashtra - 400001, India</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <p className="text-sm text-gray-500">
                  These Terms and Conditions are effective as of {lastUpdated} and will remain in effect except with respect to any changes in their provisions in the future, which will be in effect immediately after being posted on this page.
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
            <Link href="/policy/refund" className="text-purple-600 hover:text-purple-800">
              Refund Policy
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