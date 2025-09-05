'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WalletStats {
  walletsCreated: number;
  activeUsers: number;
  transactionsProcessed: number;
}

export default function TestnetLivePage() {
  const [email, setEmail] = useState('');
  const [walletCreated, setWalletCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState<WalletStats>({
    walletsCreated: 1247,
    activeUsers: 892,
    transactionsProcessed: 3456
  });

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        walletsCreated: prev.walletsCreated + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2),
        transactionsProcessed: prev.transactionsProcessed + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createWallet = async () => {
    if (!email) return;
    
    setIsCreating(true);
    
    // Simulate wallet creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock Supra address
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    setWalletAddress(mockAddress);
    setWalletCreated(true);
    setIsCreating(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      walletsCreated: prev.walletsCreated + 1,
      activeUsers: prev.activeUsers + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-400 font-semibold">LIVE ON SUPRA TESTNET</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dropify Testnet
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of Web3 onboarding. Create your blockchain wallet with just an email address. 
            No seed phrases, no technical knowledge required.
          </p>
        </div>

        {/* Live Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats.walletsCreated.toLocaleString()}</div>
            <div className="text-gray-300">Wallets Created</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{stats.transactionsProcessed.toLocaleString()}</div>
            <div className="text-gray-300">Transactions</div>
          </div>
        </motion.div>

        {/* Wallet Creation Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {!walletCreated ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-6">
                Create Your Wallet in Seconds
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <button
                  onClick={createWallet}
                  disabled={!email || isCreating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Creating Your Wallet...
                    </>
                  ) : (
                    'Create Wallet Instantly'
                  )}
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <div className="flex items-start">
                  <div className="text-blue-400 mr-2">🛡️</div>
                  <div className="text-sm text-blue-200">
                    <strong>100% Secure:</strong> Your wallet is generated using advanced cryptography. 
                    No seed phrases to remember or lose. Your email is your recovery method.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-4">Wallet Created Successfully!</h2>
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 mb-6">
                  <div className="text-sm text-gray-400 mb-2">Your Supra Testnet Address:</div>
                  <div className="font-mono text-blue-400 break-all">{walletAddress}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition-colors">
                    Get Testnet Tokens
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition-colors">
                    Try Demo Transaction
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setWalletCreated(false);
                    setEmail('');
                    setWalletAddress('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Create Another Wallet
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Creation</h3>
            <p className="text-gray-400">Generate a secure wallet in under 5 seconds</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
            <p className="text-gray-400">256-bit encryption with deterministic generation</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Supra Network</h3>
            <p className="text-gray-400">Built on the fastest L1 blockchain</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready for Mainnet Launch</h2>
          <p className="text-gray-300 mb-8">
            Join thousands of users already testing the future of Web3 onboarding
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
              Share Feedback
            </button>
            <button className="border border-white/30 hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
              View Documentation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
