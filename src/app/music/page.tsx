import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import LoadingIndicator from '@/app/components/LoadingIndicator/LoadingIndicator';
import MusicTracks from '@/app/music/components/MusicTracks';
import { getSiteUrl } from '@/lib/site-url';
import { musicContent } from '@/lib/site-content';
import { createPageMetadata } from '@/lib/metadata';
import { getAudioFilesList } from '@/app/utils/aws';

const siteUrl = getSiteUrl();
const musicDescription = musicContent.paragraphs.join(' ');

export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
  title: 'My Music',
  description: musicDescription,
  socialTitle: 'My Music | Akshay Gupta',
  path: '/music',
  imageAlt: 'Akshay Gupta Music - Original productions and electronic remixes',
  type: 'music.playlist',
});

async function TrackList() {
  const tracks = await getAudioFilesList().catch(() => null);

  return tracks ? (
    <MusicTracks tracks={tracks} />
  ) : (
    <div className='warning-text'>
      Failed to load tracks. Please try again later.
    </div>
  );
}

export default function Music() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Akshay Gupta Music Collection',
    description: musicDescription,
    url: `${siteUrl}/music`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/music`,
    },
    creator: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Akshay Gupta',
      url: siteUrl,
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='music'
        data-nav-tooltip='Music'
        className='pp-section pp-scrollable section music-section'
        tabIndex={0}
        role='region'
        aria-label='Music Section'
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className='music-eyebrow'>Music</div>
          <h1 className='music-heading'>
            My Music<span>.</span>
          </h1>
          <div className='music-description route-shell'>
            {musicContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <TrackList />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
