'use client';

import { ReactNode } from 'react';
import useIsMobile from '@/app/hooks/useIsMobile';

interface EasterEggWrapperProps {
  children: ReactNode;
}

const EasterEggWrapper: React.FC<EasterEggWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();

  // Don't render Easter eggs on mobile devices
  if (isMobile) {
    return null;
  }

  return <>{children}</>;
};

export default EasterEggWrapper;
