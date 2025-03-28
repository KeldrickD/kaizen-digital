"use client"

import React, { useState } from 'react'
import { FaCheck, FaChevronRight, FaHome, FaUsers, FaChartLine } from 'react-icons/fa'
import Link from 'next/link'

interface PricingTier {
  title: string;
  subtitle: string;
  price: number;
  deposit: number;
  features: string[];
  mostPopular: boolean;
  productId: string;
  icon: React.ReactNode;
}

const pricingTiers: PricingTier[] = [
  {
    title: 'The Agent Brand Starter',
    subtitle: 'For solo agents who need a simple but powerful online presence',
    price: 750,
    deposit: 250,
    features: [
      '3-page custom real estate website',
      'Mobile + SEO optimized',
      'Built-in lead form (buyers/sellers)',
      'Listing-ready gallery',
      'Social media integration',
      'Delivered in 48 hours',
    ],
    mostPopular: false,
    productId: 'price_1OyZHpGcK1oDqjyTJDV0SJjG',
    icon: <FaHome className="text-3xl text-red-500 mb-4" />,
  },
  {
    title: 'The Growth Agent Package',
    subtitle: 'For active agents ready to capture more leads & listings',
    price: 1500,
    deposit: 500,
    features: [
      '5-page premium website',
      'IDX/MLS integration (or mock-listing setup if no MLS access)',
      'Lead magnet or free home valuation page',
      'Branded property showcase pages',
      'Google Business Profile setup',
      'Facebook Pixel + Email capture integration',
      'Speed & SEO optimization',
      '48-hour delivery',
    ],
    mostPopular: true,
    productId: 'price_1OyZHpGcK1oDqjyTQkfCZVUs',
    icon: <FaChartLine className="text-3xl text-red-500 mb-4" />,
  },
  {
    title: 'The Top Producer Bundle',
    subtitle: 'For teams & brokers ready to scale & automate',
    price: 2500,
    deposit: 750,
    features: [
      'Fully custom design',
      'MLS/IDX integration',
      'Buyer & Seller funnels',
      'Landing pages for listings',
      'Embedded CRM/email automation (Mailchimp, ConvertKit, etc.)',
      'Blog setup + 1 article written',
      'Analytics dashboard setup',
      '48–72 hour turnaround',
    ],
    mostPopular: false,
    productId: 'price_1OyZHqGcK1oDqjyTTw6JsMct',
    icon: <FaUsers className="text-3xl text-red-500 mb-4" />,
  },
]

const PricingSection = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [paymentTypes, setPaymentTypes] = useState<Record<string, 'deposit' | 'full'>>({
    'The Agent Brand Starter': 'deposit',
    'The Growth Agent Package': 'deposit',
    'The Top Producer Bundle': 'deposit'
  })

  const handlePaymentTypeChange = (tierTitle: string, type: 'deposit' | 'full') => {
    setPaymentTypes({...paymentTypes, [tierTitle]: type})
  }

  const handleCheckout = async (tier: PricingTier) => {
    try {
      // Set loading state for this specific package
      setIsLoading(prev => ({ ...prev, [tier.productId]: true }));
      
      // Map the tier to internal price constants
      let priceId = '';
      if (tier.price === 750) priceId = 'price_starter';
      else if (tier.price === 1500) priceId = 'price_business';
      else if (tier.price === 2500) priceId = 'price_elite';
      else priceId = tier.productId; // Use original as fallback
      
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/create-checkout-session';
      
      // Add hidden fields
      const addHiddenField = (name: string, value: string) => {
        const field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        field.value = value;
        form.appendChild(field);
      };
      
      addHiddenField('priceId', priceId);
      addHiddenField('paymentType', paymentTypes[tier.title]);
      addHiddenField('packageType', tier.title);
      addHiddenField('mode', 'direct');
      
      // Add the form to the document and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Could not initiate checkout. Please try again.');
      setIsLoading(prev => ({ ...prev, [tier.productId]: false }));
    }
  }

  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Real Estate Website{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Specialized website solutions for real estate professionals
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.title}
              className={`relative rounded-2xl bg-gray-900 shadow-xl p-8 flex flex-col ${
                tier.mostPopular ? 'border-2 border-red-600' : ''
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 -translate-y-1/2 inset-x-0 mx-auto bg-red-600 px-4 py-1 rounded-full text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6 text-center">
                {tier.icon}
                <h3 className="text-xl font-bold">{tier.title}</h3>
                <p className="mt-2 text-gray-400">{tier.subtitle}</p>
                <p className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${tier.price}
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Start with ${tier.deposit} deposit
                </p>
              </div>

              <ul className="mt-6 space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="deposit"
                      checked={paymentTypes[tier.title] === 'deposit'}
                      onChange={() => handlePaymentTypeChange(tier.title, 'deposit')}
                      className="h-4 w-4 text-red-500 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">Start with ${tier.deposit} deposit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="full"
                      checked={paymentTypes[tier.title] === 'full'}
                      onChange={() => handlePaymentTypeChange(tier.title, 'full')}
                      className="h-4 w-4 text-red-500 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">Pay full amount (${tier.price})</span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleCheckout(tier)}
                  disabled={isLoading[tier.productId]}
                  className={`w-full rounded-md px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
                    tier.mostPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  <span>{isLoading[tier.productId] ? 'Processing...' : paymentTypes[tier.title] === 'deposit' ? `Start with $${tier.deposit} deposit` : `Pay $${tier.price}`}</span>
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Need a custom solution for your brokerage?{' '}
            <Link href="/contact" className="text-red-500 font-medium hover:text-red-400">
              Contact us
            </Link>{' '}
            for a personalized quote.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PricingSection 