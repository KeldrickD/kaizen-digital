"use client"

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import PricingCalculator from './PricingCalculator'
import { toast } from 'react-hot-toast'

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
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
  const [showCalculator, setShowCalculator] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  
  const handlePayment = async (priceId: string, paymentType: 'full' | 'deposit' = 'full') => {
    try {
      // Set loading state
      setProcessingTier(priceId + (paymentType === 'deposit' ? '-deposit' : ''));
      
      console.log('Sending checkout request:', { priceId, paymentType });
      
      // Call the backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId,
          paymentType
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { id: sessionId, error } = await response.json();
      
      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Something went wrong. Please try again later.');
        setProcessingTier(null);
        return;
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Payment system failed to load. Please try again later.');
        setProcessingTier(null);
        return;
      }
      
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });
      
      if (redirectError) {
        console.error('Error redirecting to checkout:', redirectError);
        toast.error('Unable to redirect to checkout. Please try again later.');
        setProcessingTier(null);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Something went wrong. Please try again later.');
      setProcessingTier(null);
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
              
              <div className="space-y-3">
                <button 
                  onClick={() => handlePayment(tier.priceId, 'full')}
                  className="btn-primary w-full"
                  disabled={!!processingTier}
                >
                  {processingTier === tier.priceId ? 'Processing...' : 'Pay Full Amount'}
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-black px-2 text-sm text-gray-400">OR</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handlePayment(tier.priceId, 'deposit')}
                  className="w-full px-4 py-2 border border-kaizen-red text-kaizen-red rounded hover:bg-kaizen-red hover:bg-opacity-10 transition-colors"
                  disabled={!!processingTier}
                >
                  {processingTier === tier.priceId + '-deposit' ? 'Processing...' : 'Pay $500 Deposit'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {!showCalculator ? (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowCalculator(true)}
              className="btn-secondary"
            >
              Need something custom? Use our price calculator
            </button>
          </div>
        ) : (
          <>
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-8">Custom Website Calculator</h3>
            </div>
            <PricingCalculator />
          </>
        )}
      </div>
    </section>
  )
}

export default PricingSection 