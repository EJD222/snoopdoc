import {
    HttpException,
    HttpStatus,
} from '@nestjs/common';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function getErrorStatus(exception: unknown): {
    code: number;
    phrase: string;
} {
    const code =
        exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

    const phrase =
        HttpStatus[code] ?? 'HTTP_ERROR';

    return {
        code,
        phrase,
    };
}

export function getErrorMessage(exception: unknown): string {
    if (!(exception instanceof HttpException)) {
        return 'Internal server error';
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
        return response;
    }

    if (isRecord(response) && typeof response.message === 'string') {
        return response.message;
    }

    return 'Internal server error';
}