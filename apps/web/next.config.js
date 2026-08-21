//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['pino', 'thread-stream'],
  // Next.js options go here
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js
};

module.exports = nextConfig;
