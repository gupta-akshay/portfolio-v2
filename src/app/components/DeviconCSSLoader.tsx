'use client';

import { useEffect } from 'react';

export default function DeviconCSSLoader() {
  useEffect(() => {
    const loadDeviconCSS = async () => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
        link.onload = () => {
          console.log('Devicon CSS loaded successfully from CDN');
        };
        link.onerror = () => {
          console.error('Failed to load devicon CSS from CDN');
        };
        
        document.head.appendChild(link);
      } catch (error) {
        console.error('Error loading devicon CSS:', error);
      }
    };

    loadDeviconCSS();
  }, []);

  return null;
}
