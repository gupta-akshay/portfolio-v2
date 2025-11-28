import './colorEnv';

import boxen from 'boxen';
import type { Options as BoxenOptions } from 'boxen';
import chalk from './chalk';
import figlet from 'figlet';
import tinygradient from 'tinygradient';
import wrapAnsi from 'wrap-ansi';

import type { ResumeData, ResumeExperience } from './resumeData';

const DEFAULT_WIDTH = 90;
const BOX_WIDTH_MIN = 40;
const BOX_WIDTH_MAX = 140;

type GradientPrinter = {
  multiline: (value: string) => string;
};

type TinyColor = {
  toHexString: () => string;
};

const HELP_COMMANDS: Array<[string, string]> = [
  ['help | ?', 'Cheat sheet / command palette'],
  ['summary | tldr', 'Exec summary aka commit message'],
  ['skills | stack', 'Stacks, toys, and favorite toolchains'],
  ['experience | xp', 'Ship log with receipts'],
  ['education | edu', 'Street cred & classrooms'],
  ['links | urls', 'Bookmarks worth opening'],
  ['resume | ship | deploy', 'Print the whole README of me'],
  ['clear | cls', 'Wipe the buffer'],
  ['exit | quit | bye', 'Drop the SSH tunnel'],
];

const isWhitespace = (value: string) => /\s/.test(value);

const clampWidth = (value: number) =>
  Math.min(Math.max(BOX_WIDTH_MIN, value), BOX_WIDTH_MAX);

const paintLine = (line: string, palette: TinyColor[]) =>
  line
    .split('')
    .map((char, index) => {
      if (isWhitespace(char)) {
        return char;
      }
      const color =
        palette[Math.min(index, palette.length - 1)]?.toHexString() ?? '#ffffff';
      return chalk.hex(color)(char);
    })
    .join('');

const createGradient = (colors: string[]): GradientPrinter => {
  const gradient = tinygradient(colors);
  const minimumSteps = Math.max(gradient.stops.length, 2);

  return {
    multiline(value: string) {
      if (!value.length) return value;
      const lines = value.split('\n');
      const longestLine = lines.reduce(
        (max, line) => Math.max(max, line.length),
        0,
      );
      const steps = Math.max(longestLine, minimumSteps);
      const palette = gradient.rgb(steps) as unknown as TinyColor[];
      return lines.map((line) => paintLine(line, palette)).join('\n');
    },
  };
};

const accent = createGradient([
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

const wrapText = (value: string, width: number, indent = 0) => {
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
    width: clampWidth(width),
  };

  const options: BoxenOptions = title ? { ...baseOptions, title } : baseOptions;

  return boxen(content, options);
};

const renderSectionBox = (
  heading: string,
  body: string,
  width: number,
  title: string,
) => renderBox(`${headingColor(heading)}\n${body}`, width, title);

const renderHighlights = (
  highlights: string[],
  width: number,
  indent = 2,
) =>
  highlights
    .map(
      (highlight) =>
        `${' '.repeat(indent)}${bulletColor('•')} ${wrapText(
          highlight,
          width,
          indent + 2,
        )}`,
    )
    .join('\n');

const formatContactEntries = (resume: ResumeData) =>
  [
    [`Email`, resume.basics.email],
    [`Phone`, resume.basics.phone],
    [`Location`, resume.basics.location],
    [`Website`, resume.basics.website],
    [`LinkedIn`, resume.basics.linkedin],
    [`GitHub`, resume.basics.github],
  ]
    .map(([label, value]) => `${subHeadingColor(label)}  ${textColor(value)}`)
    .join('\n');

const formatSkillGroup = (
  label: string,
  items: string[],
  width: number,
) =>
  `${subHeadingColor(label)}\n${wrapText(
    textColor(items.join(', ')),
    width - 6,
    4,
  )}`;

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

const renderEducationEntry = () => (education: {
  degree: string;
  school: string;
  period: string;
  location: string;
}) =>
  `${subHeadingColor(education.degree)}\n${textColor(
    education.school,
  )}\n${chalk.dim(`${education.period} • ${education.location}`)}`;

export const renderBanner = (resume: ResumeData, width = DEFAULT_WIDTH) => {
  const ascii = figlet.textSync(resume.basics.name, { font: 'Small' });
  const gradientText = accent.multiline(ascii);
  const title = center(subHeadingColor(resume.basics.title), width);
  return `${gradientText}\n${title}\n${divider(width)}\n`;
};

export const renderSummary = (resume: ResumeData, width = DEFAULT_WIDTH) => {
  const summary = resume.basics.summary
    .map((paragraph) => wrapText(textColor(paragraph), width - 4))
    .join('\n\n');

  return renderSectionBox('Summary', summary, width, 'Overview');
};

export const renderContacts = (
  resume: ResumeData,
  width = DEFAULT_WIDTH,
) => {
  const entries = formatContactEntries(resume);
  return renderSectionBox('Contact', entries, width, 'Contact');
};

export const renderSkills = (resume: ResumeData, width = DEFAULT_WIDTH) => {
  const content = resume.skills
    .map(({ label, items }) => formatSkillGroup(label, items, width))
    .join('\n\n');

  return renderSectionBox('Skills', content, width, 'Skills');
};

export const renderExperience = (
  resume: ResumeData,
  width = DEFAULT_WIDTH,
) => {
  const content = resume.experience
    .map((exp) => renderExperienceEntry(exp, width - 6))
    .join(`\n${divider(width - 6)}\n`);

  return renderSectionBox('Experience', content, width, 'XP');
};

export const renderEducation = (
  resume: ResumeData,
  width = DEFAULT_WIDTH,
) => {
  const entry = renderEducationEntry(width - 6);
  const content = resume.education
    .map((education) => entry(education))
    .join(`\n${divider(width - 6)}\n`);

  return renderSectionBox('Education', content, width, 'Edu');
};

export const renderLinks = (resume: ResumeData, width = DEFAULT_WIDTH) => {
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

  return renderSectionBox('Links', content, width, 'Links');
};

export const renderHelp = (width = DEFAULT_WIDTH) => {
  const body = HELP_COMMANDS.map(
    ([command, description]) =>
      `${bulletColor(command.padEnd(12))} ${textColor(description)}`,
  ).join('\n');

  return renderSectionBox('Commands', body, width, 'Help');
};

export const renderFullResume = (
  resume: ResumeData,
  width = DEFAULT_WIDTH,
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

export const renderWelcome = (resume: ResumeData, width = DEFAULT_WIDTH) =>
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

