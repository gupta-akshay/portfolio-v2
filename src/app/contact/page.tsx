'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faMapMarkerAlt,
  faMobile,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import ContactFormInteractive from '@/app/components/ContactFormInteractive';
import MapSection from '@/app/components/MapSection';

export default function Contact() {
  return (
    <Layout>
      <Toaster />
      <section
        id='contact'
        data-nav-tooltip='Contact Me'
        className='pp-section pp-scrollable section dark-bg'
      >
        <div className='container'>
          <div className='title'>
            <h3>Get in touch.</h3>
          </div>
          <div className='row'>
            <div className='col-lg-5 col-xl-4 m-15px-tb'>
              <div className='contact-info'>
                <h4>Let&apos;s Connect. Share your vision.</h4>
                <p>
                  I&apos;m here for collaboration and opportunities. Whether
                  it&apos;s a game-changing project or an exciting full-time
                  role, let&apos;s talk.
                </p>
                <ul>
                  <li className='media'>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt as IconProp}
                      fontSize={20}
                    />
                    <span className='media-body'>
                      Ujjain, Madhya Pradesh, India
                    </span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faEnvelope as IconProp} />
                    <span className='media-body'>contact@akshaygupta.live</span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faMobile as IconProp} />
                    <span className='media-body'>+91 88199 45982</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-7 col-xl-8 m-15px-tb'>
              <ContactFormInteractive />
            </div>
            <MapSection />
          </div>
        </div>
      </section>
    </Layout>
  );
}
