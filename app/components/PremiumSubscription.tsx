/**
 * Premium Subscription UI Component
 * Telegram Stars integration for 1.5x rewards
 */

import React, { useState, useEffect } from 'react';
import { useTelegramStarsPremium, PremiumUtils } from '../../lib/telegram-stars-premium';

interface PremiumSubscriptionProps {
  userAddress: string;
  adminAddress: string;
  onPremiumChange?: (isActive: boolean) => void;
}

export default function PremiumSubscription({ 
  userAddress, 
  adminAddress, 
  onPremiumChange 
}: PremiumSubscriptionProps) {
  const {
    premiumStatus,
    premiumPricing,
    isStarsAvailable,
    loading,
    error,
    purchasePremium,
    calculateRewardBonus,
    benefits,
    formatTimeRemaining
  } = useTelegramStarsPremium(adminAddress, userAddress);

  const [showRewardCalculator, setShowRewardCalculator] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState('100');
  const [rewardComparison, setRewardComparison] = useState<any>(null);

  const isUserPremium = PremiumUtils.isUserPremium(premiumStatus);

  // Notify parent component of premium status changes
  useEffect(() => {
    if (onPremiumChange) {
      onPremiumChange(isUserPremium);
    }
  }, [isUserPremium, onPremiumChange]);

  // Calculate reward comparison
  useEffect(() => {
    if (calculatorAmount && parseFloat(calculatorAmount) > 0) {
      const amount = parseFloat(calculatorAmount);
      calculateRewardBonus(amount).then(setRewardComparison);
    }
  }, [calculatorAmount, calculateRewardBonus]);

  const handlePurchase = async () => {
    const success = await purchasePremium();
    if (success) {
      // Show success message
      console.log('Premium purchased successfully!');
    }
  };

  if (!isStarsAvailable) {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">📱</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Telegram Required
        </h3>
        <p className="text-gray-600 text-sm">
          Premium features are only available in the Telegram Mini App
        </p>
      </div>
    );
  }

  if (loading && !premiumStatus) {
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-yellow-300 rounded mb-3"></div>
          <div className="h-4 bg-yellow-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-yellow-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Status Card */}
      <div className={`border-2 rounded-xl p-6 ${
        isUserPremium 
          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {isUserPremium ? '👑' : '⭐'}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {isUserPremium ? 'Premium Active' : 'Premium Available'}
              </h3>
              <p className="text-sm text-gray-600">
                {isUserPremium 
                  ? formatTimeRemaining(premiumStatus?.expiresAt || 0)
                  : 'Unlock 1.5x rewards with Telegram Stars'
                }
              </p>
            </div>
          </div>
          
          {premiumStatus && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Stars Spent</div>
              <div className="text-lg font-semibold">
                ⭐ {premiumStatus.totalStarsSpent}
              </div>
            </div>
          )}
        </div>

        {isUserPremium ? (
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">🚀</span>
              <span className="font-semibold">1.5x Rewards Active!</span>
            </div>
            <p className="text-sm text-gray-600">
              You're earning 50% more on every receipt scan
            </p>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>⭐</span>
                <span>Get Premium for {premiumPricing?.starsCost || 50} Stars</span>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Premium Benefits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Premium Benefits
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit: any, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">{benefit.icon}</span>
              <div>
                <h5 className="font-semibold text-sm">{benefit.title}</h5>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Calculator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <button
          onClick={() => setShowRewardCalculator(!showRewardCalculator)}
          className="w-full flex items-center justify-between text-left"
        >
          <h4 className="text-lg font-semibold flex items-center">
            <span className="mr-2">🧮</span>
            Reward Calculator
          </h4>
          <span className={`transform transition-transform ${showRewardCalculator ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </button>
        
        {showRewardCalculator && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Amount ($)
              </label>
              <input
                type="number"
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter purchase amount"
              />
            </div>
            
            {rewardComparison && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Normal Rewards</div>
                    <div className="text-lg font-semibold">
                      {rewardComparison.normalDrop.toFixed(2)} DROP
                    </div>
                    <div className="text-sm text-gray-500">
                      {rewardComparison.normalPoints} points
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Premium Rewards</div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {rewardComparison.premiumDrop.toFixed(2)} DROP
                    </div>
                    <div className="text-sm text-gray-500">
                      {rewardComparison.premiumPoints} points
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center p-2 bg-yellow-100 rounded">
                  <span className="text-sm font-semibold text-yellow-800">
                    +{rewardComparison.bonusAmount.toFixed(2)} DROP bonus ({rewardComparison.percentageIncrease}% more!)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Premium Statistics */}
      {premiumStatus && premiumStatus.activations > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Your Premium History
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {premiumStatus.activations}
              </div>
              <div className="text-sm text-gray-600">Times Activated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                ⭐ {premiumStatus.totalStarsSpent}
              </div>
              <div className="text-sm text-gray-600">Total Stars Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                ${(premiumStatus.totalStarsSpent * 0.02).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Approx. Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
