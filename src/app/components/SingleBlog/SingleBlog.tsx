'use client';

import React, { useMemo } from 'react';
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
    <div className='code-block-wrapper'>
      {/* @ts-ignore */}
      <SyntaxHighlighter
        language={value.language}
        style={dracula}
        tabIndex={0}
        role='region'
        aria-label={`Code snippet in ${value.language}`}
        className='keyboard-accessible-code'
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
};

const InternalLink = ({
  value,
  children,
}: PortableTextMarkComponentProps<{
  _type: string;
  slug: { current: string };
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
    <span className='internal-link-wrapper'>
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
  _type: string;
  blank?: boolean;
  href: string;
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

// Helper component to render a row of images
const ImageRow = ({ images }: { images: any[] }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      margin: '1.5rem 0',
    }}
  >
    {images.map((img, idx) => (
      <div
        key={idx}
        style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
      >
        <BlogImage value={img} />
      </div>
    ))}
  </div>
);

// Transform the PortableText body to group consecutive images
function groupConsecutiveImages(blocks: any[]) {
  const result: any[] = [];
  let imageBuffer: any[] = [];

  for (const block of blocks) {
    if (block._type === 'image') {
      imageBuffer.push(block);
    } else {
      if (imageBuffer.length === 1) {
        result.push(imageBuffer[0]);
      } else if (imageBuffer.length > 1) {
        result.push({ _type: 'imageRow', images: imageBuffer });
      }
      imageBuffer = [];
      result.push(block);
    }
  }
  // Flush any remaining images
  if (imageBuffer.length === 1) {
    result.push(imageBuffer[0]);
  } else if (imageBuffer.length > 1) {
    result.push({ _type: 'imageRow', images: imageBuffer });
  }
  return result;
}

const components = {
  types: {
    image: BlogImage,
    code: CodeComponent,
    imageRow: ({ value }: any) => <ImageRow images={value.images} />,
  },
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
    code: CodeMarkComponent,
  },
};

const SingleBlog = ({ post }: { post: Blog }) => {
  const groupedBody = useMemo(
    () => groupConsecutiveImages(post?.body || []),
    [post?.body]
  );
  return <PortableText value={groupedBody} components={components} />;
};

export default SingleBlog;
