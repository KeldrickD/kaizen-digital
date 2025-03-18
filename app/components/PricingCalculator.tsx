"use client"

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'react-hot-toast'

// Initialize Stripe
const stripePromise = process.env.STRIPE_PUBLIC_KEY 
  ? loadStripe(process.env.STRIPE_PUBLIC_KEY) 
  : null

type CalculatorOption = {
  label: string;
  value: number;
}

const PricingCalculator = () => {
  // Calculator options
  const pageOptions: CalculatorOption[] = [
    { label: "3 Pages (Basic)", value: 3 },
    { label: "5 Pages (Standard)", value: 5 },
    { label: "10 Pages (Full Site)", value: 10 },
    { label: "15+ Pages (Custom)", value: 15 },
  ];

  const featureOptions: CalculatorOption[] = [
    { label: "E-commerce Features", value: 750 },
    { label: "Lead Form Integration", value: 250 },
    { label: "User Authentication", value: 500 },
    { label: "Interactive Elements", value: 350 },
    { label: "Blog/News Section", value: 300 },
  ];

  const maintenanceOptions: CalculatorOption[] = [
    { label: "None", value: 0 },
    { label: "Basic (Content Updates)", value: 150 },
    { label: "Standard (Content + Tech Support)", value: 300 },
    { label: "Premium (Full Site Management)", value: 500 },
  ];

  // State
  const [pages, setPages] = useState<number>(3);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [maintenance, setMaintenance] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(750);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Calculate total price when options change
  useEffect(() => {
    const basePrice = 250 * pages; // Base price calculation
    
    const featuresPrice = featureOptions
      .filter(feature => selectedFeatures.includes(feature.label))
      .reduce((sum, feature) => sum + feature.value, 0);
      
    const total = basePrice + featuresPrice + maintenance;
    
    setTotalPrice(total);
  }, [pages, selectedFeatures, maintenance]);
  
  // Handle feature selection/deselection
  const toggleFeature = (featureLabel: string) => {
    if (selectedFeatures.includes(featureLabel)) {
      setSelectedFeatures(selectedFeatures.filter(label => label !== featureLabel));
    } else {
      setSelectedFeatures([...selectedFeatures, featureLabel]);
    }
  };

  // Handle payment for custom package
  const handleCustomPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Create a custom package description
      const packageDetails = {
        pages: pageOptions.find(option => option.value === pages)?.label || `${pages} Pages`,
        features: selectedFeatures,
        maintenance: maintenanceOptions.find(option => option.value === maintenance)?.label || 'None',
        totalPrice: totalPrice
      };
      
      // Call the backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: 'custom', 
          amount: totalPrice * 100, // Stripe requires amount in cents
          packageDetails 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { id: sessionId, error } = await response.json();
      
      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Something went wrong. Please try again later.');
        setIsProcessing(false);
        return;
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Payment system failed to load. Please try again later.');
        setIsProcessing(false);
        return;
      }
      
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });
      
      if (redirectError) {
        console.error('Error redirecting to checkout:', redirectError);
        toast.error('Unable to redirect to checkout. Please try again later.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Custom pricing error:', err);
      toast.error(err.message || 'Something went wrong. Please try again later.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Custom Website Price Calculator</h3>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-white">How many pages do you need?</label>
        <select 
          className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 w-full"
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
        >
          {pageOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-white">Select features you need:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featureOptions.map((feature) => (
            <div key={feature.label} className="flex items-center">
              <input
                type="checkbox"
                id={`feature-${feature.label}`}
                checked={selectedFeatures.includes(feature.label)}
                onChange={() => toggleFeature(feature.label)}
                className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-kaizen-red focus:ring-2"
              />
              <label htmlFor={`feature-${feature.label}`} className="ml-2 text-sm font-medium text-gray-300">
                {feature.label} (+${feature.value})
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-white">Do you need ongoing maintenance?</label>
        <select 
          className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 w-full"
          value={maintenance}
          onChange={(e) => setMaintenance(Number(e.target.value))}
        >
          {maintenanceOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label} {option.value > 0 ? `(+$${option.value}/month)` : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700 text-center">
        <p className="text-xl font-medium mb-2">Your Estimated Price:</p>
        <p className="text-4xl font-bold text-kaizen-red">${totalPrice}</p>
        <p className="mt-2 text-gray-400 text-sm">
          {maintenance > 0 ? `Plus $${maintenance}/month for maintenance` : 'One-time payment'}
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          className="btn-primary"
          onClick={handleCustomPayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Get Started With This Package'}
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Like what you see? Contact us for a detailed quote or book a consultation below.
        </p>
      </div>
    </div>
  )
}

export default PricingCalculator 