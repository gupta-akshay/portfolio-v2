import Link from 'next/link';
import BlogImage from '@/app/components/BlogImage';
import { Blog } from '@/sanity/types/blog';
import { formatDate } from '@/app/utils';

const BlogTile = ({ blog }: { blog: Blog }) => {
  const { mainImage } = blog;

  return (
    <div className='col-md-6 m-15px-tb'>
      <div className='blog-grid'>
        <div className='blog-img'>
          <Link href={`/blog/${blog.slug.current}`}>
            <BlogImage value={mainImage} isTileImage />
          </Link>
        </div>
        <div className='blog-info'>
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
            <Link href={`/blog/${blog.slug.current}`}>{blog.title}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogTile;
