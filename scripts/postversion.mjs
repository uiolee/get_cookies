import { writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

import { $ } from "execa";

import pkj from "../package.json" with { type: "json" };
import manifest from "../src/manifest.json" with { type: "json" };
const __dirname = dirname(import.meta.filename);

const _ = async (arg) => {
  return $({
    stdout: ["pipe", "inherit"],
    stderr: ["pipe", "inherit"],
  })`${arg}`;
};

await _(`git log -n 1`)
  .then(({ stdout }) => {
    if (stdout.search("release: ") > 1) {
      const commit = /commit.+?$/m.exec(stdout);
      const message = /release:.+?$/m.exec(stdout);
      console.log(commit[0]);
      console.log(message[0]);
    } else {
      const msg = `this script must run after a release commit`;
      throw Error(msg);
    }
  })
  .catch((err) => {
    console.error(err);
    return process.exit(1);
  });

const { version } = pkj;
const tagName = `v${version}`;
const message = `release: ${version}`;
const target = resolve(__dirname, "../src/manifest.json");

console.info(
  `bump manifest.version from '${manifest.version}' to '${version}'`,
);

manifest.version = String(version);

await writeFile(target, JSON.stringify(manifest))
  .then(() => {
    return _(`prettier -w ${target}`);
  })
  .then(() => {
    return _(`git add ${target}`);
  })
  .then(() => {
    return _(`git commit --amend --no-edit`);
  })
  .then(() => {
    return _(`git tag ${tagName} -f -m "${message}"`);
  })
  .finally(() => {
    console.info(`${basename(import.meta.filename)} done`);
  });
