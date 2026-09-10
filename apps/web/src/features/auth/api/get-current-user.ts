import { api, requestData } from "@/lib/api/client";
import { TUserId } from "@snoopdoc/types";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<{ userId: TUserId }> {
    return requestData(async () => {
        const cookieStore = await cookies();

        return api.get('auth/me', {
            headers: {
                'Cookie': cookieStore.toString(),
            },
            cache: 'no-store',
        });
    });
}