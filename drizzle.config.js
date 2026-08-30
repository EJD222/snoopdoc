import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: './apps/api/.env' });

export default defineConfig({
    out: './apps/api/drizzle',
    schema: './apps/api/src/database/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_ROOT_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl:
            process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
    },
});
