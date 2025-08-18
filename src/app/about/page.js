'use client';

import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "👩‍💼",
      bio: "Passionate about creating magical experiences through curated surprises"
    },
    {
      name: "Rahul Patel",
      role: "Head of Operations",
      image: "👨‍💼",
      bio: "Ensuring every box is packed with love and delivered with care"
    },
    {
      name: "Neha Singh",
      role: "Creative Director",
      image: "👩‍🎨",
      bio: "Curating the perfect mix of snacks and treats for every occasion"
    },
    {
      name: "Amit Kumar",
      role: "Customer Experience",
      image: "👨‍💻",
      bio: "Making sure every customer feels special and valued"
    }
  ];

  const values = [
    {
      icon: "🎁",
      title: "Surprise & Delight",
      description: "We believe in the magic of unexpected moments and creating joy through carefully curated surprises."
    },
    {
      icon: "🤝",
      title: "Trust & Quality",
      description: "Every item in our boxes is handpicked and quality-tested to ensure the best experience."
    },
    {
      icon: "💝",
      title: "Personal Touch",
      description: "We treat every order as a personal gift, adding special touches that make it memorable."
    },
    {
      icon: "🌍",
      title: "Global Flavors",
      description: "Bringing the world's best snacks and treats to your doorstep, one box at a time."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Started the Journey",
      description: "Founded Surprise Tokri with a vision to spread joy through mystery boxes"
    },
    {
      year: "2024",
      title: "First 1000 Customers",
      description: "Reached our first milestone of 1000 happy customers across India"
    },
    {
      year: "2024",
      title: "Expanded Product Range",
      description: "Introduced new categories and occasion-specific mystery boxes"
    },
    {
      year: "2024",
      title: "Growing Strong",
      description: "Continuing to spread happiness and surprises across the country"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Surprise Tokri
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Spreading joy, one mystery box at a time
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Surprise Tokri was born from a simple yet powerful idea: everyone deserves to experience the joy of unexpected surprises. 
                  In a world that's becoming increasingly predictable, we wanted to bring back the magic of anticipation and discovery.
                </p>
                <p>
                  What started as a small experiment with friends and family has grown into a beloved brand that has touched thousands of lives 
                  across India. Our journey began with a simple question: "What if we could package happiness?"
                </p>
                <p>
                  Today, we're proud to say that we've not only packaged happiness but also created countless moments of joy, laughter, 
                  and wonder. Every box we send out carries with it our promise: to surprise, to delight, and to spread happiness.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">📦</div>
              <p className="text-lg text-gray-600">
                "हर बॉक्स में खुशी" - Every box contains happiness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create moments of pure joy and wonder by delivering carefully curated mystery boxes that surprise, delight, 
                and bring people together. We believe that happiness should be accessible to everyone, and every unboxing 
                should be an adventure worth remembering.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become India's most loved mystery box brand, known for spreading happiness and creating meaningful connections 
                through the power of surprise. We envision a world where every special occasion is made even more special 
                with a Surprise Tokri box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              The passionate people behind Surprise Tokri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Milestones Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our story
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">{milestone.year}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Journey
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the magic and experience the joy of surprises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boxes"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Explore Our Boxes
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 