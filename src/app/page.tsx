'use client';

import Image from 'next/image';
import TypingAnimation from '@/app/components/TypingAnimation';
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
                  <div className={styles.typeBox}>
                    <h6>Hello, I am</h6>
                    <h1 className='font-alt glitch' data-text='Akshay Gupta'>
                      Akshay Gupta
                    </h1>
                    <p className={styles.lead}>
                      I am <TypingAnimation />
                    </p>
                    <p className={styles.desc}>
                      Hey there! 👋 I&apos;m currently a Senior Staff Engineer
                      at{' '}
                      <HomeContentInteractive type='peopleGroveLink'>
                        PeopleGrove
                      </HomeContentInteractive>
                      . I love building websites and apps that are both
                      user-friendly and powerful under the hood. Think of me as
                      someone who enjoys creating digital solutions that make
                      people&apos;s lives easier! I&apos;m passionate about
                      working with teams to bring creative ideas to life and
                      always excited to learn and try new things in the tech
                      world. Whether it&apos;s making beautiful websites or
                      solving complex technical challenges, I&apos;m your guy!
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
                  <div className={styles.typeBox}>
                    <h6>Hello, I am</h6>
                    <h1 className='font-alt glitch' data-text='Akshay Gupta'>
                      Akshay Gupta
                    </h1>
                    <p className={styles.lead}>
                      I am <TypingAnimation />
                    </p>
                    <p className={styles.desc}>
                      Hey there! 👋 I&apos;m currently a Senior Staff Engineer
                      at{' '}
                      <HomeContentInteractive type='peopleGroveLink'>
                        PeopleGrove
                      </HomeContentInteractive>
                      . I love building websites and apps that are both
                      user-friendly and powerful under the hood. Think of me as
                      someone who enjoys creating digital solutions that make
                      people&apos;s lives easier! I&apos;m passionate about
                      working with teams to bring creative ideas to life and
                      always excited to learn and try new things in the tech
                      world. Whether it&apos;s making beautiful websites or
                      solving complex technical challenges, I&apos;m your guy!
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
