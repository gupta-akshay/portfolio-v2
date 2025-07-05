/**
 * Date formatting utilities
 */

/**
 * Format a date string to display format
 * @param dateString - ISO date string
 * @returns Formatted date string (DD/MMM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const day: string = date.getUTCDate().toString().padStart(2, '0');
  const month: string = date.toLocaleString('en-US', { month: 'short' });
  const year: number = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format a date range to display format
 * @param startDate - ISO date string
 * @param endDate - ISO date string
 * @returns Formatted date range string (MMM YYYY - MMM YYYY)
 */
export const formatDateRange = (
  startDate: string,
  endDate?: string
): string => {
  const start = new Date(startDate);
  const startStr = start.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  if (!endDate) {
    return `${startStr} - Present`;
  }

  const end = new Date(endDate);
  const endStr = end.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
};
