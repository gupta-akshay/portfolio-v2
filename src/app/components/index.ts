// Layout components
export { default as Layout } from './Layout';

// Audio Player
export { default as AudioPlayer } from './AudioPlayer';
export type { AudioPlayerProps, Track } from './AudioPlayer';

// UI Components
export { default as BackBtn } from './BackBtn';
export { default as DayNightToggle } from './DayNightToggle';
export { default as LoadingIndicator } from './LoadingIndicator';
export { default as TypingAnimation } from './TypingAnimation';
export { default as EmojiReactions } from './EmojiReactions';
// export { default as ParticlesBackground } from './ParticlesBackground'; // TODO: Fix ParticlesBackground component

// Content Components
export { default as BlogImage } from './BlogImage';
export { default as BlogTile } from './BlogTile';
export { default as SingleBlog } from './SingleBlog';
export { default as Experience } from './Experience';
export { default as Skills } from './Skills';

// Re-export types that are actively used
export type {
  BackButtonProps,
  DayNightToggleProps,
  LoadingIndicatorProps,
  TypingAnimationProps,
  ExperienceProps,
  SkillsProps,
} from '../types/components';
