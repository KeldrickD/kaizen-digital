'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  priceId: string;
  isPopular?: boolean;
  depositAmount: number;
  icon: React.ReactNode;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  priceId,
  isPopular = false,
  depositAmount,
  icon,
}: PricingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('deposit');

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Map external Stripe IDs to our internal constants if needed
      let normalizedPriceId = priceId;
      
      // Check if this is a Stripe ID and map it to our internal constants
      if (priceId.startsWith('price_1')) {
        // This is likely a Stripe price ID, map it to our internal constants
        if (price === 750) normalizedPriceId = 'price_starter';
        else if (price === 1500) normalizedPriceId = 'price_business';
        else if (price === 2500) normalizedPriceId = 'price_elite';
      }
      
      // Debugging
      console.log(`Original priceId: ${priceId}, Normalized: ${normalizedPriceId}, Payment Type: ${paymentType}`);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: normalizedPriceId,
          paymentType,
          packageType: name,
          customerEmail: '',
          customerName: '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }

      const { id } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/c/pay/${id}`;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative rounded-2xl border p-6 shadow-sm ${isPopular ? 'border-blue-500' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="ml-1 text-sm text-gray-500">/one-time</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="deposit"
              checked={paymentType === 'deposit'}
              onChange={(e) => setPaymentType(e.target.value as 'full' | 'deposit')}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Start with ${depositAmount} deposit</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="full"
              checked={paymentType === 'full'}
              onChange={(e) => setPaymentType(e.target.value as 'full' | 'deposit')}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Full Payment</span>
          </label>
        </div>
      </div>

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
          isPopular
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-900 hover:bg-gray-800'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Processing...' : paymentType === 'deposit' ? `Start with $${depositAmount} Deposit` : 'Purchase Now'}
      </button>
    </div>
  );
} 