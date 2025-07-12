import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faMapMarkerAlt,
  faMobile,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Layout from '@/app/components/Layout';
import ContactFormInteractive from '@/app/components/ContactFormInteractive';
import MapSection from '@/app/components/MapSection';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live/contact'),
  title: 'Contact | Akshay Gupta',
  description:
    'Get in touch with me for collaboration opportunities, freelance projects, or just to say hello!',
  openGraph: {
    title: 'Contact Akshay Gupta | Full-Stack Developer',
    description:
      'Get in touch with me for collaboration opportunities, freelance projects, or just to say hello!',
    url: 'https://akshaygupta.live/contact',
    siteName: 'Akshay Gupta Portfolio',
    images: [
      {
        url: 'https://akshaygupta.live/contact/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Akshay Gupta',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Akshay Gupta | Full-Stack Developer',
    description:
      'Get in touch with me for collaboration opportunities, freelance projects, or just to say hello!',
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/contact/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live/contact',
  },
};

export default function Contact() {
  return (
    <Layout>
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
