function copyRefLink() {
  const input = document.getElementById('refLinkInput');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    Toast.show(t('profile_ref_copied'), 'success');
  }).catch(() => {
    input.select();
    document.execCommand('copy');
    Toast.show(t('profile_ref_copied'), 'success');
  });
}

Router.register('referrals', async (app) => {
  const u = API.user || {};
  const refLink = `${window.location.origin}/?ref=${u.ref_code || ''}`;
  const REF_LIMIT = 50;
  let refPage = 1;
  let refFilter = 'all';
  let totalAll = 0;
  let activeCount = 0;
  let periodData = null;
  let activePeriod = 'all';

  let refStats = { count: 0, totalEarned: 0, activeCount: 0, referrals: [], page: 1, limit: REF_LIMIT };

  async function loadRefs(page, filter) {
    try {
      const res = await fetch('/api/profile/referrals?page=' + page + '&limit=' + REF_LIMIT + '&filter=' + (filter || refFilter), { credentials: 'same-origin' }).then(r => r.json());
      if (res.ok) {
        refStats = res;
        refPage = page;
        if (filter === 'all' || !filter) totalAll = res.count;
        activeCount = res.activeCount || 0;
        if (res.periodData) periodData = res.periodData;
      }
    } catch {}
  }

  await loadRefs(1, 'all');
  totalAll = refStats.count;
  activeCount = refStats.activeCount || 0;
  if (refStats.periodData) periodData = refStats.periodData;

  function getPeriodStats(key) {
    if (!periodData || !periodData[key]) return { new: totalAll, active: activeCount, earned: refStats.totalEarned };
    return periodData[key];
  }

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('referrals')}
    <main class="main-content">
      ${renderSuspiciousBanner()}
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('ref_title')}</h1>
          <p>${t('ref_subtitle')}</p>
        </div>
      </div>
      <div class="page-content">

        <!-- Hero banner -->
        <div class="ref-banner">
          <div class="ref-banner-badge">10%</div>
          <div class="ref-banner-text">
            <div class="ref-banner-title">${t('ref_earn_title')}</div>
            <div class="ref-banner-desc">${t('ref_earn_desc')}</div>
          </div>
        </div>

        <!-- Period tabs -->
        <div class="ref-period-tabs" id="refPeriodTabs">
          <button class="ref-period-tab" data-period="7d">${t('ref_period_7d') || '7 days'}</button>
          <button class="ref-period-tab" data-period="30d">${t('ref_period_30d') || '30 days'}</button>
          <button class="ref-period-tab active" data-period="all">${t('ref_period_all') || 'All time'}</button>
        </div>

        <!-- Stats row -->
        <div class="ref-stats-row">
          <div class="ref-stat-card">
            <div class="ref-stat-icon" style="background:rgba(234,88,12,0.12);color:#ea580c">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="ref-stat-num" id="refStatTotal">${totalAll}</div>
            <div class="ref-stat-lbl" id="refStatTotalLbl">${t('profile_ref_invited')}</div>
          </div>
          <div class="ref-stat-card">
            <div class="ref-stat-icon" style="background:rgba(34,197,94,0.12);color:#22c55e">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="ref-stat-num" style="color:#22c55e" id="refStatActive">${activeCount}</div>
            <div class="ref-stat-lbl">${t('ref_active') || 'Active referrals'}</div>
          </div>
          <div class="ref-stat-card">
            <div class="ref-stat-icon" style="background:rgba(16,185,129,0.12);color:#10b981">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="ref-stat-num" style="color:#10b981" id="refStatEarned">$${refStats.totalEarned}</div>
            <div class="ref-stat-lbl">${t('profile_ref_earned')}</div>
          </div>
        </div>

        <!-- Referral link -->
        <div class="ref-link-card">
          <div class="ref-link-label">${t('ref_your_link')}</div>
          <div class="ref-link-box">
            <input type="text" class="ref-link-input" id="refLinkInput" value="${refLink}" readonly>
            <button class="ref-link-btn" onclick="copyRefLink()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              ${t('profile_ref_copy')}
            </button>
          </div>
        </div>

        <!-- How it works -->
        <div class="ref-how">
          <div class="ref-how-title">${t('ref_how_title')}</div>
          <div class="ref-how-steps">
            <div class="ref-how-step">
              <div class="ref-how-num">1</div>
              <div>
                <div class="ref-how-step-title">${t('ref_step_1_title')}</div>
                <div class="ref-how-step-desc">${t('ref_step_1')}</div>
              </div>
            </div>
            <div class="ref-how-step">
              <div class="ref-how-num">2</div>
              <div>
                <div class="ref-how-step-title">${t('ref_step_2_title')}</div>
                <div class="ref-how-step-desc">${t('ref_step_2')}</div>
              </div>
            </div>
            <div class="ref-how-step">
              <div class="ref-how-num">3</div>
              <div>
                <div class="ref-how-step-title">${t('ref_step_3_title')}</div>
                <div class="ref-how-step-desc">${t('ref_step_3')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Referrals list -->
        <div class="ref-people">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
            <div class="ref-people-title" style="margin-bottom:0">${t('profile_ref_recent')}</div>
            <div class="ref-filter-tabs" id="refFilterTabs">
              <button class="ref-filter-tab active" data-filter="all">${t('ref_all') || 'All'} <span id="refFilterAllCount">${totalAll}</span></button>
              <button class="ref-filter-tab" data-filter="active">${t('ref_active') || 'Active'} <span id="refFilterActiveCount">${activeCount}</span></button>
            </div>
          </div>
          <div id="refListContainer"></div>
          <div id="refPagination"></div>
        </div>

      </div>
    </main>
  </div>`;

  // Period tab click
  document.getElementById('refPeriodTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.ref-period-tab');
    if (!tab) return;
    document.querySelectorAll('.ref-period-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    activePeriod = tab.dataset.period;
    updatePeriodStats();
  });

  function updatePeriodStats() {
    var s = getPeriodStats(activePeriod);
    var el1 = document.getElementById('refStatTotal'); if (el1) el1.textContent = s.new;
    var el2 = document.getElementById('refStatActive'); if (el2) el2.textContent = s.active;
    var el3 = document.getElementById('refStatEarned'); if (el3) el3.textContent = '$' + s.earned;
  }

  // Filter tab click
  document.getElementById('refFilterTabs').addEventListener('click', async function(e) {
    var tab = e.target.closest('.ref-filter-tab');
    if (!tab) return;
    document.querySelectorAll('.ref-filter-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    refFilter = tab.dataset.filter;
    await loadRefs(1, refFilter);
    renderRefList();
  });

  function renderRefList() {
    const container = document.getElementById('refListContainer');
    const pagDiv = document.getElementById('refPagination');
    if (!container) return;

    // Update filter counts
    var el3 = document.getElementById('refFilterAllCount'); if (el3) el3.textContent = totalAll;
    var el4 = document.getElementById('refFilterActiveCount'); if (el4) el4.textContent = activeCount;

    if (refStats.referrals.length === 0 && refStats.count === 0) {
      container.innerHTML = '<div class="ref-people-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;color:var(--text-muted);margin-bottom:8px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
        '<div>' + (refFilter === 'active' ? (t('ref_no_active') || 'No active referrals yet') : t('ref_no_referrals')) + '</div>' +
        '<div class="ref-people-hint">' + (refFilter === 'active' ? (t('ref_no_active_hint') || 'Active referrals are those who completed at least 1 task') : t('ref_no_referrals_hint')) + '</div></div>';
      if (pagDiv) pagDiv.innerHTML = '';
      return;
    }

    container.innerHTML = refStats.referrals.map(function(r) {
      var activeBadge = r.is_active
        ? '<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;background:rgba(34,197,94,0.12);color:#22c55e"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>' + (t('ref_active_badge') || 'Active') + '</span>'
        : '<span style="padding:2px 8px;border-radius:99px;font-size:10px;font-weight:500;background:rgba(113,113,122,0.12);color:#71717a">' + (t('ref_inactive_badge') || 'Inactive') + '</span>';
      var tasksBadge = r.tasks_approved > 0
        ? '<span style="font-size:11px;color:var(--text-muted);margin-left:4px">' + r.tasks_approved + ' ' + (t('ref_tasks_short') || 'tasks') + '</span>'
        : '';
      return '<div class="ref-person">' +
        '<div class="ref-person-avatar' + (r.is_active ? ' ref-person-avatar-active' : '') + '">' + (r.username || '?')[0].toUpperCase() + '</div>' +
        '<div class="ref-person-info">' +
          '<div class="ref-person-name">' + escHtml(r.username) + ' ' + activeBadge + tasksBadge + (r.user_status === 'suspicious' ? ' <span class="referral-suspicious">' + t('suspicious_referral_label') + '</span>' : '') + '</div>' +
          '<div class="ref-person-date">' + (r.created_at ? timeAgo(r.created_at) : '') + (r.user_status === 'suspicious' ? ' · <span style="color:#dc2626;font-size:10px">' + t('suspicious_referral_paused') + '</span>' : '') + '</div>' +
        '</div>' +
        '<div class="ref-person-bonus">' + (r.earned_fmt > 0 ? '+$' + r.earned_fmt : '$0') + '</div>' +
      '</div>';
    }).join('');

    // Pagination
    var totalPages = Math.ceil(refStats.count / REF_LIMIT);
    if (totalPages <= 1) { if (pagDiv) pagDiv.innerHTML = ''; return; }

    var from = (refPage - 1) * REF_LIMIT + 1;
    var to = Math.min(refPage * REF_LIMIT, refStats.count);
    var html = '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">';
    html += '<button class="btn btn-sm" ' + (refPage <= 1 ? 'disabled' : '') + ' onclick="window._refPrev()">&laquo;</button>';
    html += '<span style="font-size:13px;color:var(--text-muted)">' + from + '-' + to + ' / ' + refStats.count + '</span>';
    html += '<button class="btn btn-sm" ' + (refPage >= totalPages ? 'disabled' : '') + ' onclick="window._refNext()">&raquo;</button>';
    html += '</div>';
    if (pagDiv) pagDiv.innerHTML = html;
  }

  window._refPrev = async function() { if (refPage > 1) { await loadRefs(refPage - 1); renderRefList(); } };
  window._refNext = async function() { var tp = Math.ceil(refStats.count / REF_LIMIT); if (refPage < tp) { await loadRefs(refPage + 1); renderRefList(); } };

  renderRefList();
});
