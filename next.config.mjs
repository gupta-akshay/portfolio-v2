/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? // Development CSP
                [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google.com https://*.googleapis.com",
                  "font-src 'self'",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'none'",
                  "frame-src 'self' https://www.google.com",
                  "connect-src 'self' https://cdn.sanity.io https://*.sanity.io ws: wss:",
                  'block-all-mixed-content',
                  'upgrade-insecure-requests',
                ].join('; ')
              : // Production CSP
                [
                  "default-src 'self'",
                  "script-src 'self' 'nonce-NONCE' https: http: 'strict-dynamic'",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google.com https://*.googleapis.com",
                  "font-src 'self'",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'none'",
                  "frame-src 'self' https://www.google.com",
                  "connect-src 'self' https://cdn.sanity.io https://*.sanity.io ws: wss:",
                  'block-all-mixed-content',
                  'upgrade-insecure-requests',
                ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
