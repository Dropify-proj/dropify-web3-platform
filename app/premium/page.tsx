/**
 * Premium Dashboard - Comprehensive premium features and analytics
 */

'use client';

import { useState } from 'react';
import Header from '../components/Header';
import PremiumSubscription from '../components/PremiumSubscription';
import PremiumStatusWidget from '../components/PremiumStatusWidget';

export default function PremiumDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mockData, setMockData] = useState({
    totalScans: 47,
    normalRewards: 4.7,
    premiumRewards: 7.05,
    bonusEarned: 2.35,
    starsSaved: 150,
    activationHistory: [
      { date: '2024-01-15', stars: 50, duration: 30, expired: true },
      { date: '2024-01-30', stars: 50, duration: 30, expired: false },
      { date: '2024-02-10', stars: 50, duration: 30, expired: false }
    ]
  });

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "0x5678...";
  const userAddress = "0x1234..."; // Default user address

  // Mock premium status for web version
  const premiumStatus = {
    totalStarsSpent: 150,
    activations: 3,
    isActive: true
  };
  const isUserPremium = true; // Mock premium status

  // Navigation function for web version
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'subscription', label: '⭐ Subscription', icon: '⭐' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
    { id: 'history', label: '📋 History', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Premium Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PremiumStatusWidget 
              userAddress={userAddress}
              adminAddress={adminAddress}
            />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <span className="mr-3">👑</span>
            Premium Dashboard
            <span className="ml-3">👑</span>
          </h1>
          
          <p className="text-gray-300 text-lg">
            {isUserPremium 
              ? 'Enjoy 1.5x rewards on every receipt scan!' 
              : 'Unlock premium rewards with Telegram Stars'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🚀</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {isUserPremium ? '1.5x' : '1.0x'}
                    </div>
                    <div className="text-sm text-gray-300">Reward Multiplier</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">💎</div>
                    <div className="text-2xl font-bold text-green-400">
                      +{mockData.bonusEarned.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-300">Extra DROP Earned</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {premiumStatus?.totalStarsSpent || 0}
                    </div>
                    <div className="text-sm text-gray-300">Stars Invested</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Recent Premium Activity
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🧾</span>
                      <div>
                        <div className="text-white font-medium">Receipt Scan</div>
                        <div className="text-gray-400 text-sm">$24.50 purchase</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">
                        +0.37 DROP {isUserPremium && <span className="text-yellow-400">(+50%)</span>}
                      </div>
                      <div className="text-gray-400 text-sm">2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">👥</span>
                      <div>
                        <div className="text-white font-medium">Referral Bonus</div>
                        <div className="text-gray-400 text-sm">Friend joined</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">+5.0 DRF</div>
                      <div className="text-gray-400 text-sm">Yesterday</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <PremiumSubscription 
              userAddress={userAddress}
              adminAddress={adminAddress}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* ROI Calculator */}
              <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">💰</span>
                  Premium ROI Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Without Premium</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Scans:</span>
                        <span className="text-white">{mockData.totalScans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">DROP Earned:</span>
                        <span className="text-white">{mockData.normalRewards.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cost:</span>
                        <span className="text-white">$0.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">With Premium</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Scans:</span>
                        <span className="text-white">{mockData.totalScans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">DROP Earned:</span>
                        <span className="text-green-400">{mockData.premiumRewards.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Stars Cost:</span>
                        <span className="text-white">⭐ 150 (~$3.00)</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
                        <span className="text-yellow-400 font-semibold">Extra Earned:</span>
                        <span className="text-green-400 font-semibold">+{mockData.bonusEarned.toFixed(2)} DROP</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">
                      🎯 {((mockData.bonusEarned / 3) * 100).toFixed(0)}% ROI on Premium Investment
                    </div>
                    <div className="text-green-300 text-sm mt-1">
                      Premium pays for itself with active usage!
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Patterns */}
              <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Usage Patterns
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">47</div>
                    <div className="text-gray-300 text-sm">Total Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">15.7</div>
                    <div className="text-gray-300 text-sm">Avg per Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">$486</div>
                    <div className="text-gray-300 text-sm">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">3</div>
                    <div className="text-gray-300 text-sm">Premium Periods</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Activation History */}
              <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Premium Activation History
                </h3>
                
                <div className="space-y-3">
                  {mockData.activationHistory.map((activation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {activation.expired ? '⭐' : '👑'}
                        </span>
                        <div>
                          <div className="text-white font-medium">
                            Premium Activation #{mockData.activationHistory.length - index}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(activation.date).toLocaleDateString()} • {activation.duration} days
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-semibold">
                          ⭐ {activation.stars} Stars
                        </div>
                        <div className={`text-sm ${activation.expired ? 'text-gray-400' : 'text-green-400'}`}>
                          {activation.expired ? 'Expired' : 'Active'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {mockData.activationHistory.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⭐</div>
                    <div className="text-gray-400">No premium activations yet</div>
                    <div className="text-gray-500 text-sm">Activate premium to see your history here</div>
                  </div>
                )}
              </div>

              {/* Premium Statistics */}
              <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Lifetime Premium Stats
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {premiumStatus?.totalStarsSpent || 0}
                    </div>
                    <div className="text-gray-300 text-sm">Total Stars Spent</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {mockData.bonusEarned.toFixed(1)}
                    </div>
                    <div className="text-gray-300 text-sm">Bonus DROP Earned</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {premiumStatus?.activations || 0}
                    </div>
                    <div className="text-gray-300 text-sm">Activations</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">90</div>
                    <div className="text-gray-300 text-sm">Total Premium Days</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/receipt-camera')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              📱 Scan Receipt
            </button>
            
            <button
              onClick={() => navigate('/referrals')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              👥 Referrals
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              📊 Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
