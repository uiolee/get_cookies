
export default {
  sourceDir: "./dist",
  artifactsDir: "./.web-ext",
  ignoreFiles: ["package-lock.json", "package.json", ".web-ext-config.mjs","yarn.lock"],
  build: {
    overwriteDest: true,
  },
  run: {
    devtools: false,
  },
  sign: {
    channel: "listed",
    amoMetadata: "amo-metadata.json",
  },
};
