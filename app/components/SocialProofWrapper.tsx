"use client"

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import SocialProof to ensure client-side only rendering
const SocialProof = dynamic(() => import('./SocialProof'), { ssr: false })

const SocialProofWrapper = () => {
  return <SocialProof />
}

export default SocialProofWrapper 