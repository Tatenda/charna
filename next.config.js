/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true // For static exports if needed
  },
  
  // API routes configuration
  async rewrites() {
    return [
      // Keep existing API routes working
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
