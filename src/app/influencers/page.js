'use client';

import { useState } from 'react';
import { publicAPI } from '@/lib/api';
import Link from 'next/link';

export default function InfluencersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '',
    followers: '',
    engagement: '',
    category: '',
    message: ''
  });

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Commission",
      description: "Earn up to 15% commission on every sale you drive"
    },
    {
      icon: "🎁",
      title: "Free Mystery Boxes",
      description: "Get complimentary boxes to showcase to your audience"
    },
    {
      icon: "📈",
      title: "Growth Support",
      description: "Access to exclusive content and marketing materials"
    },
    {
      icon: "🤝",
      title: "Personal Account Manager",
      description: "Dedicated support to help you succeed"
    }
  ];

  const requirements = [
    {
      icon: "📱",
      title: "Active Social Media",
      description: "Minimum 10K followers on any platform"
    },
    {
      icon: "📊",
      title: "Good Engagement",
      description: "3%+ engagement rate preferred"
    },
    {
      icon: "🎯",
      title: "Relevant Content",
      description: "Content related to lifestyle, food, or gifts"
    },
    {
      icon: "📝",
      title: "Regular Posting",
      description: "At least 3 posts per week"
    }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      handle: "@priya_sharma",
      platform: "Instagram",
      followers: "125K",
      earnings: "₹45,000",
      story: "Started with Surprise Tokri 6 months ago and now earning a steady income while sharing amazing products with my audience!"
    },
    {
      name: "Rahul Patel",
      handle: "@rahul_foodie",
      platform: "YouTube",
      followers: "89K",
      earnings: "₹32,000",
      story: "My audience loves the mystery box unboxing videos. It's been a great addition to my content strategy."
    },
    {
      name: "Neha Singh",
      handle: "@neha_lifestyle",
      platform: "Instagram",
      followers: "67K",
      earnings: "₹18,000",
      story: "The commission structure is fair and the products are high quality. Perfect partnership!"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitErr, setSubmitErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg(null);
    setSubmitErr(null);
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        socialMediaPlatforms: formData.platform,
        followers: formData.followers,
        engagementRate: formData.engagement,
        contentType: formData.category,
        message: formData.message,
      };
      const res = await publicAPI.sendInfluencerRequest(payload);
      setSubmitMsg(res?.message || 'Application submitted successfully');
      setFormData({
        name: '', email: '', phone: '', platform: '', followers: '', engagement: '', category: '', message: ''
      });
    } catch (err) {
      setSubmitErr(err?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Our Influencer Program
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Partner with Surprise Tokri and earn while sharing amazing mystery boxes with your audience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi! I'm interested in joining the Surprise Tokri influencer program."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Chat on WhatsApp
            </a>
            <button
              onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-lg text-gray-600">
              Discover the benefits of joining our influencer program
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Requirements
            </h2>
            <p className="text-lg text-gray-600">
              What we look for in our influencer partners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requirements.map((requirement, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">{requirement.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{requirement.title}</h3>
                <p className="text-gray-600">{requirement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our successful influencer partners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.handle}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">{story.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-medium">{story.followers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Monthly Earnings:</span>
                    <span className="font-medium text-green-600">{story.earnings}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Apply to Join Our Program
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 48 hours
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Primary Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follower Count *
                  </label>
                  <input
                    type="text"
                    name="followers"
                    value={formData.followers}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 50K, 100K"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Engagement Rate
                  </label>
                  <input
                    type="text"
                    name="engagement"
                    value={formData.engagement}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 3.5%"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="food">Food & Cooking</option>
                  <option value="beauty">Beauty & Fashion</option>
                  <option value="technology">Technology</option>
                  <option value="travel">Travel</option>
                  <option value="gaming">Gaming</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about yourself and why you'd like to partner with us
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Share your story, content style, and why you think your audience would love our mystery boxes..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              {submitMsg && <p className="mt-3 text-green-600 text-sm">{submitMsg}</p>}
              {submitErr && <p className="mt-3 text-red-600 text-sm">{submitErr}</p>}
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful influencers who are already earning with Surprise Tokri
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi! I'm interested in joining the Surprise Tokri influencer program."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 