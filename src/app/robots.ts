import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/studio/', '/studio'],
      },
    ],
    sitemap: 'https://akshaygupta.live/sitemap.xml',
    host: 'https://akshaygupta.live',
  };
}
