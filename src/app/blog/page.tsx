import Layout from '@/app/components/Layout';
import { getPosts } from '@/sanity/lib/client';
import BlogTile from '@/app/components/BlogTile';

export default async function Blog() {
  const posts = await getPosts();

  return (
    <Layout>
      <section
        id='blog'
        data-nav-tooltip='Blog'
        className='pp-section pp-scrollable section'
      >
        <div className='container'>
          <div className='title'>
            <h3>Latest Blogs.</h3>
          </div>
          <div className='row'>
            {posts.map((post) => (
              <BlogTile key={post._id} blog={post} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
