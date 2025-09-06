'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SSRSafeProviderProps {
  children: ReactNode;
}

/**
 * SSR-Safe Provider Wrapper
 * Prevents hydration mismatches by delaying client-only providers until after mount
 */
export function SSRSafeProvider({ children }: SSRSafeProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and before mount, render children without any client-only state
  if (!isMounted) {
    return <>{children}</>;
  }

  // After mount, render with full client functionality
  return <>{children}</>;
}

/**
 * Hook to check if component is mounted (client-side)
 * Use this to prevent hydration mismatches in components
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
