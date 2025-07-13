// Layout components
export { default as Layout } from './Layout';

// Audio Player
export { default as AudioPlayer } from './AudioPlayer';
export type { AudioPlayerProps, Track } from './AudioPlayer';

// UI Components
export { default as BackBtn } from './BackBtn';
export { default as DayNightToggle } from './DayNightToggle';
export { default as LoadingIndicator } from './LoadingIndicator';
export { default as MagneticHover, RippleEffect } from './MagneticHover';
export {
  default as InteractiveBackground,
  FloatingShapes,
} from './InteractiveBackground';
export {
  default as ScrollAnimation,
  StaggerAnimation,
  TextAnimation,
} from './ScrollAnimation';
export { default as TypingAnimation } from './TypingAnimation';
export { default as EmojiReactions } from './EmojiReactions';
export { default as ReadingProgressBar } from './ReadingProgressBar';
export { default as SocialShare } from './SocialShare';
export { default as TableOfContents } from './TableOfContents';
export { default as CustomCursor } from './CustomCursor';
export { default as CursorInteractive } from './CursorInteractive';
export { default as BuyMeACoffee } from './BuyMeACoffee';

// Content Components
export { default as BlogImage } from './BlogImage';
export { default as BlogTile } from './BlogTile';
export { default as SingleBlog } from './SingleBlog';
export { default as Experience } from './Experience';
export { default as Skills } from './Skills';

// Re-export types that are actively used
export type {
  DayNightToggleProps,
  LoadingIndicatorProps,
  TypingAnimationProps,
  ExperienceProps,
  SkillsProps,
  SocialShareProps,
} from '../types/components';
