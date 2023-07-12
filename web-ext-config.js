module.exports = {
  artifactsDir: './.web-ext',
  ignoreFiles: ['package-lock.json', 'package.json', 'web-ext-config.js', '.web-ext-config.js', 'yarn.lock'],
  build: {
    overwriteDest: true,
  },
  run: {
    devtools: false,
  },
  sign: {
    channel: 'unlisted',
  },
};
