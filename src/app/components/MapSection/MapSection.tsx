'use client';

import { useEffect, useState } from 'react';

import styles from './MapSection.module.scss';

export default function MapSection() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div className='col-12'>
      <div className={styles.googleMap}>
        <div
          className={`${styles.embedResponsive} ${styles.embedResponsive21by9}`}
        >
          {mapLoaded ? (
            <iframe
              loading='lazy'
              title='map'
              className={styles.embedResponsiveItem}
              referrerPolicy='no-referrer-when-downgrade'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58688.52668488091!2d75.79722045!3d23.16899865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82abdf7899d412!2sUjjain%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1656359717223!5m2!1sen!2sin'
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
