declare module 'next-pwa' {
    interface PWAOptions {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        [key: string]: unknown; // 他のオプションも許可
    }

    export default function nextPWA(options: PWAOptions): (nextConfig: unknown) => unknown;
}
