import { OG_SIZE, renderOg } from '@/lib/og';

export const alt =
  'Akshay Gupta Music - Original productions and electronic remixes';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: 'My Music',
    subtitle: 'Original Productions and Electronic Remixes',
    footer: 'akshaygupta.live/music',
  });
}
