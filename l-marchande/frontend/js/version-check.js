// Periodic build-version check.
// Polls /api/version every 5 minutes. When the server-side build_id changes
// (i.e. operator edited public/index.html and the app was redeployed),
// performs a soft reload so the user picks up fresh assets without waiting
// for them to manually refresh.
//
// Notes:
// - First poll is silent: it only stores the current build_id, never reloads.
//   This prevents reload loops on first load, and avoids reloading users who
//   were already on the new build.
// - Network failures are swallowed (no console noise, no retry storm).
// - Page Visibility API: skip polls while tab is hidden.
(function () {
  'use strict';

  var POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  var ENDPOINT = '/api/version';
  var stored = null;
  var inFlight = false;

  function check() {
    if (inFlight) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    inFlight = true;
    fetch(ENDPOINT, { credentials: 'omit', cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.build_id) return;
        var id = String(data.build_id);
        if (stored === null) {
          stored = id;
          return;
        }
        if (id !== stored) {
          try { console.log('[version-check] new build', id, '(was', stored + '), reloading'); } catch (_) {}
          // Soft reload — browser revalidates index.html (it has no-store)
          // and picks up new ?v= for static assets.
          location.reload();
        }
      })
      .catch(function () { /* network error — ignore */ })
      .finally(function () { inFlight = false; });
  }

  // Initial check on load
  check();
  // Periodic poll
  setInterval(check, POLL_INTERVAL_MS);
  // Re-check when tab becomes visible after being hidden for a while
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) check();
    });
  }
})();
