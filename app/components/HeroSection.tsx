"use client"

import React from 'react'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="bg-kaizen-black min-h-[90vh] flex items-center">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Your Business Deserves More Than Just a Website – It Needs a Digital Advantage.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            At Kaizen Digital, we create high-performance websites that attract, engage, and convert. 
            Let's build your business a digital home that works as hard as you do.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#pricing" className="btn-primary text-lg">
              Get Your Website in 48 Hours
            </Link>
            <a 
              href="https://calendly.com/kaizen-digital/free-consultation" 
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
            No credit card required. 10-minute discovery call to discuss your needs.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 