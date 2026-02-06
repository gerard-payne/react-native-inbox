const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');

const config = {
    projectRoot: path.resolve('.'),
    watchFolders: [
        path.resolve('..'),
        path.resolve('../node_modules')
    ],
    resolver: {
        unstable_enableSymlinks: true,
        nodeModules: [
            path.resolve('./node_modules'),
            path.resolve('../node_modules')
        ]
    },
    server: {
        port: 8081
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
