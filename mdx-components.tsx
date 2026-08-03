import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

// Code blocks get keyboard-scrollable region semantics; plain <pre> is left as is.
function Pre({ className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  if (!className?.includes('language-')) return <pre {...props} />;

  return (
    <pre
      className={className}
      tabIndex={0}
      role='region'
      aria-label='Code snippet'
      {...props}
    />
  );
}

// Custom link component
function CustomLink({
  href,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'a'> & { href?: string }) {
  if (!href) return <span className={className}>{children}</span>;

  // Internal links
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  // External links
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

// Custom image component for MDX
// Handles markdown images that don't have width/height
function CustomImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  // For images without dimensions (from markdown syntax), use native img
  // This allows responsive images without requiring explicit dimensions
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      style={{ maxWidth: '100%', height: 'auto' }}
      {...props}
    />
  );
}

const components: MDXComponents = {
  pre: Pre,
  a: CustomLink,
  img: CustomImage,
};

export function useMDXComponents(
  baseComponents?: MDXComponents
): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  };
}
