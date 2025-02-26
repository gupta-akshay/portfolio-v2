'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BlogImage from '@/app/components/BlogImage';
import { Blog } from '@/sanity/types/blog';
import { formatDate } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';

const BlogTile = ({ blog }: { blog: Blog }) => {
  const { mainImage } = blog;
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startLoading();

    // Use setTimeout to ensure the loading state is set before navigation
    setTimeout(() => {
      router.push(`/blog/${blog.slug.current}`);
    }, 10);
  };

  return (
    <div className='col-md-6 m-15px-tb'>
      <article className='blog-grid'>
        <div className='blog-img'>
          <Link
            href={`/blog/${blog.slug.current}`}
            prefetch={false}
            aria-label={`Read more about ${blog.title}`}
            onClick={handleClick}
          >
            <BlogImage value={mainImage} isTileImage alt={blog.title} />
          </Link>
        </div>
        <div className='blog-info'>
          <div className='meta' aria-label='Post metadata'>
            <time dateTime={blog.publishedAt}>
              {formatDate(blog.publishedAt)}
            </time>
            <span aria-hidden='true'>|</span>
            {blog.categories.map((category) => (
              <span key={category.slug.current} className='hashtag'>
                #{category.title}
              </span>
            ))}
          </div>
          <h2 className='blog-title'>
            <Link
              href={`/blog/${blog.slug.current}`}
              prefetch={false}
              onClick={handleClick}
            >
              {blog.title}
            </Link>
          </h2>
        </div>
      </article>
    </div>
  );
};

export default BlogTile;
