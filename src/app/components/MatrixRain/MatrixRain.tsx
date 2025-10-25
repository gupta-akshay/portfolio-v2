'use client';

import { useEffect, useRef, useState } from 'react';
import { useEasterEgg } from '@/app/context/EasterEggContext';
import styles from './MatrixRain.module.scss';

interface MatrixRainProps {
  className?: string;
}

type MatrixState = 'inactive' | 'waiting' | 'active';

const MatrixRain: React.FC<MatrixRainProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { easterEggState, toggleMatrixRain } = useEasterEgg();
  const [matrixState, setMatrixState] = useState<MatrixState>('inactive');

  // Handle Konami code activation
  useEffect(() => {
    if (easterEggState.matrixRainActive && matrixState === 'inactive') {
      const activateMatrix = () => {
        setMatrixState('waiting');
      };
      activateMatrix();
    } else if (!easterEggState.matrixRainActive) {
      const deactivateMatrix = () => {
        setMatrixState('inactive');
      };
      deactivateMatrix();
    }
  }, [easterEggState.matrixRainActive, matrixState]);

  // Handle key press events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with important accessibility and system keys
      const importantKeys = [
        'Tab',
        'Escape',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ];

      if (matrixState === 'waiting') {
        // Don't interfere with modifier keys or system shortcuts
        const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
        const isImportantKey = importantKeys.includes(event.key);

        // Allow important keys and system shortcuts to work normally
        if (isImportantKey || hasModifier) {
          return;
        }

        // Only prevent default for keys we're actually using to control the matrix
        event.preventDefault();

        // Start the matrix effect
        setMatrixState('active');
      } else if (matrixState === 'active') {
        // Only respond to Escape key to dismiss the effect
        if (event.key === 'Escape') {
          event.preventDefault();
          toggleMatrixRain();
        }
        // Let all other keys work normally when matrix is active
      }
    };

    if (matrixState === 'waiting' || matrixState === 'active') {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [matrixState, toggleMatrixRain]);

  // Handle matrix animation
  useEffect(() => {
    if (matrixState === 'active') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const resizeCanvas = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      };
      resizeCanvas();

      // Matrix characters
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = [];
      const dropSpeeds: number[] = [];

      // Initialize drops with random speeds
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
        // Random speed multiplier between 0.3 and 1.5
        dropSpeeds[i] = 0.3 + Math.random() * 1.2;
      }

      const draw = () => {
        if (!ctx || !canvas) return;

        // Black background with slight opacity for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;

        // Draw characters
        for (let i = 0; i < drops.length; i++) {
          const charIndex = Math.floor(Math.random() * chars.length);
          const text = chars.charAt(charIndex);
          const x = i * fontSize;
          const y = (drops[i] ?? 0) * fontSize;

          if (text && ctx) {
            ctx.fillText(text, x, y);
          }

          // Reset drop to top when it reaches bottom
          if (
            (drops[i] ?? 0) * fontSize > canvas.height &&
            Math.random() > 0.975
          ) {
            drops[i] = 0;
          }
          // Apply random speed to each drop
          drops[i] = (drops[i] ?? 0) + (dropSpeeds[i] ?? 1) * 0.7;
        }
      };

      // Frame rate control for slower animation
      let lastTime = 0;
      const targetFPS = 45; // Increased from 30fps to 45fps
      const frameInterval = 1000 / targetFPS;

      const animate = (currentTime: number) => {
        if (matrixState === 'active') {
          if (currentTime - lastTime >= frameInterval) {
            draw();
            lastTime = currentTime;
          }
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animate(performance.now());

      // Handle window resize
      const handleResize = () => resizeCanvas();
      window.addEventListener('resize', handleResize);

      // Auto-dismiss after 30 seconds
      const autoDissmissTimer = setTimeout(() => {
        if (matrixState === 'active') {
          toggleMatrixRain();
        }
      }, 30000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(autoDissmissTimer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    return; // Return undefined when not active
  }, [matrixState, toggleMatrixRain]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cancel any pending animation frames
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, []);

  if (matrixState === 'inactive') return null;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Backdrop to block interactions */}
      <div className={styles.backdrop} />

      {/* Matrix Rain Canvas (only when active) */}
      {matrixState === 'active' && (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}

      {/* Message Overlay */}
      <div className={styles.overlay}>
        {matrixState === 'waiting' && (
          <>
            <div className={styles.title}>KONAMI CODE ACTIVATED</div>
            <div className={styles.subtitle}>
              Press any key to start the Matrix...
            </div>
          </>
        )}
        {matrixState === 'active' && (
          <div className={styles.exitText}>Press ESC to exit the Matrix...</div>
        )}
      </div>
    </div>
  );
};

export default MatrixRain;
