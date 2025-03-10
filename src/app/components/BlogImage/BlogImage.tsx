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
  const url = urlFor(value).fit('max').auto('format').url() as string;

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
      />
    </div>
  );
};

export default BlogImage;
