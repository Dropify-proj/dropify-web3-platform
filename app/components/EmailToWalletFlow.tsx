'use client';

import { useState, useEffect } from 'react';

interface FlowStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
  visual: string;
  technical: string;
}

export default function EmailToWalletFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [generatedWallet, setGeneratedWallet] = useState('');

  const flowSteps: FlowStep[] = [
    {
      id: 1,
      title: 'User Enters Email',
      description: 'Customer provides only their email address - no crypto knowledge required',
      icon: '✉️',
      status: 'pending',
      visual: 'Email input form with simple, familiar interface',
      technical: 'SHA-256 hash of email used as deterministic seed'
    },
    {
      id: 2,
      title: 'Receipt Upload',
      description: 'User uploads receipt photo or scans QR code from purchase',
      icon: '🧾',
      status: 'pending',
      visual: 'Drag & drop receipt upload with instant preview',
      technical: 'AI-powered OCR extracts purchase amount and merchant ID'
    },
    {
      id: 3,
      title: 'Instant Wallet Generation',
      description: 'Custodial wallet automatically created using patent-pending algorithm',
      icon: '🔐',
      status: 'pending',
      visual: 'Animated wallet creation with security indicators',
      technical: 'Supra-native wallet generated with email-derived private key'
    },
    {
      id: 4,
      title: 'Smart Contract Execution',
      description: 'On-chain transaction processes receipt and calculates rewards',
      icon: '⚡',
      status: 'pending',
      visual: 'Real-time blockchain transaction visualization',
      technical: 'Move smart contract on Supra L1 validates and mints tokens'
    },
    {
      id: 5,
      title: 'Token Distribution',
      description: 'DROP tokens automatically distributed to user wallet',
      icon: '💰',
      status: 'pending',
      visual: 'Animated token transfer with balance update',
      technical: '2% of purchase amount converted to DROP tokens via oracle'
    },
    {
      id: 6,
      title: 'Welcome to Web3',
      description: 'User now has functional Web3 wallet without knowing it',
      icon: '🚀',
      status: 'pending',
      visual: 'Celebration animation with wallet summary',
      technical: 'Full Supra ecosystem access with gasless transactions'
    }
  ];

  const [steps, setSteps] = useState(flowSteps);

  const startFlow = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setUserEmail(`user${Math.floor(Math.random() * 1000)}@example.com`);
    
    // Reset all steps to pending
    setSteps(flowSteps.map(step => ({ ...step, status: 'pending' })));
    
    // Animate through each step
    flowSteps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i < index ? 'completed' : i === index ? 'active' : 'pending'
        })));
        
        // Generate wallet address when we reach wallet creation step
        if (index === 2) {
          setGeneratedWallet(`0x${Math.random().toString(16).substr(2, 40)}`);
        }
        
        // End animation
        if (index === flowSteps.length - 1) {
          setTimeout(() => {
            setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
            setIsAnimating(false);
          }, 1000);
        }
      }, index * 2000);
    });
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'active': return 'from-blue-500 to-purple-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStepBorder = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/50';
      case 'active': return 'border-blue-500/50';
      default: return 'border-gray-500/30';
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          🎯 Email → Wallet Transformation
          <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
            Patent-Pending
          </span>
        </h3>
        <p className="text-white/70">
          Watch how a simple email address becomes a fully functional Web3 wallet in seconds
        </p>
      </div>

      {/* Control Panel */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <span className="text-blue-300 text-sm">Demo User: {userEmail}</span>
            </div>
          )}
          {generatedWallet && (
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <span className="text-green-300 text-sm">Wallet: {generatedWallet.slice(0, 10)}...</span>
            </div>
          )}
        </div>
        
        <button
          onClick={startFlow}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            isAnimating
              ? 'bg-orange-500/20 text-orange-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105'
          }`}
        >
          {isAnimating ? '⏳ Converting...' : '▶️ Start Email → Wallet Demo'}
        </button>
      </div>

      {/* Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-5 bg-gradient-to-br ${getStepColor(step.status)}/10 border ${getStepBorder(step.status)} rounded-xl transition-all duration-500 ${
              step.status === 'active' ? 'scale-105 shadow-lg' : ''
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${getStepColor(step.status)} rounded-xl flex items-center justify-center text-xl ${
                step.status === 'active' ? 'animate-pulse' : ''
              }`}>
                {step.status === 'completed' ? '✅' : step.status === 'active' ? '⚡' : step.icon}
              </div>
              <div>
                <h4 className="font-bold text-white">{step.title}</h4>
                <div className={`text-xs px-2 py-1 rounded ${
                  step.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  step.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  Step {step.id} of {steps.length}
                </div>
              </div>
            </div>

            {/* Step Description */}
            <p className="text-white/80 text-sm mb-4">{step.description}</p>

            {/* Visual Representation */}
            <div className="mb-3">
              <div className="text-white/60 text-xs font-semibold mb-1">Visual Experience:</div>
              <p className="text-white/70 text-xs">{step.visual}</p>
            </div>

            {/* Technical Implementation */}
            <div>
              <div className="text-white/60 text-xs font-semibold mb-1">Technical Implementation:</div>
              <p className="text-purple-300 text-xs font-mono">{step.technical}</p>
            </div>

            {/* Progress Indicator */}
            {step.status === 'active' && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Technical Advantages */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg">
          <h5 className="font-bold text-blue-300 mb-2">🚀 Speed Advantage</h5>
          <p className="text-white/80 text-sm">Complete onboarding in under 30 seconds vs 15+ minutes for traditional Web3</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
          <h5 className="font-bold text-green-300 mb-2">🔐 Security Innovation</h5>
          <p className="text-white/80 text-sm">Patent-pending deterministic wallet generation with enterprise-grade security</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
          <h5 className="font-bold text-purple-300 mb-2">⚡ Supra Integration</h5>
          <p className="text-white/80 text-sm">Native Supra L1 integration with gasless transactions and instant finality</p>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
        <h5 className="font-bold text-orange-300 mb-2">📊 Projected Impact for Supra</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-white">98%</div>
            <div className="text-orange-300 text-xs">Conversion Rate</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">5-10M</div>
            <div className="text-orange-300 text-xs">Users/Year</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">30s</div>
            <div className="text-orange-300 text-xs">Onboarding Time</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">$0</div>
            <div className="text-orange-300 text-xs">User Education Cost</div>
          </div>
        </div>
      </div>
    </div>
  );
}
