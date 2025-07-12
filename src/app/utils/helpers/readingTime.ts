import { PortableTextBlock } from 'sanity';

// Average reading speed in words per minute
const AVERAGE_READING_SPEED = 200;

/**
 * Extracts plain text from PortableText blocks
 */
function extractTextFromPortableText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (
        block._type === 'block' &&
        block.children &&
        Array.isArray(block.children)
      ) {
        return block.children
          .map((child: any) => {
            if (child._type === 'span' && child.text) {
              return child.text;
            }
            return '';
          })
          .join('');
      }
      return '';
    })
    .join(' ');
}

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
 * Calculates estimated reading time from PortableText content
 * @param body - Array of PortableText blocks
 * @returns Object with reading time in minutes and formatted string
 */
export function calculateReadingTime(body: PortableTextBlock[]): {
  minutes: number;
  text: string;
} {
  const plainText = extractTextFromPortableText(body);
  const wordCount = countWords(plainText);
  const minutes = Math.ceil(wordCount / AVERAGE_READING_SPEED);

  return {
    minutes,
    text: `${minutes} min read`,
  };
}

/**
 * Calculates estimated reading time from plain text
 * @param text - Plain text string
 * @returns Object with reading time in minutes and formatted string
 */
export function calculateReadingTimeFromText(text: string): {
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
