'use client';

import { useState, useEffect } from 'react';

// User profile data (stored in database)
export interface UserProfile {
  id: string;
  walletAddress: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  phoneNumber?: string;
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    marketingEmails: boolean;
    favoriteCategories: string[];
    rewardPreferences: string[];
  };
  settings: {
    currency: 'USD' | 'EUR' | 'GBP';
    language: 'en' | 'es' | 'fr' | 'de';
    timezone: string;
    autoSubmitReceipts: boolean;
  };
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  accountMetadata: {
    createdAt: number;
    lastActiveAt: number;
    totalLogins: number;
    referralCode?: string;
    referredBy?: string;
  };
}

// Achievement/badge system
export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: 'receipts' | 'spending' | 'rewards' | 'referrals' | 'loyalty';
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: number;
  progress: number; // 0-100
  isCompleted: boolean;
  rewardPoints: number;
}

// Reward redemption history (database record + blockchain transaction)
export interface RewardRedemption {
  id: string;
  userId: string;
  rewardType: string;
  rewardTitle: string;
  dropTokensBurned: number;
  drfTokensUsed?: number;
  redemptionCode?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: number;
  redeemedAt?: number;
  expiresAt?: number;
  blockchainTxHash?: string;
  metadata: {
    category: string;
    vendor: string;
    originalValue: number;
    discountPercent: number;
    termsAndConditions: string;
  };
}

// Simple in-memory database simulation
// In production, this would connect to PostgreSQL, MongoDB, or Supabase
class UserDatabase {
  private users: Map<string, UserProfile> = new Map();
  private achievements: Map<string, UserAchievement[]> = new Map();
  private redemptions: Map<string, RewardRedemption[]> = new Map();

  // User profile management
  async createUser(walletAddress: string, email?: string): Promise<UserProfile> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: UserProfile = {
      id: userId,
      walletAddress: walletAddress.toLowerCase(),
      email,
      displayName: `User ${walletAddress.slice(0, 6)}`,
      preferences: {
        notifications: true,
        dataSharing: false,
        marketingEmails: false,
        favoriteCategories: [],
        rewardPreferences: []
      },
      settings: {
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        autoSubmitReceipts: false
      },
      verificationStatus: {
        email: false,
        phone: false,
        identity: false
      },
      accountMetadata: {
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
        totalLogins: 1,
        referralCode: this.generateReferralCode()
      }
    };

    this.users.set(walletAddress.toLowerCase(), newUser);
    console.log('✅ New user created:', userId);
    return newUser;
  }

  async getUser(walletAddress: string): Promise<UserProfile | null> {
    return this.users.get(walletAddress.toLowerCase()) || null;
  }

  async updateUser(walletAddress: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const existingUser = this.users.get(walletAddress.toLowerCase());
    if (!existingUser) return null;

    const updatedUser = {
      ...existingUser,
      ...updates,
      accountMetadata: {
        ...existingUser.accountMetadata,
        lastActiveAt: Date.now()
      }
    };

    this.users.set(walletAddress.toLowerCase(), updatedUser);
    return updatedUser;
  }

  async updateLastActive(walletAddress: string): Promise<void> {
    const user = this.users.get(walletAddress.toLowerCase());
    if (user) {
      user.accountMetadata.lastActiveAt = Date.now();
      user.accountMetadata.totalLogins++;
      this.users.set(walletAddress.toLowerCase(), user);
    }
  }

  // Achievement system
  async getUserAchievements(walletAddress: string): Promise<UserAchievement[]> {
    return this.achievements.get(walletAddress.toLowerCase()) || [];
  }

  async unlockAchievement(walletAddress: string, achievementData: Omit<UserAchievement, 'id' | 'userId' | 'unlockedAt' | 'isCompleted'>): Promise<UserAchievement> {
    const achievementId = `ach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = this.users.get(walletAddress.toLowerCase())?.id || '';

    const achievement: UserAchievement = {
      ...achievementData,
      id: achievementId,
      userId,
      unlockedAt: Date.now(),
      isCompleted: achievementData.progress >= 100
    };

    const userAchievements = this.achievements.get(walletAddress.toLowerCase()) || [];
    userAchievements.push(achievement);
    this.achievements.set(walletAddress.toLowerCase(), userAchievements);

    console.log('🏆 Achievement unlocked:', achievement.title);
    return achievement;
  }

  // Reward redemption management
  async createRedemption(walletAddress: string, redemptionData: Omit<RewardRedemption, 'id' | 'userId' | 'createdAt' | 'status'>): Promise<RewardRedemption> {
    const redemptionId = `red_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = this.users.get(walletAddress.toLowerCase())?.id || '';

    const redemption: RewardRedemption = {
      ...redemptionData,
      id: redemptionId,
      userId,
      status: 'pending',
      createdAt: Date.now()
    };

    const userRedemptions = this.redemptions.get(walletAddress.toLowerCase()) || [];
    userRedemptions.push(redemption);
    this.redemptions.set(walletAddress.toLowerCase(), userRedemptions);

    console.log('🎁 Reward redemption created:', redemptionId);
    return redemption;
  }

  async getUserRedemptions(walletAddress: string): Promise<RewardRedemption[]> {
    return this.redemptions.get(walletAddress.toLowerCase()) || [];
  }

  async updateRedemptionStatus(redemptionId: string, status: RewardRedemption['status'], blockchainTxHash?: string): Promise<void> {
    for (const [address, redemptions] of this.redemptions.entries()) {
      const redemption = redemptions.find(r => r.id === redemptionId);
      if (redemption) {
        redemption.status = status;
        if (blockchainTxHash) {
          redemption.blockchainTxHash = blockchainTxHash;
        }
        if (status === 'completed') {
          redemption.redeemedAt = Date.now();
        }
        break;
      }
    }
  }

  // Utility functions
  private generateReferralCode(): string {
    return `DROP${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  // Analytics functions
  async getUserAnalytics(walletAddress: string): Promise<{
    accountAge: number; // days
    totalAchievements: number;
    completedAchievements: number;
    totalRedemptions: number;
    pendingRedemptions: number;
    lastActivity: number;
  }> {
    const user = this.users.get(walletAddress.toLowerCase());
    const achievements = this.achievements.get(walletAddress.toLowerCase()) || [];
    const redemptions = this.redemptions.get(walletAddress.toLowerCase()) || [];

    if (!user) {
      return {
        accountAge: 0,
        totalAchievements: 0,
        completedAchievements: 0,
        totalRedemptions: 0,
        pendingRedemptions: 0,
        lastActivity: 0
      };
    }

    const accountAge = Math.floor((Date.now() - user.accountMetadata.createdAt) / (1000 * 60 * 60 * 24));
    const completedAchievements = achievements.filter(a => a.isCompleted).length;
    const pendingRedemptions = redemptions.filter(r => r.status === 'pending').length;

    return {
      accountAge,
      totalAchievements: achievements.length,
      completedAchievements,
      totalRedemptions: redemptions.length,
      pendingRedemptions,
      lastActivity: user.accountMetadata.lastActiveAt
    };
  }

  // Platform-wide statistics
  async getPlatformAnalytics(): Promise<{
    totalUsers: number;
    activeUsers: number; // active in last 30 days
    totalAchievements: number;
    totalRedemptions: number;
    averageAccountAge: number;
  }> {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const users = Array.from(this.users.values());
    
    const activeUsers = users.filter(user => user.accountMetadata.lastActiveAt > thirtyDaysAgo).length;
    const totalAchievements = Array.from(this.achievements.values()).reduce((sum, achievements) => sum + achievements.length, 0);
    const totalRedemptions = Array.from(this.redemptions.values()).reduce((sum, redemptions) => sum + redemptions.length, 0);
    
    const totalAccountAge = users.reduce((sum, user) => sum + (Date.now() - user.accountMetadata.createdAt), 0);
    const averageAccountAge = users.length > 0 ? Math.floor(totalAccountAge / users.length / (1000 * 60 * 60 * 24)) : 0;

    return {
      totalUsers: users.length,
      activeUsers,
      totalAchievements,
      totalRedemptions,
      averageAccountAge
    };
  }
}

// Singleton database instance
const userDatabase = new UserDatabase();

// Hook for using the user database
export function useUserDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateUser = async (walletAddress: string, email?: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      let user = await userDatabase.getUser(walletAddress);
      
      if (!user) {
        user = await userDatabase.createUser(walletAddress, email);
      } else {
        await userDatabase.updateLastActive(walletAddress);
      }

      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get or create user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (walletAddress: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await userDatabase.updateUser(walletAddress, updates);
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user profile';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserAchievements = async (walletAddress: string): Promise<UserAchievement[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const achievements = await userDatabase.getUserAchievements(walletAddress);
      return achievements;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch achievements';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createRewardRedemption = async (
    walletAddress: string,
    rewardData: Omit<RewardRedemption, 'id' | 'userId' | 'createdAt' | 'status'>
  ): Promise<RewardRedemption | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const redemption = await userDatabase.createRedemption(walletAddress, rewardData);
      return redemption;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create redemption';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserAnalytics = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const analytics = await userDatabase.getUserAnalytics(walletAddress);
      return analytics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user analytics';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getOrCreateUser,
    updateUserProfile,
    getUserAchievements,
    createRewardRedemption,
    getUserAnalytics,
    database: userDatabase
  };
}

// Pre-populate database with some sample achievements for demo
export function initializeSampleData() {
  console.log('🎯 Initializing sample achievement data...');
  
  // Sample achievements that users can unlock
  const sampleAchievements = [
    {
      achievementType: 'receipts' as const,
      title: 'First Steps',
      description: 'Upload your first receipt',
      iconUrl: '🥳',
      progress: 100,
      rewardPoints: 50
    },
    {
      achievementType: 'receipts' as const,
      title: 'Receipt Master',
      description: 'Upload 10 receipts',
      iconUrl: '📄',
      progress: 40,
      rewardPoints: 200
    },
    {
      achievementType: 'spending' as const,
      title: 'Big Spender',
      description: 'Spend over $500 total',
      iconUrl: '💰',
      progress: 75,
      rewardPoints: 300
    },
    {
      achievementType: 'loyalty' as const,
      title: 'Loyal Customer',
      description: 'Shop at the same store 5 times',
      iconUrl: '⭐',
      progress: 60,
      rewardPoints: 150
    }
  ];

  console.log('✅ Sample data initialized');
}

export { userDatabase };
