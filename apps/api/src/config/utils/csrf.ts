import { FastifyCsrfProtectionOptions } from "@fastify/csrf-protection";

export const csrfOptions: FastifyCsrfProtectionOptions = {
    sessionPlugin: '@fastify/secure-session',
    sessionKey: '_csrf',
    getToken: (req) => {
        const token = req.headers['x-csrf-token'];

        return typeof token === 'string' ? token : undefined;
    },
};