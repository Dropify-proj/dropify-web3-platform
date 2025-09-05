'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SharePage() {
  const [referralCode, setReferralCode] = useState('DROPIFY2025');
  const [copied, setCopied] = useState('');

  const shareUrl = `https://dropify-testnet.com/testnet-live?ref=${referralCode}`;
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const shareMessages = {
    twitter: `🚀 Just tried @DropifyTech's revolutionary Web3 onboarding!\n\n✨ Create a blockchain wallet with just an email\n🔒 No seed phrases to remember\n⚡ Live on Supra testnet\n\nTry it: ${shareUrl}\n\n#Web3 #Blockchain #Supra #Innovation`,
    
    linkedin: `Excited to share Dropify's breakthrough in Web3 accessibility!\n\nThey've solved the biggest barrier to blockchain adoption - complex wallet setup. Now anyone can create a secure Supra wallet with just their email address.\n\nKey innovations:\n✅ No seed phrases required\n✅ Instant wallet creation\n✅ Bank-grade security\n✅ Perfect for mainstream adoption\n\nTest it yourself: ${shareUrl}`,
    
    email: `Subject: Revolutionary Web3 Onboarding - Create Wallet with Email\n\nHi!\n\nI just discovered something amazing - Dropify has completely eliminated the complexity of blockchain wallet creation.\n\nInstead of dealing with 12-word seed phrases and confusing setup, you can now create a secure blockchain wallet using just your email address. It's live on Supra testnet and working perfectly.\n\nWhy this matters:\n• 99% of people avoid crypto due to complexity\n• This makes Web3 accessible to everyone\n• Uses advanced cryptography for security\n• Could revolutionize blockchain adoption\n\nTry it here: ${shareUrl}\n\nThis could be the breakthrough that brings Web3 to mainstream users.\n\nBest regards`,
    
    discord: `🎉 **HUGE Web3 Breakthrough!** 🎉\n\n@everyone check this out - Dropify just solved the biggest problem in crypto!\n\n**What they built:**\n✨ Create blockchain wallets with just email\n🚫 NO seed phrases needed\n⚡ Works in seconds\n🛡️ Still completely secure\n\n**Why this is massive:**\n• 99% of people can't figure out normal wallets\n• This makes crypto accessible to EVERYONE\n• Perfect onboarding for games/apps\n• Live on Supra testnet right now\n\n**Try it:** ${shareUrl}\n\nThis could be the thing that finally brings crypto to normal people! 🚀`,
    
    reddit: `**Revolutionary Web3 Onboarding - No More Seed Phrases!**\n\nJust tested Dropify's new wallet system and I'm blown away. They've completely eliminated the complexity that keeps 99% of people away from crypto.\n\n**How it works:**\n• Enter your email address\n• Secure wallet is generated instantly\n• No seed phrases, no technical knowledge needed\n• Uses deterministic cryptography for security\n\n**Why this matters:**\nEvery Web3 app loses 90%+ of users during wallet setup. This could finally make blockchain accessible to mainstream users.\n\n**Technical details:**\n• Uses SHA-256 with 10,000 iterations\n• Generates valid Supra L1 addresses\n• Custodial security with non-custodial control\n• Patent-pending technology\n\n**Test it:** ${shareUrl}\n\nThis might be the breakthrough that brings Web3 to the masses. Thoughts?`
  };

  const socialIcons = {
    twitter: '🐦',
    linkedin: '💼', 
    email: '📧',
    discord: '💬',
    reddit: '📱'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Spread the Word
          </h1>
          <p className="text-xl text-gray-300">
            Help us revolutionize Web3 onboarding. Share Dropify with your network!
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
            <div className="text-gray-300">Conversion Rate</div>
            <div className="text-sm text-green-400">vs 15% industry average</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">12s</div>
            <div className="text-gray-300">Avg Setup Time</div>
            <div className="text-sm text-blue-400">vs 10+ minutes traditional</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
            <div className="text-gray-300">Testnet Users</div>
            <div className="text-sm text-purple-400">Growing daily</div>
          </div>
        </motion.div>

        {/* Share Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Share Links</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 w-24">Testnet URL:</span>
              <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm">
                {shareUrl}
              </div>
              <button 
                onClick={() => copyToClipboard(shareUrl, 'url')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {copied === 'url' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 w-24">Your Code:</span>
              <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm">
                {referralCode}
              </div>
              <button 
                onClick={() => copyToClipboard(referralCode, 'code')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {copied === 'code' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Social Media Templates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Ready-to-Share Messages</h2>
          
          {Object.entries(shareMessages).map(([platform, message], index) => (
            <motion.div 
              key={platform}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="text-2xl mr-2">{socialIcons[platform as keyof typeof socialIcons]}</span>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(message, platform)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {copied === platform ? '✓ Copied' : 'Copy Message'}
                  </button>
                  {platform === 'twitter' && (
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
                      target="_blank"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Tweet Now
                    </a>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {message}
                </pre>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Growth Strategy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4">🎯 Growth Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-400">Target Audiences</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Web3 developers & founders</li>
                <li>• Crypto Twitter influencers</li>
                <li>• Blockchain gaming communities</li>
                <li>• DeFi protocol teams</li>
                <li>• Tech journalists & bloggers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Key Messages</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• "Web3 without complexity"</li>
                <li>• "99% easier onboarding"</li>
                <li>• "Patent-pending innovation"</li>
                <li>• "Live on Supra testnet"</li>
                <li>• "The future of wallet creation"</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
