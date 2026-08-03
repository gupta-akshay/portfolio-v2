/**
 * Escape plaintext for interpolation into an HTML email body. The contact
 * endpoint accepts text, never markup, so escaping is the whole job.
 */
export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

type MergeFields = {
  name: string;
  email?: string;
  subject?: string;
  message?: string;
};

/** Substitutes {{name}}, {{email}}, {{subject}} and {{message}} in a template. */
export const replaceMergeFields = ({
  messageString,
  mergeFields,
}: {
  messageString: string;
  mergeFields: MergeFields;
}): string =>
  messageString.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => mergeFields[key as keyof MergeFields] ?? ''
  );
