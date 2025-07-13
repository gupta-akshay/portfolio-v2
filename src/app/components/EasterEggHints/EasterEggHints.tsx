'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './EasterEggHints.module.scss';

interface HintConfig {
  id: string;
  text: string;
  condition: () => boolean;
  delay: number;
}

const EasterEggHints: React.FC = () => {
  const pathname = usePathname();
  const [visibleHints, setVisibleHints] = useState<string[]>([]);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  const hints: HintConfig[] = useMemo(
    () => [
      {
        id: 'konami',
        text: 'Try the classic cheat code... ↑↑↓↓←→←→BA',
        condition: () => true, // Always show
        delay: 3000,
      },
      {
        id: 'disco',
        text: 'Click my image rapidly for a surprise 🕺',
        condition: () => true, // Always show
        delay: 8000,
      },
      {
        id: 'dev',
        text: 'Developers, type "dev" for a special message 💻',
        condition: () => pathname.startsWith('/blog'),
        delay: 5000,
      },
    ],
    [pathname]
  );

  useEffect(() => {
    // Clear any existing timeouts
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    const activeHints = hints.filter((hint) => hint.condition());

    if (activeHints.length === 0) {
      setVisibleHints([]);
      return;
    }

    const showHint = (index: number) => {
      if (index < activeHints.length) {
        const hint = activeHints[index];

        if (!hint) return;

        const timeoutId1 = setTimeout(() => {
          setVisibleHints((prev) =>
            prev.includes(hint.id) ? prev : [...prev, hint.id]
          );

          // Hide hint after 5 seconds
          const timeoutId2 = setTimeout(() => {
            setVisibleHints((prev) => prev.filter((id) => id !== hint.id));

            // Show next hint after 2 seconds
            const timeoutId3 = setTimeout(() => {
              showHint((index + 1) % activeHints.length);
            }, 2000);
            timeoutIdsRef.current.push(timeoutId3);
          }, 5000);
          timeoutIdsRef.current.push(timeoutId2);
        }, hint.delay);
        timeoutIdsRef.current.push(timeoutId1);
      }
    };

    // Start the cycle
    showHint(0);

    // Cleanup function to cancel all timeouts
    return () => {
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, [pathname, hints]);

  const getHintText = (hintId: string) => {
    const hint = hints.find((h) => h.id === hintId);
    return hint?.text || '';
  };

  if (visibleHints.length === 0) return null;

  return (
    <div className={styles.container}>
      {visibleHints.map((hintId) => (
        <div key={hintId} className={styles.hint}>
          <div className={styles.hintContent}>
            <span className={styles.hintIcon}>💡</span>
            <span className={styles.hintText}>{getHintText(hintId)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EasterEggHints;
