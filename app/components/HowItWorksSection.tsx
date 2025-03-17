"use client"

import React from 'react'

const HowItWorksSection = () => {
  return (
    <section className="bg-black py-20">
      <div className="section-container">
        <h2 className="section-title text-center">The Simple 3-Step Process</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <div className="bg-kaizen-red h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
            <h3 className="text-xl font-bold mb-4">Choose a Package & Pay Securely</h3>
            <p className="text-gray-300">
              Select your plan & complete payment via Stripe.
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <div className="bg-kaizen-red h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
            <h3 className="text-xl font-bold mb-4">Fill Out the Website Form</h3>
            <p className="text-gray-300">
              Tell us about your business & branding in a quick, simple form.
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <div className="bg-kaizen-red h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
            <h3 className="text-xl font-bold mb-4">Get Your Website in 48 Hours</h3>
            <p className="text-gray-300">
              We handle everything – your website goes live, ready to convert visitors into customers.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a href="#pricing" className="btn-primary">
            Start Now – Get Your Site in 48 Hours
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection 