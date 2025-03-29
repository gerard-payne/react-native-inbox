const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [
         '..',
     ],
 
     resolver: {
        unstable_enableSymlinks: true,
        sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json']
     }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
