import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

// Code element - just pass through, styling handled by Prism CSS
function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'code'>) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

// Pre block wrapper for code blocks with accessibility
function Pre({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  // Check if this contains a code block (has language class)
  const hasLanguageClass = className?.includes('language-');

  return (
    <pre
      className={className}
      tabIndex={hasLanguageClass ? 0 : undefined}
      role={hasLanguageClass ? 'region' : undefined}
      aria-label={hasLanguageClass ? 'Code snippet' : undefined}
      {...props}
    >
      {children}
    </pre>
  );
}

// Custom heading components with IDs for TOC linking
function H1({
  children,
  id,
  ...props
}: ComponentPropsWithoutRef<'h1'> & { id?: string }) {
  return (
    <h1 id={id} {...props}>
      {children}
    </h1>
  );
}

function H2({
  children,
  id,
  ...props
}: ComponentPropsWithoutRef<'h2'> & { id?: string }) {
  return (
    <h2 id={id} {...props}>
      {children}
    </h2>
  );
}

function H3({
  children,
  id,
  ...props
}: ComponentPropsWithoutRef<'h3'> & { id?: string }) {
  return (
    <h3 id={id} {...props}>
      {children}
    </h3>
  );
}

function H4({
  children,
  id,
  ...props
}: ComponentPropsWithoutRef<'h4'> & { id?: string }) {
  return (
    <h4 id={id} {...props}>
      {children}
    </h4>
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
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '0.5rem',
      }}
      {...props}
    />
  );
}

const components: MDXComponents = {
  // Headings with IDs for TOC
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  // Code blocks
  code: CodeBlock,
  pre: Pre,
  // Links
  a: CustomLink,
  // Images
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
