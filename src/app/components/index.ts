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
export { default as ReadingProgressBar } from './ReadingProgressBar';
export { default as SocialShare } from './SocialShare';
export { default as TerminalCTA } from './TerminalCTA';
export { TerminalCTAProvider } from './TerminalCTA/TerminalCTAContext';

// Content Components
export { default as BlogTileMDX } from './BlogTileMDX';
export { default as Experience } from './Experience';
export { default as Skills } from './Skills';
export { default as GitHubCalendar } from './GitHubCalendar';

// Re-export types that are actively used
export type {
  DayNightToggleProps,
  LoadingIndicatorProps,
  TypingAnimationProps,
  ExperienceProps,
  SkillsProps,
  SocialShareProps,
} from '../types/components';
