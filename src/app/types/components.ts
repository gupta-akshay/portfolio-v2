// Component prop types that are actively used

// Skills component types
export interface SkillsProps {
  skills?: Array<{
    id: string;
    name: string;
    icon: string;
    category?: string;
  }>;
  showCategories?: boolean;
}

// Experience component types
export interface ExperienceProps {
  experiences?: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    description: string;
    logo?: string;
  }>;
  showLogos?: boolean;
}

// TypingAnimation component types
export interface TypingAnimationProps {
  strings?: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  className?: string;
}

// LoadingIndicator component types
export interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  className?: string;
}

// DayNightToggle component types
export interface DayNightToggleProps {
  isLight?: boolean;
  onToggle?: () => void;
  className?: string;
}

// BackButton component types
export interface BackButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
  showIcon?: boolean;
}
