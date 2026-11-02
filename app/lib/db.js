import { neon } from '@neondatabase/serverless';

let client;
export function db() {
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}
export const toVector = (values) => `[${values.join(',')}]`;
