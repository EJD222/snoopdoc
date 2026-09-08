import { api, requestData } from '@/lib/api/client';
import type { TCurrentUser, TLoginUserRequest } from '@snoopdoc/types';
import { getCsrfToken } from './get-csrf-token';

export function login(data: TLoginUserRequest): Promise<TCurrentUser> {
    return requestData(async () => {
        const csrfToken = await getCsrfToken();

        return api.post('auth/login', data, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        });
    });
}
