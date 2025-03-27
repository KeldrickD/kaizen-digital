"use client"

import React from 'react'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="bg-kaizen-black min-h-[90vh] flex items-center">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Real Estate Websites That Close Listings for You
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Get a stunning, lead-generating real estate website in 48 hours.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">MLS/IDX Ready</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">SEO for Local Buyers & Sellers</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">✅</span>
              <span className="text-white">Mobile-Optimized</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#pricing" className="btn-primary text-lg">
              Get Your Realtor Website Now
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

export default HeroSection 