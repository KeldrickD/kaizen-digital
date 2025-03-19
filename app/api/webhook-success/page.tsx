'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after countdown
    const timer = setTimeout(() => {
      router.push('/auth/customer-login?callbackUrl=/dashboard');
    }, 5000);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for subscribing to our services. Your account has been created and we've sent your login details to your email.
        </p>
        
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">To access your dashboard:</p>
          <ol className="text-left text-sm text-gray-300 list-decimal pl-5">
            <li className="mb-1">Check your email for login credentials</li>
            <li className="mb-1">Login to your account with the provided details</li>
            <li>Access your subscription dashboard</li>
          </ol>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/auth/customer-login?callbackUrl=/dashboard" 
            className="w-full py-3 px-4 bg-kaizen-red hover:bg-red-700 rounded-lg font-medium transition-colors text-center"
          >
            Login to Dashboard
          </Link>
          
          <div className="text-sm text-gray-400 flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Redirecting in {countdown} seconds...
          </div>
        </div>
      </div>
    </div>
  );
} 