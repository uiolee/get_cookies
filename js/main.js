console.log('main js.');

async function getTab() {
  // Get current tab info.
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const { url, title, favIconUrl } = tabs[0];
    return { url, title, favIconUrl };
  });
}

function getCookies(url) {
  if (typeof url !== 'string') {
    throw new RangeError('empty url');
  }
  return browser.cookies.getAll({ url }).then(((cookiesArray) => cookiesArray));
}

function getCookiesStr(cookiesArray) {
  let cookiesStr = '';
  cookiesArray.forEach((element) => {
    cookiesStr += `${element.name}=${element.value};`;
  });
  return cookiesStr;
}

export { getCookies, getCookiesStr, getTab };
