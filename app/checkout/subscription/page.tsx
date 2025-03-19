'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck } from 'react-icons/fa';
import { getPlanById } from '@/app/data/subscriptionPlans';
import Link from 'next/link';

export default function SubscriptionCheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const plan = planId ? getPlanById(planId) : null;
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  // Redirect to plans page if no valid plan is selected
  useEffect(() => {
    if (!plan && typeof window !== 'undefined') {
      window.location.href = '/maintenance';
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!plan) {
      setError('Invalid plan selected.');
      setIsLoading(false);
      return;
    }

    try {
      // Call API to create a Stripe checkout session for the subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          customerEmail: email,
          customerName: name,
          companyName,
          website,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session.');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-kaizen-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/maintenance" 
          className="inline-flex items-center mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Plans
        </Link>
        
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-800">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to {plan.name}</h1>
            <p className="text-gray-400">Complete your information to begin your website maintenance subscription</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500 text-white rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-1">
                    Website URL (if existing)
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-kaizen-red hover:bg-red-700 rounded-md font-medium flex items-center justify-center transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Subscription Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Billing</span>
                  <span className="font-medium">Monthly</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount</span>
                  <span className="font-medium">${plan.price}/month</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total (billed monthly)</span>
                  <span>${plan.price}/month</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">
                    <FaCheck />
                  </span>
                  <span className="text-sm">Automatic monthly billing</span>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">
                    <FaCheck />
                  </span>
                  <span className="text-sm">Cancel anytime with 30 days notice</span>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">
                    <FaCheck />
                  </span>
                  <span className="text-sm">Secure payment processing by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 