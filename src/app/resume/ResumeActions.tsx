'use client';

import Icon from '@/app/components/Icon/Icon';
import styles from '@/app/styles/sections/resumeSection.module.scss';

export default function ResumeActions() {
  return (
    <div className={styles.resumeActions}>
      <button
        className='px-btn px-btn-regular'
        onClick={() => window.print()}
        aria-label='Print resume'
      >
        <Icon name='print' />
        <span>Print</span>
      </button>
      <a
        className='px-btn px-btn-regular'
        href='/assets/Akshay_Gupta_CV.pdf'
        download
        aria-label='Download resume as PDF'
      >
        <Icon name='file-arrow-down' />
        <span>Download PDF</span>
      </a>
    </div>
  );
}
