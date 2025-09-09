'use client';

import { useEffect, useState } from 'react';

// Telegram Web App SDK integration - using global types
// (Types are defined in types/global.d.ts)

export default function GeneralDemo() {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setIsTelegramWebApp(true);
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Telegram Mini App Header */}
      {isTelegramWebApp && (
        <div className="bg-blue-600 text-white p-3 text-center font-semibold">
          🚀 Dropify General Demo - Powered by Telegram
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DROPIFY
              </span>
            </h1>
            <div className="text-3xl lg:text-4xl font-semibold text-purple-300 mb-6">
              Revolutionary Blockchain Technology
            </div>
            <p className="text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Patent-pending email-to-wallet technology eliminates barriers to blockchain adoption
            </p>
            <div className="inline-flex items-center gap-4 bg-green-900/30 border border-green-500/50 rounded-lg px-6 py-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-semibold">Open Demo - No Login Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Experience the Future of Web3</h2>
            <p className="text-xl text-blue-200">Get started in seconds with revolutionary technology</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            <div className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-10 text-center h-full">
                <div className="text-5xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-6">Join Dropify Revolution</h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Be among the first to experience seamless Web3 onboarding with just your email address
                </p>
                <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
                  Sign Up Now - Free!
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-10 text-center h-full">
                <div className="text-5xl mb-6">📄</div>
                <h3 className="text-3xl font-bold text-white mb-6">AI Receipt Reader Demo</h3>
                <p className="text-green-100 mb-8 text-lg leading-relaxed">
                  Upload any receipt and watch our AI instantly extract data and award DROP tokens
                </p>
                <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
                  Upload Receipt & Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Features */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Patented Innovation</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Discover the breakthrough technology revolutionizing blockchain adoption
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-10 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">🔬 Revolutionary Technology</h3>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-cyan-300 mb-3">Email-to-Wallet Technology</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Proprietary algorithm creates blockchain wallets from email addresses without requiring 
                    users to understand private keys, seed phrases, or complex blockchain concepts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-green-300 mb-3">Zero-Friction Onboarding</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Users can receive and manage digital assets using only their email address - 
                    no downloads, no registration, no technical knowledge required.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-purple-300 mb-3">Enterprise Ready</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Scalable infrastructure capable of onboarding millions of users to Web3 
                    with enterprise-grade security and compliance features.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-10 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">💰 Business Value</h3>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-yellow-300 mb-3">Mass Adoption Engine</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Instantly make blockchain accessible to billions of email users worldwide - 
                    no technical barriers, no complex onboarding processes.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-indigo-300 mb-3">Competitive Moat</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Patent-protected technology creates insurmountable competitive advantage 
                    in the user onboarding space.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-emerald-300 mb-3">Revenue Acceleration</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Reduce user acquisition costs by 90% while increasing conversion rates 
                    from curious users to active blockchain participants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acquisition Proposal */}
      <div className="py-20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-500/30 rounded-2xl p-12 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">🎯 Acquisition Opportunity</h3>
            <p className="text-white text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              We are seeking to sell this technology and team to an established blockchain company 
              that can scale it to millions of users worldwide.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-900/30 rounded-xl p-8 hover:bg-blue-900/50 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-2">$50M+</div>
                <div className="text-blue-200 text-lg">Market Valuation</div>
              </div>
              <div className="bg-green-900/30 rounded-xl p-8 hover:bg-green-900/50 transition-all duration-300">
                <div className="text-4xl font-bold text-green-400 mb-2">1B+</div>
                <div className="text-green-200 text-lg">Addressable Users</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-8 hover:bg-purple-900/50 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-400 mb-2">Patent</div>
                <div className="text-purple-200 text-lg">Protected IP</div>
              </div>
            </div>

            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-6 px-12 rounded-xl text-2xl hover:from-blue-400 hover:to-green-400 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Initiate Acquisition Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
