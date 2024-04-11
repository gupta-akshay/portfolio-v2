'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
import { activeSection } from '@/app/utils';

const Header = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  useEffect(() => {
    activeSection();
  }, []);

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
                  src='/images/the-office.webp'
                  alt='Navbar Image'
                  height={120}
                  width={120}
                  priority={true}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h5>Akshay Gupta</h5>
            </div>
          </div>
          <ul className='nav nav-menu' id='pp-menu'>
            <li data-menuanchor='home' className='active'>
              <a className='nav-link' href='#home'>
                <FontAwesomeIcon icon={faHouse} height={20} width={20} />
                <span>Home</span>
              </a>
            </li>
            <li data-menuanchor='about'>
              <a className='nav-link' href='#about'>
                <FontAwesomeIcon icon={faIdBadge} height={20} width={20} />
                <span>About Me</span>
              </a>
            </li>
            <li data-menuanchor='contactus'>
              <a className='nav-link' href='#contact'>
                <FontAwesomeIcon icon={faMapLocation} height={20} width={20} />
                <span>Contact Me</span>
              </a>
            </li>
            {/* <li data-menuanchor='services'>
              <a className='nav-link' href='#services'>
                <i className='ti-panel' />
                <span>Services</span>
              </a>
            </li>
            <li data-menuanchor='work'>
              <a className='nav-link' href='#work'>
                <i className='ti-bookmark-alt' />
                <span>Portfolio</span>
              </a>
            </li>
            <li data-menuanchor='blog' className='blog'>
              <a className='nav-link' href='#blog'>
                <i className='ti-layout-media-overlay-alt-2' />
                <span>Blogs</span>
              </a>
            </li>*/}
          </ul>
        </div>
        <div className='nav justify-content-center social-icons'>
          <Link
            href='https://github.com/gupta-akshay'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faGithub} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/akshayguptaujn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </Link>
          <Link
            href='https://www.instagram.com/dja_shay'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faInstagram} />
          </Link>
          <Link
            href='https://www.facebook.com/deejay.ashay'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faFacebook} />
          </Link>
          <Link
            href='https://soundcloud.com/deejay-a-shay'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faSoundcloud} />
          </Link>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
