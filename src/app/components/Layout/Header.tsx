'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
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

const Header = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

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
            onClick={() => setSideBarToggle(!sideBarToggle)}
            aria-label={`${sideBarToggle ? 'close' : 'open'} menu`}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {/* End Mobile Header */}
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
              <Link className='nav-link' href='/'>
                <FontAwesomeIcon
                  icon={faHouse as IconProp}
                  height={20}
                  width={20}
                />
                <span>Home</span>
              </Link>
            </li>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <Link className='nav-link' href='/about'>
                <FontAwesomeIcon
                  icon={faIdBadge as IconProp}
                  height={20}
                  width={20}
                />
                <span>About Me</span>
              </Link>
            </li>
            <li className={activeSection === 'blog' ? 'active' : ''}>
              <Link className='nav-link' href='/blog'>
                <FontAwesomeIcon
                  icon={faBlog as IconProp}
                  height={20}
                  width={20}
                />
                <span>Blogs</span>
              </Link>
            </li>
            <li className={activeSection === 'music' ? 'active' : ''}>
              <Link className='nav-link' href='/music'>
                <FontAwesomeIcon
                  icon={faMusic as IconProp}
                  height={20}
                  width={20}
                />
                <span>My Music</span>
              </Link>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <Link className='nav-link' href='/contact'>
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
          >
            <FontAwesomeIcon icon={faGithub as IconProp} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/akshayguptaujn'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Linkedin'
          >
            <FontAwesomeIcon icon={faLinkedin as IconProp} />
          </Link>
          <Link
            href='https://medium.com/@akshaygupta.live'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Medium'
          >
            <FontAwesomeIcon icon={faMedium as IconProp} />
          </Link>
          <Link
            href='https://dev.to/akshay_gupta'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Dev.to'
          >
            <FontAwesomeIcon icon={faDev as IconProp} />
          </Link>
          <Link
            href='https://www.instagram.com/dja_shay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
          >
            <FontAwesomeIcon icon={faInstagram as IconProp} />
          </Link>
          <Link
            href='https://www.facebook.com/deejay.ashay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
          >
            <FontAwesomeIcon icon={faFacebook as IconProp} />
          </Link>
          <Link
            href='https://soundcloud.com/deejay-a-shay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Soundcloud'
          >
            <FontAwesomeIcon icon={faSoundcloud as IconProp} />
          </Link>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
