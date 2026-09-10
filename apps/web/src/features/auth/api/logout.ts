import { api, requestData } from '@/lib/api/client';
import { getCsrfToken } from './get-csrf-token';

type LogoutResponse = {
    message: string;
};

export function logout(): Promise<LogoutResponse> {
    return requestData(async () => {
        const csrfToken = await getCsrfToken();

        return api.post('auth/logout', {}, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        });
    });
}
