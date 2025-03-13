import { CSSProperties } from 'react';
import Image from 'next/image';
// @ts-ignore
import { getImageDimensions } from '@sanity/asset-utils';
import { urlFor } from '@/sanity/lib/image';
import './BlogImage.css';

const BlogImage = ({
  value,
  isInline,
  isTileImage = false,
  isCoverImage = false,
  isAuthor = false,
}: any) => {
  const { width, height } = getImageDimensions(value);

  // Generate optimized image URL with proper format and quality
  const url = urlFor(value)
    .fit('max')
    .auto('format')
    .quality(80)
    .url() as string;

  const styleObj: CSSProperties =
    isTileImage || isCoverImage
      ? { objectFit: 'cover' as const, borderRadius: '10px' }
      : {
          display: isInline ? 'inline-block' : 'block',
          aspectRatio: `${width} / ${height}`,
          objectFit: 'contain' as const,
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '500px',
          borderRadius: '10px',
        };

  return (
    <div
      className={`${isTileImage || isCoverImage ? '' : 'image-container'} ${isAuthor ? 'author-image' : ''}`}
    >
      <Image
        src={url}
        width={isAuthor ? 45 : width}
        height={isAuthor ? 45 : height}
        alt={value.alt || 'blog image'}
        loading='lazy'
        style={styleObj}
        className='blog-image'
        sizes={
          isAuthor
            ? '45px'
            : isCoverImage
              ? '100vw'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        }
        placeholder={isAuthor ? 'empty' : 'blur'}
        blurDataURL={
          isAuthor
            ? undefined
            : `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
        }
      />
    </div>
  );
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

// Function to convert SVG to base64
const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default BlogImage;
