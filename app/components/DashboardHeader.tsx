'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { FaUser, FaSignOutAlt, FaSpinner } from 'react-icons/fa';

function DashboardHeaderContent() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Kaizen Digital Design Logo"
                width={150}
                height={60}
                className="h-10 w-auto"
              />
            </Link>
            <div className="ml-6 hidden md:flex space-x-6">
              <Link
                href="/dashboard"
                className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/maintenance"
                className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Plans
              </Link>
              <Link
                href="/contact"
                className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          {/* User Account Menu */}
          <div className="ml-4 relative flex items-center">
            <div>
              <button
                type="button"
                className="flex items-center space-x-2 rounded-full p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="bg-gray-200 rounded-full p-2">
                  <FaUser className="h-5 w-5" />
                </div>
                <span className="hidden md:inline-block">{session?.user?.name}</span>
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <p className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {session?.user?.email}
                  </p>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Loading fallback
function DashboardHeaderLoading() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardHeader() {
  return (
    <Suspense fallback={<DashboardHeaderLoading />}>
      <DashboardHeaderContent />
    </Suspense>
  );
} 