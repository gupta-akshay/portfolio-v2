import { useState } from 'react';
import { Track } from '@/app/types';

export const useQueueManager = (tracks: Track[]) => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const queuedTrackIds = new Set(queue.map((track) => track.id));

  // Add a track to the queue
  const addToQueue = (track: Track) => {
    setQueue((prevQueue) => [...prevQueue, track]);
  };

  // Remove a track from the queue
  const removeFromQueue = (index: number) => {
    setQueue((prevQueue) => {
      if (index < 0 || index >= prevQueue.length) return prevQueue;

      return prevQueue.slice(0, index).concat(prevQueue.slice(index + 1));
    });
  };

  // Reorder the queue (for drag and drop)
  const reorderQueue = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      const [movedItem] = newQueue.splice(fromIndex, 1);
      if (movedItem) {
        newQueue.splice(toIndex, 0, movedItem);
      }
      return newQueue;
    });
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setIsShuffleActive((prev) => {
      const newShuffleState = !prev;

      if (newShuffleState) {
        setQueue((prevQueue) => {
          if (prevQueue.length <= 1) return prevQueue;

          const newQueue = [...prevQueue];
          // Fisher-Yates shuffle
          for (let i = newQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const itemI = newQueue[i];
            const itemJ = newQueue[j];
            if (itemI && itemJ) {
              [newQueue[i], newQueue[j]] = [itemJ, itemI];
            }
          }
          return newQueue;
        });
      }

      return newShuffleState;
    });
  };

  // Toggle queue visibility
  const toggleQueueVisibility = () => {
    setIsQueueVisible((prev) => !prev);
  };

  // Clear the queue
  const clearQueue = () => {
    setQueue([]);
  };

  const advanceQueue = (count: number) => {
    setQueue((current) => current.slice(count));
  };

  // Get the next track index
  const getNextTrackIndex = (currentIndex: number | null) => {
    if (tracks.length === 0) return null;

    if (currentIndex === null) return 0;

    if (queue.length > 0) {
      const nextTrack = queue[0];
      if (!nextTrack) return Math.min(currentIndex + 1, tracks.length - 1);

      setQueue((prevQueue) => prevQueue.slice(1));

      const idx = tracks.findIndex((track) => track.id === nextTrack.id);
      return idx !== -1 ? idx : currentIndex;
    }

    return Math.min(currentIndex + 1, tracks.length - 1);
  };

  // Get the previous track index
  const getPreviousTrackIndex = (currentIndex: number | null) => {
    if (tracks.length === 0) return null;
    return currentIndex === null
      ? tracks.length - 1
      : Math.max(currentIndex - 1, 0);
  };

  return {
    queue,
    queuedTrackIds,
    isShuffleActive,
    isQueueVisible,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    toggleShuffle,
    toggleQueueVisibility,
    clearQueue,
    advanceQueue,
    getNextTrackIndex,
    getPreviousTrackIndex,
  };
};
