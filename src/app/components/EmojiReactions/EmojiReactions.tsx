'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getOrCreateFingerprint } from '@/app/utils/fingerprint';

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

  // Load reactions on component mount
  useEffect(() => {
    fetchReactions();

    // Show the reactions bar after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [blogSlug]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/reactions?blogSlug=${encodeURIComponent(blogSlug)}`);
      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions || []);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReaction = async (emoji: string) => {
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
          setUserReactions(prev => [...prev, emoji]);
        } else {
          setUserReactions(prev => prev.filter(r => r !== emoji));
        }
      } else {
        toast.error('Failed to add reaction');
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    } finally {
      setIsLoading(false);
    }
  };

  const getReactionCount = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    return reaction ? reaction.count : 0;
  };

  if (!isVisible) return null;

  return (
    <div className="emoji-reactions-container">
      <div className="emoji-reactions-bar">
        {EMOJI_OPTIONS.map((emoji) => {
          const count = getReactionCount(emoji);
          const isUserReaction = userReactions.includes(emoji);

          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              disabled={isLoading}
              className={`emoji-reaction-btn ${isUserReaction ? 'user-reacted' : ''}`}
              title={`React with ${emoji}`}
            >
              <span className="emoji">{emoji}</span>
              {count > 0 && (
                <span className="count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 