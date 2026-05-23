'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

import styles from './RouteError.module.scss';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className={styles.container} role='alert'>
      <div className={styles.card}>
        <p className={styles.kicker}>Something broke</p>
        <h2 className={styles.title}>This page hit an error</h2>
        <p className={styles.message}>
          {error.message || 'An unexpected error occurred while rendering.'}
        </p>
        {error.digest ? (
          <p className={styles.digest}>
            <span>Digest:</span> <code>{error.digest}</code>
          </p>
        ) : null}
        <div className={styles.actions}>
          <button
            type='button'
            className='px-btn px-btn-theme'
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link href='/' className='px-btn px-btn-regular'>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
