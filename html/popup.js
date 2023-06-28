import { getCookies, getCookiesStr, getTab } from '../js/main.js';

async function queryBtn() {
  document.getElementsByClassName('icon')[0].src = '';
  const url = document.getElementById('url').value;
  document.getElementsByClassName('name')[0].textContent = `${url}`;
  const cookiesStr = getCookiesStr(await getCookies(url));
  if (cookiesStr) {
    document.getElementsByClassName('cookiesStr')[0].textContent = cookiesStr;
    document.getElementById('info').textContent = `length:${cookiesStr.length}`;
  } else {
    document.getElementsByClassName('cookiesStr')[0].textContent = 'empty!';
  }
}
function copy() {
  const cookiesStr = document.getElementsByClassName('cookiesStr')[0].textContent;
  navigator.clipboard.writeText(cookiesStr).then(() => {
    document.getElementById('copy').textContent = 'Copied';
    document.getElementById('copy').classList.add('outline');
  }, () => {
    document.getElementById('copy').textContent = 'COPY';
  });
}
async function init() {
  const { url, title, favIconUrl } = await getTab();

  const cookiesStr = getCookiesStr(await getCookies(url));
  document.getElementsByClassName('url')[0].value = url;
  document.getElementsByClassName('icon')[0].src = favIconUrl;
  document.getElementsByClassName('cookiesStr')[0].textContent = cookiesStr;
  document.getElementsByClassName('name')[0].textContent = title;
  document.getElementById('length').textContent = `length:${cookiesStr.length}`;
  document.getElementById('query').onclick = queryBtn;
  document.getElementById('copy').onclick = copy;
}

await init();
