"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ChatWidget with no SSR to avoid hydration issues
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
});

export default function ChatWidgetWrapper() {
  const [mounted, setMounted] = useState(false);

  // Only show the chat widget after the component has mounted
  // This ensures localStorage is available
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ChatWidget />;
} 