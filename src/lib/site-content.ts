export const homeContent = {
  role: 'Senior Staff Engineer',
  lead: 'Building high-quality product experiences and reliable systems',
  employer: {
    name: 'PeopleGrove',
    url: 'https://www.peoplegrove.com',
  },
  intro:
    'translating product goals into scalable architecture and polished user interfaces. My focus is delivering software that performs well, feels intuitive, and creates measurable business impact.',
};

export const aboutContent = {
  heading: 'Engineering Leadership with Product Focus',
  paragraphs: [
    'I am a Senior Staff Engineer with {years}+ years of experience building web platforms and internal systems. I work across architecture, delivery, and mentoring to help teams ship faster without compromising quality.',
    'My strengths include scalable front-end architecture, robust backend services, and turning ambiguous requirements into practical roadmaps. Outside work, I produce music and stay active in developer communities.',
  ],
  skillsIntro:
    "I love building websites and apps from start to finish! Over the years, I've learned to use many different tools to create amazing things on the internet.",
  education: [
    {
      dates: '2013-2017',
      qualification: 'Bachelor of Engineering in Computer Science',
      institution: 'RGPV, India',
    },
    {
      dates: '2013',
      qualification: 'High School Diploma',
      institution: 'Central Board of Secondary Education',
    },
  ],
};

export const blogIntro =
  'Long-form notes on engineering, architecture, performance, and practical lessons from shipping production software.';

export const projectsIntro =
  'Things I built for myself and left in the open — a database tool for AI assistants, and the shell and desktop config I actually run every day.';

// Hand-curated: two of these repos carry no GitHub description, and the order is
// editorial rather than star-sorted. GitHub only supplies the star count at
// render time, so this list stands on its own if that request fails.
export const projects = [
  {
    repo: 'postgres-mcp',
    tagline:
      'A Model Context Protocol server that gives Claude Code and Cursor live access to a PostgreSQL database — slow-query analysis, schema exploration, hypothetical index simulation and health checks, without leaving the conversation. Pure Go, no CGo, ships as a ~15 MB static binary.',
    language: 'Go',
    tech: ['MCP', 'PostgreSQL', 'HypoPG', 'Docker'],
    license: 'MIT',
  },
  {
    repo: 'omarchy-waybar-config',
    tagline:
      'A Waybar setup for Omarchy and Hyprland, built on the HANCORE theme pack. The installer pulls its AUR dependencies, backs up whatever config is already there, and asks which optional modules — weather, GPU, audio visualiser, network speed — should end up on the bar.',
    language: 'Shell',
    tech: ['Waybar', 'Hyprland', 'Omarchy', 'Arch Linux'],
    license: 'MIT',
  },
  {
    repo: 'zsh-config',
    tagline:
      'A Zinit-based ZSH configuration with the Starship prompt, zoxide jumping, FZF-backed completion, syntax highlighting and a pile of aliases. The installer detects Arch or macOS and routes through pacman or Homebrew accordingly.',
    language: 'Shell',
    tech: ['Zinit', 'Starship', 'FZF', 'Zoxide'],
    license: 'MIT',
  },
] as const;

export const contactContent = {
  heading: "Let's connect",
  intro:
    'I am open to high-impact product collaborations, engineering leadership roles, and strategic consulting engagements.',
  location: 'Mumbai, Maharashtra, India',
  emails: ['contact@akshaygupta.live', 'akshaygupta.live@gmail.com'],
};

// `color` is the brand mark's colour. GitHub, Medium and Dev.to are black
// wordmarks by design — they would vanish on the dark canvas, so they are left
// without one and follow the theme's ink instead.
export const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/gupta-akshay', icon: 'github' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/akshayguptaujn',
    icon: 'linkedin',
    color: '#0a66c2',
  },
  {
    label: 'Medium',
    url: 'https://medium.com/@akshaygupta.live',
    icon: 'medium',
  },
  { label: 'Dev.to', url: 'https://dev.to/akshay_gupta', icon: 'dev' },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/dja_shay',
    icon: 'instagram',
    color: '#e4405f',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/deejay.ashay',
    icon: 'facebook',
    color: '#1877f2',
  },
  {
    label: 'SoundCloud',
    url: 'https://soundcloud.com/dj_ashay',
    icon: 'soundcloud',
    color: '#ff5500',
  },
] as const;

export const musicContent = {
  paragraphs: [
    'Music is a creative practice that complements my engineering work. This collection includes original productions and remixes across electronic and melodic styles.',
    'Each track reflects experimentation in arrangement, texture, and rhythm, with the same attention to detail I bring to software.',
  ],
};
