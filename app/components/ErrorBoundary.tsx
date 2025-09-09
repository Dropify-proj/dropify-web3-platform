'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isHydrationError?: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is a hydration error (React Error #423)
    const isHydrationError = 
      error.message?.includes('Minified React error #423') ||
      error.message?.includes('hydration') ||
      error.message?.includes('server') ||
      error.stack?.includes('hydrate');

    return { 
      hasError: true, 
      error,
      isHydrationError 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // If it's a hydration error, try to recover by forcing a client-side render
    if (this.state.isHydrationError) {
      console.log('Hydration error detected, attempting recovery...');
      // Force a re-render after a short delay
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, isHydrationError: false });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // Special handling for hydration errors
      if (this.state.isHydrationError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Loading Dropify...</h2>
              <p className="text-gray-600 mb-6">
                Initializing Web3 platform components...
              </p>
            </div>
          </div>
        );
      }

      // General error fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
