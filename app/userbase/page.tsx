'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string;
  walletAddress: string;
  joinedAt: string;
  lastActive: string;
  transactionCount: number;
  status: 'active' | 'new' | 'inactive';
}

interface Analytics {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  conversionRate: number;
  avgTimeToWallet: number;
  totalTransactions: number;
}

export default function UserbaseDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 1247,
    newUsersToday: 156,
    activeUsers: 892,
    conversionRate: 94.2,
    avgTimeToWallet: 12,
    totalTransactions: 3456
  });

  const [recentUsers, setRecentUsers] = useState<User[]>([
    {
      id: '1',
      email: 'sarah@example.com',
      walletAddress: '0x742d35...92f4a8',
      joinedAt: '2 minutes ago',
      lastActive: 'Now',
      transactionCount: 3,
      status: 'active'
    },
    {
      id: '2', 
      email: 'mike@startup.io',
      walletAddress: '0x8a3b91...45c2e7',
      joinedAt: '5 minutes ago',
      lastActive: '1 min ago',
      transactionCount: 1,
      status: 'new'
    },
    {
      id: '3',
      email: 'dev@company.com',
      walletAddress: '0x1f6e84...73b9d2',
      joinedAt: '8 minutes ago',
      lastActive: '3 min ago',
      transactionCount: 7,
      status: 'active'
    },
    {
      id: '4',
      email: 'test@gmail.com',
      walletAddress: '0x9c2a57...86e1f3',
      joinedAt: '12 minutes ago',
      lastActive: '12 min ago',
      transactionCount: 0,
      status: 'new'
    },
    {
      id: '5',
      email: 'demo@web3.org',
      walletAddress: '0x4d8f23...91a6c5',
      joinedAt: '15 minutes ago',
      lastActive: '5 min ago',
      transactionCount: 2,
      status: 'active'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        newUsersToday: prev.newUsersToday + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5)
      }));

      // Occasionally add new users
      if (Math.random() < 0.3) {
        const newUser: User = {
          id: Date.now().toString(),
          email: `user${Math.floor(Math.random() * 1000)}@example.com`,
          walletAddress: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 6)}`,
          joinedAt: 'Just now',
          lastActive: 'Now',
          transactionCount: 0,
          status: 'new'
        };
        
        setRecentUsers(prev => [newUser, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'new': return 'text-blue-400 bg-blue-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Testnet User Dashboard</h1>
              <p className="text-gray-400">Real-time analytics for your growing user base</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 font-medium">Live</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">{analytics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Total Users</div>
            <div className="text-xs text-green-400 mt-1">↗ +{analytics.newUsersToday} today</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">{analytics.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Active Users</div>
            <div className="text-xs text-green-400 mt-1">↗ 24h active</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">{analytics.conversionRate}%</div>
            <div className="text-sm text-gray-300">Conversion Rate</div>
            <div className="text-xs text-green-400 mt-1">↗ Email to wallet</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{analytics.avgTimeToWallet}s</div>
            <div className="text-sm text-gray-300">Avg Time</div>
            <div className="text-xs text-green-400 mt-1">↗ To create wallet</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-orange-400 mb-1">{analytics.totalTransactions.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Transactions</div>
            <div className="text-xs text-green-400 mt-1">↗ All time</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-indigo-400 mb-1">{analytics.newUsersToday}</div>
            <div className="text-sm text-gray-300">New Today</div>
            <div className="text-xs text-green-400 mt-1">↗ Last 24h</div>
          </div>
        </motion.div>

        {/* Recent Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold">Recent User Activity</h2>
            <p className="text-gray-400 mt-1">Live stream of new wallet creations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-gray-300">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Wallet Address</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Last Active</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Transactions</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm text-blue-400">{user.walletAddress}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{user.joinedAt}</td>
                    <td className="p-4 text-sm text-gray-400">{user.lastActive}</td>
                    <td className="p-4 text-sm">{user.transactionCount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Growth Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Growth Highlights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Daily Growth Rate</span>
                <span className="text-green-400 font-semibold">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">User Retention (7d)</span>
                <span className="text-blue-400 font-semibold">87.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg Session Duration</span>
                <span className="text-purple-400 font-semibold">4m 32s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Wallet Success Rate</span>
                <span className="text-green-400 font-semibold">99.1%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Next Milestones</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-300">1,000 Users: <span className="text-green-400">Achieved!</span></span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-300">2,500 Users: <span className="text-yellow-400">73% complete</span></span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-gray-300">5,000 Users: <span className="text-gray-400">Target this month</span></span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-300">Mainnet Launch: <span className="text-purple-400">Q4 2025</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
