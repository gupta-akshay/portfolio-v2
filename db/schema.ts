import { integer, pgTable, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Anonymous users table to track unique visitors
export const anonymousUsers = pgTable('anonymous_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    fingerprint: varchar({ length: 255 }).notNull().unique(), // Browser fingerprint
    ipHash: varchar({ length: 255 }), // Hashed IP address
    userAgent: text(),
    createdAt: timestamp('created_at').defaultNow(),
    lastSeen: timestamp('last_seen').defaultNow()
});

// Blog reactions table
export const blogReactions = pgTable('blog_reactions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    blogSlug: varchar({ length: 255 }).notNull(), // Sanity blog slug
    emoji: varchar({ length: 10 }).notNull(), // Emoji character
    userId: uuid('user_id').references(() => anonymousUsers.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});