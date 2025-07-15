'use client';

import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { ScrollAnimation, StaggerAnimation } from '@/app/components';
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
    const checkGitHubData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Test if we can fetch GitHub data for the user
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}`
        );

        if (!response.ok) {
          throw new Error(
            `GitHub API returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Check if we have valid contribution data
        if (!data.contributions || data.contributions.length === 0) {
          throw new Error('No contribution data found for this user');
        }
      } catch (err) {
        console.error('GitHub Calendar Error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load GitHub activity'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      checkGitHubData();
    }
  }, [username]);

  if (isLoading) {
    return (
      <ScrollAnimation animation='fadeIn' duration={0.8}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading GitHub activity...</p>
        </div>
      </ScrollAnimation>
    );
  }

  if (error) {
    return (
      <ScrollAnimation animation='fadeIn' duration={0.8}>
        <div className={styles.errorContainer}>
          <p>Unable to load GitHub activity: {error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Trigger a re-fetch by updating the effect
              const checkGitHubData = async () => {
                try {
                  const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}`
                  );
                  if (!response.ok) {
                    throw new Error(
                      `GitHub API returned ${response.status}: ${response.statusText}`
                    );
                  }
                  const data = await response.json();
                  if (!data.contributions || data.contributions.length === 0) {
                    throw new Error('No contribution data found for this user');
                  }
                  setError(null);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : 'Failed to load GitHub activity'
                  );
                } finally {
                  setIsLoading(false);
                }
              };
              checkGitHubData();
            }}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </ScrollAnimation>
    );
  }

  return (
    <>
      <ScrollAnimation animation='fadeIn' duration={0.8} scrollReveal={true}>
        <div className='title'>
          <h3>GitHub Activity</h3>
        </div>
      </ScrollAnimation>
      <StaggerAnimation staggerDelay={0.3} useIntersectionObserver={true}>
        <div className={styles.calendarContainer}>
          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.1}>
            <div className={styles.calendarHeader}>
              <div className={styles.headerInfo}>
                <h4>My Coding Journey</h4>
                <p>Check out my contributions and coding activity over time</p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.2}>
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
          </ScrollAnimation>

          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.3}>
            <div className={styles.calendarFooter}>
              <a
                href={`https://github.com/${username}`}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.githubLink}
              >
                View my GitHub profile
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </StaggerAnimation>
    </>
  );
};

export default GitHubCalendarComponent;
