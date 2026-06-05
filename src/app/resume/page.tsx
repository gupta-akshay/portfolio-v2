import type { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import ResumeActions from './ResumeActions';
import { resumeData } from './data';
import { getSiteUrl } from '@/lib/site-url';

import styles from '@/app/styles/sections/resumeSection.module.scss';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Resume',
  description:
    'Resume of Akshay Gupta — Senior Staff Engineer with 8+ years building scalable backend, platform, and AI-enabled systems on GCP and AWS.',
  openGraph: {
    type: 'profile',
    title: 'Resume | Akshay Gupta',
    description:
      'Resume of Akshay Gupta — Senior Staff Engineer with 8+ years building scalable backend, platform, and AI-enabled systems on GCP and AWS.',
    url: `${siteUrl}/resume`,
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/resume/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Resume — Akshay Gupta, Senior Staff Engineer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume | Akshay Gupta',
    description:
      'Resume of Akshay Gupta — Senior Staff Engineer with 8+ years building scalable backend, platform, and AI-enabled systems on GCP and AWS.',
    creator: '@ashay_music',
    images: ['/resume/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/resume`,
  },
};

function formatYearMonth(ym: string): string {
  const [year, month] = ym.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function Resume() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resumeData.name,
    jobTitle: resumeData.headline,
    url: siteUrl,
    email: resumeData.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'PeopleGrove',
      url: 'https://www.peoplegrove.com',
    },
    sameAs: [
      'https://github.com/gupta-akshay',
      'https://linkedin.com/in/akshayguptaujn',
      'https://twitter.com/ashay_music',
    ],
    description: resumeData.summary,
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='resume'
        data-nav-tooltip='Resume'
        className='pp-section pp-scrollable section'
        style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          {/* Page title + action buttons */}
          <div className={styles.resumePageHeader}>
            <div className='title'>
              <h3>Resume</h3>
            </div>
            <ResumeActions />
          </div>

          {/* Contact header */}
          <div className={`${styles.resumeContactHeader} route-shell`}>
            <h1 className={styles.resumeName}>{resumeData.name}</h1>
            <p className={styles.resumeHeadline}>{resumeData.headline}</p>
            <div className={styles.resumeContact}>
              <span>{resumeData.location}</span>
              <a href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
              <Link href='/'>{resumeData.website.replace('https://', '')}</Link>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.resumeSection}>
            <h2 className={styles.resumeSectionTitle}>Summary</h2>
            <p className={styles.resumeSummaryText}>{resumeData.summary}</p>
          </div>

          {/* Skills */}
          <div className={styles.resumeSection}>
            <h2 className={styles.resumeSectionTitle}>Skills</h2>
            <dl className={styles.skillsGrid}>
              {resumeData.skills.map((skill) => (
                <div key={skill.label} className={styles.skillRow}>
                  <dt className={styles.skillLabel}>{skill.label}</dt>
                  <dd className={styles.skillDetails}>{skill.details}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Experience */}
          <div className={styles.resumeSection}>
            <h2 className={styles.resumeSectionTitle}>Experience</h2>
            {resumeData.experience.map((company) => (
              <div key={company.company} className={styles.companyBlock}>
                <div className={styles.companyHeaderRow}>
                  <h3 className={styles.companyName}>{company.company}</h3>
                  <span className={styles.companyLocation}>
                    {company.location}
                  </span>
                </div>
                {company.summary && (
                  <p className={styles.companySummary}>{company.summary}</p>
                )}
                {company.roles.map((role) => (
                  <div key={role.position} className={styles.roleBlock}>
                    <div className={styles.roleHeaderRow}>
                      <h4 className={styles.roleTitle}>{role.position}</h4>
                      <span className={styles.roleDates}>
                        {formatYearMonth(role.startDate)} –{' '}
                        {role.endDate === 'present'
                          ? 'Present'
                          : formatYearMonth(role.endDate)}
                      </span>
                    </div>
                    <ul className={styles.bulletList}>
                      {role.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className={styles.resumeSection}>
            <h2 className={styles.resumeSectionTitle}>Education</h2>
            {resumeData.education.map((edu) => (
              <div key={edu.institution} className={styles.eduBlock}>
                <div className={styles.eduHeaderRow}>
                  <h3 className={styles.eduInstitution}>{edu.institution}</h3>
                  <span className={styles.eduDate}>{edu.date}</span>
                </div>
                <p className={styles.eduDegree}>
                  {edu.degree} in {edu.area}
                </p>
                <p className={styles.eduLocation}>{edu.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
