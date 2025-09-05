/**
 * Simple Stats Display Component
 * Shows user earnings and progress
 */

'use client';

interface UserStatsProps {
  dropTokens: number;
  drfTokens: number;
  referrals: number;
  className?: string;
}

export default function SimpleStatsDisplay({ 
  dropTokens, 
  drfTokens, 
  referrals, 
  className = '' 
}: UserStatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10">
        <div className="text-3xl mb-2">💎</div>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">Drop Tokens</p>
        <p className="text-3xl font-bold text-purple-400 mt-2">{dropTokens.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">1 DROP per $1 spent</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10">
        <div className="text-3xl mb-2">🪙</div>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">DRF Tokens</p>
        <p className="text-3xl font-bold text-blue-400 mt-2">{drfTokens}</p>
        <p className="text-xs text-gray-500 mt-1">100 DROP = 1 DRF</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10">
        <div className="text-3xl mb-2">👥</div>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">Referrals</p>
        <p className="text-3xl font-bold text-green-400 mt-2">{referrals}</p>
        <p className="text-xs text-gray-500 mt-1">5 DRF per referral</p>
      </div>
    </div>
  );
}

/**
 * Recent Activity Component
 */
interface RecentActivityProps {
  receiptData?: {
    total: number;
    items: string;
  };
  className?: string;
}

export function RecentActivity({ receiptData, className = '' }: RecentActivityProps) {
  if (!receiptData || receiptData.total === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center ${className}`}>
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-white mb-2">No receipts processed yet</h3>
        <p className="text-gray-400">Upload your first receipt to start earning tokens!</p>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Last Receipt Processed
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Amount:</span>
          <span className="font-semibold text-white text-lg">${receiptData.total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">DROP Earned:</span>
          <span className="font-semibold text-purple-400">+{receiptData.total.toFixed(2)}</span>
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-2">Items detected:</p>
          <p className="text-white text-sm bg-white/5 rounded-lg p-2">{receiptData.items}</p>
        </div>
      </div>
    </div>
  );
}
