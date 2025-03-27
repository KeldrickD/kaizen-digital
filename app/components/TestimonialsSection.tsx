"use client"

import React, { useState } from 'react'
import Image from 'next/image'

// Real estate focused testimonials
const testimonials = [
  {
    quote: "Kaizen Digital built my site in 2 days and I booked 3 seller appointments that same week. It's clean, fast, and it actually brings in leads!",
    author: "Sarah K.",
    role: "Realtor",
    image: "/testimonials/sarah-k.jpg",
    company: "Atlanta GA"
  },
  {
    quote: "The Top Producer package gave me everything I needed – MLS listings, CRM, SEO blog, retargeting – all done. It's a machine.",
    author: "Marcus J.",
    role: "Luxury Broker",
    image: "/testimonials/marcus-j.jpg",
    company: "Miami FL"
  },
  {
    quote: "As a new agent, I needed to establish my online presence quickly. Kaizen delivered a professional website in 48 hours that made me look like a seasoned pro.",
    author: "Jennifer W.",
    role: "Real Estate Agent",
    image: "/testimonials/jennifer-w.jpg",
    company: "Keller Williams"
  }
]

// Real estate focused case studies
const caseStudies = [
  {
    id: 1,
    client: "Coastal Luxury Realty",
    industry: "Luxury Real Estate",
    beforeImage: "/case-studies/coastal-before.svg",
    afterImage: "/case-studies/coastal-after.jpg",
    beforeStats: {
      loadTime: "7.2 seconds",
      mobileScore: "54/100",
      monthlyLeads: "3-5"
    },
    afterStats: {
      loadTime: "1.6 seconds",
      mobileScore: "98/100", 
      monthlyLeads: "18-25"
    },
    summary: "Mark's luxury property listings weren't getting the attention they deserved. We created a showcase-style site with high-res property galleries and virtual tours, increasing qualified buyer inquiries by 400%."
  },
  {
    id: 2,
    client: "Metro Homes Group",
    industry: "Residential Brokerage",
    beforeImage: "/case-studies/metro-before.svg",
    afterImage: "/case-studies/metro-after.jpg",
    beforeStats: {
      loadTime: "6.5 seconds",
      mobileScore: "48/100",
      monthlyLeads: "8-12"
    },
    afterStats: {
      loadTime: "1.4 seconds",
      mobileScore: "97/100",
      monthlyLeads: "35-45"
    },
    summary: "This real estate team's website wasn't mobile-friendly and failed to capture leads. Our redesign added IDX integration and home valuation tools, boosting qualified seller leads by 275%."
  },
  {
    id: 3,
    client: "First Time Home Buyers",
    industry: "Real Estate Education",
    beforeImage: "/case-studies/firsttime-before.jpg",
    afterImage: "/case-studies/firsttime-after.jpg",
    beforeStats: {
      loadTime: "8.4 seconds",
      mobileScore: "39/100",
      monthlyLeads: "5-8"
    },
    afterStats: {
      loadTime: "1.7 seconds",
      mobileScore: "95/100",
      monthlyLeads: "30-40"
    },
    summary: "Lisa's real estate education business needed a platform to attract first-time buyers. We built a resource hub with downloadable guides, increasing lead capture and consultation bookings by 500%."
  }
];

const TestimonialsSection = () => {
  const [activeStudy, setActiveStudy] = useState(0);

  return (
    <section className="bg-gray-900 py-20">
      <div className="section-container">
        <h2 className="section-title text-center">What Real Estate Professionals Say About Kaizen Digital</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black p-8 rounded-xl border border-gray-800 hover:border-kaizen-red transition-all">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-kaizen-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-gray-400">{testimonial.role}</p>
                  <p className="text-kaizen-red text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Case Studies Section */}
        <div className="mt-20">
          <h2 className="section-title text-center mb-12">Real Estate Success Stories: Before & After</h2>
          
          {/* Case Study Navigation */}
          <div className="flex flex-wrap justify-center mb-10">
            {caseStudies.map((study, index) => (
              <button
                key={study.id}
                onClick={() => setActiveStudy(index)}
                className={`mx-2 px-4 py-2 mb-2 rounded ${
                  activeStudy === index 
                    ? 'bg-kaizen-red text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {study.client}
              </button>
            ))}
          </div>
          
          {/* Active Case Study */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Before & After Images */}
              <div className="p-6 border-r border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-center">Website Transformation</h3>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-center mb-2 text-gray-400">Before</p>
                      <div className="bg-gray-700 h-60 rounded overflow-hidden">
                        {activeStudy === 0 ? (
                          <Image
                            src="/case-studies/coastal-before.svg"
                            alt="Coastal Luxury Realty Website - Before"
                            width={300}
                            height={240}
                            className="w-full h-full object-cover"
                          />
                        ) : activeStudy === 1 ? (
                          <Image
                            src="/case-studies/metro-before.svg"
                            alt="Metro Homes Group Website - Before"
                            width={300}
                            height={240}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-gray-400 flex items-center justify-center h-full">[Before Image]</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-center mb-2 text-gray-400">After</p>
                      <div className="bg-gray-700 h-60 rounded overflow-hidden">
                        {activeStudy === 0 ? (
                          <Image
                            src="/case-studies/coastal-after.jpg"
                            alt="Coastal Luxury Realty Website - After"
                            width={300}
                            height={240}
                            className="w-full h-full object-cover"
                          />
                        ) : activeStudy === 1 ? (
                          <Image
                            src="/case-studies/metro-after.jpg"
                            alt="Metro Homes Group Website - After"
                            width={300}
                            height={240}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-gray-400 flex items-center justify-center h-full">[After Image]</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats & Description */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {caseStudies[activeStudy].client} - {caseStudies[activeStudy].industry}
                </h3>
                
                <p className="mb-6">{caseStudies[activeStudy].summary}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900 p-4 rounded">
                    <h4 className="font-bold text-gray-400 mb-2">Before</h4>
                    <ul className="space-y-1">
                      <li>Load time: {caseStudies[activeStudy].beforeStats.loadTime}</li>
                      <li>Mobile score: {caseStudies[activeStudy].beforeStats.mobileScore}</li>
                      <li>Monthly leads: {caseStudies[activeStudy].beforeStats.monthlyLeads}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded">
                    <h4 className="font-bold text-kaizen-red mb-2">After</h4>
                    <ul className="space-y-1">
                      <li>Load time: {caseStudies[activeStudy].afterStats.loadTime}</li>
                      <li>Mobile score: {caseStudies[activeStudy].afterStats.mobileScore}</li>
                      <li>Monthly leads: {caseStudies[activeStudy].afterStats.monthlyLeads}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold text-kaizen-red">
                    Want to grow your real estate business?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a href="#pricing" className="btn-primary">
            Build My Realtor Website
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection 