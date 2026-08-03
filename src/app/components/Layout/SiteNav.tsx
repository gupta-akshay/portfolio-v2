'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '@/app/components/Icon/Icon';
import { useTheme } from '@/app/context/ThemeContext';
import styles from './SiteNav.module.scss';

const LINKS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'resume', label: 'Resume', href: '/resume' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'music', label: 'Music', href: '/music' },
  { key: 'contact', label: 'Contact', href: '/contact' },
] as const;

const sectionFor = (pathname: string) => {
  if (pathname === '/about') return 'about';
  if (pathname === '/resume') return 'resume';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'blog';
  if (pathname === '/music') return 'music';
  return 'home';
};

const SiteNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLightMode, toggleTheme } = useTheme();

  const activeSection = sectionFor(pathname);

  // Freeze the page behind the mobile menu. `overflow: hidden` on the root is
  // not enough — Chromium still scrolls it and iOS Safari ignores it outright —
  // so the body is pinned at its current offset and restored on close.
  useEffect(() => {
    if (!isMenuOpen) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // The menu is only reachable below 820px; closing it on the way past that
  // breakpoint stops the scroll lock outliving the menu itself.
  useEffect(() => {
    if (!isMenuOpen) return;
    const query = window.matchMedia('(min-width: 821px)');
    const onChange = () => {
      if (query.matches) setIsMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [isMenuOpen]);

  const themeLabel = isLightMode
    ? 'Switch to dark mode'
    : 'Switch to light mode';

  return (
    <nav className={styles.nav} role='navigation' aria-label='Main'>
      <div className={styles.inner}>
        <Link href='/' className={styles.brand}>
          <span className={styles.brandDot} aria-hidden='true' />
          <span>Akshay Gupta</span>
        </Link>

        <div className={styles.desktopLinks}>
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={styles.link}
              data-active={activeSection === link.key || undefined}
              aria-current={activeSection === link.key ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}

          <button
            type='button'
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={themeLabel}
            aria-label={themeLabel}
            role='switch'
            aria-checked={isLightMode}
          >
            <Icon name={isLightMode ? 'moon' : 'sun'} />
          </button>
        </div>

        <button
          type='button'
          className={styles.burger}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls='site-nav-menu'
        >
          <Icon name={isMenuOpen ? 'times' : 'bars'} />
        </button>
      </div>

      {isMenuOpen && (
        <button
          type='button'
          className={styles.backdrop}
          onClick={() => setIsMenuOpen(false)}
          aria-label='Close menu'
          tabIndex={-1}
        />
      )}

      {isMenuOpen && (
        <div className={styles.mobileMenu} id='site-nav-menu'>
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={styles.mobileLink}
              data-active={activeSection === link.key || undefined}
              aria-current={activeSection === link.key ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <button
            type='button'
            className={styles.mobileThemeToggle}
            onClick={toggleTheme}
            aria-label={themeLabel}
            role='switch'
            aria-checked={isLightMode}
          >
            <Icon name={isLightMode ? 'moon' : 'sun'} />
            {themeLabel}
          </button>
        </div>
      )}
    </nav>
  );
};

export default SiteNav;
