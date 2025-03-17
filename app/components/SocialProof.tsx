"use client"

import React, { useState, useEffect } from 'react'

// Type definitions for our notifications
type ProofNotification = {
  id: number;
  type: 'purchase' | 'booking' | 'stats';
  message: string;
  timestamp: number; // milliseconds
}

// Sample notifications data
const sampleNotifications: ProofNotification[] = [
  { 
    id: 1, 
    type: 'purchase', 
    message: '🚀 John from Atlanta just purchased a Business Pro website!', 
    timestamp: Date.now() - 3000000 // about 50 minutes ago
  },
  { 
    id: 2, 
    type: 'booking', 
    message: '📅 Sarah just booked a consultation call to discuss her project.',
    timestamp: Date.now() - 1800000 // about 30 minutes ago
  },
  { 
    id: 3, 
    type: 'stats', 
    message: '🔥 Limited slots left for this week\'s website builds!',
    timestamp: Date.now() - 900000 // about 15 minutes ago 
  },
  { 
    id: 4, 
    type: 'purchase', 
    message: '💼 Mark from Chicago secured his Elite Custom Site!',
    timestamp: Date.now() - 600000 // about 10 minutes ago
  },
  { 
    id: 5, 
    type: 'stats', 
    message: '📊 Clients report an average 38% increase in leads after launch!',
    timestamp: Date.now() - 180000 // about 3 minutes ago
  },
  { 
    id: 6, 
    type: 'purchase', 
    message: '💻 Emma just purchased a Starter Site package!',
    timestamp: Date.now() - 120000 // about 2 minutes ago
  }
];

const SocialProof = () => {
  const [currentNotification, setCurrentNotification] = useState<ProofNotification | null>(null);
  const [visible, setVisible] = useState(false);

  // Function to format relative time
  const getRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Effect to cycle through notifications
  useEffect(() => {
    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      cycleNotifications();
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  // Function to cycle through notifications
  const cycleNotifications = () => {
    // Get a random notification
    const randomIndex = Math.floor(Math.random() * sampleNotifications.length);
    const notification = sampleNotifications[randomIndex];
    
    // Show notification
    setCurrentNotification(notification);
    setVisible(true);
    
    // Hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      
      // Queue next notification after hiding (between 15-40 seconds)
      const nextDelay = Math.floor(Math.random() * 25000) + 15000;
      const nextTimer = setTimeout(() => {
        cycleNotifications();
      }, nextDelay);
      
      return () => clearTimeout(nextTimer);
    }, 5000);
    
    return () => clearTimeout(hideTimer);
  };

  // If no notification is available yet, don't render anything
  if (!currentNotification) return null;

  return (
    <div 
      className={`fixed bottom-20 left-5 max-w-sm bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-4 transition-all duration-500 z-50 ${
        visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {currentNotification.type === 'purchase' && (
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-xl">
              🚀
            </div>
          )}
          {currentNotification.type === 'booking' && (
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-xl">
              📅
            </div>
          )}
          {currentNotification.type === 'stats' && (
            <div className="w-10 h-10 rounded-full bg-orange-900 flex items-center justify-center text-xl">
              🔥
            </div>
          )}
        </div>
        
        <div className="ml-3 w-full">
          <p className="text-sm font-medium text-white">
            {currentNotification.message}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {getRelativeTime(currentNotification.timestamp)}
          </p>
          
          <button 
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialProof 