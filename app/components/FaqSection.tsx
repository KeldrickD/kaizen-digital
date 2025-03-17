"use client"

import React, { useState } from 'react'

const faqItems = [
  {
    question: "How fast will my website be ready?",
    answer: "Your site will be ready in 48 hours or less."
  },
  {
    question: "What if I don't like my website?",
    answer: "We offer unlimited revisions until you're 100% satisfied."
  },
  {
    question: "Can you help with hosting & domain setup?",
    answer: "Yes! We'll handle everything for you."
  },
  {
    question: "Do I need to provide content?",
    answer: "No, we handle all copywriting."
  },
  {
    question: "How do I get started?",
    answer: "Click Get Started Now, complete your payment, and fill out the form. We'll handle the rest."
  }
]

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-800 py-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-medium">{question}</h3>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </button>
      
      <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>
        <p className="text-gray-300">{answer}</p>
      </div>
    </div>
  )
}

const FaqSection = () => {
  return (
    <section id="faq" className="bg-black py-20">
      <div className="section-container max-w-4xl mx-auto">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        
        <div className="mt-10">
          {faqItems.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#pricing" className="btn-primary">
            Start Your Website Today
          </a>
        </div>
      </div>
    </section>
  )
}

export default FaqSection 