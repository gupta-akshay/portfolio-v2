// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://92f04de2356d976f2dbb123c711a4828@o4510544988995584.ingest.de.sentry.io/4510544991748176',

  // Sample 10% of transactions in production, 100% elsewhere.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // v11 sends logs and metrics whenever their APIs are called, so the old
  // `enableLogs` flag is gone. Its unset `dataCollection` default (user info,
  // cookies, headers, request bodies) matches what `sendDefaultPii: true` sent
  // under v10.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v10-to-v11/
});
