'use client';

import Icon from '@/app/components/Icon/Icon';
import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import ContactFormInteractive from '@/app/components/ContactFormInteractive';
import MapSection from '@/app/components/MapSection';
import { contactContent, socialLinks } from '@/lib/site-content';

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
          <div className='contact-eyebrow'>Contact</div>
          <h1 className='contact-heading'>
            {contactContent.heading}
            <span>.</span>
          </h1>
          <p className='contact-intro'>{contactContent.intro}</p>

          <div className='contact-grid'>
            <div className='contact-aside route-shell'>
              <div className='contact-card'>
                <span className='contact-card-icon'>
                  <Icon name='map-marker-alt' />
                </span>
                <div>
                  <div className='contact-card-label'>Based in</div>
                  <div className='contact-card-value'>
                    {contactContent.location}
                  </div>
                </div>
              </div>

              <div className='contact-card'>
                <span className='contact-card-icon'>
                  <Icon name='envelope' />
                </span>
                <div>
                  <div className='contact-card-label'>Email</div>
                  <div className='contact-card-value contact-emails'>
                    {contactContent.emails.map((email) => (
                      <a key={email} href={`mailto:${email}`}>
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className='contact-card contact-card-block'>
                <div className='contact-card-label'>Elsewhere</div>
                <div className='contact-socials'>
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {/* Brand marks keep their own colour; the monochrome
                          ones inherit the theme's ink */}
                      <span
                        className='contact-social-icon'
                        {...('color' in social
                          ? { style: { color: social.color } }
                          : {})}
                      >
                        <Icon name={social.icon} />
                      </span>
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <ContactFormInteractive />
          </div>

          <MapSection />
        </div>
      </section>
    </Layout>
  );
}
