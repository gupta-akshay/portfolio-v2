import type { Metadata } from 'next';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live/about'),
  title: 'About | Akshay Gupta',
  description:
    'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, experience, and what drives me in web development.',
  twitter: {
    card: 'summary_large_image',
    title: 'About Akshay Gupta | Full-Stack Developer',
    description:
      'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, and experience.',
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/about/opengraph-image'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live/about',
  },
};

const calculateExperience = (): number => {
  const startDate = new Date('2017-09-13').getTime();
  const currentDate = new Date().getTime();
  const diffInMilliseconds = currentDate - startDate;
  const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(diffInYears);
};

const EducationAndSkills = () => (
  <>
    <div className='separator' />
    <div className='title'>
      <h3>My Background & What I&apos;m Good At</h3>
    </div>
    <div className='row'>
      <div className='col-lg-4 m-15px-tb'>
        <ul className='education-box'>
          <li>
            <span>2013-2017</span>
            <h6>Computer Science Degree</h6>
            <p>RGPV, India</p>
          </li>
          <li>
            <span>2013</span>
            <h6>High School Diploma</h6>
            <p>Central Board of Secondary Education</p>
          </li>
        </ul>
      </div>
      <div className='col-lg-7 ml-auto m-15px-tb'>
        <div className='skills-box'>
          <h3>What I Can Do</h3>
          <p>
            I love building websites and apps from start to finish! Over the
            years, I&apos;ve learned to use many different tools to create
            amazing things on the internet.
          </p>
          <Skills />
        </div>
      </div>
    </div>
  </>
);

export default function About() {
  const yearsOfExperience = useMemo(calculateExperience, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Akshay Gupta',
    description:
      'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, experience, and what drives me in web development.',
    mainEntity: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      jobTitle: 'Senior Staff Engineer',
      worksFor: {
        '@type': 'Organization',
        name: 'PeopleGrove',
        url: 'https://www.peoplegrove.com',
      },
      url: 'https://akshaygupta.live',
      image: 'https://akshaygupta.live/images/about-me.png',
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
      >
        <div className='container'>
          <div className='row align-items-center justify-content-center'>
            <div className='col-lg-6 m-15px-tb d-none d-sm-block'>
              <div className='about-img'>
                <Image
                  src='/images/about-me.png'
                  alt='about-image'
                  width={560}
                  height={560}
                  loading='lazy'
                  style={{ objectFit: 'cover', width: '100%' }}
                />
              </div>
            </div>
            <div className='col-lg-6 m-15px-tb'>
              <div className='about-info'>
                <div className='title'>
                  <h3>Let me introduce myself!</h3>
                </div>
                <div className='about-text'>
                  <h4>Hi there! 👋</h4>
                  <p>
                    I&apos;m a web developer at PeopleGrove, where I&apos;ve
                    spent the last {yearsOfExperience} years creating cool stuff
                    for the internet! I love making websites that are not just
                    beautiful but also super easy to use. It&apos;s like
                    building digital playgrounds where everything just works
                    smoothly!
                  </p>
                  <p>
                    When I&apos;m not coding, you&apos;ll find me mixing beats
                    and DJing - it&apos;s my creative escape! I&apos;m also a
                    big gaming fan, whether it&apos;s getting lost in console
                    adventures or relaxing with some PC games. And whenever I
                    need to recharge, I head to my favorite spot - the beautiful
                    beaches of Goa. There&apos;s nothing like the sound of waves
                    to refresh your mind! 🌊
                  </p>
                  <div className='btn-bar'>
                    <Link className='px-btn px-btn-theme' href='/contact'>
                      <span>Let&apos;s Work Together!</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EducationAndSkills />
          <div className='separator' />
          <Experience />
        </div>
      </section>
    </Layout>
  );
}
