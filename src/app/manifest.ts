import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Akshay Gupta | Full-Stack Web Developer',
    short_name: 'Akshay Gupta',
    description:
      'Senior Staff Engineer at PeopleGrove with extensive experience in web development.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon?size=32',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
