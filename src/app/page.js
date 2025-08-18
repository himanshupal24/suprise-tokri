'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const heroData = {
    title: "हर बॉक्स में खुशी",
    subtitle: "Discover the joy of surprise with our curated mystery boxes",
    description: "Experience the thrill of unboxing carefully selected snacks and treats from around the world. Every box is a new adventure!",
    ctaText: "Explore Boxes",
    ctaLink: "/boxes"
  };

  const trendingBoxes = [
    {
      id: 1,
      name: "Mystery Snack Box",
      price: 299,
      originalPrice: 399,
      image: "📦",
      rating: 4.8,
      reviews: 124,
      occasion: "Any Occasion",
      description: "A surprise box filled with delicious snacks from around the world"
    },
    {
      id: 2,
      name: "Premium Mystery Box",
      price: 599,
      originalPrice: 699,
      image: "🎁",
      rating: 4.9,
      reviews: 89,
      occasion: "Special Occasions",
      description: "Premium selection of gourmet snacks and treats"
    },
    {
      id: 3,
      name: "Mini Mystery Box",
      price: 199,
      originalPrice: 249,
      image: "📦",
      rating: 4.7,
      reviews: 156,
      occasion: "Quick Treat",
      description: "Small but exciting mystery box perfect for trying new snacks"
    },
    {
      id: 4,
      name: "Gift Mystery Box",
      price: 499,
      originalPrice: 599,
      image: "🎁",
      rating: 4.9,
      reviews: 67,
      occasion: "Gifts",
      description: "Perfect gift box with premium snacks and a personal touch"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🎁' },
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'anniversary', name: 'Anniversary', icon: '💕' },
    { id: 'friendship', name: 'Friendship', icon: '👥' },
    { id: 'corporate', name: 'Corporate', icon: '💼' },
    { id: 'romantic', name: 'Romantic', icon: '💖' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Amazing experience! The mystery box exceeded my expectations. Perfect for gifting!"
    },
    {
      id: 2,
      name: "Rahul Patel",
      location: "Delhi",
      rating: 5,
      comment: "Great quality snacks and excellent packaging. Will definitely order again!"
    },
    {
      id: 3,
      name: "Neha Singh",
      location: "Bangalore",
      rating: 4,
      comment: "Loved the surprise element! Each item was carefully selected and delicious."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              {heroData.subtitle}
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              {heroData.description}
            </p>
            <Link
              href={heroData.ctaLink}
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {heroData.ctaText}
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-20">📦</div>
        <div className="absolute top-20 right-20 text-3xl opacity-20">🎁</div>
        <div className="absolute bottom-10 left-20 text-3xl opacity-20">✨</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-20">🌟</div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose by Occasion
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect mystery box for every special moment
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-lg text-center transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Boxes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Mystery Boxes
            </h2>
            <p className="text-lg text-gray-600">
              Most loved and highly rated surprise boxes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBoxes.map((box) => (
              <div key={box.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{box.image}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{box.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{box.description}</p>
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            {i < Math.floor(box.rating) ? '★' : '☆'}
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({box.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">₹{box.price}</span>
                      <span className="text-lg text-gray-500 line-through">₹{box.originalPrice}</span>
                    </div>
                    <div className="text-sm text-purple-600 font-medium">{box.occasion}</div>
                  </div>
                  
                  <Link
                    href={`/boxes/${box.id}`}
                    className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/boxes"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
            >
              View All Boxes
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your surprise box in just 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Box</h3>
              <p className="text-gray-600">Select from our variety of mystery boxes based on occasion, budget, or preference</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We Curate</h3>
              <p className="text-gray-600">Our team carefully selects and packages the best snacks and treats for you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enjoy the Surprise</h3>
              <p className="text-gray-600">Receive your mystery box and enjoy the excitement of unboxing surprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from happy customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < testimonial.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the Magic?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers who love our mystery boxes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boxes"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Explore Boxes
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
