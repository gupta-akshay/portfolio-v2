'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon, { type IconName } from '@/app/components/Icon/Icon';
import { logger } from '@/app/utils/logger';

import styles from './SocialShare.module.scss';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({
  url,
  title,
  description,
}: SocialShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show the social share bar after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('Failed to copy link', error);
    }
  };

  if (!isVisible) return null;

  const summary = description || title;
  const targets: { name: IconName; label: string; href: string }[] = [
    {
      name: 'x-twitter',
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=blog,tech,development`,
    },
    {
      name: 'facebook',
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'linkedin',
      label: 'Share on LinkedIn',
      href: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`,
    },
    {
      name: 'whatsapp',
      label: 'Share on WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: 'envelope',
      label: 'Share by email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${title} ${url}`)}`,
    },
  ];

  return (
    <div className={styles.socialShareContainer}>
      <div className={styles.socialShareBar}>
        <div className={styles.socialShareTitle}>Share</div>

        {targets.map(({ name, label, href }) => (
          <Link
            key={name}
            className={styles.socialShareBtn}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            title={label}
            aria-label={label}
          >
            <Icon name={name} />
          </Link>
        ))}

        <button
          onClick={handleCopyLink}
          className={`${styles.socialShareBtn} ${styles.copyLinkBtn} ${copied ? styles.copied : ''}`}
          title='Copy link'
        >
          <div className={styles.copyIcon}>{copied ? '✓' : '🔗'}</div>
        </button>
      </div>
    </div>
  );
}
