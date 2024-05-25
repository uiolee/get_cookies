import { queryPermis, doRequest, checkPermis } from "../lib/permis.js";

// eslint-disable-next-line no-unused-vars
import { bug, objBind, theme, i18n } from "../lib/utils.js";

const data = {};

objBind(data, "permis", () => {});

const requirePermis = ["activeTab", "cookies"];

const query = () => {
  queryPermis().then((p) => {
    p.permissions.forEach((element) => {
      if (requirePermis.includes(element)) {
        document.querySelector(`#permis-${element}`).checked = true;
      } else {
        document.querySelector("#opts_act").innerHTML += `<p><input type="checkbox" role="switch" checked id='${element}'/><label for='${element}'>${element}</label></p>`;
      }
    });

    p.origins.forEach((element) => {
      if (element.includes("<all_urls>")) {
        document.querySelector("#permis-all").checked = true;
      } else {
        document.querySelector("#opts_host").innerHTML += `<p><input type="checkbox" role="switch" checked/><label><code>${element}</code></label></p>`;
      }
      document.querySelectorAll("input").forEach((i) => {
        i.addEventListener("change", (ee) => {
          doRequest(ee);
        });
      });
    });
  });
};
query();
i18n();

checkPermis().then((ans) => {
  if (ans) {
    document.querySelector("#request").disabled = true;
    document.querySelector("#request").classList.add("outline");
    document.querySelector("#request").textContent = browser.i18n.getMessage("permis-fulfil");
  }
});
document.querySelector("#theme").addEventListener("click", theme);
document.querySelector("#request").addEventListener("click", async (e) => {
  doRequest(e).then(() => {
    query();
  });
});
