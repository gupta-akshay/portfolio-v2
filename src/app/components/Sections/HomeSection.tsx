import Image from 'next/image';
import TypingAnimation from '@/app/components/TypingAnimation';
import ParticlesBackground from '@/app/components/ParticlesBackground';

export default function HomeSection() {
  return (
    <section
      id='home'
      data-nav-tooltip='Home'
      className='pp-section pp-scrollable'
    >
      <div className='home-banner'>
        <ParticlesBackground />
        <div className='container'>
          <div className='row full-screen align-items-center'>
            <div className='col-lg-6'>
              <div className='type-box'>
                <h6>Hello, I am</h6>
                <h1 className='font-alt'>Akshay Gupta</h1>
                <p className='lead'>
                  I am <TypingAnimation />
                </p>
                <p className='desc'>
                  As a Staff Engineer at{' '}
                  <a href='https://www.peoplegrove.com' target='_blank'>
                    PeopleGrove
                  </a>
                  , I excel in delivering seamless, scalable digital
                  experiences. My comprehensive expertise in software
                  development ranges from crafting intricate user interfaces to
                  engineering robust backend architectures. I am dedicated to
                  leveraging Agile methodologies to foster innovation and
                  achieve excellence in every endeavor, ensuring our solutions
                  not only satisfy user needs but also remain ahead of the
                  curve, ready for future advancements.
                </p>
                <div className='btn-bar'>
                  <a
                    className='px-btn px-btn-theme'
                    href='/assets/akshay-resume.pdf'
                    download
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='hb-img'>
                <Image
                  src='/images/home-banner.jpg'
                  alt='banner-image'
                  width={540}
                  height={540}
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
