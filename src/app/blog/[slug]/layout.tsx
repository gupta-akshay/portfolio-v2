'use client';

import { ReactNode, useEffect } from 'react';
import { useTerminalCTAContext } from '@/app/components/TerminalCTA/TerminalCTAContext';

const BlogPostLayout = ({ children }: { children: ReactNode }) => {
  const { setShouldRender } = useTerminalCTAContext();

  useEffect(() => {
    setShouldRender(false);
    return () => setShouldRender(true);
  }, [setShouldRender]);

  return <>{children}</>;
};

export default BlogPostLayout;

