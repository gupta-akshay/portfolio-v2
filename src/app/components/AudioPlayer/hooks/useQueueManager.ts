import { useState, useCallback } from 'react';
import { Track } from '../types';

export const useQueueManager = (tracks: Track[]) => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [queuedTrackIds, setQueuedTrackIds] = useState(new Set<string>());
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  // Add a track to the queue
  const addToQueue = useCallback((track: Track) => {
    setQueue((prevQueue) => [...prevQueue, track]);
    setQueuedTrackIds((prevIds) => {
      if (prevIds.has(track.id)) return prevIds;
      const newIds = new Set(prevIds);
      newIds.add(track.id);
      return newIds;
    });
  }, []);

  // Remove a track from the queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue((prevQueue) => {
      if (index < 0 || index >= prevQueue.length) return prevQueue;

      const newQueue = prevQueue
        .slice(0, index)
        .concat(prevQueue.slice(index + 1));
      const removedTrack = prevQueue[index];

      setQueuedTrackIds((prevIds) => {
        if (newQueue.some((track) => track.id === removedTrack.id))
          return prevIds;
        const newIds = new Set(prevIds);
        newIds.delete(removedTrack.id);
        return newIds;
      });

      return newQueue;
    });
  }, []);

  // Reorder the queue (for drag and drop)
  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      const [movedItem] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedItem);
      return newQueue;
    });
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffleActive((prev) => {
      const newShuffleState = !prev;

      if (newShuffleState) {
        setQueue((prevQueue) => {
          if (prevQueue.length <= 1) return prevQueue;

          const newQueue = [...prevQueue];
          // Fisher-Yates shuffle
          for (let i = newQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
          }
          return newQueue;
        });
      }

      return newShuffleState;
    });
  }, []);

  // Toggle queue visibility
  const toggleQueueVisibility = useCallback(() => {
    setIsQueueVisible((prev) => !prev);
  }, []);

  // Clear the queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueuedTrackIds(new Set());
  }, []);

  // Get the next track index
  const getNextTrackIndex = useCallback(
    (currentIndex: number | null) => {
      if (tracks.length === 0) return null;

      if (currentIndex === null) return 0;

      if (queue.length > 0) {
        const nextTrack = queue[0];
        setQueue((prevQueue) => prevQueue.slice(1));

        setQueuedTrackIds((prevIds) => {
          if (queue.slice(1).some((track) => track.id === nextTrack.id))
            return prevIds;
          const newIds = new Set(prevIds);
          newIds.delete(nextTrack.id);
          return newIds;
        });

        return tracks.findIndex((track) => track.id === nextTrack.id) || 0;
      }

      return Math.min(currentIndex + 1, tracks.length - 1);
    },
    [tracks, queue]
  );

  // Get the previous track index
  const getPreviousTrackIndex = useCallback(
    (currentIndex: number | null) => {
      if (tracks.length === 0) return null;
      return currentIndex === null
        ? tracks.length - 1
        : Math.max(currentIndex - 1, 0);
    },
    [tracks.length]
  );

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
    getNextTrackIndex,
    getPreviousTrackIndex,
  };
};

export default useQueueManager;
