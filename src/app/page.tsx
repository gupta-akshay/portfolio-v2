import type { Metadata } from 'next';
import Image from 'next/image';
import TypingAnimation from '@/app/components/TypingAnimation';
import Layout from '@/app/components/Layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live'),
  title: 'Akshay Gupta | Full-Stack Web Developer',
  description:
    'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development. Specialized in building user-friendly and powerful web applications.',
  openGraph: {
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description:
      'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development.',
    url: 'https://akshaygupta.live',
    siteName: 'Akshay Gupta',
    images: [
      {
        url: 'https://akshaygupta.live/images/home-banner.webp',
        width: 600,
        height: 600,
        alt: 'Akshay Gupta - Senior Staff Engineer at PeopleGrove',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description:
      'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development.',
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/images/home-banner.webp'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live',
  },
};

export default function Home() {
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
        <div className='home-banner' id='main-content'>
          <div className='container'>
            <div className='row full-screen align-items-center'>
              <div className='col-lg-6'>
                <div className='type-box'>
                  <h6>Hello, I am</h6>
                  <h1 className='font-alt glitch' data-text='Akshay Gupta'>
                    Akshay Gupta
                  </h1>
                  <p className='lead'>
                    I am <TypingAnimation />
                  </p>
                  <p className='desc'>
                    Hey there! 👋 I&apos;m currently a Senior Staff Engineer at{' '}
                    <a
                      href='https://www.peoplegrove.com'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      PeopleGrove
                    </a>
                    . I love building websites and apps that are both
                    user-friendly and powerful under the hood. Think of me as
                    someone who enjoys creating digital solutions that make
                    people&apos;s lives easier! I&apos;m passionate about
                    working with teams to bring creative ideas to life and
                    always excited to learn and try new things in the tech
                    world. Whether it&apos;s making beautiful websites or
                    solving complex technical challenges, I&apos;m your guy!
                  </p>
                  <div className='btn-bar'>
                    <a
                      className='px-btn px-btn-theme'
                      href='/assets/akshay-cv.pdf'
                      download
                    >
                      Download CV
                    </a>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 d-none d-sm-block'>
                <div className='hb-img'>
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
      </section>
    </Layout>
  );
}
