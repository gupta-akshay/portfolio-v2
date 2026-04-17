import { z } from 'zod';

export const BlogMetadataSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  categories: z.array(z.string().min(1)).min(1),
  coverImage: z.string().min(1),
  coverImageAlt: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    avatar: z.string().min(1),
  }),
  excerpt: z.string().optional(),
  draft: z.boolean().optional(),
});

export type BlogMetadata = z.infer<typeof BlogMetadataSchema>;
