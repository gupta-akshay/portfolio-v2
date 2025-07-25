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
import { useHoverPrefetch } from '@/app/hooks/useHoverPrefetch';

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

  // Create href safely, defaulting to empty string if slug doesn't exist
  const href = value?.slug ? `/${value.slug.current}` : '';

  // Hover prefetch for internal blog links - always call hook, but disable if no valid href
  const { handleMouseEnter, handleMouseLeave } = useHoverPrefetch(href, {
    delay: 200, // 200ms delay for internal links
    enabled: href.startsWith('/blog/'), // Only prefetch blog links
  });

  // Early return after hooks
  if (!value?.slug) return null;

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
      <Link
        href={href}
        onClick={handleClick}
        prefetch={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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

// Custom heading components with IDs
const HeadingComponent = ({ level, children, value }: any) => {
  // Use the Sanity block key as ID for consistency
  const id = value._key;

  switch (level) {
    case 1:
      return <h1 id={id}>{children}</h1>;
    case 2:
      return <h2 id={id}>{children}</h2>;
    case 3:
      return <h3 id={id}>{children}</h3>;
    case 4:
      return <h4 id={id}>{children}</h4>;
    default:
      return <h2 id={id}>{children}</h2>;
  }
};

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
  block: {
    h1: ({ children, value }: any) => (
      <HeadingComponent level={1} value={value}>
        {children}
      </HeadingComponent>
    ),
    h2: ({ children, value }: any) => (
      <HeadingComponent level={2} value={value}>
        {children}
      </HeadingComponent>
    ),
    h3: ({ children, value }: any) => (
      <HeadingComponent level={3} value={value}>
        {children}
      </HeadingComponent>
    ),
    h4: ({ children, value }: any) => (
      <HeadingComponent level={4} value={value}>
        {children}
      </HeadingComponent>
    ),
  },
};

const SingleBlog = ({ post }: { post: Blog }) => {
  const groupedBody = useMemo(() => {
    return groupConsecutiveImages(post?.body || []);
  }, [post?.body]);

  return <PortableText value={groupedBody} components={components} />;
};

export default SingleBlog;
