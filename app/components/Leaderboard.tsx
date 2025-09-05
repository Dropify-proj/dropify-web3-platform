'use client';

import { useState, useEffect } from 'react';
import { useEnhancedWallet } from '../../lib/enhanced-wallet-context';

interface LeaderboardUser {
  id: string;
  username: string;
  receiptsCount: number;
  referralsCount: number;
  totalDrops: number;
  totalDrf: number;
  rank: number;
  isCurrentUser?: boolean;
  isWhitelisted?: boolean;
  whitelistPosition?: number;
  registrationDate?: Date;
  currentMultiplier: number;
  multiplierReceiptsLeft: number;
  totalMultipliersPurchased: number;
}

interface WhitelistInfo {
  totalWhitelisted: number;
  remainingSpots: number;
  userWhitelistStatus: boolean;
  userWhitelistPosition: number | null;
}

interface UserStats {
  receiptsCount: number;
  referralsCount: number;
  currentMultiplier: number;
  multiplierReceiptsLeft: number;
  totalMultipliersPurchased: number;
}

interface LeaderboardProps {
  className?: string;
}

export default function Leaderboard({ className = '' }: LeaderboardProps) {
  const { dropBalance, drfBalance, account } = useEnhancedWallet();
  
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<'receipts' | 'referrals' | 'multipliers' | 'whitelist'>('receipts');
  const [whitelistInfo, setWhitelistInfo] = useState<WhitelistInfo>({
    totalWhitelisted: 0,
    remainingSpots: 20000,
    userWhitelistStatus: false,
    userWhitelistPosition: null
  });
  
  // Mock user stats - in real app this would come from the wallet context or API
  const [userStats, setUserStats] = useState<UserStats>({
    receiptsCount: 0,
    referralsCount: 0,
    currentMultiplier: 1,
    multiplierReceiptsLeft: 0,
    totalMultipliersPurchased: 0
  });
  
  const currentUserId = account?.address() || 'demo-user';

  // Generate mock leaderboard data
  useEffect(() => {
    const generateMockUsers = (): LeaderboardUser[] => {
      const mockUsers: LeaderboardUser[] = [];
      let whitelistedCount = 0;
      
      // Generate 15 mock users
      for (let i = 0; i < 15; i++) {
        const receiptsCount = Math.floor(Math.random() * 500) + 50;
        const referralsCount = Math.floor(Math.random() * 100) + 5;
        const totalDrops = receiptsCount * (Math.random() * 50 + 25); // $25-$75 avg per receipt
        const totalDrf = Math.floor(totalDrops / 100) + (referralsCount * 5);
        const totalMultipliersPurchased = Math.floor(Math.random() * 10) + 1; // 1-10 multipliers purchased
        const currentMultiplier = Math.random() > 0.7 ? [1.5, 3, 5][Math.floor(Math.random() * 3)] : 1; // 30% chance of having active multiplier
        const multiplierReceiptsLeft = currentMultiplier > 1 ? Math.floor(Math.random() * 10) + 1 : 0; // Random remaining receipts with multiplier
        
        // Determine if user is whitelisted (3+ referrals and within first 20k)
        const isWhitelisted = referralsCount >= 3 && whitelistedCount < 20000;
        const whitelistPosition = isWhitelisted ? whitelistedCount + 1 : undefined;
        if (isWhitelisted) whitelistedCount++;
        
        mockUsers.push({
          id: `user_${i + 1}`,
          username: `User${String(i + 1).padStart(3, '0')}`,
          receiptsCount,
          referralsCount,
          totalDrops: Math.floor(totalDrops),
          totalDrf: Math.floor(totalDrf),
          rank: i + 1,
          isWhitelisted,
          whitelistPosition,
          registrationDate: new Date(2025, 8, Math.floor(Math.random() * 30) + 1), // Random date in September 2025
          currentMultiplier,
          multiplierReceiptsLeft,
          totalMultipliersPurchased
        });
      }

      // Add current user to the list
      const currentUserReceiptsCount = Math.max(userStats.receiptsCount, Math.floor(dropBalance / 30)); // Estimate from DROP balance
      const currentUserIsWhitelisted = userStats.referralsCount >= 3 && whitelistedCount < 20000;
      const currentUserWhitelistPosition = currentUserIsWhitelisted ? whitelistedCount + 1 : undefined;
      if (currentUserIsWhitelisted) whitelistedCount++;
      
      const currentUserData: LeaderboardUser = {
        id: currentUserId,
        username: 'You',
        receiptsCount: currentUserReceiptsCount,
        referralsCount: userStats.referralsCount,
        totalDrops: Math.floor(dropBalance),
        totalDrf: Math.floor(drfBalance),
        rank: 0, // Will be calculated after sorting
        isCurrentUser: true,
        isWhitelisted: currentUserIsWhitelisted,
        whitelistPosition: currentUserWhitelistPosition,
        registrationDate: new Date(), // Current user registered today
        currentMultiplier: userStats.currentMultiplier,
        multiplierReceiptsLeft: userStats.multiplierReceiptsLeft,
        totalMultipliersPurchased: userStats.totalMultipliersPurchased
      };

      mockUsers.push(currentUserData);

      // Update whitelist info
      setWhitelistInfo({
        totalWhitelisted: whitelistedCount,
        remainingSpots: Math.max(0, 20000 - whitelistedCount),
        userWhitelistStatus: currentUserIsWhitelisted,
        userWhitelistPosition: currentUserWhitelistPosition || null
      });

      return mockUsers;
    };

    const users = generateMockUsers();
    
    // Sort by receipts count for initial ranking
    const sortedUsers = users.sort((a, b) => b.receiptsCount - a.receiptsCount);
    
    // Assign ranks
    sortedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    setLeaderboardData(sortedUsers);
  }, [dropBalance, drfBalance, userStats, currentUserId]);

  // Update user stats based on wallet activity
  useEffect(() => {
    // Estimate receipts from DROP balance (assuming avg $30 per receipt)
    const estimatedReceipts = Math.floor(dropBalance / 30);
    
    setUserStats(prev => ({
      ...prev,
      receiptsCount: Math.max(prev.receiptsCount, estimatedReceipts)
    }));
  }, [dropBalance]);

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (activeTab === 'receipts') {
      return b.receiptsCount - a.receiptsCount;
    } else if (activeTab === 'referrals') {
      return b.referralsCount - a.referralsCount;
    } else if (activeTab === 'multipliers') {
      return b.totalMultipliersPurchased - a.totalMultipliersPurchased;
    } else { // whitelist
      // Show whitelisted users first, sorted by whitelist position
      if (a.isWhitelisted && !b.isWhitelisted) return -1;
      if (!a.isWhitelisted && b.isWhitelisted) return 1;
      if (a.isWhitelisted && b.isWhitelisted) {
        return (a.whitelistPosition || 0) - (b.whitelistPosition || 0);
      }
      // For non-whitelisted, sort by referrals count descending
      return b.referralsCount - a.referralsCount;
    }
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 2: return 'text-gray-300 bg-gray-500/10 border-gray-500/30';
      case 3: return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/5 border-gray-500/20';
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
        <p className="text-gray-400">Compete with other users and climb the ranks!</p>
        
        {/* Whitelist Airdrop Alert */}
        <div className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl mr-2">🎁</span>
            <h3 className="text-lg font-bold text-purple-300">Exclusive Airdrop Whitelist</h3>
          </div>
          <p className="text-sm text-gray-300 mb-2">
            First 20,000 users with 3+ successful referrals get whitelisted for exclusive airdrop!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-purple-500/10 rounded-lg p-2">
              <div className="font-bold text-purple-400">{whitelistInfo.totalWhitelisted.toLocaleString()}</div>
              <div className="text-gray-400">Whitelisted</div>
            </div>
            <div className="bg-pink-500/10 rounded-lg p-2">
              <div className="font-bold text-pink-400">{whitelistInfo.remainingSpots.toLocaleString()}</div>
              <div className="text-gray-400">Spots Left</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="font-bold text-green-400">3</div>
              <div className="text-gray-400">Referrals Required</div>
            </div>
          </div>
          
          {/* User Whitelist Status */}
          {whitelistInfo.userWhitelistStatus ? (
            <div className="mt-3 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">✅</span>
                <span className="font-bold text-green-300">
                  You're Whitelisted! Position #{whitelistInfo.userWhitelistPosition}
                </span>
              </div>
              <p className="text-xs text-green-400 mt-1">You qualify for the exclusive airdrop!</p>
            </div>
          ) : (
            <div className="mt-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">⚠️</span>
                <span className="font-bold text-yellow-300">
                  Not Whitelisted - Need {Math.max(0, 3 - userStats.referralsCount)} more referrals
                </span>
              </div>
              <p className="text-xs text-yellow-400 mt-1">Invite friends to qualify for the airdrop!</p>
            </div>
          )}
        </div>

        {/* Telegram Stars Multiplier Info */}
        <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl mr-2">⭐</span>
            <h3 className="text-lg font-bold text-yellow-300">Telegram Stars Multipliers</h3>
          </div>
          <p className="text-sm text-gray-300 mb-2">
            Purchase multipliers with Telegram Stars to boost your DROP earnings!
          </p>
          
          {/* Current User Multiplier Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
            <div className="bg-orange-500/10 rounded-lg p-2">
              <div className="font-bold text-orange-400">{userStats.currentMultiplier}x</div>
              <div className="text-gray-400">Current Multiplier</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="font-bold text-red-400">{userStats.multiplierReceiptsLeft}</div>
              <div className="text-gray-400">Receipts Left</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <div className="font-bold text-blue-400">{userStats.totalMultipliersPurchased}</div>
              <div className="text-gray-400">Total Purchased</div>
            </div>
          </div>

          {/* Multiplier Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg p-2 border bg-blue-500/10 border-blue-500/20 text-blue-300">
              <div className="font-bold">100 ⭐ → 1.5x DROP</div>
              <div>Next 10 receipts</div>
            </div>
            <div className="rounded-lg p-2 border bg-orange-500/10 border-orange-500/20 text-orange-300">
              <div className="font-bold">250 ⭐ → 3x DROP</div>
              <div>Next 10 receipts</div>
            </div>
            <div className="rounded-lg p-2 border bg-purple-500/10 border-purple-500/20 text-purple-300">
              <div className="font-bold">400 ⭐ → 5x DROP</div>
              <div>Next 10 receipts</div>
            </div>
          </div>

          {/* Active Multiplier Progress */}
          {userStats.currentMultiplier > 1 && userStats.multiplierReceiptsLeft > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Active {userStats.currentMultiplier}x multiplier progress</span>
                <span>{userStats.multiplierReceiptsLeft}/10 receipts remaining</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(userStats.multiplierReceiptsLeft / 10) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-700/50 rounded-lg p-1 flex flex-wrap">
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === 'receipts'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📸 Receipts
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === 'referrals'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Referrals
          </button>
          <button
            onClick={() => setActiveTab('multipliers')}
            className={`px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === 'multipliers'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔥 Multipliers
          </button>
          <button
            onClick={() => setActiveTab('whitelist')}
            className={`px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === 'whitelist'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎁 Whitelist
          </button>
        </div>
      </div>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {sortedData.reduce((sum, user) => sum + user.receiptsCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Receipts</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {sortedData.reduce((sum, user) => sum + user.referralsCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Referrals</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {sortedData.length}
          </div>
          <div className="text-sm text-gray-400">Active Users</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <div className="bg-gray-700/50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
          <div className="col-span-1">Rank</div>
          <div className="col-span-2">User</div>
          <div className="col-span-2">
            {activeTab === 'receipts' ? '📸 Receipts' : 
             activeTab === 'referrals' ? '👥 Referrals' : 
             activeTab === 'multipliers' ? '🔥 Multipliers' :
             '🎁 Whitelist Pos'}
          </div>
          <div className="col-span-2">
            {activeTab === 'multipliers' ? '⚡ Current' : '💧 Total DROP'}
          </div>
          <div className="col-span-2">
            {activeTab === 'multipliers' ? '📊 Purchased' : '🟣 Total DRF'}
          </div>
          <div className="col-span-2">
            {activeTab === 'multipliers' ? '🎯 Receipts Left' : 'Performance'}
          </div>
          <div className="col-span-1">🎁 Airdrop</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {sortedData.slice(0, 10).map((user, index) => {
            const currentRank = index + 1;
            const primaryStat = activeTab === 'receipts' ? user.receiptsCount : 
                               activeTab === 'referrals' ? user.referralsCount :
                               activeTab === 'multipliers' ? user.totalMultipliersPurchased :
                               user.whitelistPosition || 'Not Listed';
            const performance = activeTab === 'receipts' 
              ? (user.totalDrops / user.receiptsCount).toFixed(1)
              : activeTab === 'referrals' 
              ? (user.referralsCount * 5).toString()
              : activeTab === 'multipliers'
              ? user.multiplierReceiptsLeft.toString()
              : user.isWhitelisted ? `Position #${user.whitelistPosition}` : 'Not Qualified';
            
            return (
              <div
                key={user.id}
                className={`px-4 py-4 grid grid-cols-12 gap-4 items-center transition-all hover:bg-gray-700/30 ${
                  user.isCurrentUser ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${getRankColor(currentRank)}`}>
                    <span className="text-sm font-bold">
                      {getRankIcon(currentRank)}
                    </span>
                  </div>
                </div>

                {/* User */}
                <div className="col-span-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      user.isCurrentUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {user.isCurrentUser ? '👤' : user.username[0]}
                    </div>
                    <div>
                      <div className={`font-medium ${user.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                        {user.username}
                        {user.isCurrentUser && ' (You)'}
                      </div>
                      {user.isWhitelisted && (
                        <div className="text-xs text-purple-400">
                          🎁 #{user.whitelistPosition}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Stat */}
                <div className="col-span-2">
                  <div className="text-white font-bold">
                    {typeof primaryStat === 'number' ? primaryStat.toLocaleString() : primaryStat}
                    {activeTab === 'multipliers' && <span className="text-orange-400 ml-1">🔥</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activeTab === 'receipts' ? 'receipts' : 
                     activeTab === 'referrals' ? 'referrals' : 
                     activeTab === 'multipliers' ? 'purchased' :
                     'whitelist position'}
                  </div>
                </div>

                {/* Second Column - Context Dependent */}
                <div className="col-span-2">
                  {activeTab === 'multipliers' ? (
                    <div>
                      {user.currentMultiplier > 1 ? (
                        <>
                          <div className="text-orange-400 font-bold">{user.currentMultiplier}x</div>
                          <div className="text-xs text-gray-400">active</div>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-400 font-medium">1x</div>
                          <div className="text-xs text-gray-400">no multiplier</div>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="text-yellow-400 font-medium">{user.totalDrops.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">DROP</div>
                    </>
                  )}
                </div>

                {/* Third Column - Context Dependent */}
                <div className="col-span-2">
                  {activeTab === 'multipliers' ? (
                    <div>
                      <div className="text-purple-400 font-medium">{user.totalMultipliersPurchased}</div>
                      <div className="text-xs text-gray-400">total purchased</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-purple-400 font-medium">{user.totalDrf.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">DRF</div>
                    </>
                  )}
                </div>

                {/* Performance/Next Goal */}
                <div className="col-span-2">
                  {activeTab === 'multipliers' ? (
                    <div>
                      <div className="text-green-400 font-medium">{user.multiplierReceiptsLeft}</div>
                      <div className="text-xs text-gray-400">receipts left</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-green-400 font-medium">
                        {activeTab === 'receipts' ? `$${performance}` : 
                         activeTab === 'referrals' ? `${performance} DRF` :
                         performance}
                      </div>
                      <div className="text-xs text-gray-400">
                        {activeTab === 'receipts' ? 'avg/receipt' : 
                         activeTab === 'referrals' ? 'bonus earned' :
                         'airdrop status'}
                      </div>
                    </>
                  )}
                </div>

                {/* Airdrop Status */}
                <div className="col-span-1">
                  {user.isWhitelisted ? (
                    <div className="text-center">
                      <div className="text-purple-400 text-lg">✅</div>
                      <div className="text-xs text-purple-400">#{user.whitelistPosition}</div>
                    </div>
                  ) : user.referralsCount >= 3 ? (
                    <div className="text-center">
                      <div className="text-red-400 text-lg">❌</div>
                      <div className="text-xs text-red-400">Too late</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-gray-500 text-lg">⏳</div>
                      <div className="text-xs text-gray-500">{3 - user.referralsCount} left</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current User Position (if not in top 10) */}
      {sortedData.findIndex(u => u.isCurrentUser) >= 10 && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-center text-blue-400 font-medium mb-2">Your Position</div>
          {(() => {
            const userIndex = sortedData.findIndex(u => u.isCurrentUser);
            const user = sortedData[userIndex];
            if (!user) return null;
            
            const currentRank = userIndex + 1;
            const primaryStat = activeTab === 'receipts' ? user.receiptsCount : user.referralsCount;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">#{currentRank}</span>
                  <div>
                    <div className="text-white font-medium">You</div>
                    <div className="text-sm text-gray-400">
                      {primaryStat} {activeTab === 'receipts' ? 'receipts' : 'referrals'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400">{user.totalDrops} DROP</div>
                  <div className="text-purple-400">{user.totalDrf} DRF</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Competition Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">📸 Receipt Challenge</h3>
          <p className="text-sm text-gray-300 mb-2">Upload the most receipts to earn the top spot!</p>
          <div className="text-xs text-gray-400">
            • 1 DROP per $1 spent • Build your token balance • Climb the rankings
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">👥 Referral Race</h3>
          <p className="text-sm text-gray-300 mb-2">Invite friends to join and earn big bonuses!</p>
          <div className="text-xs text-gray-400">
            • 5 DRF per referral • Compound your earnings • Lead the community
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">🎁 Airdrop Whitelist</h3>
          <p className="text-sm text-gray-300 mb-2">First 20,000 users with 3+ referrals get exclusive airdrop!</p>
          <div className="text-xs text-gray-400">
            • Limited to 20,000 spots • 3 referrals required • Exclusive rewards
          </div>
        </div>
      </div>
    </div>
  );
}
