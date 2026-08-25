import { ConfigService } from '@nestjs/config';
import { type } from 'arktype';
import { __values } from 'tslib';

export const EnvSchema = type({
    NODE_ENV: "'development' | 'production' | 'test'",
    PORT: type('string | number').pipe((v) => +v, type.number),
    DB_HOST: 'string',
    DB_PORT: type('string | number').pipe((v) => +v, type.number),
    DB_NAME: 'string',
    DB_USER: 'string',
    DB_PASSWORD: 'string',
    MIGRATION_LOCK_KEY: type('string').narrow((value, ctx) => {
        if (Buffer.byteLength(value) < 8) {
            ctx.reject({ message: 'MIGRATION_LOCK_KEY must be at least 8 bytes.' });
        }
        return true;
    }),
    DB_ROOT_USER: 'string'
} as const);
export const TEnvKeys = EnvSchema.keyof();

export const validateEnv = (config: Record<string, unknown>) => {
    const result = EnvSchema(config);

    if (result instanceof type.errors) {
        throw new Error(
            `Invalid environmental variables:\n${result.summary}.`,
        );
    }

    return result;
};

export function getEnv<T>(
    key: string,
    config?: ConfigService | undefined,
): T {
    const value = config?.get<T>(key) ?? process.env[key];

    if (value === undefined || value === null || value === '') {
        throw new Error(
            `Environment variable ${key} is empty or not set.`,
        );
    }

    return value as T;
}