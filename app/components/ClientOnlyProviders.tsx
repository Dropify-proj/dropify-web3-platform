'use client';

import { ReactNode, useEffect, useState } from 'react';

// Enhanced wallet provider with Web3 integration
import { EnhancedWalletProvider } from '../../lib/enhanced-wallet-context';
// Enhanced auth provider with email authentication
import { EnhancedAuthProvider } from '../../lib/enhanced-auth-context';
// Supra wallet provider for blockchain integration
import { SupraWalletProvider } from '../../lib/wallet-context-supra';

interface ClientOnlyProvidersProps {
  children: ReactNode;
}

/**
 * Client-only providers wrapper to prevent SSR hydration issues
 */
export function ClientOnlyProviders({ children }: ClientOnlyProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Ensure DOM is fully ready and hydration is complete
    const timer = setTimeout(() => {
      console.log('🚀 ClientOnlyProviders mounting after DOM ready');
      setIsMounted(true);
    }, 200); // Increased delay for better hydration safety

    // Also check if document is fully loaded
    if (document.readyState === 'complete') {
      console.log('📄 Document already loaded, mounting immediately');
      clearTimeout(timer);
      setIsMounted(true);
    } else {
      const handleLoad = () => {
        console.log('📄 Document loaded, mounting providers');
        clearTimeout(timer);
        setIsMounted(true);
      };
      window.addEventListener('load', handleLoad);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('load', handleLoad);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  // During SSR or initial render, show a loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Dropify</h2>
          <p className="text-gray-600">Initializing Web3 platform...</p>
        </div>
      </div>
    );
  }

  // After mount, render with full provider hierarchy wrapped in error boundary
  try {
    return (
      <EnhancedAuthProvider>
        <SupraWalletProvider>
          <EnhancedWalletProvider>
              {children}
          </EnhancedWalletProvider>
        </SupraWalletProvider>
      </EnhancedAuthProvider>
    );
  } catch (error) {
    console.error('Error in ClientOnlyProviders:', error);
    
    // If we encounter an error, try to recover by showing children without providers
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsMounted(false);
        // Force remount after a delay
        setTimeout(() => setIsMounted(true), 100);
      }, 1000);
    }
    
    // Fallback: render children without providers
    return <>{children}</>;
  }
}
