import Image from 'next/image';
import TypingAnimation from '@/app/components/TypingAnimation';

export default function HomeSection() {
  return (
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
                <h1 className='font-alt'>Akshay Gupta</h1>
                <p className='lead'>
                  I am <TypingAnimation />
                </p>
                <p className='desc'>
                  I am currently working as an Staff Engineer at{' '}
                  <a href='https://www.peoplegrove.com' target='_blank'>
                    PeopleGrove
                  </a>
                  . I specialize in crafting seamless and scalable digital
                  experiences. My expertise spans the full spectrum of software
                  development, from intricate front-end interfaces to robust
                  back-end systems. With a firm belief in the power of Agile
                  methodologies, I am committed to driving innovation and
                  excellence in every project. My passion lies in building
                  solutions that not only meet the immediate needs of our users
                  but also anticipate future challenges and opportunities.
                </p>
                <div className='btn-bar'>
                  <a className='px-btn px-btn-theme' href='#'>
                    Donwload CV
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
