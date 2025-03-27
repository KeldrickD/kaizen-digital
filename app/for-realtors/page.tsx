"use client"

import React from 'react'
import HeroSection from '../components/HeroSection'
import PricingSection from '../components/PricingSection'
import HowItWorksSection from '../components/HowItWorksSection'
import TestimonialsSection from '../components/TestimonialsSection'
import FaqSection from '../components/FaqSection'
import FinalCta from '../components/FinalCta'
import Head from 'next/head'

export default function RealtorPage() {
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
        <HowItWorksSection />
        <RealtorTestimonials />
        <RealtorFAQ />
        <FinalCta />
      </main>
    </>
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

function RealtorTestimonials() {
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
          <TestimonialCard 
            quote="My new website has generated 15 qualified leads in just the first month. The home valuation tool is a game-changer for getting seller leads."
            name="Sarah Johnson"
            title="Real Estate Agent, ReMax"
          />
          <TestimonialCard 
            quote="The MLS integration is seamless and my clients love being able to search for properties directly on my website. It's helped me close 3 deals already."
            name="Michael Rodriguez"
            title="Broker, Century 21"
          />
          <TestimonialCard 
            quote="As a new agent, I needed to establish my online presence quickly. Kaizen delivered a professional website in 48 hours that made me look like a seasoned pro."
            name="Jennifer Williams"
            title="Real Estate Agent, Keller Williams"
          />
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
          <FAQItem 
            question="Do I need MLS access for my website?"
            answer="While having MLS access is beneficial for displaying up-to-date listings, we can still create a powerful real estate website for you without it. We can implement alternative solutions, such as manual listing uploads or showcase properties from your closed deals."
          />
          <FAQItem 
            question="Can you help me with Zillow leads?"
            answer="Yes! We can integrate lead capture forms that connect with your CRM to help you manage and follow up with leads from Zillow or any other platform. We can also create landing pages specifically designed to convert external leads."
          />
          <FAQItem 
            question="How long will it take to build my real estate website?"
            answer="We deliver most real estate websites within 48 hours. For more complex projects with custom features or integrations, it may take up to 72 hours. We prioritize speed without compromising quality."
          />
          <FAQItem 
            question="Will my website work on mobile devices?"
            answer="Absolutely! All our real estate websites are fully responsive and optimized for mobile devices. In fact, many real estate searches happen on mobile, so we ensure your site looks great and functions perfectly on smartphones and tablets."
          />
          <FAQItem 
            question="Can I update my listings myself?"
            answer="Yes! We build your website with user-friendly content management systems that make it easy for you to add, update, or remove listings. We also provide training to ensure you're comfortable managing your content."
          />
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