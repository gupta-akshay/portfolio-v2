import { getAllBlogs, getBlogRawMarkdown } from '@/lib/mdx';
import { blogIntro } from '@/lib/site-content';
import { getSiteUrl } from '@/lib/site-url';
import { markdownFrontmatter, markdownLink } from './utils';

export async function generateBlogIndexMarkdown(): Promise<string> {
  const siteUrl = getSiteUrl();
  const posts = await getAllBlogs();

  return [
    markdownFrontmatter(
      'Writing by Akshay Gupta',
      blogIntro,
      `${siteUrl}/blog`
    ),
    '',
    '# Writing',
    '',
    blogIntro,
    '',
    ...posts.flatMap((post) => [
      `## ${markdownLink(post.metadata.title, `${siteUrl}/blog/${post.slug}`)}`,
      '',
      `**Published ${post.metadata.publishedAt} · ${post.readingTime}**`,
      '',
      post.metadata.excerpt ?? '',
      '',
      `Topics: ${post.metadata.categories.join(', ')}`,
      '',
    ]),
  ].join('\n');
}

export async function generateBlogPostMarkdown(
  slug: string
): Promise<string | null> {
  const markdown = await getBlogRawMarkdown(slug);
  if (!markdown) return null;

  const siteUrl = getSiteUrl();
  return markdown
    .replace(
      `canonical: ${JSON.stringify(`/blog/${slug}`)}`,
      `canonical: ${JSON.stringify(`${siteUrl}/blog/${slug}`)}`
    )
    .replace(/\]\(\/(?!\/)/g, `](${siteUrl}/`);
}
