import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import Icon from '@/app/components/Icon/Icon';
import { getSiteUrl } from '@/lib/site-url';
import { homeContent } from '@/lib/site-content';
import { getYearsOfExperience } from '@/app/utils/helpers/format';

import styles from './styles/sections/homeBanner.module.scss';

export default function Home() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Akshay Gupta',
    jobTitle: 'Senior Staff Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'PeopleGrove',
      url: 'https://www.peoplegrove.com',
    },
    url: siteUrl,
    image: `${siteUrl}/images/home-banner.webp`,
    description: `Senior Staff Engineer at PeopleGrove with over ${getYearsOfExperience()} years of experience in web development.`,
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
      <section id='home' className={`pp-section ${styles.hero}`}>
        <div className={styles.glow} aria-hidden='true' />
        <div className={styles.grid}>
          <div className={`${styles.copy} route-shell`}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden='true' />
              {homeContent.role} · {homeContent.employer.name}
            </div>
            <h1 className={styles.title}>
              Akshay
              <br />
              Gupta<span>.</span>
            </h1>
            <p className={styles.lead}>{homeContent.lead}.</p>
            <p className={styles.desc}>
              I lead full-stack initiatives at{' '}
              <a
                href={homeContent.employer.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {homeContent.employer.name}
              </a>
              , {homeContent.intro}
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryBtn} href='/resume'>
                View Resume
              </Link>
              <Link className={styles.secondaryBtn} href='/contact'>
                Get in Touch
              </Link>
              <Link className={styles.textLink} href='/music'>
                <Icon name='music' aria-hidden='true' />I also make music →
              </Link>
            </div>
          </div>
          <div className={styles.media}>
            <div className={styles.mediaFrame}>
              <Image
                src='/images/home-banner.webp'
                alt='Akshay Gupta - Senior Staff Engineer at PeopleGrove'
                width={600}
                height={600}
                priority
                fetchPriority='high'
                sizes='(max-width: 900px) 420px, (max-width: 1200px) 45vw, 540px'
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
