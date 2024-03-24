import Image from 'next/image';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';

export default function AboutSection() {
  return (
    <section
      id='about'
      data-nav-tooltip='About'
      className='pp-section pp-scrollable section about-section'
    >
      <div className='container'>
        <div className='row align-items-center justify-content-center'>
          <div className='col-lg-6 m-15px-tb'>
            <div className='about-img'>
              <Image
                src='/images/the-office.webp'
                alt='about-image'
                width={560}
                height={560}
                style={{ objectFit: 'cover' }}
                priority={true}
              />
            </div>
          </div>
          <div className='col-lg-6 m-15px-tb'>
            <div className='about-info'>
              <div className='title'>
                <h3>About me.</h3>
              </div>
              <div className='about-text'>
                <h4>Greetings from the Digital Realm!</h4>
                <p>
                  I&apos;m a code conjurer and pixel whisperer, otherwise known
                  as a Full Stack Web Developer, crafting digital wonders from
                  the comfort of my abode. Currently weaving web magic with the
                  brilliant minds at PeopleGrove, I boast over 6 years of
                  navigating the mystical lands of syntax and semicolons. My
                  quest? To forge seamless user experiences and top-tier digital
                  marvels, all while keeping an eye out for the elusive perfect
                  line of code.
                </p>
                <p>
                  When not in the throes of development, you can find me
                  orchestrating electronic symphonies or moonlighting as a DJ,
                  where the beats are as dynamic as my code. My love for gaming
                  knows no bounds, be it console wars or the peace of PC realms.
                  And when the screens fade to black, I&apos;m off to sandy
                  shores and salty breezes, with Goa being my sanctuary from the
                  binary world. Because after all, even a web wizard needs a
                  haven to recharge their creative spells.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='separator' />
        <div className='title'>
          <h3>Skills</h3>
        </div>
        <Skills />
        <div className='separator' />
        <div className='title'>
          <h3>Experience</h3>
        </div>
        <Experience />
      </div>
    </section>
  );
}
