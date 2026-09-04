import { api } from "@/lib/api/client";

export async function getCsrfToken(): Promise<string> {
    const response = await api.get('auth/csrf-token');
    return response.data.csrfToken;
}