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
import { toast } from 'react-hot-toast';
import { SocialShareProps } from '@/app/types/components';

export default function SocialShare({
  url,
  title,
  description,
}: SocialShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      toast.success('Link copied to clipboard!');

      // Clear any existing timeout
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Reset copied state after 2 seconds
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
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

        <TwitterShareButton
          url={shareConfig.url}
          title={shareConfig.title}
          hashtags={['blog', 'tech', 'development']}
          className='social-share-btn'
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <FacebookShareButton url={shareConfig.url} className='social-share-btn'>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <LinkedinShareButton
          url={shareConfig.url}
          title={shareConfig.title}
          summary={shareConfig.quote}
          className='social-share-btn'
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={shareConfig.url}
          title={shareConfig.title}
          separator=' - '
          className='social-share-btn'
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareConfig.url}
          subject={shareConfig.title}
          body={`Check out this article: ${shareConfig.title}`}
          className='social-share-btn'
        >
          <EmailIcon size={32} round />
        </EmailShareButton>

        <button
          onClick={handleCopyLink}
          className={`social-share-btn copy-link-btn ${copied ? 'copied' : ''}`}
          title='Copy link'
        >
          <div className='copy-icon'>{copied ? '✓' : '🔗'}</div>
        </button>
      </div>
    </div>
  );
}
