/**
 * Telegram Stars Premium System Integration
 * 50 Stars = 1.5x rewards for 30 days
 */

import { useState, useEffect } from 'react';

// Premium status interface
export interface PremiumStatus {
  isActive: boolean;
  expiresAt: number;
  totalStarsSpent: number;
  activations: number;
}

// Premium pricing interface
export interface PremiumPricing {
  starsCost: number; // 50 Telegram Stars
  multiplier: number; // 1.5x (15000 basis points)
  duration: number; // 30 days in seconds
}

// Reward calculation interface
export interface RewardCalculation {
  normalDrop: number;
  premiumDrop: number;
  normalPoints: number;
  premiumPoints: number;
  bonusAmount: number;
  percentageIncrease: number;
}

/**
 * Telegram Stars Premium Manager Class
 */
export class TelegramStarsManager {
  private adminAddress: string;

  constructor(adminAddress: string) {
    this.adminAddress = adminAddress;
  }

  /**
   * Check if Telegram Stars payments are available
   */
  isStarsPaymentAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if we're in Telegram Web App
    return !!(window as any).Telegram?.WebApp?.isExpanded;
  }

  /**
   * Get premium pricing information
   */
  async getPremiumPricing(): Promise<PremiumPricing> {
    try {
      // This would call the smart contract view function
      console.log('Getting premium pricing info');
      
      // Mock data for now
      return {
        starsCost: 50,
        multiplier: 1.5,
        duration: 2592000 // 30 days
      };
    } catch (error) {
      console.error('Failed to get premium pricing:', error);
      throw error;
    }
  }

  /**
   * Get user's premium status
   */
  async getPremiumStatus(userAddress: string): Promise<PremiumStatus> {
    try {
      // This would call the smart contract view function
      console.log(`Getting premium status for ${userAddress}`);
      
      // Mock data for now
      return {
        isActive: false,
        expiresAt: 0,
        totalStarsSpent: 150, // User has spent 150 stars total
        activations: 3
      };
    } catch (error) {
      console.error('Failed to get premium status:', error);
      return {
        isActive: false,
        expiresAt: 0,
        totalStarsSpent: 0,
        activations: 0
      };
    }
  }

  /**
   * Calculate reward differences between normal and premium
   */
  async calculateRewardBonus(purchaseAmount: number): Promise<RewardCalculation> {
    try {
      // This would call the smart contract view function
      console.log(`Calculating rewards for purchase amount: ${purchaseAmount}`);
      
      // Mock calculation
      const normalDrop = purchaseAmount * 0.01; // 1%
      const premiumDrop = normalDrop * 1.5; // 1.5x
      const normalPoints = purchaseAmount;
      const premiumPoints = purchaseAmount * 1.5;
      
      return {
        normalDrop,
        premiumDrop,
        normalPoints,
        premiumPoints,
        bonusAmount: premiumDrop - normalDrop,
        percentageIncrease: 50 // 50% more rewards
      };
    } catch (error) {
      console.error('Failed to calculate reward bonus:', error);
      throw error;
    }
  }

  /**
   * Purchase premium with Telegram Stars
   */
  async purchasePremium(userAddress: string): Promise<boolean> {
    try {
      const webApp = (window as any).Telegram?.WebApp;
      if (!webApp) {
        throw new Error('Telegram Web App not available');
      }

      // Use Telegram Stars payment
      return new Promise((resolve, reject) => {
        webApp.invokeCustomMethod('sendInvoice', {
          chat_id: webApp.initDataUnsafe.user.id,
          title: '🌟 Dropify Premium - 1.5x Rewards',
          description: 'Get 50% more rewards on all receipt scans for 30 days!',
          payload: JSON.stringify({
            type: 'premium_purchase',
            userAddress,
            duration: 30
          }),
          provider_token: '', // For Telegram Stars, this is empty
          currency: 'XTR', // Telegram Stars currency
          prices: [{
            label: '1.5x Rewards (30 days)',
            amount: 50 // 50 Telegram Stars
          }]
        }, (result: any) => {
          if (result.error) {
            reject(new Error(result.error));
          } else {
            // Call smart contract to activate premium
            this.activatePremium(userAddress, 50);
            resolve(true);
          }
        });
      });
    } catch (error) {
      console.error('Failed to purchase premium:', error);
      return false;
    }
  }

  /**
   * Activate premium after successful payment
   */
  private async activatePremium(userAddress: string, starsSpent: number): Promise<void> {
    try {
      // This would call the smart contract function
      console.log(`Activating premium for ${userAddress} with ${starsSpent} stars`);
      
      // In real implementation: contract.purchase_premium(userAddress, starsSpent)
    } catch (error) {
      console.error('Failed to activate premium:', error);
      throw error;
    }
  }

  /**
   * Get premium benefits summary
   */
  getPremiumBenefits(): Array<{
    icon: string;
    title: string;
    description: string;
  }> {
    return [
      {
        icon: '🚀',
        title: '1.5x DROP Tokens',
        description: 'Earn 50% more DROP tokens from every receipt scan'
      },
      {
        icon: '💎',
        title: '1.5x DRF Points',
        description: 'Get 50% more points toward DRF token rewards'
      },
      {
        icon: '⚡',
        title: 'Premium Badge',
        description: 'Show off your premium status in leaderboards'
      },
      {
        icon: '🎯',
        title: 'Exclusive Challenges',
        description: 'Access to premium-only referral challenges'
      },
      {
        icon: '📊',
        title: 'Advanced Analytics',
        description: 'Detailed insights into your earning patterns'
      }
    ];
  }

  /**
   * Format time remaining for premium subscription
   */
  formatTimeRemaining(expiresAt: number): string {
    const now = Date.now() / 1000;
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    } else {
      return 'Less than 1 hour remaining';
    }
  }
}

/**
 * React Hook for Telegram Stars Premium System
 */
export function useTelegramStarsPremium(adminAddress: string, userAddress: string) {
  const [starsManager] = useState(() => new TelegramStarsManager(adminAddress));
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [premiumPricing, setPremiumPricing] = useState<PremiumPricing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Stars payment is available
  const isStarsAvailable = starsManager.isStarsPaymentAvailable();

  /**
   * Load premium status and pricing
   */
  const loadPremiumData = async () => {
    if (!userAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [status, pricing] = await Promise.all([
        starsManager.getPremiumStatus(userAddress),
        starsManager.getPremiumPricing()
      ]);
      
      setPremiumStatus(status);
      setPremiumPricing(pricing);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load premium data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Purchase premium subscription
   */
  const purchasePremium = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await starsManager.purchasePremium(userAddress);
      if (success) {
        // Reload status after purchase
        await loadPremiumData();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase premium');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate reward bonus for a purchase amount
   */
  const calculateRewardBonus = async (purchaseAmount: number): Promise<RewardCalculation | null> => {
    try {
      return await starsManager.calculateRewardBonus(purchaseAmount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate rewards');
      return null;
    }
  };

  // Load data on mount and when userAddress changes
  useEffect(() => {
    loadPremiumData();
  }, [userAddress]);

  return {
    starsManager,
    premiumStatus,
    premiumPricing,
    isStarsAvailable,
    loading,
    error,
    loadPremiumData,
    purchasePremium,
    calculateRewardBonus,
    benefits: starsManager.getPremiumBenefits(),
    formatTimeRemaining: starsManager.formatTimeRemaining,
  };
}

/**
 * Utility functions for premium features
 */
export const PremiumUtils = {
  /**
   * Check if user has active premium
   */
  isUserPremium(status: PremiumStatus | null): boolean {
    if (!status) return false;
    return status.isActive && status.expiresAt > Date.now() / 1000;
  },

  /**
   * Calculate savings from premium over time
   */
  calculateMonthlySavings(averageMonthlySpend: number): {
    normalRewards: number;
    premiumRewards: number;
    bonusEarned: number;
    starsCost: number;
    netBenefit: number;
  } {
    const normalRewards = averageMonthlySpend * 0.01; // 1%
    const premiumRewards = normalRewards * 1.5; // 1.5x
    const bonusEarned = premiumRewards - normalRewards;
    const starsCost = 50; // Cost in Telegram Stars (roughly $1-2)
    const netBenefit = bonusEarned - (starsCost * 0.02); // Assuming 1 star ≈ $0.02
    
    return {
      normalRewards,
      premiumRewards,
      bonusEarned,
      starsCost,
      netBenefit
    };
  },

  /**
   * Format stars amount for display
   */
  formatStarsAmount(stars: number): string {
    return `⭐ ${stars} Stars`;
  },

  /**
   * Get premium status color
   */
  getPremiumStatusColor(status: PremiumStatus | null): string {
    if (!status) return 'gray';
    if (this.isUserPremium(status)) return 'gold';
    return 'gray';
  }
};
