import { getEnv } from "@/config/utils/env";
import { ConfigService } from "@nestjs/config";
import type { PoolConfig } from 'pg';

export interface IBuildConfigPoolOptions {
    user: string
}

const POOL_DEFAULTS = {
    max: 20,
    min: 0,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 60_000,
    maxLifetimeSeconds: 1_800,
    statementTimeoutMillis: 30_000,
    queryTimeoutMillis: 35_000,
    idleInTransactionTimeoutMillis: 60_000
} as const;

export function buildPoolConfig(
    config: ConfigService | undefined,
    options: IBuildConfigPoolOptions
): PoolConfig {
    return {
        host: getEnv('DB_HOST', config),
        port: getEnv<number>('DB_PORT', config),
        database: getEnv('DB_NAME', config),
        user: options.user,
        password: getEnv('DB_PASSWORD', config),
        ssl: false,

        ...POOL_DEFAULTS
    }
}

export interface IPoolStats {
    total: number,
    idle: number,
    waiting: number,
    max: number
}