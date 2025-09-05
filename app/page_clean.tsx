'use client';

import { useEffect } from 'react';
import Header from "./components/Header";
import { useTelegram, TelegramHeader, TelegramButton, ShareToTelegram } from "./components/TelegramMiniApp";

export default function Home() {
  const { 
    isTelegramWebApp, 
    user, 
    theme, 
    webApp, 
    navigateWithHaptic, 
    showSuccessMessage,
    isReady 
  } = useTelegram();

  useEffect(() => {
    // Setup Telegram Web App features when ready
    if (isReady && isTelegramWebApp && webApp) {
      // Setup main button for platform entry
      webApp.MainButton.setText('🚀 Enter Dropify Platform');
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        navigateWithHaptic('/receipt-camera');
      });

      // Show welcome message for first-time users
      if (webApp.initDataUnsafe.start_param === 'welcome') {
        webApp.showPopup({
          title: '🎉 Welcome to Dropify!',
          message: 'Transform your receipts into blockchain rewards. Earn DROP tokens with every purchase!',
          buttons: [
            { id: 'start', type: 'default', text: '🚀 Get Started' },
            { id: 'demo', type: 'default', text: '📊 View Demo' }
          ]
        }, (buttonId) => {
          if (buttonId === 'start') {
            showSuccessMessage('Welcome to the future of rewards!');
            navigateWithHaptic('/receipt-camera');
          } else if (buttonId === 'demo') {
            navigateWithHaptic('/testnet-live');
          }
        });
      }
    }
  }, [isReady, isTelegramWebApp, webApp, navigateWithHaptic, showSuccessMessage]);

  return (
    <>
      {!isTelegramWebApp && <Header />}
      <TelegramHeader />
      
      <div 
        className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"
        style={{
          backgroundColor: isTelegramWebApp && theme?.bg_color ? theme.bg_color : undefined,
          color: isTelegramWebApp && theme?.text_color ? theme.text_color : undefined,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              DROPIFY
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-300 mb-4">
              Revolutionary Receipts-to-Rewards Platform
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Patent-pending technology that transforms every receipt into blockchain rewards while powering anonymous consumer insights
            </p>
          </div>

          {/* Two Prominent Buttons */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Try Platform Button */}
            <div className="group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-12 text-center h-full">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold text-white mb-6">Try the Platform</h3>
                  <p className="text-cyan-100 mb-8 text-lg leading-relaxed">
                    Upload receipts, earn DROP tokens, explore the dashboard, and experience the future of Web3 rewards.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="text-cyan-200 text-sm">✓ Receipt Camera with AI Processing</div>
                    <div className="text-cyan-200 text-sm">✓ User Dashboard & Analytics</div>
                    <div className="text-cyan-200 text-sm">✓ Token Redemption System</div>
                    <div className="text-cyan-200 text-sm">✓ Business Data Insights</div>
                  </div>
                  <TelegramButton
                    onClick={() => navigateWithHaptic('/receipt-camera')}
                    className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                    hapticStyle="medium"
                  >
                    📱 Start Using Platform
                  </TelegramButton>
                </div>
              </div>
            </div>

            {/* Live Demo Button */}
            <div className="group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl p-12 text-center h-full">
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-3xl font-bold text-white mb-6">View Live Demo</h3>
                  <p className="text-purple-100 mb-8 text-lg leading-relaxed">
                    See the platform in action with real user data, analytics, and blockchain integration.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="text-purple-200 text-sm">✓ Live User Statistics</div>
                    <div className="text-purple-200 text-sm">✓ Blockchain Integration</div>
                    <div className="text-purple-200 text-sm">✓ Real-time Transaction Data</div>
                    <div className="text-purple-200 text-sm">✓ Platform Analytics</div>
                  </div>
                  <TelegramButton
                    onClick={() => navigateWithHaptic('/testnet-live')}
                    className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                    hapticStyle="medium"
                  >
                    🎯 View Live Demo
                  </TelegramButton>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Access Menu */}
          <div className="mt-16 text-center">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 max-w-5xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-8">🔥 Complete Platform Features</h4>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/user-dashboard')}
                  className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
                >
                  📊 User Dashboard
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/business-subscriptions')}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-green-300 hover:bg-green-500/30 transition-all duration-300"
                >
                  💼 Business Portal
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/drop-tokens')}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-300"
                >
                  🪙 Token Center
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/faucet')}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                >
                  🚰 Token Faucet
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/scan')}
                  className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-300 hover:bg-indigo-500/30 transition-all duration-300"
                >
                  📱 Receipt Scanner
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/dashboard')}
                  className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-4 text-teal-300 hover:bg-teal-500/30 transition-all duration-300"
                >
                  🏠 Main Dashboard
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/userbase')}
                  className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 rounded-xl p-4 text-rose-300 hover:bg-rose-500/30 transition-all duration-300"
                >
                  👥 User Analytics
                </TelegramButton>
                <TelegramButton 
                  onClick={() => navigateWithHaptic('/pitch-deck')}
                  className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl p-4 text-violet-300 hover:bg-violet-500/30 transition-all duration-300"
                >
                  📈 Pitch Deck
                </TelegramButton>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span className="text-gray-300">Users earn DROP from receipts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span className="text-gray-300">Anonymous data powers business insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-300">Ad revenue funds user rewards</span>
                </div>
              </div>
              
              {/* Telegram-specific benefits */}
              {isTelegramWebApp && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <h5 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <span>⚡</span> Telegram Mini App Benefits
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-300">Instant transactions within Telegram</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-gray-300">Share rewards with friends in chats</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-gray-300">No external downloads required</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span className="text-gray-300">Native chat integration for support</span>
                    </div>
                  </div>
                  
                  {user?.is_premium && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2 text-yellow-300">
                        <span>👑</span>
                        <span className="font-semibold">Premium User Bonus!</span>
                      </div>
                      <p className="text-sm text-yellow-200 mt-1">
                        Earn 2x DROP tokens on all receipts + exclusive premium features
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Share Feature for Telegram */}
              {isTelegramWebApp && (
                <div className="mt-6">
                  <ShareToTelegram 
                    url="https://dropify.io" 
                    text="🚀 Check out Dropify - Revolutionary Receipts-to-Rewards Platform! Earn DROP tokens with every purchase!" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
