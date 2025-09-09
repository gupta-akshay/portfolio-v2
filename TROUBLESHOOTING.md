# Troubleshooting Guide 🔧

> This is a completely AI generated file

This guide covers common issues and their solutions for the Portfolio V2 project.

## 🚨 Quick Fixes

### Common Commands
```bash
# Clear everything and start fresh
rm -rf .next node_modules .turbo
pnpm install
pnpm dev

# Check for TypeScript errors
pnpm type-check

# Fix linting issues
pnpm lint:fix

# Analyze bundle size
pnpm analyze
```

## 🔧 Build Issues

### 1. Build Fails with TypeScript Errors

**Error:**
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions:**
```bash
# Check TypeScript configuration
pnpm type-check

# Update types
pnpm add -D @types/node @types/react @types/react-dom

# Clear TypeScript cache
rm -rf .next/types
```

### 2. Out of Memory During Build

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### 3. Module Not Found Errors

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solutions:**
```bash
# Check tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Restart development server
pnpm dev
```

## 🎵 Audio Player Issues

### 1. Audio Files Not Loading

**Symptoms:**
- Player shows loading state indefinitely
- No audio playback
- Console errors about CORS

**Solutions:**

1. **Check S3 CORS Configuration:**
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

2. **Verify Environment Variables:**
```bash
# Check if all AWS variables are set
echo $NEXT_PUBLIC_AWS_ACCESS_KEY_ID
echo $NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
echo $NEXT_PUBLIC_AWS_BUCKET_NAME
echo $NEXT_PUBLIC_AWS_REGION
```

3. **Test CloudFront Configuration:**
```bash
# Check if CloudFront private key is properly formatted
echo $NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY | base64 -d
```

### 2. Web Audio API Not Working

**Symptoms:**
- No visualizations
- Audio plays but no waveform
- Console errors about AudioContext

**Solutions:**

1. **Check Browser Support:**
```javascript
// Add to your component
useEffect(() => {
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.error('Web Audio API not supported');
  }
}, []);
```

2. **Handle User Interaction Requirement:**
```javascript
// Ensure AudioContext is resumed after user interaction
const handleFirstInteraction = async () => {
  if (audioContextRef.current?.state === 'suspended') {
    await audioContextRef.current.resume();
  }
};

document.addEventListener('click', handleFirstInteraction, { once: true });
```

### 3. Audio Playback Issues on Mobile

**Symptoms:**
- Audio doesn't play on iOS/Android
- Playback stops unexpectedly
- Volume controls don't work

**Solutions:**

1. **Add Required Audio Attributes:**
```jsx
<audio
  ref={audioRef}
  preload="auto"
  crossOrigin="anonymous"
  playsInline
  x-webkit-airplay="allow"
  webkit-playsinline="true"
  x-webkit-playsinline="true"
/>
```

2. **Handle iOS Audio Restrictions:**
```javascript
// Ensure audio is muted initially on iOS
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.muted = true;
    // Unmute after user interaction
  }
}, []);
```

## 📝 Contact Form Issues

### 1. Form Submission Fails

**Error:**
```
429 Too Many Requests
```

**Solutions:**

1. **Check Rate Limiting:**
```bash
# Verify Redis connection
curl -X GET "https://your-redis-url/ping" \
  -H "Authorization: Bearer your-token"
```

2. **Clear Rate Limit (Development):**
```bash
# Reset Redis rate limit key
redis-cli DEL "rate_limit:127.0.0.1:*"
```

### 2. Email Not Sending

**Symptoms:**
- Form submits successfully but no emails received
- Resend API errors

**Solutions:**

1. **Verify Resend Configuration:**
```bash
# Test Resend API key
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from": "test@yourdomain.com", "to": ["test@example.com"], "subject": "Test", "text": "Test"}'
```

2. **Check Email Templates:**
```typescript
// Verify merge fields are properly replaced
console.log(replaceMergeFields({
  messageString: userHtmlString,
  mergeFields: { name: 'Test User' }
}));
```

## 🎨 Styling Issues

### 1. SCSS Not Compiling

**Error:**
```
Sass error: @use rules must be written before any other rules
```

**Solutions:**

1. **Check SCSS Import Order:**
```scss
// ✅ Correct order
@use './variables' as *;
@use './mixins' as *;

// Rest of the styles...

// ❌ Wrong order
.some-class {
  color: red;
}
@use './variables' as *; // This will fail
```

2. **Update Sass Version:**
```bash
pnpm add -D sass@latest
```

### 2. CSS Not Loading in Production

**Symptoms:**
- Styles work in development but not in production
- Missing CSS classes

**Solutions:**

1. **Check Build Output:**
```bash
# Verify CSS is being generated
ls -la .next/static/css/
```

2. **Verify Import Paths:**
```typescript
// Ensure proper CSS imports in layout.tsx
import 'bootstrap/dist/css/bootstrap.css';
import './styles/globals.scss';
```

## 📱 Mobile Issues

### 1. Touch Events Not Working

**Symptoms:**
- Swipe gestures don't work
- Touch interactions are unresponsive

**Solutions:**

1. **Add Touch Event Handlers:**
```typescript
const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault(); // Prevent default behavior
  // Handle touch start
};

// Add passive: false for preventDefault to work
element.addEventListener('touchstart', handleTouchStart, { passive: false });
```

2. **Check CSS Touch Actions:**
```scss
.touch-element {
  touch-action: manipulation; // Enable touch interactions
}
```

### 2. Viewport Issues

**Symptoms:**
- Layout breaks on mobile devices
- Zoom behavior is incorrect

**Solutions:**

1. **Check Viewport Meta Tag:**
```typescript
// In layout.tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
```

2. **CSS Viewport Units:**
```scss
// Use dvh instead of vh for mobile
.full-height {
  height: 100dvh; // Dynamic viewport height
}
```

## 🔍 Performance Issues

### 1. Slow Page Loads

**Symptoms:**
- Long Time to First Byte (TTFB)
- Large bundle sizes
- Slow image loading

**Solutions:**

1. **Analyze Bundle Size:**
```bash
pnpm analyze
# Check for large dependencies
```

2. **Optimize Images:**
```typescript
// Use next/image with proper sizing
<Image
  src="/image.jpg"
  alt="Description"
  width={600}
  height={400}
  priority // For above-the-fold images
  placeholder="blur"
/>
```

3. **Implement Code Splitting:**
```typescript
// Dynamic imports for heavy components
const AudioPlayer = dynamic(() => import('./AudioPlayer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 2. Memory Leaks

**Symptoms:**
- Browser tab uses excessive memory
- Performance degrades over time
- Audio crackling

**Solutions:**

1. **Clean Up Audio Context:**
```typescript
useEffect(() => {
  return () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
}, []);
```

2. **Remove Event Listeners:**
```typescript
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## 🔐 Security Issues

### 1. Content Security Policy Violations

**Error:**
```
Refused to load the script because it violates the following Content Security Policy directive
```

**Solutions:**

1. **Update CSP Headers:**
```typescript
// next.config.mjs
const cspHeader = `
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-domain.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
`;
```

2. **Use Nonce for Inline Scripts:**
```typescript
// For dynamic scripts, use nonce-based CSP
```

### 2. CORS Errors

**Error:**
```
Access to fetch at 'api-url' from origin 'localhost:3000' has been blocked by CORS policy
```

**Solutions:**

1. **Configure CORS in API Routes:**
```typescript
// app/api/route.ts
export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

## 🛠️ Development Environment Issues

### 1. Hot Reload Not Working

**Symptoms:**
- Changes don't reflect automatically
- Browser doesn't refresh
- Fast Refresh fails

**Solutions:**

1. **Check File Watcher Limits (Linux):**
```bash
# Increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. **Restart Development Server:**
```bash
# Kill any existing processes
pkill -f "next dev"
pnpm dev
```

### 2. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill Process on Port:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

2. **Use Different Port:**
```bash
# Set in package.json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

## 🚀 Vercel Deployment Issues

### 1. Environment Variables Not Working

**Symptoms:**
- Features work locally but not in production
- Database connections fail
- API keys not found

**Solutions:**

1. **Check Vercel Environment Variables:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Ensure all required variables are set:
     - `NETLIFYL_DATABASE_URL` (Neon database connection)
     - `RESEND_API_KEY` (Email service)
     - `NEXT_PUBLIC_SANITY_PROJECT_ID` (CMS)
     - All AWS variables for audio player

2. **Verify Variable Names:**
   - Make sure variable names match exactly (case-sensitive)
   - Check for trailing spaces or special characters
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables

3. **Redeploy After Changes:**
   ```bash
   # Trigger a new deployment
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```

### 2. Database Connection Issues

**Symptoms:**
- Emoji reactions not working
- Database queries failing
- Connection timeouts

**Solutions:**

1. **Check Neon Database:**
   - Verify your Neon database is active
   - Check connection string format
   - Ensure database migrations are applied

2. **Run Migrations on Vercel:**
   ```bash
   # Add this to package.json scripts
   "db:migrate:vercel": "drizzle-kit migrate"
   
   # Or run manually in Vercel CLI
   vercel env pull .env.local
   npx drizzle-kit migrate
   ```

3. **Test Database Connection:**
   ```bash
   # Test locally with production database
   VERCEL_DATABASE_URL=your_production_db_url npx drizzle-kit studio
   ```

### 3. Build Failures

**Symptoms:**
- Deployment fails during build
- TypeScript errors in production
- Missing dependencies

**Solutions:**

1. **Check Build Logs:**
   - Review Vercel build logs for specific errors
   - Look for missing environment variables
   - Check for TypeScript compilation errors

2. **Optimize Build:**
   ```bash
   # Test build locally
   npm run build
   
   # Check bundle size
   npm run analyze
   ```

3. **Update Dependencies:**
   ```bash
   # Update to latest stable versions
   npm update
   npm audit fix
   ```

### 4. Function Timeout Issues

**Symptoms:**
- API routes timing out
- Database queries taking too long
- Cold start delays

**Solutions:**

1. **Optimize Database Queries:**
   - Add proper indexes to your database
   - Use connection pooling
   - Implement caching strategies

2. **Increase Function Timeout:**
   ```typescript
   // In your API routes, add timeout handling
   export const maxDuration = 30; // 30 seconds
   ```

3. **Use Edge Runtime for Simple APIs:**
   ```typescript
   export const runtime = 'edge';
   ```

## 📞 Getting Additional Help

### 1. Debug Information

Before reporting issues, gather this information:

```bash
# System info
node --version
npm --version
pnpm --version

# Project info
cat package.json | grep "version"
pnpm list --depth=0

# Environment
env | grep NEXT_PUBLIC

# Build info
pnpm build 2>&1 | tail -20
```

### 2. Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Browser DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### 3. Creating Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Console errors
- Screenshots/videos if applicable

---

## 🎯 Pro Tips

### Prevention Strategies

1. **Use TypeScript Strict Mode:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

2. **Enable ESLint Rules:**
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"]
}
```

3. **Monitor Performance:**
```bash
# Regular bundle analysis
pnpm analyze

# Lighthouse checks
npm install -g @lhci/cli
lhci autorun
```

---

**Still having issues? Feel free to [open an issue](https://github.com/your-username/portfolio-v2/issues) with detailed information!** 🆘 