"use client"

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FaCheck, FaChevronRight, FaHome, FaUsers, FaChartLine } from 'react-icons/fa'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Updated testimonials and FAQ for real estate page - v2

export default function RealtorPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Real Estate Websites | Kaizen Digital Design</title>
        <meta name="description" content="Get a stunning, lead-generating real estate website with MLS/IDX integration, SEO for local buyers & sellers, and mobile optimization. Perfect for realtors and real estate agents." />
        <meta name="keywords" content="real estate websites, realtor websites, MLS integration, IDX integration, real estate agent websites, lead generation for realtors, real estate SEO" />
      </Head>
      <main className="min-h-screen">
        <HeroSection />
        <RealtorFeatures />
        <PricingSection />
        <RealtorTestimonials />
        <RealtorFAQ />
        <FinalCta />
      </main>
    </>
  )
}

function HeroSection() {
  return (
    <section className="bg-kaizen-black min-h-[90vh] flex items-center">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Real Estate Websites That Help You Sell While You Show
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Get a modern, lead-generating website built for realtors – delivered in just 48 hours
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">MLS/IDX-Ready – Showcase live listings to attract serious buyers</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">Lead Capture Built In – Turn site visitors into client appointments</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">SEO & Mobile Optimized – Rank locally & impress on any device</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="https://kaizendigital.design#pricing" className="btn-primary text-lg">
              Get My Realtor Website Now
            </Link>
            <a 
              href="https://calendly.com/kaizendigitaldesign/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary text-lg flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a Free Consultation
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No credit card required. 10-minute discovery call to discuss your real estate website needs.
          </p>
        </div>
      </div>
    </section>
  )
}

function RealtorFeatures() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Features That Help You 
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent ml-2">
              Close More Deals
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Our real estate websites are built with exactly what you need to attract, engage, and convert leads
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="MLS/IDX Integration" 
            description="Show up-to-date listings directly on your website with seamless MLS integration"
            icon="🏡"
          />
          <FeatureCard 
            title="Listing Page Templates" 
            description="Beautifully designed property details pages that highlight every feature and selling point"
            icon="📋"
          />
          <FeatureCard 
            title="Lead Capture Forms" 
            description="Strategically placed forms optimized for buyer and seller leads throughout your site"
            icon="📝"
          />
          <FeatureCard 
            title="Local SEO Optimization" 
            description="Get found by buyers and sellers in your area with localized search engine optimization"
            icon="🔍"
          />
          <FeatureCard 
            title="CRM Integration" 
            description="Connect your website to your CRM to automate lead nurturing and follow-up"
            icon="⚙️"
          />
          <FeatureCard 
            title="Home Valuation Tool" 
            description="Capture seller leads with an automated home value calculator tool"
            icon="💰"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function PricingSection() {
  const router = useRouter()

  const pricingTiers = [
    {
      title: 'The Agent Brand Starter',
      subtitle: 'For solo agents who need a clean, professional web presence',
      price: '$750',
      deposit: '$250',
      features: [
        '3-page custom real estate website',
        'Mobile & SEO optimized',
        'Lead capture form',
        'Social media integration',
        'Delivered in 48 hours'
      ],
      mostPopular: false,
      icon: <FaHome className="text-3xl text-red-500 mb-4" />,
      cta: 'Get Started with $250'
    },
    {
      title: 'The Growth Agent Package',
      subtitle: 'For active agents ready to scale their listings and leads',
      price: '$1,500',
      deposit: '$500',
      features: [
        '5-page premium site with IDX/MLS integration',
        'Listing-ready gallery + home valuation page',
        'Lead magnet setup (eBook, home report, etc.)',
        'Google Business Profile setup',
        'Facebook Pixel + Email Capture'
      ],
      mostPopular: true,
      icon: <FaChartLine className="text-3xl text-red-500 mb-4" />,
      cta: 'Get Started with $500'
    },
    {
      title: 'The Top Producer Bundle',
      subtitle: 'For teams, brokers, or agents ready to automate & dominate',
      price: '$2,500',
      deposit: '$750',
      features: [
        'Fully custom design with CRM integrations',
        'MLS/IDX + property funnel landing pages',
        'Buyer/Seller automation flows',
        'Blog & content hub setup',
        'Analytics dashboard, email & ad retargeting setup'
      ],
      mostPopular: false,
      icon: <FaUsers className="text-3xl text-red-500 mb-4" />,
      cta: 'Get Started with $750'
    }
  ];

  const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({})

  const handleCheckout = async (tier: any) => {
    // Set loading state for this specific tier
    setIsLoading({...isLoading, [tier.title]: true});
    
    try {
      // Map the tier to internal price constants
      let priceId = '';
      if (tier.price === '$750') priceId = 'price_starter';
      else if (tier.price === '$1,500') priceId = 'price_business';
      else if (tier.price === '$2,500') priceId = 'price_elite';
      
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/create-checkout-session';
      
      // Add hidden fields
      const addHiddenField = (name: string, value: string) => {
        const field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        field.value = value;
        form.appendChild(field);
      };
      
      addHiddenField('priceId', priceId);
      addHiddenField('paymentType', 'deposit'); // Default to deposit for this page
      addHiddenField('packageType', tier.title);
      addHiddenField('mode', 'direct');
      
      // Add the form to the document and submit it
      document.body.appendChild(form);
      form.submit();
      
      // No need to handle redirect - the form submission will handle it
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
      setIsLoading({...isLoading, [tier.title]: false});
    }
  }

  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Real Estate Website{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Specialized website solutions for real estate professionals
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.title}
              className={`relative rounded-2xl bg-gray-900 shadow-xl p-8 flex flex-col ${
                tier.mostPopular ? 'border-2 border-red-600' : ''
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 -translate-y-1/2 inset-x-0 mx-auto bg-red-600 px-4 py-1 rounded-full text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6 text-center">
                {tier.icon}
                <h3 className="text-xl font-bold">{tier.title}</h3>
                <p className="mt-2 text-gray-400">{tier.subtitle}</p>
                <p className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Start with {tier.deposit} deposit
                </p>
              </div>

              <ul className="mt-6 space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleCheckout(tier)}
                  disabled={isLoading[tier.title]}
                  className={`w-full rounded-md px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
                    tier.mostPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  <span>{isLoading[tier.title] ? 'Processing...' : tier.cta}</span>
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Need a custom solution for your brokerage?{' '}
            <Link href="/contact" className="text-red-500 font-medium hover:text-red-400">
              Contact us
            </Link>{' '}
            for a personalized quote.
          </p>
        </div>
      </div>
    </section>
  )
}

function RealtorTestimonials() {
  const testimonials = [
    {
      quote: "Kaizen Digital built my site in 2 days and I booked 3 seller appointments that same week. It's clean, fast, and it actually brings in leads!",
      name: "Sarah K.",
      title: "Realtor, Atlanta GA"
    },
    {
      quote: "The Top Producer package gave me everything I needed – MLS listings, CRM, SEO blog, retargeting – all done. It's a machine.",
      name: "Michael Rodriguez",
      title: "Luxury Broker, Miami FL"
    },
    {
      quote: "As a new agent, I needed to establish my online presence quickly. Kaizen delivered a professional website in 48 hours that made me look like a seasoned pro.",
      name: "Jennifer Williams",
      title: "Real Estate Agent, Keller Williams"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Real Estate Professionals
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent ml-2">
              Trust Us
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Here's what realtors are saying about their Kaizen Digital Design websites
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="mb-4 text-xl">
        <span className="text-red-500">"</span>
        {quote}
        <span className="text-red-500">"</span>
      </div>
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

function RealtorFAQ() {
  const faqs = [
    {
      question: "Do I need MLS access for this to work?",
      answer: "If you have IDX credentials, we'll integrate it. If not, we'll build a stunning mock listing gallery with your past sales."
    },
    {
      question: "How fast can I launch my site?",
      answer: "48 hours for Starter & Growth plans, 3–5 days for Top Producer Bundle."
    },
    {
      question: "Can I update my listings or content later?",
      answer: "Yes. All sites come with update access or you can opt into our maintenance plan."
    },
    {
      question: "Will my website work on mobile devices?",
      answer: "Absolutely! All our real estate websites are fully responsive and optimized for mobile devices. In fact, many real estate searches happen on mobile, so we ensure your site looks great and functions perfectly on smartphones and tablets."
    },
    {
      question: "Can you help me with Zillow leads?",
      answer: "Yes! We can integrate lead capture forms that connect with your CRM to help you manage and follow up with leads from Zillow or any other platform. We can also create landing pages specifically designed to convert external leads."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Frequently Asked
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent ml-2">
              Questions
            </span>
          </h2>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{question}</h3>
      <p className="text-gray-400">{answer}</p>
    </div>
  )
}

function FinalCta() {
  return (
    <section className="bg-kaizen-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Ready to Turn Your Website Into a Listing-Generating Machine?
        </h2>
        <Link 
          href="https://kaizendigital.design#pricing" 
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Start My Realtor Website Now
        </Link>
      </div>
    </section>
  )
} 