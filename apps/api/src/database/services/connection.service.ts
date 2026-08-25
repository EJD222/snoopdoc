import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { TDatabase } from '../types/database';
import { ConfigService } from '@nestjs/config';
import { buildPoolConfig, IPoolStats } from '../utils/pool';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/schema';
import { getEnv } from '@/config/utils/env';

@Injectable()
export class ConnectionService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ConnectionService.name);
    private readonly connectionPool: Pool;
    private readonly database: TDatabase;

    constructor(private readonly config: ConfigService) {
        this.connectionPool = new Pool(
            buildPoolConfig(config, {
                user: getEnv('DB_USER')
            })
        )

        this.connectionPool.on('error', (error) => {
            this.logger.error('Idle client error - pool evicted client', error.stack);
        })

        this.database = drizzle(this.connectionPool, {
            casing: 'snake_case',
            schema,
            logger: getEnv('NODE_ENV') === 'development'
        })
    }

    async onModuleInit(): Promise<void> {
        const client = await this.connectionPool.connect();
        
        try {
            await client.query('SELECT 1');
        } finally {
            client.release();
        }

        this.logger.log(`Connect to variable ${getEnv('DB_NAME')} (max=${this.connectionPool.options.max}).`)
    }

    async onModuleDestroy(signal?: string): Promise<void> {
        this.logger.log(`Closing database pool (signal: ${signal ?? 'none'}`);
        await this.connectionPool.end();
    }

    get db(): TDatabase {
        return this.database;
    }

    get pool(): Pool {
        return this.connectionPool;
    }

    stats(): IPoolStats {
        return {
            total: this.connectionPool.totalCount,
            idle: this.connectionPool.idleCount,
            waiting: this.connectionPool.waitingCount,
            max: this.connectionPool.options.max ?? 0
        }
    }
}