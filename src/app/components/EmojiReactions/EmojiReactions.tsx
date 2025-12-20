'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrCreateFingerprint } from '@/app/utils/fingerprint';

import styles from './EmojiReactions.module.scss';

interface Reaction {
  emoji: string;
  count: number;
}

interface EmojiReactionsProps {
  blogSlug: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😄', '😮', '🎉', '🔥'];

export default function EmojiReactions({ blogSlug }: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const fetchReactions = useCallback(async (signal: AbortSignal) => {
    try {
      const fingerprint = getOrCreateFingerprint();

      // Add timestamp to prevent any caching
      const timestamp = Date.now();
      const response = await fetch(
        `/api/reactions?blogSlug=${encodeURIComponent(blogSlug)}&fingerprint=${encodeURIComponent(fingerprint)}&t=${timestamp}`,
        {
          signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions || []);
        setUserReactions(data.userReactions || []);
      }
    } catch (error) {
      // Don't log AbortError as it's expected when component unmounts
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching reactions:', error);
      }
    } finally {
      setIsFetched(true);
    }
  }, [blogSlug]);

  const handleReaction = useCallback(
    async (emoji: string) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const fingerprint = getOrCreateFingerprint();
        const response = await fetch('/api/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogSlug,
            emoji,
            fingerprint,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setReactions(data.reactions || []);
          // Update user reactions based on the toggle action
          if (data.userReaction) {
            setUserReactions((prev) => [...prev, emoji]);
          } else {
            setUserReactions((prev) => prev.filter((r) => r !== emoji));
          }
        }
      } catch (error) {
        console.error('Error adding reaction:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [blogSlug, isLoading]
  );

  // Load reactions on component mount
  useEffect(() => {
    const abortController = new AbortController();
    fetchReactions(abortController.signal);

    // Show the reactions bar after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [blogSlug, fetchReactions]);

  const getReactionCount = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji);
    return reaction ? reaction.count : 0;
  };

  if (!isVisible || !isFetched) return null;

  return (
    <div className={styles.emojiReactionsContainer}>
      <div className={styles.emojiReactionsBar}>
        {EMOJI_OPTIONS.map((emoji) => {
          const count = getReactionCount(emoji);
          const isUserReaction = userReactions.includes(emoji);

          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              disabled={isLoading}
              className={`${styles.emojiReactionBtn} ${isUserReaction ? styles.userReacted : ''}`}
              title={`React with ${emoji}`}
            >
              <span className={styles.emoji}>{emoji}</span>
              {count > 0 && <span className={styles.count}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
