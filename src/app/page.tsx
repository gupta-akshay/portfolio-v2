import Image from 'next/image';
import TypingAnimation from '@/app/components/TypingAnimation';
import Layout from '@/app/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section
        id='home'
        data-nav-tooltip='Home'
        className='pp-section pp-scrollable'
      >
        <div className='home-banner'>
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
                    As a Staff Engineer at{' '}
                    <a
                      href='https://www.peoplegrove.com'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      PeopleGrove
                    </a>
                    , I excel in delivering seamless, scalable digital
                    experiences. My comprehensive expertise in software
                    development ranges from crafting intricate user interfaces
                    to engineering robust backend architectures. I am dedicated
                    to leveraging Agile methodologies to foster innovation and
                    achieve excellence in every endeavor, ensuring our solutions
                    not only satisfy user needs but also remain ahead of the
                    curve, ready for future advancements.
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
                    alt='Akshay Gupta - Staff Engineer at PeopleGrove'
                    width={600}
                    height={600}
                    loading='lazy'
                    priority
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
