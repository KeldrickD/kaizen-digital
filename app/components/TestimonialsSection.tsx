"use client"

import React from 'react'

const testimonials = [
  {
    quote: "I needed a site FAST, and Kaizen Digital delivered a sleek, modern website in just 2 days. My bookings tripled in the first month!",
    author: "Mike R.",
    role: "Personal Trainer"
  },
  {
    quote: "Kaizen Digital didn't just build me a website – they built me a business asset. I highly recommend them!",
    author: "Sarah K.",
    role: "Realtor"
  },
  {
    quote: "Super professional, fast, and affordable. I love my new website!",
    author: "David C.",
    role: "Barber Shop Owner"
  }
]

const TestimonialsSection = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="section-container">
        <h2 className="section-title text-center">What Business Owners Say About Kaizen Digital</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black p-8 rounded-xl border border-gray-800">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-kaizen-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
              
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
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