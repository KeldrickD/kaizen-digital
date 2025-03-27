"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative bg-black text-white pb-20 pt-10 overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-kaizen-red/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h5 className="text-kaizen-red font-bold uppercase tracking-wider mb-4">
              For Real Estate Professionals
            </h5>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              High-Converting Realtor Websites in 48 Hours
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Get a lightning-fast website with MLS integration, lead capture tools, and local SEO — all done for you in just 2 days.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="#pricing" className="btn-primary">
                View Realtor Packages
              </Link>
              <Link href="/for-realtors" className="btn-secondary">
                Real Estate Examples
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div>
              <p className="text-gray-400 text-sm mb-3">Trusted by agents from top brokerages:</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="bg-gray-800 py-2 px-4 rounded border border-gray-700 text-sm">
                  Keller Williams
                </div>
                <div className="bg-gray-800 py-2 px-4 rounded border border-gray-700 text-sm">
                  RE/MAX
                </div>
                <div className="bg-gray-800 py-2 px-4 rounded border border-gray-700 text-sm">
                  eXp Realty
                </div>
                <div className="bg-gray-800 py-2 px-4 rounded border border-gray-700 text-sm">
                  Coldwell Banker
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-2 shadow-2xl">
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Image 
                  src="/mockups/realtor-website-preview.jpg" 
                  alt="Kapstone Real Estate Website Example"
                  width={600}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>
              
              {/* Floating stats cards */}
              <div className="absolute -left-10 top-1/4 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Website Speed</p>
                    <p className="font-bold">1.4s Load Time</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-5 bottom-20 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lead Generation</p>
                    <p className="font-bold">+290% More Leads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 