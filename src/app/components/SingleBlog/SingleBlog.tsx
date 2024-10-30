import Link from 'next/link';
import BlogImage from '@/app/components/BlogImage';
// @ts-ignore
import { PortableText } from '@portabletext/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Blog } from '@/sanity/types/blog';

const CodeComponent = ({ value }: any) => {
  return (
    <div>
      {/* @ts-ignore */}
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
  marks: {
    internalLink: ({
      value,
      children,
    }: {
      value: { slug: { current: string } };
      children: React.ReactNode;
    }) => {
      const { slug = { current: '' } } = value;
      const href = `/${slug.current}`;
      return <Link href={href}>{children}</Link>;
    },
    link: ({
      value,
      children,
    }: {
      value: { blank?: boolean; href: string };
      children: React.ReactNode;
    }) => {
      const { blank, href } = value;
      return blank ? (
        <Link href={href} target='_blank' rel='noopener noreferrer'>
          {children}
        </Link>
      ) : (
        <Link href={href}>{children}</Link>
      );
    },
  },
};

const SingleBlog = ({ post }: { post: Blog }) => {
  return <PortableText value={post?.body} components={components} />;
};

export default SingleBlog;
