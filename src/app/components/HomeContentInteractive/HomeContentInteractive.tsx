'use client';

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
      <a
        href='https://www.peoplegrove.com'
        target='_blank'
        rel='noopener noreferrer'
      >
        {children}
      </a>
    );
  }

  return null;
}
