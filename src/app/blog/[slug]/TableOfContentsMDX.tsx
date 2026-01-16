'use client';

import React, { useState, useEffect, useCallback } from 'react';

import '../../../app/components/TableOfContents/TableOfContents.scss';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

interface TableOfContentsMDXProps {
  slug: string;
  minHeadings?: number;
  className?: string;
}

const buildNestedTOC = (headings: TOCItem[]): TOCItem[] => {
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
    const headerOffset = 80;
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
  slug,
  minHeadings = 3,
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  // Extract headings from the DOM after render
  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      const headingElements = document.querySelectorAll(
        'article h1[id], article h2[id], article h3[id], article h4[id]'
      );

      const extractedHeadings: TOCItem[] = [];
      headingElements.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1));
        const id = el.id;
        const text = el.textContent || '';

        if (id && text) {
          extractedHeadings.push({ id, text, level });
        }
      });

      setHeadings(extractedHeadings);
    };

    // Wait for MDX content to render
    const timer = setTimeout(extractHeadingsFromDOM, 100);
    return () => clearTimeout(timer);
  }, [slug]);

  const nestedHeadings = buildNestedTOC(headings);

  const setupObserver = useCallback(() => {
    if (headings.length < minHeadings) {
      return null;
    }

    const headingElements = headings.map((heading) =>
      document.getElementById(heading.id)
    );

    const allElementsExist = headingElements.every(
      (element) => element !== null
    );

    if (!allElementsExist) {
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
    const maxRetries = 50;

    const trySetupObserver = () => {
      observer = setupObserver();

      if (!observer && retryCount < maxRetries) {
        retryCount++;
        timeoutId = setTimeout(trySetupObserver, 100);
      }
    };

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

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (headings.length < minHeadings || isMobile) {
    return null;
  }

  return (
    <div
      className={`table-of-contents ${isVisible ? 'visible' : ''} ${className}`}
    >
      <div className="toc-content-wrapper">
        <div className="toc-header">
          <h4>Table of Contents</h4>
        </div>
        <nav className="toc-nav">
          <TOCList items={nestedHeadings} activeId={activeId} />
        </nav>
      </div>
    </div>
  );
};

export default TableOfContentsMDX;
