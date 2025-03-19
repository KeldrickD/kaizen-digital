'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Set success state and prepare to redirect
      setSuccess(true);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/customer-login');
      }, 2000);
    } catch (error) {
      setError('An error occurred during registration');
      setIsLoading(false);
    }
  };

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
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Register for website maintenance services
          </p>
        </div>
        
        {success ? (
          <div className="text-center p-4 bg-green-900 bg-opacity-50 rounded-md">
            <p className="text-green-400 font-medium">Registration successful!</p>
            <p className="text-gray-300 mt-2">Redirecting to login page...</p>
            <div className="flex justify-center mt-3">
              <FaSpinner className="animate-spin text-green-400" size={24} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500 text-white rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
              />
            </div>
            
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
                minLength={8}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-kaizen-red focus:border-kaizen-red"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Processing...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/customer-login" className="text-kaizen-red hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 