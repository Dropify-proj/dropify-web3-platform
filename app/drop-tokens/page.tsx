'use client';

import Header from '../components/Header';
import ReceiptProcessor from '../components/ReceiptProcessor';
import { useState } from 'react';

export default function DropifyMintPage() {
  const [userTokens, setUserTokens] = useState(127); // Mock user tokens

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i * 0.35) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8">
              <span className="block text-white">Transform Receipts Into</span>
              <span className="block text-hologram mt-4">WEB3 REWARDS</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Turn everyday purchases into valuable digital assets. 
              <span className="text-cyan-400 font-semibold"> Scan any receipt. Earn tokens & NFTs. Redeem real rewards.</span>
            </p>
            
            {/* Enhanced Token Balance Display */}
            <div className="inline-flex items-center neon-border glass px-8 py-4 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-4 animate-pulse"></div>
              <div className="text-left">
                <div className="text-sm text-gray-400 font-mono">QUANTUM BALANCE</div>
                <div className="font-bold text-2xl text-hologram">
                  {userTokens.toLocaleString()} DT
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
      </section>

      {/* Receipt Processor Section */}
      <section id="scanner" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReceiptProcessor />
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              QUANTUM REWARDS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exchange Drop Tokens for exclusive digital assets and real-world benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💳",
                title: "Digital Gift Cards",
                description: "Instant delivery to your quantum wallet",
                cost: "50 DT",
                color: "from-cyan-500 to-blue-600",
                available: true
              },
              {
                icon: "🎯",
                title: "Premium Discounts",
                description: "20% off at partner metaverse stores",
                cost: "75 DT",
                color: "from-blue-500 to-purple-600",
                available: true
              },
              {
                icon: "🌟",
                title: "VIP Access",
                description: "Exclusive events and early access to features",
                cost: "100 DT",
                color: "from-purple-500 to-cyan-600",
                available: userTokens >= 100
              }
            ].map((reward, index) => (
              <div
                key={index}
                className="neon-border glass p-8 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className={`text-4xl mb-4 p-4 rounded-lg bg-gradient-to-r ${reward.color} w-fit`}>
                  {reward.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {reward.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-6">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-hologram">
                    {reward.cost}
                  </span>
                  <button 
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      reward.available 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:scale-105 glow-cyan' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!reward.available}
                  >
                    {reward.available ? 'REDEEM' : 'LOCKED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              NEURAL NETWORK STATISTICS
            </h2>
            <p className="text-xl text-gray-300">
              Real-time quantum processing metrics from our AI systems
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Receipts Processed", value: "1.2M+", color: "from-cyan-400 to-blue-500" },
              { label: "Tokens Generated", value: "45M+", color: "from-blue-400 to-purple-500" },
              { label: "Active Neural Nodes", value: "250K+", color: "from-purple-400 to-cyan-500" },
              { label: "Quantum Accuracy", value: "99.8%", color: "from-green-400 to-cyan-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center neon-border glass p-8 rounded-xl">
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DROPIFY
              </span>
            </div>
            <p className="text-gray-400 font-mono text-sm">
              © 2024 Dropify Technologies. Receipts to Web3 • AI-powered • Blockchain secured
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
