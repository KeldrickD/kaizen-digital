'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaClipboardList, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to Google Form when countdown reaches 0
      router.push("https://docs.google.com/forms/d/e/1FAIpQLSdfTwfxqZzoHI2Bp2KfX6ZdVP-awJEd_8swn-uZNyTXig1xMg/viewform?usp=dialog");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-kaizen-black flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl max-w-xl w-full mx-auto text-center">
        <div className="text-green-500 flex justify-center mb-4">
          <BsCheckCircleFill size={64} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        
        <div className="border-t border-b border-gray-700 py-6 my-6">
          <h2 className="text-xl font-bold text-white mb-4">Next Steps:</h2>
          
          <div className="space-y-6">
            <div className="flex items-start text-left">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <FaClipboardList className="text-kaizen-red" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">1. Complete Website Information Form</h3>
                <p className="text-gray-400 mt-1">
                  You'll be redirected to our form in {countdown} seconds to provide details about your website needs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start text-left">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <FaUserPlus className="text-kaizen-red" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">2. Create Your Account</h3>
                <p className="text-gray-400 mt-1">
                  Register for an account using the "Get Started" button in the navigation bar to access your dashboard.
                </p>
                <a href="/auth/register" className="mt-2 inline-block bg-kaizen-red hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 transition-colors">
                  Register Now
                </a>
              </div>
            </div>
            
            <div className="flex items-start text-left">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <FaSignInAlt className="text-kaizen-red" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">3. Access Your Dashboard</h3>
                <p className="text-gray-400 mt-1">
                  After creating your account, you can log in anytime to view your subscription details and invoices.
                </p>
                <a href="/auth/customer-login" className="mt-2 inline-block border border-gray-600 hover:border-white text-gray-300 hover:text-white font-medium rounded-md px-4 py-2 transition-colors">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 italic">
          Need help? Contact our support team at admin@kaizendigital.design
        </p>
      </div>
    </div>
  );
} 