import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';
import { useMemo } from 'react';

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
      <h3>Education & Skills</h3>
    </div>
    <div className='row'>
      <div className='col-lg-4 m-15px-tb'>
        <ul className='education-box'>
          <li>
            <span>2013-2017</span>
            <h6>Bachelor of Engineering in Computer Science</h6>
            <p>RGPV, India</p>
          </li>
          <li>
            <span>2013</span>
            <h6>Higher Secondary Certification</h6>
            <p>Central Board of Secondary Education</p>
          </li>
        </ul>
      </div>
      <div className='col-lg-7 ml-auto m-15px-tb'>
        <div className='skills-box'>
          <h3>My Skills</h3>
          <p>
            Leveraging a solid foundation in full-stack development, I excel in
            applying a variety of tech stacks to create dynamic and efficient
            applications.
          </p>
          <Skills />
        </div>
      </div>
    </div>
  </>
);

export default function About() {
  const yearsOfExperience = useMemo(calculateExperience, []);

  return (
    <Layout>
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
                  style={{ objectFit: 'cover' }}
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
                    As a seasoned Full Stack Web Developer at PeopleGrove, I
                    blend over {yearsOfExperience} years of experience with a
                    flair for creating immersive digital environments. My
                    journey is marked by an unwavering commitment to
                    user-centric design and the pursuit of coding perfection.
                  </p>
                  <p>
                    Beyond the realm of development, my passions extend to music
                    production and DJing—hobbies where rhythm and innovation
                    play in harmony. I&apos;m also an avid gamer, appreciative
                    of both console challenges and the tranquility of PC gaming.
                    To unwind, I retreat to the serene beaches of Goa, my
                    personal refuge from the digital storm, where I rejuvenate
                    my creativity.
                  </p>
                  <div className='btn-bar'>
                    <Link className='px-btn px-btn-theme' href='/contact'>
                      <span>Hire Me</span>
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
