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
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ],
    },
    externals: [
        {
            argon2: 'commonjs argon2',
            'node-gyp-build': 'commonjs node-gyp-build',
            '@redis/client': 'commonjs @redis/client',
            '@keyv/redis': 'commonjs @keyv/redis',
            redis: 'commonjs redis',
            '@node-rs/xxhash': 'commonjs @node-rs/xxhash',
        },
        function ({ request }, callback) {
            if (/^@node-rs\//.test(request) || /\.node$/.test(request)) {
                return callback(null, `commonjs ${request}`);
            }
            callback();
        },
    ],
    ignoreWarnings: [
        // Ignore missing source map warnings across all node_modules
        /Failed to parse source map/,
        // Silence optional peer dependency check from @redis/client
        /Can't resolve '@opentelemetry\/api'/,
        // Silence platform-specific resolution checks inside @node-rs/xxhash
        {
            module: /@node-rs[\\/]xxhash/,
        },
        {
            module: /@fastify[\\/]view/,
            message: /Critical dependency: the request of a dependency is an expression/,
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
            generatePackageJson: true,
            sourceMap: true,
        }),
    ],
};