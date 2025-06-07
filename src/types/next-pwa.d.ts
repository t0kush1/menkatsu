declare module 'next-pwa' {
    interface PWAOptions {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        [key: string]: any; // 他のオプションも許可
    }

    export default function nextPWA(options: PWAOptions): (nextConfig: any) => any;
}
