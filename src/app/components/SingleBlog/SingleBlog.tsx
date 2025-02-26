'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BlogImage from '@/app/components/BlogImage';
// @ts-ignore
import {
  PortableText,
  PortableTextMarkComponentProps,
} from '@portabletext/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Blog } from '@/sanity/types/blog';
import { useLoading } from '@/app/context/LoadingContext';

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

const InternalLink = ({
  value,
  children,
}: PortableTextMarkComponentProps<{
  _type: string,
  slug: { current: string },
}>) => {
  const router = useRouter();
  const { startLoading } = useLoading();

  if (!value?.slug) return null;
  const href = `/${value.slug.current}`;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only add loading state for blog links
    if (href.startsWith('/blog/')) {
      e.preventDefault();
      startLoading();
      
      // Use setTimeout to ensure the loading state is set before navigation
      setTimeout(() => {
        router.push(href);
      }, 10);
    }
  };

  return (
    <span className="internal-link-wrapper">
      <Link href={href} onClick={handleClick} prefetch={false}>
        {children}
      </Link>
    </span>
  );
};

const ExternalLink = ({
  value,
  children,
}: PortableTextMarkComponentProps<{
  _type: string,
  blank?: boolean,
  href: string,
}>) => {
  if (!value?.href) return null;
  const { blank, href } = value;
  return blank ? (
    <Link href={href} target='_blank' rel='noopener noreferrer'>
      {children}
    </Link>
  ) : (
    <Link href={href}>{children}</Link>
  );
};

const CodeMarkComponent = ({ children }: PortableTextMarkComponentProps) => {
  return <code>{children}</code>;
};

const components = {
  types: {
    image: BlogImage,
    code: CodeComponent,
  },
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
    code: CodeMarkComponent,
  },
};

const SingleBlog = ({ post }: { post: Blog }) => {
  return <PortableText value={post?.body} components={components} />;
};

export default SingleBlog;

