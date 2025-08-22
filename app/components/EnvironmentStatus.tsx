'use client';

import { useState, useEffect } from 'react';

interface EnvInfo {
  nodeEnv: string;
  appName: string;
  appUrl: string;
  hasDatabase: boolean;
  hasEmailConfig: boolean;
  hasOpenAI: boolean;
  hasStripe: boolean;
  hasAuth: boolean;
  timestamp: string;
}

export default function EnvironmentStatus() {
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchEnvInfo = async () => {
      try {
        const response = await fetch('/api/env-check');
        if (!response.ok) {
          throw new Error('Failed to fetch environment info');
        }
        const data = await response.json();
        setEnvInfo(data.environment);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvInfo();
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (!envInfo) {
    return null;
  }

  const getStatusColor = (hasService: boolean) => 
    hasService 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-yellow-600 dark:text-yellow-400';

  const getStatusIcon = (hasService: boolean) => 
    hasService ? '✅' : '⚠️';

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-cyan-200/50 dark:border-purple-700/50 rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Environment Configuration
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Environment:</span>
          <span className="font-medium text-gray-900 dark:text-white px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-md">
            {envInfo.nodeEnv || 'development'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">App Name:</span>
          <span className="font-medium text-gray-900 dark:text-white px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-md">
            {envInfo.appName || 'Dropify'}
          </span>
        </div>

        <div className="border-t border-gradient-to-r from-cyan-200 to-purple-200 dark:from-cyan-700 dark:to-purple-700 pt-3 mt-3">
          <h4 className="text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Services Configuration:
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Database:</span>
              <span className={getStatusColor(envInfo.hasDatabase)}>
                {getStatusIcon(envInfo.hasDatabase)} {envInfo.hasDatabase ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Email:</span>
              <span className={getStatusColor(envInfo.hasEmailConfig)}>
                {getStatusIcon(envInfo.hasEmailConfig)} {envInfo.hasEmailConfig ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Authentication:</span>
              <span className={getStatusColor(envInfo.hasAuth)}>
                {getStatusIcon(envInfo.hasAuth)} {envInfo.hasAuth ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Payments:</span>
              <span className={getStatusColor(envInfo.hasStripe)}>
                {getStatusIcon(envInfo.hasStripe)} {envInfo.hasStripe ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">OpenAI:</span>
              <span className={getStatusColor(envInfo.hasOpenAI)}>
                {getStatusIcon(envInfo.hasOpenAI)} {envInfo.hasOpenAI ? 'Configured' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-200/50 dark:border-purple-600/50 pt-3 mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last checked: {new Date(envInfo.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
