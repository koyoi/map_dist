module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimatedを使用している場合はこの行が必要なのだ
      'react-native-reanimated/plugin'
    ],
  };
};