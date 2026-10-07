//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'thread-stream'],
  transpilePackages: ['@snoopdoc/types', '@snoopdoc/ui'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};

module.exports = nextConfig;