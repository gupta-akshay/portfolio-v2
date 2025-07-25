import type { Metadata } from 'next';
import Image from 'next/image';
import Layout from '@/app/components/Layout';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';
import AboutContentInteractive from '@/app/components/AboutContentInteractive';
import {
  InteractiveBackground,
  MagneticHover,
  RippleEffect,
  ScrollAnimation,
  StaggerAnimation,
  GitHubCalendar,
} from '@/app/components';

import styles from '../styles/sections/aboutSection.module.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live'),
  title: 'About | Akshay Gupta',
  description:
    'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, experience, and what drives me in web development.',
  openGraph: {
    type: 'profile',
    title: 'About Akshay Gupta | Full-Stack Developer',
    description:
      'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, experience, and what drives me in web development.',
    url: 'https://akshaygupta.live/about',
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
    title: 'About Akshay Gupta | Full-Stack Developer',
    description:
      'Learn about my journey as a Senior Staff Engineer at PeopleGrove, my skills, experience, and what drives me in web development.',
    creator: '@ashay_music',
    images: ['/about/opengraph-image'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live/about',
  },
};

const calculateExperience = (): number => {
  const startDate = new Date('2017-09-13').getTime();
  const currentDate = new Date().getTime();
  return Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365));
};

const EducationAndSkills = () => (
  <>
    <div className='separator' />
    <ScrollAnimation animation='fadeIn' duration={0.8}>
      <div className='title'>
        <h3>My Background & What I&apos;m Good At</h3>
      </div>
    </ScrollAnimation>
    <StaggerAnimation staggerDelay={0.2}>
      <div className='row'>
        <div className='col-lg-4 m-15px-tb'>
          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.2}>
            <ul className={styles.educationBox}>
              <li>
                <span>2013-2017</span>
                <h6>Bachelor of Engineering in Computer Science</h6>
                <p>RGPV, India</p>
              </li>
              <li>
                <span>2013</span>
                <h6>High School Diploma</h6>
                <p>Central Board of Secondary Education</p>
              </li>
            </ul>
          </ScrollAnimation>
        </div>
        <div className='col-lg-7 ml-auto m-15px-tb'>
          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.4}>
            <div className={styles.skillsBox}>
              <h3>What I Can Do</h3>
              <p>
                I love building websites and apps from start to finish! Over the
                years, I&apos;ve learned to use many different tools to create
                amazing things on the internet.
              </p>
              <Skills />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </StaggerAnimation>
  </>
);

export default function About() {
  const yearsOfExperience = calculateExperience();

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
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <InteractiveBackground
          variant='grid'
          count={15}
          color='#2fbf71'
          size={40}
          speed={0.5}
          intensity={0.4}
          interactive={true}
          className='about-background'
        />
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <StaggerAnimation staggerDelay={0.3}>
            <div className='row align-items-center justify-content-center'>
              <div className='col-lg-6 m-15px-tb d-none d-sm-block'>
                <ScrollAnimation
                  animation='slideLeft'
                  duration={1.0}
                  delay={0.3}
                >
                  <div className={styles.aboutImg}>
                    <Image
                      src='/images/about-me.png'
                      alt='about-image'
                      width={560}
                      height={560}
                      loading='lazy'
                      style={{ objectFit: 'cover', width: '100%' }}
                    />
                  </div>
                </ScrollAnimation>
              </div>
              <div className='col-lg-6 m-15px-tb'>
                <div className={styles.aboutInfo}>
                  <ScrollAnimation
                    animation='fadeIn'
                    duration={0.8}
                    scrollReveal={true}
                  >
                    <div className='title' style={{ marginBottom: '50px' }}>
                      <h3>Let me introduce myself!</h3>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation
                    animation='slideUp'
                    duration={0.8}
                    delay={0.2}
                  >
                    <div className={styles.aboutText}>
                      <h4>Hi there! 👋</h4>
                      <p>
                        I&apos;m a web developer at PeopleGrove, where I&apos;ve
                        spent the last {yearsOfExperience} years creating cool
                        stuff for the internet! I love making websites that are
                        not just beautiful but also super easy to use. It&apos;s
                        like building digital playgrounds where everything just
                        works smoothly!
                      </p>
                      <p>
                        When I&apos;m not coding, you&apos;ll find me mixing
                        beats and DJing - it&apos;s my creative escape! I&apos;m
                        also a big gaming fan, whether it&apos;s getting lost in
                        console adventures or relaxing with some PC games. And
                        whenever I need to recharge, I head to my favorite spot
                        - the beautiful beaches of Goa. There&apos;s nothing
                        like the sound of waves to refresh your mind! 🌊
                      </p>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation animation='scale' duration={0.8} delay={0.4}>
                    <div className={styles.btnBar}>
                      <MagneticHover intensity={0.4} glowEffect={true}>
                        <RippleEffect>
                          <AboutContentInteractive>
                            <span>Let&apos;s Work Together!</span>
                          </AboutContentInteractive>
                        </RippleEffect>
                      </MagneticHover>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </div>
          </StaggerAnimation>
          <EducationAndSkills />
          <div className='separator' />
          <ScrollAnimation animation='fadeIn' duration={0.8}>
            <Experience />
          </ScrollAnimation>
          <div className='separator' />
          <GitHubCalendar username='gupta-akshay' />
        </div>
      </section>
    </Layout>
  );
}
