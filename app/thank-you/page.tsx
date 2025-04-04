"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Client component that uses the search params
function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [countdown, setCountdown] = useState(5)
  const [isDeposit, setIsDeposit] = useState(false)
  const [isRemainingBalance, setIsRemainingBalance] = useState(false)
  const [isLoadingPaymentInfo, setIsLoadingPaymentInfo] = useState(true)
  
  // When the page loads, check if this was a deposit payment or remaining balance
  useEffect(() => {
    async function checkPaymentType() {
      if (!sessionId) {
        setIsLoadingPaymentInfo(false)
        return
      }
      
      try {
        // Call the backend to verify the session and get payment details
        const response = await fetch(`/api/checkout-info?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setIsDeposit(data.paymentType === 'deposit')
          setIsRemainingBalance(data.paymentType === 'remaining_balance')
        }
      } catch (error) {
        console.error('Error checking payment type:', error)
      } finally {
        setIsLoadingPaymentInfo(false)
      }
    }
    
    checkPaymentType()
  }, [sessionId])
  
  // Set up redirect to Google Form for new customers (not remaining balance payments)
  useEffect(() => {
    if (!sessionId || isLoadingPaymentInfo || isRemainingBalance) return
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to your Google Form
          window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdfTwfxqZzoHI2Bp2KfX6ZdVP-awJEd_8swn-uZNyTXig1xMg/viewform?usp=dialog'
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [sessionId, isLoadingPaymentInfo, isRemainingBalance])
  
  if (isLoadingPaymentInfo) {
    return (
      <div className="bg-kaizen-black min-h-screen flex items-center">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto bg-gray-900 p-12 rounded-xl">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-kaizen-red border-r-transparent"></div>
            <p className="mt-4 text-xl">Verifying payment information...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-kaizen-black min-h-screen flex items-center">
      <div className="section-container text-center">
        <div className="max-w-2xl mx-auto bg-gray-900 p-12 rounded-xl">
          <svg className="w-24 h-24 mx-auto mb-6 text-kaizen-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Payment Successful!</h1>
          
          <p className="text-xl mb-6">
            {isRemainingBalance
              ? "Thank you for completing your payment! Your website project is now fully paid."
              : isDeposit 
                ? "Thank you for your deposit payment! We're excited to start building your website." 
                : "Thank you for your payment! We're excited to build your new website!"}
          </p>
          
          {isDeposit && (
            <div className="mb-8 p-4 bg-black rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-kaizen-red">Deposit Payment Received</h3>
              <p className="mb-2">
                Your $500 deposit has been successfully processed. The remaining balance will be due when your
                website is ready for review.
              </p>
            </div>
          )}
          
          {isRemainingBalance && (
            <div className="mb-8 p-4 bg-black rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-kaizen-red">Final Payment Complete</h3>
              <p className="mb-2">
                Thank you for completing your payment. Your website project is now fully paid.
              </p>
              <p>
                We'll be in touch shortly with the final steps to launch your website.
              </p>
            </div>
          )}
          
          {!isRemainingBalance && (
            <>
              <div className="mb-8 p-4 bg-black rounded-lg">
                <p className="mb-2">Next Steps:</p>
                <p>
                  You'll be redirected to our client intake form in {countdown} seconds. 
                  Please provide us with the information we need to get started on your website.
                </p>
              </div>
              
              <p className="text-gray-400">
                If you're not redirected automatically, 
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdfTwfxqZzoHI2Bp2KfX6ZdVP-awJEd_8swn-uZNyTXig1xMg/viewform?usp=dialog" 
                  className="text-kaizen-red hover:underline ml-1"
                >
                  click here
                </a>.
              </p>
            </>
          )}
          
          {isRemainingBalance && (
            <div className="mt-8">
              <a 
                href="/" 
                className="inline-block px-6 py-3 bg-kaizen-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Return to Home
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading fallback
function Loading() {
  return (
    <div className="bg-kaizen-black min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-white">Loading...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ThankYouPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ThankYouContent />
    </Suspense>
  )
} 