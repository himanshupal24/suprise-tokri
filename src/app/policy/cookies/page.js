export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Cookies Policy</h1>
              <p className="text-purple-100">Last updated: December 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and personalizing content and advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🔐</span>
                    <h3 className="text-lg font-medium text-blue-900">Essential Cookies</h3>
                  </div>
                  <p className="text-blue-800 text-sm">
                    These cookies are necessary for the website to function properly. They enable basic 
                    functions like page navigation, access to secure areas, and shopping cart functionality.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">📊</span>
                    <h3 className="text-lg font-medium text-green-900">Analytics Cookies</h3>
                  </div>
                  <p className="text-green-800 text-sm">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎯</span>
                    <h3 className="text-lg font-medium text-purple-900">Marketing Cookies</h3>
                  </div>
                  <p className="text-purple-800 text-sm">
                    These cookies are used to track visitors across websites to display relevant and 
                    engaging advertisements.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">⚙️</span>
                    <h3 className="text-lg font-medium text-yellow-900">Preference Cookies</h3>
                  </div>
                  <p className="text-yellow-800 text-sm">
                    These cookies allow the website to remember choices you make and provide enhanced, 
                    more personal features.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Session Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are temporary and are deleted when you close your browser. They help 
                    maintain your session while you browse our website.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Persistent Cookies</h3>
                  <p className="text-gray-600">
                    These cookies remain on your device for a set period or until you delete them. 
                    They help us remember your preferences and provide a personalized experience.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Third-Party Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are set by third-party services that we use, such as Google Analytics, 
                    payment processors, and social media platforms.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Specific Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">session_id</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Maintains user session</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">cart_items</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Stores shopping cart items</td>
                      <td className="px-4 py-3 text-sm text-gray-600">30 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">user_preferences</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Stores user preferences</td>
                      <td className="px-4 py-3 text-sm text-gray-600">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">_ga</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Google Analytics tracking</td>
                      <td className="px-4 py-3 text-sm text-gray-600">2 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">_fbp</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Facebook pixel tracking</td>
                      <td className="px-4 py-3 text-sm text-gray-600">3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-2">Browser Settings</h3>
                  <p className="text-green-800 mb-3">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc list-inside text-green-800 space-y-1">
                    <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                    <li>Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Cookie Consent</h3>
                  <p className="text-blue-800">
                    When you first visit our website, you'll see a cookie consent banner. You can choose 
                    which types of cookies to accept or reject. You can change these preferences at any 
                    time through your account settings.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Important Note</h3>
                  <p className="text-yellow-800">
                    Disabling certain cookies may affect the functionality of our website. Essential 
                    cookies cannot be disabled as they are necessary for basic site operations.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Google Analytics</h3>
                  <p className="text-gray-600">
                    We use Google Analytics to understand how visitors use our website. Google Analytics 
                    uses cookies to collect information about your use of our site. You can opt out of 
                    Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media</h3>
                  <p className="text-gray-600">
                    Our website may include social media features that set cookies to enable sharing 
                    and tracking. These are controlled by the respective social media platforms.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Processors</h3>
                  <p className="text-gray-600">
                    When you make a purchase, our payment processors may set cookies to ensure secure 
                    transactions and prevent fraud.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800">
                  We may update this Cookies Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "Last updated" 
                  date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-3">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> privacy@surprisetokri.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +91-9876543210
                  </p>
                  <p className="text-gray-600">
                    <strong>Address:</strong> Surprise Tokri, Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">✅</span>
                  <p className="text-gray-600">
                    You have the right to know what cookies we use and why we use them.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">✅</span>
                  <p className="text-gray-600">
                    You can control and manage cookies through your browser settings.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">✅</span>
                  <p className="text-gray-600">
                    You can withdraw your consent for non-essential cookies at any time.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 mt-1">✅</span>
                  <p className="text-gray-600">
                    You can request information about the personal data we collect through cookies.
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