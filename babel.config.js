// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-dotenv 플러그인
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],

      // react-native-reanimated 플러그인 (항상 마지막에 위치)
      'react-native-reanimated/plugin',
    ],
  };
};
