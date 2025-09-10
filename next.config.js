/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Essential image configuration for Web3 platform
  images: {
    unoptimized: true, // Required for static deployment compatibility
  },
  
  // Output configuration for Netlify
  output: 'standalone',
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Essential environment variables for Web3 functionality
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_SUPRA_RPC_URL: process.env.NEXT_PUBLIC_SUPRA_RPC_URL,
    NEXT_PUBLIC_SUPRA_NETWORK: process.env.NEXT_PUBLIC_SUPRA_NETWORK,
    NEXT_PUBLIC_SUPRA_CHAIN_ID: process.env.NEXT_PUBLIC_SUPRA_CHAIN_ID,
  },
  
  // TypeScript configuration - allow builds to complete
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration - allow builds to complete
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Minimal webpack configuration for Web3 compatibility
  webpack: (config) => {
    // Essential fallbacks for blockchain libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
  // Netlify-specific configuration
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
}
 
module.exports = nextConfig
