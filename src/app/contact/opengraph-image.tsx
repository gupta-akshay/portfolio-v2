import { OG_SIZE, renderOg } from '@/lib/og';

export const alt =
  'Contact Akshay Gupta - Get in touch for collaboration opportunities';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: 'Get in Touch',
    subtitle: "Let's collaborate on your next project",
    footer: 'akshaygupta.live/contact',
  });
}
