"use client"

import React from 'react'
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
                {/* Real Estate Website Screenshot */}
                <div className="relative" style={{ paddingBottom: '150%' }}>
                  <div className="absolute inset-0 bg-white">
                    {/* This is a simplified version of the real estate website UI as seen in the image */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <div className="font-serif font-bold text-black text-xl">käpstone</div>
                      <div className="flex space-x-6 text-sm text-black">
                        <span>HOME</span>
                        <span>ABOUT</span>
                        <span>CONTACT</span>
                      </div>
                    </div>
                    
                    <div className="p-6 text-black">
                      <h2 className="font-serif text-5xl font-bold mb-2">Find Your<br />Dream Home</h2>
                      <p className="text-lg mb-5">Explore our listings of beautiful homes<br />in your area.</p>
                      <button className="bg-red-700 text-white py-3 px-6 rounded">VIEW LISTINGS</button>
                    </div>
                    
                    {/* Realistic House Image Section */}
                    <div className="relative h-80 overflow-hidden">
                      {/* House Image - Gradient Background with Photo-like Elements */}
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-purple-100">
                        {/* Sky */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-100"></div>
                        
                        {/* Sun */}
                        <div className="absolute top-5 right-10 w-16 h-16 rounded-full bg-yellow-200 opacity-70"></div>
                        
                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-600 to-green-500 opacity-60"></div>
                        
                        {/* Modern House */}
                        <div className="absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-[80%] h-[55%]">
                          {/* Main House Structure */}
                          <div className="absolute bottom-0 w-full h-[65%] bg-gray-200 rounded-sm shadow-lg"></div>
                          
                          {/* Roof */}
                          <div className="absolute bottom-[65%] left-0 right-0 h-[20%] bg-gray-700"></div>
                          
                          {/* Garage */}
                          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gray-300 border-t border-r border-gray-400"></div>
                          
                          {/* Windows - Main House */}
                          <div className="absolute bottom-[30%] left-[45%] w-[20%] h-[18%] bg-blue-200 border border-gray-400 shadow-inner"></div>
                          <div className="absolute bottom-[30%] left-[70%] w-[20%] h-[18%] bg-blue-200 border border-gray-400 shadow-inner"></div>
                          
                          {/* Door */}
                          <div className="absolute bottom-0 right-[10%] w-[12%] h-[25%] bg-gray-800 shadow-md"></div>
                          
                          {/* Garage Door */}
                          <div className="absolute bottom-[8%] left-[5%] w-[30%] h-[25%] bg-gray-100 border border-gray-400">
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 p-1">
                              <div className="bg-gray-200"></div>
                              <div className="bg-gray-200"></div>
                              <div className="bg-gray-200"></div>
                              <div className="bg-gray-200"></div>
                              <div className="bg-gray-200"></div>
                              <div className="bg-gray-200"></div>
                            </div>
                          </div>
                          
                          {/* Landscaping */}
                          <div className="absolute bottom-[-2%] right-[5%] w-[15%] h-[10%] rounded-full bg-green-700 opacity-80"></div>
                          <div className="absolute bottom-[-1%] right-[25%] w-[10%] h-[8%] rounded-full bg-green-700 opacity-80"></div>
                          
                          {/* Driveway */}
                          <div className="absolute bottom-[-3%] left-[5%] w-[35%] h-[3%] bg-gray-400"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Agent Profile Section */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 bg-white border-t border-gray-200">
                      {/* Agent Photo - More Realistic */}
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-3 border border-gray-300 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 relative">
                          {/* Stylized Agent Photo */}
                          <div className="absolute inset-0">
                            {/* Head */}
                            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[60%] h-[35%] rounded-full bg-[#e1c4ac]"></div>
                            
                            {/* Hair */}
                            <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[65%] h-[25%] rounded-t-full bg-[#413734]"></div>
                            
                            {/* Suit */}
                            <div className="absolute top-[50%] left-0 right-0 bottom-0 bg-[#2c3e50]"></div>
                            
                            {/* Shirt */}
                            <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 w-[40%] h-[20%] bg-white"></div>
                            
                            {/* Tie */}
                            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-[15%] h-[25%] bg-[#c0392b]"></div>
                            
                            {/* Eyes */}
                            <div className="absolute top-[25%] left-[35%] w-[8%] h-[4%] rounded-full bg-[#2c3e50]"></div>
                            <div className="absolute top-[25%] right-[35%] w-[8%] h-[4%] rounded-full bg-[#2c3e50]"></div>
                            
                            {/* Mouth */}
                            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 w-[20%] h-[3%] bg-[#c0392b]"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-black">
                        <div className="font-medium">John Smith</div>
                        <div className="text-sm text-gray-600">Real Estate Agent</div>
                        <div className="text-sm text-gray-600">Upstate Realty</div>
                      </div>
                    </div>
                  </div>
                </div>
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