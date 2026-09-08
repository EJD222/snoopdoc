import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@/features/cache/cache.module';
import { FeaturesModule } from '@/features/features.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        CqrsModule.forRoot(),
        CacheModule,
        FeaturesModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    })
export class AppModule {}
