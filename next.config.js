/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name(module) {
              const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              return match ? `npm.${match[1].replace('@', '')}` : 'vendor';
            },
            priority: 30,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: false,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
  // Configure experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.render.com'],
    },
  },
  // Configure build output
  distDir: '.next',
  // Configure image optimization
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 