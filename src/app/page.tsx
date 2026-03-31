'use client';

import Image from 'next/image';
import Layout from '@/app/components/Layout';
import HomeContentInteractive from '@/app/components/HomeContentInteractive';
import { useIsMobile } from '@/app/hooks/useIsMobile';

import styles from './styles/sections/homeBanner.module.scss';

export default function Home() {
  const isMobile = useIsMobile();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Akshay Gupta',
    jobTitle: 'Senior Staff Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'PeopleGrove',
      url: 'https://www.peoplegrove.com',
    },
    url: 'https://akshaygupta.live',
    image: 'https://akshaygupta.live/images/home-banner.webp',
    description:
      'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development.',
    sameAs: [
      'https://github.com/gupta-akshay',
      'https://linkedin.com/in/akshayguptaujn',
      'https://twitter.com/ashay_music',
    ],
    knowsAbout: [
      'Web Development',
      'JavaScript',
      'React',
      'Node.js',
      'TypeScript',
      'Next.js',
      'Postgres',
      'ElasticSearch',
      'Redis',
      'RabbitMQ',
      'Google Cloud Platform',
    ],
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='home'
        data-nav-tooltip='Home'
        className='pp-section pp-scrollable'
      >
        {isMobile ? (
          // Mobile-friendly version without complex animations
          <div
            className={styles.homeBanner}
            id='main-content'
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className={`container ${styles.container}`}>
              <div className={`row ${styles.fullScreen} align-items-center`}>
                <div className='col-12'>
                  <div className={`${styles.typeBox} route-shell`}>
                    <h6>Senior Staff Engineer</h6>
                    <h1 className='font-alt' data-text='Akshay Gupta'>
                      Akshay Gupta
                    </h1>
                    <p className={styles.lead}>
                      Building high-quality product experiences and reliable
                      systems
                    </p>
                    <p className={styles.desc}>
                      I lead full-stack initiatives at{' '}
                      <HomeContentInteractive type='peopleGroveLink'>
                        PeopleGrove
                      </HomeContentInteractive>
                      , translating product goals into scalable architecture and
                      polished user interfaces. My focus is delivering software
                      that performs well, feels intuitive, and creates measurable
                      business impact.
                    </p>
                    <div className={styles.btnBar}>
                      <HomeContentInteractive type='downloadButton'>
                        Download CV
                      </HomeContentInteractive>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={styles.homeBanner}
            id='main-content'
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className={`container ${styles.container}`}>
              <div className={`row ${styles.fullScreen} align-items-center`}>
                <div className='col-lg-6'>
                  <div className={`${styles.typeBox} route-shell`}>
                    <h6>Senior Staff Engineer</h6>
                    <h1 className='font-alt' data-text='Akshay Gupta'>
                      Akshay Gupta
                    </h1>
                    <p className={styles.lead}>
                      Building high-quality product experiences and reliable
                      systems
                    </p>
                    <p className={styles.desc}>
                      I lead full-stack initiatives at{' '}
                      <HomeContentInteractive type='peopleGroveLink'>
                        PeopleGrove
                      </HomeContentInteractive>
                      , translating product goals into scalable architecture and
                      polished user interfaces. My focus is delivering software
                      that performs well, feels intuitive, and creates measurable
                      business impact.
                    </p>
                    <div className={styles.btnBar}>
                      <HomeContentInteractive type='downloadButton'>
                        Download CV
                      </HomeContentInteractive>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6 d-none d-sm-block'>
                  <div className={styles.hbImg}>
                    <Image
                      src='/images/home-banner.webp'
                      alt='Akshay Gupta - Senior Staff Engineer at PeopleGrove'
                      width={600}
                      height={600}
                      loading='lazy'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
