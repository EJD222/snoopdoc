import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv
        }),
    ],
    exports: [
        NestConfigModule
    ]
})
export class ConfigModule {}