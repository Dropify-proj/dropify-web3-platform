'use client';

import { useState } from 'react';

export default function BusinessSubscriptionPage() {
  const [businessStats] = useState({
    totalDrfBurned: 15420,
    monthlyDrfBurn: 2540,
    activeBusinesses: 127,
    totalSubscriptionRevenue: 89650
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🏢 Business Data Analytics
          </h1>
          <p className="text-gray-400 text-lg">
            Subscribe to anonymous consumer insights powered by receipt data • Burn DRF for premium analytics
          </p>
        </div>

        {/* DRF Burn Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-400/30">
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-black">🔥</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {businessStats.totalDrfBurned.toLocaleString()}
            </div>
            <div className="text-purple-300 text-sm">
              Total DRF Burned
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 p-6 rounded-2xl border border-pink-400/30">
            <div className="w-12 h-12 bg-pink-400 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-black">📅</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {businessStats.monthlyDrfBurn.toLocaleString()}
            </div>
            <div className="text-pink-300 text-sm">
              Monthly DRF Burn
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-6 rounded-2xl border border-cyan-400/30">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-black">🏢</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {businessStats.activeBusinesses}
            </div>
            <div className="text-cyan-300 text-sm">
              Active Businesses
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-400/30">
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-black">💰</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              ${businessStats.totalSubscriptionRevenue.toLocaleString()}
            </div>
            <div className="text-green-300 text-sm">
              Subscription Revenue
            </div>
          </div>
        </div>

        {/* Data Monetization Explanation */}
        <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">� Revolutionary Data Monetization Model</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-3">1. Consumer Uploads</h4>
              <p className="text-gray-400 text-sm">
                Users scan receipts and earn DROP tokens. Anonymous purchase data is extracted automatically.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="text-4xl mb-4">🔥</div>
              <h4 className="text-xl font-bold text-purple-400 mb-3">2. Business Subscriptions</h4>
              <p className="text-gray-400 text-sm">
                Companies burn DRF tokens to access real-time consumer insights and spending analytics.
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="text-4xl mb-4">🎁</div>
              <h4 className="text-xl font-bold text-green-400 mb-3">3. Reward Funding</h4>
              <p className="text-gray-400 text-sm">
                Subscription revenue funds user rewards through strategic ad partnerships and sponsorships.
              </p>
            </div>
          </div>
        </div>

        {/* Data Analytics Tiers */}
        <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Anonymous Consumer Data Subscriptions</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/20 p-6 rounded-xl border border-gray-600/30">
              <h4 className="text-lg font-bold text-white mb-4">📈 Market Insights</h4>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-400">50 DRF/month</div>
                <div className="text-sm text-gray-400">Basic Consumer Analytics</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Spending category trends</li>
                <li>✓ Regional purchase patterns</li>
                <li>✓ Monthly consumer reports</li>
                <li>✓ Anonymous demographic insights</li>
                <li>✓ Email support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-xl border border-purple-400/30">
              <h4 className="text-lg font-bold text-white mb-4">🚀 Business Intelligence</h4>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-400">200 DRF/month</div>
                <div className="text-sm text-gray-400">Advanced Data Analytics</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Real-time spending dashboards</li>
                <li>✓ Competitor price analysis</li>
                <li>✓ Seasonal behavior patterns</li>
                <li>✓ Custom data exports</li>
                <li>✓ API access to insights</li>
                <li>✓ Priority support</li>
              </ul>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-gray-600/30">
              <h4 className="text-lg font-bold text-white mb-4">👑 Enterprise Analytics</h4>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-400">500+ DRF/month</div>
                <div className="text-sm text-gray-400">Complete Data Platform</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ White-label analytics dashboard</li>
                <li>✓ Custom ML model training</li>
                <li>✓ Predictive consumer insights</li>
                <li>✓ Dedicated data scientist</li>
                <li>✓ Custom integrations</li>
                <li>✓ 24/7 premium support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Business Activity */}
        <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-6">🔥 Recent DRF Burns</h3>
          
          <div className="space-y-4">
            {[
              { business: 'RetailCorp Analytics', amount: 200, plan: 'Professional', date: '2 hours ago' },
              { business: 'FoodChain Insights', amount: 500, plan: 'Enterprise', date: '5 hours ago' },
              { business: 'MarketResearch Inc', amount: 50, plan: 'Starter', date: '1 day ago' },
              { business: 'Consumer Trends LLC', amount: 200, plan: 'Professional', date: '1 day ago' },
              { business: 'DataDriven Solutions', amount: 750, plan: 'Enterprise', date: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">🔥</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{activity.business}</div>
                    <div className="text-gray-400 text-sm">{activity.plan} Plan • {activity.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400 font-bold">{activity.amount} DRF Burned</div>
                  <div className="text-gray-400 text-sm">Monthly Subscription</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
