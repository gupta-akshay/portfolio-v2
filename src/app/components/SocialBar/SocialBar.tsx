import Icon from '@/app/components/Icon/Icon';
import { socialLinks } from '@/lib/site-content';

import styles from './SocialBar.module.scss';

/**
 * Floating slab of social links pinned near the bottom of the viewport.
 * Brand marks keep their own colour; the monochrome ones follow the theme ink.
 */
export default function SocialBar() {
  return (
    <nav className={styles.bar} aria-label='Social links'>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.url}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
          title={social.label}
          aria-label={social.label}
        >
          <span
            className={styles.icon}
            {...('color' in social ? { style: { color: social.color } } : {})}
          >
            <Icon name={social.icon} />
          </span>
        </a>
      ))}
    </nav>
  );
}
