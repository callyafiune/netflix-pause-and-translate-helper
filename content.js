// content.js
(() => {
  const el = document.createElement('script');
  el.src = chrome.runtime.getURL('page.js');
  el.async = false;
  (document.head || document.documentElement).appendChild(el);
  el.onload = () => el.remove();
})();
