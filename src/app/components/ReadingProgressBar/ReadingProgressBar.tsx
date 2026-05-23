'use client';

import { useEffect, useState } from 'react';
import './ReadingProgressBar.scss';

interface ReadingProgressBarProps {
  target?: string; // CSS selector for the target element to track
}

const ReadingProgressBar = ({
  target = 'article',
}: ReadingProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const computeProgress = () => {
      ticking = false;

      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const targetRect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const elementTop = targetRect.top + scrollTop;
      const elementHeight = targetElement.scrollHeight;

      const scrollStart = elementTop;
      const scrollEnd = elementTop + elementHeight - windowHeight;
      const scrollableDistance = scrollEnd - scrollStart;

      let progressPercentage = 0;

      if (scrollableDistance <= 0) {
        if (scrollTop >= scrollStart) {
          progressPercentage = 100;
        } else {
          progressPercentage = 0;
        }
      } else if (scrollTop >= scrollStart && scrollTop <= scrollEnd) {
        progressPercentage =
          ((scrollTop - scrollStart) / scrollableDistance) * 100;
      } else if (scrollTop > scrollEnd) {
        progressPercentage = 100;
      }

      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    };

    // Coalesce high-frequency scroll/resize events into a single
    // rAF-scheduled update so we only recompute once per frame.
    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(computeProgress);
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    computeProgress();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [target]);

  return (
    <div className='reading-progress-bar'>
      <div
        className='reading-progress-fill'
        style={{ width: `${progress}%` }}
        role='progressbar'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${Math.round(progress)}%`}
      />
    </div>
  );
};

export default ReadingProgressBar;
