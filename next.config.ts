import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production optimizations */
  output: 'standalone', // Creates a standalone build optimized for production deployments
  
  /* Environment variables that will be available at build time */
  env: {
    APP_VERSION: process.env.npm_package_version || '0.1.0',
  },
  
  /* Headers for security and caching */
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  /* Configure image optimization */
  images: {
    domains: [], // Add domains for remote images if needed
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
