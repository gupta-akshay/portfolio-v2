import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
  AWS_BUCKET_NAME: z.string().min(1, 'AWS_BUCKET_NAME is required'),
  CLOUDFRONT_DOMAIN: z.string().optional(),
  CLOUDFRONT_KEY_PAIR_ID: z.string().optional(),
  CLOUDFRONT_PRIVATE_KEY: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseServerEnv(): ServerEnv {
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    return process.env as unknown as ServerEnv;
  }
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n  ');
    throw new Error(`Invalid server environment variables:\n  ${issues}`);
  }
  return result.data;
}

// Lazy evaluation: only validated when first accessed.
let _serverEnv: ServerEnv | null = null;

export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_, key: string) {
    if (typeof window !== 'undefined') {
      throw new Error(
        `Attempted to read serverEnv.${key} on the client. Read process.env.NEXT_PUBLIC_* directly instead.`
      );
    }
    if (!_serverEnv) _serverEnv = parseServerEnv();
    return _serverEnv[key as keyof ServerEnv];
  },
});
