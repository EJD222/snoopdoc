import { COOKIE_NAME, cookieOptions } from "./cookie";
import { getEnv } from "./env";

export const sessionOptions = {
    secret: getEnv<string>('SESSION_SECRET') as string,
    salt: getEnv<string>('SESSION_SALT') as string,
    cookieName: COOKIE_NAME,
    cookie: cookieOptions,
    expiry: 24 * 60 * 60,
};