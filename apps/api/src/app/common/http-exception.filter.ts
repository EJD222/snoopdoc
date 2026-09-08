import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { getErrorMessage, getErrorStatus } from './error';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const { code, phrase } = getErrorStatus(exception);
        const message = getErrorMessage(exception);

        const responseBody = {
            error: {
                message,
                code: phrase,
            },
        };

        if (code >= 500) {
            this.logger.error(exception);
        } else {
            this.logger.debug(message);
        }

        httpAdapter.reply(
            ctx.getResponse(),
            responseBody,
            code,
        );
    }
}