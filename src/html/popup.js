import { getCookies, getCookiesStr, getTabInfo } from "../lib/main.js";
import { i18n, bug, loading, theme, objBind, getMsg } from "../lib/utils.js";
import { checkPermis, doRequest } from "../lib/permis.js";

const data = {};

objBind(data, "busy", (value) => {
  loading("#name", value);
});

function copy() {
  const cookiesStr = document.querySelector("#cookiesStr").value;
  navigator.clipboard.writeText(cookiesStr).then(
    () => {
      document.getElementById("copy").textContent = getMsg("copy-ed");
      document.getElementById("copy").classList.add("outline");
    },
    () => {
      document.getElementById("copy").textContent = getMsg("copy-fail");
    },
  );
}

function len(e) {
  const { id } = e.target;
  const text = document.querySelector(`#${id}`).value;
  const ans = document.querySelector(`[for='${id}']`);
  ans.textContent = text.length;
}
function open(e) {
  const { id } = e.target;
  const d = { newtab: "/html/popup.html", options: "/html/options.html" };
  const url = d[id];
  browser.tabs.create({
    url,
  });
  window.close();
}

const toggle = () => {
  document.querySelector("#toggle").textContent = document.querySelector("#toggle").textContent === "UA" ? "Cookies" : "UA";
  document.querySelector("#ua").textContent = window.navigator.userAgent;
  let [a, b] = document.querySelectorAll("article");
  [a, b] = a.classList.contains("hidden") ? [a, b] : [b, a];
  a.classList.remove("hidden");
  b.classList.add("hidden");
};
async function query(e) {
  loading("#copy", true);
  let { url, title, favIconUrl } = e;
  if (!title) {
    url = document.querySelector("#url").value;
    title = `${url}`;
    favIconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgb(65, 84, 98)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E";
  }
  document.querySelector("#url").value = url;
  document.querySelector("#name").textContent = title;
  document.querySelector("#icon").src = favIconUrl;
  if (!url) {
    loading("#copy", false);
    return;
  }
  const cookiesStr = getCookiesStr(await getCookies(url));
  if (cookiesStr) {
    document.querySelector("#cookiesStr").value = cookiesStr;
  } else {
    document.querySelector("#cookiesStr").value = "";
  }
  len({ target: { id: "cookiesStr" } });
  loading("#copy", false);
}

async function init() {
  const { url, title, favIconUrl, tabStatus } = await getTabInfo();
  if (!url.toLowerCase().startsWith("h") || tabStatus !== "loading") {
    data.busy = false;
  }

  query({ url, title, favIconUrl });
  document.querySelector("#url").addEventListener("change", query);
  document.querySelector("#url").addEventListener("input", query);
  document.querySelector("#cookiesStr").addEventListener("change", len);
  document.querySelector("#cookiesStr").addEventListener("input", len);
  document.querySelector("#copy").addEventListener("click", copy);
  document.querySelector("#copy").classList.remove("secondary");
}
i18n();
document.querySelector("#newtab").addEventListener("click", open);
document.querySelector("#options").addEventListener("click", open);

document.querySelector("#toggle").addEventListener("click", toggle);
document.querySelector("#theme").addEventListener("click", theme);
if (await checkPermis()) {
  init();
} else {
  bug("No Permissions");
  const request = document.querySelector("#request");
  request.addEventListener("click", async (e) => {
    await doRequest(e);
    window.close();
  });
  request.parentNode.classList.remove("hidden");
}
