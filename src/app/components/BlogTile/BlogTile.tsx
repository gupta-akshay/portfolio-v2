import Image from 'next/image';
import Link from 'next/link';
// @ts-ignore
import { getImageDimensions } from '@sanity/asset-utils';

import { urlFor } from '@/sanity/lib/image';
import { Blog } from '@/sanity/types/blog';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day: string = date.getUTCDate().toString().padStart(2, '0');
  const month: string = date.toLocaleString('en-US', { month: 'short' });
  const year: number = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const BlogTile = ({ blog }: { blog: Blog }) => {
  const { mainImage } = blog;
  const { width, height } = getImageDimensions(mainImage);
  const url = urlFor(mainImage).fit('max').auto('format').url() as string;

  return (
    <div className='col-md-6 m-15px-tb'>
      <div className='blog-grid'>
        <div className='blog-img'>
          <Link href={`/blog/${blog.slug.current}`}>
            <Image
              src={url}
              width={width}
              height={height}
              alt={blog.mainImage.alt || 'blog image'}
              loading='lazy'
              layout='responsive'
              style={{ objectFit: 'cover' }}
            />
          </Link>
        </div>
        <div className='blog-info'>
          <div className='meta'>{formatDate(blog.publishedAt)}</div>
          <p>
            <Link href={`/blog/${blog.slug.current}`}>{blog.title}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogTile;
