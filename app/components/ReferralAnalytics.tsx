/**
 * Advanced Referral Analytics & Gamification
 * Enhanced tracking and rewards system
 */

'use client';

import React, { useState, useEffect } from 'react';

// Enhanced referral analytics interface
export interface ReferralAnalytics {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalDrfEarned: number;
  conversionRate: number;
  topReferralSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    referrals: number;
    drfEarned: number;
  }>;
}

// Referral leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  userAddress: string;
  username?: string;
  totalReferrals: number;
  totalDrfEarned: number;
  badge?: string;
}

// Gamification badges
export const ReferralBadges = {
  FIRST_REFERRAL: { name: 'First Friend', icon: '🥇', description: 'Made your first referral' },
  POWER_REFERRER: { name: 'Power Referrer', icon: '⚡', description: '10+ successful referrals' },
  VIRAL_CHAMPION: { name: 'Viral Champion', icon: '🏆', description: '25+ successful referrals' },
  COMMUNITY_BUILDER: { name: 'Community Builder', icon: '👑', description: '50+ successful referrals' },
  AMBASSADOR: { name: 'Ambassador', icon: '🌟', description: '100+ successful referrals' }
};

// Referral Leaderboard Component
export function ReferralLeaderboard({ adminAddress }: { adminAddress: string }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    // Mock data - in real implementation, fetch from smart contract
    setTimeout(() => {
      const mockLeaderboard: LeaderboardEntry[] = [
        { rank: 1, userAddress: '0x123...', username: 'CryptoGuru', totalReferrals: 127, totalDrfEarned: 635, badge: 'AMBASSADOR' },
        { rank: 2, userAddress: '0x456...', username: 'BlockchainBob', totalReferrals: 89, totalDrfEarned: 445, badge: 'COMMUNITY_BUILDER' },
        { rank: 3, userAddress: '0x789...', username: 'TokenTina', totalReferrals: 67, totalDrfEarned: 335, badge: 'COMMUNITY_BUILDER' },
        { rank: 4, userAddress: '0xabc...', username: 'DeFiDan', totalReferrals: 43, totalDrfEarned: 215, badge: 'VIRAL_CHAMPION' },
        { rank: 5, userAddress: '0xdef...', username: 'Web3Wizard', totalReferrals: 31, totalDrfEarned: 155, badge: 'VIRAL_CHAMPION' }
      ];
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1000);
  };

  const getBadgeInfo = (badge?: string) => {
    if (!badge) return null;
    return ReferralBadges[badge as keyof typeof ReferralBadges];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">🏆 Referral Leaderboard</h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry) => {
          const badgeInfo = getBadgeInfo(entry.badge);
          return (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                entry.rank <= 3
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">
                      {entry.username || `${entry.userAddress.slice(0, 8)}...`}
                    </span>
                    {badgeInfo && (
                      <span className="text-lg" title={badgeInfo.description}>
                        {badgeInfo.icon}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.userAddress.slice(0, 12)}...
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">
                  {entry.totalReferrals} referrals
                </div>
                <div className="text-sm text-green-600">
                  {entry.totalDrfEarned} DRF earned
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
}

// Referral Challenges Component
export function ReferralChallenges({ userAddress, adminAddress }: {
  userAddress: string;
  adminAddress: string;
}) {
  const [challenges, setChallenges] = useState([
    {
      id: 'weekly_5',
      title: 'Weekly Warrior',
      description: 'Refer 5 friends this week',
      target: 5,
      current: 2,
      reward: '10 DRF',
      timeLeft: '3 days',
      type: 'weekly' as const
    },
    {
      id: 'month_20',
      title: 'Monthly Master',
      description: 'Refer 20 friends this month',
      target: 20,
      current: 8,
      reward: '50 DRF',
      timeLeft: '18 days',
      type: 'monthly' as const
    },
    {
      id: 'streak_7',
      title: 'Streak Master',
      description: 'Refer at least 1 friend for 7 days straight',
      target: 7,
      current: 3,
      reward: '25 DRF',
      timeLeft: '4 days',
      type: 'streak' as const
    }
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">🎯 Referral Challenges</h2>
      
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100;
          const isCompleted = challenge.current >= challenge.target;
          
          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border ${
                isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    {challenge.title}
                    {isCompleted && <span className="ml-2 text-green-600">✅</span>}
                  </h3>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-600">
                    {challenge.reward}
                  </div>
                  <div className="text-xs text-gray-500">
                    {challenge.timeLeft}
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{challenge.current} / {challenge.target}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {isCompleted && (
                <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Claim Reward 🎉
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Enhanced Referral Analytics Component
export function ReferralAnalyticsDashboard({ userAddress, adminAddress }: {
  userAddress: string;
  adminAddress: string;
}) {
  const [analytics, setAnalytics] = useState<ReferralAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userAddress]);

  const loadAnalytics = async () => {
    setLoading(true);
    // Mock data - in real implementation, fetch from smart contract/analytics
    setTimeout(() => {
      setAnalytics({
        totalReferrals: 23,
        activeReferrals: 18,
        pendingReferrals: 5,
        totalDrfEarned: 115,
        conversionRate: 78.3,
        topReferralSources: [
          { source: 'Telegram', count: 12, percentage: 52.2 },
          { source: 'Twitter', count: 7, percentage: 30.4 },
          { source: 'WhatsApp', count: 3, percentage: 13.0 },
          { source: 'Direct Link', count: 1, percentage: 4.3 }
        ],
        dailyStats: [
          { date: '2025-08-28', referrals: 2, drfEarned: 10 },
          { date: '2025-08-29', referrals: 4, drfEarned: 20 },
          { date: '2025-08-30', referrals: 1, drfEarned: 5 },
          { date: '2025-08-31', referrals: 3, drfEarned: 15 },
          { date: '2025-09-01', referrals: 5, drfEarned: 25 },
          { date: '2025-09-02', referrals: 3, drfEarned: 15 },
          { date: '2025-09-03', referrals: 5, drfEarned: 25 }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  if (loading || !analytics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Your Referral Analytics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.activeReferrals}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.totalDrfEarned}</div>
            <div className="text-sm text-gray-600">DRF Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{analytics.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>

        {/* Referral Sources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Referral Sources</h3>
          <div className="space-y-2">
            {analytics.topReferralSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {source.count} ({source.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
