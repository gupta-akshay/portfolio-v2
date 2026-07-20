import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { BlogPost, TOCHeading } from './types';
import { BlogMetadataSchema } from './schema';
import { logger } from '@/app/utils/logger';

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

export const getBlogBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      const { metadata: raw } = await import(`@/content/blog/${slug}.mdx`);

      const parsed = BlogMetadataSchema.safeParse(raw);
      if (!parsed.success) {
        logger.error(
          `Invalid metadata in ${slug}.mdx:`,
          parsed.error.flatten()
        );
        return null;
      }

      const metadata = parsed.data;
      if (metadata.slug !== slug) {
        logger.error(
          `Metadata slug "${metadata.slug}" does not match filename "${slug}.mdx"`
        );
        return null;
      }

      const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
      const rawContent = fs.readFileSync(contentPath, 'utf-8');
      const { text: readingTime } = calculateReadingTime(rawContent);

      return { metadata, slug, readingTime };
    } catch {
      return null;
    }
  }
);

export const getBlogRawMarkdown = cache(
  async (slug: string): Promise<string | null> => {
    if (!/^[a-z0-9-]+$/.test(slug)) return null;

    const post = await getBlogBySlug(slug);
    if (!post) return null;
    if (process.env.NODE_ENV === 'production' && post.metadata.draft === true) {
      return null;
    }

    const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    if (!fs.existsSync(contentPath)) return null;

    const raw = fs.readFileSync(contentPath, 'utf-8');
    const body = raw
      .replace(/^export const metadata\s*=\s*\{[\s\S]*?^\}\s*;?\s*$/m, '')
      .trim();
    const { metadata } = post;

    return [
      '---',
      `title: ${JSON.stringify(metadata.title)}`,
      `description: ${JSON.stringify(metadata.excerpt ?? metadata.title)}`,
      `publishedAt: ${JSON.stringify(metadata.publishedAt)}`,
      ...(metadata.modifiedAt
        ? [`modifiedAt: ${JSON.stringify(metadata.modifiedAt)}`]
        : []),
      `categories: ${JSON.stringify(metadata.categories)}`,
      `author: ${JSON.stringify(metadata.author.name)}`,
      `canonical: ${JSON.stringify(`/blog/${slug}`)}`,
      '---',
      '',
      `# ${metadata.title}`,
      '',
      body,
    ].join('\n');
  }
);

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

  const raw = fs.readFileSync(contentPath, 'utf-8');
  // Strip fenced code blocks so lines like `# comment` inside code aren't treated as headings
  const content = raw.replace(/```[\s\S]*?```/g, '');
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
