"use client"

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import PricingCalculator from './PricingCalculator'
import { toast } from 'react-hot-toast'

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
  const [showCalculator, setShowCalculator] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  
  const handlePayment = async (priceId: string, paymentType: 'full' | 'deposit' = 'full') => {
    try {
      // Set loading state
      setProcessingTier(priceId + (paymentType === 'deposit' ? '-deposit' : ''));
      
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
        
        <div className="flex flex-col items-center mt-14">
          <p className="mb-4 text-xl text-gray-300">Need something more customized?</p>
          
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-white bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center transition-colors mb-8"
            disabled={!!processingTier}
          >
            {showCalculator ? 'Hide Calculator' : 'Use Our Price Calculator'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ml-2 transition-transform transform ${showCalculator ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCalculator && (
            <div className="w-full transition-all duration-300 ease-in-out">
              <PricingCalculator />
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-center mt-10 text-gray-400">
              Have questions? <a href="https://calendly.com/kaizen-digital/free-consultation" className="text-kaizen-red hover:underline">Book a free consultation</a> or <a href="#contact" className="text-kaizen-red hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection 