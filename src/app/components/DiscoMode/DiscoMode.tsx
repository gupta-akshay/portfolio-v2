'use client';

import { useEffect, useState } from 'react';
import { useEasterEgg } from '@/app/context/EasterEggContext';
import styles from './DiscoMode.module.scss';

interface DiscoModeProps {
  className?: string;
}

const DiscoMode: React.FC<DiscoModeProps> = ({ className = '' }) => {
  const { easterEggState } = useEasterEgg();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(easterEggState.discoModeActive);
  }, [easterEggState.discoModeActive]);

  if (!isActive) return null;

  const generateLightStyle = () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${1 + Math.random() * 2}s`,
  });

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.overlay}>
        <div className={styles.discoBall}></div>
        <div className={styles.discoLights}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.discoLight}
              style={generateLightStyle()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoMode;
