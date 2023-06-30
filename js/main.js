console.log('main js.');

function getTabInfo() {
  // Get current tab info.
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const {
      url, title, favIconUrl, status: tabStatus,
    } = tabs[0];
    return {
      url, title, favIconUrl, tabStatus,
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
function dataFn() {
  const d = {};
  function get(k) {
    return d[k];
  }
  function set(k, v) {
    d[k] = v;
    return true;
  }
  function assign(d2) {
    Object.assign(d, d2);
  }
  return {
    get,
    set,
    assign,
    d,
  };
}
export { getCookies, getCookiesStr, getTabInfo };
