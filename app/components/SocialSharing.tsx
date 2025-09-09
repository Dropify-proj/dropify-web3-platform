/**
 * Advanced Social Sharing System
 * Enhanced sharing with templates, tracking, and gamification
 */

'use client';

import React, { useState } from 'react';
import { ReferralUtils } from '../../lib/referral-system';

// Social platform configurations
export const SocialPlatforms = {
  TWITTER: {
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-blue-500',
    shareUrl: 'https://twitter.com/intent/tweet',
    params: (text: string, url: string) => `text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  FACEBOOK: {
    name: 'Facebook',
    icon: '📘',
    color: 'bg-blue-600',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php',
    params: (text: string, url: string) => `u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  LINKEDIN: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
    params: (text: string, url: string) => `url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
  },
  REDDIT: {
    name: 'Reddit',
    icon: '🤖',
    color: 'bg-orange-500',
    shareUrl: 'https://reddit.com/submit',
    params: (text: string, url: string) => `url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
  },
  WHATSAPP: {
    name: 'WhatsApp',
    icon: '💬',
    color: 'bg-green-500',
    shareUrl: 'https://wa.me/',
    params: (text: string, url: string) => `?text=${encodeURIComponent(`${text} ${url}`)}`
  }
};

// Pre-built sharing templates
export const SharingTemplates = {
  CASUAL: {
    name: 'Casual Friend',
    emoji: '😊',
    template: (username: string, drfEarned: string) => 
      `Hey! I found this cool app called Dropify that gives you crypto for scanning receipts! 🧾➡️💰 I've already earned ${drfEarned} DRF tokens. Want to try it? I get 5 DRF when you scan your first receipt! 🚀`
  },
  CRYPTO_ENTHUSIAST: {
    name: 'Crypto Enthusiast',
    emoji: '🚀',
    template: (username: string, drfEarned: string) => 
      `🔥 Found a gem! Dropify is revolutionizing Web3 rewards by tokenizing everyday purchases. Currently earning ${drfEarned} DRF tokens from testnet. Limited time: 200 points = 1 DRF! Join the testnet before 250M DRF limit is reached. ⚡`
  },
  PROFESSIONAL: {
    name: 'Professional',
    emoji: '💼',
    template: (username: string, drfEarned: string) => 
      `I wanted to share Dropify - an innovative platform that rewards users with cryptocurrency for everyday purchases. It's currently in testnet with attractive tokenomics (200 points = 1 DRF token). I've earned ${drfEarned} DRF tokens so far. Worth checking out for the Web3 rewards innovation.`
  },
  URGENT: {
    name: 'Limited Time',
    emoji: '⚡',
    template: (username: string, drfEarned: string) => 
      `🚨 LIMITED TIME: Dropify testnet is distributing DRF tokens (200 points = 1 token) until 250M limit reached! I've earned ${drfEarned} DRF already. Each receipt = automatic rewards. Join before it's too late! ⏰`
  },
  SOCIAL_PROOF: {
    name: 'Social Proof',
    emoji: '👥',
    template: (username: string, drfEarned: string) => 
      `Just hit ${drfEarned} DRF tokens on Dropify! 🎉 This platform is genius - turn your everyday receipts into crypto rewards. The testnet is live with amazing tokenomics. Join thousands of users already earning! 📈`
  }
};

// Enhanced Social Sharing Component
export function EnhancedSocialSharing({ 
  userAddress, 
  referralLink, 
  userStats 
}: {
  userAddress: string;
  referralLink: string;
  userStats: {
    totalReferrals: number;
    drfEarned: number;
    rank?: number;
  };
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof SharingTemplates>('CASUAL');
  const [customMessage, setCustomMessage] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 47,
    bestPerforming: 'Telegram',
    clickThroughRate: 23.4
  });

  const getCurrentMessage = () => {
    if (isCustomMode) {
      return customMessage || 'Check out Dropify - earn crypto from receipts!';
    }
    
    const template = SharingTemplates[selectedTemplate];
    return template.template(
      userAddress.slice(0, 8),
      userStats.drfEarned.toString()
    );
  };

  const shareToSocial = async (platform: keyof typeof SocialPlatforms) => {
    const socialConfig = SocialPlatforms[platform];
    const message = getCurrentMessage();
    
    // Track sharing event
    console.log(`Sharing to ${platform}:`, message);
    
    if (platform === 'WHATSAPP') {
      const shareUrl = `${socialConfig.shareUrl}${socialConfig.params(message, referralLink)}`;
      window.open(shareUrl, '_blank');
    } else {
      const shareUrl = `${socialConfig.shareUrl}?${socialConfig.params(message, referralLink)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // Simulate sharing analytics update
    setShareStats(prev => ({ ...prev, totalShares: prev.totalShares + 1 }));
  };

  const copyMessage = async () => {
    const fullMessage = `${getCurrentMessage()}\n\n${referralLink}`;
    const success = await ReferralUtils.copyReferralLink(fullMessage);
    if (success) {
      // Show success feedback
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">📱 Social Sharing Hub</h2>
      
      {/* Sharing Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">📊 Your Sharing Performance</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{shareStats.totalShares}</div>
            <div className="text-gray-600">Total Shares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{shareStats.clickThroughRate}%</div>
            <div className="text-gray-600">Click Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{shareStats.bestPerforming}</div>
            <div className="text-gray-600">Best Platform</div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">🎯 Message Template</h3>
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`px-3 py-1 rounded text-sm ${
              isCustomMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isCustomMode ? 'Use Template' : 'Custom Message'}
          </button>
        </div>

        {!isCustomMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {Object.entries(SharingTemplates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key as keyof typeof SharingTemplates)}
                className={`p-3 rounded-lg border text-left ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span>{template.emoji}</span>
                  <span className="font-medium text-sm">{template.name}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write your custom referral message..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
          />
        )}

        {/* Message Preview */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📝 Message Preview:</h4>
          <p className="text-sm text-gray-600 italic">"{getCurrentMessage()}"</p>
          <p className="text-xs text-blue-600 mt-2">{referralLink}</p>
        </div>
      </div>

      {/* Social Platform Buttons */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">🌐 Share on Social Media</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(SocialPlatforms).map(([key, platform]) => (
            <button
              key={key}
              onClick={() => shareToSocial(key as keyof typeof SocialPlatforms)}
              className={`${platform.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <span>{platform.icon}</span>
              <span className="font-medium">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">⚡ Quick Actions</h3>
        <div className="flex space-x-3">
          <button
            onClick={copyMessage}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            📋 Copy Message
          </button>
          <button
            onClick={() => navigator.share?.({ 
              title: 'Join Dropify!', 
              text: getCurrentMessage(), 
              url: referralLink 
            })}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📱 Native Share
          </button>
        </div>
      </div>

      {/* Sharing Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Sharing Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Telegram has the highest conversion rate (38%)</li>
          <li>• Add personal touches to your message for better engagement</li>
          <li>• Share in crypto/Web3 communities for quality referrals</li>
          <li>• Mention the limited testnet opportunity (250M DRF limit)</li>
        </ul>
      </div>
    </div>
  );
}

// Social Sharing Widget for Quick Access
export function QuickShareWidget({ referralLink, compact = true }: {
  referralLink: string;
  compact?: boolean;
}) {
  const quickShare = async (platform: 'telegram' | 'twitter' | 'copy') => {
    const message = "🚀 Just discovered Dropify - earn crypto from receipts! Join me and get rewards with every purchase!";
    
    switch (platform) {
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`, '_blank');
        break;
      case 'copy':
        await ReferralUtils.copyReferralLink(`${message}\n\n${referralLink}`);
        break;
    }
  };

  if (compact) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => quickShare('telegram')}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          ✈️ Telegram
        </button>
        <button
          onClick={() => quickShare('twitter')}
          className="px-3 py-2 bg-blue-400 text-white rounded text-sm hover:bg-blue-500"
        >
          🐦 Twitter
        </button>
        <button
          onClick={() => quickShare('copy')}
          className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          📋 Copy
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3">🚀 Quick Share</h3>
      <div className="space-y-2">
        <button
          onClick={() => quickShare('telegram')}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
        >
          <span>✈️</span>
          <span>Share on Telegram</span>
        </button>
        <button
          onClick={() => quickShare('twitter')}
          className="w-full px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 flex items-center justify-center space-x-2"
        >
          <span>🐦</span>
          <span>Share on Twitter</span>
        </button>
        <button
          onClick={() => quickShare('copy')}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center space-x-2"
        >
          <span>📋</span>
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
}
