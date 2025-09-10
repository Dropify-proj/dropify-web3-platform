'use client';

import { useState } from 'react';

export default function DemoPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🚀 Dropify Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Experience the future of Web3 rewards. Turn your everyday purchases into valuable digital assets.
          </p>
          <button
            onClick={() => setShowSignup(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform"
          >
            🎯 Start Demo
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">🎁 Core Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how Dropify transforms traditional shopping into a Web3 experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-8 rounded-xl border border-cyan-500/30">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-cyan-400 mb-3">AI Receipt Processing</h3>
              <p className="text-gray-300">Upload receipts and let our AI extract purchase data automatically</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-8 rounded-xl border border-green-500/30">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-bold text-green-400 mb-3">Instant Rewards</h3>
              <p className="text-gray-300">Earn DROP tokens instantly - 1 token per dollar spent</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-8 rounded-xl border border-purple-500/30">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-purple-400 mb-3">Blockchain Rewards</h3>
              <p className="text-gray-300">Your rewards are secured on Supra's L1 blockchain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">🗺️ Roadmap</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Our strategic plan for revolutionizing Web3 adoption over the next 24 months
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-8 rounded-xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Q1 2025 - Foundation ✅</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>• Core platform development</div>
                <div>• AI receipt processing engine</div>
                <div>• Supra blockchain integration</div>
                <div>• Initial testnet launch</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-8 rounded-xl border border-blue-500/30">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Q2 2025 - Growth 🚀</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>• Mobile app development</div>
                <div>• Partnership integrations</div>
                <div>• Advanced analytics dashboard</div>
                <div>• Community building</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 p-8 rounded-xl border border-purple-500/30">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Q3-Q4 2025 - Scale 📈</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>• Mainnet deployment</div>
                <div>• Global retailer network</div>
                <div>• Advanced reward features</div>
                <div>• Platform ecosystem expansion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Shopping?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users already earning crypto rewards for their everyday purchases
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setShowSignup(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              🚀 Start Earning
            </button>
            <a
              href="/whitepaper"
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform inline-block"
            >
              📖 Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Welcome to Dropify!</h3>
              <p className="text-gray-300">The demo is currently in development</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Go to Main Platform
              </button>
              <button
                onClick={() => setShowSignup(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
