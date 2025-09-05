'use client';

import React from 'react';
// Update the import path if the file exists elsewhere, e.g.:
import { useTestnetDRF } from '../../lib/testnet-drf-manager';
// Or create the file at app/lib/testnet-drf-manager.ts with the required export.

interface TestnetDRFDisplayProps {
  contractAddress: string;
  client: any;
  className?: string;
}

export function TestnetDRFDisplay({ contractAddress, client, className = '' }: TestnetDRFDisplayProps) {
  const { status, loading, isActive, progressPercentage } = useTestnetDRF(contractAddress, client);

  if (loading || !status) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-300 rounded-lg h-24 w-full"></div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-4 ${className}`}>
        <div className="text-red-400 font-semibold mb-2">🏁 Testnet DRF Distribution Complete</div>
        <p className="text-red-300 text-sm">
          All 250 million DRF tokens have been distributed. Thank you for participating in the testnet!
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <h3 className="text-lg font-bold text-purple-300">Testnet DRF Rewards</h3>
        </div>
        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
          ACTIVE
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-purple-300 text-sm font-medium">Distributed</div>
          <div className="text-white text-lg font-bold">
            {(status.distributed / 1000000).toFixed(1)}M
          </div>
          <div className="text-gray-400 text-xs">DRF Tokens</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-pink-300 text-sm font-medium">Remaining</div>
          <div className="text-white text-lg font-bold">
            {(status.remainingDRF / 1000000).toFixed(1)}M
          </div>
          <div className="text-gray-400 text-xs">DRF Tokens</div>
        </div>
      </div>

      {/* Earning Info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-300">💎</span>
          <span className="text-blue-300 font-semibold">Earn DRF Tokens!</span>
        </div>
        <p className="text-gray-300 text-sm mb-2">
          Every 200 points = 1 DRF token
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>• 1 point per cent spent</span>
          <span>• $2.00 purchase = 1 DRF</span>
          <span>• Limited time offer</span>
        </div>
      </div>
    </div>
  );
}

interface EarningPreviewProps {
  purchaseAmount: number; // in dollars
  contractAddress: string;
  client: any;
  className?: string;
}

export function EarningPreview({ purchaseAmount, contractAddress, client, className = '' }: EarningPreviewProps) {
  const { drfManager, status } = useTestnetDRF(contractAddress, client);
  const [preview, setPreview] = React.useState({
    dropTokens: 0,
    drfTokens: 0,
    points: 0,
    worthInDollars: 0,
  });

  React.useEffect(() => {
    if (drfManager && purchaseAmount > 0) {
      const purchaseAmountCents = Math.round(purchaseAmount * 100);
      drfManager.getEarningPreview(purchaseAmountCents)
        .then(setPreview)
        .catch(console.error);
    }
  }, [drfManager, purchaseAmount]);

  if (!status?.isActive || purchaseAmount <= 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-400">⚡</span>
        <h4 className="text-green-300 font-semibold">You'll Earn</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-cyan-300 text-lg font-bold">{preview.dropTokens.toFixed(2)}</div>
          <div className="text-gray-400 text-xs">DROP Tokens</div>
        </div>
        <div className="text-center">
          <div className="text-purple-300 text-lg font-bold">{preview.drfTokens.toFixed(2)}</div>
          <div className="text-gray-400 text-xs">DRF Tokens</div>
        </div>
        <div className="text-center">
          <div className="text-green-300 text-lg font-bold">${preview.worthInDollars.toFixed(2)}</div>
          <div className="text-gray-400 text-xs">Est. Value</div>
        </div>
      </div>
      
      <div className="mt-3 text-center text-xs text-gray-400">
        From ${purchaseAmount.toFixed(2)} purchase • {preview.points} points earned
      </div>
    </div>
  );
}

interface TestnetStatsProps {
  contractAddress: string;
  client: any;
  className?: string;
}

export function TestnetStats({ contractAddress, client, className = '' }: TestnetStatsProps) {
  const { status, loading } = useTestnetDRF(contractAddress, client);

  if (loading || !status) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-300 animate-pulse rounded h-6 w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Testnet Status:</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          status.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
        }`}>
          {status.isActive ? 'ACTIVE' : 'COMPLETE'}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-300">DRF Distributed:</span>
        <span className="text-purple-300 font-semibold">
          {(status.distributed / 1000000).toFixed(1)}M / 250M
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Remaining:</span>
        <span className="text-pink-300 font-semibold">
          {(status.remainingDRF / 1000000).toFixed(1)}M DRF
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Exchange Rate:</span>
        <span className="text-blue-300 font-semibold">
          {status.pointsPerDRF} points = 1 DRF
        </span>
      </div>
    </div>
  );
}

export default TestnetDRFDisplay;
