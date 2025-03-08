import { useState, useCallback, useEffect } from 'react';
import { Track, RepeatMode, ToastNotification } from '../types';

export const useQueueManager = (tracks: Track[]) => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [queuedTrackIds, setQueuedTrackIds] = useState<Set<string>>(new Set());
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.OFF);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  // Add a track to the queue
  const addToQueue = useCallback((track: Track) => {
    setQueue(prevQueue => [...prevQueue, track]);
    setQueuedTrackIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.add(track.id);
      return newIds;
    });

    // Show toast notification
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}`,
      message: `Added "${track.name || track.title}" to queue`,
      type: 'success'
    };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }, []);

  // Remove a track from the queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      const removedTrack = newQueue.splice(index, 1)[0];
      
      // Check if this track appears elsewhere in the queue
      const stillInQueue = newQueue.some(track => track.id === removedTrack.id);
      
      if (!stillInQueue) {
        setQueuedTrackIds(prevIds => {
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
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      const [movedItem] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedItem);
      return newQueue;
    });
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffleActive(prev => {
      const newShuffleState = !prev;
      
      if (newShuffleState) {
        // Shuffle the queue when activated
        setQueue(prevQueue => {
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

  // Toggle repeat mode (OFF -> ALL -> ONE -> OFF)
  const toggleRepeat = useCallback(() => {
    setRepeatMode(prevMode => {
      switch (prevMode) {
        case RepeatMode.OFF:
          return RepeatMode.ALL;
        case RepeatMode.ALL:
          return RepeatMode.ONE;
        case RepeatMode.ONE:
        default:
          return RepeatMode.OFF;
      }
    });
  }, []);

  // Toggle queue visibility
  const toggleQueueVisibility = useCallback(() => {
    setIsQueueVisible(prev => !prev);
  }, []);

  // Close a toast notification
  const closeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Get the next track based on current index, queue, and playback settings
  const getNextTrackIndex = useCallback((currentIndex: number | null) => {
    // If no tracks, return null
    if (tracks.length === 0) return null;
    
    // If no current track, start with the first one
    if (currentIndex === null) return 0;
    
    // If queue has tracks, play from queue
    if (queue.length > 0) {
      // Remove the first track from queue and return its index in the main tracks array
      const nextTrack = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      
      // Check if this track appears elsewhere in the queue
      const stillInQueue = queue.slice(1).some(track => track.id === nextTrack.id);
      if (!stillInQueue) {
        setQueuedTrackIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(nextTrack.id);
          return newIds;
        });
      }
      
      // Find the index of this track in the main tracks array
      const trackIndex = tracks.findIndex(track => track.id === nextTrack.id);
      return trackIndex >= 0 ? trackIndex : 0;
    }
    
    // If repeat one is active, return the same track
    if (repeatMode === RepeatMode.ONE) {
      return currentIndex;
    }
    
    // Normal sequential playback or shuffle
    const nextIndex = currentIndex + 1;
    
    // If we've reached the end
    if (nextIndex >= tracks.length) {
      // If repeat all is active, go back to the beginning
      if (repeatMode === RepeatMode.ALL) {
        return 0;
      }
      // Otherwise, stay on the last track
      return currentIndex;
    }
    
    return nextIndex;
  }, [tracks, queue, repeatMode]);

  // Get the previous track based on current index and playback settings
  const getPreviousTrackIndex = useCallback((currentIndex: number | null) => {
    // If no tracks, return null
    if (tracks.length === 0) return null;
    
    // If no current track, start with the last one
    if (currentIndex === null) return tracks.length - 1;
    
    // If repeat one is active, return the same track
    if (repeatMode === RepeatMode.ONE) {
      return currentIndex;
    }
    
    // Normal sequential playback
    const prevIndex = currentIndex - 1;
    
    // If we've reached the beginning
    if (prevIndex < 0) {
      // If repeat all is active, go to the end
      if (repeatMode === RepeatMode.ALL) {
        return tracks.length - 1;
      }
      // Otherwise, stay on the first track
      return 0;
    }
    
    return prevIndex;
  }, [tracks.length, repeatMode]);

  return {
    queue,
    queuedTrackIds,
    isShuffleActive,
    repeatMode,
    toasts,
    isQueueVisible,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    toggleShuffle,
    toggleRepeat,
    toggleQueueVisibility,
    closeToast,
    getNextTrackIndex,
    getPreviousTrackIndex
  };
};

export default useQueueManager; 