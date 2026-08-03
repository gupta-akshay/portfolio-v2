import 'server-only';

import { drizzle } from 'drizzle-orm/neon-http';
import { serverEnv } from '@/env';
import * as schema from './schema';

export const db = drizzle(serverEnv.DATABASE_URL, { schema });
