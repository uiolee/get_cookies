import { getCookies, getCookiesStr, getTabInfo } from '../lib/main.js';

function copy() {
  const cookiesStr = document.querySelector('#cookiesStr').value;
  navigator.clipboard.writeText(cookiesStr).then(() => {
    document.getElementById('copy').textContent = 'Copied';
    document.getElementById('copy').classList.add('outline');
  }, () => {
    document.getElementById('copy').textContent = 'COPY';
  });
}
function i18n() {
  const element = document.querySelectorAll('.i18n');
  element.forEach((el) => {
    const e = el;
    const value = browser.i18n.getMessage(e.id);
    if (!value) {
      return;
    }
    if (['input', 'textarea'].includes(e.tagName.toLowerCase())) {
      e.placeholder = value;
    } else {
      e.textContent = value;
    }
  });
}
function len(e) {
  const { id } = e.target;
  const text = document.querySelector(`#${id}`).value;
  const ans = document.querySelector(`[for='${id}']`);
  ans.textContent = text.length;
}
function open(e) {
  const { id } = e.target;
  const d = { newtab: '/html/popup.html', settings: '/html/options.html' };
  const url = d[id];
  browser.tabs.create({
    url,
  });
  window.close();
}
function theme() {
  const pt = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let ut = document.querySelector('html').getAttribute('data-theme');
  ut = !ut ? pt : ut;
  ut = ut === 'dark' ? 'light' : 'dark';
  document.querySelector('html').setAttribute('data-theme', ut);
}
function loading(selector, bool) {
  if (bool) {
    document.querySelector(selector).setAttribute('aria-busy', true);
  } else {
    document.querySelector(selector).removeAttribute('aria-busy');
  }
}
const toggle = () => {
  document.querySelector('#toggle').textContent = document.querySelector('#toggle').textContent === 'UA' ? 'Cookies' : 'UA';
  document.querySelector('#ua').textContent = window.navigator.userAgent;
  let [a, b] = document.querySelectorAll('article');
  [a, b] = a.classList.contains('hidden') ? [a, b] : [b, a];
  a.classList.remove('hidden');
  b.classList.add('hidden');
};
async function query(e) {
  loading('#copy', true);
  let { url, title, favIconUrl } = e;
  if (!title) {
    url = document.querySelector('#url').value;
    title = `${url}`;
    favIconUrl = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgb(65, 84, 98)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E';
  }
  document.querySelector('#url').value = url;
  document.querySelector('#name').textContent = title;
  document.querySelector('#icon').src = favIconUrl;
  if (!url) {
    return;
  }
  const cookiesStr = getCookiesStr(await getCookies(url));
  if (cookiesStr) {
    document.querySelector('#cookiesStr').value = cookiesStr;
  } else {
    document.querySelector('#cookiesStr').value = '';
  }
  len({ target: { id: 'cookiesStr' } });
  loading('#copy', false);
}

async function init() {
  const {
    url, title, favIconUrl, tabStatus,
  } = await getTabInfo();
  if (!url.toLowerCase().startsWith('h') || tabStatus !== 'loading') {
    loading('#name', false);
  }

  document.querySelector('#newtab').onclick = open;
  // document.querySelector('#settings').onclick = open;
  document.querySelector('#toggle').onclick = toggle;
  document.querySelector('#theme').onclick = theme;
  query({ url, title, favIconUrl });
  document.querySelector('#url').onchange = query;
  document.querySelector('#url').addEventListener('input', query);
  document.querySelector('#cookiesStr').onchange = len;
  document.querySelector('#cookiesStr').addEventListener('input', len);
  document.querySelector('#copy').onclick = copy;
}
const data = {};
i18n();
init();
console.log(data);
