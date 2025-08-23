'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { mainnet, polygon } from 'viem/chains';

interface PrivyWrapperProps {
  children: React.ReactNode;
}

export default function PrivyWrapper({ children }: PrivyWrapperProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpispdty00lu11hfwlrebq7j"}
      config={{
        // Appearance
        appearance: {
          theme: 'dark',
          accentColor: '#06b6d4', // Cyan-500
          logo: undefined,
          showWalletLoginFirst: false,
        },
        // Login methods
        loginMethods: ['email', 'wallet', 'google', 'discord', 'github'],
        // Embedded wallet config
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // External wallet config
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: 'all',
          },
          walletConnect: {
            enabled: true,
          },
        },
        // Additional features
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // Supported blockchain networks
        supportedChains: [mainnet, polygon]
      }}
    >
      {children}
    </PrivyProvider>
  );
}
