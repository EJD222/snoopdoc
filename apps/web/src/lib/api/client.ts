import xior from 'xior';

export const api = xior.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});