import { createClient } from 'next-sanity';
import { QueryParams } from 'sanity';

import { apiVersion, dataset, projectId } from '../env';
import { postQuery, postQueryBySlug } from './queries';
import { Blog } from '@/sanity/types/blog';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: {
    enabled: false,
  },
});

// Utility function to generate a unique key for blocks
const generateBlockKey = (
  index: number,
  blockType: string = 'block'
): string => {
  return `${blockType}_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to ensure all blocks have proper _key values
const ensureBlockKeys = (blocks: any[] = []): any[] => {
  return blocks.map((block, index) => {
    if (!block._key || block._key === '') {
      return {
        ...block,
        _key: generateBlockKey(index, block._type || 'block'),
      };
    }
    return block;
  });
};

// Utility function to validate and fix blog post data
const validateBlogData = (blog: Blog): Blog => {
  if (!blog || !blog.body) {
    return blog;
  }

  return {
    ...blog,
    body: ensureBlockKeys(blog.body),
  };
};

export async function sanityFetch<QueryResponse>({
  query,
  qParams,
  tags,
}: {
  query: string;
  qParams: QueryParams;
  tags: string[];
}): Promise<QueryResponse> {
  const data = await client.fetch<QueryResponse>(query, qParams, {
    cache: 'force-cache',
    next: { tags },
  });

  return data;
}

export const getPosts = async (): Promise<Blog[]> => {
  const posts = await sanityFetch<Blog[]>({
    query: postQuery + ' | order(publishedAt desc)',
    qParams: {},
    tags: ['post', 'author', 'category'],
  });

  // Ensure all posts have proper block keys
  return posts.map(validateBlogData);
};

export const getPostBySlug = async (slug: string): Promise<Blog> => {
  const data: Blog = await sanityFetch({
    query: postQueryBySlug,
    qParams: { slug },
    tags: ['post', 'author', 'category'],
  });

  // Ensure the post has proper block keys
  return validateBlogData(data);
};
