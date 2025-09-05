'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Set session cookie and redirect
        document.cookie = 'demo_authenticated=true; path=/; max-age=86400'; // 24 hours
        router.push('/supra-demo');
      } else {
        setError('Invalid access code. Please contact Dropify Technologies for the correct code.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Dropify Technologies
            </h1>
            <p className="text-blue-200">
              Secure Demo Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter demo access code"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Demo'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-blue-200 text-sm mb-3">
                Authorized Personnel Only
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• Supra Labs Business Development</p>
                <p>• Strategic Partnership Discussions</p>
                <p>• Technology Acquisition Evaluation</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-blue-300 text-xs">
              Contact: dropifytoken@gmail.com | 602-422-3656
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-blue-300 text-sm">
            🚀 Revolutionary Email-to-Wallet Technology
          </p>
          <p className="text-blue-400 text-xs mt-1">
            Patent Pending • Supra Network Optimized • Ready for Production
          </p>
        </div>
      </div>
    </div>
  );
}
