import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

// Dynamically import ChatWidget with no SSR to avoid hydration issues
// since it uses browser APIs like localStorage
const ChatWidget = dynamic(() => import('./components/ChatWidget'), {
  ssr: false,
})

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
        <ChatWidget />
      </body>
    </html>
  )
} 