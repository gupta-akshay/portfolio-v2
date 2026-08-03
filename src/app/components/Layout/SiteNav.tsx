'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Icon from '@/app/components/Icon/Icon';
import { useTheme } from '@/app/context/ThemeContext';
import { useHoverPrefetch } from '@/app/hooks/useHoverPrefetch';
import styles from './SiteNav.module.scss';

const LINKS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'resume', label: 'Resume', href: '/resume' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'music', label: 'Music', href: '/music' },
  { key: 'contact', label: 'Contact', href: '/contact' },
] as const;

const SiteNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLightMode, toggleTheme } = useTheme();

  const activeSection = useMemo(() => {
    if (pathname === '/about') return 'about';
    if (pathname === '/resume') return 'resume';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'blog';
    if (pathname === '/music') return 'music';
    return 'home';
  }, [pathname]);

  // Hover prefetch for the blog index, which is the heaviest route
  const {
    handleMouseEnter: handleBlogMouseEnter,
    handleMouseLeave: handleBlogMouseLeave,
  } = useHoverPrefetch('/blog', { delay: 100, enabled: true });

  // Close the menu whenever navigation happens
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
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

  const themeLabel = isLightMode
    ? 'Switch to dark mode'
    : 'Switch to light mode';

  const linkProps = (key: string) =>
    key === 'blog'
      ? {
          onMouseEnter: handleBlogMouseEnter,
          onMouseLeave: handleBlogMouseLeave,
        }
      : {};

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
              {...linkProps(link.key)}
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
        <div className={styles.mobileMenu} id='site-nav-menu'>
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={styles.mobileLink}
              data-active={activeSection === link.key || undefined}
              aria-current={activeSection === link.key ? 'page' : undefined}
              {...linkProps(link.key)}
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
