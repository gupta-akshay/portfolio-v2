import { OG_SIZE, renderOg } from '@/lib/og';

export const alt =
  'Akshay Gupta Blog - Engineering, Architecture, and Performance';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: 'Blog Posts',
    subtitle: 'Engineering, Architecture, Performance, and Production Lessons',
    footer: 'akshaygupta.live/blog',
  });
}
