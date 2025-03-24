"use client"

import React, { useState } from 'react'
import { FaCheck, FaChevronRight } from 'react-icons/fa'
import Link from 'next/link'

interface PricingTier {
  title: string;
  price: number;
  features: string[];
  mostPopular: boolean;
  productId: string;
}

const pricingTiers: PricingTier[] = [
  {
    title: 'Essential',
    price: 149,
    features: [
      'Basic website design',
      'Mobile responsive',
      'Contact form',
      'SEO optimization',
      '1 revision',
    ],
    mostPopular: false,
    productId: 'price_1OyZHpGcK1oDqjyTJDV0SJjG',
  },
  {
    title: 'Professional',
    price: 249,
    features: [
      'Advanced website design',
      'Mobile responsive',
      'Contact form',
      'SEO optimization',
      'E-commerce integration',
      '3 revisions',
      'Social media integration',
    ],
    mostPopular: true,
    productId: 'price_1OyZHpGcK1oDqjyTQkfCZVUs',
  },
  {
    title: 'Premium',
    price: 349,
    features: [
      'Premium website design',
      'Mobile responsive',
      'Contact form',
      'Advanced SEO optimization',
      'E-commerce integration',
      'Unlimited revisions',
      'Social media integration',
      'Google Analytics setup',
      'Blogging platform',
    ],
    mostPopular: false,
    productId: 'price_1OyZHqGcK1oDqjyTTw6JsMct',
  },
]

const PricingSection = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleCheckout = async (priceId: string) => {
    // Redirect to registration page with price ID as query parameter
    window.location.href = `/auth/register?priceId=${priceId}`
  }

  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Website Design{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Choose the perfect plan to bring your vision to life
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
              <div className="mb-6">
                <h3 className="text-xl font-bold">{tier.title}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${tier.price}
                  </span>
                  <span className="ml-1 text-gray-400">/mo</span>
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

              <div className="mt-8">
                <button
                  onClick={() => handleCheckout(tier.productId)}
                  disabled={isLoading[tier.productId]}
                  className={`w-full rounded-md px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
                    tier.mostPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  <span>{isLoading[tier.productId] ? 'Processing...' : 'Get Started'}</span>
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Looking for a custom solution?{' '}
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