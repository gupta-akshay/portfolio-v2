// Average reading speed in words per minute
const AVERAGE_READING_SPEED = 200;

/**
 * Counts words in a text string
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculates estimated reading time from plain text
 * @param text - Plain text string
 * @returns Object with reading time in minutes and formatted string
 */
export function calculateReadingTime(text: string): {
  minutes: number;
  text: string;
} {
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / AVERAGE_READING_SPEED);

  return {
    minutes,
    text: `${minutes} min read`,
  };
}

/**
 * Calculates estimated reading time from MDX content
 * Strips code blocks and markdown syntax before counting
 * @param content - MDX content string
 * @returns Object with reading time in minutes and formatted string
 */
export function calculateReadingTimeFromMDX(content: string): {
  minutes: number;
  text: string;
} {
  // Remove code blocks
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, '');
  // Remove markdown syntax
  const plainText = withoutInlineCode
    .replace(/[#*_~\[\]]/g, '')
    .replace(/\([^)]*\)/g, '')
    .trim();

  return calculateReadingTime(plainText);
}
