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
