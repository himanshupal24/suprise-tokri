'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { boxesAPI } from '@/lib/api';


export default function BoxDetailPage({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState('any');
  const [activeTab, setActiveTab] = useState('overview');

  const [box, setBox] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBoxes, setRelatedBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  // Mock data - in real app, fetch based on params.slug
  // const box = {
  //   id: params.slug,
  //   name: "Mystery Snack Box",
  //   price: 299,
  //   originalPrice: 399,
  //   image: "📦",
  //   rating: 4.8,
  //   reviews: 124,
  //   occasion: "Any Occasion",
  //   description: "A surprise box filled with delicious snacks from around the world. Each box is carefully curated to bring you the best flavors and experiences.",
  //   longDescription: "Our Mystery Snack Box is the perfect way to discover new flavors and treats from around the world. Each box contains a carefully selected assortment of premium snacks, chocolates, candies, and other delightful surprises. Whether you're treating yourself or gifting someone special, this box promises an exciting unboxing experience every time.",
  //   items: 8,
  //   delivery: "2-3 days",
  //   weight: "500g",
  //   dimensions: "20cm x 15cm x 8cm",
  //   popular: true,
  //   inStock: true,
  //   category: "Snacks",
  //   tags: ["International", "Premium", "Surprise", "Gift"]
  // };

  useEffect(() => {
    if (!params.slug) return;

    const fetchBoxDetails = async () => {
      try {
        setLoading(true);

        // Fetch main box details
        const boxData = await boxesAPI.getBox(params.slug);
        setBox(boxData);

        // Fetch reviews
        const reviewsData = await boxesAPI.getReviews(params.slug);
        setReviews(reviewsData);

        // Fetch related boxes
        const relatedData = await boxesAPI.getRelatedBoxes(params.slug);
        setRelatedBoxes(relatedData);

      } catch (error) {
        console.error("Error fetching box details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxDetails();
  }, [params.slug]);

  const occasions = [
    { value: 'any', label: 'Any Occasion', icon: '🎁' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕' },
    { value: 'friendship', label: 'Friendship Day', icon: '👥' },
    { value: 'corporate', label: 'Corporate Gift', icon: '💼' },
    { value: 'romantic', label: 'Romantic', icon: '💖' }
  ];

  // const reviews = [
  //   {
  //     id: 1,
  //     name: "Priya Sharma",
  //     rating: 5,
  //     date: "2024-03-20",
  //     comment: "Amazing experience! The mystery box exceeded my expectations. Perfect for gifting and the quality of snacks was outstanding."
  //   },
  //   {
  //     id: 2,
  //     name: "Rahul Patel",
  //     rating: 4,
  //     date: "2024-03-18",
  //     comment: "Great variety of snacks and excellent packaging. Will definitely order again! The surprise element makes it so much fun."
  //   },
  //   {
  //     id: 3,
  //     name: "Neha Singh",
  //     rating: 5,
  //     date: "2024-03-15",
  //     comment: "Loved the surprise element! Each item was carefully selected and delicious. Perfect for trying new flavors."
  //   },
  //   {
  //     id: 4,
  //     name: "Amit Kumar",
  //     rating: 4,
  //     date: "2024-03-12",
  //     comment: "Good quality snacks and fast delivery. The mystery aspect adds excitement to the whole experience."
  //   }
  // ];

  // const relatedBoxes = [
  //   {
  //     id: 2,
  //     name: "Premium Mystery Box",
  //     price: 599,
  //     image: "🎁",
  //     rating: 4.9
  //   },
  //   {
  //     id: 3,
  //     name: "Mini Mystery Box",
  //     price: 199,
  //     image: "📦",
  //     rating: 4.7
  //   },
  //   {
  //     id: 4,
  //     name: "Gift Mystery Box",
  //     price: 499,
  //     image: "🎁",
  //     rating: 4.9
  //   }
  // ];

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log(`Added ${quantity} ${box.name} to cart`);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading mystery boxes...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 text-red-600">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Link href="/boxes" className="text-gray-500 hover:text-gray-700">
                    Boxes
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900">{box.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Info */}
          <div>
            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center">
                <div className="text-8xl mb-4">{box.image}</div>
                {box.popular && (
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Popular Choice
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{box.name}</h1>

              {/* Rating */}
              {/* <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < Math.floor(box.rating) ? '★' : '☆'}
                    </span>
                  ))}
                  <span className="text-gray-600 ml-2">({box.reviews} reviews)</span>
                </div>
              </div> */}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">₹{box.price}</span>
                  <span className="text-xl text-gray-500 line-through">₹{box.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((box.originalPrice - box.price) / box.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{box.shortDescription}</p>

              {/* Occasion Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Occasion</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {occasions.map((occ) => (
                    <button
                      key={occ.value}
                      onClick={() => setSelectedOccasion(occ.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors duration-200 ${selectedOccasion === occ.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-1">{occ.icon}</div>
                      <div className="text-sm font-medium">{occ.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!box.stock}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors duration-200 ${box.stock
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {box.stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Items:</span> {box.totalItems}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Delivery:</span> {box.estimatedDelivery}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Weight:</span> {box.weight}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span> {box.dimensions.length } x {box.dimensions.width} x {box.dimensions.height }
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'details', label: 'Details' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Inside?</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Snack Items</span>
                          <span className="text-sm text-gray-600">8 items</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded p-2 text-center">
                              <div className="text-2xl mb-1">🍿</div>
                              <div className="text-xs text-gray-500">Item {i + 1}</div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          *Actual items may vary. This is a mystery box after all! 🎉
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Why Choose This Box?</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Perfect for any occasion</li>
                          <li>• International snack selection</li>
                          <li>• Premium quality items</li>
                          <li>• Great value for money</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                        Write a Review
                      </button>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-purple-600 font-semibold">
                                  {review.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{review.name}</div>
                                <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400">
                                  {i < review.rating ? '★' : '☆'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600">{box.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Category:</span> {box.category}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Items:</span> {box.totalItems}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Weight:</span> {box.weight}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Dimensions:</span> {box.dimensions.length } x {box.dimensions.width} x {box.dimensions.height }
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Delivery:</span> {box.estimatedDelivery}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Stock:</span> {box.stock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {box.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Boxes */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedBoxes.map((relatedBox) => (
                  <Link
                    key={relatedBox.id}
                    href={`/boxes/${relatedBox.id}`}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{relatedBox.image}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{relatedBox.name}</h4>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">
                            {i < relatedBox.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <div className="font-bold text-gray-900">₹{relatedBox.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 