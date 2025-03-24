'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const priceId = searchParams?.get('priceId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState<{
    name: string;
    price: number;
    description: string;
  } | null>(null);

  useEffect(() => {
    // If we have a priceId, fetch the product details
    if (priceId) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`/api/products?priceId=${priceId}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data = await response.json();
          setProductDetails(data);
        } catch (err) {
          setError('Could not load product details');
          console.error(err);
        }
      };
      
      fetchProductDetails();
    }
  }, [priceId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = `/auth/customer-login?callbackUrl=${encodeURIComponent(window.location.href)}`;
    }
  }, [status]);

  const handleCheckout = async () => {
    if (!priceId) {
      setError('No product selected');
      return;
    }

    if (status !== 'authenticated') {
      setError('You must be logged in to checkout');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId,
          customerId: session?.user?.id,
          customerEmail: session?.user?.email,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { id: sessionId, error } = await response.json();
      
      if (error) {
        console.error('Error creating checkout session:', error);
        setError('Something went wrong. Please try again later.');
        setIsLoading(false);
        return;
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        setError('Payment system failed to load. Please try again later.');
        setIsLoading(false);
        return;
      }
      
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });
      
      if (redirectError) {
        console.error('Error redirecting to checkout:', redirectError);
        setError('Unable to redirect to checkout. Please try again later.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-kaizen-black flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-kaizen-red mx-auto mb-4" size={32} />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaizen-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Kaizen Digital Design Logo" 
            width={150} 
            height={60}
            className="h-12 w-auto mx-auto" 
          />
          <h1 className="text-2xl font-bold mt-4">Complete Your Purchase</h1>
        </div>
        
        {error && (
          <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-md mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="mb-8">
          {productDetails ? (
            <div className="bg-gray-800 rounded-lg p-5">
              <h2 className="font-semibold text-lg mb-2">{productDetails.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{productDetails.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${productDetails.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
            </div>
          ) : priceId ? (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-kaizen-red" size={24} />
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No product selected
            </div>
          )}
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={isLoading || !priceId || !productDetails}
          className="w-full py-3 px-4 bg-kaizen-red hover:bg-red-700 rounded-md font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        
        <div className="mt-6 text-center">
          <Link 
            href="/pricing" 
            className="text-gray-400 hover:text-white text-sm flex items-center justify-center"
          >
            <FaArrowLeft className="mr-1" size={12} />
            Return to pricing
          </Link>
        </div>
      </div>
    </div>
  );
} 