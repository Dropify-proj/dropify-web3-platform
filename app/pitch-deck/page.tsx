'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 13; // Updated to include more slides

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      component: (
        <div className="slide-gradient flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-4 mb-4 animate-title">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 22.0001V2.00012L16 2.00012C19.3137 2.00012 22 4.68642 22 8.00012V16.0001C22 19.3138 19.3137 22.0001 16 22.0001H6ZM8 20.0001H16C18.2091 20.0001 20 18.2092 20 16.0001V8.00012C20 5.791 18.2091 4.00012 16 4.00012H8V20.0001Z" fill="url(#logo-gradient-deck)"/>
              <path d="M10 7.00012H14V9.00012H10V7.00012Z" fill="url(#logo-gradient-deck)"/>
              <path d="M10 15.0001H14V17.0001H10V15.0001Z" fill="url(#logo-gradient-deck)"/>
              <defs>
                <linearGradient id="logo-gradient-deck" x1="6" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6A11CB"/><stop offset="1" stopColor="#2575FC"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-6xl md:text-8xl font-black text-white">Dropify</h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 animate-text">Receipts to Web3 Rewards Revolution.</p>
        </div>
      )
    },
    // Slide 2: The Problem
    {
      id: 2,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">The Problem</h2>
          <p className="text-lg md:text-xl text-purple-300 mb-8 animate-title">Real-world purchases offer no digital value.</p>
          <div className="max-w-4xl grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Wasted Purchase Power</h3>
              <p className="text-gray-400">Billions of daily transactions generate zero digital value - receipts are thrown away and purchases forgotten.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Disconnected Rewards</h3>
              <p className="text-gray-400">Traditional loyalty programs are fragmented, store-specific, and offer limited real value to consumers.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Web3 Adoption Gap</h3>
              <p className="text-gray-400">Consumers struggle to find practical entry points into Web3 that connect to their everyday life.</p>
            </div>
          </div>
        </div>
      )
    },
    // Slide 3: The Solution
    {
      id: 3,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">The Solution: Dropify</h2>
          <p className="text-lg md:text-xl text-blue-300 mb-8 animate-title">Turn every receipt into valuable Web3 assets.</p>
          <div className="max-w-4xl grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Dual Token Economy</h3>
              <p className="text-gray-400">$DROP tokens (infinite supply) for rewards and $DRF tokens (1B fixed) for governance and premium features.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Instant Web3 Rewards</h3>
              <p className="text-gray-400">Every purchase automatically generates $DROP tokens that can be burned for gift cards, NFTs, and exclusive experiences.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-xl mb-2 text-white">Business Partnerships</h3>
              <p className="text-gray-400">Companies pay $DRF tokens to feature their rewards prominently, creating sustainable revenue and enhanced user value.</p>
            </div>
          </div>
        </div>
      )
    },
    // Slide 4: Demo
    {
      id: 4,
      component: (
        <div className="slide-gradient flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">See It In Action</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-text">Experience the magic of receipt-to-rewards conversion. Scan, earn, and redeem in our live interactive demo.</p>
          <a 
            href="/drop-tokens" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition animate-button"
          >
            Launch Interactive Demo
          </a>
        </div>
      )
    },
    // Slide 5: Tokenomics
    {
      id: 5,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">Dual Token Economy</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 animate-title">Two powerful tokens driving sustainable growth</p>
          <div className="max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 p-8 rounded-lg border border-cyan-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">$</span>
                </div>
                <h3 className="font-bold text-2xl text-cyan-400">$DROP Token</h3>
              </div>
              <div className="text-left space-y-3">
                <div className="text-white font-semibold">Infinite Supply • Utility Token</div>
                <div className="text-gray-300">• Earned by scanning receipts</div>
                <div className="text-gray-300">• Burned to redeem rewards</div>
                <div className="text-gray-300">• Dynamic supply based on activity</div>
                <div className="text-gray-300">• Deflationary through burn mechanics</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-8 rounded-lg border border-purple-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">Ð</span>
                </div>
                <h3 className="font-bold text-2xl text-purple-400">$DRF Token</h3>
              </div>
              <div className="text-left space-y-3">
                <div className="text-white font-semibold">1B Fixed Supply • Governance Token</div>
                <div className="text-gray-300">• Platform governance voting</div>
                <div className="text-gray-300">• Advertising space purchases</div>
                <div className="text-gray-300">• Premium feature access</div>
                <div className="text-gray-300">• Staking rewards & airdrops</div>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item max-w-3xl">
            <h3 className="font-bold text-xl mb-3 text-white">Revenue Distribution</h3>
            <div className="text-gray-400">
              35% Community Governance • 20% Ecosystem Development • 15% Team & Advisors • 12% Staking Rewards • 18% Marketing & Operations
            </div>
          </div>
        </div>
      )
    },
    // Slide 6: Business Model
    {
      id: 6,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-title">Business Model</h2>
          <div className="max-w-4xl grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-2xl mb-4 text-cyan-400">$DROP Token Economy</h3>
              <p className="text-gray-400 text-lg mb-4">
                Users earn unlimited $DROP tokens by scanning receipts. Tokens are permanently burned when redeemed for rewards, creating deflationary pressure and sustainable value.
              </p>
              <div className="text-sm text-cyan-300 font-semibold">Infinite mint • Burn for rewards • Dynamic supply</div>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 animate-grid-item">
              <h3 className="font-bold text-2xl mb-4 text-purple-400">$DRF Revenue Model</h3>
              <p className="text-gray-400 text-lg mb-4">
                Businesses pay $DRF tokens to feature their rewards prominently. Users get $DRF through governance participation, staking, and exclusive airdrops.
              </p>
              <div className="text-sm text-purple-300 font-semibold">1B fixed supply • Advertising revenue • Governance rights</div>
            </div>
          </div>
          <div className="mt-8 max-w-2xl bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-grid-item">
            <h3 className="font-bold text-xl mb-3 text-white">Multiple Revenue Streams</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold">Platform Fees</div>
                <div className="text-gray-400">Transaction processing</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">Advertising Revenue</div>
                <div className="text-gray-400">Featured rewards placement</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold">Premium Features</div>
                <div className="text-gray-400">Advanced analytics & tools</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 7: Patent-Pending Technology
    {
      id: 7,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">🔒 Patent-Pending Technology</h2>
          <p className="text-lg md:text-xl text-green-300 mb-8 animate-title">Revolutionary IP Portfolio Worth $15-30M</p>
          <div className="max-w-6xl grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-lg border border-green-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="font-bold text-xl text-green-400">Seamless Wallet Generation</h3>
              </div>
              <p className="text-gray-300 mb-2">Zero-friction Web3 onboarding that eliminates user barriers</p>
              <div className="text-sm text-green-300">• No seed phrases required • Behavioral entropy collection • Progressive Web3 disclosure</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-lg border border-blue-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌉</span>
                </div>
                <h3 className="font-bold text-xl text-blue-400">Web2→Web3 Bridge</h3>
              </div>
              <p className="text-gray-300 mb-2">Universal integration system requiring zero code changes</p>
              <div className="text-sm text-blue-300">• Transparent state sync • Business logic abstraction • Auto-adapter creation</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-6 rounded-lg border border-purple-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-bold text-xl text-purple-400">Automated Token Distribution</h3>
              </div>
              <p className="text-gray-300 mb-2">Real-time business event monitoring with intelligent distribution</p>
              <div className="text-sm text-purple-300">• Complex business rules • Gas optimization • Cross-platform integration</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-500/30 animate-grid-item">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">🔧</span>
                </div>
                <h3 className="font-bold text-xl text-orange-400">Universal Business API</h3>
              </div>
              <p className="text-gray-300 mb-2">Plug-and-play Web3 integration for any business platform</p>
              <div className="text-sm text-orange-300">• Auto-detection • Dynamic schemas • Enterprise security</div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 8: Competitive Advantage & IP Value
    {
      id: 8,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">💎 Competitive Moat & IP Value</h2>
          <p className="text-lg md:text-xl text-yellow-300 mb-8 animate-title">First-to-Market Protection Worth $100M+ Premium</p>
          <div className="max-w-5xl grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 p-6 rounded-lg border border-yellow-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-yellow-400">Patent Portfolio Value</h3>
              <div className="text-left space-y-2">
                <div className="text-white">• Individual Patents: $2-8M each</div>
                <div className="text-white">• Portfolio Synergy: 50% multiplier</div>
                <div className="text-white">• Total Value: $15-30M</div>
                <div className="text-yellow-300">• Licensing Revenue: $10-50M/year</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 p-6 rounded-lg border border-green-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-green-400">Market Protection</h3>
              <div className="text-left space-y-2">
                <div className="text-white">• 15-20 year protection period</div>
                <div className="text-white">• Blocks competitor copying</div>
                <div className="text-white">• First-mover advantage</div>
                <div className="text-green-300">• Premium exit valuation</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-6 rounded-lg border border-blue-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-blue-400">Investment Appeal</h3>
              <div className="text-left space-y-2">
                <div className="text-white">• Strong IP portfolio for funding</div>
                <div className="text-white">• Defensible market position</div>
                <div className="text-white">• Licensing revenue streams</div>
                <div className="text-blue-300">• Acquisition premium potential</div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30 max-w-4xl animate-grid-item">
            <h3 className="font-bold text-2xl mb-2 text-purple-300">🚨 Critical Market Timing</h3>
            <p className="text-white text-lg">Patent applications filed within 30 days to secure priority dates and prevent competitor filings. Working technology demonstration proves feasibility and strengthens patent position.</p>
          </div>
        </div>
      )
    },
    // Slide 9: Market Opportunity
    {
      id: 9,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">📈 Massive Market Opportunity</h2>
          <p className="text-lg md:text-xl text-cyan-300 mb-8 animate-title">Multi-Billion Dollar Addressable Markets</p>
          <div className="max-w-6xl grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 p-6 rounded-lg border border-cyan-500/30 animate-grid-item">
                <h3 className="font-bold text-2xl mb-4 text-cyan-400">Web3 Onboarding Market</h3>
                <div className="text-left space-y-2">
                  <div className="text-white text-lg">• 4.2B people lack Web3 access</div>
                  <div className="text-white text-lg">• 80%+ abandon wallet creation</div>
                  <div className="text-cyan-300 text-xl font-bold">• $50B+ opportunity</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-lg border border-green-500/30 animate-grid-item">
                <h3 className="font-bold text-2xl mb-4 text-green-400">Business Integration</h3>
                <div className="text-left space-y-2">
                  <div className="text-white text-lg">• 28M+ businesses worldwide</div>
                  <div className="text-white text-lg">• $100K+ per integration saved</div>
                  <div className="text-green-300 text-xl font-bold">• $15B+ integration market</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-6 rounded-lg border border-purple-500/30 animate-grid-item">
                <h3 className="font-bold text-2xl mb-4 text-purple-400">Loyalty & Rewards</h3>
                <div className="text-left space-y-2">
                  <div className="text-white text-lg">• $323B global loyalty market</div>
                  <div className="text-white text-lg">• 90% customer participation</div>
                  <div className="text-purple-300 text-xl font-bold">• $2.5B token rewards</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-6 rounded-lg border border-orange-500/30 animate-grid-item">
                <h3 className="font-bold text-2xl mb-4 text-orange-400">Revenue Projections</h3>
                <div className="text-left space-y-2">
                  <div className="text-white text-lg">• Year 1: $2M ARR</div>
                  <div className="text-white text-lg">• Year 3: $50M ARR</div>
                  <div className="text-orange-300 text-xl font-bold">• Year 5: $200M+ ARR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 10: Technology Demo Live
    {
      id: 10,
      component: (
        <div className="slide-gradient flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">🚀 Live Technology Demo</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-text">Experience our patent-pending Web2→Web3 integration technology. See seamless wallet generation and token distribution in action.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mb-8">
            <a 
              href="/" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg px-8 py-6 rounded-lg hover:opacity-90 transition animate-button group"
            >
              <div className="text-xl mb-2">💎 Investor Demo</div>
              <div className="text-sm opacity-90 group-hover:opacity-100">See seamless wallet generation</div>
            </a>
            <a 
              href="/drop-tokens" 
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-lg px-8 py-6 rounded-lg hover:opacity-90 transition animate-button group"
            >
              <div className="text-xl mb-2">⚡ Interactive Platform</div>
              <div className="text-sm opacity-90 group-hover:opacity-100">Full receipt-to-rewards experience</div>
            </a>
          </div>
          <div className="text-center p-6 bg-black/30 rounded-lg border border-gray-600 max-w-2xl animate-grid-item">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Working Technology Proof</h3>
            <p className="text-gray-300">Unlike concepts or prototypes, our technology is fully functional and deployed. This working demonstration significantly strengthens our patent applications and investor position.</p>
          </div>
        </div>
      )
    },
    // Slide 11: Team & Execution
    {
      id: 11,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">👥 Team & Execution</h2>
          <p className="text-lg md:text-xl text-blue-300 mb-8 animate-title">Proven Ability to Execute Revolutionary Technology</p>
          <div className="max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-6 rounded-lg border border-blue-500/30 animate-grid-item">
              <h3 className="font-bold text-2xl mb-4 text-blue-400">Technical Achievements</h3>
              <div className="text-left space-y-3">
                <div className="text-white">✅ Working patent-pending technology deployed</div>
                <div className="text-white">✅ Next.js 15 + React 19 + Move smart contracts</div>
                <div className="text-white">✅ Supra L1 blockchain integration</div>
                <div className="text-white">✅ Enterprise-ready architecture</div>
                <div className="text-white">✅ Professional investor demo platform</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 p-6 rounded-lg border border-green-500/30 animate-grid-item">
              <h3 className="font-bold text-2xl mb-4 text-green-400">Business Development</h3>
              <div className="text-left space-y-3">
                <div className="text-white">📋 Comprehensive patent documentation ready</div>
                <div className="text-white">📈 Phoenix market expansion strategy</div>
                <div className="text-white">🤝 Business partnership framework</div>
                <div className="text-white">💼 Enterprise sales methodology</div>
                <div className="text-white">🚀 Go-to-market execution plan</div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30 max-w-4xl animate-grid-item">
            <h3 className="font-bold text-2xl mb-3 text-purple-300">🎯 Immediate Execution Plan</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-yellow-400 font-bold">Next 30 Days</div>
                <div className="text-white text-sm">• File provisional patents • Secure IP attorney • Phoenix investor meetings</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">Next 90 Days</div>
                <div className="text-white text-sm">• Launch pilot partnerships • Scale platform • Team expansion</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">Next 12 Months</div>
                <div className="text-white text-sm">• Series A funding • National expansion • Patent portfolio completion</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 12: Investment Opportunity
    {
      id: 12,
      component: (
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-title">💰 Investment Opportunity</h2>
          <p className="text-lg md:text-xl text-green-300 mb-8 animate-title">Join the Web3 Onboarding Revolution</p>
          <div className="max-w-6xl grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-lg border border-green-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-green-400">Seed Round</h3>
              <div className="text-left space-y-2">
                <div className="text-2xl font-bold text-white">$2M</div>
                <div className="text-green-300">• Patent filing & protection</div>
                <div className="text-green-300">• Team expansion</div>
                <div className="text-green-300">• Platform development</div>
                <div className="text-green-300">• Pilot partnerships</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-lg border border-blue-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-blue-400">Series A</h3>
              <div className="text-left space-y-2">
                <div className="text-2xl font-bold text-white">$10M</div>
                <div className="text-blue-300">• National market expansion</div>
                <div className="text-blue-300">• Enterprise sales team</div>
                <div className="text-blue-300">• Additional IP development</div>
                <div className="text-blue-300">• Strategic acquisitions</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-6 rounded-lg border border-purple-500/30 animate-grid-item">
              <h3 className="font-bold text-xl mb-4 text-purple-400">Exit Strategy</h3>
              <div className="text-left space-y-2">
                <div className="text-2xl font-bold text-white">$500M+</div>
                <div className="text-purple-300">• Strategic acquisition by Meta/Google</div>
                <div className="text-purple-300">• IPO opportunity</div>
                <div className="text-purple-300">• Patent licensing revenue</div>
                <div className="text-purple-300">• 25x+ investor return</div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg border border-orange-500/30 max-w-4xl animate-grid-item">
            <h3 className="font-bold text-2xl mb-3 text-orange-300">🔥 Why Invest Now</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-white">• Patent priority window closing (30 days)</div>
                <div className="text-white">• Working technology reduces risk</div>
                <div className="text-white">• First-mover advantage in Web3 onboarding</div>
              </div>
              <div>
                <div className="text-white">• Strong IP portfolio ($15-30M value)</div>
                <div className="text-white">• Massive addressable market ($65B+)</div>
                <div className="text-white">• Phoenix market expansion opportunity</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 13: Call to Action
    {
      id: 13,
      component: (
        <div className="slide-gradient flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-4 mb-6 animate-title">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 22.0001V2.00012L16 2.00012C19.3137 2.00012 22 4.68642 22 8.00012V16.0001C22 19.3138 19.3137 22.0001 16 22.0001H6ZM8 20.0001H16C18.2091 20.0001 20 18.2092 20 16.0001V8.00012C20 5.791 18.2091 4.00012 16 4.00012H8V20.0001Z" fill="url(#logo-gradient-deck-end)"/>
              <path d="M10 7.00012H14V9.00012H10V7.00012Z" fill="url(#logo-gradient-deck-end)"/>
              <path d="M10 15.0001H14V17.0001H10V15.0001Z" fill="url(#logo-gradient-deck-end)"/>
              <defs>
                <linearGradient id="logo-gradient-deck-end" x1="6" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6A11CB"/><stop offset="1" stopColor="#2575FC"/>
                </linearGradient>
              </defs>
            </svg>
            <h2 className="text-5xl md:text-6xl font-bold text-white">Join Us</h2>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto mb-8 animate-text">Let's build the future of retail rewards together.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a 
              href="/whitepaper" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition"
            >
              📋 Read Whitepaper
            </a>
            <a 
              href="/drop-tokens" 
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition"
            >
              🚀 Try Platform
            </a>
          </div>
          <p className="text-lg text-white font-semibold animate-button">dropifytoken@gmail.com | 602-422-3656</p>
        </div>
      )
    }
  ];

  return (
    <>
      <style jsx>{`
        .slide-gradient {
          background: radial-gradient(ellipse at 50% 50%, rgba(58, 16, 153, 0.2), transparent 70%);
        }
        .animate-title {
          animation: fadeInDown 0.8s 0.3s both;
        }
        .animate-text {
          animation: fadeInUp 0.8s 0.5s both;
        }
        .animate-button {
          animation: fadeInUp 0.8s 0.7s both;
        }
        .animate-grid-item {
          opacity: 0;
          animation: fadeInUp 0.7s both;
        }
        .animate-grid-item:nth-child(1) { animation-delay: 0.6s; }
        .animate-grid-item:nth-child(2) { animation-delay: 0.8s; }
        .animate-grid-item:nth-child(3) { animation-delay: 1s; }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="font-sans min-h-screen relative overflow-hidden bg-[#05071E] text-gray-200">
        {/* Futuristic background */}
        <div className="fixed inset-0 grid-pattern" />
        <div className="fixed inset-0 particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${(i * 43) % 100}%`,
                animationDelay: `${(i * 0.4) % 6}s`,
                animationDuration: `${6 + (i % 4)}s`
              }}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <Header />

        {/* Slides Container */}
        <div className="relative w-full h-screen pt-20">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-8 transition-all duration-600 ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 visible z-10' 
                  : 'opacity-0 scale-95 invisible z-0'
              }`}
              style={{
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease'
              }}
            >
              {slide.component}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {currentSlide > 0 && (
          <button
            onClick={prevSlide}
            className="fixed top-1/2 left-8 transform -translateY-1/2 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={nextSlide}
            className="fixed top-1/2 right-8 transform -translateY-1/2 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Slide Counter */}
        <div className="fixed bottom-8 left-1/2 transform -translateX-1/2 z-20 bg-black/30 text-white px-4 py-2 rounded-full text-sm">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>
    </>
  );
}
