'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-cyan-400/20 sticky top-0 z-50 relative">
      {/* Futuristic background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-purple-900/20" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center h-24">
          {/* Logo with Enhanced Spacing */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center relative group shadow-lg shadow-cyan-400/25">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dropify
              </span>
              <span className="text-xs text-cyan-400/60 font-mono">Receipts to Rewards</span>
            </div>
          </div>

          {/* Desktop Navigation with Futuristic Style */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: '/', label: 'Home', color: 'cyan' },
              { href: '/user-dashboard', label: 'Dashboard', color: 'green' },
              { href: '/receipt-camera', label: '📱 Scan Receipt', color: 'blue' },
              { href: '/business-subscriptions', label: '🏢 Business', color: 'purple' },
              { href: '/drop-tokens', label: 'Mint $DROP', color: 'blue' },
              { href: '/#features', label: 'Features', color: 'purple' },
              { href: '/whitepaper', label: 'Whitepaper', color: 'green' },
              { href: '/#business-partnership', label: 'Partner With Us', color: 'amber' },
              { href: '/admin/treasury', label: 'Treasury', color: 'red' },
              { href: '/#contact', label: 'Contact', color: 'cyan' },
              { href: '/pitch-deck', label: 'Pitch Deck', color: 'purple' }
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 font-medium group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/10 to-${item.color}-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 group-hover:w-full transition-all duration-300`} />
              </a>
            ))}
          </nav>

          {/* Demo Action Button */}
          <div className="hidden md:block">
            <a href="/drop-tokens" 
               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
              🚀 Try Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with Futuristic Design */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-2 bg-black/40 backdrop-blur-xl rounded-xl mt-2 border border-cyan-400/30 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl" />
              {[
                { href: '/', label: 'Home' },
                { href: '/user-dashboard', label: 'Dashboard' },
                { href: '/receipt-camera', label: '📱 Scan Receipt' },
                { href: '/business-subscriptions', label: '🏢 Business' },
                { href: '/drop-tokens', label: 'Mint $DROP' },
                { href: '/#features', label: 'Features' },
                { href: '/whitepaper', label: 'Whitepaper' },
                { href: '/#business-partnership', label: 'Partner With Us' },
                { href: '/admin/treasury', label: 'Treasury' },
                { href: '/#contact', label: 'Contact' },
                { href: '/pitch-deck', label: 'Pitch Deck' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white transition-colors font-medium relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
              <div className="px-4 py-2 relative z-10">
                <a href="/drop-tokens" 
                   onClick={() => setIsMenuOpen(false)}
                   className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  🚀 Try Demo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
