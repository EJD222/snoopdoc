import { NestApplicationOptions } from "@nestjs/common";
import { getEnv } from "./env";

export const corsOptions:NestApplicationOptions['cors'] = {
    origin: getEnv<string>('FRONT_END_URL'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    optionsSuccessStatus: 204,
}