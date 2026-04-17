'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TOCHeading } from '@/lib/mdx/types';

import '../../../app/components/TableOfContents/TableOfContents.scss';

interface TOCItem extends TOCHeading {
  children?: TOCItem[];
}

interface TableOfContentsMDXProps {
  headings: TOCHeading[];
  minHeadings?: number;
  className?: string;
}

const buildNestedTOC = (headings: TOCHeading[]): TOCItem[] => {
  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];

  headings.forEach((heading) => {
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.level >= heading.level) {
        stack.pop();
      } else {
        break;
      }
    }

    const newItem: TOCItem = { ...heading, children: [] };

    if (stack.length === 0) {
      result.push(newItem);
    } else {
      const parent = stack[stack.length - 1];
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(newItem);
      }
    }

    stack.push(newItem);
  });

  return result;
};

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

const TOCList: React.FC<{ items: TOCItem[]; activeId: string }> = ({
  items,
  activeId,
}) => {
  if (items.length === 0) return null;

  return (
    <ul className="toc-list">
      {items.map((item) => (
        <li key={item.id} className={`toc-item toc-level-${item.level}`}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(item.id);
            }}
            className={`toc-link ${activeId === item.id ? 'active' : ''}`}
            aria-current={activeId === item.id ? 'location' : undefined}
          >
            {item.text}
          </a>
          {item.children && item.children.length > 0 && (
            <TOCList items={item.children} activeId={activeId} />
          )}
        </li>
      ))}
    </ul>
  );
};

const TableOfContentsMDX: React.FC<TableOfContentsMDXProps> = ({
  headings,
  minHeadings = 3,
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nestedHeadings = buildNestedTOC(headings);

  const setupObserver = useCallback(() => {
    if (headings.length < minHeadings) return null;

    const headingElements = headings.map((h) => document.getElementById(h.id));
    if (headingElements.some((el) => el === null)) return null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headingElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return observer;
  }, [headings, minHeadings]);

  useEffect(() => {
    if (headings.length < minHeadings) return;

    // Headings are server-rendered so they exist immediately, but give the
    // browser one frame to paint before observing.
    const frameId = requestAnimationFrame(() => {
      const observer = setupObserver();
      return () => observer?.disconnect();
    });

    return () => cancelAnimationFrame(frameId);
  }, [setupObserver, headings, minHeadings]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (headings.length < minHeadings || isMobile) return null;

  return (
    <div
      className={`table-of-contents ${isVisible ? 'visible' : ''} ${className}`}
    >
      <div className="toc-content-wrapper">
        <div className="toc-header">
          <h4>Table of Contents</h4>
        </div>
        <nav className="toc-nav" aria-label="Table of contents">
          <TOCList items={nestedHeadings} activeId={activeId} />
        </nav>
      </div>
    </div>
  );
};

export default TableOfContentsMDX;
