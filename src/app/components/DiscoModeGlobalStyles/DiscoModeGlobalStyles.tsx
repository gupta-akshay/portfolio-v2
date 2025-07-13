'use client';

import { useEffect } from 'react';
import { useEasterEgg } from '@/app/context/EasterEggContext';

const DiscoModeGlobalStyles: React.FC = () => {
  const { easterEggState } = useEasterEgg();

  useEffect(() => {
    if (easterEggState.discoModeActive) {
      document.body.classList.add('disco-mode-active');
    } else {
      document.body.classList.remove('disco-mode-active');
    }

    return () => {
      document.body.classList.remove('disco-mode-active');
    };
  }, [easterEggState.discoModeActive]);

  return null;
};

export default DiscoModeGlobalStyles;
