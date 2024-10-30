import { CSSProperties } from 'react';
import Image from 'next/image';
// @ts-ignore
import { getImageDimensions } from '@sanity/asset-utils';
import { urlFor } from '@/sanity/lib/image';

const BlogImage = ({
  value,
  isInline,
  isTileImage = false,
  isAuthor = false,
}: any) => {
  const { width, height } = getImageDimensions(value);
  const url = urlFor(value).fit('max').auto('format').url() as string;

  const styleObj: CSSProperties = isTileImage
    ? { objectFit: 'cover' as const }
    : {
        display: isInline ? 'inline-block' : 'block',
        aspectRatio: `${width} / ${height}`,
        objectFit: 'cover' as const,
      };

  return (
    <Image
      src={url}
      width={isAuthor ? 45 : width}
      height={isAuthor ? 45 : height}
      alt={value.alt || 'blog image'}
      loading='lazy'
      style={styleObj}
      className='blog-image'
    />
  );
};

export default BlogImage;
