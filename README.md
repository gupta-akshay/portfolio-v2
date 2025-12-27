# Personal Portfolio Website V2 🚀

Live at [akshaygupta.live](https://akshaygupta.live)

## 🛠️ Tech Stack

- **Next.js 16** & **React 19** with React Compiler
- **TypeScript** & **Sass**
- **MDX** for blog content with full SSR support
- **TanStack Form** & **Zod** validation
- **Web Audio API** for music player
- **Drizzle ORM** & **Neon Database**
- **AWS S3 + CloudFront** for music streaming
- **Resend** for email delivery
- **Sentry** for error tracking & performance monitoring
- **Vercel Analytics** & **Speed Insights**
- **Google Analytics** & **Microsoft Clarity**

## ✨ Features

- 🌃 **Dark/Light Theme** with smooth transitions
- 🖱️ **Custom Cursor System** with motion animations:
  - Interactive hover states with contextual text
  - Smooth animations with spring physics
  - Accessibility-first design (hidden on mobile/touch)
  - Mix-blend-mode effects for visibility across backgrounds
  - Comprehensive cursor interactions across all interactive elements
- 📝 **MDX-powered Blog** with full SSR:
  - Blog posts as `.mdx` files in `content/blog/`
  - GitHub Flavored Markdown (tables, strikethrough, etc.)
  - Syntax highlighting with Prism (Dracula theme)
  - Table of Contents with active section highlighting
  - Reading Progress Bar with real-time tracking
  - Accurate Reading Time from actual content
  - Smart Category Overflow with "+n" indicators
  - Emoji Reactions system
  - Social Share buttons
  - Static generation with `generateStaticParams`
- 📧 **Contact Form** with validation and rate limiting
- 🎵 **Music Player** with Web Audio API:
  - Real-time waveform visualization
  - AWS S3 + CloudFront streaming
  - Queue management with drag & drop
  - Touch gestures and keyboard controls
  - Mobile-optimized interface
- 📊 **GitHub Contribution Calendar** on about page
- 🗺️ **Interactive Map** section
- 🔗 **Dynamic OpenGraph Images** per page

## 🏗️ Architecture

- **Server-Side Rendering (SSR)** with Next.js App Router
- **Client-Server Component Separation** for optimal performance
- **React Compiler** for automatic optimizations
- **MDX Integration** via `@next/mdx` with remark/rehype plugins
- **Metadata Support** for SEO while maintaining interactivity
- **Custom Hooks** for cursor interactions and state management
- **Context-based State Management** for theme and cursor states
- **Performance Optimized** with React 19 features and best practices
- **Bundle Analysis** with `@next/bundle-analyzer`

## 📝 Blog System (MDX)

Blog posts are stored as `.mdx` files in `content/blog/`. Each post exports a `metadata` object:

```mdx
export const metadata = {
  title: 'Your Blog Title',
  slug: 'your-blog-slug',
  publishedAt: '2025-01-15',
  categories: ['category1', 'category2'],
  coverImage: '/images/blog/your-cover.jpg',
  coverImageAlt: 'Description of cover image',
  author: {
    name: 'Akshay Gupta',
    avatar: '/images/blog-author.png',
  },
  excerpt: 'A short description of your blog post.',
};

## Your Content Here

Write your markdown content with full MDX support!
```

### MDX Features

- **Syntax Highlighting**: Code blocks with Prism.js (Dracula theme)
- **GitHub Flavored Markdown**: Tables, strikethrough, task lists
- **Automatic Heading IDs**: For Table of Contents navigation
- **React Components**: Embed custom components in markdown
- **Image Optimization**: Lazy loading with responsive sizing

## 📈 Observability & Monitoring

- **Sentry** - Error tracking, performance monitoring, and session replay
  - Server, client, and edge runtime instrumentation
  - Custom error boundaries with `global-error.tsx`
  - Source map uploads for debugging
  - Ad-blocker circumvention via `/monitoring` tunnel route
- **Vercel Analytics** - Core web vitals and page views
- **Vercel Speed Insights** - Real user performance metrics
- **Google Analytics** - Traffic and user behavior tracking
- **Microsoft Clarity** - Session recordings and heatmaps

## 🔒 Security

Comprehensive security headers configured in `next.config.mjs`:

- **Content Security Policy (CSP)** - Strict script/style/resource policies
- **HSTS** - HTTP Strict Transport Security with preload
- **X-Frame-Options** - Clickjacking protection
- **X-Content-Type-Options** - MIME type sniffing prevention
- **Referrer-Policy** - Strict origin referrer control
- **Permissions-Policy** - Camera, microphone, geolocation disabled

## 🔍 SEO & PWA

- **Dynamic Sitemap** - Auto-generated from MDX blog posts (`/sitemap.xml`)
- **Robots.txt** - Search engine crawling rules (`/robots.txt`)
- **Web App Manifest** - PWA support with standalone display
- **Dynamic OpenGraph Images** - Generated per page for rich social previews
- **Structured Metadata** - Title templates, keywords, Twitter cards

## 🚀 CI/CD & Deployment

- **GitHub Actions** - Automated deployment to Fly.io on push to `main`
- **Docker** - Containerized SSH terminal server
- **Fly.io** - Terminal resume hosting with persistent volumes

## 🎮 Easter Eggs

Hidden interactive features for curious visitors:

- **Konami Code** (`↑↑↓↓←→←→BA`) - Activates Matrix Rain effect
- **Disco Mode** - Click logo rapidly (5x) for party lights
- **Developer Console** - Type "dev" on blog pages for terminal effect
- **Hints System** - Periodic hints with activation instructions
- Desktop-only (disabled on mobile for performance)

## 🚀 Quick Start

Create `.env.local`:

```env
# Email service (Required)
RESEND_API_KEY=your_key_here

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

# Sentry (Optional - for error tracking)
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Base URL (Optional - defaults to localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Setup Steps

1. **Database**: Create a Neon PostgreSQL database
2. **Storage**: Set up AWS S3 + CloudFront for music files
3. **Services**: Configure Resend for emails
4. **Run migrations**: `pnpm db:migrate`
5. **Start development**:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Drizzle Studio GUI |
| `pnpm terminal:ssh` | Start SSH terminal server |
| `ANALYZE=true pnpm build` | Build with bundle analyzer |

## 🖥️ Terminal Resume over SSH

You can now expose a terminal-native version of the resume via SSH (similar to `terminal.shop`).

When browsers hit `ssh.akshaygupta.live`, a lightweight HTTP helper (served from `terminal/server.ts`) returns guidance to run `ssh ssh.akshaygupta.live` plus a link back to `https://akshaygupta.live`. Point your reverse proxy's HTTP traffic to `TERMINAL_HTTP_PORT` so visitors always see friendly instructions.

### Local preview

```bash
# Generate a host key once (keep it outside version control)
ssh-keygen -t ed25519 -f ~/.ssh/akshay_terminal_host -N ""

# Run the SSH server on port 2222
TERMINAL_SSH_HOST_KEY=~/.ssh/akshay_terminal_host pnpm terminal:ssh
```

Connect from another terminal:

```bash
ssh -p 2222 localhost
```

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `TERMINAL_SSH_HOST_KEY` | Absolute/relative path to an Ed25519 host key | *Ephemeral key generated at runtime* |
| `TERMINAL_SSH_PORT` | SSH port to listen on | `2222` |
| `TERMINAL_SSH_HOST` | SSH interface to bind | `0.0.0.0` |
| `TERMINAL_HTTP_PORT` | HTTP helper port for browsers | `8080` |
| `TERMINAL_HTTP_HOST` | HTTP helper interface to bind | `0.0.0.0` |

### Deploying to `ssh.akshaygupta.live`

1. Provision a lightweight VM/container (Fly.io, Railway, Hetzner, etc.).
2. Copy `.env` variables and keep `akshay-cv.pdf` in `public/assets`.
3. Build the Next.js site as usual (or skip if you only need the SSH process).
4. Start the SSH server (systemd example):

```ini
[Unit]
Description=Akshay Terminal Resume
After=network.target

[Service]
WorkingDirectory=/var/www/portfolio-v2
Environment=TERMINAL_SSH_HOST_KEY=/var/www/keys/terminal_host_ed25519
Environment=TERMINAL_SSH_PORT=22
ExecStart=/usr/bin/pnpm terminal:ssh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

5. Add an `A` record for `ssh.akshaygupta.live` (or the root domain if you want `ssh akshaygupta.live`) pointing to the VM. Route HTTP (ports 80/443) through your proxy to the helper server so browsers hitting the subdomain see instructions to use SSH or visit the main site.
6. (Optional) If your primary SSH access already uses port 22, expose this service on another port (e.g., 2222) and instruct users to run `ssh -p 2222 ssh.akshaygupta.live`.

The terminal UI reads structured data from `terminal/resumeData.ts`, which mirrors `public/assets/akshay-cv.pdf`. Update this file whenever the PDF changes to keep both sources consistent.

### Example: Fly.io + Cloudflare

1. **Bootstrap the app**  
   ```bash
   fly launch --no-deploy
   ```
   Fly will generate `fly.toml` pointing to the Dockerfile that ships the SSH server.

2. **Provision persistent storage for the host key**  
   ```bash
   fly volumes create keys_volume --size 1 --region bom
   ```
   (Pick the same region you deploy in; 1 GB is plenty.)

3. **Configure secrets/env**  
   ```bash
   fly secrets set TERMINAL_SSH_HOST_KEY=/app/keys/terminal_host_ed25519
   ```
   The Docker entrypoint will create that file on first boot if it's missing. `TERMINAL_SSH_PORT` defaults to `2222`, so the daemon listens on `0.0.0.0:2222` inside the container.

4. **Deploy**  
   ```bash
   fly deploy
   fly logs # watch it generate the key + start the server
   ```
   After the first successful boot the machine keeps the host key on the mounted volume.

5. **Allocate IPs and wire DNS**  
   ```bash
   fly ips allocate-v4
   fly ips list
   ```
   In Cloudflare, add an `A` record for `ssh.akshaygupta.live` → the Fly IPv4. **Disable the proxy (gray cloud)** so raw SSH reaches Fly.

6. **Test**  
   ```bash
   ssh -p 2222 ssh.akshaygupta.live
   ```
   (If you reconfigure the port, mirror it in both `TERMINAL_SSH_PORT` and your SSH command.)

Troubleshooting tips:
- `fly machine logs <id>` shows entrypoint errors (missing volume, host key path, etc.).
- `fly console ssh` lets you inspect `/app/keys/terminal_host_ed25519`.
- If the proxy reports "connection refused," confirm the process is still running (`fly machines list`) and that it's bound to `0.0.0.0:$TERMINAL_SSH_PORT`.

---

## 📫 Contact

- Email: [contact@akshaygupta.live](mailto:contact@akshaygupta.live) or [akshaygupta.live@gmail.com](mailto:akshaygupta.live@gmail.com)
- Portfolio: [akshaygupta.live](https://akshaygupta.live)

Made with ❤️ by Akshay Gupta
