'use client';

import { useState } from 'react';
import { useSupraWallet } from '../../lib/wallet-context-supra';

interface ScannedReceipt {
  store: string;
  date: string;
  amount: number;
  items: string[];
  category: string;
}

export default function ReceiptScanPage() {
  const { isConnected, dropBalance, scanReceipt } = useSupraWallet();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<ScannedReceipt | null>(null);
  const [rewardCalculated, setRewardCalculated] = useState<number>(0);

  const handleScanReceipt = async () => {
    if (!isConnected) return;

    setIsScanning(true);
    
    // Simulate receipt scanning
    setTimeout(() => {
      const mockReceipt: ScannedReceipt = {
        store: 'Target',
        date: new Date().toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 10000) + 1000, // $10-$100
        items: ['Groceries', 'Electronics', 'Household Items'],
        category: 'Retail Shopping'
      };
      
      const reward = Math.floor(mockReceipt.amount / 100); // 1 DROP per dollar
      
      setScannedReceipt(mockReceipt);
      setRewardCalculated(reward);
      setIsScanning(false);
    }, 3000);
  };

  const handleConfirmUpload = async () => {
    if (!scannedReceipt) return;
    
    try {
      // Generate a receipt hash from the receipt data
      const receiptHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;
      
      // Call the Supra smart contract to process the receipt
      const txHash = await scanReceipt(
        receiptHash,
        scannedReceipt.amount,
        scannedReceipt.store
      );
      
      alert(`🎉 Success! Receipt recorded on Supra L1!\n\nTransaction: ${txHash}\nYou earned ${rewardCalculated} DROP tokens!`);
      
      // Reset state
      setScannedReceipt(null);
      setRewardCalculated(0);
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('❌ Failed to process receipt. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to scan receipts</h2>
          <p className="text-gray-400">Connect your wallet or sign up with email to start earning DROP tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Scan Your Receipt
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your receipt to earn DROP tokens instantly
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-black/30 p-6 rounded-2xl border border-cyan-400/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Current Balance</h3>
              <div className="text-3xl font-bold text-cyan-400">{dropBalance.toLocaleString()} DROP</div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💧</span>
            </div>
          </div>
        </div>

        {/* Scan Area */}
        {!scannedReceipt && (
          <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50 text-center">
            {!isScanning ? (
              <>
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Scan</h2>
                <p className="text-gray-400 mb-6">
                  Click the button below to scan your receipt with your camera or upload an image
                </p>
                <button
                  onClick={handleScanReceipt}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  📸 Scan Receipt
                </button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white mb-4">Scanning Receipt...</h2>
                <p className="text-gray-400">
                  Our AI is analyzing your receipt and calculating your rewards
                </p>
              </>
            )}
          </div>
        )}

        {/* Scanned Receipt Results */}
        {scannedReceipt && (
          <div className="bg-black/30 p-8 rounded-2xl border border-green-400/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Receipt Processed!</h2>
              <p className="text-gray-400">Review the details below and confirm to earn your rewards</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Receipt Details */}
              <div className="bg-black/20 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Receipt Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Store:</span>
                    <span className="text-white font-medium">{scannedReceipt.store}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white font-medium">{scannedReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">${(scannedReceipt.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{scannedReceipt.category}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2">Items Purchased:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scannedReceipt.items.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reward Calculation */}
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-xl border border-green-400/30">
                <h3 className="text-lg font-semibold text-white mb-4">Your Reward</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    +{rewardCalculated} DROP
                  </div>
                  <div className="text-sm text-green-300 mb-4">
                    Reward Rate: 1 DROP per $1 spent
                  </div>
                  <div className="text-xs text-gray-400">
                    Based on 1% reward multiplier
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setScannedReceipt(null);
                  setRewardCalculated(0);
                }}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Confirm & Earn Rewards
              </button>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-black/30 p-8 rounded-2xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white text-center mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">1. Scan Receipt</h4>
              <p className="text-gray-400">Use your camera or upload an image of your receipt</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">2. AI Processing</h4>
              <p className="text-gray-400">Our AI extracts purchase details and calculates rewards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">3. Earn DROP</h4>
              <p className="text-gray-400">Receive DROP tokens instantly to your wallet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
