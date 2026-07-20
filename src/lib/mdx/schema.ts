import { z } from 'zod';

export const BlogMetadataSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Must be a URL-safe slug'),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    modifiedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
      .optional(),
    categories: z.array(z.string().min(1)).min(1),
    coverImage: z.string().min(1),
    coverImageAlt: z.string().min(1),
    author: z.object({
      name: z.string().min(1),
      avatar: z.string().min(1),
    }),
    excerpt: z.string().optional(),
    draft: z.boolean().optional(),
  })
  .refine(
    ({ publishedAt, modifiedAt }) => !modifiedAt || modifiedAt >= publishedAt,
    {
      message: 'modifiedAt cannot be earlier than publishedAt',
      path: ['modifiedAt'],
    }
  );

export type BlogMetadata = z.infer<typeof BlogMetadataSchema>;
