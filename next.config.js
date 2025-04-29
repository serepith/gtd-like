// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Add all the experimental diagnostics here
  
  turbopack: {
    resolve: {
      alias: {
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      },
    },
  },

  reactStrictMode: false, // You're already living on the edge
  experimental: {
  },
  // Force the new JSX transform
  compiler: {
    reactRemoveProperties: true,
    removeConsole: false, // Keep your debugging lifelines
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };
    return config;
  },
  // These go at the root level, not inside experimental
  reactRoot: true,
  swcMinify: false
}

module.exports = nextConfig