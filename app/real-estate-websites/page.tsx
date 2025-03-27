"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/for-realtors')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center">
        Redirecting to Real Estate Websites page...
      </p>
    </div>
  )
} 