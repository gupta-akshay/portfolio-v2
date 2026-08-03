import { MetadataRoute } from 'next';
import { getAllBlogs } from '@/lib/mdx';
import { logger } from '@/app/utils/logger';
import { getSiteUrl } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resume`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/music`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllBlogs();
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(
        post.metadata.modifiedAt ?? post.metadata.publishedAt
      ),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    logger.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
