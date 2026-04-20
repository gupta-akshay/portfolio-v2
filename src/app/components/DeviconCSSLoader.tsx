'use client';

import { useEffect } from 'react';
import { logger } from '@/app/utils/logger';

export default function DeviconCSSLoader() {
  useEffect(() => {
    const loadDeviconCSS = async () => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
        link.onerror = () => {
          logger.error('Failed to load devicon CSS from CDN');
        };

        document.head.appendChild(link);
      } catch (error) {
        logger.error('Error loading devicon CSS:', error);
      }
    };

    loadDeviconCSS();
  }, []);

  return null;
}
