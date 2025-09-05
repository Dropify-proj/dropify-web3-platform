// Secure wallet context - currently disabled for demo
// This file needs next-auth setup which isn't required for the current demo

import React from 'react';

export const SecureWalletProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useSecureWallet = () => {
  return {
    isConnected: false,
    account: null,
    connect: () => {},
    disconnect: () => {},
  };
};
