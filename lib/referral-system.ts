/**
 * Dropify Referral System Integration
 * 5 DRF tokens per successful referral (user signs up and scans receipt)
 */

import { useState, useEffect } from 'react';

// Referral data interface
export interface ReferralData {
  isReferred: boolean;
  referrerAddress: string;
  hasScannedReceipt: boolean;
  referralTimestamp: number;
}

// Referral stats interface
export interface ReferralStats {
  rewardPerReferral: number; // 5 DRF tokens
  totalRewardsPaid: number;
  maxAvailableReferrals: number;
}

// Referral event interface
export interface ReferralReward {
  referrer: string;
  referredUser: string;
  drfEarned: number;
  timestamp: number;
}

/**
 * Referral System Manager Class
 * Handles all referral-related operations
 */
export class ReferralSystemManager {
  private adminAddress: string;

  constructor(adminAddress: string) {
    this.adminAddress = adminAddress;
  }

  /**
   * Generate referral link for a user
   */
  generateReferralLink(referrerAddress: string, baseUrl: string = window.location.origin): string {
    const params = new URLSearchParams({
      ref: referrerAddress,
      source: 'referral'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate Telegram referral link
   */
  generateTelegramReferralLink(referrerAddress: string, botUsername: string): string {
    const startParam = encodeURIComponent(`ref_${referrerAddress}`);
    return `https://t.me/${botUsername}?startapp=${startParam}`;
  }

  /**
   * Extract referrer address from URL parameters
   */
  extractReferrerFromUrl(): string | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
  }

  /**
   * Extract referrer from Telegram start parameters
   */
  extractReferrerFromTelegram(startParam?: string): string | null {
    if (!startParam) return null;
    
    if (startParam.startsWith('ref_')) {
      return startParam.substring(4); // Remove 'ref_' prefix
    }
    
    return null;
  }

  /**
   * Register user with referral (smart contract call)
   */
  async registerWithReferral(userAddress: string, referrerAddress: string): Promise<boolean> {
    try {
      // This would integrate with your smart contract SDK
      // For now, return a mock response
      console.log(`Registering ${userAddress} with referrer ${referrerAddress}`);
      
      // In real implementation, call: contract.register_with_referral(userAddress, referrerAddress)
      return true;
    } catch (error) {
      console.error('Failed to register referral:', error);
      return false;
    }
  }

  /**
   * Scan receipt with referral processing (smart contract call)
   */
  async scanReceiptWithReferral(
    userAddress: string,
    receiptHash: string,
    purchaseAmount: number
  ): Promise<{
    dropEarned: number;
    drfEarned: number;
    referralRewardPaid: boolean;
    referralRewardAmount?: number;
  }> {
    try {
      // This would integrate with your smart contract SDK
      console.log(`Scanning receipt for ${userAddress}, amount: ${purchaseAmount}`);
      
      // In real implementation, call: contract.scan_receipt_with_referral()
      // For now, return mock data
      return {
        dropEarned: purchaseAmount * 0.01, // 1% in DROP tokens
        drfEarned: Math.floor(purchaseAmount / 200), // 200 points = 1 DRF
        referralRewardPaid: true,
        referralRewardAmount: 5 // 5 DRF tokens
      };
    } catch (error) {
      console.error('Failed to scan receipt with referral:', error);
      throw error;
    }
  }

  /**
   * Get referral information for a user
   */
  async getReferralInfo(userAddress: string): Promise<ReferralData> {
    try {
      // This would call the smart contract view function
      console.log(`Getting referral info for ${userAddress}`);
      
      // Mock data for now
      return {
        isReferred: true,
        referrerAddress: '0x123...',
        hasScannedReceipt: false,
        referralTimestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to get referral info:', error);
      return {
        isReferred: false,
        referrerAddress: '',
        hasScannedReceipt: false,
        referralTimestamp: 0
      };
    }
  }

  /**
   * Get referral system statistics
   */
  async getReferralStats(): Promise<ReferralStats> {
    try {
      // This would call the smart contract view function
      console.log('Getting referral stats');
      
      // Mock data for now
      return {
        rewardPerReferral: 5, // 5 DRF tokens
        totalRewardsPaid: 1250, // Total DRF paid out
        maxAvailableReferrals: 50000 // Based on treasury balance
      };
    } catch (error) {
      console.error('Failed to get referral stats:', error);
      return {
        rewardPerReferral: 5,
        totalRewardsPaid: 0,
        maxAvailableReferrals: 0
      };
    }
  }
}

/**
 * React Hook for Referral System
 */
export function useReferralSystem(adminAddress: string) {
  const [referralManager] = useState(() => new ReferralSystemManager(adminAddress));
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for referral in URL on component mount
  useEffect(() => {
    const referrer = referralManager.extractReferrerFromUrl();
    if (referrer) {
      localStorage.setItem('pendingReferrer', referrer);
    }
  }, [referralManager]);

  /**
   * Register current user with referral system
   */
  const registerWithReferral = async (userAddress: string, referrerAddress?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const referrer = referrerAddress || localStorage.getItem('pendingReferrer');
      if (!referrer) {
        throw new Error('No referrer found');
      }

      const success = await referralManager.registerWithReferral(userAddress, referrer);
      if (success) {
        localStorage.removeItem('pendingReferrer');
        await loadReferralData(userAddress);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register referral');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load referral data for user
   */
  const loadReferralData = async (userAddress: string) => {
    try {
      const data = await referralManager.getReferralInfo(userAddress);
      setReferralData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load referral data');
    }
  };

  /**
   * Load referral system statistics
   */
  const loadReferralStats = async () => {
    try {
      const stats = await referralManager.getReferralStats();
      setReferralStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load referral stats');
    }
  };

  /**
   * Generate referral link for sharing
   */
  const generateReferralLink = (userAddress: string) => {
    return referralManager.generateReferralLink(userAddress);
  };

  /**
   * Generate Telegram referral link
   */
  const generateTelegramReferralLink = (userAddress: string, botUsername: string) => {
    return referralManager.generateTelegramReferralLink(userAddress, botUsername);
  };

  return {
    referralManager,
    referralData,
    referralStats,
    loading,
    error,
    registerWithReferral,
    loadReferralData,
    loadReferralStats,
    generateReferralLink,
    generateTelegramReferralLink,
  };
}

/**
 * Utility functions for referral tracking
 */
export const ReferralUtils = {
  /**
   * Calculate potential earnings from referrals
   */
  calculateReferralEarnings(referralCount: number): number {
    return referralCount * 5; // 5 DRF per referral
  },

  /**
   * Format referral link for display
   */
  formatReferralLink(link: string, maxLength: number = 50): string {
    if (link.length <= maxLength) return link;
    return `${link.substring(0, maxLength - 3)}...`;
  },

  /**
   * Copy referral link to clipboard
   */
  async copyReferralLink(link: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },

  /**
   * Share referral link via Web Share API
   */
  async shareReferralLink(link: string, title: string = 'Join Dropify!'): Promise<boolean> {
    if (!navigator.share) return false;
    
    try {
      await navigator.share({
        title,
        text: 'Earn rewards with every receipt! Join Dropify and start earning DROP and DRF tokens.',
        url: link,
      });
      return true;
    } catch (error) {
      console.error('Failed to share:', error);
      return false;
    }
  }
};
