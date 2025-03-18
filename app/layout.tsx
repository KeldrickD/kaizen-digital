import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import ChatWidgetWrapper from './components/ChatWidgetWrapper'
import SocialProofWrapper from './components/SocialProofWrapper'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kaizen Digital Design - Professional Websites in 48 Hours',
  description: 'Get a professional, high-converting website built in just 48 hours. Hassle-free website design services for businesses looking to grow online.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWidgetWrapper />
          <SocialProofWrapper />
          <Toaster position="top-center" toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }} />
        </Providers>
      </body>
    </html>
  )
} 