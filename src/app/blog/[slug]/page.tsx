import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/app/components/Layout';
import SingleBlog from '@/app/components/SingleBlog';
import BlogImage from '@/app/components/BlogImage';
import { getPostBySlug } from '@/sanity/lib/client';
import { formatDate } from '@/app/utils';
import { urlFor } from '@/sanity/lib/image';

type Props = {
  params: Promise<{ slug: string }>,
};

const SingleBlogPage = async ({ params }: Props) => {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Layout isBlog>
      <div id={post.slug.current} className='single-blog'>
        <div className='container'>
          <div className='blog-feature-img'>
            <BlogImage value={post.mainImage} />
          </div>
          <div className='row justify-content-center'>
            <div className='col-lg-8'>
              <article className='article'>
                <div className='article-title'>
                  <div className='hashtags'>
                    {post.categories.map((category) => (
                      <span key={category.slug.current} className='hashtag'>
                        #{category.title}
                      </span>
                    ))}
                  </div>
                  <h2>{post.title}</h2>
                  <div className='media'>
                    <div className='avatar'>
                      <BlogImage value={post.author.image} isAuthor />
                    </div>
                    <div className='media-body'>
                      <label>{post.author.name}</label>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className='article-content'>
                  <SingleBlog post={post} />
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Add generateMetadata function for dynamic blog posts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Akshay Gupta',
        description: `The blog post you're looking for does not exist`,
        openGraph: {
          title: 'Post Not Found',
          description: `The blog post you're looking for does not exist`,
          type: 'article',
        },
      };
    }

    const imageUrl = urlFor(post.mainImage).width(1200).height(630).url();

    return {
      title: `${post.title} | Akshay Gupta's Blog`,
      description: post.title,
      openGraph: {
        title: post.title,
        description: post.title,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Akshay Gupta',
      description: 'An error occurred while loading this blog post',
      openGraph: {
        title: 'Error',
        description: 'An error occurred while loading this blog post',
        type: 'article',
      },
    };
  }
}

export default SingleBlogPage;
