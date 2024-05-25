// a tool run on node, to generate i18n message json file.

/* eslint-disable no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';

import * as cheerio from 'cheerio';

const htmlPath = ['html/options.html', 'html/popup.html'];
const localeDirPath = '_locales';
const defaultLocale = 'en';
const locales = [defaultLocale, 'zh', 'ja'];
const localesPath = locales.map((loc) => path.join(localeDirPath, loc, 'messages.json'));

const mDir = (locales) => {
  locales.forEach((d) => {
    mkdirSync(path.join(localeDirPath, d), { recursive: true });
  });
};
// eslint-disable-next-line consistent-return
const jsonFs = (pat, obj) => {
  if (pat && obj) {
    writeFileSync(pat, JSON.stringify(obj, null, 2));
  } else if (pat && !obj) {
    try {
      return JSON.parse(readFileSync(pat));
    } catch {
      return {};
    }
  }
};

const readSource = (pathArray) => {
  const localeRaw = {};

  pathArray.forEach((pat) => {
    const $ = cheerio.load(readFileSync(pat));

    const ls = $('*[data-i18n]');

    ls.each((index, el) => {
      const id = $(el).attr('data-i18n');
      const value = $(el).text().trim();
      localeRaw[id] = { message: value };
    });
  });
  console.debug(localeRaw);
  return localeRaw;
};

const writeLocle = (localeRaw, lPath) => {
  const lf = jsonFs(lPath);
  const localeNew = { ...localeRaw, ...lf };
  jsonFs(lPath, localeNew);
};

const merge = (localesPath) => {
  const localeDefault = jsonFs(localesPath[0]);

  localesPath.forEach((el) => {
    if (el !== localesPath[0]) {
      writeLocle(localeDefault, el);
    }
  });
};

mDir(locales);
const localeRaw = readSource(htmlPath);

localesPath.forEach((lpath) => {
  writeLocle({ ...localeRaw }, lpath);
});

merge(localesPath);
