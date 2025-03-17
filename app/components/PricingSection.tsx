"use client"

import React from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = process.env.STRIPE_PUBLIC_KEY 
  ? loadStripe(process.env.STRIPE_PUBLIC_KEY) 
  : null

const pricingTiers = [
  {
    name: 'Starter Site',
    price: 750,
    features: [
      '3-page professional site (Home, About, Contact)',
      'Fully mobile-friendly & SEO optimized',
      'Fast, clean, & conversion-focused',
    ],
    priceId: 'price_starter',
  },
  {
    name: 'Business Pro',
    price: 1500,
    features: [
      '5-page website (Home, About, Services, Contact, Blog)',
      'Lead capture form & basic automation',
      'Custom branding & high-speed optimization',
    ],
    priceId: 'price_business',
  },
  {
    name: 'Elite Custom Site',
    price: 2500,
    features: [
      'Fully custom design with advanced features',
      'E-commerce, booking systems, or interactive elements',
      'Priority support & ongoing optimization',
    ],
    priceId: 'price_elite',
  },
]

const PricingSection = () => {
  const handlePayment = async (priceId: string) => {
    try {
      // Call the backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      
      const { id: sessionId, error } = await response.json();
      
      if (error) {
        console.error('Error creating checkout session:', error);
        alert('Something went wrong. Please try again later.');
        return;
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe failed to load. Please try again later.');
        return;
      }
      
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });
      
      if (redirectError) {
        console.error('Error redirecting to checkout:', redirectError);
        alert('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Please try again later.');
    }
  }

  return (
    <section id="pricing" className="bg-gray-900 py-20">
      <div className="section-container">
        <h2 className="section-title text-center">Choose a Package & Get Started Today</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className="bg-black p-8 rounded-xl border border-gray-800 hover:border-kaizen-red transition-all flex flex-col">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-4xl font-bold mb-6">${tier.price}</p>
              
              <ul className="mb-8 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="mb-3 flex items-start">
                    <span className="text-kaizen-red mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handlePayment(tier.priceId)}
                className="btn-primary w-full"
              >
                Get Your Website Now
              </button>
            </div>
          ))}
        </div>
        
        <p className="text-center mt-10 text-gray-400">
          Custom requests? <a href="#contact" className="text-kaizen-red hover:underline">Let's talk!</a>
        </p>
      </div>
    </section>
  )
}

export default PricingSection 