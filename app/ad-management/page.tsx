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
              Drive consistent leads and sales with expertly managed social media advertising campaigns
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
                <p className="text-gray-400">Reach your ideal customers with precision audience targeting</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInstagram className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Optimized Campaigns</h3>
                <p className="text-gray-400">Get better results with continuous optimization and A/B testing</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Measurable ROI</h3>
                <p className="text-gray-400">Track performance with detailed analytics and reporting</p>
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
          
          {/* Case Study / Success Story */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-xl max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-4">Success Story</h3>
              <p className="text-white mb-4">
                "With Kaizen's ad management, we increased our lead generation by 347% while reducing our cost per lead by 42%. The ROI has been incredible for our business."
              </p>
              <p className="font-semibold">— Sarah Johnson, Owner of Urban Fitness</p>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/contact" 
                className="inline-block py-3 px-6 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Start Your Success Story
              </Link>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Do I need to provide the ad creative?</h3>
                <p className="text-gray-300">
                  We can work with your existing creative or develop new ad designs for you. Our team includes graphic designers who can create compelling visuals that drive engagement and conversions.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">What's your approach to ad targeting?</h3>
                <p className="text-gray-300">
                  We start with your ideal customer profile and use Facebook's powerful targeting options to reach them. We continuously refine these audiences based on performance data to ensure your ads reach the most receptive users.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Is the ad spend included in your fees?</h3>
                <p className="text-gray-300">
                  No, our management fees are separate from your ad spend. You'll pay Facebook/Meta directly for your advertising budget. We recommend a minimum ad spend of $500/month to see meaningful results, but this can be adjusted based on your goals.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">How do you report on ad performance?</h3>
                <p className="text-gray-300">
                  You'll receive detailed performance reports showing key metrics like impressions, clicks, conversions, cost per click, and return on ad spend. Our higher-tier plans include more frequent reporting and in-depth analytics.
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