import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

const nextConfig = {
  // Configure pageExtensions to include MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactCompiler: true,
  experimental: {
    optimizeServerReact: true,
    serverMinification: true,
    optimizePackageImports: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
      'bootstrap',
      'devicon',
      'react-hot-toast',
      'resend',
      'typed.js',
      'zod',
    ],
  },

  // Turbopack configuration
  turbopack: {},

  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ['legacy-js-api'],
  },

  images: {
    remotePatterns: [
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms https://www.googletagmanager.com https://cdnjs.buymeacoffee.com https://*.buymeacoffee.com https://va.vercel-scripts.com https://vercel.live https://scripts.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://vercel.live",
              "img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://*.netlify.com https://*.s3.amazonaws.com https://*.cloudfront.net https://*.clarity.ms https://*.bing.com https://www.google-analytics.com https://akshaygupta.live https://cdn.buymeacoffee.com https://*.buymeacoffee.com https://www.googletagmanager.com https://vercel.live https://vercel.com",
              "font-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://vercel.live https://assets.vercel.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "frame-src 'self' https://www.google.com https://app.netlify.com https://vercel.live",
              "connect-src 'self' https://*.netlify.com https://*.s3.amazonaws.com https://*.s3.ap-south-1.amazonaws.com https://*.cloudfront.net https://*.clarity.ms https://www.google-analytics.com https://www.googletagmanager.com https://github-contributions-api.jogruber.de https://vercel.live wss://ws-us3.pusher.com https://*.ingest.sentry.io",
              "media-src 'self' blob: https://*.s3.amazonaws.com https://*.s3.ap-south-1.amazonaws.com https://*.cloudfront.net",
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

// MDX configuration with plugins
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-gfm', // GitHub Flavored Markdown (tables, strikethrough, etc.)
    ],
    rehypePlugins: [
      'rehype-slug', // Add IDs to headings for TOC
      ['rehype-prism-plus', { ignoreMissing: true }], // Syntax highlighting
    ],
  },
});

export default withSentryConfig(withMDX(withBundleAnalyzer(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'akshaygupta',

  project: 'personal-portfolio',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Ignore Next.js internal files that don't have source maps
  sourcemaps: {
    ignore: ['**/node_modules/**', '**/*_client-reference-manifest.js', '**/*-manifest.js'],
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
