'use client';

import dynamic from 'next/dynamic';

const GitHubCalendarLazy = dynamic(() => import('./GitHubCalendar'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '200px' }} />,
});

export default GitHubCalendarLazy;
