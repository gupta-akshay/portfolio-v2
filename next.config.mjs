/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  experimental: {
    // optimizeCss: true, // Removed because it was using critters package, which is not maintained anymore.
    optimizeServerReact: true,
    serverMinification: true,
    optimizePackageImports: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
      '@portabletext/react',
      '@sanity/code-input',
      '@sanity/icons',
      '@sanity/image-url',
      '@sanity/vision',
      'bootstrap',
      'devicon',
      'react-hot-toast',
      'react-syntax-highlighter',
      'resend',
      'sanity',
      'next-sanity',
      'typed.js',
      'zod',
    ],
  },

  // Turbopack configuration
  turbopack: {
  },

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
      {
        protocol: 'https',
        hostname: 'akshaygupta.live',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src * data: blob:;",
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms https://www.googletagmanager.com https://cdnjs.buymeacoffee.com https://*.buymeacoffee.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: blob: https://cdn.sanity.io https://*.google.com https://*.googleapis.com https://*.netlify.com https://*.s3.amazonaws.com https://*.cloudfront.net https://*.clarity.ms https://*.bing.com https://www.google-analytics.com https://akshaygupta.live https://cdn.buymeacoffee.com https://*.buymeacoffee.com",
              "font-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "frame-src 'self' https://www.google.com https://app.netlify.com",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://*.netlify.com https://*.s3.amazonaws.com https://*.s3.ap-south-1.amazonaws.com https://*.cloudfront.net https://*.clarity.ms https://www.google-analytics.com https://www.googletagmanager.com https://github-contributions-api.jogruber.de",
              "media-src 'self' blob: https://*.s3.amazonaws.com https://*.s3.ap-south-1.amazonaws.com https://*.cloudfront.net",
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
            value: 'camera=(), microphone=(), geolocation=()',
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
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
