# Personal Portfolio Website V2 🚀

[![Netlify Status](https://api.netlify.com/api/v1/badges/05e288a4-4c16-468a-b42d-5bb8c2cdf6fd/deploy-status)](https://app.netlify.com/sites/akshay-portfolio-v2/deploys)

> "Why did the developer go broke? Because he used up all his cache!" 

Live at [akshaygupta.live](https://akshaygupta.live) - Where code meets creativity, and bugs come to die.

## 🛠️ Tech Stack

Because one framework is never enough:

* React 19 (Because 18 was so last year)
* Next.js 15 (Making SEO great again!)
* TypeScript (JavaScript with a safety helmet)
* Sass (CSS with superpowers)
* Bootstrap 5 (For when you need to look good fast)
* FontAwesome (Icons that speak louder than words)
* Web Audio API (Making waves, literally!)

### 🌟 Special Ingredients

* [Resend](https://resend.com) - For emails that actually reach inboxes
* [Sanity.io](https://www.sanity.io) - Where my blog posts live their best life
* [Dropbox SDK](https://github.com/dropbox/dropbox-sdk-js) - Because cloud storage is cooler than local
* Custom Audio Player - Like Spotify, but with more bugs (kidding!)

## ✨ Features

> "It's not a bug, it's an undocumented feature!"

* 🌓 Dark/Light theme (For both vampires and humans)
* 📝 Blog with CMS (Because WordPress is too mainstream)
* 📧 Contact form (Spam bots, please ignore)
* 🎵 Audio Player Extraordinaire:
  * Waveform visualization (It's not just a line, it's art!)
  * Mini visualizer (Like a disco ball for your ears)
  * Dropbox streaming (Cloud-powered tunes)
  * Smart metadata parsing (It reads file names better than I read documentation)
  * Volume control (For when your neighbors complain)
  * Keyboard controls (For the mouse-averse)

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` with these magical incantations:
```env
RESEND_API_KEY=your_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_HOOK_SECRET=your_secret_here
NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN=your_token_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Audio Files Setup 🎵

1. Create a Dropbox app at [Dropbox App Console](https://www.dropbox.com/developers/apps)
   > Warning: May require coffee ☕
2. Get an access token with these permissions:
   * `files.metadata.read` (For peeking at your files)
   * `files.content.read` (For actually using them)
3. Name your audio files like this:
   ```
   [Year][Original Artist][Name][Type][Artist].mp3
   Example: [2024][The Beatles][Hey Jude][Remix][A-Shay].mp3
   ```
   > Pro tip: The brackets are important. Very important.

### 3. Fire It Up! 🔥

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

* Optimized chunk splitting (Because loading the entire internet isn't cool)
* Aggressive caching (Time travelers welcome)
* Image optimization with next/image (Making images light as a feather)
* CSP headers (Keeping the bad guys out)
* Custom error handling (Because errors deserve love too)

## 🧪 Under The Hood

* Web Audio API for real-time audio visualization
* React Suspense for smooth loading states
* Custom hooks for audio playback and visualization
* TypeScript for catching bugs before they catch you
* SCSS modules for style organization
* Responsive design (Works on everything except your grandma's flip phone)

## 🔄 Version History

You can check out the older version built with Gatsby at [portfolio v1](https://github.com/gupta-akshay/portfolio) (Warning: Contains legacy code and nostalgia)

---

> "Why do programmers prefer dark mode? Because light attracts bugs!" 

Drop me a line at [contact@akshaygupta.live](contact@akshaygupta.live) or [akshaygupta.live@gmail.com](akshaygupta.live@gmail.com) if you:
- Found a bug (it's a feature)
- Have a suggestion (I promise to read it)
- Just want to say hi (I like those too!)

Made with ❤️ and excessive amounts of caffeine by Akshay Gupta
