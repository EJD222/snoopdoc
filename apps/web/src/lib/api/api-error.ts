type ApiErrorResponse = {
    error: {
        message: string;
        code: string;
    };
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
        public readonly code?: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export function normalizeApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    const response =
        isRecord(error) && isRecord(error.response)
            ? error.response
            : undefined;

    const body =
        response && isRecord(response.data)
            ? (response.data as ApiErrorResponse)
            : undefined;

    const message =
        body?.error?.message ??
        'Something went wrong. Please try again.';

    const code = body?.error?.code;

    const status =
        response && typeof response.status === 'number'
            ? response.status
            : undefined;
    
    return new ApiError(
        message,
        status,
        code,
        body,
    );
}