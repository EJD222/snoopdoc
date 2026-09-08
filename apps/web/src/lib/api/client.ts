import xior from 'xior';
import { normalizeApiError } from './api-error';

export const api = xior.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

type ApiResponse<T> = {
    data: T
};

type ApiRequest<T> = () => Promise<ApiResponse<T>>;

export async function requestData<T>(request: ApiRequest<T>): Promise<T> {
    try {
        const response = await request();
        return response.data;
    } catch (error: unknown) {
        throw normalizeApiError(error);

        
    }
}
