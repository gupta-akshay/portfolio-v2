import boxen from 'boxen';
import type { Options as BoxenOptions } from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import wrapAnsi from 'wrap-ansi';

import type { ResumeData, ResumeExperience } from './resumeData';

const defaultWidth = 90;
const accent = gradient([
  '#00f5ff',
  '#00c9ff',
  '#92fe9d',
  '#fcb045',
  '#fd1d1d',
  '#833ab4',
]);

const headingColor = chalk.hex('#7fdbff').bold;
const subHeadingColor = chalk.hex('#ffe66d');
const textColor = chalk.hex('#e0e0e0');
const bulletColor = chalk.hex('#64ffda');

const divider = (width: number) =>
  chalk.dim('─'.repeat(Math.max(20, Math.min(width, 120))));

const wrap = (value: string, width: number, indent = 0) => {
  const space = ' '.repeat(indent);
  return wrapAnsi(value, Math.max(20, width - indent), {
    trim: true,
    hard: false,
  })
    .split('\n')
    .map((line) => `${space}${line}`)
    .join('\n');
};

const center = (value: string, width: number) => {
  if (value.length >= width) return value;
  const padding = Math.floor((width - value.length) / 2);
  return `${' '.repeat(Math.max(0, padding))}${value}`;
};

const renderBox = (content: string, width: number, title?: string) => {
  const baseOptions: BoxenOptions = {
    padding: { top: 0, bottom: 0, left: 2, right: 2 },
    margin: { top: 1, bottom: 1, left: 0, right: 0 },
    borderColor: '#44475a',
    borderStyle: 'round',
    titleAlignment: 'left',
    width: Math.min(Math.max(40, width), 140),
  };

  const options: BoxenOptions = title ? { ...baseOptions, title } : baseOptions;

  return boxen(content, options);
};

const renderHighlights = (
  highlights: string[],
  width: number,
  indent = 2,
) =>
  highlights
    .map(
      (highlight) =>
        `${' '.repeat(indent)}${bulletColor('•')} ${wrap(
          highlight,
          width,
          indent + 2,
        )}`,
    )
    .join('\n');

export const renderBanner = (resume: ResumeData, width = defaultWidth) => {
  const ascii = figlet.textSync(resume.basics.name, { font: 'Small' });
  const gradientText = accent.multiline(ascii);
  const title = center(subHeadingColor(resume.basics.title), width);
  return `${gradientText}\n${title}\n${divider(width)}\n`;
};

export const renderSummary = (resume: ResumeData, width = defaultWidth) => {
  const summary = resume.basics.summary
    .map((paragraph) => wrap(textColor(paragraph), width - 4))
    .join('\n\n');

  return renderBox(
    `${headingColor('Summary')}\n${summary}`,
    width,
    'Overview',
  );
};

export const renderContacts = (
  resume: ResumeData,
  width = defaultWidth,
) => {
  const entries = [
    [`Email`, resume.basics.email],
    [`Phone`, resume.basics.phone],
    [`Location`, resume.basics.location],
    [`Website`, resume.basics.website],
    [`LinkedIn`, resume.basics.linkedin],
    [`GitHub`, resume.basics.github],
  ]
    .map(([label, value]) => `${subHeadingColor(label)}  ${textColor(value)}`)
    .join('\n');

  return renderBox(`${headingColor('Contact')}\n${entries}`, width, 'Contact');
};

export const renderSkills = (resume: ResumeData, width = defaultWidth) => {
  const content = resume.skills
    .map(
      ({ label, items }) =>
        `${subHeadingColor(label)}\n${wrap(
          textColor(items.join(', ')),
          width - 6,
          4,
        )}`,
    )
    .join('\n\n');

  return renderBox(`${headingColor('Skills')}\n${content}`, width, 'Skills');
};

const renderExperienceEntry = (
  experience: ResumeExperience,
  width: number,
) => {
  const header = `${subHeadingColor(experience.title)} ${chalk.gray(
    '@',
  )} ${textColor(experience.company)}`;
  const meta = `${chalk.dim(experience.period)} • ${chalk.dim(
    experience.location,
  )}`;
  const highlights = renderHighlights(experience.highlights, width, 4);

  return `${header}\n${meta}\n\n${highlights}`;
};

export const renderExperience = (
  resume: ResumeData,
  width = defaultWidth,
) => {
  const content = resume.experience
    .map((exp) => renderExperienceEntry(exp, width - 6))
    .join(`\n${divider(width - 6)}\n`);

  return renderBox(`${headingColor('Experience')}\n${content}`, width, 'XP');
};

export const renderEducation = (
  resume: ResumeData,
  width = defaultWidth,
) => {
  const content = resume.education
    .map(
      (education) =>
        `${subHeadingColor(education.degree)}\n${textColor(
          education.school,
        )}\n${chalk.dim(`${education.period} • ${education.location}`)}`,
    )
    .join(`\n${divider(width - 6)}\n`);

  return renderBox(`${headingColor('Education')}\n${content}`, width, 'Edu');
};

export const renderLinks = (resume: ResumeData, width = defaultWidth) => {
  const content = [
    `${subHeadingColor('PDF')} ${chalk.gray('→')} ${textColor(
      resume.basics.resumeUrl,
    )}`,
    `${subHeadingColor('Portfolio')} ${chalk.gray('→')} ${textColor(
      resume.basics.website,
    )}`,
    `${subHeadingColor('GitHub')} ${chalk.gray('→')} ${textColor(
      resume.basics.github,
    )}`,
  ].join('\n');

  return renderBox(`${headingColor('Links')}\n${content}`, width, 'Links');
};

export const renderHelp = (width = defaultWidth) => {
  const commands: Array<[string, string]> = [
    ['help', 'Show available commands'],
    ['summary', 'View TL;DR profile'],
    ['skills', 'List technology stacks'],
    ['experience', 'Career history'],
    ['education', 'Academic background'],
    ['links', 'Handy URLs'],
    ['resume', 'Render entire resume'],
    ['clear', 'Clear screen'],
    ['exit', 'Close the session'],
  ];

  const body = commands
    .map(
      ([command, description]) =>
        `${bulletColor(command.padEnd(12))} ${textColor(description)}`,
    )
    .join('\n');

  return renderBox(`${headingColor('Commands')}\n${body}`, width, 'Help');
};

export const renderFullResume = (
  resume: ResumeData,
  width = defaultWidth,
) =>
  [
    renderBanner(resume, width),
    renderSummary(resume, width),
    renderContacts(resume, width),
    renderSkills(resume, width),
    renderExperience(resume, width),
    renderEducation(resume, width),
    renderLinks(resume, width),
  ].join('\n');

export const renderWelcome = (resume: ResumeData, width = defaultWidth) =>
  [
    renderBanner(resume, width),
    renderSummary(resume, width),
    renderContacts(resume, width),
    chalk.dim('Type `help` to explore sections, `resume` for the full view.'),
  ].join('\n');

export const renderPrompt = () =>
  chalk.hex('#ff9ff3')('akshay') +
  chalk.hex('#c8d6e5')('@terminal') +
  chalk.hex('#ff6b6b')(' $ ');

