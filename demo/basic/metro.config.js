const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { resolver: { sourceExts, assetExts } } = defaultConfig;

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})(); 