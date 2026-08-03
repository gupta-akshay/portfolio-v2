import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'About Akshay Gupta - My Journey, Skills & Experience';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: 'About Me',
    subtitle: 'My Journey, Skills & Experience',
    footer: 'akshaygupta.live/about',
  });
}
