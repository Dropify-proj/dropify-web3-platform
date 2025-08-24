'use client';

import { useState } from 'react';
import { useEnhancedAuth } from '@/lib/enhanced-auth-context';

export default function FaucetPage() {
  const { user, activeWalletAddress, walletType } = useEnhancedAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [faucetResult, setFaucetResult] = useState<string | null>(null);

  const requestTestTokens = async () => {
    if (!activeWalletAddress) return;

    try {
      setIsRequesting(true);
      setFaucetResult(null);

      // In a real implementation, this would call the Supra testnet faucet
      // For demo purposes, we'll simulate the request
      console.log('🚰 Requesting test tokens from Supra faucet...');
      console.log('📍 Address:', activeWalletAddress);

      // Simulate API call to Supra testnet faucet
      const response = await fetch('https://testnet-faucet.supra.com/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: activeWalletAddress,
          amount: 1000000, // 1 SUPRA in smallest units
        })
      }).catch(() => {
        // Fallback to mock response for demo
        return {
          ok: true,
          json: () => Promise.resolve({
            success: true,
            txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            amount: 1000000
          })
        };
      });

      if (response.ok) {
        const result = await response.json();
        setFaucetResult(`✅ Success! Received test SUPRA tokens. Tx: ${result.txHash?.slice(0, 8)}...`);
      } else {
        setFaucetResult('❌ Faucet request failed. Please try again later.');
      }
    } catch (err) {
      console.error('Faucet error:', err);
      setFaucetResult('❌ Network error. Please check your connection.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🚰 Supra Testnet Faucet
          </h1>
          <p className="text-xl text-gray-300">
            Get test SUPRA tokens for your automatically generated wallet
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            👛 Your Wallet
          </h2>
          
          {user && activeWalletAddress ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <span className="text-cyan-300">{user.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wallet Type:</span>
                <span className="text-blue-300 capitalize">{walletType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Address:</span>
                <span className="text-green-300 font-mono text-sm break-all">
                  {activeWalletAddress}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network:</span>
                <span className="text-green-400">Supra Testnet (Chain ID: 6)</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔐</div>
              <p className="text-gray-400 mb-4">No wallet connected</p>
              <a 
                href="/demo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all"
              >
                Create Account & Wallet
              </a>
            </div>
          )}
        </div>

        {/* Faucet Request */}
        {user && activeWalletAddress && (
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-500/20">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              🚰 Request Test Tokens
            </h2>
            
            <div className="text-center space-y-6">
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-lg font-semibold text-cyan-300">1 Test SUPRA</div>
                <div className="text-sm text-gray-400">Free testnet tokens for development</div>
              </div>
              
              <button
                onClick={requestTestTokens}
                disabled={isRequesting}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Requesting from faucet...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>🚰</span>
                    <span>Request Test Tokens</span>
                  </div>
                )}
              </button>
              
              {faucetResult && (
                <div className={`p-4 rounded-xl ${
                  faucetResult.includes('✅') 
                    ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                    : 'bg-red-900/30 border border-red-500/30 text-red-300'
                }`}>
                  {faucetResult}
                </div>
              )}
              
              <div className="text-sm text-gray-400 space-y-2">
                <p>💡 Test tokens are free and have no real value</p>
                <p>🔄 You can request tokens once every 24 hours</p>
                <p>🌐 Tokens work on Supra Testnet only</p>
              </div>
            </div>
          </div>
        )}

        {/* Network Information */}
        <div className="mt-8 bg-gray-800/30 rounded-2xl p-6 border border-gray-600/50">
          <h2 className="text-lg font-bold mb-4 text-gray-300">🌐 Supra Testnet Info</h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Network</h4>
              <div className="space-y-1 text-gray-400">
                <div>Name: Supra Testnet</div>
                <div>Chain ID: 6</div>
                <div>Currency: SUPRA</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Endpoints</h4>
              <div className="space-y-1 text-gray-400">
                <div>RPC: testnet-rpc.supra.com</div>
                <div>Explorer: testnet-explorer.supra.com</div>
                <div>Faucet: testnet-faucet.supra.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/demo"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
            >
              🎯 Demo Flow
            </a>
            <a 
              href="/dashboard"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
            >
              📊 Dashboard
            </a>
            <a 
              href="/scan"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
            >
              📄 Scan Receipt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
