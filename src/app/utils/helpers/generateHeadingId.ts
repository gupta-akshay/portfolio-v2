/**
 * Generates a consistent heading ID from heading text
 * Used by both TableOfContents and blog content rendering
 */
export const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Extracts text from PortableText children array
 * Handles different formats that might come from PortableText
 */
export const extractTextFromChildren = (children: any[]): string => {
  return children
    .map((child) => {
      if (typeof child === 'string') {
        return child;
      }
      if (child && typeof child === 'object' && child.text) {
        return child.text;
      }
      if (
        child &&
        typeof child === 'object' &&
        child.props &&
        child.props.children
      ) {
        return extractTextFromChildren(
          Array.isArray(child.props.children)
            ? child.props.children
            : [child.props.children]
        );
      }
      return '';
    })
    .join('')
    .trim();
};
