import Link from 'next/link';
import BlogImage from '@/app/components/BlogImage';
import { Blog } from '@/sanity/types/blog';
import { formatDate } from '@/app/utils';

const BlogTile = ({ blog }: { blog: Blog }) => {
  const { mainImage } = blog;

  return (
    <div className='col-md-6 m-15px-tb' data-testid='blog-tile'>
      <div className='blog-grid' data-testid='blog-grid'>
        <div className='blog-img' data-testid='blog-img'>
          <Link href={`/blog/${blog.slug.current}`} prefetch>
            <BlogImage value={mainImage} isTileImage />
          </Link>
        </div>
        <div className='blog-info' data-testid='blog-info'>
          <div className='meta'>
            <span>{formatDate(blog.publishedAt)}</span>
            <span>|</span>
            {blog.categories.map((category) => (
              <span key={category.slug.current} className='hashtag'>
                #{category.title}
              </span>
            ))}
          </div>
          <p>
            <Link href={`/blog/${blog.slug.current}`} prefetch>
              {blog.title}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogTile;
