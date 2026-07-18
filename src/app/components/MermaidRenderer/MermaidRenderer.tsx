'use client';

import { useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

const MERMAID_CODE_SELECTOR = 'pre > code.language-mermaid';
const MERMAID_SELECTOR = 'pre.mermaid';

const prepareMermaidNodes = () => {
  document.querySelectorAll<HTMLElement>(MERMAID_CODE_SELECTOR).forEach((code) => {
    const pre = code.parentElement;
    if (!(pre instanceof HTMLPreElement)) return;

    const source = code.textContent ?? '';
    pre.classList.add('mermaid');
    pre.setAttribute('data-mermaid-source', source);
    pre.textContent = source;
  });

  return document.querySelectorAll<HTMLElement>(MERMAID_SELECTOR);
};

const MermaidRenderer = () => {
  const { mode } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const nodes = prepareMermaidNodes();
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
