'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSignOutAlt, FaHome, FaComments, FaDollarSign, FaCog } from 'react-icons/fa';

export default function AdminHeader() {
  const { data: session } = useSession();
  
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-kaizen-red">Kaizen Admin</h1>
            
            <nav className="ml-8 hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/admin" className="flex items-center hover:text-kaizen-red transition-colors">
                    <FaHome className="mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/messaging" className="flex items-center hover:text-kaizen-red transition-colors">
                    <FaComments className="mr-2" />
                    Messaging
                  </Link>
                </li>
                <li>
                  <Link href="/admin/payments" className="flex items-center hover:text-kaizen-red transition-colors">
                    <FaDollarSign className="mr-2" />
                    Payments
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" className="flex items-center hover:text-kaizen-red transition-colors">
                    <FaCog className="mr-2" />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {session && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 hidden md:inline-block">
                {session.user?.name || 'Admin User'}
              </span>
              <Link 
                href="/auth/signout" 
                className="flex items-center text-sm bg-gray-800 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 