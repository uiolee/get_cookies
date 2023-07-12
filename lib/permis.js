export const requirePermis = { origins: ['<all_urls>'], permissions: ['activeTab', 'cookies'] };

export const requestMap = {
  'permis-all': { origins: ['<all_urls>'] },
  'permis-cookies': { permissions: ['cookies'] },
  'permis-activeTab': { permissions: ['activeTab'] },
  request: { origins: ['<all_urls>'], permissions: ['activeTab', 'cookies'] },
};

export const queryPermis = async (x) => {
  if (x) {
    return browser.permissions.contains(x);
  }
  return browser.permissions.getAll();
};

export const checkPermis = () => queryPermis(requirePermis);

export const doRequest = async (e) => {
  const { id } = e.target;
  let permissions = requestMap[id];
  if (typeof permissions === 'undefined') {
    permissions = { origins: [e.target.labels[0].textContent] };
  }
  e.target.parentElement.setAttribute('aria-busy', true);
  e.target.disabled = true;
  if (e.target.checked || id === 'request') {
    await browser.permissions.request(permissions).then((res) => {
      if (res) {
        e.target.checked = true;
      } else {
        e.target.checked = false;
      }
      e.target.parentElement.setAttribute('aria-busy', false);
      e.target.disabled = false;
      return true;
    });
  } else {
    await browser.permissions.remove(permissions).then((res) => {
      if (res) {
        e.target.checked = false;
      } else {
        e.target.checked = true;
      }
      e.target.parentElement.setAttribute('aria-busy', false);
      e.target.disabled = false;
    });
  }
};
