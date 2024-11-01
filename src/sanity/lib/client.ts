import { createClient } from 'next-sanity';
import { QueryParams } from 'sanity';

import { apiVersion, dataset, projectId } from '../env';
import { postQuery, postQueryBySlug } from './queries';
import { Blog } from '@/sanity/types/blog';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<QueryResponse>({
  query,
  qParams,
  tags,
}: {
  query: string,
  qParams: QueryParams,
  tags: string[],
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, qParams, {
    cache: 'force-cache',
    next: { tags },
  });
}

export const getPosts = async (): Promise<Blog[]> => {
  return await sanityFetch({
    query: postQuery + ' | order(publishedAt desc)',
    qParams: {},
    tags: ['post', 'author', 'category'],
  });
};

export const getPostBySlug = async (slug: string) => {
  const data: Blog = await sanityFetch({
    query: postQueryBySlug,
    qParams: { slug },
    tags: ['post', 'author', 'category'],
  });

  return data;
};
