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
      setMatrixState('waiting');
    } else if (!easterEggState.matrixRainActive) {
      setMatrixState('inactive');
    }
  }, [easterEggState.matrixRainActive, matrixState]);

  // Handle key press events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();

      if (matrixState === 'waiting') {
        // Start the matrix effect
        setMatrixState('active');
      } else if (matrixState === 'active') {
        // Dismiss the effect
        toggleMatrixRain();
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

      // Initialize drops
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
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
          drops[i] = (drops[i] ?? 0) + 1;
        }
      };

      const animate = () => {
        if (matrixState === 'active') {
          draw();
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animate();

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
          <div className={styles.exitText}>
            Press any key to exit the Matrix...
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixRain;
