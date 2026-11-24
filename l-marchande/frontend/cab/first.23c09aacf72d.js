(function () {
  var d = document, w = window, up = false, told = 0;
  var t = null;
  try { t = localStorage.getItem('pr-theme'); } catch (e) {  }
  if (t !== 'light' && t !== 'dark') t = w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  d.documentElement.setAttribute('data-theme', t);
  try { var cs = d.createElement('meta'); cs.name = 'color-scheme'; cs.content = t === 'dark' ? 'dark' : 'only light'; d.head.appendChild(cs); } catch (e) {  }
  function tell(kind, what) {
    if (told++ >= 3) return;
    try { fetch('/api/cabinet/oops', { method: 'POST', keepalive: true, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: kind, what: String(what || '').slice(0, 400), page: location.pathname, build: d.documentElement.getAttribute('data-build') || '' }) }); } catch (e) {  }
  }
  function old(seconds) { try { d.cookie = 'cab=auto; path=/; max-age=' + seconds + '; samesite=lax'; } catch (e) {  } location.replace(location.href); }
  var able = !!(w.fetch && w.Promise && w.URLSearchParams && w.CSS && CSS.supports && CSS.supports('inset', '0') && CSS.supports('padding-inline', '0'));
  if (!able) { tell('browser', navigator.userAgent); old(2592000); return; }
  function failed(kind, what) {
    if (up) { tell('after', what); return; }
    if (failed.done) return; failed.done = true;
    tell(kind, what);
    var n = 0; try { n = Number(sessionStorage.getItem('cab-fail')) || 0; sessionStorage.setItem('cab-fail', String(n + 1)); } catch (e) { n = 1; }
    if (kind === 'load' && n < 1) { location.reload(); return; }
    old(1800);
  }
  w.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el !== w && el.tagName) { if ((el.tagName === 'SCRIPT' && /\/cab\//.test(el.src || '')) || (el.tagName === 'LINK' && /\/cab\//.test(el.href || ''))) failed('load', el.src || el.href); return; }
    failed('error', (e.message || 'error') + ' @ ' + String(e.filename || '').split('/').pop() + ':' + (e.lineno || 0));
  }, true);
  w.addEventListener('unhandledrejection', function (e) { var r = e.reason; failed('error', 'promise: ' + (r && (r.stack || r.message) || r)); });
  w.__cabUp = function () { if (up) return; up = true; try { sessionStorage.removeItem('cab-fail'); } catch (e) {  } };
})();
