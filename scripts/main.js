function getTabInfo() {
  // Get current tab info.
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const {
      url, title, favIconUrl, status: tabStatus, id,
    } = tabs[0];
    return {
      url, title, favIconUrl, tabStatus, id,
    };
  });
}

function getCookies(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('empty url');
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

export { getCookies, getCookiesStr, getTabInfo };
