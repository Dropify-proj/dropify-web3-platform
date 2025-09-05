'use client';

import { useState, useEffect, useRef } from 'react';
import { useTelegram, TelegramButton } from "./components/TelegramMiniApp";
import Leaderboard from "./components/Leaderboard";

export default function Home() {
  const [userStats, setUserStats] = useState({
    dropTokens: 0,
    drfTokens: 0,
    referrals: 0,
    receiptsCount: 0,
    currentMultiplier: 1,
    multiplierReceiptsLeft: 0
  });
  const [receiptData, setReceiptData] = useState({
    total: 0,
    items: 'No data'
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [burnAmount, setBurnAmount] = useState('100');
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    isTelegramWebApp, 
    user, 
    webApp, 
    navigateWithHaptic, 
    showSuccessMessage,
    isReady 
  } = useTelegram();

  // Telegram Stars pricing for multipliers
  const getMultiplierPricing = () => ({
    '1.5x': { stars: 100, multiplier: 1.5, receipts: 10 },
    '3x': { stars: 250, multiplier: 3, receipts: 10 },
    '5x': { stars: 400, multiplier: 5, receipts: 10 }
  });

  const purchaseMultiplier = async (multiplierType: '1.5x' | '3x' | '5x') => {
    const pricing = getMultiplierPricing()[multiplierType];
    
    if (!isTelegramWebApp || !webApp) {
      alert('Multiplier purchases are only available in the Telegram Mini App');
      return;
    }

    try {
      // Show Telegram payment invoice
      const invoiceData = {
        title: `${multiplierType} DROP Multiplier`,
        description: `Activate ${multiplierType} multiplier for your next ${pricing.receipts} receipts`,
        payload: `multiplier_${multiplierType}_${Date.now()}`,
        provider_token: '', // Use Telegram Stars (empty for stars)
        currency: 'XTR', // Telegram Stars currency
        prices: [{ label: `${multiplierType} Multiplier`, amount: pricing.stars }],
        max_tip_amount: 0,
        suggested_tip_amounts: []
      };

      // Open Telegram payment
      webApp.openInvoice(invoiceData.payload, (status: string) => {
        if (status === 'paid') {
          // Activate the multiplier
          setUserStats(prev => ({
            ...prev,
            currentMultiplier: pricing.multiplier,
            multiplierReceiptsLeft: pricing.receipts
          }));
          
          showSuccessMessage(`🎉 ${multiplierType} multiplier activated! You'll earn ${pricing.multiplier}x DROP for your next ${pricing.receipts} receipts.`);
        } else if (status === 'cancelled') {
          showSuccessMessage('Payment cancelled');
        } else {
          showSuccessMessage('Payment failed. Please try again.');
        }
      });

    } catch (error) {
      console.error('Error purchasing multiplier:', error);
      alert('Error processing payment. Please try again.');
    }
  };

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

  // Mock receipt processing function with star multiplier
  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    setShowDashboard(false);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data
      const baseAmount = Math.floor(Math.random() * 100) + 10 + Math.random();
      const mockItems = ['Mock Item 1', 'Mock Item 2', 'Mock Item 3'];
      
      // Apply star multiplier if active
      let multiplierApplied = false;
      let actualMultiplier = 1;
      let finalAmount = baseAmount;
      
      if (userStats.currentMultiplier > 1 && userStats.multiplierReceiptsLeft > 0) {
        actualMultiplier = userStats.currentMultiplier;
        finalAmount = baseAmount * actualMultiplier;
        multiplierApplied = true;
      }
      
      // Update receipt data
      setReceiptData({
        total: finalAmount,
        items: mockItems.join(', ')
      });

      // Calculate new stats
      const newReceiptsCount = userStats.receiptsCount + 1;
      const newDropTokens = userStats.dropTokens + finalAmount;
      const newDrfTokens = Math.floor(newDropTokens / 100);
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        dropTokens: newDropTokens,
        drfTokens: newDrfTokens,
        receiptsCount: newReceiptsCount,
        multiplierReceiptsLeft: multiplierApplied ? Math.max(0, prev.multiplierReceiptsLeft - 1) : prev.multiplierReceiptsLeft,
        currentMultiplier: (multiplierApplied && prev.multiplierReceiptsLeft <= 1) ? 1 : prev.currentMultiplier
      }));

      // Show success message with multiplier info
      if (isTelegramWebApp && webApp) {
        let message = `Earned ${finalAmount.toFixed(2)} DROP tokens!`;
        if (multiplierApplied) {
          message += ` (${actualMultiplier}x multiplier applied!)`;
        }
        if (userStats.multiplierReceiptsLeft === 1) {
          message += ` 🔥 Multiplier expired - purchase a new one to keep earning more!`;
        }
        showSuccessMessage(message);
      }

    } catch (error) {
      console.error('Error processing receipt:', error);
    } finally {
      setIsProcessing(false);
      setShowDashboard(true);
    }
  };

  // Burn DROP tokens for DRF conversion with 1% treasury premium
  const burnDropTokens = async () => {
    const burnAmountNum = parseFloat(burnAmount);
    
    if (!burnAmountNum || burnAmountNum <= 0) {
      alert('Please enter a valid burn amount');
      return;
    }

    if (burnAmountNum > userStats.dropTokens) {
      alert('Insufficient DROP tokens');
      return;
    }

    setIsBurning(true);

    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate conversion: 100 DROP = 1 DRF
      const baseDrfAmount = burnAmountNum / 100;
      
      // Calculate 1% premium for treasury
      const treasuryPremium = baseDrfAmount * 0.01;
      const userDrfReceived = baseDrfAmount; // User gets full amount
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        dropTokens: prev.dropTokens - burnAmountNum,
        drfTokens: prev.drfTokens + userDrfReceived
      }));

      // Update treasury balance (1% premium goes to treasury)
      setTreasuryBalance(prev => prev + treasuryPremium);

      // Show success message
      if (isTelegramWebApp && webApp) {
        showSuccessMessage(`Burned ${burnAmountNum} DROP → Received ${userDrfReceived.toFixed(4)} DRF + ${treasuryPremium.toFixed(4)} DRF to treasury!`);
      }

      // Reset burn amount
      setBurnAmount('100');

    } catch (error) {
      console.error('Error burning tokens:', error);
      alert('Error burning tokens. Please try again.');
    } finally {
      setIsBurning(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processReceipt(file);
    }
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

          {/* Prominent Buttons Section */}
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 mt-8">
            <TelegramButton
              onClick={() => setShowDashboard(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg"
            >
              Sign Up Now
            </TelegramButton>
            
            <TelegramButton
              onClick={handleUploadClick}
              className="bg-transparent border-2 border-blue-500 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <span>Processing...</span>
                  <div className="ml-3 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'Upload a Receipt'
              )}
            </TelegramButton>

            <TelegramButton
              onClick={() => setShowLeaderboard(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 py-4 px-10 rounded-full font-bold text-lg text-white transform transition-transform hover:scale-105 shadow-lg"
            >
              🏆 Leaderboard
            </TelegramButton>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <button
            onClick={handleTelegramOpen}
            className="mt-8 text-blue-400 hover:text-blue-200 transition-colors"
          >
            {isTelegramWebApp ? 'You\'re in Telegram Mini App!' : 'Open in Telegram Mini App'}
          </button>
        </main>

        {/* User Dashboard Section */}
        {showDashboard && (
          <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 md:p-10 my-16">
            <h2 className="text-3xl font-semibold mb-6 text-white text-center">Your Dashboard</h2>
            
            {/* Token Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Drop Tokens</p>
                <p className="text-4xl font-bold text-purple-400 mt-2">{userStats.dropTokens.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">DRF Tokens</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{userStats.drfTokens.toFixed(4)}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Referrals</p>
                <p className="text-4xl font-bold text-green-400 mt-2">{userStats.referrals}</p>
              </div>
            </div>

            {/* Star Multiplier Status */}
            {userStats.currentMultiplier > 1 && userStats.multiplierReceiptsLeft > 0 && (
              <div className="mb-8 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">🔥</span>
                  <h3 className="text-lg font-bold text-orange-300">Active Multiplier!</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">{userStats.currentMultiplier}x DROP</div>
                  <div className="text-sm text-gray-300">
                    {userStats.multiplierReceiptsLeft} receipts remaining
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userStats.multiplierReceiptsLeft / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Multiplier Purchase Section */}
            <div className="mb-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">⭐</span>
                <h3 className="text-xl font-bold text-yellow-300">Purchase DROP Multipliers</h3>
              </div>
              <p className="text-sm text-gray-300 text-center mb-6">
                Buy multipliers with Telegram Stars to boost your DROP earnings for the next 10 receipts!
              </p>
              
              {/* Multiplier Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-300 mb-2">1.5x Multiplier</div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">100 ⭐</div>
                  <div className="text-xs text-gray-400 mb-4">+50% more DROP for 10 receipts</div>
                  <button
                    onClick={() => purchaseMultiplier('1.5x')}
                    disabled={!isTelegramWebApp || userStats.currentMultiplier > 1}
                    className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                      !isTelegramWebApp || userStats.currentMultiplier > 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'
                    }`}
                  >
                    {userStats.currentMultiplier > 1 ? 'Active Multiplier' : 'Purchase'}
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-orange-300 mb-2">3x Multiplier</div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">250 ⭐</div>
                  <div className="text-xs text-gray-400 mb-4">+200% more DROP for 10 receipts</div>
                  <button
                    onClick={() => purchaseMultiplier('3x')}
                    disabled={!isTelegramWebApp || userStats.currentMultiplier > 1}
                    className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                      !isTelegramWebApp || userStats.currentMultiplier > 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:scale-105'
                    }`}
                  >
                    {userStats.currentMultiplier > 1 ? 'Active Multiplier' : 'Purchase'}
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-300 mb-2">5x Multiplier</div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">400 ⭐</div>
                  <div className="text-xs text-gray-400 mb-4">+400% more DROP for 10 receipts</div>
                  <button
                    onClick={() => purchaseMultiplier('5x')}
                    disabled={!isTelegramWebApp || userStats.currentMultiplier > 1}
                    className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                      !isTelegramWebApp || userStats.currentMultiplier > 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105'
            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Receipts Processed</p>
                <p className="text-4xl font-bold text-pink-400 mt-2">{userStats.receiptsCount}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Current Multiplier</p>
                <p className="text-4xl font-bold text-orange-400 mt-2">{userStats.currentMultiplier}x</p>
                {userStats.multiplierReceiptsLeft > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{userStats.multiplierReceiptsLeft} receipts left</p>
                )}
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Treasury Balance</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{treasuryBalance.toFixed(4)}</p>
                <p className="text-xs text-gray-500 mt-1">1% Premium</p>
              </div>
            </div>lassName="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Receipts Processed</p>
                <p className="text-4xl font-bold text-pink-400 mt-2">{userStats.receiptsCount}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Current Multiplier</p>
                <p className="text-4xl font-bold text-orange-400 mt-2">{userStats.currentMultiplier}x</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 font-medium">Treasury Balance</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{treasuryBalance.toFixed(4)}</p>
                <p className="text-xs text-gray-500 mt-1">1% Premium</p>
              </div>
            </div>

            {/* Burn Interface */}
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">🔥 Burn DROP → DRF Conversion</h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">DROP Amount to Burn</label>
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    min="1"
                    max={userStats.dropTokens}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Enter DROP amount"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Available: {userStats.dropTokens.toFixed(2)} DROP
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl mb-2">→</div>
                  <div className="text-sm text-gray-400">100:1 Ratio</div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">DRF You'll Receive</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {(parseFloat(burnAmount || '0') / 100).toFixed(4)} DRF
                  </div>
                  <p className="text-xs text-yellow-400 mt-1">
                    + {(parseFloat(burnAmount || '0') / 100 * 0.01).toFixed(4)} DRF to treasury (1% premium)
                  </p>
                </div>
              </div>
              
              <button
                onClick={burnDropTokens}
                disabled={isBurning || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > userStats.dropTokens}
                className={`w-full mt-4 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                  isBurning || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > userStats.dropTokens
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:scale-105 shadow-lg'
                }`}
              >
                {isBurning ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Burning Tokens...
                  </div>
                ) : (
                  `🔥 Burn ${burnAmount || '0'} DROP for ${(parseFloat(burnAmount || '0') / 100).toFixed(4)} DRF`
                )}
              </button>
            </div>
            
            {receiptData.total > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-lg">Receipt Data Extracted:</p>
                <div className="mt-4 p-4 md:p-6 bg-white/5 rounded-lg">
                  <p className="text-gray-300">Total: <span className="font-semibold text-white">${receiptData.total.toFixed(2)}</span></p>
                  <p className="text-gray-300">Items: <span className="font-semibold text-white">{receiptData.items}</span></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Section */}
        {showLeaderboard && (
          <div className="w-full my-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-2 text-white">Global Competition</h2>
              <p className="text-gray-400">See how you rank against other Dropify users</p>
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

        {/* How It Works Section */}
        <section className="w-full max-w-7xl mx-auto py-16 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">1. Snap & Upload</h3>
              <p className="text-gray-300">Take a picture of your receipt or upload it from your gallery. Our AI-powered OCR technology gets to work instantly.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">2. Extract & Earn</h3>
              <p className="text-gray-300">We extract non-personal data—like total spend, date, and items—and award you 1 Drop Token for every dollar spent.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-orange-300">3. Boost with Stars</h3>
              <p className="text-gray-300">Purchase multipliers with Telegram Stars to earn 1.5x, 3x, or 5x more DROP tokens for your next 10 receipts!</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">4. Connect & Convert</h3>
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
              <p className="text-gray-300 mb-2">⭐ <strong>Multiplier Boosts:</strong> Purchase multipliers with Telegram Stars to earn 1.5x, 3x, or 5x DROP for 10 receipts.</p>
              <p className="text-gray-300 mb-2">🔥 <strong>Burn Feature:</strong> You can burn 100 Drop Tokens to receive 1 DRF Token.</p>
              <p className="text-gray-300 mb-2">💰 <strong>Treasury Premium:</strong> Each burn sends 1% premium to the treasury for platform sustainability.</p>
              <p className="text-gray-300 mb-2">Referrals earn you 5 DRF Tokens.</p>
              <p className="text-gray-300">After the mainnet launch, <strong>DRF tokens will become governance tokens</strong>, and users can continue to earn and burn Drop for rewards.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-semibold mb-4 text-yellow-300">Multiplier Pricing</h3>
              <div className="space-y-3 mb-4">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <div className="font-bold text-blue-400">1.5x Multiplier</div>
                  <div className="text-sm text-gray-300">100 Telegram Stars</div>
                  <div className="text-xs text-gray-400">+50% DROP for 10 receipts</div>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <div className="font-bold text-orange-400">3x Multiplier</div>
                  <div className="text-sm text-gray-300">250 Telegram Stars</div>
                  <div className="text-xs text-gray-400">+200% DROP for 10 receipts</div>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <div className="font-bold text-purple-400">5x Multiplier</div>
                  <div className="text-sm text-gray-300">400 Telegram Stars</div>
                  <div className="text-xs text-gray-400">+400% DROP for 10 receipts</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">The total supply of DRF is a capped 1,000,000,000 with 250,000,000 DRF tokens set aside for testnet early users.</p>
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
