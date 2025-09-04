import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for better auth stability
  experimental: {
    // Add any valid experimental features here if needed
  },
  
  // Optimize CSS loading to reduce preload warnings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce dev server polling for better auth stability
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce webpack polling interval to minimize auth disruption
      config.watchOptions = {
        poll: 5000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  
  // Headers for better caching and auth stability
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
