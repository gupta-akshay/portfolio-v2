'use client';

import { useState, useEffect } from 'react';

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check screen width (768px is typical mobile/tablet breakpoint)
      const screenWidth = window.innerWidth <= 768;

      // Also check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'android',
        'webos',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone',
        'mobile',
      ];
      const userAgentMobile = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword)
      );

      // Consider it mobile if either condition is true
      setIsMobile(screenWidth || userAgentMobile);
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener to handle orientation changes and window resizing
    window.addEventListener('resize', checkIsMobile);

    // Handle orientation change specifically for mobile devices
    window.addEventListener('orientationchange', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
