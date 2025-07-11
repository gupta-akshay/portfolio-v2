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
    const updateProgress = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const targetRect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Calculate the start and end positions for the target element
      const elementTop = targetRect.top + scrollTop;
      const elementHeight = targetElement.scrollHeight;

      // Calculate progress based on how much of the target element has been scrolled
      const scrollStart = elementTop;
      const scrollEnd = elementTop + elementHeight - windowHeight;

      let progressPercentage = 0;

      if (scrollTop >= scrollStart && scrollTop <= scrollEnd) {
        progressPercentage =
          ((scrollTop - scrollStart) / (scrollEnd - scrollStart)) * 100;
      } else if (scrollTop > scrollEnd) {
        progressPercentage = 100;
      }

      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    };

    // Update progress on scroll
    window.addEventListener('scroll', updateProgress);
    // Update progress on resize
    window.addEventListener('resize', updateProgress);
    // Initial progress calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
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
