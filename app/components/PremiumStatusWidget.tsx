/**
 * Premium Status Widget - Compact display for premium status
 */

import React from 'react';
import { useTelegramStarsPremium, PremiumUtils } from '../../lib/telegram-stars-premium';

interface PremiumStatusWidgetProps {
  userAddress: string;
  adminAddress: string;
  compact?: boolean;
}

export default function PremiumStatusWidget({ 
  userAddress, 
  adminAddress, 
  compact = false 
}: PremiumStatusWidgetProps) {
  const {
    premiumStatus,
    isStarsAvailable,
    loading,
    formatTimeRemaining
  } = useTelegramStarsPremium(adminAddress, userAddress);

  const isUserPremium = PremiumUtils.isUserPremium(premiumStatus);

  if (!isStarsAvailable) return null;

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${compact ? 'h-8 w-24' : 'h-12 w-32'}`}></div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        isUserPremium 
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
          : 'bg-gray-100 text-gray-600 border border-gray-300'
      }`}>
        <span>{isUserPremium ? '👑' : '⭐'}</span>
        <span>{isUserPremium ? 'PREMIUM' : 'FREE'}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
      isUserPremium 
        ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300' 
        : 'bg-gray-100 border border-gray-300'
    }`}>
      <span className="text-lg">{isUserPremium ? '👑' : '⭐'}</span>
      <div>
        <div className="text-sm font-semibold">
          {isUserPremium ? 'Premium Active' : 'Free Plan'}
        </div>
        {isUserPremium && premiumStatus && (
          <div className="text-xs text-gray-600">
            {formatTimeRemaining(premiumStatus.expiresAt)}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Premium Multiplier Badge - Shows active multiplier
 */
interface PremiumMultiplierBadgeProps {
  userAddress: string;
  adminAddress: string;
  className?: string;
}

export function PremiumMultiplierBadge({ 
  userAddress, 
  adminAddress, 
  className = '' 
}: PremiumMultiplierBadgeProps) {
  const { premiumStatus } = useTelegramStarsPremium(adminAddress, userAddress);
  const isUserPremium = PremiumUtils.isUserPremium(premiumStatus);

  if (!isUserPremium) return null;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold ${className}`}>
      <span>⚡</span>
      <span>1.5x</span>
    </div>
  );
}
