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
      let normalizedPriceId = '';
      
      // First try to normalize by price, the most reliable indicator
      if (price === 750) normalizedPriceId = 'price_starter';
      else if (price === 1500) normalizedPriceId = 'price_business';
      else if (price === 2500) normalizedPriceId = 'price_elite';
      else normalizedPriceId = priceId; // Use original as fallback
      
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
      
      addHiddenField('priceId', normalizedPriceId);
      addHiddenField('paymentType', paymentType);
      addHiddenField('packageType', name);
      addHiddenField('mode', 'direct');
      
      // Add the form to the document and submit it
      document.body.appendChild(form);
      form.submit();
      
      // No need to handle redirect - the form submission will handle it
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative rounded-2xl bg-gray-900 shadow-xl p-8 flex flex-col ${
      isPopular ? 'border-2 border-red-600' : ''
    }`}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 inset-x-0 mx-auto bg-red-600 px-4 py-1 rounded-full text-center text-sm font-medium text-white">
          Most Popular
        </div>
      )}
      
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-red-500 mb-2">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <p className="mt-4 flex items-baseline justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">${price}</span>
          <span className="ml-1 text-sm text-gray-400">/one-time</span>
        </p>
      </div>

      <ul className="mt-6 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0"
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
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 mb-4">
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="deposit"
              checked={paymentType === 'deposit'}
              onChange={(e) => setPaymentType(e.target.value as 'full' | 'deposit')}
              className="h-4 w-4 text-red-500 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-300">Start with ${depositAmount} deposit</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="full"
              checked={paymentType === 'full'}
              onChange={(e) => setPaymentType(e.target.value as 'full' | 'deposit')}
              className="h-4 w-4 text-red-500 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-300">Full Payment (${price})</span>
          </label>
        </div>
      </div>

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`w-full rounded-md px-4 py-3 flex items-center justify-center text-base font-medium text-white ${
          isPopular
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-800 hover:bg-gray-700'
        } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Processing...' : paymentType === 'deposit' ? `Start with $${depositAmount} Deposit` : `Pay $${price} Now`}
      </button>
    </div>
  );
} 