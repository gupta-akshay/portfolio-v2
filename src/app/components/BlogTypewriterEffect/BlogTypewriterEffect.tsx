'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Typed from 'typed.js';

import styles from './BlogTypewriterEffect.module.scss';

interface BlogTypewriterEffectProps {
  className?: string;
}

const BlogTypewriterEffect: React.FC<BlogTypewriterEffectProps> = ({
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const keySequenceRef = useRef<string>('');
  const typedRef = useRef<Typed | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const el = useRef<HTMLSpanElement>(null);

  const developerMessages = useMemo(
    () => [
      'Welcome, fellow developer! 👨‍💻',
      'I see you found the secret typewriter...',
      "I hope you're enjoying the code behind this portfolio!",
      'Feel free to check out the GitHub repository!',
      'Remember: Good code is like a good joke - it needs no explanation.',
      'Happy coding! 🚀',
    ],
    []
  );

  const handleKeySequence = useCallback((event: KeyboardEvent) => {
    const sequence = 'dev';
    keySequenceRef.current += event.key.toLowerCase();

    if (keySequenceRef.current.includes(sequence)) {
      setIsActive(true);
      setIsComplete(false);
      setCountdown(0);
      keySequenceRef.current = '';

      // Clear any existing countdown interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    // Reset sequence if it gets too long
    if (keySequenceRef.current.length > sequence.length) {
      keySequenceRef.current = keySequenceRef.current.slice(-sequence.length);
    }
  }, []);

  // Prevent background scrolling when active
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  useEffect(() => {
    // Only listen for keys on blog pages
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/blog')
    ) {
      document.addEventListener('keydown', handleKeySequence);
    }

    return () => {
      document.removeEventListener('keydown', handleKeySequence);
    };
  }, [handleKeySequence]);

  // Initialize typed.js when component becomes active
  useEffect(() => {
    if (isActive && el.current && !typedRef.current) {
      // Create a single string with all messages separated by newlines
      const fullMessage = developerMessages.join('\n');

      typedRef.current = new Typed(el.current, {
        strings: [fullMessage],
        typeSpeed: 80,
        backSpeed: 0,
        backDelay: 0,
        smartBackspace: false,
        loop: false,
        showCursor: true,
        cursorChar: '|',
        onComplete: () => {
          setIsComplete(true);

          // Start countdown from 3 seconds
          setCountdown(3);

          // Update countdown every second
          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                // Clear interval and close the component
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                }
                setIsActive(false);
                setIsComplete(false);
                setCountdown(0);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        },
      });
    }

    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
        typedRef.current = null;
      }
    };
  }, [isActive, developerMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
        typedRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      // Reset body overflow
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Backdrop to block interactions and prevent scrolling */}
      <div className={styles.backdrop} />

      {/* Terminal Container */}
      <div className={styles.terminal}>
        {/* Terminal Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.windowButtons}>
            <div className={`${styles.windowButton} ${styles.red}`}></div>
            <div className={`${styles.windowButton} ${styles.yellow}`}></div>
            <div className={`${styles.windowButton} ${styles.green}`}></div>
          </div>
          <div className={styles.terminalTitle}>Terminal - Developer Mode</div>
        </div>

        {/* Terminal Body */}
        <div className={styles.terminalBody}>
          {/* Terminal Prompt */}
          <div className={styles.terminalPrompt}>
            <span className={styles.promptSymbol}>user@portfolio:~$</span>
            <span className={styles.promptCommand}>dev_mode --activate</span>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {/* Typed.js will handle the typing animation */}
            <div className={styles.messageRow}>
              <span className={styles.messagePrompt}>{'>'}</span>
              <span className={styles.messageText} ref={el}></span>
            </div>
          </div>

          {/* Terminal Footer */}
          <div className={styles.terminalFooter}>
            <div className={styles.footerStatus}>
              {isComplete && countdown > 0
                ? `Closing in ${countdown} second${countdown !== 1 ? 's' : ''}...`
                : isComplete
                  ? 'Closing...'
                  : 'Easter egg active'}
            </div>
            <div className={styles.footerProgress}>
              {isComplete ? (
                <span className={styles.complete}>✓ Complete</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTypewriterEffect;
