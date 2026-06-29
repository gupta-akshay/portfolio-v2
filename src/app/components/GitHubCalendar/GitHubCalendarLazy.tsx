'use client';

import dynamic from 'next/dynamic';
import LoadingIndicator from '@/app/components/LoadingIndicator';

const GitHubCalendarLazy = dynamic(() => import('./GitHubCalendar'), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

export default GitHubCalendarLazy;
