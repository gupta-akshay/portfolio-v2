import BlogImage from '@/app/components/BlogImage';
import { PortableText } from '@portabletext/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Blog } from '@/sanity/types/blog';

const CodeComponent = ({ value }: any) => {
  return (
    <div>
      <SyntaxHighlighter language={value.language} style={dracula}>
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
};

const components = {
  types: {
    image: BlogImage,
    code: CodeComponent,
  },
};

const SingleBlog = ({ post }: { post: Blog }) => {
  return <PortableText value={post?.body} components={components} />;
};

export default SingleBlog;
