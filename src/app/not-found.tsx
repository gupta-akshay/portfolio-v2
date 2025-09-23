'use client';

import Link from 'next/link';

import styles from './styles/sections/notFound.module.scss';

export default function NotFound() {
  return (
    <section
      id='not-found'
      data-nav-tooltip='not-found'
      className={`pp-section pp-scrollable`}
    >
      <div className={styles.notFound}>
        <div className='container'>
          <div
            className={`${styles.notFoundContent} col-12 d-flex flex-column justify-content-center align-items-center`}
          >
            <h2>Are you lost?</h2>
            <p>Could not find what you were looking for!</p>
            <Link href='/' className='px-btn px-btn-regular'>
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
