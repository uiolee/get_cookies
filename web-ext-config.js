module.exports = {
  build: {
    overwriteDest: true,
  },
  ignoreFiles: [
    'package-lock.json',
    'yarn.lock',
    'web-ext-config.js',
  ],
  run: {
    devtools: true,
  },
};
