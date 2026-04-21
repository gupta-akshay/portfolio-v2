'use client';

import { useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

const MERMAID_SELECTOR = 'pre.mermaid';

const MermaidRenderer = () => {
  const { mode } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const nodes = document.querySelectorAll<HTMLElement>(MERMAID_SELECTOR);
      if (nodes.length === 0) return;

      const { default: mermaid } = await import('mermaid');
      if (cancelled) return;

      nodes.forEach((node) => {
        const source = node.getAttribute('data-mermaid-source');
        if (source) {
          node.textContent = source;
        } else {
          node.setAttribute('data-mermaid-source', node.textContent ?? '');
        }
        node.removeAttribute('data-processed');
      });

      mermaid.initialize({
        startOnLoad: false,
        theme: mode === 'light' ? 'default' : 'dark',
        securityLevel: 'strict',
      });

      try {
        await mermaid.run({ nodes: Array.from(nodes) });
      } catch {
        /* mermaid logs its own errors; avoid crashing the page */
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  return null;
};

export default MermaidRenderer;
