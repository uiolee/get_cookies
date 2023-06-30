import { getCookies, getCookiesStr, getTabInfo } from '../scripts/main.js';

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
  loading('#input', true);
  let { url } = e;
  if (!url) {
    url = document.querySelector('#url').value;
  }
  if (!url) {
    return;
  }
  document.querySelector('#url').value = url;
  const cookiesStr = getCookiesStr(await getCookies(url));
  if (cookiesStr) {
    document.querySelector('#cookiesStr').value = cookiesStr;
  } else {
    document.querySelector('#cookiesStr').value = '';
  }
  len({ target: { id: 'cookiesStr' } });
  loading('#input', false);
  document.querySelector('#input').classList.remove('outline');
}
function receive(m) { console.log('receive, ', m.url); query(m); }
function execute() {
  browser.tabs.executeScript({
    file: '/scripts/content.js',
  });
  browser.runtime.onMessage.addListener(receive);
}
function input() {
  const id = Number(document.querySelector('#input').getAttribute('for'));
  const cookiesStr = document.querySelector('#cookiesStr').value;
  const site = document.querySelector('#url').value;
  browser.tabs.sendMessage(id, { site, cookiesStr });
  document.querySelector('#input').classList.add('outline');
}
async function init() {
  // document.querySelector('#newtab').onclick = open;
  // document.querySelector('#settings').onclick = open;
  document.querySelector('#toggle').onclick = toggle;
  document.querySelector('#theme').onclick = theme;

  const {
    url, title, favIconUrl, tabStatus, id,
  } = await getTabInfo();
  document.querySelector('#name').textContent = title;
  document.querySelector('#icon').src = favIconUrl;
  document.querySelector('#input').setAttribute('for', id);
  if (tabStatus !== 'loading') {
    loading('#name', false);
  }
  execute();

  document.querySelector('#url').onchange = query;
  document.querySelector('#url').addEventListener('input', query);
  document.querySelector('#cookiesStr').onchange = len;
  document.querySelector('#cookiesStr').addEventListener('input', len);
  document.querySelector('#retry').onclick = execute;
  document.querySelector('#input').onclick = input;
  loading('#input', false);
}
i18n();
init();
