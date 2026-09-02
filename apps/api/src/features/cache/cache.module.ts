import { Global, Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { getEnv } from '@/config/utils/env';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                stores: [
                    createKeyv(
                        getEnv<string>('REDIS_URL', config),
                    ),
                ],
            }),
        }),
    ],
    controllers: [CacheController],
    providers: [CacheService],
    exports: [CacheService]
})
export class CacheModule {}
