'use client';

import styles from './MapSection.module.scss';

export default function MapSection() {

  return (
    <div className='col-12'>
      <div className={styles.googleMap}>
        <div
          className={`${styles.embedResponsive} ${styles.embedResponsive21by9}`}
        >
          <iframe
            loading='lazy'
            title='Map showing Mumbai, Maharashtra, India'
            className={styles.embedResponsiveItem}
            referrerPolicy='no-referrer-when-downgrade'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15079.504774759675!2d72.89155876663652!3d19.11308653848415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c80bcbbc3515%3A0xce3eab5cbf511900!2sChandivali%2C%20Powai%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1774933113191!5m2!1sen!2sin'
          />
        </div>
      </div>
    </div>
  );
}
