'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaSpinner, FaClipboardList } from 'react-icons/fa';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();
  // Replace this with your actual Google Form URL
  const googleFormUrl = "https://forms.gle/UZ9dJCaGH9YAVdtN9";

  useEffect(() => {
    // Redirect to Google Form after countdown
    const timer = setTimeout(() => {
      window.location.href = googleFormUrl;
    }, 10000);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [googleFormUrl]);

  return (
    <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for subscribing to our services! Your payment has been processed successfully.
        </p>
        
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-1 font-semibold">Next Steps:</p>
          <ol className="text-left text-sm text-gray-300 list-decimal pl-5">
            <li className="mb-1">Complete our website information form</li>
            <li className="mb-1">Receive your login credentials via email</li>
            <li>Access your dashboard with the provided details</li>
          </ol>
        </div>
        
        <div className="flex flex-col gap-3">
          <a 
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-kaizen-red hover:bg-red-700 rounded-lg font-medium transition-colors text-center flex items-center justify-center"
          >
            <FaClipboardList className="mr-2" />
            Complete Website Information Form
          </a>
          
          <div className="text-sm text-gray-400 flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Redirecting to form in {countdown} seconds...
          </div>
        </div>
      </div>
    </div>
  );
} 