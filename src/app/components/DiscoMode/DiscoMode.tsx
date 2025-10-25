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
  const [lightStyles, setLightStyles] = useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);

  useEffect(() => {
    const updateActiveState = () => {
      setIsActive(easterEggState.discoModeActive);
    };
    updateActiveState();
  }, [easterEggState.discoModeActive]);

  useEffect(() => {
    if (isActive) {
      const generateLightStyles = () => {
        return [...Array(20)].map(() => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1 + Math.random() * 2}s`,
        }));
      };
      const updateLightStyles = () => {
        setLightStyles(generateLightStyles());
      };
      updateLightStyles();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.overlay}>
        <div className={styles.discoBall}></div>
        <div className={styles.discoLights}>
          {lightStyles.map((style, i) => (
            <div
              key={i}
              className={styles.discoLight}
              style={style}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoMode;
