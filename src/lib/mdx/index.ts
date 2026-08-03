import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import GithubSlugger from 'github-slugger';
import { BlogPost, TOCHeading } from './types';
import { BlogMetadataSchema } from './schema';
import { logger } from '@/app/utils/logger';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function getBlogSlugs(): string[] {
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

function calculateReadingTime(content: string): { text: string } {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>#*_~]/g, '')
    .trim();

  const minutes = Math.ceil(text.split(/\s+/).filter(Boolean).length / 200);

  return { text: minutes <= 1 ? '1 min read' : `${minutes} min read` };
}

export function getBlogHeadings(slug: string): TOCHeading[] {
  const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(contentPath)) return [];

  const raw = fs.readFileSync(contentPath, 'utf-8');
  const headings: TOCHeading[] = [];
  // Same slugger rehype-slug uses, so these ids match the rendered anchors.
  const slugger = new GithubSlugger();
  let inFence = false;

  for (const line of raw.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    // Unwrap links and code spans to the text the renderer prints. Emphasis
    // markers are left alone — `*`, `_` and `~` appear literally in headings
    // here (`SELECT *`, `dense_vector`, `~12,000`).
    const text = match[2]!
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`/g, '')
      .trim();
    if (!text) continue;

    headings.push({
      id: slugger.slug(text),
      text,
      level: match[1]!.length,
    });
  }

  return headings;
}
