import { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { getAudioUrl } from '../utils';

/**
 * Custom hook to load and manage track durations
 */
export const useTrackDurations = (
  tracks: Track[],
  cloudName: string | undefined
) => {
  const [trackDurations, setTrackDurations] = useState<{
    [id: string]: number,
  }>({});
  const hiddenAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadedTracksRef = useRef<Set<string>>(new Set());

  // Load track durations on component mount
  useEffect(() => {
    // Create a hidden audio element to load metadata for all tracks
    const loadTrackDurations = async () => {
      const durations: { [id: string]: number } = {};

      // Create a hidden audio element if it doesn't exist
      if (!hiddenAudioRef.current) {
        hiddenAudioRef.current = new Audio();
        // Add crossOrigin attribute to allow loading from Cloudinary
        hiddenAudioRef.current.crossOrigin = 'anonymous';
      }

      // Load each track's metadata sequentially
      for (const track of tracks) {
        if (!track.id) continue;

        try {
          // Only load if we don't already have the duration and haven't loaded it before
          if (
            !trackDurations[track.id] &&
            !loadedTracksRef.current.has(track.id)
          ) {
            loadedTracksRef.current.add(track.id);
            const audioUrl = getAudioUrl(track.cloudinaryPublicId, cloudName);

            // Create a promise to wait for metadata to load
            await new Promise<void>((resolve, reject) => {
              if (!hiddenAudioRef.current) {
                reject(new Error('Audio element not available'));
                return;
              }

              // Set up event listeners
              const onLoadedMetadata = () => {
                if (hiddenAudioRef.current) {
                  durations[track.id] = hiddenAudioRef.current.duration;
                  console.log(
                    `Loaded duration for ${track.title}: ${hiddenAudioRef.current.duration}s`
                  );
                  resolve();
                }
              };

              const onError = (e: ErrorEvent) => {
                console.error(
                  `Error loading metadata for track: ${track.title}`,
                  e
                );
                // Use a default duration if metadata fails to load
                durations[track.id] = 180; // Default to 3 minutes (180 seconds)
                resolve();
              };

              // Add event listeners
              hiddenAudioRef.current.addEventListener(
                'loadedmetadata',
                onLoadedMetadata,
                { once: true }
              );
              hiddenAudioRef.current.addEventListener(
                'error',
                onError as EventListener,
                { once: true }
              );

              // Set a timeout to handle cases where the audio might hang
              const timeoutId = setTimeout(() => {
                console.warn(
                  `Timeout loading metadata for track: ${track.title}`
                );
                durations[track.id] = 180; // Default to 3 minutes
                resolve();
              }, 5000); // 5 second timeout

              // Set the source and begin loading
              hiddenAudioRef.current.src = audioUrl;
              hiddenAudioRef.current.preload = 'metadata';

              // Clean up timeout on success
              hiddenAudioRef.current.addEventListener(
                'loadedmetadata',
                () => {
                  clearTimeout(timeoutId);
                },
                { once: true }
              );

              hiddenAudioRef.current.load();
            });
          }
        } catch (error) {
          console.error(
            `Error loading duration for track ${track.title}:`,
            error
          );
          // Still add a default duration even if there's an error
          durations[track.id] = 180; // Default to 3 minutes
        }
      }

      // Only update state if we have new durations
      if (Object.keys(durations).length > 0) {
        setTrackDurations((prev) => ({ ...prev, ...durations }));
      }
    };

    loadTrackDurations();

    // Clean up
    return () => {
      if (hiddenAudioRef.current) {
        hiddenAudioRef.current.src = '';
        hiddenAudioRef.current.remove();
      }
    };
  }, [tracks, cloudName]);

  return { trackDurations, setTrackDurations };
};
