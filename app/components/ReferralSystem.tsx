/**
 * Referral System React Components
 * UI components for managing and displaying referral functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
// Lightweight local implementation of the referral hook + utilities
// This avoids the missing-module error and provides the functions used in this component.
// Replace with your real implementation or move this into app/lib/referral-system.ts later.

type ReferralData = {
  isReferred?: boolean;
  referrerAddress?: string;
  hasScannedReceipt?: boolean;
} | null;

type ReferralStats = {
  rewardPerReferral?: number;
  totalRewardsPaid?: number;
  maxAvailableReferrals?: number;
} | null;

const ReferralUtils = {
  async copyReferralLink(link: string): Promise<boolean> {
    try {
      if (!link) return false;
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        return true;
      }
      // Fallback: older browsers
      const textarea = document.createElement('textarea');
      textarea.value = link;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  },

  async shareReferralLink(link: string): Promise<boolean> {
    try {
      if (!link) return false;
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({ url: link, title: 'Join me on Dropify' });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  formatReferralLink(link: string, maxLen = 60): string {
    if (!link) return '';
    if (link.length <= maxLen) return link;
    const keep = Math.max(6, Math.floor((maxLen - 3) / 2));
    return `${link.slice(0, keep)}...${link.slice(-keep)}`;
  }
};

function useReferralSystem(adminAddress: string) {
  const [referralData, setReferralData] = React.useState<ReferralData>(null);
  const [referralStats, setReferralStats] = React.useState<ReferralStats>({
    rewardPerReferral: 5,
    totalRewardsPaid: 0,
    maxAvailableReferrals: 0
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadReferralData = async (userAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: replace with real API call
      await new Promise((r) => setTimeout(r, 300));
      // Simple mocked data
      setReferralData({
        isReferred: false,
        referrerAddress: '',
        hasScannedReceipt: false
      });
    } catch (e) {
      setError('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const loadReferralStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: replace with real API call
      await new Promise((r) => setTimeout(r, 200));
      setReferralStats({
        rewardPerReferral: 5,
        totalRewardsPaid: 1234,
        maxAvailableReferrals: 10000
      });
    } catch {
      setError('Failed to load referral stats');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (userAddress: string) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
      return `${origin}/?ref=${encodeURIComponent(userAddress)}`;
    } catch {
      return `https://example.com/?ref=${encodeURIComponent(userAddress)}`;
    }
  };

  const generateTelegramReferralLink = (userAddress: string, botName = 'dropify_platform_bot') => {
    const link = generateReferralLink(userAddress);
    return `https://t.me/${botName}?start=${encodeURIComponent(link)}`;
  };

  return {
    referralData,
    referralStats,
    loading,
    error,
    loadReferralData,
    loadReferralStats,
    generateReferralLink,
    generateTelegramReferralLink
  };
}

// Referral Dashboard Component
export function ReferralDashboard({ userAddress, adminAddress }: {
  userAddress: string;
  adminAddress: string;
}) {
  const {
    referralData,
    referralStats,
    loading,
    error,
    loadReferralData,
    loadReferralStats,
    generateReferralLink,
    generateTelegramReferralLink
  } = useReferralSystem(adminAddress);

  const [referralLink, setReferralLink] = useState<string>('');
  const [telegramLink, setTelegramLink] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    if (userAddress) {
      loadReferralData(userAddress);
      loadReferralStats();
      setReferralLink(generateReferralLink(userAddress));
      setTelegramLink(generateTelegramReferralLink(userAddress, 'dropify_platform_bot'));
    }
  }, [userAddress]);

  const handleCopyLink = async (link: string, type: string) => {
    const success = await ReferralUtils.copyReferralLink(link);
    if (success) {
      setCopySuccess(`${type} link copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleShareLink = async (link: string) => {
    const success = await ReferralUtils.shareReferralLink(link);
    if (!success) {
      // Fallback to copy
      handleCopyLink(link, 'Referral');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Stats Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Referral Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Reward per Referral</h3>
            <p className="text-3xl font-bold text-green-600">
              {referralStats?.rewardPerReferral || 5} DRF
            </p>
            <p className="text-sm text-gray-500">When they scan first receipt</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Total Rewards Paid</h3>
            <p className="text-3xl font-bold text-blue-600">
              {referralStats?.totalRewardsPaid || 0} DRF
            </p>
            <p className="text-sm text-gray-500">Across all users</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Available Referrals</h3>
            <p className="text-3xl font-bold text-purple-600">
              {referralStats?.maxAvailableReferrals || 0}
            </p>
            <p className="text-sm text-gray-500">Remaining in treasury</p>
          </div>
        </div>
      </div>

      {/* Referral Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 Your Referral Links</h2>
        
        {/* Web Referral Link */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            🌐 Web Referral Link
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={ReferralUtils.formatReferralLink(referralLink, 60)}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button
              onClick={() => handleCopyLink(referralLink, 'Web')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
            <button
              onClick={() => handleShareLink(referralLink)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Share
            </button>
          </div>
        </div>

        {/* Telegram Referral Link */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            📱 Telegram Referral Link
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={ReferralUtils.formatReferralLink(telegramLink, 60)}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button
              onClick={() => handleCopyLink(telegramLink, 'Telegram')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
            <button
              onClick={() => window.open(telegramLink, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Open
            </button>
          </div>
        </div>

        {copySuccess && (
          <div className="mt-3 text-green-600 text-sm font-medium">
            ✅ {copySuccess}
          </div>
        )}
      </div>

      {/* Referral Status */}
      {referralData?.isReferred && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">👥 Your Referral Status</h3>
          <p className="text-blue-600">
            You were referred by: <code className="bg-blue-100 px-2 py-1 rounded">{referralData.referrerAddress}</code>
          </p>
          <p className="text-blue-600 mt-1">
            First receipt scanned: {referralData.hasScannedReceipt ? '✅ Yes' : '❌ Not yet'}
          </p>
          {!referralData.hasScannedReceipt && (
            <p className="text-blue-500 text-sm mt-2">
              💡 Scan your first receipt to trigger a 5 DRF reward for your referrer!
            </p>
          )}
        </div>
      )}

      {/* How it Works */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">🚀 How Referrals Work</h3>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Share your referral link with friends
          </p>
          <p className="flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
            They sign up using your link
          </p>
          <p className="flex items-center">
            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
            When they scan their first receipt, you earn <strong>5 DRF tokens</strong>!
          </p>
        </div>
      </div>
    </div>
  );
}

// Mini Referral Widget Component
export function ReferralWidget({ userAddress, adminAddress, compact = false }: {
  userAddress: string;
  adminAddress: string;
  compact?: boolean;
}) {
  const { generateReferralLink } = useReferralSystem(adminAddress);
  const [referralLink, setReferralLink] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userAddress) {
      setReferralLink(generateReferralLink(userAddress));
    }
  }, [userAddress]);

  const handleQuickShare = async () => {
    const success = await ReferralUtils.copyReferralLink(referralLink);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">💰 Earn 5 DRF per referral!</p>
            <p className="text-xs text-green-600">Share and earn when they scan receipts</p>
          </div>
          <button
            onClick={handleQuickShare}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            {showSuccess ? '✅ Copied!' : 'Share'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-2">💰 Invite Friends, Earn DRF!</h3>
      <p className="mb-4 opacity-90">
        Get 5 DRF tokens for every friend who joins and scans their first receipt!
      </p>
      <div className="flex space-x-3">
        <button
          onClick={handleQuickShare}
          className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {showSuccess ? '✅ Link Copied!' : '🔗 Copy Referral Link'}
        </button>
        <button
          onClick={() => ReferralUtils.shareReferralLink(referralLink)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          📱 Share Now
        </button>
      </div>
    </div>
  );
}

// Referral Success Modal Component
export function ReferralSuccessModal({ 
  isOpen, 
  onClose, 
  referrerEarned, 
  referredUser 
}: {
  isOpen: boolean;
  onClose: () => void;
  referrerEarned: number;
  referredUser: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Referral Reward Earned!
          </h2>
          <p className="text-gray-600 mb-4">
            You've earned <strong className="text-green-600">{referrerEarned} DRF tokens</strong> because{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{referredUser}</code>{' '}
            scanned their first receipt!
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Referral Stats Summary Component
export function ReferralStatsSummary({ adminAddress }: { adminAddress: string }) {
  const { referralStats, loadReferralStats } = useReferralSystem(adminAddress);

  useEffect(() => {
    loadReferralStats();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Referral System Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Reward per Referral</p>
          <p className="font-bold text-green-600">{referralStats?.rewardPerReferral || 5} DRF</p>
        </div>
        <div>
          <p className="text-gray-500">Total Paid Out</p>
          <p className="font-bold text-blue-600">{referralStats?.totalRewardsPaid || 0} DRF</p>
        </div>
      </div>
    </div>
  );
}
