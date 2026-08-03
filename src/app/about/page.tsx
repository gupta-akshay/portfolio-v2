import type { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import Skills from '@/app/components/Skills/Skills';
import Experience from '@/app/components/Experience/Experience';
import GitHubCalendar from '@/app/components/GitHubCalendar/GitHubCalendarLazy';
import { getSiteUrl } from '@/lib/site-url';
import { aboutContent } from '@/lib/site-content';
import { getYearsOfExperience } from '@/app/utils/helpers/format';

import styles from '../styles/sections/aboutSection.module.scss';

const siteUrl = getSiteUrl();
const aboutDescription =
  'Learn about my work as a Senior Staff Engineer at PeopleGrove, including my engineering experience, skills, and product-focused approach.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'About',
  description: aboutDescription,
  openGraph: {
    type: 'profile',
    title: 'About Akshay Gupta | Senior Staff Engineer',
    description: aboutDescription,
    url: `${siteUrl}/about`,
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/about/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About Akshay Gupta - My Journey, Skills & Experience',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Akshay Gupta | Senior Staff Engineer',
    description: aboutDescription,
    creator: '@ashay_music',
    images: ['/about/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function About() {
  const yearsOfExperience = getYearsOfExperience();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Akshay Gupta',
    description: aboutDescription,
    mainEntity: {
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
      description: `Senior Staff Engineer at PeopleGrove with over ${yearsOfExperience} years of experience in web development.`,
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
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'RGPV',
        location: 'India',
      },
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='about'
        data-nav-tooltip='About'
        className='pp-section pp-scrollable section about-section'
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className={styles.eyebrow}>About</div>

          <div className={`${styles.hero} route-shell`}>
            <h1 className={styles.heroTitle}>
              {aboutContent.heading}
              <span>.</span>
            </h1>
            <p className={styles.heroText}>
              {aboutContent.paragraphs[0]?.replace(
                '{years}',
                String(yearsOfExperience)
              )}
            </p>
            <p className={styles.heroText}>{aboutContent.paragraphs[1]}</p>
            <Link className={styles.cta} href='/contact'>
              Start a Conversation
            </Link>
          </div>

          <div className={styles.block}>
            <h2 className={styles.sectionHeading}>What I work with</h2>
            <p className={styles.sectionIntro}>{aboutContent.skillsIntro}</p>
            <Skills />
          </div>

          {/* Experience renders its own section heading */}
          <div className={styles.block}>
            <Experience />
          </div>

          <div className={styles.block}>
            <h2 className={styles.sectionHeading}>Education</h2>
            <ul className={styles.educationGrid}>
              {aboutContent.education.map((item) => (
                <li key={item.qualification} className={styles.educationCard}>
                  <span className={styles.educationDates}>{item.dates}</span>
                  <h3 className={styles.educationTitle}>
                    {item.qualification}
                  </h3>
                  <p className={styles.educationInstitution}>
                    {item.institution}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <GitHubCalendar username='gupta-akshay' />
        </div>
      </section>
    </Layout>
  );
}
