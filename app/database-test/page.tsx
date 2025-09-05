'use client';

import { useState } from 'react';
import { useSupraContract } from '@/lib/supra-contract-integration';
import { useUserDatabase } from '@/lib/user-database';

export default function DatabaseTestPage() {
  const [testWallet] = useState('0x1234567890abcdef1234567890abcdef12345678');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { 
    getUserReceipts, 
    getUserStats: getBlockchainStats, 
    submitReceipt,
    getTokenBalances 
  } = useSupraContract();
  
  const { 
    getOrCreateUser, 
    getUserAchievements, 
    getUserAnalytics 
  } = useUserDatabase();

  const runTest = async (testType: string) => {
    setLoading(true);
    try {
      let result;
      
      switch (testType) {
        case 'blockchain_receipts':
          result = await getUserReceipts(testWallet);
          break;
          
        case 'blockchain_stats':
          result = await getBlockchainStats(testWallet);
          break;
          
        case 'token_balances':
          result = await getTokenBalances(testWallet);
          break;
          
        case 'submit_receipt':
          result = await submitReceipt(
            testWallet, 
            `receipt_${Date.now()}`, 
            4599, // $45.99
            { name: 'Target', items: ['Groceries', 'Electronics'], category: 'Shopping' }
          );
          break;
          
        case 'user_profile':
          result = await getOrCreateUser(testWallet, 'test@example.com');
          break;
          
        case 'user_achievements':
          result = await getUserAchievements(testWallet);
          break;
          
        case 'user_analytics':
          result = await getUserAnalytics(testWallet);
          break;
          
        default:
          result = { error: 'Unknown test type' };
      }
      
      setResults({ type: testType, data: result, timestamp: new Date().toISOString() });
    } catch (error) {
      setResults({ type: testType, error: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Dropify Database & Blockchain Integration Test
          </h1>
          <p className="text-gray-400 text-lg">
            Test the integration between Supra L1 blockchain and user database systems
          </p>
          <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-700/50">
            <span className="text-sm text-gray-400">Test Wallet: </span>
            <span className="font-mono text-cyan-400">{testWallet}</span>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { id: 'blockchain_receipts', label: 'Get Blockchain Receipts', icon: '🧾', category: 'Supra L1' },
            { id: 'blockchain_stats', label: 'Get Blockchain Stats', icon: '📊', category: 'Supra L1' },
            { id: 'token_balances', label: 'Get Token Balances', icon: '💰', category: 'Supra L1' },
            { id: 'submit_receipt', label: 'Submit New Receipt', icon: '📤', category: 'Supra L1' },
            { id: 'user_profile', label: 'Get/Create User Profile', icon: '👤', category: 'Database' },
            { id: 'user_achievements', label: 'Get User Achievements', icon: '🏆', category: 'Database' },
            { id: 'user_analytics', label: 'Get User Analytics', icon: '📈', category: 'Database' },
          ].map((test) => (
            <button
              key={test.id}
              onClick={() => runTest(test.id)}
              disabled={loading}
              className="p-4 bg-black/30 border border-gray-700/50 rounded-xl hover:border-cyan-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{test.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-white">{test.label}</div>
                  <div className="text-xs text-gray-400">{test.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Running test...</p>
          </div>
        )}

        {/* Results Display */}
        {results && !loading && (
          <div className="bg-black/30 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Test Results: {results.type}</h3>
              <span className="text-sm text-gray-400">{results.timestamp}</span>
            </div>
            
            {results.error ? (
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <div className="text-red-400 font-medium">Error:</div>
                <div className="text-red-300">{results.error}</div>
              </div>
            ) : (
              <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
                <div className="text-green-400 font-medium mb-2">Success:</div>
                <pre className="text-sm text-green-100 overflow-auto max-h-96">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Integration Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-6 rounded-xl border border-cyan-400/30">
            <h3 className="text-lg font-semibold text-white mb-3">🚀 Supra L1 Integration</h3>
            <ul className="text-sm text-cyan-100 space-y-2">
              <li>• Receipt storage and retrieval</li>
              <li>• Token balance queries (DROP & DRF)</li>
              <li>• Transaction submission</li>
              <li>• User statistics calculation</li>
              <li>• Event monitoring and processing</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-xl border border-purple-400/30">
            <h3 className="text-lg font-semibold text-white mb-3">💾 User Database</h3>
            <ul className="text-sm text-purple-100 space-y-2">
              <li>• User profile management</li>
              <li>• Achievement tracking</li>
              <li>• Reward redemption history</li>
              <li>• Analytics and insights</li>
              <li>• Preferences and settings</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-black/50 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">🔗 Architecture Overview</h3>
          <div className="text-gray-300 space-y-2">
            <p><strong>Supra L1 Blockchain:</strong> Stores all receipts, transaction data, and token balances on-chain for transparency and immutability.</p>
            <p><strong>User Database:</strong> Stores user profiles, preferences, achievements, and UI-related data for fast access and enhanced user experience.</p>
            <p><strong>Hybrid Approach:</strong> Critical financial data lives on blockchain, while user experience data lives in the database - best of both worlds!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
