'use client';

import { useState, useEffect } from 'react';
import { useSupraWallet } from '../../lib/wallet-context-supra';
import { useSupraContract, BlockchainReceipt, UserBlockchainStats } from '../../lib/supra-contract-integration';
import { useUserDatabase, UserProfile, UserAchievement, initializeSampleData } from '../../lib/user-database';

// Receipt data structure for the dashboard (combining blockchain + database data)
interface Receipt {
  id: string;
  date: string;
  store: string;
  amount: number; // in cents
  dropEarned: number;
  items: string[];
  category: string;
  status: 'processed' | 'pending' | 'failed';
  transactionHash?: string;
  receiptHash?: string;
}

// Enhanced user statistics combining blockchain and database data
interface UserStats {
  totalReceipts: number;
  totalSpent: number; // in cents
  totalDropEarned: number;
  totalDropBurned: number;
  totalDrfEarned: number;
  accountAge: number; // in days
  favoriteStores: { name: string; visits: number }[];
  monthlyActivity: { month: string; receipts: number; earned: number }[];
  achievements: UserAchievement[];
  completedAchievements: number;
  totalRedemptions: number;
}

export default function UserDashboard() {
  const { 
    isConnected, 
    account, 
    dropBalance, 
    drfBalance, 
    refreshBalances, 
    recentEvents 
  } = useSupraWallet();
  
  // Supra contract integration
  const {
    getUserReceipts,
    getUserStats: getBlockchainStats,
    getTokenBalances,
    isLoading: contractLoading,
    error: contractError
  } = useSupraContract();
  
  // User database integration
  const {
    getOrCreateUser,
    getUserAchievements,
    getUserAnalytics,
    isLoading: dbLoading,
    error: dbError
  } = useUserDatabase();

  const [activeTab, setActiveTab] = useState<'overview' | 'receipts' | 'rewards' | 'achievements' | 'analytics'>('overview');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastDataFetch, setLastDataFetch] = useState<number>(0);

  // Auto-refresh balances when new events are detected
  useEffect(() => {
    if (isConnected && recentEvents.length > 0) {
      console.log('🔄 New wallet activity detected, refreshing balances...');
      refreshBalances();
    }
  }, [recentEvents, isConnected, refreshBalances]);

  // Periodic balance refresh every 10 seconds when dashboard is active
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      console.log('⏰ Periodic balance refresh...');
      refreshBalances();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [isConnected, refreshBalances]);

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Load user data from blockchain and database
  const loadUserData = async () => {
    if (!account?.address) return;
    
    setLoading(true);
    console.log('📊 Loading user data from Supra L1 and database...');

    try {
      // 1. Get or create user profile in database
      const profile = await getOrCreateUser(account.address);
      setUserProfile(profile);

      // 2. Fetch receipts from Supra L1 blockchain
      const blockchainReceipts = await getUserReceipts(account.address);
      
      // Convert blockchain receipts to dashboard format
      const formattedReceipts: Receipt[] = blockchainReceipts.map(receipt => ({
        id: receipt.id,
        date: new Date(receipt.timestamp).toISOString().split('T')[0],
        store: receipt.store || 'Unknown Store',
        amount: receipt.purchaseAmount,
        dropEarned: receipt.dropEarned,
        items: receipt.items || ['Items'],
        category: receipt.category || 'General',
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        receiptHash: receipt.receiptHash
      }));
      setReceipts(formattedReceipts);

      // 3. Get blockchain statistics
      const blockchainStats = await getBlockchainStats(account.address);
      
      // 4. Get user achievements from database
      const achievements = await getUserAchievements(account.address);
      
      // 5. Get user analytics from database
      const analytics = await getUserAnalytics(account.address);

      // 6. Combine all data into stats object
      if (blockchainStats && analytics) {
        const combinedStats: UserStats = {
          totalReceipts: blockchainStats.totalReceipts,
          totalSpent: blockchainStats.totalSpent,
          totalDropEarned: blockchainStats.totalDropEarned,
          totalDropBurned: blockchainStats.totalDropBurned,
          totalDrfEarned: blockchainStats.totalDrfEarned,
          accountAge: analytics.accountAge,
          favoriteStores: blockchainStats.favoriteStores,
          monthlyActivity: blockchainStats.monthlyActivity,
          achievements,
          completedAchievements: analytics.completedAchievements,
          totalRedemptions: analytics.totalRedemptions
        };
        setStats(combinedStats);
      }

      setLastDataFetch(Date.now());
      console.log('✅ User data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when user connects or on manual refresh
  useEffect(() => {
    if (isConnected && account?.address) {
      loadUserData();
    }
  }, [isConnected, account?.address]);

  // Auto-refresh data every 30 seconds if user is active
  useEffect(() => {
    if (!isConnected || !account?.address) return;
    
    const interval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastDataFetch;
      if (timeSinceLastFetch > 30000) { // 30 seconds
        console.log('🔄 Auto-refreshing user data...');
        loadUserData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, account?.address, lastDataFetch]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your dashboard</h2>
          <p className="text-gray-400">Connect your wallet or sign up with email to track your Dropify journey</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-cyan-400/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-gray-400">
                Welcome back, {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadUserData}
                disabled={loading || contractLoading || dbLoading}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(loading || contractLoading || dbLoading) ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  '🔄 Refresh Data'
                )}
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-400">Account Age</div>
                <div className="text-xl font-bold text-cyan-400">{stats?.accountAge || 0} days</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-black/20 p-1 rounded-xl">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'receipts', label: 'Receipts', icon: '🧾' },
              { id: 'rewards', label: 'Rewards', icon: '🎁' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-black/30'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Messages */}
        {(contractError || dbError) && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">
                {contractError && `Blockchain Error: ${contractError}`}
                {contractError && dbError && ' | '}
                {dbError && `Database Error: ${dbError}`}
              </span>
            </div>
          </div>
        )}

        {/* User Profile Info */}
        {userProfile && (
          <div className="mb-6 p-4 bg-black/20 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {userProfile.displayName || `User ${userProfile.walletAddress.slice(0, 6)}`}
                </h3>
                <p className="text-sm text-gray-400">
                  Member since {new Date(userProfile.accountMetadata.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Logins</div>
                  <div className="text-lg font-bold text-cyan-400">{userProfile.accountMetadata.totalLogins}</div>
                </div>
                {userProfile.accountMetadata.referralCode && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Referral Code</div>
                    <div className="text-lg font-bold text-purple-400">{userProfile.accountMetadata.referralCode}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Token Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-6 rounded-2xl border border-cyan-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">DROP Balance</h3>
                  <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">💧</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {dropBalance.toLocaleString()}
                </div>
                <div className="text-sm text-cyan-300">Utility Tokens</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">DRF Balance</h3>
                  <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">💎</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {drfBalance.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300">Governance Tokens</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Earned</h3>
                  <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">🏆</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {stats?.totalDropEarned || 0}
                </div>
                <div className="text-sm text-green-300">DROP Tokens</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{stats?.totalReceipts}</div>
                <div className="text-sm text-gray-400">Receipts Uploaded</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{formatCurrency(stats?.totalSpent || 0)}</div>
                <div className="text-sm text-gray-400">Total Spent</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{stats?.totalDropBurned}</div>
                <div className="text-sm text-gray-400">DROP Burned</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{stats?.favoriteStores.length}</div>
                <div className="text-sm text-gray-400">Favorite Stores</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Receipts</h3>
              <div className="space-y-3">
                {receipts.slice(0, 3).map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold">🏪</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{receipt.store}</div>
                        <div className="text-sm text-gray-400">{receipt.date} • {receipt.items.join(', ')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">+{receipt.dropEarned} DROP</div>
                      <div className="text-sm text-gray-400">{formatCurrency(receipt.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Receipts Tab */}
        {activeTab === 'receipts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Receipts</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl">
                Upload New Receipt
              </button>
            </div>

            <div className="grid gap-4">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="bg-black/30 p-6 rounded-2xl border border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <span className="text-black font-bold text-xl">🏪</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{receipt.store}</h3>
                        <p className="text-gray-400">{receipt.date} • {receipt.category}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          receipt.status === 'processed' 
                            ? 'bg-green-500/20 text-green-400'
                            : receipt.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">+{receipt.dropEarned} DROP</div>
                      <div className="text-lg text-white">{formatCurrency(receipt.amount)}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {receipt.items.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Available Rewards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: '$5 Gift Card', cost: 500, category: 'Gift Cards', discount: '10%' },
                { name: '$10 Amazon Credit', cost: 900, category: 'Online', discount: '15%' },
                { name: 'Free Coffee', cost: 100, category: 'Food & Beverage', discount: '20%' },
                { name: '$25 Target Card', cost: 2000, category: 'Retail', discount: '20%' },
                { name: 'Movie Ticket', cost: 800, category: 'Entertainment', discount: '25%' },
                { name: 'Gas Discount', cost: 300, category: 'Fuel', discount: '15%' },
              ].map((reward, index) => (
                <div key={index} className="bg-black/30 p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{reward.name}</h3>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      {reward.discount} off
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">{reward.category}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-cyan-400">{reward.cost} DROP</div>
                    <button 
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dropBalance >= reward.cost
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={dropBalance < reward.cost}
                    >
                      {dropBalance >= reward.cost ? 'Redeem' : 'Need More'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Your Analytics</h2>

            {/* Favorite Stores */}
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Top Stores</h3>
              <div className="space-y-3">
                {stats?.favoriteStores.map((store, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold text-black">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{store.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{store.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Monthly Activity</h3>
              <div className="space-y-4">
                {stats?.monthlyActivity.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div>
                      <div className="font-medium text-white">{month.month}</div>
                      <div className="text-sm text-gray-400">{month.receipts} receipts uploaded</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">+{month.earned} DROP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-xl font-bold text-purple-400">
                    {stats?.completedAchievements || 0}/{stats?.achievements?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.achievements?.map((achievement, index) => (
                <div key={achievement.id} className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
                  achievement.isCompleted 
                    ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/50' 
                    : 'bg-black/30 border-gray-700/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center text-2xl">
                      {achievement.iconUrl}
                    </div>
                    {achievement.isCompleted && (
                      <div className="flex items-center gap-1 text-green-400">
                        <span className="text-xl">✓</span>
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Reward Points */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-400">Reward Points</div>
                    <div className="font-bold text-yellow-400">+{achievement.rewardPoints}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Categories */}
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Achievement Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { type: 'receipts', label: 'Receipt Master', icon: '📄', count: stats?.achievements?.filter(a => a.achievementType === 'receipts').length || 0 },
                  { type: 'spending', label: 'Big Spender', icon: '💰', count: stats?.achievements?.filter(a => a.achievementType === 'spending').length || 0 },
                  { type: 'rewards', label: 'Reward Hunter', icon: '🎁', count: stats?.achievements?.filter(a => a.achievementType === 'rewards').length || 0 },
                  { type: 'referrals', label: 'Referral Pro', icon: '👥', count: stats?.achievements?.filter(a => a.achievementType === 'referrals').length || 0 },
                  { type: 'loyalty', label: 'Loyal Customer', icon: '⭐', count: stats?.achievements?.filter(a => a.achievementType === 'loyalty').length || 0 },
                ].map((category) => (
                  <div key={category.type} className="text-center p-4 bg-black/20 rounded-xl">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-white">{category.label}</div>
                    <div className="text-xs text-gray-400">{category.count} achievements</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
