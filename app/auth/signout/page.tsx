'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  
  useEffect(() => {
    // Sign out and redirect to home
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);
  
  return (
    <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white">Signing out...</h2>
        <p className="text-gray-400">You are being signed out and redirected.</p>
        <div className="mt-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-kaizen-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
} 