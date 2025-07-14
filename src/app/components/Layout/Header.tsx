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
import { useHoverPrefetch } from '@/app/hooks/useHoverPrefetch';
import { useEasterEgg } from '@/app/context/EasterEggContext';
import BuyMeACoffee from '../BuyMeACoffee';

const Header = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);
  const pathname = usePathname();
  const { addCursorInteraction } = useCursorInteractions();
  const { toggleDiscoMode } = useEasterEgg();

  // Hover prefetch for main navigation pages
  const {
    handleMouseEnter: handleBlogMouseEnter,
    handleMouseLeave: handleBlogMouseLeave,
  } = useHoverPrefetch('/blog', {
    delay: 100,
    enabled: true,
  });

  // Social media refs
  const githubRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);
  const mediumRef = useRef<HTMLAnchorElement>(null);
  const devRef = useRef<HTMLAnchorElement>(null);
  const instagramRef = useRef<HTMLAnchorElement>(null);
  const facebookRef = useRef<HTMLAnchorElement>(null);
  const soundcloudRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Social media links
    if (githubRef.current) {
      const cleanup = addCursorInteraction(githubRef.current, {
        onHover: 'subtle',
        onText: 'GitHub',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (linkedinRef.current) {
      const cleanup = addCursorInteraction(linkedinRef.current, {
        onHover: 'subtle',
        onText: 'LinkedIn',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (mediumRef.current) {
      const cleanup = addCursorInteraction(mediumRef.current, {
        onHover: 'subtle',
        onText: 'Medium',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (devRef.current) {
      const cleanup = addCursorInteraction(devRef.current, {
        onHover: 'subtle',
        onText: 'Dev.to',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (instagramRef.current) {
      const cleanup = addCursorInteraction(instagramRef.current, {
        onHover: 'subtle',
        onText: 'Instagram',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (facebookRef.current) {
      const cleanup = addCursorInteraction(facebookRef.current, {
        onHover: 'subtle',
        onText: 'Facebook',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (soundcloudRef.current) {
      const cleanup = addCursorInteraction(soundcloudRef.current, {
        onHover: 'subtle',
        onText: 'SoundCloud',
        onClick: 'click',
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    // Return cleanup function that calls all individual cleanup functions
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
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

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (newCount === 5) {
      toggleDiscoMode();
      setLogoClickCount(0); // Reset counter
    }
  };

  return (
    <Fragment>
      {/* Mobile Header */}
      <div className='mob-header' role='banner'>
        <div className='d-flex'>
          <div className='navbar-brand'>
            <Link href='/'>
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
        className={`header-left ${sideBarToggle ? 'menu-open menu-open-desk' : ''}`}
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='scroll-bar'>
          <div className='hl-top'>
            <div
              className='hl-logo'
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
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
                onMouseEnter={handleBlogMouseEnter}
                onMouseLeave={handleBlogMouseLeave}
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
        <div className='nav justify-content-center buy-me-coffee-section'>
          <BuyMeACoffee />
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
