import { ConfigService } from '@nestjs/config';
import { type } from 'arktype';

export const EnvSchema = type({
    NODE_ENV: "'development' | 'production' | 'test'",
    PORT: type('string | number').pipe((v) => +v, type.number),
    // DATABASE_URL: 'string',
    // REDIS_URL: 'string',
    // AI_MODEL: 'string',
} as const);
export const TEnvKeys = EnvSchema.keyof();

export const validateEnv = (config: Record<string, unknown>) => {
    const result = EnvSchema(config);

    if (result instanceof type.errors) {
        throw new Error(
            `Invalid environmental variables:\n${result.summary}`,
        );
    }

    return result;
};

export function getEnv<T>(
    config: ConfigService,
    key: string,
): T {
    const value = config.get<T>(key);

    if (value === undefined || value === null || value === '') {
        throw new Error(
            `Environment variable ${key} is empty or not set`,
        );
    }

    return value;
}