'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PortableTextBlock } from 'sanity';

import './TableOfContents.scss';

interface HeadingBlock {
  _type: 'block';
  _key: string;
  style: 'h1' | 'h2' | 'h3' | 'h4';
  children: Array<{
    text: string;
    _type: 'span';
    marks?: string[];
  }>;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

interface TableOfContentsProps {
  content: PortableTextBlock[];
  minHeadings?: number;
  className?: string;
}

const extractTextFromBlock = (block: HeadingBlock): string => {
  return block.children
    .map((child) => child.text)
    .join('')
    .trim();
};

const extractHeadings = (content: PortableTextBlock[]): TOCItem[] => {
  const headings: TOCItem[] = [];

  content.forEach((block) => {
    if (
      block._type === 'block' &&
      block.style &&
      typeof block.style === 'string' &&
      ['h1', 'h2', 'h3', 'h4'].includes(block.style)
    ) {
      const headingBlock = block as HeadingBlock;
      const text = extractTextFromBlock(headingBlock);

      if (text) {
        const level = parseInt(headingBlock.style.charAt(1));
        headings.push({
          id: headingBlock._key,
          text,
          level,
        });
      }
    }
  });

  return headings;
};

const buildNestedTOC = (headings: TOCItem[]): TOCItem[] => {
  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];

  headings.forEach((heading) => {
    // Remove items from stack that are same level or deeper
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.level >= heading.level) {
        stack.pop();
      } else {
        break;
      }
    }

    const newItem: TOCItem = {
      ...heading,
      children: [],
    };

    if (stack.length === 0) {
      result.push(newItem);
    } else {
      const parent = stack[stack.length - 1];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
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
    const headerOffset = 80; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const TOCList: React.FC<{ items: TOCItem[]; activeId: string }> = ({
  items,
  activeId,
}) => {
  if (items.length === 0) return null;

  return (
    <ul className='toc-list'>
      {items.map((item) => (
        <li key={item.id} className={`toc-item toc-level-${item.level}`}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(item.id);
            }}
            className={`toc-link ${activeId === item.id ? 'active' : ''}`}
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

const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  minHeadings = 3,
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const headings = extractHeadings(content);
  const nestedHeadings = buildNestedTOC(headings);

  const setupObserver = useCallback(() => {
    if (headings.length < minHeadings) {
      return null;
    }

    // Check if all heading elements exist in the DOM
    const headingElements = headings.map((heading) =>
      document.getElementById(heading.id)
    );

    const allElementsExist = headingElements.every(
      (element) => element !== null
    );

    if (!allElementsExist) {
      // If elements don't exist yet, return null to retry later
      return null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    // Observe all headings (we know they exist at this point)
    headingElements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return observer;
  }, [headings, minHeadings]);

  useEffect(() => {
    if (headings.length < minHeadings) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    const maxRetries = 50; // Maximum number of retries (5 seconds with 100ms intervals)

    const trySetupObserver = () => {
      observer = setupObserver();

      if (!observer && retryCount < maxRetries) {
        retryCount++;
        // Retry after a short delay
        timeoutId = setTimeout(trySetupObserver, 100);
      }
    };

    // Initial setup attempt
    trySetupObserver();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setupObserver, headings, minHeadings]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't render if not enough headings or on mobile
  if (headings.length < minHeadings || isMobile) {
    return null;
  }

  // Desktop version only - fixed sidebar, appears on scroll
  return (
    <div
      className={`table-of-contents ${isVisible ? 'visible' : ''} ${className}`}
    >
      <div className='toc-header'>
        <h4>Table of Contents</h4>
      </div>
      <nav className='toc-nav'>
        <TOCList items={nestedHeadings} activeId={activeId} />
      </nav>
    </div>
  );
};

export default TableOfContents;
