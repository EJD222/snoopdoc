import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEnv } from '@/config/utils/env';
import path from 'node:path';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/database/schema';
import { buildPoolConfig } from '../utils/pool';

@Injectable()
export class MigrationsService implements OnModuleInit {
    private readonly logger = new Logger(MigrationsService.name);

    constructor(private readonly config: ConfigService) {}

    async onModuleInit(): Promise<void> {
        await this.runMigrations();
    }

    private async runMigrations(): Promise<void> {

        const MIGRATION_LOCK_KEY = getEnv<string>('MIGRATION_LOCK_KEY');
        console.log('__dirname:', __dirname);

        const migrationsFolder = path.join(__dirname, '../drizzle');
        this.logger.log(`Migrations folder:' ${migrationsFolder}`);

        this.logger.debug({
            env_root_user: getEnv('DB_ROOT_USER'),
            env_db_user: getEnv('DB_USER'),
            process_env_user: process.env.DB_ROOT_USER,
        });

        const pool = new Pool(
            buildPoolConfig(this.config, { 
                user: getEnv('DB_ROOT_USER') 
            })
        );

        const lockClient = await pool.connect();
        try {
            this.logger.log('Acquiring migration advisory lock...');
            await lockClient.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);

            const database = drizzle(pool, {
                casing: 'snake_case',
                schema,
            })

            await migrate(database, { migrationsFolder });
            this.logger.log(`Successfully migrated the database.`);

        } catch (error) {
            this.logger.error(`Failed to migrate the database:`, error);
            throw error;
        } finally {
            await lockClient.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
            lockClient.release();
            await pool.end();
        }
    } 
}
