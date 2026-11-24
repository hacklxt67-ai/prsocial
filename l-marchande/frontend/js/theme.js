// Theme toggle: dark (default) / light.
// The admin console (/admin, /admin-*, /admin/login) keeps its own preference, cx-theme,
// light by default: switching it never touches the site's theme, and a dark site never
// darkens the console. theme-init.js applies the same keys before the first paint.
(function() {
  const STORAGE_KEY = 'pr-theme';
  const ADMIN_KEY = 'cx-theme';
  const isAdmin = () => /^\/admin(\/|-|$)/.test(location.pathname);

  function getPreferred() {
    let saved = null;
    try { saved = localStorage.getItem(isAdmin() ? ADMIN_KEY : STORAGE_KEY); } catch (e) { /* storage blocked */ }
    if (saved === 'light' || saved === 'dark') return saved;
    if (isAdmin()) return 'light';
    // System preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(isAdmin() ? ADMIN_KEY : STORAGE_KEY, theme); } catch (e) { /* storage blocked */ }
    // Update toggle icons if present
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    });
  }

  // Apply on load (before paint)
  apply(getPreferred());

  // After SPA navigation: the theme follows the route (site <-> console), then the new
  // toggle buttons get their icons.
  let lastAdmin = isAdmin();
  const observer = new MutationObserver(() => {
    if (isAdmin() !== lastAdmin) { lastAdmin = isAdmin(); apply(getPreferred()); }
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      if (!btn.dataset.themed) {
        btn.dataset.themed = '1';
        btn.innerHTML = theme === 'dark'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
      }
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });

  // Global toggle function
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    apply(current === 'dark' ? 'light' : 'dark');
  };

  // Re-read the preference for the current route. The admin shell calls it when the
  // console is entered or left inside the SPA, so each side keeps its own theme.
  window.applyPreferredTheme = function() {
    apply(getPreferred());
  };
})();
