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
  FaTimes
} from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-blue-600">Kaizen Admin</span>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-6 bg-blue-900">
            <h2 className="text-xl font-semibold">Kaizen Digital</h2>
            <p className="text-sm text-blue-300">Admin Portal</p>
          </div>
          
          {/* Sidebar navigation */}
          <nav className="flex-1 py-4 px-2 overflow-y-auto">
            <ul className="space-y-2">
              <SidebarLink 
                href="/admin/dashboard" 
                icon={<FaTachometerAlt />} 
                text="Dashboard" 
                active={isActive('/admin/dashboard')}
              />
              <SidebarLink 
                href="/admin/leads" 
                icon={<FaUsers />} 
                text="Lead Management" 
                active={isActive('/admin/leads')}
              />
              <SidebarLink 
                href="/admin/messaging" 
                icon={<FaComments />} 
                text="Messaging" 
                active={isActive('/admin/messaging')}
              />
              <SidebarLink 
                href="/admin/appointments" 
                icon={<FaCalendarAlt />} 
                text="Appointments" 
                active={isActive('/admin/appointments')}
              />
              <SidebarLink 
                href="/admin/settings" 
                icon={<FaCog />} 
                text="Settings" 
                active={isActive('/admin/settings')}
              />
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-blue-700">
            <Link 
              href="/"
              className="flex items-center text-sm text-blue-300 hover:text-white"
            >
              <span>← Return to Website</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
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