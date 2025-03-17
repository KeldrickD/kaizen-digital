"use client"

import React, { useState } from 'react'
import Image from 'next/image'

// Enhanced testimonials with more details
const testimonials = [
  {
    quote: "I needed a site FAST, and Kaizen Digital delivered a sleek, modern website in just 2 days. My bookings tripled in the first month!",
    author: "Mike R.",
    role: "Personal Trainer",
    image: "/testimonials/mike-r.jpg",
    company: "FitLife Coaching"
  },
  {
    quote: "Kaizen Digital didn't just build me a website – they built me a business asset. I highly recommend them!",
    author: "Sarah K.",
    role: "Realtor",
    image: "/testimonials/sarah-k.jpg",
    company: "Prime Properties"
  },
  {
    quote: "Super professional, fast, and affordable. I love my new website!",
    author: "David C.",
    role: "Barber Shop Owner",
    image: "/testimonials/david-c.jpg",
    company: "Classic Cuts"
  }
]

// Case studies with before and after data
const caseStudies = [
  {
    id: 1,
    client: "FitLife Coaching",
    industry: "Fitness",
    beforeImage: "/case-studies/fitlife-before.jpg",
    afterImage: "/case-studies/fitlife-after.jpg",
    beforeStats: {
      loadTime: "8.3 seconds",
      mobileScore: "42/100",
      monthlyLeads: "5-10"
    },
    afterStats: {
      loadTime: "1.8 seconds",
      mobileScore: "96/100", 
      monthlyLeads: "30-40"
    },
    summary: "Mike's old website was slow, outdated, and didn't convert visitors to clients. We created a high-performance site that loads 4x faster and helped triple his monthly bookings."
  },
  {
    id: 2,
    client: "Prime Properties",
    industry: "Real Estate",
    beforeImage: "/case-studies/prime-before.jpg",
    afterImage: "/case-studies/prime-after.jpg",
    beforeStats: {
      loadTime: "6.5 seconds",
      mobileScore: "56/100",
      monthlyLeads: "8-12"
    },
    afterStats: {
      loadTime: "1.5 seconds",
      mobileScore: "98/100",
      monthlyLeads: "25-30"
    },
    summary: "Sarah's real estate website wasn't mobile-friendly and failed to showcase properties effectively. Our redesign improved mobile usability and implemented advanced property search features, increasing lead generation by 240%."
  },
  {
    id: 3,
    client: "Classic Cuts",
    industry: "Personal Services",
    beforeImage: "/case-studies/classic-before.jpg",
    afterImage: "/case-studies/classic-after.jpg",
    beforeStats: {
      loadTime: "7.2 seconds",
      mobileScore: "48/100",
      monthlyLeads: "10-15"
    },
    afterStats: {
      loadTime: "1.7 seconds",
      mobileScore: "95/100",
      monthlyLeads: "40-50"
    },
    summary: "David's barbershop was losing customers to competitors with better online presence. We built a sleek, modern site with online booking that has helped him grow his client base by 300%."
  }
];

const TestimonialsSection = () => {
  const [activeStudy, setActiveStudy] = useState(0);

  return (
    <section className="bg-gray-900 py-20">
      <div className="section-container">
        <h2 className="section-title text-center">What Business Owners Say About Kaizen Digital</h2>
        
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
          <h2 className="section-title text-center mb-12">Case Studies: Before & After</h2>
          
          {/* Case Study Navigation */}
          <div className="flex justify-center mb-10">
            {caseStudies.map((study, index) => (
              <button
                key={study.id}
                onClick={() => setActiveStudy(index)}
                className={`mx-2 px-4 py-2 rounded ${
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
                <h3 className="text-xl font-bold mb-4 text-center">Visual Transformation</h3>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-center mb-2 text-gray-400">Before</p>
                      <div className="bg-gray-700 h-60 rounded flex items-center justify-center">
                        <p className="text-gray-400">[Before Image]</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-center mb-2 text-gray-400">After</p>
                      <div className="bg-gray-700 h-60 rounded flex items-center justify-center">
                        <p className="text-gray-400">[After Image]</p>
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
                    Ready for similar results?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a href="#pricing" className="btn-primary">
            Let's Build Yours Today
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection 