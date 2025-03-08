import { useState, useCallback } from 'react';
import { Track } from '../types';

export const useQueueManager = (tracks: Track[]) => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [queuedTrackIds, setQueuedTrackIds] = useState<Set<string>>(new Set());
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  // Add a track to the queue
  const addToQueue = useCallback((track: Track) => {
    setQueue((prevQueue) => [...prevQueue, track]);
    setQueuedTrackIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(track.id);
      return newIds;
    });
  }, []);

  // Remove a track from the queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      const removedTrack = newQueue.splice(index, 1)[0];

      // Check if this track appears elsewhere in the queue
      const stillInQueue = newQueue.some(
        (track) => track.id === removedTrack.id
      );

      if (!stillInQueue) {
        setQueuedTrackIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.delete(removedTrack.id);
          return newIds;
        });
      }

      return newQueue;
    });
  }, []);

  // Reorder the queue (for drag and drop)
  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
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
        // Shuffle the queue when activated
        setQueue((prevQueue) => {
          if (prevQueue.length <= 1) return prevQueue;

          const newQueue = [...prevQueue];
          // Fisher-Yates shuffle algorithm
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

  // Get the next track based on current index and queue
  const getNextTrackIndex = useCallback(
    (currentIndex: number | null) => {
      // If no tracks, return null
      if (tracks.length === 0) return null;

      // If no current track, start with the first one
      if (currentIndex === null) return 0;

      // If queue has tracks, play from queue
      if (queue.length > 0) {
        // Remove the first track from queue and return its index in the main tracks array
        const nextTrack = queue[0];
        setQueue((prevQueue) => prevQueue.slice(1));

        // Check if this track appears elsewhere in the queue
        const stillInQueue = queue
          .slice(1)
          .some((track) => track.id === nextTrack.id);
        if (!stillInQueue) {
          setQueuedTrackIds((prevIds) => {
            const newIds = new Set(prevIds);
            newIds.delete(nextTrack.id);
            return newIds;
          });
        }

        // Find the index of this track in the main tracks array
        const trackIndex = tracks.findIndex(
          (track) => track.id === nextTrack.id
        );
        return trackIndex >= 0 ? trackIndex : 0;
      }

      // Normal sequential playback
      const nextIndex = currentIndex + 1;

      // If we've reached the end, stay on the last track
      if (nextIndex >= tracks.length) {
        return currentIndex;
      }

      return nextIndex;
    },
    [tracks, queue]
  );

  // Get the previous track based on current index
  const getPreviousTrackIndex = useCallback(
    (currentIndex: number | null) => {
      // If no tracks, return null
      if (tracks.length === 0) return null;

      // If no current track, start with the last one
      if (currentIndex === null) return tracks.length - 1;

      // Normal sequential playback
      const prevIndex = currentIndex - 1;

      // If we've reached the beginning, stay on the first track
      if (prevIndex < 0) {
        return 0;
      }

      return prevIndex;
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
