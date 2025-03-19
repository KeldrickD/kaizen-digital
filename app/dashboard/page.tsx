'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaExclamationTriangle, FaCreditCard, FaFileInvoiceDollar, FaCog } from 'react-icons/fa';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSubscription from '../components/DashboardSubscription';
import DashboardInvoices from '../components/DashboardInvoices';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  useEffect(() => {
    async function fetchSubscriptionData() {
      if (status === 'authenticated' && session.user.role === 'customer') {
        try {
          const response = await fetch('/api/customers/subscription');
          
          if (response.ok) {
            const data = await response.json();
            setSubscriptionData(data);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to load subscription data');
          }
        } catch (err) {
          console.error('Error fetching subscription data:', err);
          setError('Failed to load subscription data');
        } finally {
          setLoading(false);
        }
      }
    }

    if (status === 'authenticated') {
      fetchSubscriptionData();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, session, router]);

  // If loading
  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <FaSpinner className="animate-spin text-kaizen-red h-8 w-8" />
        <span className="ml-3 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  // If not authenticated or not a customer
  if (status === 'unauthenticated' || (session && session.user.role !== 'customer')) {
    return null; // Will redirect in useEffect
  }

  // If there was an error
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
        <FaExclamationTriangle className="mt-1 mr-2" />
        <div>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || 'Customer'}! Manage your website maintenance subscription.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaCreditCard className="text-blue-500 h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subscription Status</h3>
            <p className="text-xl font-semibold">
              {subscriptionData?.subscription ? (
                <span
                  className={`capitalize ${
                    subscriptionData.subscription.status === 'active' || subscriptionData.subscription.status === 'trialing'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {subscriptionData.subscription.status}
                </span>
              ) : (
                'No Active Plan'
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaFileInvoiceDollar className="text-purple-500 h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recent Invoices</h3>
            <p className="text-xl font-semibold">
              {subscriptionData?.invoices ? subscriptionData.invoices.length : 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaCog className="text-green-500 h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Next Payment</h3>
            <p className="text-xl font-semibold">
              {subscriptionData?.subscription ? (
                new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString()
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="mb-8">
        <DashboardSubscription 
          subscription={subscriptionData?.subscription} 
          hasSubscription={subscriptionData?.hasSubscription} 
        />
      </div>

      {/* Recent Invoices */}
      {subscriptionData?.invoices && subscriptionData.invoices.length > 0 && (
        <div className="mb-8">
          <DashboardInvoices invoices={subscriptionData.invoices} />
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[70vh]">
            <FaSpinner className="animate-spin text-kaizen-red h-8 w-8" />
            <span className="ml-3 text-lg">Loading dashboard...</span>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
} 