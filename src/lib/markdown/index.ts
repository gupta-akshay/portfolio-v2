import {
  generateAboutMarkdown,
  generateContactMarkdown,
  generateHomeMarkdown,
  generateMusicMarkdown,
  generateResumeMarkdown,
} from './pages';
import {
  generateBlogIndexMarkdown,
  generateBlogPostMarkdown,
} from './blog';

export interface MarkdownDocument {
  content: string;
  cacheControl: string;
}

const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';

export async function generateMarkdownDocument(
  pathSegments: string[] | undefined
): Promise<MarkdownDocument | null> {
  const path = pathSegments?.join('/') ?? '';
  let content: string | null;

  switch (path) {
    case '':
      content = generateHomeMarkdown();
      break;
    case 'about':
      content = generateAboutMarkdown();
      break;
    case 'resume':
      content = generateResumeMarkdown();
      break;
    case 'blog':
      content = await generateBlogIndexMarkdown();
      break;
    case 'contact':
      content = generateContactMarkdown();
      break;
    case 'music':
      content = generateMusicMarkdown();
      break;
    default:
      if (
        pathSegments?.length === 2 &&
        pathSegments[0] === 'blog' &&
        pathSegments[1]
      ) {
        content = await generateBlogPostMarkdown(pathSegments[1]);
      } else {
        content = null;
      }
  }

  return content ? { content, cacheControl: CACHE_CONTROL } : null;
}
