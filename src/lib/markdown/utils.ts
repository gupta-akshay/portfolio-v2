export function markdownFrontmatter(
  title: string,
  description: string,
  canonical: string
): string {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical: ${JSON.stringify(canonical)}`,
    '---',
  ].join('\n');
}

export function markdownLink(label: string, href: string): string {
  return `[${label}](${href})`;
}
