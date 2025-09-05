/**
 * Dropify Referral Dashboard Page
 * Complete referral system interface with advanced features
 */

'use client';

import { useState, useEffect } from 'react';
import Header from "../components/Header";
import { useTelegram, TelegramHeader } from "../components/TelegramMiniApp";
import { 
  ReferralDashboard, 
  ReferralStatsSummary 
} from "../components/ReferralSystem";
import { 
  ReferralLeaderboard, 
  ReferralChallenges, 
  ReferralAnalyticsDashboard 
} from "../components/ReferralAnalytics";
import { 
  EnhancedSocialSharing, 
  QuickShareWidget 
} from "../components/SocialSharing";
import { 
  NotificationProvider, 
  NotificationBell, 
  CelebrationAnimation,
  useReferralNotifications 
} from "../components/NotificationSystem";

function ReferralPageContent() {
  const { isTelegramWebApp, user, navigateWithHaptic } = useTelegram();
  const [userAddress, setUserAddress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard' | 'challenges' | 'analytics' | 'sharing'>('dashboard');
  const { 
    showCelebration, 
    celebrationType, 
    hideCelebration,
    notifyReferralEarned 
  } = useReferralNotifications();
  
  // Mock contract address
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x1234...";
  
  // Mock user stats
  const userStats = {
    totalReferrals: 23,
    drfEarned: 115,
    rank: 12
  };

  useEffect(() => {
    // Set user address from Telegram or mock for demo
    if (user?.id) {
      setUserAddress(user.id.toString());
    } else {
      setUserAddress('demo_user_123');
    }
  }, [user]);

  // Generate referral link
  const referralLink = `https://dropify.com/?ref=${userAddress}&source=referral`;

  // Simulate referral earning (for demo)
  const simulateReferralEarned = () => {
    notifyReferralEarned(5, '0xabcd1234...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Notifications */}
      <div className="relative">
        {isTelegramWebApp ? <TelegramHeader /> : <Header />}
        <div className="absolute top-4 right-4">
          <NotificationBell />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            💰 Advanced Referral Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn <strong className="text-green-600">5 DRF tokens</strong> for every friend you refer 
            who signs up and scans their first receipt! Track progress, compete, and maximize earnings.
          </p>
          <div className="mt-4">
            <QuickShareWidget referralLink={referralLink} compact={true} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'leaderboard', label: '🏆 Leaderboard', icon: '🏆' },
                { id: 'challenges', label: '🎯 Challenges', icon: '🎯' },
                { id: 'analytics', label: '📈 Analytics', icon: '📈' },
                { id: 'sharing', label: '📱 Sharing', icon: '📱' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="block md:hidden">{tab.icon}</span>
                  <span className="hidden md:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <ReferralDashboard 
                userAddress={userAddress}
                adminAddress={contractAddress}
              />
              
              {/* Demo Button */}
              <div className="text-center">
                <button
                  onClick={simulateReferralEarned}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  🎉 Simulate Referral Reward (Demo)
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'leaderboard' && (
            <ReferralLeaderboard adminAddress={contractAddress} />
          )}
          
          {activeTab === 'challenges' && (
            <ReferralChallenges 
              userAddress={userAddress}
              adminAddress={contractAddress}
            />
          )}
          
          {activeTab === 'analytics' && (
            <ReferralAnalyticsDashboard 
              userAddress={userAddress}
              adminAddress={contractAddress}
            />
          )}
          
          {activeTab === 'sharing' && (
            <EnhancedSocialSharing
              userAddress={userAddress}
              referralLink={referralLink}
              userStats={userStats}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigateWithHaptic('/receipt-camera')}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-blue-800">Scan Receipt</h3>
                <p className="text-sm text-blue-600">Earn tokens yourself</p>
              </button>
              
              <button
                onClick={() => navigateWithHaptic('/dashboard')}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-green-800">View Dashboard</h3>
                <p className="text-sm text-green-600">Check your earnings</p>
              </button>
              
              <button
                onClick={() => window.open('https://t.me/dropify_platform_bot', '_blank')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold text-purple-800">Join Telegram</h3>
                <p className="text-sm text-purple-600">Get notifications</p>
              </button>
            </div>
          </div>
        </div>

        {/* Referral Tips */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Referral Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">🎯 Best Practices</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Share on social media platforms</li>
                  <li>• Tell friends about earning real DRF tokens</li>
                  <li>• Explain the testnet opportunity (limited time)</li>
                  <li>• Share in crypto/Web3 communities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">🔥 Why People Join</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Earn rewards from everyday purchases</li>
                  <li>• Revolutionary receipts-to-rewards platform</li>
                  <li>• Limited testnet DRF token distribution</li>
                  <li>• Easy mobile/Telegram integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Messages */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Example Referral Messages</h2>
            <div className="space-y-4">
              
              {/* Social Media Message */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📱 Social Media</h3>
                <p className="text-sm text-blue-700 italic">
                  "Just discovered Dropify - a platform that turns receipts into crypto rewards! 🚀 
                  Earning both DROP and DRF tokens from everyday purchases. Limited testnet: 200 points = 1 DRF token! 
                  Join me: [your referral link]"
                </p>
              </div>

              {/* WhatsApp/Text Message */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">💬 WhatsApp/Text</h3>
                <p className="text-sm text-green-700 italic">
                  "Hey! Found this cool app that gives you crypto for scanning receipts. 
                  I earn 5 DRF tokens when you join and scan your first receipt. 
                  It's free and takes 2 minutes: [your referral link]"
                </p>
              </div>

              {/* Email Message */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">📧 Email</h3>
                <p className="text-sm text-purple-700 italic">
                  "I wanted to share Dropify with you - it's a revolutionary platform that rewards you 
                  with cryptocurrency for everyday purchases. Simply scan receipts and earn tokens! 
                  There's a limited testnet running where you can earn DRF governance tokens. 
                  Check it out: [your referral link]"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="space-x-4">
            <button
              onClick={() => navigateWithHaptic('/')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => navigateWithHaptic('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Dashboard →
            </button>
          </div>
        </div>
      </main>

      {/* Celebration Animation */}
      <CelebrationAnimation
        isVisible={showCelebration}
        onComplete={hideCelebration}
        type={celebrationType}
      />
    </div>
  );
}

export default function ReferralPage() {
  return (
    <NotificationProvider>
      <ReferralPageContent />
    </NotificationProvider>
  );
}
