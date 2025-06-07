import type { NextConfig } from 'next';
import nextPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default nextConfig;
