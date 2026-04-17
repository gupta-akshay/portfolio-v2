import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { BlogPost, TOCHeading } from './types';
import { BlogMetadataSchema } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export const getBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const { metadata: raw } = await import(`@/content/blog/${slug}.mdx`);

    const parsed = BlogMetadataSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(`Invalid metadata in ${slug}.mdx:`, parsed.error.flatten());
      return null;
    }

    const metadata = parsed.data;

    const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const rawContent = fs.readFileSync(contentPath, 'utf-8');
    const { text: readingTime } = calculateReadingTime(rawContent);

    return { metadata, slug, readingTime };
  } catch {
    return null;
  }
});

export async function getAllBlogs(): Promise<BlogPost[]> {
  const slugs = getBlogSlugs();
  const isProd = process.env.NODE_ENV === 'production';

  const posts = await Promise.all(slugs.map((slug) => getBlogBySlug(slug)));

  return posts
    .filter((post): post is BlogPost => {
      if (!post) return false;
      if (isProd && post.metadata.draft === true) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt);
      const dateB = new Date(b.metadata.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
}

export function calculateReadingTime(content: string): {
  text: string;
  minutes: number;
  words: number;
} {
  let sanitized = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '');

  let previous: string;
  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } while (sanitized !== previous);

  const text = sanitized
    .replace(/[<>]/g, '')
    .replace(/[#*_~]/g, '')
    .trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);

  return {
    text: minutes <= 1 ? '1 min read' : `${minutes} min read`,
    minutes,
    words,
  };
}

// Generate a heading ID matching rehype-slug / github-slugger output
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBlogHeadings(slug: string): TOCHeading[] {
  const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(contentPath)) return [];

  const content = fs.readFileSync(contentPath, 'utf-8');
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: TOCHeading[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1];
    const headingText = match[2];
    if (!hashes || !headingText) continue;

    const level = hashes.length;
    const text = headingText.trim();
    const id = slugifyHeading(text);

    headings.push({ id, text, level });
  }

  return headings;
}
