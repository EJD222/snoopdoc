const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
    output: {
        path: join(__dirname, 'dist'),
        clean: true,
        ...(process.env.NODE_ENV !== 'production' && {
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        }),
    },
    resolve: {
        alias: {
            'class-transformer/storage': require.resolve(
                'class-transformer/cjs/storage',
            ),
            '@': join(__dirname, 'src'),
        },
    },
    ignoreWarnings: [
        {
            module: /@fastify[\\/]view/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules[\\/]\.pnpm[\\/]ret@/,
            message: /Failed to parse source map/,
        },
    ],
    plugins: [
        new NxAppWebpackPlugin({
            target: 'node',
            compiler: 'tsc',
            main: './src/main.ts',
            tsConfig: './tsconfig.app.json',
            assets: ['./src/assets'],
            optimization: false,
            outputHashing: 'none',
            generatePackageJson: false,
            sourceMap: true,
        }),
    ],
};