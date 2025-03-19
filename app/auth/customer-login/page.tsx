'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('customer-login', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Successful login
      router.push(callbackUrl);
    } catch (error) {
      setError('An error occurred during sign in');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500 text-white rounded-md text-sm">
          {error}
        </div>
      )}
      
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
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>
    </form>
  );
}

// Loading fallback
function LoginFormLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-800 rounded-md animate-pulse"></div>
      <div className="h-10 bg-gray-800 rounded-md animate-pulse"></div>
      <div className="h-12 bg-gray-800 rounded-md animate-pulse mt-4"></div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen bg-kaizen-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Kaizen Digital Design Logo" 
              width={150} 
              height={60} 
              className="h-16 w-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Customer Login</h2>
          <p className="mt-2 text-sm text-gray-400">
            Access your website maintenance dashboard
          </p>
        </div>
        
        <Suspense fallback={<LoginFormLoading />}>
          <CustomerLoginForm />
        </Suspense>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Need a website maintenance plan?{' '}
            <Link href="/maintenance" className="text-kaizen-red hover:underline">
              View our plans
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 