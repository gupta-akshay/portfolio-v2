'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

const BackBtn = () => {
  const router = useRouter();

  return (
    <label
      className='back-btn'
      onClick={() => router.back()}
      role='button'
      aria-label='go back'
    >
      <FontAwesomeIcon icon={faArrowLeft} />
    </label>
  );
};

export default BackBtn;
