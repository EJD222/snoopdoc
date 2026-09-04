import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';
import { createSwagger } from './utils/swagger';
import secureSession from '@fastify/secure-session';
import { sessionOptions } from './config/utils/session';
import { csrfOptions } from './config/utils/csrf';
import fastifyCsrf from '@fastify/csrf-protection';
import { corsOptions } from './config/utils/cors';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            routerOptions: {
                querystringParser: (str) => qs.parse(str),
                ignoreTrailingSlash: true,
            }
        }),
        {
            cors: corsOptions,
        }
    );

    await app.register(secureSession, sessionOptions);
    await app.register(fastifyCsrf, csrfOptions);   
    
    const globalPrefix = 'api';

    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3001;
  	
    createSwagger({
        app,
        description: "Snoopdoc API",
        path: "api/docs"

    })
    await app.listen(port, '0.0.0.0');

    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );

    app.enableShutdownHooks();
}

bootstrap();
