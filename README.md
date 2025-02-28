# Personal Portfolio Website V2 🚀

> "Why did the developer go broke? Because he used up all his cache!"

Live at [akshaygupta.live](https://akshaygupta.live) - Where code meets creativity, and bugs come to die.

## 🛠️ Tech Stack

Because one framework is never enough:

- React 19 (Because 18 was so last year)
- Next.js 15 (Making SEO great again!)
- TypeScript (JavaScript with a safety helmet)
- Sass (CSS with superpowers)
- Bootstrap 5 (For when you need to look good fast)
- FontAwesome (Icons that speak louder than words)
- Web Audio API (Making waves, literally!)

### 🌟 Special Ingredients

- [Resend](https://resend.com) - For emails that actually reach inboxes
- [Sanity.io](https://www.sanity.io) - Where my blog posts live their best life
- [AWS S3](https://aws.amazon.com/s3/) - For reliable and scalable music storage
- [AWS CloudFront](https://aws.amazon.com/cloudfront/) - Making music streaming fast worldwide
- Custom Audio Player - Like Spotify, but with more bugs (kidding!)

## ✨ Features

> "It's not a bug, it's an undocumented feature!"

- 🌃 Dark/Light theme (For both vampires and humans)
- 📝 Blog with CMS (Because WordPress is too mainstream)
- 📧 Contact form (Spam bots, please ignore)
- 🎵 Audio Player Extraordinaire:
  - Waveform visualization (It's not just a line, it's art!)
  - Mini visualizer (Like a disco ball for your ears)
  - AWS S3 + CloudFront streaming (Global CDN-powered tunes)
  - Smart metadata parsing (It reads file names better than I read documentation)
  - Volume control (For when your neighbors complain)
  - Keyboard controls (For the mouse-averse)
  - Mobile-optimized UI:
    - Swipe gestures (Up to expand, Down to minimize)
    - Mini player with scrolling track names
    - Fullscreen mode with touch-friendly controls
    - Responsive visualizations
    - Auto-adjusting layout for different screen sizes

## 📸 Screenshots

### 🖥️ Desktop View

#### Home Page

![Home Page](screenshots/desktop/home.png)

#### About Section

![About 1](screenshots/desktop/about-1.png) | ![About 2](screenshots/desktop/about-2.png)
:-------------------------:|:-------------------------:

#### Blog Section

![Blog 1](screenshots/desktop/blog-1.png) | ![Blog 2](screenshots/desktop/blog-2.png)
:-------------------------:|:-------------------------:

#### Music Section

![Music 1](screenshots/desktop/music-1.png) | ![Music 2](screenshots/desktop/music-2.png)
:-------------------------:|:-------------------------:

#### Contact Page

![Contact Page](screenshots/desktop/contact.png)

### 📱 Mobile View

![Home](screenshots/mobile/home.png) | ![About 1](screenshots/mobile/about-1.png) | ![About 2](screenshots/mobile/about-2.png) | ![Blog 1](screenshots/mobile/blog-1.png)
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![Blog 2](screenshots/mobile/blog-2.png) | ![Music 1](screenshots/mobile/music-1.png) | ![Music 2](screenshots/mobile/music-2.png) | ![Contact](screenshots/mobile/contact.png)

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` with these magical incantations:

```env
RESEND_API_KEY=your_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_HOOK_SECRET=your_secret_here
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NEXT_PUBLIC_AWS_BUCKET_NAME=your_s3_bucket_name
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your_cloudfront_domain
NEXT_PUBLIC_CLOUDFRONT_KEY_PAIR_ID=your_cloudfront_key_pair_id
NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY=your_cloudfront_private_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_measurement_id
NEXT_PUBLIC_CLARITY_APP_CODE=your_clarity_app_code
```

### 2. Analytics Setup 📊

This project uses Google Analytics and Microsoft Clarity for basic usage analytics:

1. **Google Analytics**:
   - Create a GA4 property at [Google Analytics](https://analytics.google.com)
   - Get your Measurement ID (starts with 'G-')
   - Add it to `.env.local` as `NEXT_PUBLIC_GOOGLE_ANALYTICS`

2. **Microsoft Clarity**:
   - Create a project at [Microsoft Clarity](https://clarity.microsoft.com)
   - Get your tracking code
   - Add it to `.env.local` as `NEXT_PUBLIC_CLARITY_APP_CODE`

> Note: These analytics tools are used solely to understand usage patterns and improve user experience. No personal data is collected or processed beyond standard analytics metrics.

### 3. Audio Files Setup 🎵

1. Create an S3 bucket:
   - Go to AWS Console → S3
   - Create a new bucket
   - Block all public access (for security)
   - Enable CORS for your domains

2. Set up CloudFront (Optional but recommended):
   - Create a CloudFront distribution
   - Use your S3 bucket as origin
   - Set up Origin Access Identity (OAI)
   - Create a CloudFront key pair for signed URLs
   - Configure your bucket policy to allow CloudFront access

3. Create an IAM user:
   - Create a user with programmatic access
   - Attach a policy with these permissions:

     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Action": [
                     "s3:ListBucket",
                     "s3:GetObject"
                 ],
                 "Resource": [
                     "arn:aws:s3:::your-bucket-name",
                     "arn:aws:s3:::your-bucket-name/*"
                 ]
             }
         ]
     }
     ```

4. Configure CORS for your S3 bucket:

   ```json
   [
       {
           "AllowedOrigins": [
               "http://localhost:3000",
               "https://your-domain.com"
           ],
           "AllowedMethods": ["GET", "HEAD"],
           "AllowedHeaders": ["*"],
           "ExposeHeaders": ["ETag"],
           "MaxAgeSeconds": 3600
       }
   ]
   ```

### 4. Audio File Naming 🎵

Name your audio files like this:

```text
[Year][Original Artist][Name][Type][Artist].mp3
Example: [2024][The Beatles][Hey Jude][Remix][A-Shay].mp3
```

> Pro tip: The brackets are important. Very important.

### 5. Fire It Up! 🔥

```bash
npm run dev
# or
yarn dev    # For the yarn enthusiasts
# or
pnpm dev    # For the storage optimizers
# or
bun dev     # For the cool kids
```

Then visit [http://localhost:3000](http://localhost:3000) and marvel at your creation.

## 🎯 Performance Features

- Optimized chunk splitting (Because loading the entire internet isn't cool)
- Aggressive caching (Time travelers welcome)
- Image optimization with next/image (Making images light as a feather)
- CSP headers (Keeping the bad guys out)
- Custom error handling (Because errors deserve love too)

## 🧬 Under The Hood

- Web Audio API for real-time audio visualization
- React Suspense for smooth loading states
- Custom hooks for audio playback and visualization
- TypeScript for catching bugs before they catch you
- SCSS modules for style organization
- Responsive design (Works on everything except your grandma's flip phone)

## 🔄 Version History

You can check out the older version built with Gatsby at [portfolio v1](https://github.com/gupta-akshay/portfolio) (Warning: Contains legacy code and nostalgia)

---

> "Why do programmers prefer dark mode? Because light attracts bugs!"

Drop me a line at [contact@akshaygupta.live](contact@akshaygupta.live) or [akshaygupta.live@gmail.com](akshaygupta.live@gmail.com) if you:

- Found a bug (it's a feature)
- Have a suggestion (I promise to read it)
- Just want to say hi (I like those too!)

Made with ❤️ and excessive amounts of caffeine by Akshay Gupta
