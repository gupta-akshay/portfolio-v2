'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBlog,
  faHouse,
  faIdBadge,
  faMapLocation,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faSoundcloud,
  faInstagram,
  faFacebook,
  faMedium,
  faDev,
} from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

const Header = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const { addCursorInteraction } = useCursorInteractions();

  // Navigation refs
  const homeRef = useRef<HTMLAnchorElement>(null);
  const aboutRef = useRef<HTMLAnchorElement>(null);
  const blogRef = useRef<HTMLAnchorElement>(null);
  const musicRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);

  // Social media refs
  const githubRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);
  const mediumRef = useRef<HTMLAnchorElement>(null);
  const devRef = useRef<HTMLAnchorElement>(null);
  const instagramRef = useRef<HTMLAnchorElement>(null);
  const facebookRef = useRef<HTMLAnchorElement>(null);
  const soundcloudRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Add cursor interactions
  useEffect(() => {
    // Navigation links
    if (homeRef.current) {
      addCursorInteraction(homeRef.current, {
        onHover: 'hover',
        onText: 'Go to Home',
        onClick: 'click',
      });
    }

    if (aboutRef.current) {
      addCursorInteraction(aboutRef.current, {
        onHover: 'hover',
        onText: 'Learn about me',
        onClick: 'click',
      });
    }

    if (blogRef.current) {
      addCursorInteraction(blogRef.current, {
        onHover: 'hover',
        onText: 'Read my blog posts',
        onClick: 'click',
      });
    }

    if (musicRef.current) {
      addCursorInteraction(musicRef.current, {
        onHover: 'hover',
        onText: 'Listen to my music',
        onClick: 'click',
      });
    }

    if (contactRef.current) {
      addCursorInteraction(contactRef.current, {
        onHover: 'hover',
        onText: 'Get in touch',
        onClick: 'click',
      });
    }

    // Social media links
    if (githubRef.current) {
      addCursorInteraction(githubRef.current, {
        onHover: 'hover',
        onText: 'View GitHub profile',
        onClick: 'click',
      });
    }

    if (linkedinRef.current) {
      addCursorInteraction(linkedinRef.current, {
        onHover: 'hover',
        onText: 'Connect on LinkedIn',
        onClick: 'click',
      });
    }

    if (mediumRef.current) {
      addCursorInteraction(mediumRef.current, {
        onHover: 'hover',
        onText: 'Read on Medium',
        onClick: 'click',
      });
    }

    if (devRef.current) {
      addCursorInteraction(devRef.current, {
        onHover: 'hover',
        onText: 'Check out Dev.to',
        onClick: 'click',
      });
    }

    if (instagramRef.current) {
      addCursorInteraction(instagramRef.current, {
        onHover: 'hover',
        onText: 'Follow on Instagram',
        onClick: 'click',
      });
    }

    if (facebookRef.current) {
      addCursorInteraction(facebookRef.current, {
        onHover: 'hover',
        onText: 'Like on Facebook',
        onClick: 'click',
      });
    }

    if (soundcloudRef.current) {
      addCursorInteraction(soundcloudRef.current, {
        onHover: 'hover',
        onText: 'Listen on SoundCloud',
        onClick: 'click',
      });
    }

    if (logoRef.current) {
      addCursorInteraction(logoRef.current, {
        onHover: 'hover',
        onText: 'Go to home',
        onClick: 'click',
      });
    }
  }, [addCursorInteraction]);

  useEffect(() => {
    switch (true) {
      case pathname === '/about':
        setActiveSection('about');
        break;
      case pathname === '/contact':
        setActiveSection('contact');
        break;
      case pathname === '/blog' || pathname.startsWith('/blog/'):
        setActiveSection('blog');
        break;
      case pathname === '/music':
        setActiveSection('music');
        break;
      default:
        setActiveSection('home');
        break;
    }

    return () => setActiveSection('home');
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sideBarToggle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sideBarToggle]);

  const handleSidebarToggle = () => {
    setSideBarToggle(!sideBarToggle);
  };

  const handleOverlayClick = () => {
    setSideBarToggle(false);
  };

  return (
    <Fragment>
      {/* Mobile Header */}
      <div className='mob-header' role='banner'>
        <div className='d-flex'>
          <div className='navbar-brand'>
            <Link href='/' ref={logoRef}>
              <span className='logo-text'>Akshay</span>
            </Link>
          </div>
          <button
            className={`toggler-menu ${sideBarToggle ? 'open' : ''}`}
            onClick={handleSidebarToggle}
            aria-label={`${sideBarToggle ? 'close' : 'open'} menu`}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {/* End Mobile Header */}

      {/* Overlay for mobile sidebar */}
      {sideBarToggle && (
        <div
          className='sidebar-overlay'
          onClick={handleOverlayClick}
          aria-hidden='true'
        />
      )}

      <header
        className={`header-left ${
          sideBarToggle ? 'menu-open menu-open-desk' : ''
        }`}
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='scroll-bar'>
          <div className='hl-top'>
            <div className='hl-logo'>
              <div className='img'>
                <Image
                  src='/images/header.webp'
                  alt='Navbar Image'
                  height={120}
                  width={120}
                  loading='lazy'
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              </div>
              <h5>Akshay Gupta</h5>
            </div>
          </div>
          <ul className='nav nav-menu' id='pp-menu'>
            <li className={activeSection === 'home' ? 'active' : ''}>
              <Link
                className='nav-link'
                href='/'
                onClick={() => setSideBarToggle(false)}
                ref={homeRef}
              >
                <FontAwesomeIcon
                  icon={faHouse as IconProp}
                  height={20}
                  width={20}
                />
                <span>Home</span>
              </Link>
            </li>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <Link
                className='nav-link'
                href='/about'
                onClick={() => setSideBarToggle(false)}
                ref={aboutRef}
              >
                <FontAwesomeIcon
                  icon={faIdBadge as IconProp}
                  height={20}
                  width={20}
                />
                <span>About Me</span>
              </Link>
            </li>
            <li className={activeSection === 'blog' ? 'active' : ''}>
              <Link
                className='nav-link'
                href='/blog'
                onClick={() => setSideBarToggle(false)}
                ref={blogRef}
              >
                <FontAwesomeIcon
                  icon={faBlog as IconProp}
                  height={20}
                  width={20}
                />
                <span>Blogs</span>
              </Link>
            </li>
            <li className={activeSection === 'music' ? 'active' : ''}>
              <Link
                className='nav-link'
                href='/music'
                onClick={() => setSideBarToggle(false)}
                ref={musicRef}
              >
                <FontAwesomeIcon
                  icon={faMusic as IconProp}
                  height={20}
                  width={20}
                />
                <span>My Music</span>
              </Link>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <Link
                className='nav-link'
                href='/contact'
                onClick={() => setSideBarToggle(false)}
                ref={contactRef}
              >
                <FontAwesomeIcon
                  icon={faMapLocation as IconProp}
                  height={20}
                  width={20}
                />
                <span>Contact Me</span>
              </Link>
            </li>
          </ul>
        </div>
        <div
          className='nav justify-content-center social-icons'
          aria-label='Social media links'
        >
          <Link
            href='https://github.com/gupta-akshay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Github'
            ref={githubRef}
          >
            <FontAwesomeIcon icon={faGithub as IconProp} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/akshayguptaujn'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Linkedin'
            ref={linkedinRef}
          >
            <FontAwesomeIcon icon={faLinkedin as IconProp} />
          </Link>
          <Link
            href='https://medium.com/@akshaygupta.live'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Medium'
            ref={mediumRef}
          >
            <FontAwesomeIcon icon={faMedium as IconProp} />
          </Link>
          <Link
            href='https://dev.to/akshay_gupta'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Dev.to'
            ref={devRef}
          >
            <FontAwesomeIcon icon={faDev as IconProp} />
          </Link>
          <Link
            href='https://www.instagram.com/dja_shay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
            ref={instagramRef}
          >
            <FontAwesomeIcon icon={faInstagram as IconProp} />
          </Link>
          <Link
            href='https://www.facebook.com/deejay.ashay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
            ref={facebookRef}
          >
            <FontAwesomeIcon icon={faFacebook as IconProp} />
          </Link>
          <Link
            href='https://soundcloud.com/dj_ashay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Soundcloud'
            ref={soundcloudRef}
          >
            <FontAwesomeIcon icon={faSoundcloud as IconProp} />
          </Link>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
