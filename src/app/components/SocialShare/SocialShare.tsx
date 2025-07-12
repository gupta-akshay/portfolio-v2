'use client';

import { useState, useEffect, useRef } from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import { SocialShareProps } from '@/app/types/components';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

export default function SocialShare({
  url,
  title,
  description,
}: SocialShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addCursorInteraction } = useCursorInteractions();

  // Social share button refs
  const twitterRef = useRef<HTMLDivElement>(null);
  const facebookRef = useRef<HTMLDivElement>(null);
  const linkedinRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);

  // Add cursor interactions
  useEffect(() => {
    if (twitterRef.current) {
      addCursorInteraction(twitterRef.current, {
        onHover: 'hover',
        onText: 'Share on Twitter',
        onClick: 'click',
      });
    }

    if (facebookRef.current) {
      addCursorInteraction(facebookRef.current, {
        onHover: 'hover',
        onText: 'Share on Facebook',
        onClick: 'click',
      });
    }

    if (linkedinRef.current) {
      addCursorInteraction(linkedinRef.current, {
        onHover: 'hover',
        onText: 'Share on LinkedIn',
        onClick: 'click',
      });
    }

    if (whatsappRef.current) {
      addCursorInteraction(whatsappRef.current, {
        onHover: 'hover',
        onText: 'Share on WhatsApp',
        onClick: 'click',
      });
    }

    if (emailRef.current) {
      addCursorInteraction(emailRef.current, {
        onHover: 'hover',
        onText: 'Share via Email',
        onClick: 'click',
      });
    }

    if (copyRef.current) {
      addCursorInteraction(copyRef.current, {
        onHover: 'hover',
        onText: 'Copy link to clipboard',
        onClick: 'click',
      });
    }

    return undefined;
  }, [addCursorInteraction]);

  useEffect(() => {
    // Show the social share bar after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      // Clear any existing timeout
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Reset copied state after 2 seconds
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  if (!isVisible) return null;

  const shareConfig = {
    url,
    title,
    quote: description || title,
    hashtag: '#blog #tech #development',
  };

  return (
    <div className='social-share-container'>
      <div className='social-share-bar'>
        <div className='social-share-title'>Share</div>

        <div ref={twitterRef} className='social-share-btn'>
          <TwitterShareButton
            url={shareConfig.url}
            title={shareConfig.title}
            hashtags={['blog', 'tech', 'development']}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div ref={facebookRef} className='social-share-btn'>
          <FacebookShareButton url={shareConfig.url}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>

        <div ref={linkedinRef} className='social-share-btn'>
          <LinkedinShareButton
            url={shareConfig.url}
            title={shareConfig.title}
            summary={shareConfig.quote}
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div ref={whatsappRef} className='social-share-btn'>
          <WhatsappShareButton
            url={shareConfig.url}
            title={shareConfig.title}
            separator=' - '
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>

        <div ref={emailRef} className='social-share-btn'>
          <EmailShareButton
            url={shareConfig.url}
            subject={shareConfig.title}
            body={`Check out this article: ${shareConfig.title}`}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>

        <button
          onClick={handleCopyLink}
          className={`social-share-btn copy-link-btn ${copied ? 'copied' : ''}`}
          title='Copy link'
          ref={copyRef}
        >
          <div className='copy-icon'>{copied ? '✓' : '🔗'}</div>
        </button>
      </div>
    </div>
  );
}
