'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useTerminalCTAContext } from './TerminalCTAContext';

import styles from './TerminalCTA.module.scss';

const TerminalCTA = () => {
  const { shouldRender } = useTerminalCTAContext();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isStudioRoute = pathname?.startsWith('/studio');
  const isModalVisible = isOpen && !isMobile;

  useEffect(() => {
    if (!isModalVisible) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModalVisible]);

  if (isMobile || !shouldRender || isStudioRoute) {
    return null;
  }

  return (
    <>
      <div className={styles.fabContainer}>
        <button
          type='button'
          className={styles.ctaButton}
          onClick={() => setIsOpen(true)}
          aria-haspopup='dialog'
          aria-expanded={isOpen}
        >
          <span className={styles.buttonLabel}>Terminal resume</span>
          <span className={styles.buttonHint}>ssh ssh.akshaygupta.live</span>
        </button>
      </div>

      {isModalVisible && (
        <>
          <div className={styles.backdrop} aria-hidden='true' />
          <div className={styles.modalWrapper}>
            <div
              className={styles.modal}
              role='dialog'
              aria-modal='true'
              aria-labelledby='terminal-cta-modal-title'
            >
              <button
                type='button'
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label='Close terminal instructions'
              >
                ×
              </button>
              <p className={styles.modalKicker}>Terminal Resume</p>
              <h3 id='terminal-cta-modal-title' className={styles.modalTitle}>
                Launch from any shell
              </h3>
              <p className={styles.modalDescription}>
                Paste the command in macOS Terminal, Linux, WSL, or Git Bash to
                explore my resume as a native terminal experience.
              </p>
              <code className={styles.command} aria-label='SSH command'>
                <span className={styles.promptSymbol}>$</span>{' '}
                <span className={styles.commandText}>
                  ssh ssh.akshaygupta.live
                </span>
              </code>
              <p className={styles.modalMeta}>
                Tip: if you already use port 22 on your machine, run{' '}
                <span className={styles.commandInline}>
                  ssh -p 2222 ssh.akshaygupta.live
                </span>{' '}
                instead.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TerminalCTA;

