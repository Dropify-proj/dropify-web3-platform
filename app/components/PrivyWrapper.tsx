'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia, polygonMumbai } from 'viem/chains';

interface PrivyWrapperProps {
  children: React.ReactNode;
}

// Custom Supra testnet chain configuration
const supraTestnet = {
  id: 6,
  name: 'Supra Testnet',
  network: 'supra-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SUPRA',
    symbol: 'SUPRA',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.supra.com'] },
    default: { http: ['https://testnet-rpc.supra.com'] },
  },
  blockExplorers: {
    default: { name: 'Supra Explorer', url: 'https://testnet-explorer.supra.com' },
  },
  testnet: true,
} as const;

export default function PrivyWrapper({ children }: PrivyWrapperProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  if (!appId) {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not configured');
    return <div>Configuration Error: Missing Privy App ID</div>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Appearance
        appearance: {
          theme: 'dark',
          accentColor: '#06b6d4', // Cyan-500
          logo: undefined,
          showWalletLoginFirst: false,
        },
        // Login methods
        loginMethods: ['email', 'wallet'],
        // Embedded wallet config
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // External wallet config
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: 'smartWalletOnly',
          },
          walletConnect: {
            enabled: true,
          },
        },
        // Additional features
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // Supported blockchain networks - Fixed for build
        supportedChains: [sepolia, polygonMumbai, supraTestnet],
        // Default chain
        defaultChain: supraTestnet,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
