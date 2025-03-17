"use client"

import React from 'react'
import HeroSection from './components/HeroSection'
import PricingSection from './components/PricingSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import FaqSection from './components/FaqSection'
import FinalCta from './components/FinalCta'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PricingSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCta />
    </main>
  )
} 