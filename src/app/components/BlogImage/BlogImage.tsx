import { CSSProperties } from 'react';
import Image from 'next/image';
// @ts-ignore
import { getImageDimensions } from '@sanity/asset-utils';
import { urlFor } from '@/sanity/lib/image';

const BlogImage = ({ value, isInline, isTileImage = false }: any) => {
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
      width={width}
      height={height}
      alt={value.alt || 'blog image'}
      loading='lazy'
      style={styleObj}
    />
  );
};

export default BlogImage;