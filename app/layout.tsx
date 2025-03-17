import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import ChatWidgetWrapper from './components/ChatWidgetWrapper'
import SocialProofWrapper from './components/SocialProofWrapper'

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
        {children}
        <ChatWidgetWrapper />
        <SocialProofWrapper />
      </body>
    </html>
  )
} 