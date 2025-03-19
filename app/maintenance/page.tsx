'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { maintenancePlans } from '../data/subscriptionPlans';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MaintenancePlansPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <div className="bg-kaizen-black">
        <div className="section-container py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Website Maintenance & Support</h1>
            <p className="text-xl text-gray-300 mb-8">
              Keep your website secure, updated, and performing at its best with our professional maintenance plans
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

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {maintenancePlans.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-2xl bg-gray-900 overflow-hidden border-t-4 ${
                  plan.popular 
                    ? 'border-kaizen-red transform md:-translate-y-4 shadow-xl md:scale-105' 
                    : plan.color === 'blue' 
                      ? 'border-blue-500' 
                      : 'border-purple-500'
                }`}
              >
                {plan.popular && (
                  <div className="bg-kaizen-red py-1 text-center">
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
                            : plan.color === 'purple' 
                              ? 'text-purple-500' 
                              : 'text-kaizen-red'
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
                        ? 'bg-kaizen-red hover:bg-red-700 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      Subscribe Now <FaArrowRight className="ml-2" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* First Month Free Offer */}
          <div className="mt-16 bg-gray-900 p-8 rounded-xl max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">First Month Free With Every Website Project</h3>
            <p className="text-gray-300 mb-6">
              When you purchase a website from us, you'll get one month free on any maintenance plan. 
              Experience the value of professional website support with no risk.
            </p>
            <Link 
              href="/contact" 
              className="inline-block py-3 px-6 bg-kaizen-red hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Ask About Our Websites
            </Link>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">What's included in website maintenance?</h3>
                <p className="text-gray-300">
                  Our maintenance plans include software updates, security monitoring, regular backups, technical support, and content updates based on your plan level. We ensure your website stays secure, fast, and up-to-date.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-300">
                  Yes, all our maintenance plans are month-to-month with no long-term contracts. You can cancel anytime with 30 days notice.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">How quickly do you respond to issues?</h3>
                <p className="text-gray-300">
                  For critical issues like website downtime, we respond within 2 hours. For general updates and non-urgent matters, we typically respond within 24 hours on business days.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Do you offer custom maintenance plans?</h3>
                <p className="text-gray-300">
                  Yes, if our standard plans don't meet your specific needs, we can create a custom maintenance solution tailored to your business. Contact us to discuss your requirements.
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