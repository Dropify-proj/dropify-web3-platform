'use client';

import { useState, useEffect } from 'react';

export default function AuthButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-12 w-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl animate-pulse border border-cyan-400/30" />
    );
  }

  // Temporary placeholder while Privy is disabled
  return (
    <button
      onClick={() => alert('Web3 auth temporarily disabled - coming soon!')}
      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 text-sm"
    >
      Connect Wallet
    </button>
  );
}
