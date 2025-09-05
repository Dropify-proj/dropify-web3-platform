'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../../lib/wallet-context-build-safe';

interface ReceiptRecord {
  id: string;
  timestamp: number;
  merchant: string;
  amount: number;
  dropEarned: number;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TokenStats {
  totalDropEarned: number;
  totalDrfBurnedByBusinesses: number; // DRF burned by business subscribers
  totalReceipts: number;
  totalSpent: number;
  weeklySpending: number[];
  topMerchants: { name: string; amount: number; count: number }[];
}

export default function UserDashboard() {
  const { isConnected, dropBalance, drfBalance, account } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'receipts' | 'analytics' | 'rewards'>('overview');
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadUserData();
    }
  }, [isConnected]);

  const loadUserData = async () => {
    setLoading(true);
    
    // Simulate loading user data
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock receipt data
    const mockReceipts: ReceiptRecord[] = [
      {
        id: 'rcpt_1',
        timestamp: Date.now() - 86400000, // 1 day ago
        merchant: 'Starbucks',
        amount: 847, // $8.47
        dropEarned: 8,
        transactionHash: '0x1234...abcd',
        status: 'confirmed'
      },
      {
        id: 'rcpt_2',
        timestamp: Date.now() - 172800000, // 2 days ago
        merchant: 'Target',
        amount: 4521, // $45.21
        dropEarned: 45,
        transactionHash: '0x5678...efgh',
        status: 'confirmed'
      },
      {
        id: 'rcpt_3',
        timestamp: Date.now() - 259200000, // 3 days ago
        merchant: 'CVS Pharmacy',
        amount: 1234, // $12.34
        dropEarned: 12,
        transactionHash: '0x9abc...ijkl',
        status: 'confirmed'
      },
      {
        id: 'rcpt_4',
        timestamp: Date.now() - 345600000, // 4 days ago
        merchant: 'McDonald\'s',
        amount: 1089, // $10.89
        dropEarned: 11,
        transactionHash: '0xdef0...mnop',
        status: 'confirmed'
      },
      {
        id: 'rcpt_5',
        timestamp: Date.now() - 432000000, // 5 days ago
        merchant: 'Walmart',
        amount: 8765, // $87.65
        dropEarned: 88,
        transactionHash: '0x1357...qrst',
        status: 'confirmed'
      }
    ];

    // Calculate stats
    const totalDropEarned = mockReceipts.reduce((sum, r) => sum + r.dropEarned, 0);
    const totalDrfBurnedByBusinesses = 2540; // Simulated DRF burned by business subscribers
    const totalSpent = mockReceipts.reduce((sum, r) => sum + r.amount, 0);

    const mockStats: TokenStats = {
      totalDropEarned,
      totalDrfBurnedByBusinesses,
      totalReceipts: mockReceipts.length,
      totalSpent,
      weeklySpending: [125.43, 89.67, 156.32, 78.91, 234.56, 98.76, 167.89],
      topMerchants: [
        { name: 'Walmart', amount: 8765, count: 1 },
        { name: 'Target', amount: 4521, count: 1 },
        { name: 'CVS Pharmacy', amount: 1234, count: 1 },
        { name: 'McDonald\'s', amount: 1089, count: 1 },
        { name: 'Starbucks', amount: 847, count: 1 }
      ]
    };

    setReceipts(mockReceipts);
    setStats(mockStats);
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-400/30 max-w-md">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect to View Dashboard</h2>
          <p className="text-gray-400 mb-6">
            Sign in to access your personalized token dashboard and receipt analytics
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard...</h2>
          <p className="text-gray-400">Fetching your token data and receipt history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📊 Rewards Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Track your DROP earnings, redeem rewards, and see your contribution to consumer insights
          </p>
          <div className="mt-4 text-cyan-400 font-medium">
            Welcome back, {account?.address()?.slice(0, 6) + '...' + account?.address()?.slice(-4) || 'User'}
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* DROP Balance */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-6 rounded-2xl border border-cyan-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-black">💧</span>
              </div>
              <div className="text-cyan-400 text-sm font-medium">+{stats?.totalDropEarned || 0} earned</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {dropBalance.toLocaleString()} DROP
            </div>
            <div className="text-cyan-300 text-sm">
              Available for Rewards
            </div>
          </div>

          {/* Data Contribution */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-black">�</span>
              </div>
              <div className="text-green-400 text-sm font-medium">Anonymous</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats?.totalReceipts || 0}
            </div>
            <div className="text-green-300 text-sm">
              Data Points Contributed
            </div>
          </div>

          {/* Total Spending */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-2xl border border-orange-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-black">💰</span>
              </div>
              <div className="text-orange-400 text-sm font-medium">Total Spent</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${((stats?.totalSpent || 0) / 100).toFixed(2)}
            </div>
            <div className="text-orange-300 text-sm">
              Consumer Activity
            </div>
          </div>

          {/* Rewards Redeemed */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-black">🎁</span>
              </div>
              <div className="text-purple-400 text-sm font-medium">DROP Burned</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              $45.00
            </div>
            <div className="text-purple-300 text-sm">
              Rewards Claimed
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-black/30 p-2 rounded-2xl border border-gray-700/50">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'receipts', label: '🧾 Receipt History', icon: '🧾' },
            { id: 'rewards', label: '🎁 Redeem Rewards', icon: '🎁' },
            { id: 'insights', label: '📈 Data Insights', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:scale-105 transition-transform">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="font-bold">Scan New Receipt</div>
                    <div className="text-xs opacity-75">Earn more DROP tokens</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-medium hover:scale-105 transition-transform">
                  <span className="text-2xl">🎁</span>
                  <div className="text-left">
                    <div className="font-bold">Redeem Rewards</div>
                    <div className="text-xs opacity-75">Burn DROP for prizes</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white font-medium hover:scale-105 transition-transform">
                  <span className="text-2xl">�</span>
                  <div className="text-left">
                    <div className="font-bold">Data Insights</div>
                    <div className="text-xs opacity-75">Your contribution impact</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">🕒 Recent Activity</h3>
              <div className="space-y-4">
                {receipts.slice(0, 5).map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">💧</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{receipt.merchant}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(receipt.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">+{receipt.dropEarned} DROP</div>
                      <div className="text-gray-400 text-sm">${(receipt.amount / 100).toFixed(2)} spent</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'receipts' && (
          <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">🧾 Receipt History</h3>
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="bg-black/20 p-6 rounded-xl border border-gray-600/30">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="text-white font-bold">{receipt.merchant}</div>
                      <div className="text-gray-400 text-sm">
                        {new Date(receipt.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold">${(receipt.amount / 100).toFixed(2)}</div>
                      <div className="text-gray-400 text-sm">Amount</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-green-400 font-bold">+{receipt.dropEarned}</div>
                      <div className="text-gray-400 text-sm">DROP Earned</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        receipt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        receipt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {receipt.status}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">
            {/* Spending Chart */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">📈 Weekly Spending Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {stats.weeklySpending.map((amount, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all hover:from-cyan-400 hover:to-cyan-300"
                      style={{ height: `${(amount / Math.max(...stats.weeklySpending)) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                    <div className="text-xs text-cyan-400 font-medium">
                      ${amount.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Merchants */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">🏪 Top Merchants</h3>
              <div className="space-y-4">
                {stats.topMerchants.map((merchant, index) => (
                  <div key={merchant.name} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{merchant.name}</div>
                        <div className="text-gray-400 text-sm">{merchant.count} transaction{merchant.count !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div className="text-cyan-400 font-bold">
                      ${(merchant.amount / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            {/* Rewards Explanation */}
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-700/50 text-center">
              <h4 className="text-xl font-bold text-white mb-4">🎁 How Rewards Work</h4>
              <p className="text-gray-400 mb-4">
                Burn your earned DROP tokens to claim rewards. Ad revenue from businesses subscribing to data insights funds these rewards!
              </p>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-sm text-purple-200">
                  💰 Businesses pay DRF for data → 📊 Data insights generated → 🎁 Ad revenue funds rewards → 💧 You burn DROP for prizes
                </div>
              </div>
            </div>

            {/* Available Rewards */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">🔥 Burn DROP for Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: '$5 Amazon Gift Card', cost: 500, icon: '🛍️', available: dropBalance >= 500, funded: 'Target ads' },
                  { name: '$10 Starbucks Card', cost: 1000, icon: '☕', available: dropBalance >= 1000, funded: 'Coffee chain insights' },
                  { name: '$25 Target Gift Card', cost: 2500, icon: '🎯', available: dropBalance >= 2500, funded: 'Retail analytics' },
                  { name: '$50 Gas Card', cost: 5000, icon: '⛽', available: dropBalance >= 5000, funded: 'Energy company data' },
                  { name: '$100 Visa Gift Card', cost: 10000, icon: '💳', available: dropBalance >= 10000, funded: 'Financial insights' },
                  { name: 'Premium Subscription', cost: 1500, icon: '⭐', available: dropBalance >= 1500, funded: 'Streaming analytics' }
                ].map((reward) => (
                  <div key={reward.name} className={`p-6 rounded-xl border transition-all ${
                    reward.available 
                      ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30 hover:scale-105' 
                      : 'bg-black/20 border-gray-600/30 opacity-50'
                  }`}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">{reward.icon}</div>
                      <h4 className="text-white font-bold mb-2">{reward.name}</h4>
                      <div className="text-cyan-400 font-bold mb-2">🔥 {reward.cost.toLocaleString()} DROP</div>
                      <div className="text-xs text-gray-400 mb-4">Funded by: {reward.funded}</div>
                      <button 
                        disabled={!reward.available}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          reward.available
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {reward.available ? '🔥 Burn DROP' : 'Need More DROP'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Data Impact Overview */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Your Anonymous Data Impact</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">100% Anonymous</h4>
                  <p className="text-gray-400 text-sm">
                    Your personal information is never shared. Only spending patterns and purchase categories are analyzed.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Business Insights</h4>
                  <p className="text-gray-400 text-sm">
                    Businesses use aggregated data to understand consumer trends and optimize their products.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Reward Funding</h4>
                  <p className="text-gray-400 text-sm">
                    Revenue from data subscriptions funds your DROP token rewards through strategic ad partnerships.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Points Contributed */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">🗂️ Anonymous Data Points You've Contributed</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Spending Categories */}
                <div className="bg-black/20 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">🛍️ Spending Categories</h4>
                  <div className="space-y-3">
                    {[
                      { category: 'Food & Dining', percentage: 35, businesses: 23 },
                      { category: 'Retail Shopping', percentage: 28, businesses: 18 },
                      { category: 'Healthcare', percentage: 15, businesses: 8 },
                      { category: 'Entertainment', percentage: 12, businesses: 12 },
                      { category: 'Other', percentage: 10, businesses: 15 }
                    ].map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between">
                        <span className="text-gray-300">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" 
                              style={{ width: `${cat.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-cyan-400 text-sm">{cat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Insights Generated */}
                <div className="bg-black/20 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">🏢 Business Insights Generated</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="text-green-400 font-medium">Consumer Trend Analysis</div>
                      <div className="text-gray-300 text-sm">Your data helped identify 3 emerging spending patterns</div>
                    </div>
                    
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-400 font-medium">Seasonal Behavior Insights</div>
                      <div className="text-gray-300 text-sm">Contributed to 5 seasonal shopping reports</div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <div className="text-purple-400 font-medium">Price Sensitivity Studies</div>
                      <div className="text-gray-300 text-sm">Data used in 12 pricing optimization models</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Model Transparency */}
            <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">💡 How Your Data Creates Value</h3>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-cyan-400 font-bold">1. Upload Receipt</div>
                  <div className="text-gray-400 text-sm">You scan receipt & earn DROP</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-green-400 font-bold">2. Anonymous Extraction</div>
                  <div className="text-gray-400 text-sm">AI extracts spending patterns only</div>
                </div>
                
                <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-purple-400 font-bold">3. Business Insights</div>
                  <div className="text-gray-400 text-sm">Businesses pay DRF for analytics</div>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🎁</div>
                  <div className="text-orange-400 font-bold">4. Reward Funding</div>
                  <div className="text-gray-400 text-sm">Revenue funds your DROP rewards</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
