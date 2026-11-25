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
  const _st = (k, fb) => {
    try { const v = typeof t === 'function' ? t(k) : ''; return (v && v !== k) ? v : fb; } catch { return fb; }
  };

  // Schedule async premium chip + tasks count update after DOM mount
  setTimeout(() => {
    initPremiumSidebarChip();
    if (typeof initSidebarTasksCount === 'function') initSidebarTasksCount();
  }, 0);

  return `
  <aside class="sidebar" id="sidebar">
    <style id="sbCabMatch">
      .sidebar-logo{display:flex;align-items:center;gap:10px;padding:16px 16px 12px}
      .sb-brand-mark{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.08);border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;letter-spacing:-0.03em;color:var(--text-primary)}
      .sidebar-mode-toggle{display:flex;gap:4px;padding:3px;margin:0 14px 12px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid var(--border)}
      .sidebar-mode-btn{flex:1;padding:6px 8px;border:none;border-radius:8px;background:transparent;color:var(--text-muted);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
      .sidebar-mode-btn.active{background:rgba(255,255,255,0.09);color:var(--text-primary)}
      .sidebar-link.active{background:linear-gradient(135deg,#22c55e,#16a34a)!important;color:#fff!important;font-weight:600;box-shadow:0 4px 12px rgba(34,197,94,0.25)}
      .sidebar-link.active svg{color:#fff!important;stroke:#fff!important}
      .sb-count-pill{margin-left:auto;background:rgba(255,255,255,0.08);color:var(--text-secondary);padding:2px 7px;border-radius:999px;font-size:11px;font-weight:600;line-height:1.2}
      .sb-follow-row{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;margin-top:4px}
      .sb-follow-lbl{font-size:10px;font-weight:700;letter-spacing:0.06em;color:var(--text-muted);text-transform:uppercase}
      .sb-follow-icons{display:flex;align-items:center;gap:10px}
      .sb-follow-icons a{color:var(--text-muted);display:inline-flex;align-items:center;transition:color .15s}
      .sb-follow-icons a:hover{color:var(--text-primary)}
      .sb-footer-tools{display:flex;align-items:center;gap:6px;padding:10px 14px 6px;border-top:1px solid var(--border)}
      .sb-footer-tools .sidebar-lang-select{flex:1;position:relative}
      .sb-footer-tools .sb-lang-popup{top:auto!important;bottom:calc(100% + 6px)!important}
      .sb-user-trust{font-size:11px;color:#22c55e;font-weight:600;display:flex;align-items:center;gap:4px}
    </style>

    <div class="sidebar-logo">
      <span class="sb-brand-mark">PR</span>
      <h1 style="margin:0;font-size:16px;letter-spacing:-0.02em">PR<span style="color:var(--accent)">.</span>SOCIAL</h1>
    </div>

    <div class="sidebar-mode-toggle">
      <button onclick="switchUserMode('worker')" class="sidebar-mode-btn ${userMode === 'worker' ? 'active' : ''}">
        ${_st('mode_worker', 'Travailleur')}
      </button>
      <button onclick="switchUserMode('advertiser')" class="sidebar-mode-btn ${userMode === 'advertiser' ? 'active' : ''}">
        ${_st('mode_advertiser', 'Annonceur')}
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="sidebar-section" style="margin-bottom:6px">
        <a class="sidebar-link ${activeRoute === 'dashboard' ? 'active' : ''}" onclick="Router.navigate('/dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          ${_st('nav_dashboard', 'Tableau de bord')}
        </a>
      </div>

      <div class="sidebar-section" style="${userMode === 'worker' ? '' : 'display:none'}">
        <div class="sidebar-section-title">${_st('nav_earn', 'GAGNER')}</div>
        <a class="sidebar-link ${activeRoute === 'tasks' ? 'active' : ''}" onclick="Router.navigate('/tasks')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          ${_st('nav_tasks', I18N.lang === 'fr' ? 'Tâches' : 'Tasks')}
          <span class="sb-count-pill" id="sb-tasks-count" style="display:none">0</span>
        </a>
        <a class="sidebar-link ${activeRoute === 'premium' ? 'active' : ''}" id="sidebar-premium-link" style="display:none" onclick="Router.navigate('/premium')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Premium
          <span class="sidebar-premium-count" style="display:none;margin-left:auto;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">0</span>
        </a>
        <a class="sidebar-link ${activeRoute === 'my-tasks' ? 'active' : ''}" onclick="Router.navigate('/my-tasks')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${_st('nav_my_tasks', 'Mes tâches')}
        </a>
        <a class="sidebar-link ${activeRoute === 'leaderboard' ? 'active' : ''}" onclick="Router.navigate('/leaderboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><path d="M6 3h12l-1.5 7h-9L6 3z"/></svg>
          ${_st('nav_leaderboard', 'Classement')}
        </a>
        <a class="sidebar-link ${activeRoute === 'tools' ? 'active' : ''}" onclick="Router.navigate('/tools')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          ${_st('nav_tools', 'Outils')}
        </a>
      </div>

      <div class="sidebar-section" style="${userMode === 'advertiser' ? '' : 'display:none'}">
        <div class="sidebar-section-title">${_st('nav_advertiser', 'ANNONCEUR')}</div>
        <a class="sidebar-link ${activeRoute === 'create-order' ? 'active' : ''}" onclick="Router.navigate('/create-order')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${_st('nav_new_order', 'Nouvelle commande')}
        </a>
        <a class="sidebar-link ${activeRoute === 'orders' ? 'active' : ''}" onclick="Router.navigate('/orders')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>
          ${_st('nav_my_orders', 'Mes commandes')}
        </a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">${_st('nav_account', 'COMPTE')}</div>
        <a class="sidebar-link ${activeRoute === 'wallet' ? 'active' : ''}" onclick="Router.navigate('/wallet')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="1.5"/></svg>
          ${_st('nav_wallet', 'Portefeuille')}
        </a>
        <a class="sidebar-link ${activeRoute === 'referrals' ? 'active' : ''}" onclick="Router.navigate('/referrals')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${_st('nav_referrals', 'Parrainage')}
        </a>
        <a class="sidebar-link ${activeRoute === 'profile' ? 'active' : ''}" onclick="Router.navigate('/profile')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${_st('nav_profile_security', I18N.lang === 'fr' ? 'Profil et sécurité' : 'Profile & security')}
        </a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">${_st('nav_help', 'AIDE')}</div>
        <a class="sidebar-link ${activeRoute === 'support' ? 'active' : ''}" onclick="Router.navigate('/support')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${_st('nav_support', 'Assistance')}
          <span class="sup-unread-badge" data-sup-unread-badge style="display:none;margin-left:auto;background:#ef4444;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:10px;min-width:18px;text-align:center;line-height:1"></span>
        </a>
        <a class="sidebar-link ${activeRoute === 'guides' ? 'active' : ''}" href="/guides" onclick="var l=localStorage.getItem('pr-social-lang')||'en';if(l!=='en'){window.location.href='/'+l+'/guides';return false;}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          ${_st('nav_guides', 'Guides')}
        </a>
        <a class="sidebar-link ${activeRoute === 'faq' ? 'active' : ''}" onclick="Router.navigate('/faq')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          ${_st('nav_faq', 'FAQ')}
        </a>
        <a class="sidebar-link ${activeRoute === 'rules' ? 'active' : ''}" onclick="Router.navigate('/rules')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${_st('rules_link', 'Règles')}
        </a>
      </div>

      <div class="sidebar-section" style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px">
        <a class="sidebar-link" href="https://telegram.me/prsocial_community" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Communauté
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:11px;height:11px;margin-left:auto;opacity:0.45"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <a class="sidebar-link" onclick="window.open('/api/developer-redirect','_blank')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          ${_st('nav_developer', 'Développeurs')}
        </a>
      </div>

      <div class="sb-follow-row">
        <span class="sb-follow-lbl">${_st('nav_follow_us', 'SUIVEZ-NOUS')}</span>
        <div class="sb-follow-icons">
          <a href="https://x.com/prsocial_app" target="_blank" rel="noopener" title="X / Twitter">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>
          </a>
          <a href="https://t.me/prsocial_info" target="_blank" rel="noopener" title="Telegram">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
          </a>
          <a href="https://www.youtube.com/@prsocial_app" target="_blank" rel="noopener" title="YouTube">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
          </a>
        </div>
      </div>
    </nav>

    <div class="sb-footer-tools">
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:14px;height:14px"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>

    <div class="sidebar-footer" style="border-top:none;padding-top:4px">
      <div class="sidebar-user" onclick="handleLogout()">
        <div class="sidebar-avatar" style="background:rgba(34,197,94,0.2);color:#22c55e">${initial}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${u.username || 'User'}</div>
          <div class="sb-user-trust">✓ ${u.trust_score >= 80 || u.trust_score == null ? _st('nav_trusted', I18N.lang === 'fr' ? 'De confiance' : 'Trusted') : '$' + (u.balance || 0).toFixed(2)}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>
    </div>
  </aside>`;
}

async function initSidebarTasksCount() {
  const el = document.getElementById('sb-tasks-count');
  if (!el) return;
  try {
    const r = await fetch('/api/cabinet/frame', { credentials: 'same-origin' });
    if (!r.ok) return;
    const d = await r.json();
    const c = d && d.counts && d.counts.tasks;
    if (c > 0) {
      el.textContent = c;
      el.style.display = 'inline-flex';
    }
  } catch (_) {}
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
