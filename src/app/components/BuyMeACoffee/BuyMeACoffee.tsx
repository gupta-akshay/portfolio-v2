'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

const BuyMeACoffee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addCursorInteraction } = useCursorInteractions();

  useEffect(() => {
    // Store ref value to avoid stale closure issues
    const container = containerRef.current;

    // Check if the script has loaded and create button if needed
    const checkForButton = () => {
      if (container && !container.querySelector('.bmc-btn')) {
        // If no button exists, create one manually
        const button = document.createElement('a');
        button.href = 'https://www.buymeacoffee.com/akshay.gupta';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'bmc-btn';
        button.style.cssText = `
          background-color: #2fbf71;
          color: #000000;
          border: 2px solid #000000;
          border-radius: 8px;
          padding: 12px 20px;
          text-decoration: none;
          font-family: var(--font-cookie), cursive;
          font-size: 16px;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(47, 191, 113, 0.3);
        `;

        button.innerHTML = `
          <span style="font-size: 20px;">☕</span>
          <span style="font-size: 20px;">Buy me a coffee</span>
        `;

        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-2px) scale(1.02)';
          button.style.boxShadow = '0 8px 20px rgba(47, 191, 113, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0) scale(1)';
          button.style.boxShadow = '0 4px 12px rgba(47, 191, 113, 0.3)';
        });

        container.appendChild(button);

        // Add cursor interaction to the button
        const cleanup = addCursorInteraction(button, {
          onHover: 'subtle',
          onText: 'Buy me a coffee',
          onClick: 'click',
        });

        // Store cleanup function for later removal if needed
        if (cleanup) {
          button.dataset.cursorCleanup = 'true';
        }
      }
    };

    // Check immediately and after a delay
    checkForButton();
    const timer = setTimeout(checkForButton, 1000);

    return () => {
      clearTimeout(timer);
      // Clean up cursor interactions if button exists
      if (container) {
        const button = container.querySelector('.bmc-btn') as HTMLElement;
        if (button && button.dataset.cursorCleanup) {
          // The cleanup function is handled by the cursor system
          delete button.dataset.cursorCleanup;
        }
      }
    };
  }, [addCursorInteraction]);

  return (
    <>
      <Script
        type='text/javascript'
        src='https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
        data-name='bmc-button'
        data-slug='akshay.gupta'
        data-color='#2fbf71'
        data-emoji=''
        data-font='Cookie'
        data-text='Buy me a coffee'
        data-outline-color='#000000'
        data-font-color='#000000'
        data-coffee-color='#FFDD00'
        strategy='afterInteractive'
        onLoad={() => {
          // Script loaded, check for button again
          setTimeout(() => {
            if (
              containerRef.current &&
              !containerRef.current.querySelector('.bmc-btn')
            ) {
              // Trigger the check again
              const event = new Event('load');
              window.dispatchEvent(event);
            }
          }, 500);
        }}
      />
      <div ref={containerRef} id='bmc-button-container' />
    </>
  );
};

export default BuyMeACoffee;
