'use client';

import { ReactNode, useEffect, useState } from 'react';

// Enhanced wallet provider with Web3 integration
import { EnhancedWalletProvider } from '../../lib/enhanced-wallet-context';
// Enhanced auth provider with email authentication
import { EnhancedAuthProvider } from '../../lib/enhanced-auth-context';
// Supra wallet provider for blockchain integration
import { SupraWalletProvider } from '../../lib/wallet-context-supra';
// Add Telegram Mini App provider
import { TelegramProvider } from './TelegramMiniApp';

interface ClientOnlyProvidersProps {
  children: ReactNode;
}

/**
 * Client-only providers wrapper to prevent SSR hydration issues
 */
export function ClientOnlyProviders({ children }: ClientOnlyProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR, render children without providers to prevent hydration mismatch
  if (!isMounted) {
    return <>{children}</>;
  }

  // After mount, render with full provider hierarchy
  return (
    <EnhancedAuthProvider>
      <SupraWalletProvider>
        <EnhancedWalletProvider>
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </EnhancedWalletProvider>
      </SupraWalletProvider>
    </EnhancedAuthProvider>
  );
}
