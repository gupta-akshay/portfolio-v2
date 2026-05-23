import * as Sentry from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

function pickError(args: unknown[]): Error {
  const found = args.find((a) => a instanceof Error);
  if (found instanceof Error) return found;
  const msg = args
    .map((a) => {
      if (a instanceof Error) return a.message;
      if (typeof a === 'string') return a;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .filter(Boolean)
    .join(' ');
  return new Error(msg || 'Unknown error');
}

export const logger = {
  error(...args: unknown[]): void {
    if (isProd) {
      Sentry.captureException(pickError(args), { extra: { args } });
    } else if (typeof console !== 'undefined') {
      console.error(...args);
    }
  },
  warn(...args: unknown[]): void {
    if (isProd) {
      Sentry.captureMessage(
        args
          .map((a) =>
            a instanceof Error ? a.message : typeof a === 'string' ? a : '',
          )
          .filter(Boolean)
          .join(' ') || 'warning',
        { level: 'warning', extra: { args } },
      );
    } else if (typeof console !== 'undefined') {
      console.warn(...args);
    }
  },
  info(...args: unknown[]): void {
    if (!isProd && typeof console !== 'undefined') {
      console.info(...args);
    }
  },
  debug(...args: unknown[]): void {
    if (!isProd && typeof console !== 'undefined') {
      console.debug(...args);
    }
  },
};
