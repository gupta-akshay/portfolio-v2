'use client';

import Link from 'next/link';
import Layout from '@/app/components/Layout';

import styles from './styles/sections/notFound.module.scss';

export default function NotFound() {
  return (
    <Layout>
      <section
        id='not-found'
        data-nav-tooltip='not-found'
        className='pp-section pp-scrollable section'
      >
        <div className={styles.notFound}>
          <div className='container'>
            <div
              className={`${styles.notFoundContent} col-12 d-flex flex-column justify-content-center align-items-center text-center`}
            >
              <p className={styles.notFoundKicker}>404</p>
              <h1 className={styles.notFoundTitle}>Page not found</h1>
              <p className={styles.notFoundDesc}>
                The page you requested does not exist or has been moved.
              </p>
              <Link href='/' className='px-btn px-btn-regular'>
                Return home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
