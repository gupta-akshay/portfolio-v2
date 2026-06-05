'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from '@/app/styles/sections/resumeSection.module.scss';

export default function ResumeActions() {
  return (
    <div className={styles.resumeActions}>
      <button
        className='px-btn px-btn-regular'
        onClick={() => window.print()}
        aria-label='Print resume'
      >
        <FontAwesomeIcon icon={faPrint as IconProp} />
        <span>Print</span>
      </button>
      <a
        className='px-btn px-btn-regular'
        href='/assets/Akshay_Gupta_CV.pdf'
        download
        aria-label='Download CV as PDF'
      >
        <FontAwesomeIcon icon={faFileArrowDown as IconProp} />
        <span>Download PDF</span>
      </a>
    </div>
  );
}
