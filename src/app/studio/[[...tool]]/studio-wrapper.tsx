'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Studio = dynamic(() => import('./studio-component'), { ssr: false });

export default function StudioWrapper() {
  return (
    <Suspense fallback={<div>Loading Sanity Studio...</div>}>
      <Studio />
    </Suspense>
  );
}
