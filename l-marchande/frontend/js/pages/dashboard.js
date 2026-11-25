// Advertiser view — compact overview for users in advertiser mode.
// Layout: hero ribbon (greeting + balance + CTA) → KPI cards (4) → mini chart
// → recent orders → bottom CTA. Reuses CSS classes from /orders page (.adv-*)
// so visual language stays consistent. No new endpoints; backend uses
// already-cached /api/tasks/orders/stats?period=7d (TTL 60s in Redis).
async function renderAdvertiserDashboard(app) {
  const u = API.user || {};
  const _t = (k, fb) => { try { const v = (typeof t === 'function') ? t(k) : null; return (v && v !== k) ? v : (fb || k); } catch { return fb || k; } };
  const fmtMoney = (v) => v == null ? '$0' : Math.abs(v) < 0.01 ? '$' + v.toFixed(4) : '$' + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Two parallel reads. Both small payloads. The stats endpoint is the heavy
  // one — and it's already cached server-side, so even hot reload is cheap.
  const [statsRes, recentRes] = await Promise.all([
    fetch('/api/tasks/orders/stats?period=7d', { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({})),
    fetch('/api/tasks/orders/my?limit=5', { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({})),
  ]);
  const stats = statsRes && statsRes.ok ? statsRes : null;
  const recentOrders = (recentRes && recentRes.orders) || [];
  const w = stats ? (stats.window || {}) : {};
  const lt = stats ? (stats.lifetime || {}) : {};
  const daily = stats ? (stats.daily || []) : [];

  // Mini chart — same approach as /orders page bars
  const maxGross = Math.max(0, ...daily.map(d => d.gross || 0));
  const bars = daily.map(d => {
    const h = maxGross > 0 ? Math.max(2, Math.round((d.gross || 0) / maxGross * 100)) : 2;
    return `<div class="advd-bar" style="height:${h}%" title="${d.day}: ${fmtMoney(d.gross)}"></div>`;
  }).join('');

  const statusLabel = {
    in_progress: _t('orders_status_active', 'Active'),
    active: _t('orders_status_active', 'Active'),
    paused: _t('orders_status_paused', 'Paused'),
    completed: _t('orders_status_completed', 'Completed'),
    cancelled: _t('orders_status_cancelled', 'Cancelled'),
    error: _t('orders_status_error', 'Error'),
  };

  const hasOrders = (lt.total || 0) > 0 || recentOrders.length > 0;

  // Recent orders list — compact, click → /orders page details
  const recentHtml = recentOrders.length ? recentOrders.map(o => {
    const pct = o.total_count > 0 ? Math.round((o.completed_count || 0) / o.total_count * 100) : 0;
    const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[o.platform]) || '#22c55e';
    const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[o.platform])
      || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    return `
      <div class="advd-recent-row" onclick="Router.navigate('/orders')" tabindex="0">
        <div class="advd-recent-icon" style="color:${color};background:${color}1a">${icon}</div>
        <div class="advd-recent-info">
          <div class="advd-recent-label">${escHtml(o.label || (o.platform + ' ' + o.action))}</div>
          <div class="advd-recent-target">${escHtml(o.target_username || o.target_url || '—')}</div>
        </div>
        <div class="advd-recent-meta">
          <div class="advd-recent-progress">
            <span class="advd-mini-bar"><span class="advd-mini-bar-fill" style="width:${pct}%"></span></span>
            <span class="advd-recent-num">${o.completed_count}/${o.total_count}</span>
          </div>
          <div class="advd-recent-status advd-status-${o.status}">${statusLabel[o.status] || o.status}</div>
        </div>
      </div>
    `;
  }).join('') : '';

  // Top services — derive from current page: group recentOrders by label.
  // For a deeper window we'd need a dedicated endpoint, but recent-5 gives a
  // reasonable hint and avoids extra queries. Fallback: hide if empty.
  const topServicesByLabel = {};
  for (const o of recentOrders) {
    const key = o.label || (o.platform + ':' + o.action);
    const spend = (o.cost_per_task || 0) * (o.completed_count || 0);
    topServicesByLabel[key] = (topServicesByLabel[key] || 0) + spend;
  }
  const topServices = Object.entries(topServicesByLabel)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('dashboard')}
      <main class="main-content">
        <div class="page-header">
          ${renderHamburger()}
          <div class="page-header-text">
            <h1>${_t('dash_adv_title', 'Dashboard')}</h1>
            <p>${_t('dash_adv_subtitle', 'Quick overview of your campaigns')}</p>
          </div>
        </div>
        <div class="page-content" id="advDashRoot">
          ${renderAdvertiserStyles()}
          ${renderAdvertiserHero(u, _t, fmtMoney)}
          ${hasOrders ? renderAdvertiserKPIs(w, lt, _t, fmtMoney) : ''}
          ${hasOrders && daily.length ? renderAdvertiserChart(bars, _t, fmtMoney, w) : ''}
          ${hasOrders ? renderAdvertiserRecent(recentHtml, _t) : renderAdvertiserEmpty(_t, (u && u.balance) || 0, fmtMoney)}
          ${hasOrders && topServices.length ? renderAdvertiserTopServices(topServices, fmtMoney, _t) : ''}
        </div>
      </main>
    </div>
  `;

  // Hydrate featured services if we rendered the empty state.
  if (!hasOrders) {
    requestAnimationFrame(() => _advdHydrateFeatured());
  }
}

function renderAdvertiserStyles() {
  return `
    <style id="advDashStyles">
      /* Layout — center content on huge screens, breathing room on narrow */
      #advDashRoot{max-width:1200px;margin:0 auto;width:100%}

      .advd-hero{background:linear-gradient(135deg,rgba(34,197,94,0.06),rgba(74,222,128,0.03));border:1px solid rgba(34,197,94,0.18);border-radius:14px;padding:18px 22px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
      .advd-hero-greeting{font-size:18px;font-weight:700;color:var(--text-primary);line-height:1.25}
      .advd-hero-greeting .accent{color:#22c55e}
      .advd-hero-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px}
      .advd-hero-balance{font-size:13px;color:var(--text-secondary,#6b7280);font-variant-numeric:tabular-nums}
      .advd-hero-balance strong{color:var(--text-primary);font-weight:700;font-size:14px}
      .advd-hero-cta{padding:10px 18px;border-radius:10px;background:linear-gradient(135deg,#16a34a,#22c55e,#4ade80);color:#fff;font-weight:700;font-size:13.5px;text-decoration:none;border:0;cursor:pointer;box-shadow:0 4px 12px rgba(34,197,94,0.25);transition:transform .12s, box-shadow .15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
      .advd-hero-cta:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(34,197,94,0.35)}

      /* KPI grid — responsive: 1 col on phones, 2 on small tablets, 4 on >=720 */
      .advd-kpis{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:16px}
      @media (min-width:480px){.advd-kpis{grid-template-columns:1fr 1fr}}
      @media (min-width:720px){.advd-kpis{grid-template-columns:repeat(4,1fr)}}
      .advd-kpi{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:10px;padding:12px 14px;min-width:0}
      .advd-kpi-label{font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary,#6b7280);font-weight:700;line-height:1.2}
      .advd-kpi-value{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;margin-top:4px;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .advd-kpi-sub{font-size:10.5px;color:var(--text-secondary,#9ca3af);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .advd-kpi.spend{background:linear-gradient(135deg,rgba(34,197,94,0.06),rgba(74,222,128,0.03));border-color:rgba(34,197,94,0.18)}
      .advd-kpi.spend .advd-kpi-value{color:#22c55e}
      .advd-kpi.lifetime{background:linear-gradient(135deg,rgba(99,102,241,0.05),rgba(139,92,246,0.02));border-color:rgba(99,102,241,0.18)}
      .advd-kpi.lifetime .advd-kpi-value{color:#6366f1}

      .advd-chart{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:16px}
      .advd-chart-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;gap:10px;flex-wrap:wrap}
      .advd-chart-head h3{margin:0;font-size:13px;font-weight:700;color:var(--text-primary)}
      .advd-chart-head .total{font-size:12.5px;color:var(--text-secondary,#6b7280)}
      .advd-chart-head .total strong{color:#22c55e;font-weight:700}
      .advd-chart-bars{display:flex;align-items:flex-end;gap:3px;height:60px;justify-content:space-between}
      .advd-bar{flex:1;background:linear-gradient(180deg,#22c55e,#4ade80);border-radius:3px 3px 0 0;min-height:2px;cursor:default;transition:opacity .12s}
      .advd-bar:hover{opacity:0.8}

      .advd-section-head{display:flex;justify-content:space-between;align-items:center;margin:18px 0 10px;gap:10px}
      .advd-section-head h3{margin:0;font-size:14px;font-weight:700}
      .advd-section-head a{font-size:12px;color:#22c55e;text-decoration:none;font-weight:600;cursor:pointer}
      .advd-section-head a:hover{text-decoration:underline}

      .advd-recent{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:12px;overflow:hidden}
      .advd-recent-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid var(--border);cursor:pointer;transition:background .12s}
      .advd-recent-row:first-child{border-top:0}
      .advd-recent-row:hover{background:var(--bg-hover,rgba(34,197,94,0.04))}
      .advd-recent-row:focus{outline:2px solid rgba(34,197,94,0.4);outline-offset:-2px}
      .advd-recent-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .advd-recent-icon svg{width:18px;height:18px}
      .advd-recent-info{flex:1;min-width:0}
      .advd-recent-label{font-weight:600;font-size:13px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .advd-recent-target{font-size:11px;color:var(--text-secondary,#6b7280);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px}
      .advd-recent-meta{display:flex;align-items:center;gap:10px;font-size:12px;flex-shrink:0}
      .advd-recent-progress{display:flex;align-items:center;gap:6px;font-variant-numeric:tabular-nums;color:var(--text-secondary,#6b7280)}
      .advd-mini-bar{display:inline-block;width:60px;height:4px;background:var(--bg-secondary,#f3f4f6);border-radius:99px;overflow:hidden}
      .advd-mini-bar-fill{height:100%;background:linear-gradient(90deg,#22c55e,#4ade80)}
      .advd-recent-status{padding:3px 10px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em}
      .advd-status-in_progress, .advd-status-active{background:rgba(34,197,94,0.10);color:#16a34a}
      .advd-status-completed{background:rgba(99,102,241,0.10);color:#6366f1}
      .advd-status-cancelled{background:rgba(156,163,175,0.16);color:#6b7280}
      .advd-status-paused{background:rgba(234,179,8,0.12);color:#a16207}
      .advd-status-error{background:rgba(239,68,68,0.10);color:#dc2626}
      @media (max-width:560px){
        .advd-recent-target{max-width:120px}
        .advd-recent-meta{gap:6px;font-size:11px}
        .advd-mini-bar{width:42px}
      }

      .advd-top{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:12px;padding:14px}
      .advd-top h3{margin:0 0 10px;font-size:13px;font-weight:700}
      .advd-top-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;gap:12px}
      .advd-top-row + .advd-top-row{border-top:1px solid var(--border)}
      .advd-top-name{color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .advd-top-val{color:#22c55e;font-weight:700;font-variant-numeric:tabular-nums;flex-shrink:0}

      /* Empty state — info-rich */
      .advd-empty-wrap{display:flex;flex-direction:column;gap:18px}
      .advd-how{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:14px;padding:18px 20px}
      .advd-how-title{font-size:14px;font-weight:700;margin-bottom:14px;color:var(--text-primary)}
      .advd-how-steps{display:grid;grid-template-columns:1fr;gap:14px}
      @media (min-width:640px){.advd-how-steps{grid-template-columns:repeat(3,1fr)}}
      .advd-how-step{display:flex;align-items:flex-start;gap:12px}
      .advd-how-num{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,rgba(34,197,94,0.10),rgba(74,222,128,0.05));color:#22c55e;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(34,197,94,0.18)}
      .advd-how-step-text{min-width:0;flex:1}
      .advd-how-step-title{font-size:13px;font-weight:700;color:var(--text-primary);line-height:1.3}
      .advd-how-step-desc{font-size:12px;color:var(--text-secondary,#6b7280);margin-top:3px;line-height:1.4}

      .advd-feat-grid{display:grid;grid-template-columns:1fr;gap:10px}
      @media (min-width:520px){.advd-feat-grid{grid-template-columns:1fr 1fr}}
      @media (min-width:840px){.advd-feat-grid{grid-template-columns:repeat(3,1fr)}}
      .advd-feat-card{display:flex;align-items:center;gap:12px;background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:12px;padding:12px 14px;cursor:pointer;text-decoration:none;color:inherit;transition:border-color .12s, transform .12s, box-shadow .12s}
      .advd-feat-card:hover{border-color:rgba(34,197,94,0.45);transform:translateY(-1px);box-shadow:0 4px 14px rgba(34,197,94,0.10)}
      .advd-feat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .advd-feat-icon svg{width:20px;height:20px}
      .advd-feat-info{flex:1;min-width:0}
      .advd-feat-label{font-size:13px;font-weight:700;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.25}
      .advd-feat-meta{font-size:11px;color:var(--text-secondary,#6b7280);margin-top:3px;font-variant-numeric:tabular-nums}
      .advd-feat-meta .price{color:#22c55e;font-weight:700}

      .advd-balance-hint{display:flex;align-items:center;justify-content:space-between;gap:12px;background:linear-gradient(135deg,rgba(234,179,8,0.08),rgba(245,158,11,0.04));border:1px solid rgba(234,179,8,0.25);border-radius:10px;padding:12px 14px;font-size:12.5px;color:#92400e}
      .advd-balance-hint strong{color:#78350f}
      .advd-balance-hint .advd-hint-cta{padding:6px 14px;border-radius:7px;border:0;background:linear-gradient(135deg,#f59e0b,#22c55e);color:#fff;font-weight:700;font-size:12px;cursor:pointer;text-decoration:none;white-space:nowrap}

      .advd-actions-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}
      .advd-secondary{padding:9px 16px;border-radius:9px;background:transparent;border:1px solid var(--border);color:var(--text-primary);font-weight:600;font-size:13px;cursor:pointer;text-decoration:none}
      .advd-secondary:hover{border-color:#22c55e;color:#22c55e;background:rgba(34,197,94,0.04)}

      /* Loading shimmer for featured grid while catalog loads */
      .advd-feat-skeleton{background:var(--bg-secondary,#f3f4f6);border-radius:12px;height:64px;animation:advdShimmer 1.4s ease-in-out infinite}
      @keyframes advdShimmer{0%,100%{opacity:0.6}50%{opacity:1}}
    </style>
  `;
}

function renderAdvertiserHero(u, _t, fmtMoney) {
  const balance = u && typeof u.balance === 'number' ? u.balance : 0;
  return `
    <div class="advd-hero">
      <div>
        <div class="advd-hero-greeting">
          ${_t('dash_adv_hi', 'Hi')}, <span class="accent">${escHtml(u.username || _t('dash_adv_user', 'advertiser'))}</span>
        </div>
        <div class="advd-hero-meta">
          <span class="advd-hero-balance">${_t('dash_adv_balance', 'Balance')}: <strong>${fmtMoney(balance)}</strong></span>
        </div>
      </div>
      <button class="advd-hero-cta" onclick="Router.navigate('/create-order')">
        + ${_t('orders_new', 'New Order')}
      </button>
    </div>
  `;
}

function renderAdvertiserKPIs(w, lt, _t, fmtMoney) {
  return `
    <div class="advd-kpis">
      <div class="advd-kpi">
        <div class="advd-kpi-label">${_t('orders_stats_active_label', 'Active')}</div>
        <div class="advd-kpi-value" style="color:#16a34a">${w.active || 0}</div>
        <div class="advd-kpi-sub">${w.total || 0} ${_t('orders_stats_in_period', 'in period')}</div>
      </div>
      <div class="advd-kpi spend">
        <div class="advd-kpi-label">${_t('orders_stats_spent', 'Spent in period')}</div>
        <div class="advd-kpi-value">${fmtMoney(w.spent || 0)}</div>
        <div class="advd-kpi-sub">${_t('orders_stats_committed', 'Committed')} ${fmtMoney(w.gross || 0)}</div>
      </div>
      <div class="advd-kpi">
        <div class="advd-kpi-label">${_t('orders_stats_completion', 'Completion')}</div>
        <div class="advd-kpi-value">${w.completion_rate || 0}%</div>
        <div class="advd-kpi-sub">${w.completed || 0} / ${w.total || 0}</div>
      </div>
      <div class="advd-kpi lifetime">
        <div class="advd-kpi-label">${_t('orders_stats_lifetime', 'Lifetime')}</div>
        <div class="advd-kpi-value">${fmtMoney(lt.spent || 0)}</div>
        <div class="advd-kpi-sub">${lt.total || 0} ${_t('orders_stats_total', 'orders total')}</div>
      </div>
    </div>
  `;
}

function renderAdvertiserChart(bars, _t, fmtMoney, w) {
  return `
    <div class="advd-chart">
      <div class="advd-chart-head">
        <h3>${_t('dash_adv_spend_7d', 'Spend, last 7 days')}</h3>
        <span class="total">${_t('orders_stats_spent', 'Spent')}: <strong>${fmtMoney(w.spent || 0)}</strong></span>
      </div>
      <div class="advd-chart-bars">${bars}</div>
    </div>
  `;
}

function renderAdvertiserRecent(recentHtml, _t) {
  return `
    <div class="advd-section-head">
      <h3>${_t('dash_adv_recent_orders', 'Recent orders')}</h3>
      <a onclick="Router.navigate('/orders')" tabindex="0">${_t('dash_adv_view_all', 'View all')} →</a>
    </div>
    <div class="advd-recent">${recentHtml}</div>
  `;
}

function renderAdvertiserTopServices(topServices, fmtMoney, _t) {
  return `
    <div class="advd-section-head"><h3>${_t('dash_adv_top_services', 'Top services')}</h3></div>
    <div class="advd-top">
      ${topServices.map(([label, sp]) => `
        <div class="advd-top-row">
          <span class="advd-top-name">${escHtml(label)}</span>
          <span class="advd-top-val">${fmtMoney(sp)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAdvertiserEmpty(_t, balance, fmtMoney) {
  // Balance hint shown when balance is effectively empty (< $1).
  const showBalanceHint = (typeof balance === 'number') && balance < 1;
  return `
    <div class="advd-empty-wrap">
      <div class="advd-how">
        <div class="advd-how-title">${_t('dash_adv_how_title', 'How it works')}</div>
        <div class="advd-how-steps">
          <div class="advd-how-step">
            <div class="advd-how-num">1</div>
            <div class="advd-how-step-text">
              <div class="advd-how-step-title">${_t('dash_adv_how_s1_title', 'Pick a service')}</div>
              <div class="advd-how-step-desc">${_t('dash_adv_how_s1_desc', 'Choose what to promote — likes, follows, subscribers and more across 14 platforms.')}</div>
            </div>
          </div>
          <div class="advd-how-step">
            <div class="advd-how-num">2</div>
            <div class="advd-how-step-text">
              <div class="advd-how-step-title">${_t('dash_adv_how_s2_title', 'Set target & quantity')}</div>
              <div class="advd-how-step-desc">${_t('dash_adv_how_s2_desc', 'Paste your link and decide how many actions you want. We charge only for delivered work.')}</div>
            </div>
          </div>
          <div class="advd-how-step">
            <div class="advd-how-num">3</div>
            <div class="advd-how-step-text">
              <div class="advd-how-step-title">${_t('dash_adv_how_s3_title', 'Real workers deliver')}</div>
              <div class="advd-how-step-desc">${_t('dash_adv_how_s3_desc', 'Verified users complete the action and submit proof. AI checks every screenshot.')}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="advd-section-head">
          <h3>${_t('dash_adv_featured_title', 'Featured services')}</h3>
          <a onclick="Router.navigate('/create-order')" tabindex="0">${_t('dash_adv_browse_catalog', 'Browse all')} →</a>
        </div>
        <div class="advd-feat-grid" id="advdFeaturedGrid">
          ${Array(6).fill('<div class="advd-feat-skeleton"></div>').join('')}
        </div>
      </div>

      ${showBalanceHint ? `
        <div class="advd-balance-hint">
          <span>${_t('dash_adv_balance_low', 'Your balance is')} <strong>${fmtMoney(balance || 0)}</strong>. ${_t('dash_adv_balance_low_hint', 'Top up your account to start your first campaign.')}</span>
          <a class="advd-hint-cta" onclick="Router.navigate('/wallet')">${_t('dash_adv_balance_low_cta', 'Add funds')} →</a>
        </div>
      ` : ''}

      <div class="advd-actions-row">
        <button class="advd-hero-cta" onclick="Router.navigate('/create-order')">+ ${_t('dash_adv_empty_cta', 'Create your first order')}</button>
        <a class="advd-secondary" onclick="Router.navigate('/create-order')">${_t('dash_adv_browse_catalog_btn', 'Browse catalog')}</a>
      </div>
    </div>
  `;
}

// Hydrate the featured-services grid from cached catalog endpoint.
// Called after the empty view is in the DOM (no-op on errors — skeletons stay).
async function _advdHydrateFeatured() {
  const grid = document.getElementById('advdFeaturedGrid');
  if (!grid) return;
  try {
    const r = await fetch('/api/tasks/advertiser-catalog', { credentials: 'same-origin' }).then(x => x.json());
    if (!r || !r.ok || !r.items || !r.items.length) {
      grid.innerHTML = '<div class="muted" style="grid-column:1/-1;text-align:center;padding:14px;font-size:12px;color:var(--text-secondary,#6b7280)">No services available right now.</div>';
      return;
    }
    const fmt = (v) => v == null ? '$0' : Math.abs(v) < 0.01 ? '$' + v.toFixed(4) : '$' + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const featured = r.items.slice(0, 6);
    grid.innerHTML = featured.map(it => {
      const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[it.platform]) || '#22c55e';
      const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[it.platform]) || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
      return `
        <a class="advd-feat-card" onclick="Router.navigate('/create-order')">
          <div class="advd-feat-icon" style="color:${color};background:${color}1a">${icon}</div>
          <div class="advd-feat-info">
            <div class="advd-feat-label">${escHtml(it.label)}</div>
            <div class="advd-feat-meta"><span class="price">${fmt(it.price_per_task)}</span> / action · min ${(it.min_per_order || 0).toLocaleString()}</div>
          </div>
        </a>
      `;
    }).join('');
  } catch (e) {
    grid.innerHTML = '<div class="muted" style="grid-column:1/-1;text-align:center;padding:14px;font-size:12px;color:var(--text-secondary,#6b7280)">Catalog temporarily unavailable.</div>';
  }
}

Router.register('dashboard', async (app) => {
  // Mode-aware split: advertiser users get a campaign-focused overview;
  // worker users get the existing earning-focused dashboard untouched.
  // getUserMode() comes from sidebar.js (loaded before this file in index.html).
  if (typeof getUserMode === 'function' && getUserMode() === 'advertiser') {
    return renderAdvertiserDashboard(app);
  }

  const u = API.user || {};

  // Fetch real stats
  let stats = { completed: 0, activeOrders: 0, pendingReview: 0, earned: 0, platformCounts: {} };
  let chartData = [];
  let newsItems = [];
  let recentTasks = [];
  let _premiumVisible = false, _premiumCount = 0;
  try {
    // Block 4b.2 (2026-05-05): one batched fetch instead of 4 parallel.
    // Backend: GET /api/tasks/dashboard-init returns recent_tasks, status_counts,
    // total_earned, platform_counts, chart, news. Cache TTL 20s server-side.
    const init = await fetch('/api/tasks/dashboard-init?lang=' + (I18N.lang || 'en'), { credentials: 'same-origin' })
      .then(r => r.json())
      .catch(() => ({ ok: false }));
    if (init.ok) {
      newsItems = init.news || [];
      const sc = init.status_counts || {};
      stats.completed = sc.approved || 0;
      stats.pendingReview = sc.pending_review || 0;
      stats.earned = init.total_earned || 0;
      recentTasks = (init.recent_tasks || []).slice(0, 4);
      stats.platformCounts = {};
      (init.platform_counts || []).forEach(p => { stats.platformCounts[p.platform] = p.count; });
      chartData = init.chart || [];
    }
    // Shared 30s window-cache + inflight dedup with sidebar (components/platforms.js).
    // No round-trip if sidebar already fetched within the last 30s.
    try {
      const _ps = await getPremiumState();
      _premiumVisible = !!_ps.visible;
      _premiumCount = _ps.count || 0;
    } catch (_) { /* fail-quiet: chip simply hidden */ }
  } catch (e) { /* ignore */ }

  const totalTasks = Object.values(stats.platformCounts).reduce((a, b) => a + b, 0);
  const totalDone = stats.completed + stats.pendingReview;
  const approvalRate = totalDone > 0 ? Math.round((stats.completed / totalDone) * 100) : 100;

  let streakDays = 0;
  if (chartData.length > 0) {
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].tasks > 0) streakDays++;
      else break;
    }
  }

  const PLATFORM_NAMES = {
    instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', telegram: 'Telegram',
    twitter: 'Twitter/X', facebook: 'Facebook', quora: 'Quora', linkedin: 'LinkedIn',
    threads: 'Threads', reddit: 'Reddit', snapchat: 'Snapchat', likee: 'Likee',
    github: 'GitHub', max: 'Max.ru',
    discord: 'Discord', kick: 'Kick', twitch: 'Twitch', spotify: 'Spotify', bluesky: 'Bluesky', rutube: 'Rutube', soundcloud: 'SoundCloud', aparat: 'Aparat', jaco: 'Jaco', vkontakte: 'VKontakte', mastodon: 'Mastodon', wechat: 'WeChat', pinterest: 'Pinterest', dlive: 'DLive', dribbble: 'Dribbble', tumblr: 'Tumblr',
    vimeo: 'Vimeo', boomplay: 'Boomplay', odnoklassniki: 'OK', dzen: 'Dzen', snackvideo: 'SnackVideo', kwai: 'Kwai', lemon8: 'Lemon8', mixcloud: 'Mixcloud', reverbnation: 'ReverbNation', datpiff: 'DatPiff', shedevrum: 'Shedevrum', shazam: 'Shazam', coub: 'Coub',
    audius: 'Audius', bandcamp: 'Bandcamp', rumble: 'Rumble', bilibili: 'Bilibili', niconico: 'niconico', clapper: 'Clapper', artstation: 'ArtStation' // 18.10.2026, phase 4
  };

  // PREMIUM_PLATFORMS_LIST is the shared single source of truth defined in components/platforms.js
  const PREMIUM_PLATFORMS = ((typeof PREMIUM_PLATFORMS_LIST !== 'undefined') ? PREMIUM_PLATFORMS_LIST : ['google_maps', 'trustpilot'])
    .concat(typeof CLOSED_PLATFORMS_LIST !== 'undefined' ? CLOSED_PLATFORMS_LIST : []); // and the networks whose tasks are switched off
  const platforms = Object.keys(PLATFORM_ICONS)
    .filter(key => !PREMIUM_PLATFORMS.includes(key))
    .map(key => ({
    name: PLATFORM_NAMES[key] || key,
    key,
    color: PLATFORM_COLORS[key] || '#888',
    icon: PLATFORM_ICONS[key]
  }));

  const platformBgColors = {};
  platforms.forEach(p => {
    const hex = p.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    platformBgColors[p.key] = `rgba(${r},${g},${b},0.1)`;
  });

  const refLink = `${window.location.origin}/?ref=${u.ref_code || ''}`;

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('dashboard')}
    <main class="main-content">
      ${renderSuspiciousBanner()}
      <div class="d6-topbar">
        ${renderHamburger()}
        <div class="d6-topbar-title">${t('dash_welcome')}, <strong>${escHtml(u.username || 'User')}</strong>${u.trusted ? ` <span class="trust-badge-verified" title="${t('premium_badge_trusted') || 'Trusted'}">&#10003;</span>` : ''}${streakDays > 0 ? ` <span class="d6-streak">&#128293; ${streakDays} ${I18N.lang === 'ru' ? (streakDays === 1 ? 'день' : streakDays < 5 ? 'дня' : 'дней') : (streakDays === 1 ? 'day' : 'days')}</span>` : ''}</div>
        <div class="d6-topbar-actions">
          <div class="d6-topbar-btn" onclick="Router.navigate('/my-tasks')">
            <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>
            ${I18N.lang === 'ru' ? 'История' : 'History'}
          </div>
        </div>
      </div>

      <div class="page-content d6-content">

        ${!u.email_verified ? `
        <div class="dash-verify-banner" id="verifyBanner">
          <div class="dash-verify-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="dash-verify-text">
            <strong>${t('dash_verify_title')}</strong>
            <span>${t('dash_verify_text')}</span>
          </div>
          <button class="btn btn-sm btn-accent" id="resendVerifyBtn">Resend Email</button>
        </div>` : ''}

        <!-- Compact Balance -->
        <div class="d6-balance">
          <div class="d6-balance-top">
            <div class="d6-balance-main">
              <div class="d6-balance-label">${t('dash_balance')}</div>
              <div class="d6-balance-amount">$${(u.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div class="d6-stats">
              <div class="d6-stat">
                <span class="d6-stat-icon d6-si-green"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2l3 4H2l3-4z" fill="#22c55e"/></svg></span>
                <span class="d6-stat-val" style="color:#22c55e">$${stats.earned}</span>
                <span class="d6-stat-lbl">${t('wallet_earned')}</span>
              </div>
              <div class="d6-stat">
                <span class="d6-stat-icon d6-si-yellow"><svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="#fbbf24" stroke-width="1.2"/><path d="M5 3v2l1.2 1.2" stroke="#fbbf24" stroke-width="1" stroke-linecap="round"/></svg></span>
                <span class="d6-stat-val" style="color:#fbbf24">${stats.pendingReview}</span>
                <span class="d6-stat-lbl">${t('dash_pending_review')}</span>
              </div>
              <div class="d6-stat">
                <span class="d6-stat-icon d6-si-blue"><svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#60a5fa" stroke-width="1.2" stroke-linecap="round"/></svg></span>
                <span class="d6-stat-val" style="color:#60a5fa">${stats.completed}</span>
                <span class="d6-stat-lbl">${t('dash_tasks_completed')}</span>
              </div>
              <div class="d6-stat">
                <span class="d6-stat-icon d6-si-purple"><svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" fill="none" stroke="#a78bfa" stroke-width="1.2"/><path d="M5 1v4h4" stroke="#a78bfa" stroke-width="1" stroke-linecap="round"/></svg></span>
                <span class="d6-stat-val" style="color:#a78bfa">${approvalRate}%</span>
                <span class="d6-stat-lbl">${I18N.lang === 'ru' ? 'Принято' : 'Approved'}</span>
              </div>
            </div>
          </div>
          <div class="d6-balance-bottom">
            <div class="d6-progress">
              <div class="d6-progress-bar"><div class="d6-progress-fill" style="width:${Math.min(100, (stats.completed / 500) * 100)}%"></div></div>
              <span class="d6-progress-text">${stats.completed}/500</span>
            </div>
            <button class="d6-cta" onclick="Router.navigate('/tasks')">
              ${I18N.lang === 'ru' ? 'Начать зарабатывать' : 'Start earning'} <span class="d6-cta-badge">${totalTasks}</span> &rarr;
            </button>
          </div>
        </div>

        <!-- Platform Chips -->
        <div class="d6-section-row">
          <div class="d6-section-title">${t('dash_platforms')}</div>
          <div class="d6-section-link" onclick="Router.navigate('/tasks')">${I18N.lang === 'ru' ? 'Все' : 'All'} &rarr;</div>
        </div>
        <div class="d6-chips">
          ${_premiumVisible ? `<div class="d6-chip d6-chip-premium" onclick="Router.navigate('/premium')"><span class="d6-chip-dot d6-chip-dot-premium">💠</span>Premium tasks<span class="d6-chip-count">${_premiumCount}</span></div>` : ''}
          ${platforms.map(p => {
            const count = stats.platformCounts[p.key] || 0;
            const bg = p.key === 'instagram' ? 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#bc1888,#8a3ab9)' : p.color;
            return `<div class="d6-chip" onclick="Router.navigate('/tasks')"><span class="d6-chip-dot" style="background:${bg}"></span>${p.name}<span class="d6-chip-count">${count}</span></div>`;
          }).join('')}
        </div>

        <!-- Chart + Recent Tasks -->
        <div class="d6-two-col">
          <div class="d6-card">
            <div class="d6-card-head">
              <span class="d6-card-title">${t('dash_earnings_chart')}</span>
              <span class="d6-card-badge">${I18N.lang === 'ru' ? '7 дн' : '7 days'}</span>
            </div>
            <div class="d6-chart-area" id="dashChart"></div>
          </div>
          <div class="d6-card">
            <div class="d6-card-title" style="margin-bottom:10px">${I18N.lang === 'ru' ? 'Последние задания' : 'Recent tasks'}</div>
            ${recentTasks.length > 0 ? recentTasks.map(task => {
              const pIcon = PLATFORM_ICONS[task.platform] || '';
              const bgColor = platformBgColors[task.platform] || 'rgba(255,255,255,0.05)';
              const statusCls = task.status === 'approved' ? 'd6-ts-done' : task.status === 'pending_review' ? 'd6-ts-review' : 'd6-ts-other';
              const statusTxt = task.status === 'approved' ? '&#10003;' : task.status === 'pending_review' ? '&#9203;' : '...';
              const reward = task.worker_reward || 0;
              const ago = _timeAgo(task.started_at || task.completed_at || '');
              return `
            <div class="d6-task">
              <div class="d6-task-icon" style="background:${bgColor};color:${PLATFORM_COLORS[task.platform] || '#fff'}">${pIcon}</div>
              <div class="d6-task-info"><div class="d6-task-name">${escHtml(task.label || task.action || 'Task')}</div><div class="d6-task-time">${ago}</div></div>
              <div class="d6-task-earn">+$${reward.toFixed(3)}</div>
              <div class="d6-task-status ${statusCls}">${statusTxt}</div>
            </div>`;
            }).join('') : `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">${I18N.lang === 'ru' ? 'Нет заданий' : 'No tasks yet'}</div>`}
          </div>
        </div>

        <!-- News Accordion -->
        ${newsItems.length > 0 ? `
        <div class="d6-section-row" style="margin-top:4px">
          <div class="d6-section-title">${t('dash_news_title')}</div>
        </div>
        <div class="d6-news">
          ${newsItems.map((n, idx) => {
            const typeColor = n.type === 'update' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : n.type === 'promo' ? '#22c55e' : '#60a5fa';
            const ago = _timeAgo(n.created_at);
            const userReaction = n.user_reaction || null;
            const likes = n.likes || 0;
            const dislikes = n.dislikes || 0;
            const hidden = idx >= 3 ? ' d6-news-hidden' : '';
            return `
            <div class="d6-news-item${hidden}">
              <div class="d6-news-head" onclick="this.parentElement.classList.toggle('d6-news-open')">
                <span class="d6-news-dot" style="background:${typeColor}"></span>
                <span class="d6-news-title">${escHtml(n.title)}</span>
                <span class="d6-news-time">${ago}</span>
                <svg class="d6-news-chevron" width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
              </div>
              <div class="d6-news-body">
                <div class="d6-news-text">${n.body_html ? n.body_html : escHtml(n.body)}</div>
                <div class="d6-news-reactions">
                  <button class="dash-react-btn${userReaction === 'like' ? ' active' : ''}" data-news-id="${n.id}" data-reaction="like">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
                    <span class="react-count">${likes}</span>
                  </button>
                  <button class="dash-react-btn${userReaction === 'dislike' ? ' active' : ''}" data-news-id="${n.id}" data-reaction="dislike">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
                    <span class="react-count">${dislikes}</span>
                  </button>
                </div>
              </div>
            </div>`;
          }).join('')}
          ${newsItems.length > 3 ? `<div class="d6-news-more" id="newsShowMore">${I18N.lang === 'ru' ? 'Показать ещё' : 'Show more'} (${newsItems.length - 3})</div>` : ''}
        </div>` : ''}

        <!-- Referral Slim Bar -->
        <div class="d6-ref">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="d6-ref-text">${I18N.lang === 'ru' ? 'Приглашай друзей' : 'Invite friends'} — <strong>10%</strong> ${I18N.lang === 'ru' ? 'от заработка навсегда' : 'of earnings forever'}</span>
          <span class="d6-ref-code">${escHtml(u.ref_code || '---')}</span>
          <button class="d6-ref-copy" id="copyRefLink">${I18N.lang === 'ru' ? 'Копировать' : 'Copy'}</button>
        </div>

      </div>
    </main>
  </div>`;

  // --- Chart rendering ---
  requestAnimationFrame(() => {
    const container = document.getElementById('dashChart');
    if (!container || chartData.length === 0) {
      if (container) container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px 0;font-size:12px">' + t('dash_no_activity') + '</div>';
      return;
    }

    const maxEarned = Math.max(...chartData.map(d => d.earned), 0.01);
    const W = container.clientWidth || 360;
    const H = 80;
    const padT = 8, padB = 0;
    const chartH = H - padT - padB;
    const step = W / (chartData.length - 1 || 1);

    const points = chartData.map((d, i) => ({
      x: i * step,
      y: padT + chartH - (d.earned / maxEarned) * chartH,
      earned: d.earned, tasks: d.tasks, day: d.day
    }));

    let linePath = '';
    points.forEach((p, i) => {
      if (i === 0) { linePath += `M${p.x.toFixed(1)},${p.y.toFixed(1)}`; }
      else {
        const prev = points[i - 1];
        const cpx1 = prev.x + (p.x - prev.x) * 0.4;
        const cpx2 = p.x - (p.x - prev.x) * 0.4;
        linePath += ` C${cpx1.toFixed(1)},${prev.y.toFixed(1)} ${cpx2.toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }
    });
    const areaPath = linePath + ` L${points[points.length - 1].x.toFixed(1)},${H} L${points[0].x.toFixed(1)},${H} Z`;

    const gridLines = [0.25, 0.5, 0.75].map(frac => {
      const y = padT + chartH * (1 - frac);
      return `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="rgba(255,106,26,0.06)" stroke-width="1"/>`;
    }).join('');

    const dayNames = I18N.lang === 'ru'
      ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabelsHtml = chartData.map((d, i) => {
      const dt = new Date(d.day + 'T00:00:00');
      const isLast = i === chartData.length - 1;
      return `<span style="font-size:10px;color:${isLast ? 'var(--accent)' : 'var(--text-muted)'}">${dayNames[dt.getDay()]}</span>`;
    }).join('');

    const dots = points.map((p, i) => {
      const isLast = i === points.length - 1;
      return isLast
        ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="var(--accent,#ff6a1a)"/><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6" fill="rgba(255,106,26,0.18)"/>`
        : `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="var(--accent,#ff6a1a)" opacity="0.35"/>`;
    }).join('');

    const hitAreas = points.map(p =>
      `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="16" fill="transparent" class="d6-chart-hit" data-earned="${p.earned}" data-tasks="${p.tasks}" data-day="${p.day}"/>`
    ).join('');

    container.innerHTML = `
      <div style="position:relative">
        <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:${H}px" preserveAspectRatio="none">
          <defs><linearGradient id="d6cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent,#ff6a1a)" stop-opacity="0.25"/><stop offset="100%" stop-color="var(--accent,#ff6a1a)" stop-opacity="0"/></linearGradient></defs>
          ${gridLines}
          <path d="${areaPath}" fill="url(#d6cg)"/>
          <path d="${linePath}" fill="none" stroke="var(--accent,#ff6a1a)" stroke-width="2" stroke-linecap="round"/>
          ${dots}
          ${hitAreas}
        </svg>
        <div id="d6Tooltip" style="display:none;position:absolute;top:0;left:0;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:5px 9px;font-size:11px;box-shadow:0 4px 12px rgba(0,0,0,0.12);pointer-events:none;white-space:nowrap;z-index:10"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px">${dayLabelsHtml}</div>`;

    // Tooltip
    const tooltip = document.getElementById('d6Tooltip');
    const svg = container.querySelector('svg');
    container.querySelectorAll('.d6-chart-hit').forEach(hit => {
      hit.addEventListener('mouseenter', () => {
        const earned = parseFloat(hit.dataset.earned);
        const tasks = parseInt(hit.dataset.tasks);
        const dt = new Date(hit.dataset.day + 'T00:00:00');
        const dayLabel = dt.toLocaleDateString(I18N.lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
        tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:1px">${dayLabel}</div><div style="color:var(--accent)">$${earned.toFixed(4).replace(/0+$/,'')}</div><div style="color:var(--text-muted)">${tasks} ${I18N.lang === 'ru' ? 'заданий' : 'tasks'}</div>`;
        const rect = svg.getBoundingClientRect();
        const cx = parseFloat(hit.getAttribute('cx'));
        const scaleX = rect.width / W;
        let left = cx * scaleX - 50;
        if (left < 0) left = 0;
        if (left + 100 > rect.width) left = rect.width - 100;
        tooltip.style.left = left + 'px';
        tooltip.style.top = '-55px';
        tooltip.style.display = 'block';
      });
      hit.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
    });
  });

  // --- Time ago helper ---
  function _timeAgo(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr.includes('Z') ? dateStr : dateStr + 'Z');
    const diffMs = now - d;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return t('time_just_now') || 'just now';
    if (mins < 60) return mins + (t('time_min_ago') || 'm ago');
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + (t('time_hr_ago') || 'h ago');
    const days = Math.floor(hrs / 24);
    if (days < 30) return days + (t('time_day_ago') || 'd ago');
    return d.toLocaleDateString();
  }

  // --- Resend verification email ---
  const resendBtn = document.getElementById('resendVerifyBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      resendBtn.disabled = true;
      resendBtn.textContent = '...';
      try {
        await API.request('POST', '/auth/resend-verification');
        showToast('Verification email sent! Check your inbox.', 'success');
        resendBtn.textContent = 'Sent!';
      } catch (e) {
        showToast(e.message, 'error');
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Email';
      }
    });

    const verifyPoll = setInterval(async () => {
      try {
        const me = await API.request('GET', '/auth/me');
        if (me && me.email_verified) {
          clearInterval(verifyPoll);
          const banner = document.getElementById('verifyBanner');
          if (banner) {
            banner.style.transition = 'opacity 0.5s, max-height 0.5s';
            banner.style.opacity = '0';
            banner.style.maxHeight = '0';
            banner.style.overflow = 'hidden';
            banner.style.marginBottom = '0';
            banner.style.padding = '0';
            setTimeout(() => banner.remove(), 600);
          }
          if (API.user) API.user.email_verified = 1;
          try {
            const cached = JSON.parse(localStorage.getItem('pr-user-cache-v1') || '{}');
            if (cached && cached.id) {
              cached.email_verified = 1;
              localStorage.setItem('pr-user-cache-v1', JSON.stringify(cached));
            }
          } catch (_) {}
        }
      } catch(e) {}
    }, 30000); // poll every 30s instead of 5s — verification is rare event, 6× less /auth/me load
  }

  // --- News reactions ---
  document.querySelectorAll('.dash-react-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newsId = btn.dataset.newsId;
      const reaction = btn.dataset.reaction;
      try {
        const res = await fetch(`/api/public/news/${newsId}/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ reaction })
        });
        const data = await res.json();
        if (data.ok) {
          const parent = btn.closest('.d6-news-reactions');
          parent.querySelectorAll('.dash-react-btn').forEach(b => {
            const r = b.dataset.reaction;
            const isActive = data.user_reaction === r;
            const color = r === 'like' ? '#22c55e' : '#ef4444';
            b.style.borderColor = isActive ? color : 'var(--border)';
            b.style.color = isActive ? color : 'var(--text-muted)';
            b.querySelector('.react-count').textContent = r === 'like' ? data.likes : data.dislikes;
          });
        }
      } catch (e) { /* ignore */ }
    });
  });

  // --- News show more ---
  const showMoreBtn = document.getElementById('newsShowMore');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      document.querySelectorAll('.d6-news-hidden').forEach(el => el.classList.remove('d6-news-hidden'));
      showMoreBtn.remove();
    });
  }

  // --- Copy referral link ---
  const copyRefBtn = document.getElementById('copyRefLink');
  if (copyRefBtn) {
    copyRefBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('${refLink}').then(() => {
        showToast(I18N.lang === 'ru' ? 'Ссылка скопирована!' : 'Link copied!', 'success');
      }).catch(() => {
        showToast('Failed to copy', 'error');
      });
    });
  }
});
