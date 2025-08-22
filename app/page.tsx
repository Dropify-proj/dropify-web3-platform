'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import EnvironmentStatus from "./components/EnvironmentStatus";
import Header from "./components/Header";

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
                Transform your everyday purchases into valuable Web3 assets. Simply scan receipts to earn 
                <span className="text-cyan-400 font-semibold"> digital tokens</span>, 
                <span className="text-purple-400 font-semibold"> unlock exclusive NFTs</span>, and 
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

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              NEURAL INTERFACE
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Establish quantum communication link with our advanced AI systems
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="neon-border glass p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-cyan-400 mb-2">
                      IDENTITY MATRIX
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all duration-300"
                      placeholder="Enter designation..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-400 mb-2">
                      QUANTUM ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-purple-400/5 transition-all duration-300"
                      placeholder="user@quantum.net"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-400 mb-2">
                    TRANSMISSION PAYLOAD
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-blue-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-400/5 transition-all duration-300 resize-none"
                    placeholder="Encode your message..."
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
                    INITIATE TRANSMISSION
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
                  Real-time quantum system monitoring and neural network status
                </p>
              </div>
              <div className="neon-border glass rounded-xl overflow-hidden">
                <EnvironmentStatus />
              </div>
            </div>
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
              © 2024 Dropify Technologies. All rights reserved. | Quantum-powered • AI-enhanced • Future-ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
