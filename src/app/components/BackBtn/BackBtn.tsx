'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useRouter, usePathname } from 'next/navigation';
import { handleKeyDown } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';

const BackBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();

  const handleBack = () => {
    // Only show loading indicator when navigating from a blog post
    if (pathname.startsWith('/blog/')) {
      startLoading();
    }
    router.back();
  };

  return (
    <div className="back-btn-wrapper">
      <button
        type='button'
        className='back-btn'
        onClick={handleBack}
        onKeyDown={(e) => handleKeyDown(e, handleBack)}
        aria-label='Go back to previous page'
      >
        <FontAwesomeIcon icon={faArrowLeft as IconProp} aria-hidden='true' />
      </button>
    </div>
  );
};

export default BackBtn;
