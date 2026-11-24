// User mode toggle. localStorage 'userMode' = 'worker' (default) | 'advertiser'.
// Pure UI preference — no DB column, no auth changes. Worker view shows the
// Earn section (Tasks / My Tasks / Leaderboard / etc); advertiser view shows
// Order section (New Order / My Orders). Wallet/Profile/Help in both.

// One-time: close language popup when clicking outside (sidebar.js may render
// many times, but listener is bound only once via the window flag).
if (typeof document !== 'undefined' && !window._sbLangOutsideBound) {
  window._sbLangOutsideBound = true;
  document.addEventListener('click', function(e) {
    const popup = document.getElementById('sbLangPopup');
    if (!popup || !popup.classList.contains('open')) return;
    if (!e.target.closest('.sb-lang-trigger') && !e.target.closest('.sb-lang-popup')) {
      popup.classList.remove('open');
    }
  });
}

function getUserMode() {
  try {
    const v = localStorage.getItem('userMode');
    return v === 'advertiser' ? 'advertiser' : 'worker';
  } catch { return 'worker'; }
}

window.switchUserMode = function(target) {
  try { localStorage.setItem('userMode', target === 'advertiser' ? 'advertiser' : 'worker'); } catch {}
  // Land the user on a page that exists in the new mode.
  const fallbackByMode = { worker: '/tasks', advertiser: '/create-order' };
  Router.navigate(fallbackByMode[target] || '/dashboard');
};

function renderSidebar(activeRoute) {
  const u = API.user || {};
  const initial = (u.username || 'U')[0].toUpperCase();
  const userMode = getUserMode();

  // Schedule async premium chip update after DOM mount (Phase 1.4)
  setTimeout(() => initPremiumSidebarChip(), 0);

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <h1>PR<span style="color:var(--accent)">.</span>SOCIAL</h1>
    </div>

    <div class="sidebar-lang" style="gap:6px;padding:0 16px 12px;border-bottom:1px solid var(--border);margin-bottom:4px">
      <div class="sidebar-lang-select">
        <button type="button" class="sb-lang-trigger" onclick="event.stopPropagation();document.getElementById('sbLangPopup').classList.toggle('open');">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:13px;height:13px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="sb-lang-current">${(I18N.available.find(l => l.code === I18N.lang) || I18N.available[0]).label}</span>
          <svg class="sb-lang-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="sb-lang-popup" id="sbLangPopup" role="listbox">
          ${I18N.available.map(l => `<button type="button" class="sb-lang-opt${l.code === I18N.lang ? ' is-active' : ''}" onclick="document.getElementById('sbLangPopup').classList.remove('open');I18N.switchTo('${l.code}');">${l.label}</button>`).join('')}
        </div>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme" style="height:28px;width:28px;border-radius:6px;flex-shrink:0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:14px;height:14px"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
    </div>

    <div class="sidebar-mode-toggle" style="display:flex;gap:4px;padding:0 16px 12px;border-bottom:1px solid var(--border);margin-bottom:4px">
      <button onclick="switchUserMode('worker')" class="sidebar-mode-btn ${userMode === 'worker' ? 'active' : ''}" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:${userMode === 'worker' ? 'var(--accent)' : 'transparent'};color:${userMode === 'worker' ? '#fff' : 'var(--text-secondary)'};font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        ${t('mode_worker') || 'Worker'}
      </button>
      <button onclick="switchUserMode('advertiser')" class="sidebar-mode-btn ${userMode === 'advertiser' ? 'active' : ''}" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:${userMode === 'advertiser' ? 'var(--accent)' : 'transparent'};color:${userMode === 'advertiser' ? '#fff' : 'var(--text-secondary)'};font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/><path d="M9 21V3"/></svg>
        ${t('mode_advertiser') || 'Advertiser'}
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="sidebar-section">
        <div class="sidebar-section-title">${t('nav_main')}</div>
        <a class="sidebar-link ${activeRoute === 'dashboard' ? 'active' : ''}" onclick="Router.navigate('/dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          ${t('nav_dashboard')}
        </a>
      </div>

      <div class="sidebar-section" style="${userMode === 'worker' ? '' : 'display:none'}">
        <div class="sidebar-section-title">${t('nav_earn')}</div>
        <a class="sidebar-link ${activeRoute === 'tasks' ? 'active' : ''}" onclick="Router.navigate('/tasks')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          ${t('nav_available_tasks')}
        </a>
        <a class="sidebar-link ${activeRoute === 'premium' ? 'active' : ''}" id="sidebar-premium-link" style="display:none" onclick="Router.navigate('/premium')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Premium Tasks
          <span class="sidebar-premium-count" style="display:none;margin-left:auto;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">0</span>
        </a>
        <a class="sidebar-link ${activeRoute === 'my-tasks' ? 'active' : ''}" onclick="Router.navigate('/my-tasks')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${t('nav_my_tasks')}
        </a>
        <a class="sidebar-link ${activeRoute === 'leaderboard' ? 'active' : ''}" onclick="Router.navigate('/leaderboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><path d="M6 3h12l-1.5 7h-9L6 3z"/></svg>
          ${t('nav_leaderboard')}
        </a>
        <a class="sidebar-link ${activeRoute === 'tools' ? 'active' : ''}" onclick="Router.navigate('/tools')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          ${t('nav_tools') || 'Tools'}
        </a>
        <a class="sidebar-link" onclick="window.open('/api/developer-redirect','_blank')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          ${t('nav_developer') || 'Developer'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:10px;height:10px;margin-left:auto;opacity:0.4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>

      <div class="sidebar-section" style="${userMode === 'advertiser' ? '' : 'display:none'}">
        <div class="sidebar-section-title">${t('nav_advertiser') || 'ADVERTISER'}</div>
        <a class="sidebar-link ${activeRoute === 'create-order' ? 'active' : ''}" onclick="Router.navigate('/create-order')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${t('nav_new_order') || 'New Order'}
        </a>
        <a class="sidebar-link ${activeRoute === 'orders' ? 'active' : ''}" onclick="Router.navigate('/orders')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>
          ${t('nav_my_orders') || 'My Orders'}
        </a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">${t('nav_account')}</div>
        <a class="sidebar-link ${activeRoute === 'wallet' ? 'active' : ''}" onclick="Router.navigate('/wallet')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="1.5"/></svg>
          ${t('nav_wallet')}
        </a>
        <a class="sidebar-link ${activeRoute === 'profile' ? 'active' : ''}" onclick="Router.navigate('/profile')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${t('nav_profile')}
        </a>
        <a class="sidebar-link ${activeRoute === 'referrals' ? 'active' : ''}" onclick="Router.navigate('/referrals')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${t('nav_referrals')}
        </a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">${t('nav_help') || 'HELP'}</div>
        <a class="sidebar-link ${activeRoute === 'guides' ? 'active' : ''}" href="/guides" onclick="var l=localStorage.getItem('pr-social-lang')||'en';if(l!=='en'){window.location.href='/'+l+'/guides';return false;}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          ${t('nav_guides') || 'Guides'}
        </a>
        <a class="sidebar-link ${activeRoute === 'faq' ? 'active' : ''}" onclick="Router.navigate('/faq')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          ${t('nav_faq')}
        </a>
        <a class="sidebar-link ${activeRoute === 'rules' ? 'active' : ''}" onclick="Router.navigate('/rules')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${t('rules_link')}
        </a>
        <a class="sidebar-link ${activeRoute === 'support' ? 'active' : ''}" onclick="Router.navigate('/support')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${t('nav_support')}
          <span class="sup-unread-badge" data-sup-unread-badge style="display:none;margin-left:auto;background:#ef4444;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:10px;min-width:18px;text-align:center;line-height:1"></span>
        </a>
        ${u.cabinet_back ? `<a class="sidebar-link" onclick="backToNewCabinet()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          ${t('nav_new_version') || 'New version'}
        </a>` : ''}
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">${t('nav_follow_us') || 'FOLLOW US'}</div>
        <a class="sidebar-link" href="https://t.me/prsocial_info" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z"/></svg>
          ${t('nav_follow_news') || 'News'}
        </a>
        <a class="sidebar-link" href="https://telegram.me/prsocial_community" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 10h8M8 14h4"/></svg>
          Community
        </a>
        <a class="sidebar-link" href="https://x.com/prsocial_app" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" fill="currentColor" stroke="none"/></svg>
          ${t('nav_follow_twitter') || 'Twitter/X'}
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="handleLogout()">
        <div class="sidebar-avatar">${initial}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${u.username || 'User'}</div>
          <div class="sidebar-user-balance">$${(u.balance || 0).toLocaleString()}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>
    </div>
  </aside>`;
}

// The new cabinet is this person's, and they are here because they asked for the old one (or the new one could not start in their
// browser): the cookie that keeps them here is removed and the address is opened again — the site answers with the new page.
function backToNewCabinet() {
  document.cookie = 'cab=; path=/; max-age=0; samesite=lax';
  window.location.assign('/dashboard');
}

async function handleLogout() {
  await API.logout();
  Router.navigate('/login');
}

// Premium sidebar chip — Phase 1.4
// Hidden by default; shown only when /api/premium/visibility returns true
// (admin OR feature_premium_enabled = 1). Counter shown only when > 0.
async function initPremiumSidebarChip() {
  const link = document.getElementById('sidebar-premium-link');
  if (!link) return;
  try {
    // Shared 30s in-memory cache + inflight dedup with /dashboard chip.
    // See getPremiumState() in components/platforms.js.
    const state = await getPremiumState();
    if (!state.visible) return;
    link.style.display = '';
    const chip = link.querySelector('.sidebar-premium-count');
    if (chip && state.count > 0) {
      chip.textContent = state.count;
      chip.style.display = 'inline-flex';
    }
  } catch (_) { /* silent: sidebar still works without premium chip */ }
}

// Restoration sidebar link — Stage 9b
// Hidden by default; shown only when /api/recovery/visibility = true
// (admin OR user.status = restricted, when feature_recovery_enabled = 1)
//
// Cached 30s in window scope: sidebar renders on every page navigation, but
// visibility rarely changes (status flips on admin action / explicit logout).
// Without cache: ~10-20 fetches per typical session. With cache: 1-2.
let _recoveryVisibilityCache = null;
let _recoveryVisibilityFetchedAt = 0;
const RECOVERY_VISIBILITY_TTL_MS = 30000;
async function initRestorationSidebarLink() {
  const link = document.getElementById('sidebar-restoration-link');
  if (!link) return;
  try {
    const now = Date.now();
    let visible;
    if (_recoveryVisibilityCache !== null && (now - _recoveryVisibilityFetchedAt) < RECOVERY_VISIBILITY_TTL_MS) {
      visible = _recoveryVisibilityCache;
    } else {
      const res = await fetch('/api/recovery/visibility', { credentials: 'same-origin' });
      const data = await res.json();
      visible = !!(data && data.visible);
      _recoveryVisibilityCache = visible;
      _recoveryVisibilityFetchedAt = now;
    }
    if (visible) link.style.display = '';
  } catch (_) { /* silent */ }
}


// === Support unread tickets badge — auto-refresh ===
// Polls /api/support/unread-count and updates all .sup-unread-badge elements.
// Polled: on page load, every 60s, and after navigating to/from /support.
(function(){
  if (window.__supUnreadInit) return; window.__supUnreadInit = true;

  async function fetchAndUpdate() {
    try {
      const r = await fetch('/api/support/unread-count', { credentials: 'include' });
      if (!r.ok) return;
      const data = await r.json();
      const n = (data && data.count) || 0;
      document.querySelectorAll('[data-sup-unread-badge]').forEach(el => {
        if (n > 0) { el.textContent = n > 99 ? '99+' : String(n); el.style.display = 'inline-flex'; }
        else { el.style.display = 'none'; el.textContent = ''; }
      });
      window.__supUnreadLast = n;
    } catch (_) { /* silent — auth-failed or network */ }
  }
  window.refreshSupportUnread = fetchAndUpdate;

  // First fetch — slight delay so login flow finishes
  setTimeout(fetchAndUpdate, 1500);
  // Poll every 60s
  setInterval(fetchAndUpdate, 60000);
  // Re-fetch when Router navigates (badge may have changed after viewing tickets)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[onclick*="Router.navigate"]');
    if (link) setTimeout(fetchAndUpdate, 800);  // small delay so backend has time to update
  });
  // Re-fetch when tab gains focus
  window.addEventListener('focus', fetchAndUpdate);
})();
