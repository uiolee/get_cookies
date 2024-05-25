export function objBind(obj, key, setFn) {
  Object.defineProperty(obj, key, {
    get: () => obj,
    set: setFn,
  });
}

export const getMsg = browser.i18n.getMessage;

export function i18n() {
  const element = document.querySelectorAll("[data-i18n]");
  element.forEach((el) => {
    const e = el;
    const id = e.dataset.i18n;
    const value = browser.i18n.getMessage(id);
    if (!value) {
      return;
    }
    if (["input", "textarea"].includes(e.tagName.toLowerCase())) {
      e.placeholder = value;
    } else {
      e.textContent = value;
    }
  });
}

export const bug = (v) => {
  console.debug(v);
};

export const theme = () => {
  const pt = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let ut = document.querySelector("html").getAttribute("data-theme");
  ut = !ut ? pt : ut;
  ut = ut === "dark" ? "light" : "dark";
  document.querySelector("html").setAttribute("data-theme", ut);
};
export const loading = (selector, bool) => {
  if (bool) {
    document.querySelector(selector).setAttribute("aria-busy", true);
  } else {
    document.querySelector(selector).removeAttribute("aria-busy");
  }
};
