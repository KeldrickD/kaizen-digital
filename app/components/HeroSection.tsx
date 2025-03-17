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
          <div className="mt-10">
            <Link href="#pricing" className="btn-primary text-lg">
              Get Your Website in 48 Hours
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 