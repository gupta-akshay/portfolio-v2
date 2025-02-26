/**
 * Utility functions for the audio player
 */

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Generate Cloudinary audio URL from public ID
 */
export const getAudioUrl = (publicId: string, cloudName: string | undefined): string => {
  return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`;
};

/**
 * Check if the current theme is light
 */
export const isLightTheme = (): boolean => {
  return document.body.classList.contains('theme-light');
};
