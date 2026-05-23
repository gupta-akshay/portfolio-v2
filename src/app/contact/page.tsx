'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className='title'>
            <h3>Contact</h3>
          </div>
          <div className='row'>
            <div className='col-lg-5 col-xl-4 m-15px-tb'>
              <div className='contact-info route-shell'>
                <h4>Let&apos;s connect</h4>
                <p>
                  I am open to high-impact product collaborations, engineering
                  leadership roles, and strategic consulting engagements.
                </p>
                <ul>
                  <li className='media'>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt as IconProp}
                      fontSize={20}
                    />
                    <span className='media-body'>
                      Mumbai, Maharashtra, India
                    </span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faEnvelope as IconProp} />
                    <span className='media-body'>
                      <a href='mailto:contact@akshaygupta.live'>
                        contact@akshaygupta.live
                      </a>
                    </span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faEnvelope as IconProp} />
                    <span className='media-body'>
                      <a href='mailto:akshaygupta.live@gmail.com'>
                        akshaygupta.live@gmail.com
                      </a>
                    </span>
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
