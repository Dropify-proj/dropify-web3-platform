'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';

function RedemptionContent() {
  const searchParams = useSearchParams();
  const [rewardData, setRewardData] = useState({
    title: 'Digital Gift Card',
    cost: '50',
    icon: '💳'
  });

  useEffect(() => {
    // Get redemption data from URL parameters
    const title = searchParams.get('reward') || 'Digital Gift Card';
    const cost = searchParams.get('cost') || '50';
    const icon = searchParams.get('icon') || '💳';
    
    setRewardData({ title, cost, icon });
  }, [searchParams]);

  const [confetti] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2
    }))
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i * 0.35) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          />
        ))}
      </div>

      {/* Confetti animation */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      
      {/* Success Content */}
      <section className="relative pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8">
            <span className="block text-hologram">REDEMPTION</span>
            <span className="block text-green-400 mt-4">SUCCESSFUL!</span>
          </h1>

          {/* Reward Details */}
          <div className="neon-border glass p-8 rounded-xl mb-12 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">{rewardData.icon}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {rewardData.title}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-orange-400 font-bold text-xl">🔥 {rewardData.cost} $DROP Burned</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Your reward has been successfully processed! Check your email and digital wallet for delivery confirmation.
            </p>
          </div>

          {/* Mock Transaction Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="neon-border glass p-6 rounded-xl">
              <div className="text-cyan-400 font-bold text-lg mb-2">Transaction ID</div>
              <div className="text-gray-300 font-mono text-sm">0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 4)}</div>
            </div>
            <div className="neon-border glass p-6 rounded-xl">
              <div className="text-purple-400 font-bold text-lg mb-2">Processing Time</div>
              <div className="text-gray-300">Instant</div>
            </div>
            <div className="neon-border glass p-6 rounded-xl">
              <div className="text-green-400 font-bold text-lg mb-2">Status</div>
              <div className="text-green-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Confirmed
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="neon-border glass p-8 rounded-xl mb-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">What Happens Next?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Email Confirmation</div>
                  <div className="text-gray-400 text-sm">You'll receive a confirmation email within 5 minutes with your reward details.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Reward Delivery</div>
                  <div className="text-gray-400 text-sm">Digital rewards are delivered instantly to your connected wallet or email.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Track Progress</div>
                  <div className="text-gray-400 text-sm">View your redemption history and track all your earned rewards in your dashboard.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Keep Earning</div>
                  <div className="text-gray-400 text-sm">Scan more receipts to earn additional $DROP tokens for future redemptions!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/drop-tokens"
              className="btn-futuristic px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 glow-cyan"
            >
              🚀 Earn More Tokens
            </a>
            <a
              href="/"
              className="btn-futuristic px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 glow-purple"
            >
              🏠 Back to Home
            </a>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Share your success!</p>
            <div className="flex gap-4 justify-center">
              <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                <span className="text-white">📘</span>
              </button>
              <button className="w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                <span className="text-white">🐦</span>
              </button>
              <button className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                <span className="text-white">📷</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
          animation: confetti-fall linear infinite;
          opacity: 0.8;
        }

        .confetti-piece:nth-child(2n) {
          background: linear-gradient(45deg, #a29bfe, #fd79a8, #fdcb6e, #e17055);
          border-radius: 50%;
        }

        .confetti-piece:nth-child(3n) {
          background: linear-gradient(45deg, #6c5ce7, #fd79a8, #fdcb6e);
          transform: rotate(45deg);
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function RedemptionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedemptionContent />
    </Suspense>
  );
}
