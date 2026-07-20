'use client';

import Icon from '@/app/components/Icon/Icon';
import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import ContactFormInteractive from '@/app/components/ContactFormInteractive';
import MapSection from '@/app/components/MapSection';
import { contactContent } from '@/lib/site-content';

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
                <h4>{contactContent.heading}</h4>
                <p>{contactContent.intro}</p>
                <ul>
                  <li className='media'>
                    <Icon name='map-marker-alt' fontSize={20} />
                    <span className='media-body'>
                      {contactContent.location}
                    </span>
                  </li>
                  {contactContent.emails.map((email) => (
                    <li key={email} className='media'>
                      <Icon name='envelope' />
                      <span className='media-body'>
                        <a href={`mailto:${email}`}>{email}</a>
                      </span>
                    </li>
                  ))}
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
