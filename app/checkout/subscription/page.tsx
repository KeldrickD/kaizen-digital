'use client';

import { useState, useEffect, Suspense } from 'react';
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

function SubscriptionCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const priceId = searchParams?.get('priceId');
  const { data: session, status } = useSession();

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

  const handleCheckout = async () => {
    if (!priceId) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId: session?.user?.stripeCustomerId
        }),
      });
      
      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        setError('Failed to create checkout session');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred during checkout');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-white mx-auto text-4xl" />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-kaizen-black flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="Kaizen Digital Design Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
            <h2 className="text-2xl font-bold mt-4 text-white">Sign In Required</h2>
            <p className="text-gray-400 mt-2">
              Please sign in to complete your purchase
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href={`/auth/register?priceId=${priceId}`}
              className="w-full block bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg text-center"
            >
              Create an Account
            </Link>
            
            <Link
              href={`/auth/signin?priceId=${priceId}`}
              className="w-full block border border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg text-center"
            >
              Sign In
            </Link>
            
            <Link
              href="/"
              className="flex items-center justify-center text-gray-400 hover:text-white mt-6"
            >
              <FaArrowLeft className="mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaizen-black flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="Kaizen Digital Design Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
            <h2 className="text-2xl font-bold mt-4 text-white">Complete Your Purchase</h2>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {productDetails ? (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-white">{productDetails.name}</h3>
                <p className="text-gray-400 mt-1">{productDetails.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-300">Price</span>
                  <span className="text-xl font-bold text-white">
                    ${productDetails.price} / {productDetails.interval}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 flex items-center justify-center"
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
              
              <p className="text-center text-gray-500 text-sm">
                You'll be redirected to Stripe's secure checkout page.
              </p>
            </div>
          ) : !priceId ? (
            <div className="text-center text-gray-400">
              <p>No subscription selected. Please select a plan first.</p>
              <Link
                href="/#pricing"
                className="flex items-center justify-center text-blue-400 hover:text-blue-300 mt-4"
              >
                <FaArrowLeft className="mr-2" />
                Return to Pricing
              </Link>
            </div>
          ) : (
            <div className="text-center p-8">
              <FaSpinner className="animate-spin text-white mx-auto text-3xl" />
              <p className="text-gray-300 mt-4">Loading subscription details...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-white mx-auto text-4xl" />
          <p className="text-white mt-4">Loading checkout...</p>
        </div>
      </div>
    }>
      <SubscriptionCheckout />
    </Suspense>
  );
} 