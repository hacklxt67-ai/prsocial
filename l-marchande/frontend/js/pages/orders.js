Router.register('orders', async (app) => {
  // Modern advertiser dashboard (2026-05-10):
  // - 7d/30d stats widget at top (cached server-side 60s, fast)
  // - Orders list defaults to last 30 days; "show older" toggles ?all=1
  // - Real status is 'in_progress' (legacy 'active' alias kept for old rows)

  // Period state — persisted on the page during the session
  if (typeof window._advPeriod === 'undefined') window._advPeriod = '7d';

  let orders = [];
  let stats = null;
  let showAll = false;

  async function fetchAll() {
    const [ordersRes, statsRes] = await Promise.all([
      fetch('/api/tasks/orders/my' + (showAll ? '?all=1' : ''), { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({})),
      fetch('/api/tasks/orders/stats?period=' + window._advPeriod, { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({})),
    ]);
    orders = ordersRes.orders || [];
    stats = statsRes.ok ? statsRes : null;
  }

  await fetchAll();

  const statusLabel = {
    in_progress: t('orders_status_active') || 'Active',
    active: t('orders_status_active') || 'Active',
    paused: t('orders_status_paused') || 'Paused',
    completed: t('orders_status_completed') || 'Completed',
    cancelled: t('orders_status_cancelled') || 'Cancelled',
    error: t('orders_status_error') || 'Error',
  };

  const fmtMoney = (v) => v < 1 ? '$' + v.toFixed(4) : '$' + v.toFixed(2);

  function renderStats() {
    if (!stats) return '';
    const w = stats.window || {};
    const lt = stats.lifetime || {};
    const periodKey = stats.period || '7d';

    // Build mini chart bars from daily array
    const daily = stats.daily || [];
    const maxGross = Math.max(0, ...daily.map(d => d.gross));
    const bars = daily.map((d, i) => {
      const h = maxGross > 0 ? Math.max(2, Math.round(d.gross / maxGross * 100)) : 2;
      const dayLabel = d.day.slice(5); // MM-DD
      return `<div class="adv-bar" style="height:${h}%" title="${d.day}: ${fmtMoney(d.gross)}">
        <span class="adv-bar-tip">${fmtMoney(d.gross)}</span>
      </div>`;
    }).join('');

    return `
    <div class="adv-stats">
      <div class="adv-stats-head">
        <div class="adv-stats-title">
          <h2>${t('orders_stats_title') || 'Spend overview'}</h2>
          <p>${t('orders_stats_subtitle') || 'Your campaign activity for the selected period'}</p>
        </div>
        <div class="adv-period-tabs">
          <button class="${periodKey === '7d' ? 'active' : ''}" data-period="7d">${t('orders_stats_7d') || '7 days'}</button>
          <button class="${periodKey === '30d' ? 'active' : ''}" data-period="30d">${t('orders_stats_30d') || '30 days'}</button>
        </div>
      </div>

      <div class="adv-kpis">
        <div class="adv-kpi adv-kpi-spend">
          <div class="adv-kpi-label">${t('orders_stats_spent') || 'Spent in period'}</div>
          <div class="adv-kpi-value">${fmtMoney(w.spent || 0)}</div>
          <div class="adv-kpi-sub">${t('orders_stats_committed') || 'Committed'}: ${fmtMoney(w.gross || 0)}</div>
        </div>
        <div class="adv-kpi">
          <div class="adv-kpi-label">${t('orders_stats_orders') || 'Orders'}</div>
          <div class="adv-kpi-value">${w.total || 0}</div>
          <div class="adv-kpi-sub">${(w.active || 0)} ${t('orders_status_active_lc') || 'active'} · ${(w.completed || 0)} ${t('orders_status_completed_lc') || 'done'}</div>
        </div>
        <div class="adv-kpi">
          <div class="adv-kpi-label">${t('orders_stats_completion') || 'Completion'}</div>
          <div class="adv-kpi-value">${w.completion_rate || 0}%</div>
          <div class="adv-kpi-sub">${(w.cancelled || 0)} ${t('orders_status_cancelled_lc') || 'cancelled'}</div>
        </div>
        <div class="adv-kpi adv-kpi-lifetime">
          <div class="adv-kpi-label">${t('orders_stats_lifetime') || 'Lifetime'}</div>
          <div class="adv-kpi-value">${fmtMoney(lt.spent || 0)}</div>
          <div class="adv-kpi-sub">${lt.total || 0} ${t('orders_stats_total') || 'orders total'}</div>
        </div>
      </div>

      <div class="adv-chart">
        <div class="adv-chart-bars">${bars || `<div class="adv-chart-empty">${t('orders_stats_no_data') || 'No data for this period'}</div>`}</div>
        <div class="adv-chart-labels">
          ${daily.map(d => `<span>${d.day.slice(8)}</span>`).join('')}
        </div>
      </div>
    </div>
    `;
  }

  function renderOrdersList() {
    if (!orders.length) {
      return `
      <div class="adv-empty">
        <div class="adv-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <h3>${t('orders_no_orders') || 'No orders yet'}</h3>
        <p>${t('orders_no_orders_hint') || 'Create your first order to start promoting'}</p>
        <button class="adv-btn adv-btn-primary" onclick="Router.navigate('/create-order')" style="margin-top:14px">
          ${t('orders_create_first') || 'Create first order'}
        </button>
      </div>`;
    }

    return `
      <div class="adv-list-head">
        <h2>${t('orders_list_title') || 'Your orders'}</h2>
        <button class="adv-btn adv-btn-primary" onclick="Router.navigate('/create-order')">
          + ${t('orders_new') || 'New order'}
        </button>
      </div>
      <div class="adv-list">
        ${(window._lastOrdersList = orders, orders).map(o => {
          const pct = o.total_count > 0 ? Math.round(o.completed_count / o.total_count * 100) : 0;
          const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[o.platform]) || '#ea580c';
          const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[o.platform]) || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
          const isCancellable = (o.status === 'active' || o.status === 'in_progress' || o.status === 'paused');
          const bd = o.breakdown || { in_progress: 0, pending_review: 0, approved: 0, rejected: 0, link_dead: 0, cancelled: 0 };
          const hasPending = bd.pending_review > 0;
          const rejectedTotal = (bd.rejected || 0) + (bd.link_dead || 0);
          return `
        <div class="adv-order" data-order-id="${o.id}">
          <div class="adv-order-head">
            <div class="adv-order-icon" style="color:${color};background:${color}1a">${icon}</div>
            <div class="adv-order-info">
              <div class="adv-order-label">${escHtml(o.label || (o.platform + ' ' + o.action))}</div>
              <div class="adv-order-target">
                ${o.target_url ? `<a href="${escHtml(o.target_url)}" target="_blank" rel="noopener" class="target-link">${escHtml(o.target_username || o.target_url)}</a>` : '<span>—</span>'}
              </div>
            </div>
            <div class="adv-order-status adv-order-status-${o.status}">${statusLabel[o.status] || o.status}</div>
          </div>

          <div class="adv-breakdown">
            ${bd.approved > 0 ? `<span class="bd bd-approved" title="Approved">✓ ${bd.approved} done</span>` : ''}
            ${bd.pending_review > 0 ? `<span class="bd bd-pending" title="Awaiting AI/admin review">⏳ ${bd.pending_review} reviewing</span>` : ''}
            ${bd.in_progress > 0 ? `<span class="bd bd-active" title="Workers in progress">⚙ ${bd.in_progress} active</span>` : ''}
            ${rejectedTotal > 0 ? `<span class="bd bd-rejected" title="Rejected (link dead / wrong target)">✗ ${rejectedTotal} rejected</span>` : ''}
            ${bd.cancelled > 0 ? `<span class="bd bd-cancelled" title="Cancelled">⊘ ${bd.cancelled} cancelled</span>` : ''}
          </div>

          <div class="adv-order-foot">
            <div class="adv-foot-meta">
              <span class="adv-foot-progress">
                <span class="adv-mini-pb"><span class="adv-mini-pb-fill" style="width:${pct}%"></span></span>
                <strong>${o.completed_count}</strong><span class="muted">/${o.total_count}</span>
                <span class="muted">(${pct}%)</span>
              </span>
              <span class="muted adv-foot-sep">${fmtMoney(o.cost_per_task)} / task</span>
              <span class="muted adv-foot-sep">${fmtMoney(o.cost_per_task * o.total_count)} ${t('orders_total_cost_short') || 'total'}</span>
            </div>
            <div class="adv-foot-actions">
              <button class="adv-details-btn" data-details="${o.id}">${t('orders_details') || 'Details'}</button>
              ${o.status === 'completed'
                ? `<button class="adv-refill-btn" onclick="window.advRefillOpen(${o.id})" title="Order more actions for the same target">+ ${t('orders_refill') || 'Add more'}</button>`
                : ''}
              ${isCancellable
                ? (hasPending
                    ? `<button class="adv-cancel-btn locked" disabled title="${bd.pending_review} submission(s) still under review — wait for verdict before cancelling">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                         ${t('orders_cancel') || 'Cancel'}
                       </button>`
                    : `<button class="adv-cancel-btn" data-id="${o.id}">${t('orders_cancel') || 'Cancel'}</button>`)
                : ''
              }
            </div>
          </div>

          <div class="adv-details-panel" id="dp-${o.id}" style="display:none">
            <div class="adv-details-loading">Loading report...</div>
          </div>
        </div>`;
        }).join('')}
      </div>
      <div class="adv-list-footer">
        <button class="adv-btn adv-btn-ghost" id="advToggleAll">
          ${showAll ? (t('orders_show_recent') || 'Show last 30 days only') : (t('orders_show_older') || 'Show older orders too')}
        </button>
      </div>
    `;
  }

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('orders')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text" style="flex:1">
          <h1>${t('orders_title') || 'My Orders'}</h1>
          <p>${t('orders_subtitle') || 'Track your promotion campaigns'}</p>
        </div>
      </div>
      <div class="page-content">
        ${renderStyles()}
        <div id="advRoot"></div>
      </div>
    </main>
  </div>`;

  function renderStyles() {
    return `
    <style id="advStatsStyles">
      .adv-stats{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:16px;padding:18px;margin-bottom:18px;box-shadow:0 2px 6px rgba(0,0,0,0.03)}
      .adv-stats-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;gap:12px;flex-wrap:wrap}
      .adv-stats-title h2{margin:0;font-size:18px;font-weight:700}
      .adv-stats-title p{margin:2px 0 0;font-size:12px;color:var(--text-secondary,#6b7280)}
      .adv-period-tabs{display:inline-flex;background:var(--bg-secondary,#f3f4f6);border-radius:10px;padding:3px;gap:2px}
      .adv-period-tabs button{padding:6px 14px;border:0;background:transparent;border-radius:7px;font-size:12px;font-weight:600;color:var(--text-secondary,#6b7280);cursor:pointer;transition:all .15s}
      .adv-period-tabs button:hover{color:var(--text-primary)}
      .adv-period-tabs button.active{background:var(--card-bg,#fff);color:#ea580c;box-shadow:0 1px 4px rgba(0,0,0,0.08)}
      .adv-kpis{display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:12px;margin-bottom:16px}
      .adv-kpi{background:var(--bg-secondary,#f8fafc);border:1px solid var(--border);border-radius:12px;padding:14px}
      .adv-kpi-spend{background:linear-gradient(135deg,rgba(234,88,12,0.08),rgba(249,115,22,0.04));border-color:rgba(234,88,12,0.18)}
      .adv-kpi-spend .adv-kpi-value{color:#ea580c}
      .adv-kpi-lifetime{background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.03));border-color:rgba(99,102,241,0.18)}
      .adv-kpi-lifetime .adv-kpi-value{color:#6366f1}
      .adv-kpi-label{font-size:11px;color:var(--text-secondary,#6b7280);text-transform:uppercase;letter-spacing:0.04em;font-weight:600}
      .adv-kpi-value{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums;margin:4px 0 2px;color:var(--text-primary)}
      .adv-kpi-sub{font-size:11px;color:var(--text-secondary,#6b7280)}
      .adv-chart{padding-top:8px;border-top:1px solid var(--border)}
      .adv-chart-bars{display:flex;align-items:flex-end;gap:4px;height:80px;padding:6px 0;justify-content:space-between}
      .adv-bar{flex:1;background:linear-gradient(180deg,#ea580c,#f97316);border-radius:3px 3px 0 0;min-height:2px;position:relative;transition:opacity .15s}
      .adv-bar:hover{opacity:0.8}
      .adv-bar:hover .adv-bar-tip{display:block}
      .adv-bar-tip{display:none;position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:3px 8px;border-radius:6px;font-size:10px;white-space:nowrap;z-index:5}
      .adv-chart-empty{flex:1;text-align:center;color:var(--text-secondary,#6b7280);font-size:12px;padding:24px}
      .adv-chart-labels{display:flex;justify-content:space-between;gap:4px;margin-top:6px;font-size:10px;color:var(--text-secondary,#9ca3af);font-variant-numeric:tabular-nums}
      .adv-chart-labels span{flex:1;text-align:center}

      /* List */
      .adv-list-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
      .adv-list-head h2{margin:0;font-size:16px;font-weight:700}
      .adv-list{display:flex;flex-direction:column;gap:10px}
      .adv-order{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:12px;padding:16px;transition:border-color .15s, box-shadow .15s}
      .adv-order:hover{border-color:rgba(234,88,12,0.4);box-shadow:0 2px 12px rgba(234,88,12,0.06)}
      .adv-order-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
      .adv-order-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .adv-order-icon svg{width:20px;height:20px}
      .adv-order-info{flex:1;min-width:0}
      .adv-order-label{font-weight:600;font-size:14px;color:var(--text-primary);line-height:1.3}
      .adv-order-target{font-size:11.5px;color:var(--text-secondary,#6b7280);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:380px;margin-top:1px}
      .adv-order-status{padding:4px 12px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;flex-shrink:0}
      .adv-order-status-active,.adv-order-status-in_progress{background:rgba(34,197,94,0.12);color:#16a34a}
      .adv-order-status-completed{background:rgba(99,102,241,0.12);color:#6366f1}
      .adv-order-status-cancelled{background:rgba(156,163,175,0.18);color:#6b7280}
      .adv-order-status-paused{background:rgba(234,179,8,0.12);color:#a16207}
      .adv-order-status-error{background:rgba(239,68,68,0.12);color:#dc2626}
      .adv-order-bar{height:6px;background:var(--bg-secondary,#f3f4f6);border-radius:999px;overflow:hidden;margin-bottom:10px}
      .adv-order-bar-fill{height:100%;border-radius:999px;transition:width .3s}
      .adv-order-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;font-size:12px;margin-top:4px}
      .adv-order-foot .muted{color:var(--text-secondary,#6b7280)}
      .adv-foot-meta{display:inline-flex;flex-wrap:wrap;align-items:center;gap:12px;min-width:0;flex:1 1 auto}
      .adv-foot-actions{display:inline-flex;align-items:center;gap:8px;flex-shrink:0;margin-left:auto}
      .adv-cancel-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid var(--border);background:transparent;border-radius:7px;font-size:11.5px;color:var(--text-secondary,#6b7280);cursor:pointer;font-weight:600;transition:all .15s}
      .adv-cancel-btn:hover{border-color:#ef4444;color:#ef4444;background:rgba(239,68,68,0.04)}
      .adv-cancel-btn svg{width:11px;height:11px}
      .adv-cancel-btn.locked{opacity:0.7}
      @media (max-width:560px){
        .adv-order-foot{font-size:11.5px;gap:8px}
        .adv-foot-meta{gap:8px;width:100%}
        .adv-foot-actions{width:100%;justify-content:flex-end}
      }

      .adv-list-footer{margin-top:14px;text-align:center}
      .adv-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .15s}
      .adv-btn-primary{background:linear-gradient(135deg,#dc2626,#ea580c,#f97316);color:#fff;border-color:transparent;box-shadow:0 4px 10px rgba(234,88,12,0.22)}
      .adv-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(234,88,12,0.32)}
      .adv-btn-ghost{background:transparent;color:var(--text-secondary,#6b7280)}
      .adv-btn-ghost:hover{background:var(--bg-secondary,#f8fafc);color:var(--text-primary)}

      .adv-empty{text-align:center;padding:48px 24px;background:var(--card-bg,#fff);border:1px dashed var(--border);border-radius:14px}
      .adv-empty-icon{width:56px;height:56px;border-radius:50%;background:var(--bg-secondary,#f8fafc);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:var(--text-secondary,#9ca3af)}
      .adv-empty-icon svg{width:28px;height:28px}
      .adv-empty h3{margin:0 0 4px;font-size:16px}
      .adv-empty p{margin:0;font-size:13px;color:var(--text-secondary,#6b7280)}
      /* Status breakdown badges (compact, inline) */
      .adv-breakdown{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 4px;font-size:11px;font-weight:600}
      .bd{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;letter-spacing:0.02em;cursor:default}
      .bd-approved{background:rgba(34,197,94,0.10);color:#16a34a}
      .bd-pending{background:rgba(234,179,8,0.12);color:#a16207}
      .bd-active{background:rgba(59,130,246,0.10);color:#2563eb}
      .bd-rejected{background:rgba(239,68,68,0.10);color:#dc2626}
      .bd-cancelled{background:rgba(156,163,175,0.16);color:#6b7280}

      /* Details button + panel */
      .adv-details-btn{padding:5px 12px;border:1px solid var(--border);background:transparent;border-radius:7px;font-size:11.5px;color:var(--text-secondary,#6b7280);cursor:pointer;font-weight:600}
      .adv-details-btn:hover{border-color:var(--accent);color:var(--accent);background:rgba(234,88,12,0.04)}
      .adv-cancel-btn.locked{opacity:0.55;cursor:not-allowed;border-color:rgba(234,179,8,0.4);color:#a16207}
      .adv-cancel-btn.locked:hover{border-color:rgba(234,179,8,0.4);color:#a16207;background:transparent}
      .adv-cancel-btn.locked svg{opacity:0.85}

      .adv-details-panel{margin-top:10px;padding:14px;background:var(--bg-secondary,#f8fafc);border:1px solid var(--border);border-radius:10px;animation:fadeIn .15s ease}
      @keyframes fadeIn{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:none}}
      .adv-details-loading{text-align:center;color:var(--text-secondary,#6b7280);font-size:13px;padding:14px}
      .adv-details-empty{text-align:center;color:var(--text-secondary,#6b7280);padding:14px}
      .adv-details-empty p{margin:6px 0 0;font-size:11.5px}
      .adv-details-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)}
      .adv-details-head strong{font-size:13.5px}
      .adv-details-csv{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:7px;font-size:12px;font-weight:600;color:var(--text-primary);text-decoration:none;transition:all .15s}
      .adv-details-csv:hover{border-color:var(--accent);color:var(--accent);background:rgba(234,88,12,0.04)}
      .adv-details-bd{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--text-secondary,#6b7280);margin-bottom:10px}
      .adv-details-bd strong{color:var(--text-primary);font-variant-numeric:tabular-nums}
      .adv-details-table{width:100%;border-collapse:collapse;font-size:12px}
      .adv-details-table th{text-align:left;padding:6px 8px;background:var(--card-bg,#fff);border-bottom:1px solid var(--border);font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary,#6b7280)}
      .adv-details-table td{padding:6px 8px;border-top:1px solid var(--border)}
      .adv-details-table .num{font-variant-numeric:tabular-nums}
      .adv-details-more{margin-top:8px;text-align:center;font-size:11px;color:var(--text-secondary,#6b7280)}

            /* Report details — pagination + overlay (2026-05-10) */
      .adv-details-actions{display:inline-flex;gap:8px;align-items:center}
      .adv-rep-refresh{padding:6px 10px;font-size:14px}
      .adv-rep-table-wrap{position:relative;background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:8px;overflow:hidden}
      .adv-rep-table{margin:0}
      .adv-rep-table th{background:var(--bg-secondary,#f8fafc);padding:8px 10px}
      .adv-rep-table td{padding:8px 10px}
      .adv-rep-table tbody tr:hover{background:rgba(234,88,12,0.025)}
      .adv-rep-acc{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;font-weight:500}
      .adv-rep-cc{width:48px;text-align:center;text-transform:uppercase;font-variant-numeric:tabular-nums;font-size:11px}
      .adv-rep-time{width:130px;white-space:nowrap;font-size:11px}
      .adv-rep-pager{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;padding:8px 4px;font-size:12px;color:var(--text-secondary,#6b7280)}
      .adv-rep-pg-btn{padding:6px 14px;border:1px solid var(--border);background:var(--card-bg,#fff);border-radius:7px;font-size:11.5px;font-weight:600;color:var(--text-primary);cursor:pointer;transition:all .15s}
      .adv-rep-pg-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent);background:rgba(234,88,12,0.04)}
      .adv-rep-pg-btn:disabled{opacity:0.4;cursor:not-allowed}
      .adv-rep-pg-info{flex:1;text-align:center;font-variant-numeric:tabular-nums}
      .adv-rep-pg-info strong{color:var(--text-primary)}
      .adv-rep-pg-sep{margin:0 6px}
      .adv-details-overlay{position:absolute;inset:0;background:rgba(255,255,255,0.65);backdrop-filter:blur(1px);display:none;align-items:center;justify-content:center;z-index:2;border-radius:8px;animation:fadeIn .12s ease}
      .adv-details-overlay.on{display:flex}
      .adv-details-overlay-inner{padding:8px 14px;background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:7px;font-size:11.5px;color:var(--text-secondary,#6b7280);font-weight:600;box-shadow:0 2px 12px rgba(0,0,0,0.08)}

      /* Refill button + modal (2026-05-10) */
      .adv-refill-btn{padding:5px 12px;border:1px solid var(--accent);background:rgba(234,88,12,0.06);border-radius:7px;font-size:11.5px;color:var(--accent);cursor:pointer;font-weight:700;transition:all .15s}
      .adv-refill-btn:hover{background:var(--accent);color:#fff}
      .adv-refill-modal{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(2px);animation:fadeIn .15s ease}
      .adv-refill-inner{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:12px;padding:20px 22px;width:100%;max-width:460px;box-shadow:0 12px 40px rgba(0,0,0,0.18);animation:fadeIn .18s ease}
      .adv-refill-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:14px}
      .adv-refill-title{font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-secondary,#6b7280);font-weight:700}
      .adv-refill-sub{font-size:18px;font-weight:700;margin-top:2px;color:var(--text-primary)}
      .adv-refill-close{background:none;border:none;color:var(--text-secondary,#6b7280);font-size:24px;line-height:1;cursor:pointer;padding:0 4px}
      .adv-refill-close:hover{color:var(--text-primary)}
      .adv-refill-target{display:flex;justify-content:space-between;align-items:baseline;padding:10px 12px;background:var(--bg-secondary,#f8fafc);border-radius:8px;margin-bottom:14px;font-size:12.5px;gap:12px;flex-wrap:wrap}
      .adv-refill-target-label{font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary,#6b7280);font-weight:700}
      .adv-refill-target-value{font-weight:600;word-break:break-all;text-align:right}
      .adv-refill-target-value a{color:var(--accent);text-decoration:none}
      .adv-refill-target-value a:hover{text-decoration:underline}
      .adv-refill-qty-label{display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--text-primary)}
      .adv-refill-qty-label .muted{font-weight:400;color:var(--text-secondary,#6b7280)}
      .adv-refill-qty{width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:8px;font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;background:var(--surface-2,#fff);transition:border-color .15s}
      .adv-refill-qty:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(234,88,12,0.12)}
      .adv-refill-qty.error{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.12)}
      .adv-refill-summary{display:flex;justify-content:space-between;gap:14px;margin:14px 0;padding:12px 14px;background:linear-gradient(135deg,rgba(234,88,12,0.05),rgba(249,115,22,0.02));border:1px solid rgba(234,88,12,0.18);border-radius:8px}
      .adv-refill-summary>div{display:flex;flex-direction:column;gap:2px}
      .adv-refill-summary strong{font-size:15px;font-variant-numeric:tabular-nums;color:var(--text-primary)}
      .adv-refill-summary .muted{font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary,#6b7280);font-weight:600}
      .adv-refill-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
      .adv-refill-actions button{padding:9px 18px;font-size:13px;font-weight:600}
      .adv-refill-actions .adv-btn-primary[disabled]{opacity:0.55;cursor:not-allowed}

      /* Compact polish (2026-05-10) — remove full-width bar, inline mini-bar in foot */
      .adv-order{padding:11px 14px}
      .adv-order-head{margin-bottom:6px}
      .adv-foot-progress{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}
      .adv-foot-progress strong{font-size:13px}
      .adv-mini-pb{display:inline-block;width:80px;height:5px;background:var(--bg-secondary,#f3f4f6);border-radius:99px;overflow:hidden;vertical-align:middle}
      .adv-mini-pb-fill{display:block;height:100%;background:linear-gradient(90deg,#ea580c,#f97316);border-radius:99px;transition:width .3s ease}
      .adv-foot-sep{position:relative;padding-left:14px}
      .adv-foot-sep::before{content:'';position:absolute;left:6px;top:50%;width:1px;height:11px;background:var(--border);transform:translateY(-50%)}
      .adv-order-foot{gap:10px;flex-wrap:wrap;font-size:12px;line-height:1.5}
      /* Hide legacy full-width bar if some other render still emits it */
      .adv-order > .adv-order-bar{display:none}
      /* Compact polish — slightly tighter cards & more info density */
      .adv-order{padding:12px 14px}
      .adv-order-head{margin-bottom:8px}
      .adv-order-bar{height:5px;margin-bottom:6px}
      .adv-order-foot{font-size:11.5px}
      .target-link{color:var(--text-secondary,#6b7280);text-decoration:none;border-bottom:1px dashed transparent;transition:all .15s}
      .target-link:hover{color:var(--accent);border-bottom-color:var(--accent)}
    </style>
    `;
  }

  function renderAll() {
    const root = document.getElementById('advRoot');
    if (!root) return;
    root.innerHTML = renderStats() + renderOrdersList();
    wireEvents();
    // Pre-warm catalog so the first Refill click opens the modal instantly.
    // Fire-and-forget; cache lasts for the page lifetime.
    _loadCatalog();
  }

  // ---- Refill (+ Add more) for completed orders ----
  // Loads catalog once per session; matches order.task_type_id to a catalog row.
  // Refill always uses catalog_id (NOT raw task_type_id) so backend can validate
  // price + min/max from admin-controlled advertiser_catalog table.
  let _orderCatalog = null;
  let _catalogPromise = null;

  async function _loadCatalog() {
    if (_orderCatalog) return _orderCatalog;
    if (_catalogPromise) return _catalogPromise;
    _catalogPromise = fetch('/api/tasks/advertiser-catalog', { credentials: 'same-origin' })
      .then(r => r.json())
      .then(d => {
        _orderCatalog = (d.ok && d.items) ? d.items : [];
        return _orderCatalog;
      })
      .catch(() => { _orderCatalog = []; return _orderCatalog; });
    return _catalogPromise;
  }

  // Match by task_type_id (canonical) — catalog rows are 1:1 with task_types
  // for active items. If the service was disabled or removed, returns null and
  // the Refill button is hidden for that order.
  function _findCatalogForOrder(o) {
    if (!_orderCatalog || !o) return null;
    return _orderCatalog.find(c => c.task_type_id === o.task_type_id) || null;
  }

  window.advRefillOpen = async function(orderId) {
    const orders = (window._lastOrdersList || []);
    const o = orders.find(x => x.id === orderId);
    if (!o) return showToast('Order not found in current view', 'error');
    await _loadCatalog();
    const cat = _findCatalogForOrder(o);
    if (!cat) {
      return showToast('This service is no longer available — create a new order from catalog', 'warning');
    }

    // Default quantity = original count (sensible "do it again" expectation).
    const defaultQty = Math.max(cat.min_per_order, Math.min(cat.max_per_order, o.total_count || cat.min_per_order));

    let modal = document.getElementById('advRefillModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'advRefillModal';
    modal.className = 'adv-refill-modal';
    modal.innerHTML = `
      <div class="adv-refill-inner">
        <div class="adv-refill-head">
          <div>
            <div class="adv-refill-title">Refill order</div>
            <div class="adv-refill-sub">${escHtml(cat.label)}</div>
          </div>
          <button class="adv-refill-close" type="button" onclick="document.getElementById('advRefillModal').remove()">&times;</button>
        </div>
        <div class="adv-refill-target">
          <span class="adv-refill-target-label">Target</span>
          <span class="adv-refill-target-value">${o.target_url ? `<a href="${escHtml(o.target_url)}" target="_blank" rel="noopener">${escHtml(o.target_username || o.target_url)}</a>` : '—'}</span>
        </div>
        <label class="adv-refill-qty-label">
          Quantity <span class="muted">(min ${cat.min_per_order.toLocaleString()}, max ${cat.max_per_order.toLocaleString()})</span>
        </label>
        <input id="advRefillQty" type="number" class="adv-refill-qty" min="${cat.min_per_order}" max="${cat.max_per_order}" value="${defaultQty}" autocomplete="off">
        <div class="adv-refill-summary">
          <div><span class="muted">Per task</span><strong>${fmtMoney(cat.price_per_task)}</strong></div>
          <div><span class="muted">Total</span><strong id="advRefillTotal">${fmtMoney(cat.price_per_task * defaultQty)}</strong></div>
        </div>
        <div class="adv-refill-actions">
          <button class="adv-btn adv-btn-ghost" type="button" onclick="document.getElementById('advRefillModal').remove()">Cancel</button>
          <button id="advRefillSubmit" class="adv-btn adv-btn-primary" type="button">+ Add ${defaultQty.toLocaleString()} actions</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const qtyEl = modal.querySelector('#advRefillQty');
    const totalEl = modal.querySelector('#advRefillTotal');
    const submitEl = modal.querySelector('#advRefillSubmit');

    function recalc() {
      const n = parseInt(qtyEl.value, 10) || 0;
      const valid = n >= cat.min_per_order && n <= cat.max_per_order;
      totalEl.textContent = fmtMoney(cat.price_per_task * Math.max(0, n));
      submitEl.textContent = valid ? `+ Add ${n.toLocaleString()} actions` : `Min ${cat.min_per_order.toLocaleString()}, max ${cat.max_per_order.toLocaleString()}`;
      submitEl.disabled = !valid;
      qtyEl.classList.toggle('error', !valid && qtyEl.value !== '');
    }
    qtyEl.addEventListener('input', recalc);
    recalc();

    submitEl.addEventListener('click', async () => {
      const n = parseInt(qtyEl.value, 10);
      if (!n || n < cat.min_per_order || n > cat.max_per_order) return;
      submitEl.disabled = true;
      submitEl.textContent = '...';
      try {
        const res = await fetch('/api/tasks/orders', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ catalog_id: cat.id, target_url: o.target_url, total_count: n }),
        });
        const data = await res.json();
        if (data.ok) {
          showToast(`Added ${n.toLocaleString()} actions to ${cat.label}`, 'success');
          modal.remove();
          // Refresh balance + reload list
          try {
            const me = await fetch('/api/auth/me', { credentials: 'same-origin' }).then(r => r.json());
            if (me && me.user) API.user = me.user;
          } catch {}
          await fetchAll();
        } else {
          if (data.code === 'RATE_LIMIT' && data.retry_after_sec) {
            showToast(`Slow down — try again in ${data.retry_after_sec}s`, 'warning');
            submitEl.textContent = `Wait ${data.retry_after_sec}s`;
            return;
          }
          showToast(data.error || 'Refill failed', 'error');
          submitEl.disabled = false;
          recalc();
        }
      } catch (e) {
        showToast('Network error', 'error');
        submitEl.disabled = false;
        recalc();
      }
    });

    // Esc + click-outside close
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    const esc = (e) => { if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);

    setTimeout(() => qtyEl.focus(), 50);
  };

  // Per-order, per-page report cache. Page-flips reuse cached page if available.
  // Shape: _reportCache[orderId] = { 1: pageData, 2: pageData, ... }
  // _reportState[orderId] tracks UI state (current page, total pages) to render
  // pager controls before fresh data lands during loading.
  const _reportCache = {};
  const _reportState = {};
  const PAGE_SIZE = 25;

  async function toggleDetails(orderId) {
    const panel = document.getElementById('dp-' + orderId);
    if (!panel) return;
    if (panel.style.display !== 'none' && panel.dataset.loaded === '1') {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = 'block';
    if (panel.dataset.loaded === '1') return;

    panel.innerHTML = '<div class="adv-details-loading">Loading report...</div>';
    await loadReportPage(orderId, 1, panel);
    panel.dataset.loaded = '1';
  }

  // Fetch a page (or use cache), render the panel. Sets a loading overlay
  // on top of existing rows while the fetch is in flight so the user keeps
  // visual context instead of seeing the panel collapse.
  async function loadReportPage(orderId, page, panel) {
    const cacheBucket = _reportCache[orderId] || (_reportCache[orderId] = {});

    if (cacheBucket[page]) {
      _reportState[orderId] = { page, total_pages: cacheBucket[page].total_pages || 1 };
      panel.innerHTML = renderDetails(cacheBucket[page], orderId);
      bindPaginationHandlers(panel, orderId);
      return;
    }

    // Loading overlay — keep current table visible if present
    const overlay = panel.querySelector('.adv-details-overlay');
    if (overlay) overlay.classList.add('on');
    else if (!panel.querySelector('.adv-details-table')) {
      panel.innerHTML = '<div class="adv-details-loading">Loading report...</div>';
    } else {
      // Inject overlay over existing content
      const o = document.createElement('div');
      o.className = 'adv-details-overlay on';
      o.innerHTML = '<div class="adv-details-overlay-inner">Loading...</div>';
      panel.appendChild(o);
    }

    try {
      const url = `/api/tasks/orders/${orderId}/report?page=${page}&limit=${PAGE_SIZE}`;
      const r = await fetch(url, { credentials: 'same-origin' }).then(x => x.json());
      if (!r.ok) throw new Error(r.error || 'Failed');
      cacheBucket[page] = r;
      _reportState[orderId] = { page: r.page, total_pages: r.total_pages || 1 };
      panel.innerHTML = renderDetails(r, orderId);
      bindPaginationHandlers(panel, orderId);
    } catch (e) {
      panel.innerHTML = '<div class="adv-details-empty">Failed to load: ' + escHtml(e.message || String(e)) + '</div>';
    }
  }

  // Wire ← Prev / Next → / Refresh buttons inside the panel.
  function bindPaginationHandlers(panel, orderId) {
    panel.querySelectorAll('[data-rep-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        const action = btn.dataset.repAction;
        const state = _reportState[orderId] || { page: 1, total_pages: 1 };

        if (action === 'prev' && state.page > 1) {
          await loadReportPage(orderId, state.page - 1, panel);
        } else if (action === 'next' && state.page < state.total_pages) {
          await loadReportPage(orderId, state.page + 1, panel);
        } else if (action === 'refresh') {
          // Drop ALL cached pages for this order — totals/breakdown may have shifted
          delete _reportCache[orderId];
          await loadReportPage(orderId, state.page, panel);
        }
      });
    });
  }

  function renderDetails(r, orderId) {
    const order = r.order || {};
    const completions = r.completions || [];
    const bd = r.breakdown || {};
    const page = r.page || 1;
    const totalPages = r.total_pages || 1;
    const total = r.total || 0;
    const pageSize = r.page_size || PAGE_SIZE;

    if (!total) {
      return `
        <div class="adv-details-head">
          <div><strong>Order #${order.id}</strong> · ${escHtml(order.label || '')}</div>
          <button class="adv-details-csv" data-rep-action="refresh" type="button" title="Refresh">↻</button>
        </div>
        <div class="adv-details-empty">
          <strong>No completion history.</strong>
          <p>Older completion records are pruned after ~2 days. The summary above is always available.</p>
        </div>
      `;
    }

    const fmtT = (s) => s ? s.replace('T', ' ').slice(0, 16) : '—';
    const statusPill = (st) => {
      const cls = ({
        approved: 'bd-approved', pending_review: 'bd-pending', in_progress: 'bd-active',
        rejected: 'bd-rejected', link_dead: 'bd-rejected',
        cancelled: 'bd-cancelled', abandoned: 'bd-cancelled', skipped: 'bd-cancelled',
      })[st] || 'bd-cancelled';
      return `<span class="bd ${cls}">${st}</span>`;
    };

    const rows = completions.map(c => `
      <tr>
        <td>${statusPill(c.status)}</td>
        <td class="adv-rep-acc">${c.social_account ? escHtml(c.social_account) : '<span class="muted">—</span>'}</td>
        <td class="muted adv-rep-cc">${escHtml(c.country || '—')}</td>
        <td class="muted num adv-rep-time">${fmtT(c.reviewed_at || c.submitted_at || c.started_at)}</td>
      </tr>
    `).join('');

    const startIdx = (page - 1) * pageSize + 1;
    const endIdx = Math.min(page * pageSize, total);

    return `
      <div class="adv-details-head">
        <div>
          <strong>Order #${order.id}</strong> · ${escHtml(order.label || '')} · ${order.completed_count}/${order.total_count} done
        </div>
        <div class="adv-details-actions">
          <button class="adv-details-csv adv-rep-refresh" data-rep-action="refresh" type="button" title="Refresh data">↻</button>
          <a class="adv-details-csv" href="/api/tasks/orders/${order.id}/report.csv" download="order_${order.id}_report.csv">
            📄 CSV
          </a>
        </div>
      </div>
      <div class="adv-details-bd">
        <span>Start count: <strong>${(order.start_count === null || order.start_count === undefined) ? '—' : Number(order.start_count).toLocaleString()}</strong></span>
        <span><strong>${bd.approved || 0}</strong> approved</span>
        <span><strong>${bd.pending_review || 0}</strong> reviewing</span>
        <span><strong>${bd.in_progress || 0}</strong> active</span>
        <span><strong>${(bd.rejected || 0) + (bd.link_dead || 0)}</strong> rejected</span>
        <span><strong>${bd.cancelled || 0}</strong> cancelled</span>
      </div>
      <div class="adv-rep-table-wrap">
        <table class="adv-details-table adv-rep-table">
          <thead>
            <tr><th>Status</th><th>Account</th><th>Country</th><th>Time</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="adv-rep-pager">
        <button class="adv-rep-pg-btn" data-rep-action="prev" type="button" ${page <= 1 ? 'disabled' : ''}>← Prev</button>
        <span class="adv-rep-pg-info">
          <strong>${startIdx.toLocaleString()}–${endIdx.toLocaleString()}</strong>
          <span class="muted">of ${total.toLocaleString()}</span>
          <span class="muted adv-rep-pg-sep">·</span>
          <span class="muted">page ${page} of ${totalPages}</span>
        </span>
        <button class="adv-rep-pg-btn" data-rep-action="next" type="button" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
      </div>
    `;
  }

  function wireEvents() {
    document.querySelectorAll('[data-details]').forEach(btn => {
      btn.addEventListener('click', () => toggleDetails(btn.dataset.details));
    });

    document.querySelectorAll('[data-period]').forEach(btn => {
      btn.addEventListener('click', async () => {
        window._advPeriod = btn.dataset.period;
        await fetchAll();
        renderAll();
      });
    });

    const toggleBtn = document.getElementById('advToggleAll');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', async () => {
        showAll = !showAll;
        await fetchAll();
        renderAll();
      });
    }

    document.querySelectorAll('.adv-cancel-btn:not(.locked)').forEach(btn => {
      if (!btn.dataset.id) return;
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.id;
        if (!confirm(t('orders_cancel_confirm') || 'Cancel this order? Unspent funds will be refunded.')) return;
        btn.disabled = true; btn.textContent = '...';
        try {
          const res = await fetch(`/api/tasks/orders/${orderId}/cancel`, {
            method: 'POST', credentials: 'same-origin',
          });
          const data = await res.json();
          if (data.ok) {
            showToast((t('orders_cancel_success') || 'Cancelled — refunded {amount}').replace('{amount}', '$' + (data.refund || 0).toFixed(4)), 'success');
            if (API.user && typeof data.newBalance === 'number') API.user.balance = data.newBalance;
            await fetchAll(); renderAll();
          } else if (data.code === 'PENDING_REVIEW') {
            // Specific copy for the case where review is in progress
            showToast(data.error || ('Cannot cancel — ' + (data.pending_review || 0) + ' submission(s) still under review.'), 'warning');
            btn.disabled = false; btn.textContent = t('orders_cancel') || 'Cancel';
          } else {
            showToast(data.error || 'Error', 'error');
            btn.disabled = false; btn.textContent = t('orders_cancel') || 'Cancel';
          }
        } catch {
          showToast('Network error', 'error');
          btn.disabled = false; btn.textContent = t('orders_cancel') || 'Cancel';
        }
      });
    });
  }

  renderAll();
});

Router.register('create-order', async (app) => {
  // Catalog-cards flow (since 2026-05-10).
  // Backend: GET /api/tasks/advertiser-catalog (cached server-side 30s).
  // POST /api/tasks/orders accepts { catalog_id, target_url, total_count }.
  // Old task_type_id path remains as backwards-compat for legacy clients.
  const u = API.user || {};

  let items = [];
  try {
    const res = await fetch('/api/tasks/advertiser-catalog', { credentials: 'same-origin' });
    const data = await res.json();
    if (data.ok) items = data.items || [];
  } catch {}

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('create-order')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('orders_create_title') || 'New Order'}</h1>
          <p>${t('orders_create_subtitle') || 'Pick a service and place your order'}</p>
        </div>
      </div>
      <div class="page-content" id="coPage" style="padding-bottom:96px"></div>
    </main>
  </div>`;

  const root = document.getElementById('coPage');
  if (!items.length) {
    root.innerHTML = `
      <div style="background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:10px;padding:32px;text-align:center;color:var(--text-secondary,#6b7280)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="margin:0 auto 12px;display:block;opacity:0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h3 style="margin:0 0 6px;font-size:16px;color:var(--text-primary)">${t('orders_catalog_empty_title') || 'No services available yet'}</h3>
        <p style="margin:0;font-size:13px">${t('orders_catalog_empty_text') || 'Please check back later — services are being added.'}</p>
      </div>`;
    return;
  }

  // Group by platform for filter chips
  const platforms = [...new Set(items.map(it => it.platform))];
  let activePlatform = 'all';
  let selected = null;

  function fmtPrice(v) {
    if (v < 0.01) return '$' + v.toFixed(4);
    return '$' + v.toFixed(v < 1 ? 4 : 2);
  }

  function render() {
    const filtered = activePlatform === 'all' ? items : items.filter(it => it.platform === activePlatform);

    const styles = `
      <style id="coCatalogStyles">
        /* Filter chips */
        .co-filter-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;padding:12px;background:var(--bg-secondary,#fff7f0);border:1px solid var(--border);border-radius:14px}
        .co-chip{padding:8px 14px;border-radius:999px;border:1px solid var(--border);background:var(--card-bg,#fff);cursor:pointer;font-size:13px;font-weight:600;color:var(--text-secondary,#6b7280);text-transform:capitalize;transition:all .18s}
        .co-chip:hover{background:rgba(234,88,12,0.06);border-color:rgba(234,88,12,0.25);color:var(--text-primary)}
        .co-chip.active{background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(234,88,12,0.25)}

        /* Catalog cards */
        .co-cards{display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:14px;margin-bottom:14px}
        .co-card{background:var(--card-bg,#fff);border:1px solid var(--border);border-radius:14px;padding:16px;cursor:pointer;transition:all .18s;position:relative;overflow:hidden}
        .co-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ea580c,#f97316);opacity:0;transition:opacity .18s}
        .co-card:hover{border-color:rgba(234,88,12,0.35);transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,0.07)}
        .co-card:hover::before{opacity:1}
        .co-card.selected{border-color:#ea580c;background:linear-gradient(180deg,rgba(234,88,12,0.05),rgba(249,115,22,0.02));box-shadow:0 0 0 2px rgba(234,88,12,0.18),0 8px 22px rgba(234,88,12,0.10)}
        .co-card.selected::before{opacity:1}
        .co-card-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
        .co-card-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(234,88,12,0.08);color:#ea580c}
        .co-card-icon svg{width:22px;height:22px}
        .co-card-title{font-weight:700;font-size:14.5px;line-height:1.3;color:var(--text-primary)}
        .co-card-action{font-size:11px;color:var(--text-secondary,#6b7280);text-transform:capitalize;margin-top:2px;letter-spacing:0.02em}
        .co-card-desc{font-size:12.5px;color:var(--text-secondary,#6b7280);margin:6px 0 12px;line-height:1.45;min-height:34px}
        .co-card-foot{display:flex;justify-content:space-between;align-items:center;font-size:12px;border-top:1px solid var(--border);padding-top:12px}
        .co-card-price{font-weight:700;color:#ea580c;font-size:15px;font-variant-numeric:tabular-nums}
        .co-card-price .per{font-weight:500;font-size:11px;color:var(--text-secondary,#6b7280);margin-left:2px}
        .co-card-range{color:var(--text-secondary,#6b7280);font-variant-numeric:tabular-nums;font-weight:500}

        /* Detail form */
        .co-detail-form{margin-top:18px;background:var(--card-bg,#fff);border:1px solid rgba(234,88,12,0.4);border-radius:16px;padding:22px;box-shadow:0 6px 24px rgba(234,88,12,0.10)}
        .co-detail-head{display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)}
        .co-detail-head .co-card-icon{width:44px;height:44px;border-radius:11px}
        .co-detail-head h3{margin:0;font-size:17px;font-weight:700}
        .co-detail-head p{margin:2px 0 0;font-size:12px;color:var(--text-secondary,#6b7280);text-transform:capitalize}
        .co-detail-form label{display:block;font-size:12px;font-weight:700;color:var(--text-secondary,#6b7280);margin:14px 0 6px;letter-spacing:0.02em;text-transform:uppercase}
        .co-detail-form input{width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:10px;font-size:14px;background:var(--surface-2,#fff);transition:border-color .15s,box-shadow .15s}
        .co-detail-form input:focus{outline:none;border-color:#ea580c;box-shadow:0 0 0 3px rgba(234,88,12,0.12)}
        .co-detail-form input.error{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.15)}
        .co-range-hint{font-size:11px;color:var(--text-secondary,#9ca3af);margin-top:4px}
        .co-summary{margin-top:18px;padding:16px 18px;background:linear-gradient(180deg,rgba(234,88,12,0.04),rgba(249,115,22,0.02));border:1px solid rgba(234,88,12,0.18);border-radius:12px;font-size:13.5px}
        .co-summary-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;color:var(--text-primary)}
        .co-summary-row .label{color:var(--text-secondary,#6b7280)}
        .co-summary-row.total{font-weight:800;font-size:17px;border-top:1px solid rgba(234,88,12,0.25);margin-top:8px;padding-top:12px;color:#ea580c}
        .co-summary-row.balance{padding-top:8px;font-size:12.5px;color:var(--text-secondary,#6b7280)}
        .co-summary-row.balance.balance-low{color:#ef4444;font-weight:700}
        .co-detail-form .actions{display:flex;gap:10px;margin-top:20px}
        .co-detail-form .actions button{padding:13px 20px;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;border:0;transition:transform .12s, box-shadow .15s}
        .co-detail-form .actions button.cancel{flex:0 0 auto;min-width:100px;background:transparent;color:var(--text-secondary,#6b7280);border:1px solid var(--border)}
        .co-detail-form .actions button.cancel:hover{background:var(--bg-secondary,#f8fafc);color:var(--text-primary)}
        .co-detail-form .actions button.submit{flex:1;background:linear-gradient(135deg,#dc2626,#ea580c,#f97316);color:#fff;box-shadow:0 6px 16px rgba(234,88,12,0.28)}
        .co-detail-form .actions button.submit:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(234,88,12,0.38)}
        .co-detail-form .actions button.submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}

        /* Empty / no-results */
        .co-empty-state{padding:48px 24px;text-align:center;color:var(--text-secondary,#6b7280);background:var(--card-bg,#fff);border:1px dashed var(--border);border-radius:14px}
      </style>
    `;

    const filterChips = `
      <div class="co-filter-bar">
        <button class="co-chip ${activePlatform === 'all' ? 'active' : ''}" data-pf="all">${t('orders_filter_all') || 'All'}</button>
        ${platforms.map(p => `<button class="co-chip ${activePlatform === p ? 'active' : ''}" data-pf="${p}">${p}</button>`).join('')}
      </div>
    `;

    const cards = filtered.map(it => {
      const sel = (selected && selected.id === it.id);
      const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[it.platform])
        ? PLATFORM_ICONS[it.platform]
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
      return `
        <div class="co-card ${sel ? 'selected' : ''}" data-id="${it.id}">
          <div class="co-card-head">
            <div class="co-card-icon">${icon}</div>
            <div style="min-width:0;flex:1">
              <div class="co-card-title">${escHtml(it.label)}</div>
              <div class="co-card-action">${it.platform} · ${it.action}</div>
            </div>
          </div>
          ${it.description ? `<div class="co-card-desc">${escHtml(it.description)}</div>` : '<div class="co-card-desc"></div>'}
          <div class="co-card-foot">
            <span class="co-card-price">${fmtPrice(it.price_per_task)}<span class="per">/ ${t('orders_per_task') || 'task'}</span></span>
            <span class="co-card-range">${it.min_per_order.toLocaleString()}–${it.max_per_order.toLocaleString()}</span>
          </div>
        </div>
      `;
    }).join('');

    const detailForm = selected ? renderDetailForm() : '';

    root.innerHTML = styles + filterChips +
      (filtered.length ? `<div class="co-cards">${cards}</div>` : `<div class="co-empty-state">${t('orders_no_services_for_platform') || 'No services for this platform'}</div>`) +
      detailForm;

    wireEvents();
  }

  function renderDetailForm() {
    const it = selected;
    const balance = u.balance || 0;
    const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[it.platform])
      ? PLATFORM_ICONS[it.platform]
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    // Post-type actions (likes/comments/views/shares) need a POST link, not a
    // profile — show the right hint per platform so users paste the right thing.
    const _postActions = ['like', 'retweet', 'comment', 'comment_custom', 'comment_emoji', 'comment_crypto', 'review', 'share', 'view', 'repost',
      'save', 'comment_like']; // a post saved (Lemon8, Pinterest) and the like of a comment on LinkedIn (18–19.10.2026)
    const _postPlaceholders = {
      tiktok:    'https://tiktok.com/@username/video/1234567890',
      instagram: 'https://instagram.com/p/XXXXXXXXX/',
      youtube:   'https://youtube.com/watch?v=XXXXXXXXX',
      twitter:   'https://x.com/username/status/1234567890',
      facebook:  'https://facebook.com/username/posts/1234567890',
      threads:   'https://threads.net/@username/post/XXXXXXXXX',
      linkedin:  'https://linkedin.com/posts/username-activity-123',
      vkontakte: 'https://vk.com/wall-12345_678',
      telegram:  'https://t.me/channel/123',
      // the Premium networks of 18.10.2026 (phase 3), and Aparat's views
      coinmarketcap: 'https://coinmarketcap.com/community/post/123456789/',
      binance_square: 'https://www.binance.com/en/square/post/12345678901234',
      note:      'https://note.com/username/n/n1a2b3c4d5e6',
      aparat:    'https://www.aparat.com/v/abc12',
      // phase 4
      substack:  'https://newsletter.substack.com/p/post-title',
      patreon:   'https://www.patreon.com/creator/posts/post-title-123456789',
      producthunt: 'https://www.producthunt.com/products/product/launches/launch',
      farcaster: 'https://farcaster.xyz/username/0x1a2b3c4d',
      behance:   'https://www.behance.net/gallery/123456789/Project-title',
      letterboxd: 'https://letterboxd.com/username/film/film-title/',
      goodreads: 'https://www.goodreads.com/review/show/123456789',
      tradingview: 'https://www.tradingview.com/chart/BTCUSD/AbCd1234-Idea-title/',
      stocktwits: 'https://stocktwits.com/username/message/123456789',
    };
    // the kinds whose link is a coin's page (CoinMarketCap's watchlist and vote of the day)
    const _kindPlaceholders = { 'coinmarketcap:watchlist': 'https://coinmarketcap.com/currencies/bitcoin/', 'coinmarketcap:vote_bullish': 'https://coinmarketcap.com/currencies/bitcoin/', 'coinmarketcap:vote_bearish': 'https://coinmarketcap.com/currencies/bitcoin/',
      // phase 4: a launch, a project, a film, a book, a coin of each site, an NFT; Fanvue's like takes a profile or a post (its profile's example)
      'producthunt:upvote': 'https://www.producthunt.com/products/product/launches/launch', 'behance:save': 'https://www.behance.net/gallery/123456789/Project-title',
      'behance:view': 'https://www.behance.net/gallery/123456789/Project-title', 'letterboxd:watchlist': 'https://letterboxd.com/film/film-title/',
      'goodreads:shelf': 'https://www.goodreads.com/book/show/12345.Book_Title', 'coingecko:portfolio': 'https://www.coingecko.com/en/coins/bitcoin',
      'opensea:view': 'https://opensea.io/item/ethereum/0x0000000000000000000000000000000000000000/1', 'coinscope:vote': 'https://www.coinscope.co/coin/coin-name',
      'coinscope:watchlist': 'https://www.coinscope.co/coin/coin-name', 'coinscope:portfolio': 'https://www.coinscope.co/coin/coin-name', 'coinvote:vote': 'https://coinvote.cc/coin/COIN',
      'freshcoins:vote': 'https://www.freshcoins.io/coins/coin-name', 'coinmooner:vote': 'https://coinmooner.com/coins/coin-name-symbol', 'coinsniper:vote': 'https://coinsniper.net/coin/12345',
      'gemfinder:vote': 'https://gemfinder.cc/gem/12345', 'cntoken:vote': 'https://cntoken.io/coin/12345', 'fanvue:like': 'https://www.fanvue.com/username' };
    const placeholderUrl = _kindPlaceholders[it.platform + ':' + it.action] || (_postActions.includes(it.action) && _postPlaceholders[it.platform]) || ({
      // Tier 1 social — original 9
      tiktok:     'https://tiktok.com/@username',
      instagram:  'https://instagram.com/username',
      youtube:    'https://youtube.com/@channel',
      twitter:    'https://x.com/username',
      facebook:   'https://facebook.com/username',
      threads:    'https://threads.net/@username',
      linkedin:   'https://linkedin.com/in/username',
      bluesky:    'https://bsky.app/profile/username.bsky.social',
      vkontakte:  'https://vk.com/username',
      // Tier 2 messengers / chat
      telegram:   'https://t.me/channel',
      max:        'https://max.ru/username',
      whatsapp:   'https://wa.me/phone',
      discord:    'https://discord.gg/invite',
      wechat:     'https://wechat.com/username',
      // Tier 2 video / streaming / audio
      kick:       'https://kick.com/username',
      twitch:     'https://twitch.tv/username',
      rutube:     'https://rutube.ru/channel/123456',
      aparat:     'https://aparat.com/username',
      dlive:      'https://dlive.tv/username',
      likee:      'https://likee.video/@username',
      soundcloud: 'https://soundcloud.com/username',
      spotify:    'https://open.spotify.com/artist/abc123',
      // Tier 2 community / Q&A / blog
      reddit:     'https://reddit.com/r/community',
      quora:      'https://quora.com/profile/Your-Name',
      medium:     'https://medium.com/@username',
      mastodon:   'https://mastodon.social/@username',
      tumblr:     'https://username.tumblr.com',
      // Tier 2 imagery / photo / dev
      pinterest:  'https://pinterest.com/username',
      snapchat:   'https://snapchat.com/add/username',
      dribbble:   'https://dribbble.com/username',
      github:     'https://github.com/username',
      // Tier 3 marketplaces / reviews / maps
      trustpilot: 'https://trustpilot.com/review/site.com',
      google_maps:'https://maps.app.goo.gl/abc123',
      amazon:     'https://amazon.com/dp/B0XXXXXXXX',
      ebay:       'https://ebay.com/itm/123456789',
      etsy:       'https://etsy.com/listing/123456789',
      avito:      'https://avito.ru/item/123456789',
      ozon:       'https://ozon.ru/product/abc-123456789',
      megamarket: 'https://megamarket.ru/catalog/details/abc-123',
      wildberries:'https://wildberries.ru/catalog/123456789/detail.aspx',
      yandex_market:'https://market.yandex.ru/product/123456789',
      other_marketplaces:'https://marketplace.com/product/...',
      // Tier 3 misc
      steam:      'https://steamcommunity.com/id/username',
      jaco:       'https://jaco.live/username',
      // the networks of 18.10.2026
      vimeo:      'https://vimeo.com/username',
      boomplay:   'https://www.boomplay.com/artists/12345678',
      odnoklassniki:'https://ok.ru/profile/571234567890',
      dzen:       'https://dzen.ru/channel',
      snackvideo: 'https://www.snackvideo.com/@username',
      kwai:       'https://www.kwai.com/@username',
      lemon8:     'https://www.lemon8-app.com/@username',
      mixcloud:   'https://www.mixcloud.com/username/',
      reverbnation:'https://www.reverbnation.com/artistname',
      datpiff:    'https://www.datpiff.com/mixtape-name.123456.html',
      shedevrum:  'https://shedevrum.ai/@username/',
      shazam:     'https://www.shazam.com/song/123456789',
      coub:       'https://coub.com/username',
      // the Premium networks of 18.10.2026 (phase 3)
      coinmarketcap: 'https://coinmarketcap.com/community/profile/username/',
      fanvue:     'https://www.fanvue.com/username',
      binance_square: 'https://www.binance.com/en/square/profile/username',
      note:       'https://note.com/username',
      // phase 4
      substack:   'https://newsletter.substack.com',
      patreon:    'https://www.patreon.com/creator',
      producthunt: 'https://www.producthunt.com/@username',
      farcaster:  'https://farcaster.xyz/username',
      behance:    'https://www.behance.net/username',
      letterboxd: 'https://letterboxd.com/username/',
      goodreads:  'https://www.goodreads.com/author/show/12345.Author_Name',
      tradingview: 'https://www.tradingview.com/u/username/',
      stocktwits: 'https://stocktwits.com/username',
      paragraph:  'https://paragraph.com/@username',
      mailru:     'https://my.mail.ru/mail/username/',
      // the regular networks of 18.10.2026 (phase 4): what a follow is done on (a Bandcamp artist's own address, a Rumble channel, a Bilibili
      // or niconico user by its number)
      audius:     'https://audius.co/username',
      bandcamp:   'https://artistname.bandcamp.com',
      rumble:     'https://rumble.com/c/channelname',
      bilibili:   'https://space.bilibili.com/12345678',
      niconico:   'https://www.nicovideo.jp/user/12345678',
      clapper:    'https://www.clapperapp.com/username',
      artstation: 'https://www.artstation.com/username',
      android:    'https://play.google.com/store/apps/details?id=com.app',
      ios:        'https://apps.apple.com/app/id123456789',
      site:       'https://yoursite.com',
      report:     'https://example.com/page-to-report',
    })[it.platform] || (t('orders_target_placeholder') || 'https://...');
    return `
      <div class="co-detail-form" id="coDetailForm">
        <div class="co-detail-head">
          <div class="co-card-icon">${icon}</div>
          <div>
            <h3>${escHtml(it.label)}</h3>
            <p>${it.platform} · ${it.action}</p>
          </div>
        </div>
        <label>${t('orders_target_url') || 'Target URL'} *</label>
        <input id="coUrl" type="url" placeholder="${placeholderUrl}" autofocus>
        <label>${t('orders_total_tasks') || 'Quantity'} *</label>
        <input id="coCount" type="number" min="${it.min_per_order}" max="${it.max_per_order}" value="${it.min_per_order}">
        <div class="co-range-hint">${t('orders_range_hint') || 'Range'}: ${it.min_per_order.toLocaleString()}–${it.max_per_order.toLocaleString()}</div>

        <div class="co-summary">
          <div class="co-summary-row">
            <span class="label">${t('orders_summary_price') || 'Price per task'}</span>
            <span style="font-variant-numeric:tabular-nums">${fmtPrice(it.price_per_task)}</span>
          </div>
          <div class="co-summary-row">
            <span class="label">${t('orders_summary_qty') || 'Quantity'}</span>
            <span style="font-variant-numeric:tabular-nums" id="coSumQty">${it.min_per_order.toLocaleString()}</span>
          </div>
          <div class="co-summary-row total">
            <span>${t('orders_total_cost') || 'Total'}</span>
            <span style="font-variant-numeric:tabular-nums" id="coSumTotal">${fmtPrice(it.price_per_task * it.min_per_order)}</span>
          </div>
          <div class="co-summary-row balance" id="coBalanceRow">
            <span>${t('orders_your_balance') || 'Your balance'}</span>
            <span style="font-variant-numeric:tabular-nums" id="coSumBalance">$${balance.toFixed(balance < 1 ? 4 : 2)}</span>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="cancel" id="coCancelBtn">${t('cancel') || 'Cancel'}</button>
          <button type="button" class="submit" id="coSubmitBtn">${t('orders_create_btn') || 'Place Order'}</button>
        </div>
      </div>
    `;
  }

  function wireEvents() {
    root.querySelectorAll('[data-pf]').forEach(btn => {
      btn.addEventListener('click', () => {
        activePlatform = btn.dataset.pf;
        selected = null;
        render();
      });
    });
    root.querySelectorAll('.co-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id, 10);
        const it = items.find(x => x.id === id);
        if (it) {
          selected = it;
          render();
          // Scroll detail form into view on small screens
          setTimeout(() => {
            const f = document.getElementById('coDetailForm');
            if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      });
    });

    const cancelBtn = root.querySelector('#coCancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => { selected = null; render(); });

    const countInp = root.querySelector('#coCount');
    if (countInp && selected) {
      const updateTotals = () => {
        const n = parseInt(countInp.value, 10) || 0;
        const total = selected.price_per_task * n;
        const qtyEl = root.querySelector('#coSumQty');
        const totalEl = root.querySelector('#coSumTotal');
        const balEl = root.querySelector('#coSumBalance');
        if (qtyEl) qtyEl.textContent = n.toLocaleString();
        if (totalEl) totalEl.textContent = fmtPrice(total);
        const balRow = root.querySelector('#coBalanceRow');
        if (balRow) balRow.classList.toggle('balance-low', total > (u.balance || 0));
      };
      countInp.addEventListener('input', updateTotals);
      updateTotals();
    }

    const submitBtn = root.querySelector('#coSubmitBtn');
    if (submitBtn && selected) submitBtn.addEventListener('click', placeOrder);
  }

  async function placeOrder() {
    const urlEl = root.querySelector('#coUrl');
    const countEl = root.querySelector('#coCount');
    const submitBtn = root.querySelector('#coSubmitBtn');
    if (!urlEl || !countEl || !submitBtn) return;

    [urlEl, countEl].forEach(el => el.classList.remove('error'));

    const url = (urlEl.value || '').trim();
    const count = parseInt(countEl.value, 10);

    if (!url) { urlEl.classList.add('error'); urlEl.focus(); return showToast(t('orders_url_required') || 'Target URL is required', 'error'); }
    if (!count || count < selected.min_per_order || count > selected.max_per_order) {
      countEl.classList.add('error');
      countEl.focus();
      return showToast(`${t('orders_qty_range') || 'Quantity must be between'} ${selected.min_per_order} – ${selected.max_per_order}`, 'error');
    }
    const total = selected.price_per_task * count;
    if (total > (u.balance || 0)) {
      return showToast(t('orders_insufficient_balance') || 'Insufficient balance — earn more first', 'error');
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '...';
    try {
      const res = await fetch('/api/tasks/orders', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_id: selected.id, target_url: url, total_count: count }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(t('orders_created_ok') || 'Order created!', 'success');
        // Refresh balance from server (server returned new balance, but easiest is /api/auth/me)
        try {
          const me = await fetch('/api/auth/me', { credentials: 'same-origin' }).then(r => r.json());
          if (me && me.user) API.user = me.user;
        } catch {}
        Router.navigate('/orders');
      } else {
        // Specific handling for rate-limit so user gets a clear retry hint.
        if (data.code === 'RATE_LIMIT' && data.retry_after_sec) {
          const sec = data.retry_after_sec;
          showToast(`Slow down — try again in ${sec}s`, 'warning');
          // Keep button disabled for the cooldown so user can't keep hammering.
          submitBtn.textContent = `Wait ${sec}s`;
          let remaining = sec;
          const timer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(timer);
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            } else {
              submitBtn.textContent = `Wait ${remaining}s`;
            }
          }, 1000);
          return;  // skip the finally re-enable
        }
        if (data.field) {
          const target = root.querySelector('#co' + data.field.charAt(0).toUpperCase() + data.field.slice(1).replace(/_./g, m => m[1].toUpperCase()));
          if (target) target.classList.add('error');
        }
        showToast(data.error || 'Failed', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    } finally {
      if (!submitBtn.dataset.cooldown) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  render();
});
