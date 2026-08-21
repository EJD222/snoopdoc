import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig(() => ({
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/api',
    resolve: {
        alias: {
            '@api': path.resolve(import.meta.dirname, 'src'),
        },
    },
    test: {
            name: '@snoopdoc/api',
            watch: false,
            globals: true,
            environment: 'node',
            include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            reporters: ['default'],
            coverage: {
            reportsDirectory: './test-output/vitest/coverage',
            provider: 'v8' as const,
        },
    },
}));
