'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SupraWalletProvider } from '@/lib/wallet-context-supra';
import { EnhancedAuthProvider } from '@/lib/enhanced-auth-context';

function AppProviders({ children }: { children: ReactNode }) {
  const [someState, setSomeState] = useState(false);

  useEffect(() => {
    if (someState) {
      setSomeState(true);
    }
  }, [someState]);

  return (
    <SupraWalletProvider>
      <EnhancedAuthProvider>
        {children}
      </EnhancedAuthProvider>
    </SupraWalletProvider>
  );
}

export default AppProviders;
