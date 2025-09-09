'use client';

import React, { useState, useEffect } from 'react';

interface SSRSafeHomeProps {
  children: React.ReactNode;
}

/**
 * SSR-Safe wrapper for the Home page to prevent hydration mismatch
 */
export function SSRSafeHome({ children }: SSRSafeHomeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR, render loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Dropify Technologies</h1>
          <p className="text-blue-200">Loading Web3 Platform...</p>
        </div>
      </div>
    );
  }

  // After mount, render the actual page
  return <>{children}</>;
}
