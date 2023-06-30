function input(message) {
  console.log(message);
  const { cookiesStr } = message;
  if (cookiesStr) {
    document.querySelector('#input-cookie').value = cookiesStr;
  }
}
if (!document.querySelector('#modal_load').getAttribute('style').includes('display: none')) {
  browser.runtime.sendMessage({ url: document.querySelector('[data-site]').getAttribute('data-site') });
  browser.runtime.onMessage.addListener(input);
}
