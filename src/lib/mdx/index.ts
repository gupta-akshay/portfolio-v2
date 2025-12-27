import fs from 'fs';
import path from 'path';
import { BlogMetadata, BlogPost } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog post slugs from the content/blog directory
 */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get blog metadata by dynamically importing the MDX file
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { metadata } = await import(`@/content/blog/${slug}.mdx`);

    // Read raw content for reading time calculation
    const contentPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const rawContent = fs.readFileSync(contentPath, 'utf-8');
    const { text: readingTime } = calculateReadingTime(rawContent);

    return {
      metadata: metadata as BlogMetadata,
      slug,
      readingTime,
    };
  } catch {
    return null;
  }
}

/**
 * Get all blog posts with their metadata, sorted by date (newest first)
 */
export async function getAllBlogs(): Promise<BlogPost[]> {
  const slugs = getBlogSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getBlogBySlug(slug);
      return post;
    })
  );

  // Filter out null values and sort by date
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt);
      const dateB = new Date(b.metadata.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Calculate reading time for MDX content
 * Note: For MDX, we'll estimate based on word count from the raw file
 */
export function calculateReadingTime(content: string): {
  text: string;
  minutes: number;
  words: number;
} {
  // Remove code blocks and special characters
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '') // Strip any remaining angle brackets for safety
    .replace(/[#*_~]/g, '')
    .trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200); // Average reading speed

  return {
    text: minutes <= 1 ? '1 min read' : `${minutes} min read`,
    minutes,
    words,
  };
}

/**
 * Extract headings from MDX content string for Table of Contents
 */
export function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1];
    const headingText = match[2];
    if (!hashes || !headingText) continue;

    const level = hashes.length;
    const text = headingText.trim();
    // Generate slug from heading text (similar to rehype-slug)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({ id, text, level });
  }

  return headings;
}
