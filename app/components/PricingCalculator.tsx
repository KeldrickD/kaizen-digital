"use client"

import React, { useState, useEffect } from 'react'

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
        <button className="btn-primary">Get Started With This Package</button>
        <p className="mt-4 text-sm text-gray-400">
          Like what you see? Contact us for a detailed quote or book a consultation below.
        </p>
      </div>
    </div>
  )
}

export default PricingCalculator 