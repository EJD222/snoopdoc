import { api } from '@/lib/api/client';
import type { TLoginUserRequest, TLoginUserResponse } from '@snoopdoc/types';
import { getCsrfToken } from './get-csrf-token';

export async function login(data: TLoginUserRequest): Promise<TLoginUserResponse> {
    const response = await api.post('auth/login', data, {
        headers: {
            'X-CSRF-Token': await getCsrfToken(),
        },
    });

    return response.data;
}