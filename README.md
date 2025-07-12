# Personal Portfolio Website V2 🚀

Live at [akshaygupta.live](https://akshaygupta.live)

## 🛠️ Tech Stack

- **Next.js 15** & **React 19**
- **TypeScript** & **Sass**
- **TanStack Form** & **Zod** validation
- **Web Audio API** for music player
- **Drizzle ORM** & **Neon Database**
- **Sanity CMS** for blog content
- **AWS S3 + CloudFront** for music streaming
- **Upstash Redis** for rate limiting
- **Resend** for email delivery

## ✨ Features

- 🌃 **Dark/Light Theme** with smooth transitions
- 📝 **Blog with CMS** powered by Sanity:
  - Reading Progress Bar with real-time tracking
  - Estimated Reading Time calculation
  - Smart Category Overflow with "+n" indicators
  - Emoji Reactions system
- 📧 **Contact Form** with validation and rate limiting
- 🎵 **Music Player** with Web Audio API:
  - Real-time waveform visualization
  - AWS S3 + CloudFront streaming
  - Queue management with drag & drop
  - Touch gestures and keyboard controls
  - Mobile-optimized interface

## 🚀 Quick Start

Create `.env.local`:

```env
# Email service (Required)
RESEND_API_KEY=your_key_here

# Sanity CMS (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_HOOK_SECRET=your_secret_here
# Optional: defaults to 2024-09-25 if not set
NEXT_PUBLIC_SANITY_API_VERSION=2024-09-25

# Neon Database (Required for emoji reactions)
DATABASE_URL=your_neon_database_url_here

# AWS S3 + CloudFront (Required for music player)
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NEXT_PUBLIC_AWS_BUCKET_NAME=your_s3_bucket_name
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your_cloudfront_domain
NEXT_PUBLIC_CLOUDFRONT_KEY_PAIR_ID=your_cloudfront_key_pair_id
NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY=your_cloudfront_private_key

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_measurement_id
NEXT_PUBLIC_CLARITY_APP_CODE=your_clarity_app_code

# Rate limiting (Optional - falls back to in-memory if not set)
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token

# Base URL (Optional - defaults to localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Setup Steps

1. **Database**: Create a Neon PostgreSQL database
2. **Storage**: Set up AWS S3 + CloudFront for music files
3. **Services**: Configure Resend, Upstash Redis (optional)
4. **Run migrations**: `pnpm db:migrate`
5. **Start development**:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

**Contact**: [contact@akshaygupta.live](mailto:contact@akshaygupta.live) | [akshaygupta.live@gmail.com](mailto:akshaygupta.live@gmail.com)

Made with ❤️ by Akshay Gupta
