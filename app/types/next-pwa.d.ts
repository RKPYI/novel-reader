declare module 'next-pwa' {
    import type { NextConfig } from 'next';
    import { RuntimeCaching } from 'workbox-build';
  
    interface PWAOptions {
      dest: string;
      register?: boolean;
      skipWaiting?: boolean;
      disable?: boolean;
      runtimeCaching?: RuntimeCaching[];
      buildExcludes?: string[];
      fallbacks?: {
        image?: string;
        document?: string;
        font?: string;
      };
      [key: string]: any;
    }
  
    function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
  }  