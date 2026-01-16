'use client';

import Link from 'next/link';

interface HomeContentInteractiveProps {
  children: React.ReactNode;
  type: 'downloadButton' | 'peopleGroveLink';
}

export default function HomeContentInteractive({
  children,
  type,
}: HomeContentInteractiveProps) {
  if (type === 'downloadButton') {
    return (
      <a
        className='px-btn px-btn-regular'
        href='/assets/Akshay_Gupta_CV.pdf'
        download
      >
        {children}
      </a>
    );
  }

  if (type === 'peopleGroveLink') {
    return (
      <Link href='https://www.peoplegrove.com' target='_blank'>
        {children}
      </Link>
    );
  }

  return null;
}
