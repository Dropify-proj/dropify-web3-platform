'use client';

import { useState, useEffect, useRef } from 'react';
import { useTelegram, TelegramButton } from "./components/TelegramMiniApp";
import SimpleStatsDisplay, { RecentActivity } from "./components/SimpleStatsDisplay";
import Web3Dashboard from "./components/Web3Dashboard";
import EnhancedStats from "./components/EnhancedStats";
import AIReceiptProcessor from "./components/AIReceiptProcessor";
import SeamlessAuthButton from "./components/SeamlessAuthButton";
import Leaderboard from "./components/Leaderboard";
import { useEnhancedWallet } from "../lib/enhanced-wallet-context";

export default function Home() {
  const [userStats, setUserStats] = useState({
    dropTokens: 0,
    drfTokens: 0,
    referrals: 0
  });
  const [receiptData, setReceiptData] = useState({
    total: 0,
    items: 'No data'
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showWeb3Dashboard, setShowWeb3Dashboard] = useState(false);
  const [showEnhancedStats, setShowEnhancedStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessingResult, setLastProcessingResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    isTelegramWebApp, 
    user, 
    webApp, 
    navigateWithHaptic, 
    showSuccessMessage,
    isReady 
  } = useTelegram();

  // Use enhanced wallet for Web3 functionality
  const {
    isConnected,
    walletType,
    dropBalance,
    drfBalance,
    processReceiptComplete,
    isLoading: walletLoading,
    error: walletError
  } = useEnhancedWallet();

  // Telegram Web App setup
  useEffect(() => {
    if (isReady && isTelegramWebApp && webApp) {
      webApp.ready();
      webApp.expand();
      webApp.MainButton.setText('🚀 Start Earning');
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        handleUploadClick();
      });
    }
  }, [isReady, isTelegramWebApp, webApp]);

  // Handle AI receipt processing completion
  const handleAIProcessComplete = (result: any) => {
    setLastProcessingResult(result);
    
    if (result.success && result.ocrData && result.blockchainResult) {
      // Update receipt data display
      setReceiptData({
        total: result.ocrData.total,
        items: result.ocrData.items?.join(', ') || 'AI extracted items'
      });

      // Update user stats for the simplified dashboard
      setUserStats(prev => ({
        ...prev,
        dropTokens: dropBalance + result.blockchainResult.dropEarned,
        drfTokens: Math.floor((dropBalance + result.blockchainResult.dropEarned) / 100)
      }));

      // Show success message
      if (isTelegramWebApp && webApp) {
        showSuccessMessage(
          `🤖 AI processed your receipt! Earned ${result.blockchainResult.dropEarned.toFixed(2)} DROP tokens`
        );
      }

      // Show all dashboards
      setShowDashboard(true);
      setShowWeb3Dashboard(true);
      setShowEnhancedStats(true);
    }
  };

  const handleUploadClick = () => {
    if (isProcessing || walletLoading) return; // Prevent action when processing
    setShowEnhancedStats(true); // Show enhanced stats when user clicks upload
    // The AIReceiptProcessor will handle the actual file selection
  };

  const handleTelegramOpen = () => {
    if (isTelegramWebApp && webApp) {
      webApp.showAlert('You are already in the Telegram Mini App!');
    } else {
      // Redirect to Telegram bot or show instructions
      window.open('https://t.me/DropifyBot', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-green-500/10"></div>
      
      <div className="relative min-h-screen flex flex-col items-center p-4 md:p-8">
        {/* Main Content Section */}
        <main className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-16 md:py-24 space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            Dropify
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            Turn your everyday receipts into valuable crypto rewards. The revolutionary platform that bridges real-world spending with the Web3 economy.
          </p>

          {/* Email Authentication */}
          <div className="my-6">
            <SeamlessAuthButton />
          </div>

          {/* Web3 Status Indicator */}
          {isConnected && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-300">
              🟢 Web3 Connected ({walletType === 'mock' ? 'Demo Mode' : 'Supra Wallet'}) • {dropBalance} DROP • {drfBalance} DRF
            </div>
          )}

          {/* Error Display */}
          {walletError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300">
              ⚠️ {walletError}
            </div>
          )}

          {/* Processing Status */}
          {(isProcessing || walletLoading) && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {isProcessing ? 'Processing receipt with OCR and blockchain...' : 'Loading wallet...'}
                </span>
              </div>
            </div>
          )}

          {/* Prominent Buttons Section */}
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 mt-8">
            <TelegramButton
              onClick={() => setShowEnhancedStats(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg"
            >
              View Dashboard
            </TelegramButton>
            
            <TelegramButton
              onClick={handleUploadClick}
              className={`bg-transparent border-2 border-blue-500 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg flex items-center justify-center ${
                isProcessing || walletLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing || walletLoading ? (
                <>
                  <span>Processing...</span>
                  <div className="ml-3 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'AI Receipt Upload'
              )}
            </TelegramButton>

            <TelegramButton
              onClick={() => setShowLeaderboard(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg"
            >
              🏆 Leaderboard
            </TelegramButton>
          </div>

          {/* AI Receipt Processor */}
          {showEnhancedStats && (
            <div className="mt-8">
              <AIReceiptProcessor onProcessComplete={handleAIProcessComplete} />
            </div>
          )}
          
          <button
            onClick={handleTelegramOpen}
            className="mt-8 text-blue-400 hover:text-blue-200 transition-colors"
          >
            {isTelegramWebApp ? 'You\'re in Telegram Mini App!' : 'Open in Telegram Mini App'}
          </button>
        </main>

        {/* Enhanced Stats Dashboard */}
        {showEnhancedStats && (
          <div className="w-full my-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-2 text-white">Enhanced Dashboard</h2>
              <p className="text-gray-400">AI-powered receipt processing with Web3 rewards</p>
            </div>
            <EnhancedStats />
          </div>
        )}

        {/* Leaderboard Section */}
        {showLeaderboard && (
          <div className="w-full my-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-2 text-white">Global Competition</h2>
              <p className="text-gray-400">See how you rank against other Dropify users worldwide</p>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="mt-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
            <Leaderboard />
          </div>
        )}

        {/* Web3 Dashboard Section */}
        {showWeb3Dashboard && (
          <div className="w-full my-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-2 text-white">Web3 Dashboard</h2>
              <p className="text-gray-400">Real blockchain interactions and smart contract data</p>
            </div>
            <Web3Dashboard />
          </div>
        )}

        {/* User Dashboard Section */}
        {showDashboard && (
          <div className="w-full max-w-6xl space-y-8 my-16">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-2 text-white">Your Dashboard</h2>
              <p className="text-gray-400">Track your earnings and progress</p>
            </div>
            
            <SimpleStatsDisplay 
              dropTokens={userStats.dropTokens}
              drfTokens={userStats.drfTokens}
              referrals={userStats.referrals}
            />
            
            <RecentActivity receiptData={receiptData.total > 0 ? receiptData : undefined} />
            
            {/* Web3 Integration Status */}
            {lastProcessingResult && (
              <div className="glass-card p-6 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Last Transaction</h3>
                {lastProcessingResult.success ? (
                  <div className="text-green-300">
                    ✅ Successfully processed receipt and earned {lastProcessingResult.blockchainResult?.dropEarned} DROP tokens!
                    {lastProcessingResult.blockchainResult?.transactionHash && (
                      <div className="mt-2 text-sm">
                        <a 
                          href={`https://testnet-explorer.supra.com/tx/${lastProcessingResult.blockchainResult.transactionHash}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View on Supra Explorer ↗
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-300">
                    ❌ Transaction failed: {lastProcessingResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* How It Works Section */}
        <section className="w-full max-w-7xl mx-auto py-16 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">1. Snap & Upload</h3>
              <p className="text-gray-300">Take a picture of your receipt or upload it from your gallery. Our AI-powered OCR technology gets to work instantly.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">2. Extract & Earn</h3>
              <p className="text-gray-300">We extract non-personal data—like total spend, date, and items—and award you 1 Drop Token for every dollar spent.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">3. Connect & Convert</h3>
              <p className="text-gray-300">Your data is secured and connected to Supra's Layer 1 blockchain, and your Drop Tokens are ready to be converted into DRF.</p>
            </div>
          </div>
        </section>

        {/* The Future: Mainnet Rewards Section */}
        <section className="w-full max-w-7xl mx-auto py-16 text-center">
          <h2 className="text-4xl font-bold mb-12">The Future: Mainnet Rewards</h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <p className="text-gray-300">The Dropify mainnet will feature a variety of rewards from participating partners, allowing you to redeem your DRF tokens for exclusive products, discounts, and experiences.</p>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="w-full max-w-7xl mx-auto py-16 text-center">
          <h2 className="text-4xl font-bold mb-12">The Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-semibold mb-4 text-green-300">Drop & DRF Tokens</h3>
              <p className="text-gray-300 mb-2">Drop tokens are earned at a rate of 1 per dollar spent on a receipt.</p>
              <p className="text-gray-300 mb-2">You can burn 100 Drop Tokens to receive 1 DRF Token. Referrals earn you 5 DRF Tokens.</p>
              <p className="text-gray-300">After the mainnet launch, <strong>DRF tokens will become governance tokens</strong>, and users can continue to earn and burn Drop for rewards.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-semibold mb-4 text-green-300">Total Distribution</h3>
              <p className="text-gray-300 mb-2">The total supply of DRF is a capped 1,000,000,000.</p>
              <p className="text-gray-300">A total of 250,000,000 DRF tokens are set aside specifically for testnet early users.</p>
            </div>
          </div>
        </section>

        {/* Telegram User Info */}
        {isTelegramWebApp && user && (
          <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Welcome to Dropify Mini App!</h3>
            <p className="text-gray-300">
              Hello, {user.first_name}! {user.is_premium && '👑'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              You're using the Telegram Mini App version
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
