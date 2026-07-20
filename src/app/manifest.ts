import { MetadataRoute } from 'next';
import { getYearsOfExperience } from '@/app/utils/helpers/format';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Akshay Gupta | Senior Staff Engineer',
    short_name: 'Akshay Gupta',
    description: `Senior Staff Engineer at PeopleGrove with over ${getYearsOfExperience()} years of experience in web development.`,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
