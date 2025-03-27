"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priceId = searchParams?.get('priceId');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);
    setIsLoading(true);

    // Basic form validation
    if (!name || name.length < 2) {
      setError('Name must be at least 2 characters');
      setIsLoading(false);
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting registration with:', { name, email, priceId });
      
      const requestData = {
        name,
        email,
        password,
        ...(priceId ? { priceId } : {})
      };
      
      console.log('Request payload:', JSON.stringify(requestData));
      
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        // Show detailed error information for debugging
        const errorDetails = typeof data.details === 'string' 
          ? data.details 
          : JSON.stringify(data.details || {});
          
        setDebugInfo(`Status: ${response.status}, Details: ${errorDetails}`);
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
      setIsLoading(false);
      console.log('Registration successful!');

      // Redirect to checkout if priceId was provided
      if (priceId) {
        console.log('Redirecting to checkout with priceId:', priceId);
        router.push(`/checkout/subscription?priceId=${priceId}`);
      } else {
        // Otherwise, redirect to dashboard
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-kaizen-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="Kaizen Digital Design Logo" 
              width={200} 
              height={80}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-white">Create an Account</h1>
          <p className="text-gray-400 mt-2">Join the Kaizen Digital family</p>
        </div>

        {success ? (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-400">Registration successful! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
                {debugInfo && (
                  <p className="text-gray-400 text-xs mt-2 font-mono break-all">Debug: {debugInfo}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-kaizen-black">
      <div className="animate-spin text-white">
        <FaSpinner size={30} />
      </div>
    </div>}>
      <RegisterForm />
    </Suspense>
  );
} 