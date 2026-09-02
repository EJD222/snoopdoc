import { getEnv } from './env';
import type { CookieSerializeOptions } from '@fastify/cookie';

const isProduction = getEnv<string>('NODE_ENV') === 'production';

export const COOKIE_NAME = 'snoopdoc-session';

const sameSite: CookieSerializeOptions['sameSite'] =
    isProduction ? 'none' : 'lax';

export const cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: '/',
    maxAge: 24 * 60 * 60,
    ...(isProduction ? { domain: '.snoopdoc.com' } : {}),
};