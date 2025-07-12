// Track used IDs to ensure uniqueness within a document
const usedIds = new Set<string>();

/**
 * Generates a consistent heading ID from heading text
 * Used by both TableOfContents and blog content rendering
 */
export const generateHeadingId = (text: string): string => {
  const baseId = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // If the ID is unique, return it
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }

  // If duplicate, find the next available suffix
  let counter = 2;
  let uniqueId = `${baseId}-${counter}`;
  while (usedIds.has(uniqueId)) {
    counter++;
    uniqueId = `${baseId}-${counter}`;
  }

  usedIds.add(uniqueId);
  return uniqueId;
};

/**
 * Reset function to clear IDs for a new document
 */
export const resetHeadingIds = (): void => {
  usedIds.clear();
};

/**
 * Extracts text from PortableText children array
 * Handles different formats that might come from PortableText
 */
export const extractTextFromChildren = (children: any): string => {
  // Handle undefined/null
  if (!children) {
    return '';
  }

  // Handle single string
  if (typeof children === 'string') {
    return children.trim();
  }

  // Handle single object
  if (typeof children === 'object' && !Array.isArray(children)) {
    if (children.text) {
      return children.text.trim();
    }
    if (children.props && children.props.children) {
      return extractTextFromChildren(children.props.children);
    }
    return '';
  }

  // Handle array
  if (Array.isArray(children)) {
    return children
      .map((child) => extractTextFromChildren(child))
      .join('')
      .trim();
  }

  return '';
};
