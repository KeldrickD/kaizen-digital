'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/maintenance">Maintenance</NavLink>
            <NavLink href="/seo-services">SEO Services</NavLink>
            <NavLink href="/ad-management">Ad Management</NavLink>
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            
            {/* Auth buttons */}
            <Link 
              href="/auth/customer-login" 
              className="text-gray-300 hover:text-white font-medium transition-colors border border-gray-600 rounded-md px-3 py-1.5"
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-kaizen-red hover:bg-red-700 text-white font-medium rounded-md px-4 py-1.5 transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 shadow-lg">
          <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="/maintenance" onClick={() => setIsMenuOpen(false)}>Maintenance</MobileNavLink>
          <MobileNavLink href="/seo-services" onClick={() => setIsMenuOpen(false)}>SEO Services</MobileNavLink>
          <MobileNavLink href="/ad-management" onClick={() => setIsMenuOpen(false)}>Ad Management</MobileNavLink>
          <MobileNavLink href="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
          
          {/* Auth buttons for mobile */}
          <div className="pt-2 mt-2 border-t border-gray-700 flex space-x-2">
            <Link
              href="/auth/customer-login"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 block text-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md border border-gray-700"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 block text-center px-3 py-2 text-base font-medium text-white bg-kaizen-red hover:bg-red-700 rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-gray-300 hover:text-white font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

// Mobile navigation link
function MobileNavLink({ href, onClick, children }: { 
  href: string; 
  onClick: () => void;
  children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
    >
      {children}
    </Link>
  );
} 