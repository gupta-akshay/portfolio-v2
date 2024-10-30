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
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faSoundcloud,
  faInstagram,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';

const Header = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/blog')) {
      setActiveSection('blog');
      return;
    }

    switch (pathname) {
      case '/about':
        setActiveSection('about');
        break;
      case '/contact':
        setActiveSection('contact');
        break;
      case '/blog':
        setActiveSection('blog');
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
      <div className='mob-header'>
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
                  style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}
                />
              </div>
              <h5>Akshay Gupta</h5>
            </div>
          </div>
          <ul className='nav nav-menu' id='pp-menu'>
            <li className={activeSection === 'home' ? 'active' : ''}>
              <Link className='nav-link' href='/'>
                <FontAwesomeIcon icon={faHouse} height={20} width={20} />
                <span>Home</span>
              </Link>
            </li>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <Link className='nav-link' href='/about'>
                <FontAwesomeIcon icon={faIdBadge} height={20} width={20} />
                <span>About Me</span>
              </Link>
            </li>
            <li className={activeSection === 'blog' ? 'active' : ''}>
              <Link className='nav-link' href='/blog'>
                <FontAwesomeIcon icon={faBlog} height={20} width={20} />
                <span>Blogs</span>
              </Link>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <Link className='nav-link' href='/contact'>
                <FontAwesomeIcon icon={faMapLocation} height={20} width={20} />
                <span>Contact Me</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className='nav justify-content-center social-icons'>
          <Link
            href='https://github.com/gupta-akshay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Github'
          >
            <FontAwesomeIcon icon={faGithub} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/akshayguptaujn'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Linkedin'
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </Link>
          <Link
            href='https://www.instagram.com/dja_shay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
          >
            <FontAwesomeIcon icon={faInstagram} />
          </Link>
          <Link
            href='https://www.facebook.com/deejay.ashay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
          >
            <FontAwesomeIcon icon={faFacebook} />
          </Link>
          <Link
            href='https://soundcloud.com/deejay-a-shay'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Soundcloud'
          >
            <FontAwesomeIcon icon={faSoundcloud} />
          </Link>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
