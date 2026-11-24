// Apply theme instantly to prevent flash of wrong theme on initial render.
// MUST be loaded synchronously (without defer) BEFORE any CSS so the
// data-theme attribute is set before the page paints.
// Also sets window.__APP_VER__ used by other scripts for asset versioning.
// The admin console (/admin, /admin-*, /admin/login) keeps its own preference,
// cx-theme, light by default; the site keeps pr-theme (system preference, else dark).
// theme.js reads the same keys — keep the two in step.
(function () {
  var admin = /^\/admin(\/|-|$)/.test(location.pathname);
  var t = null;
  try { t = localStorage.getItem(admin ? 'cx-theme' : 'pr-theme'); } catch (e) { /* storage blocked */ }
  if (t !== 'light' && t !== 'dark') {
    if (admin) t = 'light';
    else t = (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches) ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
window.__APP_VER__ = '1792627200'; // 19.10.2026: the Russian Premium texts speak «вы» (premium-data/*.js load with it); before: Premium's phase 4
