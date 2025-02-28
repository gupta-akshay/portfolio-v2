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
- [Dropbox SDK](https://github.com/dropbox/dropbox-sdk-js) - Because cloud storage is cooler than local
- Custom Audio Player - Like Spotify, but with more bugs (kidding!)

## ✨ Features

> "It's not a bug, it's an undocumented feature!"

- 🌃 Dark/Light theme (For both vampires and humans)
- 📝 Blog with CMS (Because WordPress is too mainstream)
- 📧 Contact form (Spam bots, please ignore)
- 🎵 Audio Player Extraordinaire:
  - Waveform visualization (It's not just a line, it's art!)
  - Mini visualizer (Like a disco ball for your ears)
  - Dropbox streaming (Cloud-powered tunes)
  - Smart metadata parsing (It reads file names better than I read documentation)
  - Volume control (For when your neighbors complain)
  - Keyboard controls (For the mouse-averse)

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` with these magical incantations:

```env
RESEND_API_KEY=your_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_HOOK_SECRET=your_secret_here
NEXT_PUBLIC_DROPBOX_API_KEY=your_dropbox_app_key
NEXT_PUBLIC_DROPBOX_API_SECRET=your_dropbox_app_secret
NEXT_PUBLIC_DROPBOX_REFRESH_TOKEN=your_dropbox_refresh_token
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

1. Create a Dropbox app at [Dropbox App Console](https://www.dropbox.com/developers/apps)
   > Warning: May require coffee ☕
2. Set up your Dropbox app:
   - Create a new app with 'App folder' access
   - Add these permissions:
     - `files.metadata.read` (For peeking at your files)
     - `files.content.read` (For actually using them)
   - Set up OAuth:
     - Add `http://localhost:3000/api/dropbox/callback` and `https://{YOUR_DOMAIN}/api/dropbox/callback` as redirect URIs in your Dropbox app settings.
     - Copy your app key and secret to the respective env variables.
   - Get your refresh token using Dropbox OAuth API:
     - Make a request to `https://www.dropbox.com/oauth2/authorize` with the required parameters including `token_access_type=offline`:

       ```bash
       https://www.dropbox.com/oauth2/authorize?
       client_id=YOUR_APP_KEY&
       response_type=code&
       redirect_uri=YOUR_REGISTERED_REDIRECT_URI&
       token_access_type=offline
       ```

     - After user authorization, Dropbox will redirect to your specified `redirect_uri` with an authorization code.
     - Exchange the authorization code for a refresh token by making a POST request to `https://api.dropbox.com/oauth2/token`:

       ```bash
       curl -X POST https://api.dropbox.com/oauth2/token \
            -d grant_type=authorization_code \
            -d code=YOUR_AUTHORIZATION_CODE \
            -d client_id=YOUR_APP_KEY \
            -d client_secret=YOUR_APP_SECRET \
            -d redirect_uri=YOUR_REGISTERED_REDIRECT_URI
       ```

     - The response will include `refresh_token`. Store it in `.env.local` under `NEXT_PUBLIC_DROPBOX_REFRESH_TOKEN`.
   > For more details, refer to [Dropbox API documentation](https://www.dropbox.com/developers/documentation/http/documentation).

### About Refresh Tokens 🔄

Your refresh token is a long-lived credential that:

- Never expires unless explicitly revoked in Dropbox
- Automatically handles access token renewal
- Keeps your music player working indefinitely

The flow works like this:

1. Access tokens expire after a few hours.
2. Your app automatically uses the refresh token to get new access tokens.
3. This process continues indefinitely without any manual intervention.

You only need to update the refresh token if:

- You explicitly revoke it in Dropbox.
- You create a new Dropbox app.
- There's a security breach requiring token rotation.

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
