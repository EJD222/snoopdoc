import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DATABASE_POOL = Symbol('DATABASE_POOL')
export const DRIZZLE = Symbol('DRIZZLE')

export type TDatabase = NodePgDatabase<typeof import('../schema/index')>