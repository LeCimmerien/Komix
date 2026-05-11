import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import logger from '$lib/server/logger';

const log = logger.child({ module: 'database' });

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema });

log.info('Database connection established');

export default db;
