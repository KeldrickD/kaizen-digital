import { Metadata } from 'next';
import PricingCard from '../components/PricingCard';

export const metadata: Metadata = {
  title: 'Realtor Website Packages | Kaizen Digital Design',
  description: 'Professional website packages designed specifically for real estate agents and teams. Start with a deposit and scale your online presence.',
};

const pricingPlans = [
  {
    name: 'The Agent Brand Starter',
    price: 750,
    description: 'For solo agents who need a simple but powerful online presence',
    features: [
      '3 Custom Pages',
      'Mobile-Friendly Design',
      'Property Search Integration',
      'Contact Form',
      'Social Media Integration',
      'Basic SEO Setup',
      '5 Business Days Delivery'
    ],
    priceId: 'price_starter',
    depositAmount: 250,
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'The Growth Agent Package',
    price: 1500,
    description: 'For active agents ready to capture more leads & listings',
    features: [
      '5 Custom Pages',
      'Mobile-Friendly Design',
      'Property Search Integration',
      'Lead Capture Forms',
      'Custom Branding',
      'Advanced SEO Setup',
      'Social Media Integration',
      'Analytics Integration',
      '7 Business Days Delivery'
    ],
    priceId: 'price_business',
    depositAmount: 500,
    isPopular: true,
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    name: 'The Top Producer Bundle',
    price: 2500,
    description: 'For teams & brokers ready to scale & automate',
    features: [
      'Unlimited Custom Pages',
      'Mobile-Friendly Design',
      'Property Search Integration',
      'Lead Capture Forms',
      'Custom Branding',
      'Advanced SEO Setup',
      'Social Media Integration',
      'Analytics Integration',
      'Team Member Profiles',
      'Automated Lead Nurturing',
      'Priority Support',
      '10 Business Days Delivery'
    ],
    priceId: 'price_elite',
    depositAmount: 750,
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Real Estate Website{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional websites designed specifically for real estate agents and teams. Start with a deposit and scale your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              priceId={plan.priceId}
              isPopular={plan.isPopular}
              depositAmount={plan.depositAmount}
              icon={plan.icon}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-400 mb-8">
            We can create a custom package tailored to your specific needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 