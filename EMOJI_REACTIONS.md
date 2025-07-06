# Emoji Reactions Feature

This document describes the implementation of the emoji reactions feature for blog posts, similar to dev.to's reaction system.

## Overview

The emoji reactions feature allows visitors to react to blog posts with emojis without requiring user registration. The system uses anonymous user tracking to ensure each visitor can have multiple different emoji reactions per blog post, with toggle functionality (add/remove reactions).

## Features

- **Floating Reaction Bar**: A beautiful floating emoji bar that appears on blog posts
- **Anonymous User Tracking**: Unique user identification without requiring login
- **Multiple Reactions**: Users can react with multiple different emojis per blog post
- **Toggle Functionality**: Click to add, click again to remove reactions
- **Real-time Updates**: Reactions update immediately when users interact
- **Responsive Design**: Works on both desktop and mobile devices
- **Visual Feedback**: Shows user's current reactions and total counts
- **Dark/Light Mode Support**: Automatically adapts to site theme

## Technical Implementation

### Database Schema

#### `anonymous_users` Table
- `id`: UUID primary key
- `fingerprint`: Unique browser fingerprint (hashed)
- `ip_hash`: Hashed IP address for additional tracking
- `user_agent`: Browser user agent string
- `created_at`: Timestamp when user was first seen
- `last_seen`: Timestamp of last activity

#### `blog_reactions` Table
- `id`: Auto-incrementing primary key
- `blog_slug`: Sanity blog post slug
- `emoji`: Emoji character (max 10 chars)
- `user_id`: Foreign key to anonymous_users
- `created_at`: Timestamp when reaction was created
- `updated_at`: Timestamp when reaction was last updated

### API Endpoints

#### GET `/api/reactions?blogSlug={slug}`
Returns reaction counts for a specific blog post.

**Response:**
```json
{
  "reactions": [
    { "emoji": "👍", "count": 5 },
    { "emoji": "❤️", "count": 3 }
  ]
}
```

#### POST `/api/reactions`
Adds or removes a user's reaction to a blog post (toggle functionality).

**Request Body:**
```json
{
  "blogSlug": "my-blog-post",
  "emoji": "👍",
  "fingerprint": "client-generated-fingerprint"
}
```

**Response:**
```json
{
  "success": true,
  "reactions": [
    { "emoji": "👍", "count": 6 },
    { "emoji": "❤️", "count": 3 }
  ],
  "userReaction": "👍" // null if reaction was removed, emoji if added
}
```

### User Identification Strategy

The system uses a multi-layered approach to identify unique users:

1. **Client-Side Fingerprinting**: Generates a unique fingerprint based on:
   - Canvas fingerprinting
   - Screen properties
   - Timezone
   - Language settings
   - Platform information
   - User agent

2. **Server-Side Fallback**: If client fingerprinting fails, falls back to:
   - User agent hash
   - Accept language
   - Accept encoding

3. **IP Hashing**: Additional tracking using hashed IP addresses

4. **Local Storage**: Client fingerprint is stored in localStorage for persistence

### Components

#### `EmojiReactions.tsx`
The main React component that renders the floating emoji bar.

**Features:**
- 6 predefined emoji options: 👍, ❤️, 😄, 😮, 🎉, 🔥
- Real-time reaction counts
- Visual feedback for user's current reactions
- Toggle functionality (add/remove reactions)
- Smooth animations and hover effects
- Responsive design for mobile devices
- Dark/Light mode support with automatic theme switching

**Styling:**
- Fixed positioning (bottom-right corner)
- Glassmorphism effect with backdrop blur
- Smooth slide-in animation
- Hover and active states for buttons
- SCSS-based styling with design system integration
- Accessibility features (reduced motion, high contrast support)

### Integration

The component is integrated into blog posts by adding it to the blog post page:

```tsx
<EmojiReactions blogSlug={post.slug.current} />
```

## Setup Instructions

### 1. Database Migration

Run the database migration to create the required tables:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

### 2. Environment Variables

Ensure your Neon database connection is properly configured in your environment variables.

### 3. Dependencies

The feature uses the following dependencies (already included):
- `drizzle-orm`: Database ORM
- `react-hot-toast`: Toast notifications
- `@netlify/neon`: Neon database client
- `request-ip`: IP address extraction for user tracking

## Security Considerations

1. **Fingerprint Privacy**: Client fingerprints are hashed before storage
2. **IP Privacy**: IP addresses are hashed before storage
3. **Rate Limiting**: Consider implementing rate limiting for reaction submissions
4. **Data Retention**: Consider implementing data retention policies for anonymous users

## Future Enhancements

1. **Custom Emojis**: Allow custom emoji reactions
2. **Reaction Analytics**: Track popular reactions and engagement
3. **Social Sharing**: Share reactions on social media
4. **Reaction History**: Show reaction history for users
5. **Moderation**: Admin tools to moderate inappropriate reactions
6. **Rate Limiting**: Implement rate limiting for reaction submissions
7. **Reaction Categories**: Group reactions by type (positive, negative, etc.)
8. **Anonymous User Management**: Tools to manage and clean up anonymous user data

## Troubleshooting

### Common Issues

1. **Reactions not appearing**: Check database connection and API endpoints
2. **Duplicate reactions**: Ensure proper user fingerprinting is working
3. **Styling issues**: Check CSS conflicts with existing styles

### Debug Mode

Add `console.log` statements in the `EmojiReactions` component to debug:
- API responses
- User fingerprint generation
- Reaction state changes

## Performance Considerations

1. **Database Indexes**: Ensure proper indexes on frequently queried columns
2. **Caching**: Consider caching reaction counts for popular posts
3. **Lazy Loading**: Reactions are loaded after the main content
4. **Optimistic Updates**: UI updates immediately before API confirmation
5. **Component Optimization**: SCSS-based styling for better performance
6. **Accessibility**: Respects user preferences for reduced motion and high contrast
7. **Mobile Optimization**: Touch-friendly interface with responsive design 