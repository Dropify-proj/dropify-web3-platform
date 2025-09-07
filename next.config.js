/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  // output: 'export', // Disabled for dynamic API routes and interactive features
  images: {
    unoptimized: true,
  },
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Headers configuration for CSP compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://telegram.org https://auth.privy.io https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://testnet-rpc.supra.com https://api.supra.com wss: https:;
              frame-src https://auth.privy.io https://wallet.supra.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },
  
  // Environment variables for build
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_SUPRA_RPC_URL: process.env.NEXT_PUBLIC_SUPRA_RPC_URL,
    NEXT_PUBLIC_SUPRA_NETWORK: process.env.NEXT_PUBLIC_SUPRA_NETWORK,
    NEXT_PUBLIC_SUPRA_CHAIN_ID: process.env.NEXT_PUBLIC_SUPRA_CHAIN_ID,
  },
  // TypeScript configuration
  typescript: {
    // Disable type checking during build (Netlify runs it separately)
    ignoreBuildErrors: false,
  },
  // ESLint configuration
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  
  // Experimental features for module resolution
  experimental: {
    // External modules that should not be bundled
    external: ['react', 'react-dom'],
    // Improved module resolution
    esmExternals: 'loose',
    // Additional experimental features
    appDir: true,
  },
  
  // Webpack configuration for module resolution
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Resolve modules properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
