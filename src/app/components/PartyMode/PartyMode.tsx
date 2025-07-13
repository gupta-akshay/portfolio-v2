'use client';

import { useEffect, useState } from 'react';
import { useEasterEgg } from '@/app/context/EasterEggContext';
import styles from './PartyMode.module.scss';

interface PartyModeProps {
  className?: string;
}

const PartyMode: React.FC<PartyModeProps> = ({ className = '' }) => {
  const { easterEggState, togglePartyMode } = useEasterEgg();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(easterEggState.partyModeActive);
  }, [easterEggState.partyModeActive]);

  useEffect(() => {
    if (isActive) {
      // Apply party mode class to body
      document.body.classList.add('party-mode-active');

      // Auto-disable after 15 seconds by toggling context state
      const timeout = setTimeout(() => {
        togglePartyMode(); // This will update the context state properly
      }, 15000);

      return () => {
        clearTimeout(timeout);
        document.body.classList.remove('party-mode-active');
      };
    } else {
      document.body.classList.remove('party-mode-active');
      return undefined;
    }
  }, [isActive, togglePartyMode]);

  if (!isActive) return null;

  return (
    <div className={className}>
      <div className={styles.overlay}>
        <div className={styles.notification}>
          <div className={styles.notificationText}>
            🎉 PARTY MODE ACTIVATED! 🎉
          </div>
          <div className={styles.notificationSubtext}>
            Theme toggle spam detected!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyMode;
