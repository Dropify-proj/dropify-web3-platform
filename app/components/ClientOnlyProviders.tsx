'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SupraWalletProvider } from '@/lib/wallet-context-supra';
import { EnhancedAuthProvider } from '@/lib/enhanced-auth-context';
import { EnhancedWalletProvider } from '@/lib/enhanced-wallet-context';

function ClientOnlyProviders({ children }: { children: ReactNode }) {
  const [someState, setSomeState] = useState(false);

  useEffect(() => {
    if (someState) {
      setSomeState(true);
    }
  }, [someState]);

  return (
    <SupraWalletProvider>
      <EnhancedAuthProvider>
        <EnhancedWalletProvider>
          {children}
        </EnhancedWalletProvider>
      </EnhancedAuthProvider>
    </SupraWalletProvider>
  );
}

export default ClientOnlyProviders;
