// Design-system entry point for /design-sync.
//
// This barrel is not imported by the app. It exists so the components in
// src/app/components can be bundled and type-extracted as a standalone
// library (see .design-sync/build-lib.mjs). Adding a component here is what
// makes it appear in the Claude Design project.

export { default as AudioPlayer } from './app/components/AudioPlayer/AudioPlayer';
export {
  PlayerBar,
  QueuePanel,
  Toast,
  TrackList,
  WaveformSeeker,
} from './app/components/AudioPlayer/components';

export { default as BackBtn } from './app/components/BackBtn/BackBtn';
export { default as BlogTileMDX } from './app/components/BlogTileMDX/BlogTileMDX';
export { default as ContactFormInteractive } from './app/components/ContactFormInteractive/ContactFormInteractive';
export { default as EmojiReactions } from './app/components/EmojiReactions/EmojiReactions';
export { default as Experience } from './app/components/Experience/Experience';
export { default as GitHubCalendar } from './app/components/GitHubCalendar/GitHubCalendar';
export { default as Icon } from './app/components/Icon/Icon';
export { default as Layout } from './app/components/Layout';
export { default as SiteNav } from './app/components/Layout/SiteNav';
export { default as LoadingIndicator } from './app/components/LoadingIndicator/LoadingIndicator';
export { default as MapSection } from './app/components/MapSection/MapSection';
export { default as MermaidRenderer } from './app/components/MermaidRenderer/MermaidRenderer';
export { default as ReadingProgressBar } from './app/components/ReadingProgressBar/ReadingProgressBar';
export { default as RouteError } from './app/components/RouteError/RouteError';
export { default as Skills } from './app/components/Skills/Skills';
export { default as SocialBar } from './app/components/SocialBar/SocialBar';
export { default as SocialShare } from './app/components/SocialShare/SocialShare';

// Providers — previews and generated designs wrap in these.
export { ThemeProvider } from './app/context/ThemeContext';
