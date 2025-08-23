'use client';

import { useState, useEffect } from "react";
import Header from "./components/Header";
// import EnvironmentStatus from "./components/EnvironmentStatus";

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [businessFormData, setBusinessFormData] = useState({
    businessName: '',
    email: '',
    budget: '',
    rewardDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBusinessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/business-partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessFormData),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setBusinessFormData({ businessName: '', email: '', budget: '', rewardDetails: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit partnership request. Please try again.');
      }
    } catch (error) {
      console.error('Business partnership form error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="font-sans min-h-screen relative overflow-hidden">
      {/* Futuristic background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i * 0.3) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            {/* Holographic title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8">
              <span className="block text-hologram">DROPIFY</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-cyan-300 mt-4">
                Receipts to Web3 Rewards
              </span>
            </h1>
            
            {/* Futuristic subtitle */}
            <div className="mt-8 mb-12">
              <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Transform your everyday purchases into valuable Web3 assets. Scan receipts to earn 
                <span className="text-cyan-400 font-semibold"> $DROP tokens</span>, 
                participate in governance with 
                <span className="text-purple-400 font-semibold"> $DRF tokens</span>, and 
                <span className="text-blue-400 font-semibold"> redeem real-world rewards</span>.
              </p>
            </div>

            {/* CTA buttons with futuristic design */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/drop-tokens"
                className="btn-futuristic group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 glow-cyan"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Mint $DROP
                </span>
              </a>
              
              <a
                href="/pitch-deck"
                className="btn-futuristic group relative px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg rounded-xl border border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 glow-purple"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Pitch Deck
                </span>
              </a>
              
              <a
                href="#features"
                className="btn-futuristic group relative px-10 py-4 bg-black/50 text-cyan-400 font-bold text-lg rounded-xl border border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Explore Features
                </span>
              </a>
            </div>

            {/* Business Partnership CTA */}
            <div className="mt-12">
              <a
                href="#business-partnership"
                className="btn-futuristic group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl border border-amber-400/50 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 glow-amber"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Feature Your Rewards
                  <span className="text-sm font-normal opacity-75">• Business Partnership</span>
                </span>
              </a>
            </div>

            {/* Status indicator */}
            <div className="mt-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-400/30 rounded-full backdrop-blur-xl">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-mono text-sm">SYSTEM ONLINE • ALL SERVICES ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 relative bg-gradient-to-b from-black/80 to-black/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our <span className="text-hologram">Mission</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="neon-border glass p-8 md:p-12 rounded-2xl">
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8">
                "We believe every purchase has untapped value. Our mission is to 
                <span className="text-cyan-400 font-semibold"> bridge the gap between traditional commerce and Web3</span>, 
                turning ordinary receipts into extraordinary digital opportunities. 
                By <span className="text-purple-400 font-semibold">democratizing access to blockchain rewards</span>, 
                we're creating a future where every transaction empowers consumers and builds lasting value."
              </blockquote>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm md:text-base">
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Empowering Every Purchase</span>
                </div>
                <div className="flex items-center gap-3 text-purple-300">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>Building Web3 for Everyone</span>
                </div>
                <div className="flex items-center gap-3 text-blue-300">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>Creating Lasting Value</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              RECEIPTS TO REWARDS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary technology that transforms every purchase into valuable Web3 assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "�",
                title: "Receipt Scanning",
                description: "AI-powered OCR technology instantly processes receipts from any store or restaurant",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: "�",
                title: "Instant Web3 Rewards",
                description: "Every purchase automatically generates digital tokens, NFTs, and exclusive collectibles",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: "🎁",
                title: "Redeem Real Rewards",
                description: "Convert your digital assets into gift cards, cashback, and exclusive experiences",
                color: "from-blue-500 to-purple-600"
              },
              {
                icon: "🔗",
                title: "Blockchain Verified",
                description: "All transactions are cryptographically secured and permanently recorded on-chain",
                color: "from-green-400 to-cyan-500"
              },
              {
                icon: "�",
                title: "Any Store, Any Receipt",
                description: "Works with receipts from millions of retailers, restaurants, and service providers worldwide",
                color: "from-orange-400 to-red-500"
              },
              {
                icon: "🚀",
                title: "Gamified Experience",
                description: "Level up, unlock achievements, and compete with friends in the ultimate rewards game",
                color: "from-yellow-400 to-orange-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="neon-border glass p-8 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className={`text-4xl mb-4 p-4 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 relative bg-gradient-to-b from-black/60 to-black/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              TRANSPARENCY FIRST
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe in complete transparency. Access our roadmap, tokenomics, and development plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Roadmap Card */}
            <div className="neon-border glass p-8 rounded-xl hover:scale-105 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  Development Roadmap
                </h3>
                <p className="text-gray-400 mb-6">
                  Detailed timeline of our development phases, from foundation to ecosystem expansion. See exactly what we're building and when.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">✅ Phase 1: Foundation</span>
                    <span className="text-gray-500">Q1-Q2 2025</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-400">🚀 Phase 2: Launch</span>
                    <span className="text-gray-500">Q3-Q4 2025</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400">🔮 Phase 3: Expansion</span>
                    <span className="text-gray-500">Q1-Q2 2026</span>
                  </div>
                </div>
                <a
                  href="/whitepaper"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:scale-105 transition-all duration-300"
                >
                  View Full Roadmap
                </a>
              </div>
            </div>

            {/* Tokenomics Card */}
            <div className="neon-border glass p-8 rounded-xl hover:scale-105 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  Dual Token Economy
                </h3>
                <p className="text-gray-400 mb-6">
                  Two powerful tokens: $DROP for infinite rewards and $DRF for governance and premium features.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-cyan-400 font-bold">$DROP Token</span>
                      <span className="text-cyan-300">Infinite Supply</span>
                    </div>
                    <p className="text-xs text-gray-400">Earn from receipts • Burn for rewards</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-purple-400 font-bold">$DRF Token</span>
                      <span className="text-purple-300">1B Fixed Supply</span>
                    </div>
                    <p className="text-xs text-gray-400">Governance • Advertising • Premium access</p>
                  </div>
                </div>
                <a
                  href="/whitepaper"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-lg hover:scale-105 transition-all duration-300"
                >
                  View Tokenomics
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 px-8 py-4 neon-border glass rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-semibold">Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm text-blue-400 font-semibold">Audited Smart Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm text-purple-400 font-semibold">Community Governed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              GET IN TOUCH
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or want to learn more? We'd love to hear from you!
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="neon-border glass p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-cyan-400 mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all duration-300"
                      placeholder="Enter your full name..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-400 mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-purple-400/5 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-400 mb-2">
                    YOUR MESSAGE
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-blue-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-400/5 transition-all duration-300 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-futuristic py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-[1.02] glow-cyan"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </span>
                </button>
              </form>
            </div>

            {/* Environment Status */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-hologram">
                  SYSTEM DIAGNOSTICS
                </h3>
                <p className="mt-2 text-gray-400">
                  Real-time system monitoring and platform status
                </p>
              </div>
              <div className="neon-border glass rounded-xl overflow-hidden p-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-4">🟢 System Online</div>
                  <p className="text-gray-300">All systems operational and ready for Web3 rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Partnership Section */}
      <section id="business-partnership" className="py-24 relative bg-gradient-to-b from-black/50 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              BUSINESS PARTNERSHIPS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Amplify your brand reach and reward customer loyalty through our Web3 ecosystem
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="neon-border glass p-8 rounded-xl">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Benefits Column */}
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-6">Partnership Benefits</h3>
                  <div className="space-y-4">
                    {[
                      { icon: "🎯", title: "Targeted Exposure", desc: "Reach customers actively making purchases" },
                      { icon: "💎", title: "Premium Placement", desc: "Featured rewards in our app interface" },
                      { icon: "📊", title: "Analytics Dashboard", desc: "Track engagement and conversion metrics" },
                      { icon: "🔄", title: "Customer Retention", desc: "Turn one-time buyers into loyal customers" },
                      { icon: "🌐", title: "Web3 Innovation", desc: "Be part of the future of rewards" }
                    ].map((benefit) => (
                      <div key={benefit.title} className="flex items-start gap-3">
                        <span className="text-2xl">{benefit.icon}</span>
                        <div>
                          <h4 className="text-purple-400 font-semibold">{benefit.title}</h4>
                          <p className="text-gray-400 text-sm">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Form Column */}
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-6">Get Featured Today</h3>
                  <form onSubmit={handleBusinessSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-cyan-400 mb-2">
                        BUSINESS NAME
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={businessFormData.businessName}
                        onChange={handleBusinessInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all duration-300"
                        placeholder="Enter your business name..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-purple-400 mb-2">
                        CONTACT EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={businessFormData.email}
                        onChange={handleBusinessInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-purple-400/5 transition-all duration-300"
                        placeholder="business@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-400 mb-2">
                        MONTHLY BUDGET
                      </label>
                      <select 
                        name="budget"
                        value={businessFormData.budget}
                        onChange={handleBusinessInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:bg-amber-400/5 transition-all duration-300"
                      >
                        <option value="">Select budget range...</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000-15000">$5,000 - $15,000</option>
                        <option value="15000-50000">$15,000 - $50,000</option>
                        <option value="50000+">$50,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-400 mb-2">
                        REWARD DETAILS
                      </label>
                      <textarea
                        name="rewardDetails"
                        value={businessFormData.rewardDetails}
                        onChange={handleBusinessInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-black/50 border border-blue-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-400/5 transition-all duration-300 resize-none"
                        placeholder="Describe the rewards you'd like to offer..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-futuristic px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg border border-amber-400/50 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 glow-amber"
                    >
                      <span className="flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Launch Partnership
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
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
              © 2024 Dropify Technologies. All rights reserved. | AI-powered • Blockchain secured • Future-ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
