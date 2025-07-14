'use client';

import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { ScrollAnimation } from '@/app/components';
import styles from './GitHubCalendar.module.scss';

interface GitHubCalendarProps {
  username: string;
  theme?: any; // Using any to avoid type conflicts with the library
}

const GitHubCalendarComponent: React.FC<GitHubCalendarProps> = ({
  username,
  theme = {
    light: [
      '#0b0b13',
      'rgba(47, 191, 113, 0.3)',
      'rgba(47, 191, 113, 0.5)',
      'rgba(47, 191, 113, 0.7)',
      '#2fbf71',
    ],
    dark: [
      '#0b0b13',
      'rgba(47, 191, 113, 0.3)',
      'rgba(47, 191, 113, 0.5)',
      'rgba(47, 191, 113, 0.7)',
      '#2fbf71',
    ],
  },
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading GitHub activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Unable to load GitHub activity. Please try again later.</p>
      </div>
    );
  }

  return (
    <ScrollAnimation animation='fadeIn' duration={0.8}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <h3>My GitHub Activity</h3>
          <p>Check out my coding journey and contributions over time</p>
        </div>
        <div className={styles.calendarWrapper}>
          <GitHubCalendar
            username={username}
            theme={theme}
            fontSize={12}
            blockSize={12}
            blockMargin={4}
            hideColorLegend={false}
            hideMonthLabels={false}
            showWeekdayLabels={true}
            transformData={(data) => {
              // You can transform the data here if needed
              return data;
            }}
          />
        </div>
        <div className={styles.calendarFooter}>
          <p>
            <a
              href={`https://github.com/${username}`}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.githubLink}
            >
              View my GitHub profile
            </a>
          </p>
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default GitHubCalendarComponent;
