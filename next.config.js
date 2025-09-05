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
};

module.exports = nextConfig;
