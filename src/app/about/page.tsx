import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';
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

const EducationAndSkills = () => (
  <>
    <div className='separator' />
    <div className='title'>
      <h3>My Background & What I&apos;m Good At</h3>
    </div>
    <div className='row'>
      <div className='col-lg-4 m-15px-tb'>
        <ul className={styles.educationBox}>
          {aboutContent.education.map((item) => (
            <li key={item.qualification}>
              <span>{item.dates}</span>
              <h6>{item.qualification}</h6>
              <p>{item.institution}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className='col-lg-7 ml-auto m-15px-tb'>
        <div className={styles.skillsBox}>
          <h3>What I Can Do</h3>
          <p>{aboutContent.skillsIntro}</p>
          <Skills />
        </div>
      </div>
    </div>
  </>
);

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
      image: `${siteUrl}/images/about-me.webp`,
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
          <div className='row align-items-center justify-content-center'>
            <div className='col-lg-6 m-15px-tb d-none d-sm-block'>
              <div className={styles.aboutImg}>
                <Image
                  src='/images/about-me.webp'
                  alt='about-image'
                  width={560}
                  height={560}
                  loading='lazy'
                  style={{ objectFit: 'cover', width: '100%' }}
                />
              </div>
            </div>
            <div className='col-lg-6 m-15px-tb'>
              <div className={`${styles.aboutInfo} route-shell`}>
                <div className='title' style={{ marginBottom: '24px' }}>
                  <h3>About</h3>
                </div>
                <div className={styles.aboutText}>
                  <h4>{aboutContent.heading}</h4>
                  <p>
                    {aboutContent.paragraphs[0]?.replace(
                      '{years}',
                      String(yearsOfExperience)
                    )}
                  </p>
                  <p>{aboutContent.paragraphs[1]}</p>
                </div>
                <div className={styles.btnBar}>
                  <Link className='px-btn px-btn-regular' href='/contact'>
                    <span>Start a Conversation</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <EducationAndSkills />
          <div className='separator' />
          <Experience />
          <div className='separator' />
          <GitHubCalendar username='gupta-akshay' />
        </div>
      </section>
    </Layout>
  );
}
