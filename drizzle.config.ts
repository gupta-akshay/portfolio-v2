import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: './db/schema.ts',
  /**
   * Never edit the migrations directly, only use drizzle.
   * There are scripts in the package.json "db:generate" and "db:migrate" to handle this.
   */
  out: './migrations',
});
