import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
    output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    domains: ['localhost'],
  },
  // Allow cross-origin requests in development
  async headers() {
    return [
      {
        source: '/api/keystatic/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
