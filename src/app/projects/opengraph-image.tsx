import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'Projects by Akshay Gupta - Open Source & Side Projects';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOg({
    title: 'Projects',
    subtitle: 'Open Source & Side Projects',
    footer: 'akshaygupta.live/projects',
  });
}
