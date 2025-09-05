'use client';

import { useState, useEffect, useRef } from 'react';

interface SimulatedUser {
  id: string;
  email: string;
  status: 'scanning' | 'processing' | 'wallet-created' | 'tokens-minted' | 'complete';
  progress: number;
  receiptAmount: number;
  tokensEarned: number;
  timestamp: number;
}

export default function LiveOnboardingSimulator() {
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([]);
  const [totalOnboarded, setTotalOnboarded] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateUser = (): SimulatedUser => {
    const firstNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: `${name.toLowerCase()}${Math.floor(Math.random() * 9999)}@${domain}`,
      status: 'scanning',
      progress: 0,
      receiptAmount: Math.floor(Math.random() * 200) + 10,
      tokensEarned: 0,
      timestamp: Date.now()
    };
  };

  const updateUserProgress = (user: SimulatedUser): SimulatedUser => {
    const newProgress = Math.min(user.progress + Math.random() * 15 + 5, 100);
    let newStatus = user.status;
    
    if (newProgress >= 20 && user.status === 'scanning') {
      newStatus = 'processing';
    } else if (newProgress >= 40 && user.status === 'processing') {
      newStatus = 'wallet-created';
    } else if (newProgress >= 70 && user.status === 'wallet-created') {
      newStatus = 'tokens-minted';
    } else if (newProgress >= 100) {
      newStatus = 'complete';
    }

    const tokensEarned = newStatus === 'tokens-minted' || newStatus === 'complete' 
      ? Math.floor(user.receiptAmount * 0.1 * 100) // 10% of receipt amount as tokens
      : 0;

    return {
      ...user,
      progress: newProgress,
      status: newStatus,
      tokensEarned
    };
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Add new user occasionally
        if (Math.random() < 0.3) {
          const newUser = generateUser();
          setSimulatedUsers(prev => [newUser, ...prev.slice(0, 7)]);
        }

        // Update existing users
        setSimulatedUsers(prev => 
          prev.map(user => {
            if (user.status === 'complete') return user;
            const updated = updateUserProgress(user);
            
            // Count completed users
            // @ts-ignore - TypeScript incorrectly thinks status can't be 'complete'
            if (updated.status === 'complete' && user.status !== 'complete') {
              setTotalOnboarded(total => total + 1);
            }
            
            return updated;
          })
        );
      }, 800);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const getStatusColor = (status: SimulatedUser['status']) => {
    switch (status) {
      case 'scanning': return 'text-blue-400';
      case 'processing': return 'text-yellow-400';
      case 'wallet-created': return 'text-purple-400';
      case 'tokens-minted': return 'text-green-400';
      case 'complete': return 'text-emerald-400';
    }
  };

  const getStatusIcon = (status: SimulatedUser['status']) => {
    switch (status) {
      case 'scanning': return '📱';
      case 'processing': return '⚙️';
      case 'wallet-created': return '👛';
      case 'tokens-minted': return '💰';
      case 'complete': return '✅';
    }
  };

  const getStatusText = (status: SimulatedUser['status']) => {
    switch (status) {
      case 'scanning': return 'Scanning Receipt';
      case 'processing': return 'Processing Image';
      case 'wallet-created': return 'Wallet Created';
      case 'tokens-minted': return 'Tokens Minted';
      case 'complete': return 'Onboarding Complete';
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          🚀 Live User Onboarding Simulator
          {isRunning && <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>}
        </h3>
        
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            isRunning
              ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {isRunning ? '⏹️ Stop Simulation' : '▶️ Start Simulation'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg text-center">
          <div className="text-2xl font-black text-blue-400">{totalOnboarded}</div>
          <div className="text-blue-300 text-sm">Users Onboarded</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-center">
          <div className="text-2xl font-black text-green-400">{simulatedUsers.filter(u => u.status !== 'complete').length}</div>
          <div className="text-green-300 text-sm">Currently Processing</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-lg text-center">
          <div className="text-2xl font-black text-purple-400">
            {simulatedUsers.reduce((sum, user) => sum + user.tokensEarned, 0).toLocaleString()}
          </div>
          <div className="text-purple-300 text-sm">Tokens Distributed</div>
        </div>
      </div>

      {/* User Queue */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {simulatedUsers.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <div className="text-4xl mb-4">🌟</div>
            <div>Start simulation to see real-time user onboarding</div>
          </div>
        ) : (
          simulatedUsers.map((user) => (
            <div 
              key={user.id}
              className={`p-4 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg transition-all duration-500 ${
                user.status === 'complete' ? 'opacity-75 bg-green-500/10' : 'hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getStatusIcon(user.status)}</span>
                  <span className="font-semibold text-white">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${getStatusColor(user.status)}`}>
                    {getStatusText(user.status)}
                  </span>
                  {user.tokensEarned > 0 && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-semibold">
                      +{user.tokensEarned} DROP
                    </span>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    user.status === 'complete' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${user.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-white/60">
                <span>Receipt: ${user.receiptAmount}</span>
                <span>{user.progress.toFixed(0)}% Complete</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Real-time Metrics */}
      {isRunning && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
          <div className="text-center">
            <div className="text-green-400 font-semibold mb-1">🎯 Conversion Rate</div>
            <div className="text-2xl font-black text-white">
              {simulatedUsers.length > 0 ? ((totalOnboarded / (totalOnboarded + simulatedUsers.length)) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-white/60 text-sm">Users successfully onboarded to Supra L1</div>
          </div>
        </div>
      )}
    </div>
  );
}
