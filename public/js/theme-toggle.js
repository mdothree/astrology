/* theme-toggle.js — the theme section of the MDOThree shared template's site-chrome.js (copied, not re-derived).
 * Load: <script src="/js/theme-toggle.js" defer></script>  (after theme-init.js ran in <head>).
 * Wires every [data-mdo-theme] button: flips html[data-theme], saves the choice (localStorage "mdo-theme",
 * try/catch), keeps aria-label/title/aria-pressed current, and follows the OS live until a choice is saved.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'mdo-theme';

  // ── Theme ────────────────────────────────────────────────────────────────
  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function label(btn) {
    var next = current() === 'dark' ? 'light' : 'dark';
    var text = 'Switch to ' + next + ' theme';
    btn.setAttribute('aria-label', text);
    btn.setAttribute('title', text);
    btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
  }
  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      root.removeAttribute('data-theme-source');
      try { window.localStorage.setItem(KEY, theme); } catch (e) { /* storage blocked: choice lasts this page */ }
    }
    var btns = document.querySelectorAll('[data-mdo-theme]');
    for (var i = 0; i < btns.length; i++) label(btns[i]);
    try { document.dispatchEvent(new CustomEvent('mdo-theme-change', { detail: { theme: theme } })); } catch (e) {}
  }
  var toggles = document.querySelectorAll('[data-mdo-theme]');
  for (var t = 0; t < toggles.length; t++) {
    label(toggles[t]);
    toggles[t].addEventListener('click', function () { apply(current() === 'dark' ? 'light' : 'dark', true); });
  }
  // No saved choice yet: keep following the OS setting live.
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onOs = function (e) { if (root.getAttribute('data-theme-source') === 'os') apply(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onOs); else if (mq.addListener) mq.addListener(onOs);
  } catch (e) {}
})();
