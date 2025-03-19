import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and company info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo.png" 
                alt="Kaizen Digital Design Logo" 
                width={150} 
                height={60} 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Creating effective websites that drive results for your business.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<FaFacebookF />} />
              <SocialLink href="https://twitter.com" icon={<FaTwitter />} />
              <SocialLink href="https://instagram.com" icon={<FaInstagram />} />
              <SocialLink href="https://linkedin.com" icon={<FaLinkedinIn />} />
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <FooterLink href="/services">Web Design</FooterLink>
              <FooterLink href="/services">Web Development</FooterLink>
              <FooterLink href="/maintenance">Website Maintenance</FooterLink>
              <FooterLink href="/seo-services">SEO & Content Marketing</FooterLink>
              <FooterLink href="/services">E-Commerce</FooterLink>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/portfolio">Our Work</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">123 Web Street</p>
              <p className="mb-2">Digital City, DC 12345</p>
              <p className="mb-2">
                <a href="mailto:info@kaizendigital.com" className="hover:text-kaizen-red transition-colors">
                  info@kaizendigital.com
                </a>
              </p>
              <p>
                <a href="tel:+15555555555" className="hover:text-kaizen-red transition-colors">
                  (555) 555-5555
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kaizen Digital Design. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <FooterLink href="/privacy" small>Privacy Policy</FooterLink>
            <FooterLink href="/terms" small>Terms of Service</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Footer link component
function FooterLink({ 
  href, 
  children, 
  small = false 
}: { 
  href: string; 
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <li className={small ? 'inline' : ''}>
      <Link 
        href={href} 
        className={`text-gray-400 hover:text-white transition-colors ${small ? 'text-sm' : ''}`}
      >
        {children}
      </Link>
    </li>
  );
}

// Social link component
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-gray-800 hover:bg-kaizen-red w-8 h-8 rounded-full flex items-center justify-center transition-colors"
    >
      {icon}
    </a>
  );
} 