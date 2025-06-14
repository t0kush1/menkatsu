import type { NextConfig } from 'next';
import nextPWA from 'next-pwa';

// Next.js設定を定義
const baseConfig: NextConfig = {
  reactStrictMode: true,
};

// PWA設定を追加
export default nextPWA({
  dest: 'public', 
  register: true,
  skipWaiting: true,
})(baseConfig);

