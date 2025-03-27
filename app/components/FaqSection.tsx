"use client"

import React, { useState } from 'react'

// Real estate focused FAQs
const faqs = [
  {
    question: "How quickly can I get my real estate website live?",
    answer: "Most of our real estate websites go live within 2-3 business days. We'll need your MLS information, branding preferences, and any specific features you want integrated (CRM, IDX, etc.). Once launched, you'll have immediate access to edit your listings, blog, and contact information."
  },
  {
    question: "Do you integrate with my local MLS?",
    answer: "Yes, we integrate with over 600+ MLS boards across North America. Our IDX integration allows your website to display listings in real-time, with advanced search features for potential clients. We handle all the technical setup and compliance requirements."
  },
  {
    question: "What makes your real estate websites better than competitors?",
    answer: "Three main factors: First, our sites load in under 2 seconds (compared to the 6+ second industry average), which Google rewards with higher rankings. Second, we include built-in lead capture tools specifically designed for real estate (home valuation widgets, neighborhood guides, first-time buyer resources). Third, we include a real estate content marketing engine that publishes fresh, local market content to build your authority."
  },
  {
    question: "Can I add my current listings to the website?",
    answer: "Absolutely. Our websites include MLS/IDX integration that automatically pulls in your listings. You can also manually add listings that aren't in the MLS, like coming soon properties or off-market opportunities. All listings include high-resolution photo galleries, virtual tours, property details, and lead capture forms."
  },
  {
    question: "How do you help me generate real estate leads?",
    answer: "Each real estate website includes strategic lead capture points: home valuation tools, neighborhood guides, mortgage calculators, and listing alerts. We also set up your Google Business Profile, implement SEO best practices for local searches, and provide a content marketing system with real estate articles to establish you as a local market expert. For Top Producer tier clients, we include Facebook/Google retargeting campaigns."
  },
  {
    question: "What if I'm a new agent with limited budget?",
    answer: "Our Starter package is designed specifically for new agents who need a professional online presence quickly. It includes all the essentials: responsive design, listing integration, contact forms, about page, and testimonial section. You can always upgrade as your business grows. We also offer a payment plan option to make it more accessible."
  }
]

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-black">
      <div className="section-container">
        <h2 className="section-title text-center">Real Estate Website FAQs</h2>
        
        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full p-5 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all text-left"
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {activeIndex === index && (
                <div className="p-5 bg-gray-800 rounded-b-lg mt-[-5px]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection 