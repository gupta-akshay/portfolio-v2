import { notFound } from 'next/navigation';
import Layout from '@/app/components/Layout';
import SingleBlog from '@/app/components/SingleBlog';
import BlogImage from '@/app/components/BlogImage';
import { getPostBySlug } from '@/sanity/lib/client';
import { formatDate } from '@/app/utils';

const SingleBlogPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

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

export default SingleBlogPage;
