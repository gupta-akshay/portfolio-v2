'use client';

import React, { ComponentProps } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import styles from './GitHubCalendar.module.scss';

type CalendarTheme = ComponentProps<typeof GitHubCalendar>['theme'];

interface GitHubCalendarProps {
  username: string;
  theme?: CalendarTheme;
}

const defaultTheme: CalendarTheme = {
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
};

const GitHubCalendarComponent: React.FC<GitHubCalendarProps> = ({
  username,
  theme = defaultTheme,
}) => {
  return (
    <>
      <div className='title'>
        <h3>GitHub Activity</h3>
      </div>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <div className={styles.headerInfo}>
            <h4>My Coding Journey</h4>
            <p>Check out my contributions and coding activity over time</p>
          </div>
        </div>

        <div className={styles.calendarWrapper}>
          <GitHubCalendar
            username={username}
            theme={theme}
            fontSize={12}
            blockSize={12}
            blockMargin={4}
            showColorLegend={true}
            showMonthLabels={true}
            showWeekdayLabels={true}
          />
        </div>

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
      </div>
    </>
  );
};

export default GitHubCalendarComponent;
