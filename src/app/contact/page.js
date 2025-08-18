'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [activeFAQ, setActiveFAQ] = useState(null);

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get in touch via email",
      contact: "support@surprisetokri.com",
      response: "Within 24 hours"
    },
    // {
    //   icon: "📱",
    //   title: "WhatsApp Support",
    //   description: "Quick chat on WhatsApp",
    //   contact: "+91 98765 43210",
    //   response: "Instant response"
    // },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Call us directly",
      // contact: "+91 98765 43210",
      response: "Mon-Sat, 9AM-6PM"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available on website",
      response: "Real-time support"
    }
  ];

  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-3 business days across India. Express delivery is available for select locations with 1-2 day delivery."
    },
    {
      question: "What's inside the mystery boxes?",
      answer: "Each mystery box contains a carefully curated selection of snacks, chocolates, candies, and other treats. The exact contents are a surprise, but we ensure premium quality and variety in every box."
    },
    {
      question: "Can I customize my mystery box?",
      answer: "Currently, our boxes are pre-curated to maintain the surprise element. However, you can select boxes based on occasion, budget, or type to find the perfect fit for your needs."
    },
    {
      question: "What if I don't like some items in the box?",
      answer: "We carefully select items that appeal to most people, but if you're not satisfied with your box, please contact our customer support within 48 hours of delivery for assistance."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship across India. International shipping is not available yet, but we're working on expanding our reach."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order through your account dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 2 hours of placement. After that, cancellation depends on whether the order has been processed for shipping."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We'd love to hear from you! Have questions, feedback, or need help? We're here to assist you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the best way to reach us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <div className="text-purple-600 font-semibold mb-2">{method.contact}</div>
                <div className="text-sm text-gray-500">{method.response}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="product">Product Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <span className="text-purple-600">
                        {activeFAQ === index ? '−' : '+'}
                      </span>
                    </button>
                    {activeFAQ === index && (
                      <div className="px-4 pb-3">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600">
              Come say hello at our office headquarters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Surprise Tokri HQ</h3>
                <div className="space-y-2 text-gray-600">
                  <p>123, Mystery Lane</p>
                  <p>Surprise Street, Mumbai</p>
                  <p>Maharashtra - 400001</p>
                  <p>India</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <p className="text-gray-600 mb-2">For urgent matters outside office hours:</p>
                <p className="font-semibold text-purple-600">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919971686542"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:support@surprisetokri.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 