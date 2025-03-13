/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import type { Metadata } from 'next';
import StudioWrapper from '@/app/studio/[[...tool]]/studio-wrapper';

export const metadata: Metadata = {
  title: 'Content Studio',
  description: 'Sanity Content Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export { viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <StudioWrapper />;
}
