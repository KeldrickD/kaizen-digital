'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';

interface SubscriptionProps {
  subscription: any;
  hasSubscription: boolean;
}

export default function DashboardSubscription({ subscription, hasSubscription }: SubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to handle Stripe portal redirect
  const handleManageSubscription = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Error creating portal session:', data.error);
        alert('Error launching billing portal. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Error launching billing portal. Please try again.');
      setIsLoading(false);
    }
  };
  
  // If no subscription
  if (!hasSubscription) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="mb-3 text-gray-600">You don't have an active subscription yet.</p>
          <Link
            href="/maintenance"
            className="inline-block px-4 py-2 bg-kaizen-red text-white rounded-md hover:bg-red-700 transition-colors"
          >
            View Maintenance Plans
          </Link>
        </div>
      </div>
    );
  }
  
  // Format next billing date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Subscription Details</h2>
        <button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              Manage Subscription <FaExternalLinkAlt className="ml-2 h-3 w-3" />
            </>
          )}
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Plan</h3>
          <p className="text-lg font-medium">{subscription.planName}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          <p className={`text-lg font-medium capitalize ${
            subscription.status === 'active' || subscription.status === 'trialing'
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {subscription.status}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
          <p className="text-lg font-medium">${subscription.price}/{subscription.interval}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Next Billing Date</h3>
          <p className="text-lg font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
        </div>
        
        {subscription.paymentMethod && (
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
            <div className="flex items-center">
              <div className="capitalize mr-2">
                {subscription.paymentMethod.brand}
              </div>
              <div>
                •••• {subscription.paymentMethod.last4}
              </div>
              <div className="text-sm text-gray-500 ml-2">
                Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
              </div>
            </div>
          </div>
        )}
        
        {subscription.cancelAtPeriodEnd && (
          <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
            <p className="text-sm text-yellow-800">
              Your subscription will be canceled at the end of the current billing period on {formatDate(subscription.currentPeriodEnd)}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 