'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaArrowRight, FaFacebook, FaInstagram, FaChartLine } from 'react-icons/fa';
import { adPlans } from '../data/subscriptionPlans';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function AdManagementPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <div className="bg-kaizen-black">
        <div className="section-container py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Facebook & Instagram Ad Management</h1>
            <p className="text-xl text-gray-300 mb-8">
              Need more customers? We manage your social media ads for consistent leads & sales
            </p>
            
            {/* Annually/Monthly toggle - for future use */}
            <div className="flex justify-center items-center mt-8 mb-4 opacity-50 pointer-events-none">
              <span className={`mr-3 text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isAnnual ? 'bg-kaizen-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 text-sm flex items-center ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Annually <span className="ml-1 text-xs text-kaizen-red font-semibold bg-opacity-20 bg-kaizen-red py-1 px-2 rounded">Save 15%</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 italic mt-2">(Annual plans coming soon)</p>
          </div>

          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Invest in Professional Ad Management?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFacebook className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Targeting</h3>
                <p className="text-gray-400">Reach the exact customers who are most likely to buy from you</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInstagram className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compelling Creative</h3>
                <p className="text-gray-400">Ads that stop the scroll and drive action from your audience</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Measurable Results</h3>
                <p className="text-gray-400">Clear reporting on leads, sales, and return on ad spend</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {adPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-2xl bg-gray-900 overflow-hidden border-t-4 ${
                  plan.popular 
                    ? 'border-purple-500 transform md:-translate-y-4 shadow-xl md:scale-105' 
                    : plan.color === 'blue' 
                      ? 'border-blue-500' 
                      : 'border-indigo-500'
                }`}
              >
                {plan.popular && (
                  <div className="bg-purple-500 py-1 text-center">
                    <span className="text-xs uppercase font-semibold">Most Popular</span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-lg text-gray-400 ml-2">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`mr-2 mt-1 ${
                          plan.color === 'blue' 
                            ? 'text-blue-500' 
                            : plan.color === 'indigo' 
                              ? 'text-indigo-500' 
                              : 'text-purple-500'
                        }`}>
                          <FaCheck />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/checkout/subscription?plan=${plan.id}`}
                    className={`block text-center w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      plan.popular 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      Get Started <FaArrowRight className="ml-2" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Success Story */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-xl max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-4">Client Success Story</h3>
              <p className="text-white mb-4 italic">
                "Within just 3 months of working with Kaizen Digital, our Facebook ads generated 47 qualified leads and 12 new clients, with a 387% return on ad spend. Their team handles everything while we focus on serving our customers."
              </p>
              <p className="text-white font-semibold">- Sarah Johnson, Owner of Riverside Wellness Center</p>
            </div>
            <div className="text-center">
              <Link 
                href="/contact" 
                className="inline-block py-3 px-6 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Book a Free Ad Strategy Call
              </Link>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Do I need to pay for the ads separately?</h3>
                <p className="text-gray-300">
                  Yes, our fees cover the management, strategy, and optimization of your ads. The actual ad spend goes directly to Facebook/Instagram and is separate from our management fee. We'll help you determine the right budget based on your goals.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">How soon will I see results?</h3>
                <p className="text-gray-300">
                  Most clients begin seeing results within the first month. We typically need 2-4 weeks to test audiences and optimize campaigns. Long-term results improve as we gather more data and refine the strategy.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">What do you need from me to get started?</h3>
                <p className="text-gray-300">
                  We'll need access to your Facebook Business Manager, basic information about your target audience, and your business goals. We'll also discuss your unique selling points and competitive advantages to craft compelling ad copy.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Do you create the ad graphics and copy?</h3>
                <p className="text-gray-300">
                  Yes! Our team handles the entire process, including creating eye-catching graphics and persuasive ad copy. We'll work with you to ensure all content aligns with your brand voice and marketing objectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 