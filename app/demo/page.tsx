'use client';

import { useState } from 'react';

export default function DemoPage() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);

  const handleSignup = async () => {
    if (!email) return;
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSignupModal(false);
    alert(`🎉 Success! Wallet created for ${email}. Check your email for details!`);
    setEmail('');
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile) return;
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult = {
      merchant: "Starbucks",
      amount: "$12.50",
      dropTokens: "15 DROP",
      date: new Date().toLocaleDateString(),
      transactionId: "0x" + Math.random().toString(16).substr(2, 8)
    };
    
    setProcessingResult(mockResult);
    setIsProcessing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DROPIFY
            </span>
          </h1>
          <div className="text-3xl lg:text-4xl font-semibold text-purple-300 mb-6">
            Revolutionary Blockchain Technology - General Demo
          </div>
          <p className="text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed max-w-3xl mx-auto">
            Patent-pending email-to-wallet technology eliminates every barrier to blockchain adoption
          </p>
          <div className="inline-flex items-center gap-4 bg-green-900/30 border border-green-500/50 rounded-lg px-6 py-3 backdrop-blur-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-semibold">Open Demo - No Login Required</span>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Experience the Future of Web3 🚀</h2>
            <p className="text-xl text-blue-200">Get started in seconds with our revolutionary technology</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            <div className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-10 text-center h-full">
                <div className="text-5xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-6">Join Dropify Revolution</h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Be among the first to experience seamless Web3 onboarding with just your email address
                </p>
                <button 
                  onClick={() => setShowSignupModal(true)}
                  className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                >
                  Sign Up Now - It's Free!
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
                <button 
                  onClick={() => setShowReceiptModal(true)}
                  className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                >
                  Upload Receipt & Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Whitepaper Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">📋 Whitepaper</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Comprehensive technical documentation of our revolutionary email-to-wallet technology
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Abstract */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">📘 Abstract</h3>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Dropify introduces a revolutionary approach to blockchain onboarding through our patent-pending 
                  email-to-wallet technology, eliminating the traditional barriers that prevent mass adoption 
                  of decentralized technologies.
                </p>
                <p className="leading-relaxed">
                  Our protocol generates cryptographically secure wallets using email addresses as seed inputs, 
                  enabling instant Web3 participation without requiring users to understand private keys, 
                  seed phrases, or complex blockchain concepts.
                </p>
                <button 
                  onClick={() => {
                    // Simulate whitepaper download
                    const link = document.createElement('a');
                    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Dropify Whitepaper - Coming Soon!\n\nThis would contain the full technical documentation of our email-to-wallet technology.');
                    link.download = 'Dropify-Whitepaper.txt';
                    link.click();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                >
                  Download Full Whitepaper (PDF)
                </button>
              </div>
            </div>

            {/* Technical Overview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">⚙️ Technical Overview</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">Email Cryptography</h4>
                  <p className="text-sm text-gray-300">Deterministic wallet generation using email-based entropy</p>
                </div>
                <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">Zero-Knowledge Proofs</h4>
                  <p className="text-sm text-gray-300">Privacy-preserving identity verification protocols</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/50 to-green-900/50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-300 mb-2">Cross-Chain Compatibility</h4>
                  <p className="text-sm text-gray-300">Multi-blockchain support with unified address space</p>
                </div>
                <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-300 mb-2">Enterprise Integration</h4>
                  <p className="text-sm text-gray-300">RESTful APIs for seamless business adoption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tokenomics Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">💰 Tokenomics</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Sustainable dual-token economy designed for long-term ecosystem growth
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Smart Contract Info */}
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-8 mb-16 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">⚡ Dual Token Smart Contract</h3>
              <p className="text-lg text-blue-200 mb-6">
                Both DROP and DRF tokens are deployed on Supra L1 blockchain via a unified smart contract
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-900/30 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔗</div>
                  <div className="text-blue-300 font-semibold">Supra L1 Native</div>
                  <div className="text-sm text-gray-300">High-speed, low-cost transactions</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <div className="text-3xl mb-2">📜</div>
                  <div className="text-purple-300 font-semibold">Dual Token Contract</div>
                  <div className="text-sm text-gray-300">Single contract manages both tokens</div>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-green-300 font-semibold">Audited & Secure</div>
                  <div className="text-sm text-gray-300">Enterprise-grade security</div>
                </div>
              </div>
            </div>

            {/* Token Overview */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* DROP Token */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💧</div>
                  <h3 className="text-3xl font-bold text-cyan-400 mb-2">DROP Token</h3>
                  <p className="text-cyan-200">Utility & Rewards Token</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Supply:</span>
                    <span className="text-cyan-400 font-bold">∞ Infinite Supply</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Blockchain:</span>
                    <span className="text-cyan-400 font-bold">Supra L1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Use Cases:</span>
                    <span className="text-cyan-400 font-bold">Payments, Rewards</span>
                  </div>
                  <div className="bg-cyan-900/20 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-cyan-300 mb-3">Emission Model</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Receipt Rewards:</span><span className="text-cyan-400">Dynamic</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staking Rewards:</span><span className="text-cyan-400">Variable APY</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Liquidity Mining:</span><span className="text-cyan-400">Ongoing</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inflation Rate:</span><span className="text-cyan-400">Algorithmic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DRF Token */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🔷</div>
                  <h3 className="text-3xl font-bold text-purple-400 mb-2">DRF Token</h3>
                  <p className="text-purple-200">Governance & Staking Token</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Supply:</span>
                    <span className="text-purple-400 font-bold">1,000,000,000 DRF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Max Cap:</span>
                    <span className="text-purple-400 font-bold">Fixed at 1B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Blockchain:</span>
                    <span className="text-purple-400 font-bold">Supra L1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Use Cases:</span>
                    <span className="text-purple-400 font-bold">Governance, Staking</span>
                  </div>
                  <div className="bg-purple-900/20 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-purple-300 mb-3">Distribution</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Public Sale:</span><span className="text-purple-400">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ecosystem Fund:</span><span className="text-purple-400">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team & Advisors:</span><span className="text-purple-400">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Strategic Partners:</span><span className="text-purple-400">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Model */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🏛️ Economic Model</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">♾️</div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">Infinite Supply Model</h4>
                  <p className="text-sm text-gray-300">
                    DROP tokens are minted dynamically based on user activity and ecosystem growth
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">�</div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">Fixed DRF Supply</h4>
                  <p className="text-sm text-gray-300">
                    DRF tokens are capped at 1 billion with deflationary mechanisms via governance
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Balanced Ecosystem</h4>
                  <p className="text-sm text-gray-300">
                    Infinite utility token paired with scarce governance token creates optimal economics
                  </p>
                </div>
              </div>
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

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-green-400"></div>

              {/* Q4 2024 */}
              <div className="relative flex items-center mb-16">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Q4 2024 - Foundation</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Core Protocol Development</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Email-to-Wallet MVP</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Smart Contract Audit</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Patent Application Filed</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-purple-900"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Q1 2025 */}
              <div className="relative flex items-center mb-16">
                <div className="w-1/2 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full border-4 border-purple-900"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-purple-400 mb-4">Q1 2025 - Launch</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-gray-300">Mainnet Launch on Supra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-gray-300">Token Generation Event</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span className="text-gray-300">Community Beta Testing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span className="text-gray-300">Mobile App Release</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q2 2025 */}
              <div className="relative flex items-center mb-16">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border border-green-500/30 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-green-400 mb-4">Q2 2025 - Expansion</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Enterprise Partnerships</span>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">Multi-Chain Support</span>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">AI Receipt Processing 2.0</span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-300">1M+ User Milestone</span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border-4 border-purple-900"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Q3-Q4 2025 */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-purple-900"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">Q3-Q4 2025 - Scale</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-300">Global Enterprise Adoption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-300">DeFi Integration Suite</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-300">NFT Marketplace Launch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-300">10M+ User Ecosystem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-12 flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-300">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="text-gray-300">Planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full border border-cyan-500/30">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">🚀 Join Dropify</h3>
              <p className="text-blue-200">Create your email-based wallet in seconds</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              
              <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-lg">ℹ️</span>
                  <div className="text-sm text-cyan-200">
                    <strong>How it works:</strong> We'll generate a secure blockchain wallet using your email address. 
                    No passwords, seed phrases, or complex setup required!
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignup}
                  disabled={!email || isProcessing}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isProcessing ? '⏳ Creating...' : '✨ Create Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-2xl p-8 max-w-md w-full border border-green-500/30">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">📄 AI Receipt Reader</h3>
              <p className="text-green-200">Upload a receipt to earn DROP tokens</p>
            </div>
            
            {!processingResult ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Upload Receipt</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-green-500/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white"
                  />
                </div>
                
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 text-lg">🤖</span>
                    <div className="text-sm text-green-200">
                      <strong>AI Processing:</strong> Our advanced AI will extract merchant, amount, and other data 
                      to calculate your DROP token rewards automatically.
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowReceiptModal(false);
                      setReceiptFile(null);
                      setProcessingResult(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReceiptUpload}
                    disabled={!receiptFile || isProcessing}
                    className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold hover:from-green-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isProcessing ? '🤖 Processing...' : '🚀 Process Receipt'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <h4 className="text-xl font-bold text-green-400">Receipt Processed!</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-200">Merchant:</span>
                      <span className="text-white font-semibold">{processingResult.merchant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-200">Amount:</span>
                      <span className="text-white font-semibold">{processingResult.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-200">DROP Earned:</span>
                      <span className="text-green-400 font-bold text-lg">{processingResult.dropTokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-200">Transaction:</span>
                      <span className="text-cyan-400 font-mono text-sm">{processingResult.transactionId}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setReceiptFile(null);
                    setProcessingResult(null);
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold hover:from-green-400 hover:to-blue-500 transition-all duration-300"
                >
                  ✨ Upload Another Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}