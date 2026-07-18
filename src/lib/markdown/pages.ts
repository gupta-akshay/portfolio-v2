import { experienceData } from '@/app/utils/data/experience';
import { skillsData } from '@/app/utils/data/skills';
import { formatDateRange, getYearsOfExperience } from '@/app/utils/helpers/format';
import { resumeData } from '@/app/resume/data';
import {
  aboutContent,
  contactContent,
  homeContent,
  musicContent,
} from '@/lib/site-content';
import { getSiteUrl } from '@/lib/site-url';
import { markdownFrontmatter, markdownLink } from './utils';

function formatYearMonth(value: string): string {
  const [year, month] = value.split('-');
  if (!year || !month) return value;

  return new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function generateHomeMarkdown(): string {
  const siteUrl = getSiteUrl();
  const description = `${homeContent.role}. ${homeContent.lead}.`;

  return [
    markdownFrontmatter('Akshay Gupta', description, siteUrl),
    '',
    '# Akshay Gupta',
    '',
    `**${homeContent.role}**`,
    '',
    homeContent.lead,
    '',
    `I lead full-stack initiatives at ${markdownLink(homeContent.employer.name, homeContent.employer.url)}, ${homeContent.intro}`,
    '',
    '## Explore',
    '',
    `- ${markdownLink('About', `${siteUrl}/about`)}`,
    `- ${markdownLink('Resume', `${siteUrl}/resume`)}`,
    `- ${markdownLink('Writing', `${siteUrl}/blog`)}`,
    `- ${markdownLink('Music', `${siteUrl}/music`)}`,
    `- ${markdownLink('Contact', `${siteUrl}/contact`)}`,
  ].join('\n');
}

export function generateAboutMarkdown(): string {
  const siteUrl = getSiteUrl();
  const years = getYearsOfExperience();
  const groupedSkills = skillsData.reduce<Record<string, string[]>>(
    (groups, skill) => {
      const category = skill.category ?? 'other';
      (groups[category] ??= []).push(skill.name);
      return groups;
    },
    {}
  );
  const skillSections = Object.entries(groupedSkills).flatMap(
    ([category, skills]) => [
      `### ${category[0]?.toUpperCase()}${category.slice(1)}`,
      '',
      skills.join(', '),
      '',
    ]
  );
  const experienceSections = experienceData.flatMap((experience) => [
    `### ${experience.position} — ${experience.company}`,
    '',
    `**${formatDateRange(experience.startDate, experience.endDate)} · ${experience.location}**`,
    '',
    experience.description,
    '',
  ]);

  return [
    markdownFrontmatter(
      'About Akshay Gupta',
      `Senior Staff Engineer with over ${years} years of experience in web development.`,
      `${siteUrl}/about`
    ),
    '',
    '# About Akshay Gupta',
    '',
    `## ${aboutContent.heading}`,
    '',
    aboutContent.paragraphs[0]?.replace('{years}', String(years)) ?? '',
    '',
    aboutContent.paragraphs[1] ?? '',
    '',
    '## Education',
    '',
    ...aboutContent.education.flatMap((item) => [
      `### ${item.qualification}`,
      '',
      `${item.dates} · ${item.institution}`,
      '',
    ]),
    '## Skills',
    '',
    aboutContent.skillsIntro,
    '',
    ...skillSections,
    '## Experience',
    '',
    ...experienceSections,
    markdownLink('Start a conversation', `${siteUrl}/contact`),
  ].join('\n');
}

export function generateResumeMarkdown(): string {
  const siteUrl = getSiteUrl();
  const experienceSections = resumeData.experience.flatMap((company) => [
    `### ${company.company} — ${company.location}`,
    '',
    ...(company.summary ? [company.summary, ''] : []),
    ...company.roles.flatMap((role) => [
      `#### ${role.position}`,
      '',
      `**${formatYearMonth(role.startDate)} – ${
        role.endDate === 'present' ? 'Present' : formatYearMonth(role.endDate)
      }**`,
      '',
      ...role.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
  ]);

  return [
    markdownFrontmatter(
      `Resume — ${resumeData.name}`,
      resumeData.summary,
      `${siteUrl}/resume`
    ),
    '',
    `# ${resumeData.name}`,
    '',
    `**${resumeData.headline}**`,
    '',
    `${resumeData.location} · ${markdownLink(resumeData.email, `mailto:${resumeData.email}`)} · ${markdownLink(resumeData.website, resumeData.website)}`,
    '',
    '## Summary',
    '',
    resumeData.summary,
    '',
    '## Skills',
    '',
    ...resumeData.skills.map(
      (skill) => `- **${skill.label}:** ${skill.details}`
    ),
    '',
    '## Experience',
    '',
    ...experienceSections,
    '## Education',
    '',
    ...resumeData.education.flatMap((education) => [
      `### ${education.institution}`,
      '',
      `${education.degree} in ${education.area} · ${education.date}`,
      '',
      education.location,
      '',
    ]),
  ].join('\n');
}

export function generateContactMarkdown(): string {
  const siteUrl = getSiteUrl();

  return [
    markdownFrontmatter(
      'Contact Akshay Gupta',
      contactContent.intro,
      `${siteUrl}/contact`
    ),
    '',
    '# Contact',
    '',
    `## ${contactContent.heading}`,
    '',
    contactContent.intro,
    '',
    `**Location:** ${contactContent.location}`,
    '',
    ...contactContent.emails.map(
      (email) => `- ${markdownLink(email, `mailto:${email}`)}`
    ),
  ].join('\n');
}

export function generateMusicMarkdown(): string {
  const siteUrl = getSiteUrl();

  return [
    markdownFrontmatter(
      'Music by Akshay Gupta',
      musicContent.paragraphs[0] ?? 'Original productions and remixes.',
      `${siteUrl}/music`
    ),
    '',
    '# Music',
    '',
    ...musicContent.paragraphs.flatMap((paragraph) => [paragraph, '']),
    'The interactive player and track list are available on the HTML version of this page.',
  ].join('\n');
}
