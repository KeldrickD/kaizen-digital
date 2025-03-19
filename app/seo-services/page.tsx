'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaArrowRight, FaSearch, FaChartLine, FaPen } from 'react-icons/fa';
import { seoPlans } from '../data/subscriptionPlans';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function SEOServicesPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <div className="bg-kaizen-black">
        <div className="section-container py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">SEO & Content Marketing</h1>
            <p className="text-xl text-gray-300 mb-8">
              Boost your website's visibility and traffic with strategic SEO and professional content creation
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Invest in SEO & Content Marketing?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Increased Visibility</h3>
                <p className="text-gray-400">Rank higher in search results and get discovered by potential customers</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">More Traffic</h3>
                <p className="text-gray-400">Drive targeted, high-quality visitors to your website</p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPen className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Content</h3>
                <p className="text-gray-400">Engage your audience with valuable, professional content</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {seoPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-2xl bg-gray-900 overflow-hidden border-t-4 ${
                  plan.popular 
                    ? 'border-orange-500 transform md:-translate-y-4 shadow-xl md:scale-105' 
                    : plan.color === 'green' 
                      ? 'border-green-500' 
                      : 'border-teal-500'
                }`}
              >
                {plan.popular && (
                  <div className="bg-orange-500 py-1 text-center">
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
                          plan.color === 'green' 
                            ? 'text-green-500' 
                            : plan.color === 'teal' 
                              ? 'text-teal-500' 
                              : 'text-orange-500'
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
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
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
          
          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-xl max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Supercharge Your Online Presence</h3>
            <p className="text-white mb-6">
              Combine our SEO services with website maintenance for a comprehensive digital solution.
              Save 10% when you bundle both services together!
            </p>
            <Link 
              href="/contact" 
              className="inline-block py-3 px-6 bg-white text-red-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Ask About Bundle Discounts
            </Link>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">How quickly will I see results from SEO?</h3>
                <p className="text-gray-300">
                  SEO is a long-term strategy. While some improvements can be seen within 1-2 months, significant results typically take 3-6 months. Our reports will show you progress every step of the way.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Who writes the blog content?</h3>
                <p className="text-gray-300">
                  Our professional content team creates all articles with input from you. We combine industry expertise with SEO best practices and use AI-assisted tools to produce high-quality, engaging content.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Do you guarantee first-page rankings?</h3>
                <p className="text-gray-300">
                  No ethical SEO company can guarantee rankings, as search algorithms are constantly changing. However, we follow proven strategies that have helped our clients achieve significant improvements in search visibility and traffic.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Can I review content before it's published?</h3>
                <p className="text-gray-300">
                  Absolutely! We'll share all content with you for approval before publishing. You'll have the opportunity to request revisions to ensure the content aligns with your brand voice and messaging.
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