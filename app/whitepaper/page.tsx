'use client';

import Header from '../components/Header';
import { useState } from 'react';

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState('roadmap');

  const roadmapPhases = [
    {
      phase: "Phase 1: Foundation",
      timeline: "Q1-Q2 2025",
      status: "In Progress",
      color: "from-green-400 to-emerald-500",
      items: [
        "✅ Core platform development",
        "✅ Receipt scanning AI implementation", 
        "✅ Web3 authentication integration",
        "🔄 Beta testing with select partners",
        "📋 Mobile app development",
        "📋 Initial token smart contract deployment"
      ]
    },
    {
      phase: "Phase 2: Launch", 
      timeline: "Q3-Q4 2025",
      status: "Planned",
      color: "from-blue-400 to-cyan-500",
      items: [
        "🚀 Public platform launch",
        "🚀 $DROP token generation event",
        "🚀 Initial business partnerships",
        "🚀 Reward marketplace opening",
        "🚀 Community governance launch",
        "🚀 Staking rewards program"
      ]
    },
    {
      phase: "Phase 3: Expansion",
      timeline: "Q1-Q2 2026", 
      status: "Future",
      color: "from-purple-400 to-violet-500",
      items: [
        "🔮 Advanced NFT rewards system",
        "🔮 Cross-chain compatibility",
        "🔮 AI-powered personalized rewards",
        "🔮 Global retailer partnerships",
        "🔮 DAO governance implementation",
        "🔮 Carbon credit rewards integration"
      ]
    },
    {
      phase: "Phase 4: Ecosystem",
      timeline: "Q3-Q4 2026",
      status: "Vision",
      color: "from-pink-400 to-rose-500", 
      items: [
        "✨ Metaverse shopping integration",
        "✨ DeFi yield farming for rewards",
        "✨ Enterprise API for businesses",
        "✨ White-label solutions",
        "✨ Global marketplace expansion",
        "✨ Sustainability impact tracking"
      ]
    }
  ];

  const tokenomics = {
    tokenSystem: "Dual Token Economy",
    tokens: [
      {
        name: "$DROP",
        type: "Utility Token",
        supply: "Infinite (Mint & Burn)",
        color: "from-cyan-400 to-blue-500",
        description: "Primary rewards token earned from receipts and burned for redemptions",
        features: [
          "Earned by scanning receipts",
          "Burned to redeem rewards",
          "Dynamic supply based on activity",
          "Primary platform currency"
        ]
      },
      {
        name: "$DRF (Dropify)",
        type: "Governance Token", 
        supply: "1,000,000,000 DRF (Fixed)",
        color: "from-purple-400 to-violet-500",
        description: "Finite governance token for platform control and premium features",
        features: [
          "Platform governance voting",
          "Advertising space purchases",
          "Premium feature access",
          "Staking rewards and airdrops"
        ]
      }
    ],
    dropMechanics: [
      { 
        type: "Token Minting", 
        description: "$DROP tokens are minted when users scan receipts and earn rewards",
        rate: "Variable based on purchase amount and merchant multipliers",
        color: "bg-gradient-to-r from-green-400 to-emerald-500",
        icon: "💰"
      },
      { 
        type: "Token Burning", 
        description: "$DROP tokens are permanently burned when redeemed for rewards", 
        purpose: "Maintains token value through deflationary pressure",
        color: "bg-gradient-to-r from-red-400 to-orange-500",
        icon: "🔥"
      },
      { 
        type: "Dynamic Supply", 
        description: "$DROP supply adjusts based on user activity and redemptions",
        benefit: "Sustainable token economy that grows with platform usage",
        color: "bg-gradient-to-r from-cyan-400 to-blue-500", 
        icon: "⚖️"
      }
    ],
    drfDistribution: [
      { category: "Community Governance", percentage: "35%", amount: "350M DRF", description: "Distributed to active community members and governance participants", color: "bg-gradient-to-r from-purple-400 to-violet-500" },
      { category: "Ecosystem Development", percentage: "20%", amount: "200M DRF", description: "Platform growth, partnerships, and strategic development", color: "bg-gradient-to-r from-blue-400 to-cyan-500" },
      { category: "Team & Advisors", percentage: "15%", amount: "150M DRF", description: "Team allocation with 4-year vesting schedule", color: "bg-gradient-to-r from-green-400 to-emerald-500" },
      { category: "Staking Rewards", percentage: "12%", amount: "120M DRF", description: "Long-term staking incentives and yield generation", color: "bg-gradient-to-r from-amber-400 to-orange-500" },
      { category: "Airdrops & Marketing", percentage: "10%", amount: "100M DRF", description: "User acquisition campaigns and community airdrops", color: "bg-gradient-to-r from-pink-400 to-rose-500" },
      { category: "Liquidity & Exchange", percentage: "5%", amount: "50M DRF", description: "DEX liquidity and exchange listings", color: "bg-gradient-to-r from-indigo-400 to-purple-500" },
      { category: "Treasury Reserve", percentage: "3%", amount: "30M DRF", description: "Emergency fund and future opportunities", color: "bg-gradient-to-r from-gray-400 to-slate-500" }
    ],
    utility: [
      { feature: "Receipt Rewards ($DROP)", description: "Earn unlimited $DROP tokens by scanning receipts from partner retailers" },
      { feature: "Reward Redemption ($DROP)", description: "Burn $DROP tokens to redeem gift cards, NFTs, and exclusive rewards" },
      { feature: "Governance Voting ($DRF)", description: "Use $DRF tokens to vote on platform proposals and ecosystem decisions" },
      { feature: "Advertising Purchases ($DRF)", description: "Businesses pay $DRF to feature their rewards prominently on the platform" },
      { feature: "Premium Features ($DRF)", description: "Access advanced analytics, priority support, and exclusive features" },
      { feature: "Staking Rewards ($DRF)", description: "Stake $DRF tokens to earn additional rewards and platform benefits" }
    ],
    burnMechanics: [
      { reward: "Gift Cards", burnRate: "1:1 USD value in $DROP", description: "Direct conversion to popular retailer gift cards" },
      { reward: "Exclusive NFTs", burnRate: "Variable $DROP amount", description: "Limited edition rewards with fluctuating burn requirements" },
      { reward: "Physical Products", burnRate: "Market rate + 10% in $DROP", description: "Electronics, apparel, and lifestyle products" },
      { reward: "Experience Rewards", burnRate: "Premium rate in $DROP", description: "Concert tickets, dining experiences, travel vouchers" },
      { reward: "Platform Advertising", burnRate: "$DRF based on visibility", description: "Businesses burn $DRF for featured reward placement" }
    ]
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 47) % 100}%`,
              animationDelay: `${(i * 0.4) % 6}s`,
              animationDuration: `${5 + (i % 3)}s`
            }}
          />
        ))}
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8">
              <span className="block text-hologram">DROPIFY</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-cyan-300 mt-4">
                Whitepaper & Roadmap
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive roadmap and tokenomics for building the future of Web3 rewards
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setActiveSection('roadmap')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeSection === 'roadmap'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-cyan'
                  : 'bg-black/50 text-gray-300 border border-cyan-400/30 hover:border-cyan-400'
              }`}
            >
              🗺️ Roadmap
            </button>
            <button
              onClick={() => setActiveSection('tokenomics')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeSection === 'tokenomics'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white glow-purple'
                  : 'bg-black/50 text-gray-300 border border-purple-400/30 hover:border-purple-400'
              }`}
            >
              💰 Tokenomics
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      {activeSection === 'roadmap' && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
                DEVELOPMENT ROADMAP
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our strategic plan for revolutionizing commerce through Web3 rewards
              </p>
            </div>

            <div className="grid gap-8">
              {roadmapPhases.map((phase, index) => (
                <div key={index} className="neon-border glass p-8 rounded-xl">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="lg:w-1/3">
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${phase.color} text-white font-bold text-sm mb-4`}>
                        {phase.status}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{phase.phase}</h3>
                      <p className="text-cyan-400 font-semibold">{phase.timeline}</p>
                    </div>
                    <div className="lg:w-2/3">
                      <div className="grid md:grid-cols-2 gap-4">
                        {phase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                            <span className="text-xl">{item.split(' ')[0]}</span>
                            <span className="text-gray-300">{item.substring(item.indexOf(' ') + 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tokenomics Section */}
      {activeSection === 'tokenomics' && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
                DUAL TOKEN ECONOMY
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Two complementary tokens: $DROP for infinite rewards and $DRF for finite governance
              </p>
            </div>

            {/* Token Overview */}
            <div className="text-center mb-12">
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {tokenomics.tokens.map((token, index) => (
                  <div key={index} className="neon-border glass p-8 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-4">{token.name}</h3>
                    <div className={`text-lg font-semibold bg-gradient-to-r ${token.color} bg-clip-text text-transparent mb-3`}>
                      {token.type}
                    </div>
                    <div className="text-3xl font-extrabold text-hologram mb-4">
                      {token.supply}
                    </div>
                    <p className="text-gray-300 mb-6">{token.description}</p>
                    <div className="space-y-2">
                      {token.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-cyan-400">
                          <span>•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DROP Token Mechanics */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-8">$DROP Token Mechanics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {tokenomics.dropMechanics.map((mechanism, index) => (
                  <div key={index} className="neon-border glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <div className={`w-full h-4 ${mechanism.color} rounded-full mb-4`}></div>
                    <div className="text-4xl mb-4">{mechanism.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-3">{mechanism.type}</h4>
                    <p className="text-gray-300 mb-3">{mechanism.description}</p>
                    {mechanism.rate && (
                      <p className="text-cyan-400 text-sm font-semibold">Rate: {mechanism.rate}</p>
                    )}
                    {mechanism.purpose && (
                      <p className="text-orange-400 text-sm font-semibold">Purpose: {mechanism.purpose}</p>
                    )}
                    {mechanism.benefit && (
                      <p className="text-purple-400 text-sm font-semibold">Benefit: {mechanism.benefit}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DRF Distribution Chart */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-8">$DRF Token Distribution (1B Fixed Supply)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenomics.drfDistribution.map((item, index) => (
                  <div key={index} className="neon-border glass p-6 rounded-xl">
                    <div className={`w-full h-4 ${item.color} rounded-full mb-4`}></div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.category}</h4>
                    <div className="text-2xl font-bold text-hologram mb-2">{item.percentage}</div>
                    <div className="text-purple-400 font-semibold mb-3">{item.amount}</div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Burn & Use Cases */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-8">Token Burn & Use Cases</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {tokenomics.burnMechanics.map((burn, index) => (
                  <div key={index} className="neon-border glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🔥</span>
                      <h4 className="text-xl font-bold text-white">{burn.reward}</h4>
                    </div>
                    <div className="text-lg font-bold text-orange-400 mb-2">{burn.burnRate}</div>
                    <p className="text-gray-300 text-sm">{burn.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Token Utility */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-8">Dual Token Utility</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenomics.utility.map((utility, index) => (
                  <div key={index} className="neon-border glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      {utility.feature.includes('$DROP') && (
                        <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
                          $DROP
                        </span>
                      )}
                      {utility.feature.includes('$DRF') && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold rounded-full">
                          $DRF
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-cyan-400 mb-3">{utility.feature.replace(' ($DROP)', '').replace(' ($DRF)', '')}</h4>
                    <p className="text-gray-300">{utility.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="neon-border glass p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Join the Future?</h3>
            <p className="text-gray-300 mb-8">
              Be part of the Web3 rewards revolution. Start earning DROP tokens today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/drop-tokens"
                className="btn-futuristic px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 glow-cyan"
              >
                🚀 Start Earning
              </a>
              <a
                href="/#business-partnership"
                className="btn-futuristic px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 glow-purple"
              >
                🤝 Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Dropify Technologies. Building the future of Web3 rewards • Transparent • Community-driven
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
