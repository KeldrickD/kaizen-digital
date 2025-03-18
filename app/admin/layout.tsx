"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaComments, 
  FaCalendarAlt, 
  FaCog,
  FaBars,
  FaTimes,
  FaMoneyBillWave
} from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // This is a backup for our middleware, just in case
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-kaizen-red border-r-transparent"></div>
        <p className="ml-3 text-white">Loading...</p>
      </div>
    );
  }
  
  // If authenticated, show admin interface
  if (session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    );
  }
  
  // If not authenticated (should be caught by middleware, but just in case)
  return null;
}

function SidebarLink({ href, icon, text, active }: { 
  href: string; 
  icon: React.ReactNode; 
  text: string; 
  active: boolean 
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
          active 
            ? 'bg-blue-900 text-white' 
            : 'text-blue-200 hover:bg-blue-700 hover:text-white'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
} 