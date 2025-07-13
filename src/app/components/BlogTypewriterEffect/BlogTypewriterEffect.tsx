'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styles from './BlogTypewriterEffect.module.scss';

interface BlogTypewriterEffectProps {
  className?: string;
}

interface TerminalMessage {
  text: string;
  isComplete: boolean;
  isCurrentMessage: boolean;
}

const BlogTypewriterEffect: React.FC<BlogTypewriterEffectProps> = ({
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessage[]>(
    []
  );
  const keySequenceRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setCurrentIndex(0);
      setCurrentText('');
      setIsComplete(false);
      setCountdown(0);
      setTerminalMessages([]);
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

  useEffect(() => {
    if (isActive && !isComplete) {
      if (currentIndex < developerMessages.length) {
        const message = developerMessages[currentIndex];
        if (!message) return;

        let charIndex = 0;
        setCurrentText('');

        const typeWriter = () => {
          if (charIndex < message.length) {
            setCurrentText(message.substring(0, charIndex + 1));
            charIndex++;
            timeoutRef.current = setTimeout(typeWriter, 80);
          } else {
            // Wait a moment before moving to next message to avoid flicker
            timeoutRef.current = setTimeout(() => {
              // Mark current message as complete and add to terminal messages
              setTerminalMessages((prev) => [
                ...prev,
                { text: message, isComplete: true, isCurrentMessage: false },
              ]);

              // Clear current text immediately after adding to messages
              setCurrentText('');

              // Move to next message after a short delay
              timeoutRef.current = setTimeout(() => {
                if (currentIndex + 1 < developerMessages.length) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  // All messages completed
                  setIsComplete(true);

                  // Add completion message
                  setTerminalMessages((prev) => [
                    ...prev,
                    {
                      text: 'Process completed successfully! ✓',
                      isComplete: true,
                      isCurrentMessage: false,
                    },
                  ]);

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
                        setCurrentIndex(0);
                        setCurrentText('');
                        setIsComplete(false);
                        setTerminalMessages([]);
                        setCountdown(0);
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                }
              }, 500);
            }, 300);
          }
        };

        typeWriter();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, currentIndex, developerMessages, isComplete]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
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
            {/* Completed Messages */}
            {terminalMessages.map((msg, index) => (
              <div key={index} className={styles.messageRow}>
                <span className={styles.messagePrompt}>{'>'}</span>
                <span className={styles.messageText}>{msg.text}</span>
              </div>
            ))}

            {/* Current Message (only if not complete and has text) */}
            {!isComplete && currentText && (
              <div className={styles.currentMessage}>
                <span className={styles.messagePrompt}>{'>'}</span>
                <span className={styles.messageText}>
                  {currentText}
                  <span className={styles.cursor}>|</span>
                </span>
              </div>
            )}
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
              ) : (
                <>
                  {currentIndex + 1}/{developerMessages.length}
                  <span className={styles.progressBar}>
                    {'█'.repeat(currentIndex + 1)}
                    {'░'.repeat(developerMessages.length - currentIndex - 1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTypewriterEffect;
