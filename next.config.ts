import type { NextConfig } from 'next';
import nextPWA from 'next-pwa';

const baseConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextPWA({
  dest: 'public', 
  register: true,
  skipWaiting: true,
})(baseConfig);

