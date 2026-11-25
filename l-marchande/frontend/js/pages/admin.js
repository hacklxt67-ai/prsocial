// ============================================================
// ADMIN PANEL — Dashboard, Moderation, Users, Tickets, Settings
// ============================================================


// Format UTC timestamp from server as browser-local time.
// Backend stores UTC text "2026-05-10 14:45:00" (no Z); we append Z then format
// via toLocaleString() with no explicit timeZone → admin's browser TZ wins.
// All backend math (cron, hourly limits, withdrawal cooldown) stays UTC.
// Цена в долларах — как есть, без потери мелких сумм и без хвостовых нулей.
//
// Единица учёта 1 unit = $0.0001, но цена бывает мельче: $0.00004 за просмотр
// истории это 0.4 unit. Округление до трёх-четырёх знаков показывало такую цену
// как $0.000 — то есть «бесплатно», и ошибку в настройке нельзя было увидеть
// глазами.
function admPrice(units) {
  var d = Number(units) / 10000;
  if (!isFinite(d)) return '';
  if (d === 0) return '0';
  return d.toFixed(7).replace(/0+$/, '').replace(/\.$/, '');
}

function fmtAdminTime(s) {
  if (!s) return '—';
  var iso = s.includes('T') ? s : s.replace(' ', 'T');
  if (!iso.endsWith('Z')) iso += 'Z';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
}

// Navigation is drawn once by the admin shell (public/js/admin/shell.js). Pages written
// before the shell still interpolate this into their markup; it stays empty until each
// of them moves to the shell's page contract.
function renderAdminSidebar() { return ''; }

// Global dropdown toggle (used across admin-users, admin-tickets, admin-orders)
window.adminToggleDropdown = function(event, id) {
  event.stopPropagation();
  document.querySelectorAll('.adm-dropdown-menu.visible').forEach(m => {
    if (m.id !== 'dropdown-' + id) m.classList.remove('visible');
  });
  const menu = document.getElementById('dropdown-' + id);
  if (!menu) return;
  menu.classList.toggle('visible');
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) menu.style.right = '0';
  if (rect.bottom > window.innerHeight) { menu.style.bottom = '100%'; menu.style.top = 'auto'; }
};
// Close dropdowns on click outside
document.addEventListener('click', () => {
  document.querySelectorAll('.adm-dropdown-menu.visible').forEach(m => m.classList.remove('visible'));
});

// Inject admin-specific styles once
(function injectAdminStyles() {
  if (document.getElementById('admin-styles')) return;
  const style = document.createElement('style');
  style.id = 'admin-styles';
  style.textContent = `
    /* Admin badge in sidebar */
    .adm-badge {
      margin-left: auto;
      background: var(--danger);
      color: #fff;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      line-height: 1.3;
    }
    .adm-badge-warn { background: var(--warning); color: #000; }

    /* Dashboard stat cards grid */
    .adm-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .adm-stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: border-color 0.2s;
    }
    .adm-stat-card:hover { border-color: var(--border-light); }
    .adm-stat-card.critical {
      border-color: var(--danger);
      background: var(--danger-bg);
    }
    .adm-stat-label {
      font-size: var(--font-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .adm-stat-value {
      font-size: var(--font-xl);
      font-weight: 800;
      color: var(--text-primary);
    }
    .adm-stat-sub {
      font-size: var(--font-xs);
      color: var(--text-secondary);
    }
    .adm-stat-sub span { font-weight: 600; }

    /* Quick links */
    .adm-quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }
    .adm-quick-link {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 16px;
      color: var(--text-primary);
      font-size: var(--font-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .adm-quick-link:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Activity feed */
    .adm-feed {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .adm-feed-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: var(--font-sm);
    }
    .adm-feed-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .adm-feed-icon svg { width: 14px; height: 14px; }
    .adm-feed-text { flex: 1; min-width: 0; color: var(--text-secondary); }
    .adm-feed-time { font-size: var(--font-xs); color: var(--text-muted); flex-shrink: 0; }

    /* Moderation tabs */
    .adm-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0;
      overflow-x: auto;
      overflow-y: hidden;
      flex-wrap: nowrap;
      scrollbar-width: thin;
    }
    .adm-tabs::-webkit-scrollbar { height: 6px; }
    .adm-tabs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    .adm-tab { white-space: nowrap; flex-shrink: 0; }
    .adm-tab {
      padding: 10px 20px;
      font-size: var(--font-sm);
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.2s;
      background: none;
      border-top: none;
      border-left: none;
      border-right: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .adm-tab:hover { color: var(--text-primary); }
    .adm-tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .adm-tab .adm-badge { margin-left: 4px; }

    /* Moderation cards */
    .adm-mod-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .adm-mod-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      padding-left: 36px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      transition: opacity 0.3s, transform 0.3s;
      position: relative;
    }
    .adm-mod-card.removing {
      opacity: 0;
      transform: translateX(40px);
    }
    .adm-mod-thumb {
      width: 200px;
      min-width: 200px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .adm-mod-thumb:hover { transform: scale(1.02); }
    .adm-mod-info { flex: 1; min-width: 0; }
    .adm-mod-worker {
      font-weight: 600;
      color: var(--text-primary);
      font-size: var(--font-base);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .adm-mod-worker .platform-icon { width: 18px; height: 18px; display: inline-flex; }
    .adm-mod-worker .platform-icon svg { width: 100%; height: 100%; }
    .adm-mod-detail {
      font-size: var(--font-sm);
      color: var(--text-secondary);
      margin-bottom: 2px;
    }
    .adm-mod-time {
      font-size: var(--font-xs);
      color: var(--text-muted);
      margin-top: 4px;
    }
    .adm-mod-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .adm-mod-actions .btn { padding: 8px 16px; font-size: var(--font-sm); }

    /* === Compact moderation row (Screenshots tab) === */
    .adm-mod-row {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 5px 10px;
      display: grid;
      grid-template-columns: 20px 44px 1fr auto;
      gap: 10px;
      align-items: center;
      position: relative;
      transition: opacity 0.25s, transform 0.25s, border-color 0.15s;
    }
    .adm-mod-row:hover { border-color: var(--accent); }
    .adm-mod-row.removing { opacity: 0; transform: translateX(40px); }
    .adm-mod-row .adm-mod-thumb-sm {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      cursor: zoom-in;
      background: var(--bg-input);
    }
    .adm-mod-row .adm-mod-thumb-sm.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 9px;
      cursor: default;
      text-align: center;
      padding: 4px;
    }
    .adm-mod-row-fields {
      display: grid;
      grid-template-columns: minmax(140px, 1.4fr) minmax(180px, 2fr) auto minmax(110px, auto) auto;
      gap: 10px;
      align-items: center;
      font-size: 12.5px;
      min-width: 0;
    }
    .adm-mod-row-fields > div { min-width: 0; }
    .adm-mod-row .truncated {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
    .adm-mod-row-user {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .adm-mod-row-user .platform-icon { width: 16px; height: 16px; flex-shrink: 0; display: inline-flex; }
    .adm-mod-row-user .platform-icon svg { width: 100%; height: 100%; }
    .adm-mod-row-user > span { min-width: 0; }
    .adm-mod-row-sub {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .adm-mod-row-target {
      font-size: var(--font-sm);
      color: var(--text-secondary);
      font-family: monospace;
    }
    .adm-mod-row-reward {
      text-align: right;
      font-weight: 700;
      font-size: var(--font-sm);
    }
    .adm-mod-row-time {
      color: var(--text-muted);
      font-size: 11px;
      text-align: right;
      white-space: nowrap;
    }
    .adm-mod-row-actions {
      display: flex;
      gap: 5px;
      flex-shrink: 0;
    }
    .adm-mod-row-actions .btn {
      padding: 4px 10px;
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* AI verdict pill in row */
    .adm-ai-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.4px;
      cursor: help;
    }
    .adm-ai-pill.pass    { background: rgba(34,197,94,0.15);  color: #15803d; }
    .adm-ai-pill.fail    { background: rgba(239,68,68,0.15);  color: #b91c1c; }
    .adm-ai-pill.pending { background: rgba(148,163,184,0.18); color: #64748b; }

    /* Source badge (chrome/android/desktop/telegram) */
    .adm-mod-row-source {
      display: inline-block;
      font-size: 9px;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 0.3px;
      vertical-align: middle;
    }

    .btn-link-dead {
      background: #475569;
      color: #fff;
      border: 1px solid transparent;
    }
    .btn-link-dead:hover { background: #334155; }
    .btn-suspect {
      background: #b91c1c;
      color: #fff;
      border: 1px solid transparent;
    }
    .btn-suspect:hover { background: #991b1b; }
    @media (max-width: 1100px) {
      .adm-mod-row { grid-template-columns: 22px 72px 1fr; }
      .adm-mod-row-actions { grid-column: 1/-1; justify-content: flex-end; padding-top: 4px; }
      .adm-mod-row-fields {
        grid-template-columns: minmax(140px, 1fr) minmax(140px, 1fr);
        gap: 8px 14px;
      }
      .adm-mod-row-time, .adm-mod-row-reward { text-align: left; }
    }

    /* === Reusable simple confirm modal (moderation reject/warn) === */
    .adm-modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      width: min(560px, calc(100vw - 32px));
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .adm-modal-card .modal-body { padding: 18px 22px 18px; overflow-y: auto; }
    .adm-modal-card .modal-foot {
      padding: 14px 22px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .adm-modal-summary {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px 16px;
      font-size: 12px;
      margin-bottom: 14px;
    }
    .adm-modal-summary .l { color: var(--text-muted); font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; }
    .adm-modal-summary .v { color: var(--text-primary); font-weight: 600; margin-top: 2px; word-break: break-word; }

    .btn-approve {
      background: var(--success);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn-approve:hover { opacity: 0.85; }
    .btn-reject {
      background: var(--danger);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn-reject:hover { opacity: 0.85; }
    .btn-warn-quality {
      background: #f59e0b;
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn-warn-quality:hover { opacity: 0.85; }
    .adm-warn-form {
      margin-top: 8px;
      padding: 8px;
      background: rgba(245,158,11,0.06);
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: var(--radius-sm);
    }
    .adm-reject-input {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      padding: 6px 10px;
      font-size: var(--font-sm);
      width: 100%;
      margin-top: 6px;
      outline: none;
    }
    .adm-reject-input:focus { border-color: var(--accent); }

    /* === Withdraw modal (admin-finance) === */
    .wd-modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      width: min(900px, calc(100vw - 32px));
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .wd-modal-card .modal-body { overflow-y: auto; padding: 18px 22px 22px; }
    .wd-modal-summary {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px 18px;
      font-size: var(--font-sm);
      margin-bottom: 18px;
    }
    .wd-modal-summary .l { color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; }
    .wd-modal-summary .v { color: var(--text-primary); font-weight: 600; margin-top: 2px; word-break: break-all; }
    /* === Bulk pay (admin-finance withdrawals) === */
    .wd-selcell { width: 30px; text-align: center; }
    .wd-selcell input { width: 15px; height: 15px; cursor: pointer; accent-color: var(--accent); vertical-align: middle; }
    .wd-bulkbar {
      position: fixed; left: 50%; transform: translateX(-50%); bottom: 18px; z-index: 900;
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
      box-shadow: 0 10px 34px rgba(0,0,0,0.22);
      padding: 10px 16px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
      font-size: var(--font-sm); max-width: calc(100vw - 32px);
    }
    .wd-bulkbar .bb-nets { color: var(--text-muted); font-size: 12px; }
    .wd-bulk-rowlist { max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius-sm); }
    .wd-bulk-rowlist table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .wd-bulk-rowlist th { position: sticky; top: 0; background: var(--bg-input); text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--text-muted); }
    .wd-bulk-rowlist th, .wd-bulk-rowlist td { padding: 6px 10px; border-bottom: 1px solid var(--border); }
    .wd-bulk-rowlist tr:last-child td { border-bottom: none; }
    .wd-bulk-st { font-weight: 700; font-size: 11px; white-space: nowrap; }
    .wd-reason-group { margin-bottom: 14px; }
    .wd-reason-group h4 {
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0 0 8px;
      font-weight: 700;
    }
    .wd-reason-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .wd-reason-chip {
      padding: 7px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all .15s;
      user-select: none;
    }
    .wd-reason-chip:hover { border-color: var(--accent); }
    .wd-reason-chip.active {
      background: rgba(220,38,38,0.12);
      border-color: #dc2626;
      color: #dc2626;
      font-weight: 600;
    }
    .wd-reason-chip[data-severe="1"].active {
      background: rgba(127,29,29,0.18);
      border-color: #7f1d1d;
      color: #7f1d1d;
    }
    .wd-lq-sub {
      margin-top: 10px;
      padding: 11px 12px 12px;
      border-radius: 10px;
      background: var(--bg-input);
      border: 1px solid var(--border);
    }
    .wd-lq-hint {
      font-size: 10.5px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0 0 9px;
      font-weight: 700;
    }
    .wd-lq-sub .wd-reason-chip { background: var(--bg-card, #fff); }
    .wd-checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-top: 8px;
      cursor: pointer;
      font-size: var(--font-sm);
    }
    .wd-checkbox-row:hover { background: var(--bg-input); }
    .wd-checkbox-row input { margin: 0; }
    .wd-checkbox-row .h { font-weight: 600; }
    .wd-checkbox-row .d { color: var(--text-muted); font-size: 11px; }
    .wd-platform-select {
      margin-top: 6px;
      padding: 6px 10px;
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: var(--font-sm);
    }
    .wd-modal-foot {
      padding: 14px 22px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      background: var(--bg-card);
    }

    /* === Withdraw filter chips === */
    .wd-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0 0 14px;
      align-items: center;
    }
    .wd-filter-chip {
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all .15s;
    }
    .wd-filter-chip:hover { border-color: var(--accent); }
    .wd-filter-chip.active {
      background: rgba(34,197,94,0.12);
      border-color: var(--success);
      color: var(--success);
      font-weight: 600;
    }
    .wd-filter-chip .n {
      background: var(--bg-card);
      color: inherit;
      padding: 1px 7px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
    }
    .wd-filter-chip.active .n { background: rgba(255,255,255,0.25); color: inherit; }

    /* === Withdraw quick-stats === */
    .wd-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }
    .wd-stat {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
    }
    .wd-stat .l { color: var(--text-muted); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .wd-stat .v { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-top: 4px; }
    .wd-stat.warn .v { color: #f59e0b; }
    .wd-stat.danger .v { color: #dc2626; }
    .wd-stat.success .v { color: var(--success); }

    /* === Withdraw status pill === */
    .wd-status-pill {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .wd-status-pending    { background: rgba(245,158,11,0.15); color: #b45309; }
    .wd-status-processing { background: rgba(59,130,246,0.15); color: #1d4ed8; }
    .wd-status-completed  { background: rgba(34,197,94,0.15);  color: #15803d; }
    .wd-status-rejected   { background: rgba(220,38,38,0.15);  color: #b91c1c; }

    /* === Address copy chip === */
    .wd-addr {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: monospace;
      font-size: 11px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--bg-input);
      transition: background .15s;
    }
    .wd-addr:hover { background: var(--accent); color: #fff; }

    /* Social mod card */
    .adm-social-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: opacity 0.3s, transform 0.3s;
    }
    .adm-social-card.removing {
      opacity: 0;
      transform: translateX(40px);
    }
    .adm-social-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }
    .adm-social-icon svg { width: 100%; height: 100%; }
    .adm-social-info { flex: 1; min-width: 0; }
    .adm-social-actions { display: flex; gap: 8px; flex-shrink: 0; }

    /* Users toolbar */
    .adm-users-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .adm-search {
      flex: 1;
      min-width: 200px;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      color: var(--text-primary);
      font-size: var(--font-sm);
      outline: none;
    }
    .adm-search:focus { border-color: var(--accent); }

    /* Users table layout */
    .adm-users-table {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .adm-users-thead {
      display: grid;
      grid-template-columns: 50px 1fr 1.2fr 90px 70px 80px 90px 40px;
      gap: 8px;
      padding: 8px 14px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid var(--border);
    }
    .adm-users-trow {
      display: grid;
      grid-template-columns: 50px 1fr 1.2fr 90px 70px 80px 90px 40px;
      gap: 8px;
      align-items: center;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      transition: border-color 0.2s;
    }
    .adm-users-trow:hover { border-color: var(--border-light); }
    .adm-ut-id { font-size: var(--font-sm); color: var(--text-muted); font-weight: 600; }
    .adm-ut-name { font-size: var(--font-sm); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-ut-email { font-size: var(--font-sm); color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-ut-bal { font-size: var(--font-sm); text-align: right; }
    .adm-ut-role, .adm-ut-status { text-align: center; }
    .adm-ut-date { font-size: var(--font-xs); color: var(--text-muted); text-align: right; }
    .adm-ut-actions { text-align: center; position: relative; }

    /* Sortable headers */
    .adm-sortable {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.15s;
    }
    .adm-sortable:hover { color: var(--accent); }
    .adm-sort-icon { font-size: 10px; opacity: 0.3; line-height: 1; }
    .adm-sort-icon.active { opacity: 1; color: var(--accent); }

    @media (max-width: 900px) {
      .adm-users-thead { display: none; }
      .adm-users-trow {
        grid-template-columns: auto 1fr auto auto;
        grid-template-rows: auto auto;
      }
      .adm-ut-email, .adm-ut-role, .adm-ut-date { display: none; }
    }

    /* Dropdown menu */
    .adm-user-dropdown { position: relative; }
    .adm-dropdown-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 18px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      line-height: 1;
    }
    .adm-dropdown-btn:hover { border-color: var(--accent); color: var(--accent); }
    .adm-dropdown-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 4px 0;
      min-width: 200px;
      z-index: 100;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    .adm-dropdown-menu.visible { display: block; }
    .adm-dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      font-size: var(--font-sm);
      color: var(--text-primary);
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .adm-dropdown-item:hover { background: var(--bg-secondary); }
    .adm-dropdown-item svg { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.6; }
    .adm-dropdown-danger { color: var(--danger); }
    .adm-dropdown-danger svg { stroke: var(--danger); opacity: 1; }
    .adm-dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }

    .adm-user-role-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      display: inline-block;
    }
    .adm-role-admin { background: var(--accent-light); color: var(--accent); }
    .adm-role-user { background: var(--info-bg); color: var(--info); }
    .adm-status-active { background: var(--success-bg); color: var(--success); }
    .adm-status-banned { background: var(--danger-bg); color: var(--danger); }
    .adm-status-suspicious { background: rgba(239,68,68,0.12); color: #ef4444; font-weight: 700; }

    .adm-status-chip { padding: 5px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text-muted); cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s; }
    .adm-status-chip:hover { border-color: var(--text-muted); }
    .adm-status-chip.active { background: var(--chip-color, var(--accent)); color: #fff; border-color: transparent; }

    /* User detail expanded */
    .adm-user-detail {
      grid-column: 1 / -1;
      margin-top: 4px;
      padding: 14px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .adm-user-detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .adm-user-detail-item {
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }
    .adm-user-detail-item strong { color: var(--text-primary); }

    /* Pagination */
    .adm-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
    }
    .adm-pagination button {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 8px 14px;
      color: var(--text-primary);
      font-size: var(--font-sm);
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .adm-pagination button:hover { border-color: var(--accent); }
    .adm-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
    .adm-pagination span { font-size: var(--font-sm); color: var(--text-muted); }

    /* Tickets */
    .adm-ticket-row {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .adm-ticket-row:hover { border-color: var(--border-light); }
    .adm-ticket-top {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .adm-ticket-subject {
      font-weight: 600;
      color: var(--text-primary);
      flex: 1;
      min-width: 0;
    }
    .adm-ticket-status {
      font-size: var(--font-xs);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .adm-ts-open { background: var(--danger-bg); color: var(--danger); }
    .adm-ts-answered { background: var(--warning-bg); color: var(--warning); }
    .adm-ts-closed { background: rgba(113,113,122,0.15); color: var(--text-muted); }
    .adm-ticket-preview {
      font-size: var(--font-sm);
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .adm-ticket-meta {
      display: flex;
      gap: 12px;
      margin-top: 4px;
      font-size: var(--font-xs);
      color: var(--text-muted);
    }

    /* Ticket thread */
    .adm-thread {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 12px;
      padding: 4px;
    }
    .adm-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: var(--radius);
      font-size: var(--font-sm);
      line-height: 1.5;
    }
    .adm-msg-user {
      background: var(--bg-input);
      border: 1px solid var(--border);
      align-self: flex-start;
      color: var(--text-secondary);
    }
    .adm-msg-admin {
      background: var(--accent-light);
      border: 1px solid rgba(34,197,94,0.3);
      align-self: flex-end;
      color: var(--text-primary);
    }
    .adm-msg-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .adm-msg-text {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .adm-msg-meta {
      font-size: var(--font-xs);
      color: var(--text-muted);
      margin-top: 4px;
    }
    .adm-translate-btn {
      margin-top: 6px;
      background: none;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 4px 10px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .adm-translate-btn:hover { border-color: var(--accent); color: var(--accent); }
    .adm-translate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Tickets toolbar */
    .adm-tickets-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    /* Tickets table layout */
    .adm-tickets-table {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .adm-tickets-thead {
      display: grid;
      grid-template-columns: 50px 100px 1fr 90px 100px 100px;
      gap: 8px;
      padding: 8px 14px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid var(--border);
    }
    .adm-tickets-trow {
      display: grid;
      grid-template-columns: 50px 100px 1fr 90px 100px 100px;
      gap: 8px;
      align-items: center;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      transition: border-color 0.2s;
    }
    .adm-tickets-trow:hover { border-color: var(--accent); }
    .adm-tt-id { font-size: var(--font-sm); color: var(--text-muted); font-weight: 600; }
    .adm-tt-user { font-size: var(--font-sm); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-tt-subject { font-size: var(--font-sm); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-tt-status { text-align: center; }
    .adm-tt-date { font-size: var(--font-xs); color: var(--text-muted); }

    @media (max-width: 900px) {
      .adm-tickets-thead { display: none; }
      .adm-tickets-trow {
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto auto;
      }
      .adm-tt-user, .adm-tt-date { display: none; }
    }

    /* Ticket detail layout */
    .adm-ticket-detail {
      display: grid;
      grid-template-columns: 1fr 220px;
      gap: 16px;
    }
    @media (max-width: 768px) {
      .adm-ticket-detail { grid-template-columns: 1fr; }
    }
    .adm-ticket-detail-main {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .adm-ticket-detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    .adm-ticket-detail-sidebar {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      align-self: flex-start;
    }
    .adm-ticket-reply-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
    }

    /* Orders table layout */
    .adm-orders-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .adm-orders-table { display: flex; flex-direction: column; gap: 2px; }
    .adm-orders-thead {
      display: grid;
      grid-template-columns: 55px 1.2fr 1.5fr 65px 55px 65px 60px 85px 105px 44px;
      gap: 8px;
      padding: 8px 14px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid var(--border);
    }
    .adm-orders-trow {
      display: grid;
      grid-template-columns: 55px 1.2fr 1.5fr 65px 55px 65px 60px 85px 105px 44px;
      gap: 8px;
      align-items: center;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      transition: border-color 0.2s;
    }
    .adm-orders-trow:hover { border-color: var(--border-light); }
    .adm-ot-id { font-size: var(--font-sm); color: var(--text-muted); font-weight: 600; }
    .adm-ot-service { font-size: var(--font-sm); color: var(--text-primary); display: flex; align-items: center; gap: 6px; overflow: hidden; }
    .adm-ot-link { font-size: var(--font-xs); color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-ot-link a { color: var(--accent); text-decoration: none; }
    .adm-ot-link a:hover { text-decoration: underline; }
    .adm-ot-num { font-size: var(--font-sm); text-align: right; }
    .adm-ot-status { text-align: center; }
    .adm-ot-date { font-size: var(--font-xs); color: var(--text-muted); }
    .adm-ot-actions { text-align: center; position: relative; }

    /* Order status badges */
    .adm-os-pending { background: rgba(156,163,175,0.15); color: #9ca3af; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-in_progress { background: rgba(34,197,94,0.15); color: #22c55e; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-active { background: rgba(34,197,94,0.15); color: #22c55e; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-paused { background: rgba(234,179,8,0.15); color: #eab308; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-completed { background: rgba(59,130,246,0.15); color: #3b82f6; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-partial { background: rgba(168,85,247,0.15); color: #a855f7; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-cancelled { background: rgba(239,68,68,0.15); color: #ef4444; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .adm-os-error { background: rgba(239,68,68,0.15); color: #dc2626; font-size: var(--font-xs); font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }

    /* Source badges */
    .adm-src-admin { background: rgba(34,197,94,0.15); color: var(--accent); font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; margin-left: 4px; }
    .adm-src-api { background: rgba(168,85,247,0.15); color: #a855f7; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; margin-left: 4px; }

    /* Order progress bar */
    .adm-progress-bar { width: 100%; height: 6px; background: var(--bg-input); border-radius: 3px; overflow: hidden; }
    .adm-progress-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.3s; }

    /* Order detail layout */
    .adm-order-detail { display: grid; grid-template-columns: 1fr 240px; gap: 16px; }
    @media (max-width: 768px) { .adm-order-detail { grid-template-columns: 1fr; } }
    .adm-order-info { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
    .adm-order-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 12px; }
    .adm-order-info-item { font-size: var(--font-sm); }
    .adm-order-info-item label { display: block; font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; }
    .adm-order-info-item span { color: var(--text-primary); font-weight: 600; }

    /* Completions table */
    .adm-completions-table { display: flex; flex-direction: column; gap: 2px; }
    .adm-completions-thead {
      display: grid;
      grid-template-columns: 50px 100px 80px 100px 100px 100px 90px;
      gap: 8px;
      padding: 8px 12px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      border-bottom: 1px solid var(--border);
    }
    .adm-completions-trow {
      display: grid;
      grid-template-columns: 50px 100px 80px 100px 100px 100px 90px;
      gap: 8px;
      padding: 8px 12px;
      font-size: var(--font-sm);
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
    }

    /* Actions log table */
    .adm-completions-log { display: flex; flex-direction: column; gap: 2px; }
    .adm-actions-thead {
      display: grid;
      grid-template-columns: 80px 70px 100px 1fr 1fr 65px 85px 100px 90px 80px;
      gap: 8px;
      padding: 8px 14px;
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid var(--border);
    }
    .adm-actions-trow {
      display: grid;
      grid-template-columns: 80px 70px 100px 1fr 1fr 65px 85px 100px 90px 80px;
      gap: 8px;
      align-items: center;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: var(--font-sm);
      transition: border-color 0.2s;
    }
    .adm-actions-trow:hover { border-color: var(--accent); }

    @media (max-width: 900px) {
      .adm-orders-thead { display: none; }
      .adm-orders-trow {
        grid-template-columns: auto 1fr auto auto;
        grid-template-rows: auto auto;
      }
      .adm-ot-link, .adm-ot-date { display: none; }
      .adm-completions-thead, .adm-actions-thead { display: none; }
      .adm-completions-trow { grid-template-columns: auto 1fr auto; }
      .adm-actions-trow { grid-template-columns: auto 1fr auto auto; }
    }

    /* Settings toggles */
    .adm-setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 6px;
    }
    .adm-setting-info { flex: 1; }
    .adm-setting-key {
      font-weight: 600;
      color: var(--text-primary);
      font-size: var(--font-sm);
    }
    .adm-setting-desc {
      font-size: var(--font-xs);
      color: var(--text-muted);
      margin-top: 2px;
    }
    .adm-toggle {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .adm-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .adm-toggle-track {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .adm-toggle-track::after {
      content: '';
      position: absolute;
      top: 2px; left: 2px;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--text-muted);
      transition: transform 0.2s, background 0.2s;
    }
    .adm-toggle input:checked + .adm-toggle-track {
      background: var(--accent-light);
      border-color: var(--accent);
    }
    .adm-toggle input:checked + .adm-toggle-track::after {
      transform: translateX(20px);
      background: var(--accent);
    }
    .adm-setting-text-input {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      padding: 6px 10px;
      font-size: var(--font-sm);
      width: 120px;
      text-align: right;
      outline: none;
    }
    .adm-setting-text-input:focus { border-color: var(--accent); }

    /* Image lightbox */
    .adm-lightbox {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    }
    .adm-lightbox img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
    }

    /* Section title */
    .adm-section-title {
      font-size: var(--font-sm);
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 20px 0 10px;
    }

    /* Settings (06.11.2026): the groups, their links, the secrets, the limits an hour, every other key */
    .adm-set-nav { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 0 0 14px; font-size: var(--font-sm); }
    .adm-set-nav a { color: var(--text-muted); text-decoration: none; border-bottom: 1px dotted currentColor; }
    .adm-set-nav a:hover { color: var(--text); }
    .adm-set-group { margin: 0 0 22px; }
    .adm-set-head { margin: 0 0 8px; }
    .adm-set-head h2 { margin: 0; font-size: 15px; font-weight: 700; }
    .adm-set-head p { margin: 4px 0 0; font-size: var(--font-sm); color: var(--text-muted); line-height: 1.45; }
    .adm-set-link { color: var(--primary, #22c55e); text-decoration: none; font-weight: 600; }
    .adm-set-link:hover { text-decoration: underline; }
    .adm-set-sub { margin: 14px 0 6px; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .adm-set-num { max-width: 120px; text-align: end; font-variant-numeric: tabular-nums; }
    .adm-set-listrow { flex-direction: column; align-items: stretch; gap: 8px; }
    .adm-set-list { width: 100%; min-height: 132px; text-align: start; font-family: ui-monospace, Menlo, monospace; font-size: 12px; line-height: 1.5; resize: vertical; }
    .adm-set-secret-f, .adm-set-add-f { display: flex; gap: 8px; align-items: center; }
    .adm-set-secret-f .adm-setting-text-input { max-width: 220px; }
    .adm-set-add-f select { height: 34px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); padding: 0 8px; font: inherit; font-size: var(--font-sm); }
    .adm-set-add-f .adm-set-num { max-width: 90px; }
    .adm-set-else .adm-setting-key { font-weight: 600; }
    .adm-set-now { font-size: var(--font-sm); color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .adm-set-other { margin-top: 24px; border-top: 1px solid var(--border); padding-top: 14px; }
    .adm-set-other summary { cursor: pointer; font-size: var(--font-sm); line-height: 1.45; }
    .adm-set-other summary span { color: var(--text-muted); }
    .adm-set-search { margin: 12px 0 8px; max-width: 360px; }
    .adm-set-tbl { overflow: auto; }
    .adm-set-tbl table { width: 100%; border-collapse: collapse; font-size: var(--font-sm); }
    .adm-set-tbl th { text-align: start; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); padding: 6px 8px; border-bottom: 1px solid var(--border); }
    .adm-set-tbl td { padding: 6px 8px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .adm-set-tbl code { font-size: 12px; word-break: break-all; }
    .adm-set-tbl .adm-set-raw { max-width: 260px; }
    .adm-set-where { color: var(--text-muted); white-space: nowrap; }
    .adm-set-ro { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; }
    @media (max-width: 640px) {
      .adm-set-add, .adm-set-secret { flex-direction: column; align-items: stretch; gap: 8px; }
      .adm-set-add-f, .adm-set-secret-f { flex-wrap: wrap; justify-content: flex-start; }
      .adm-set-add-f select { flex: 1 1 120px; min-width: 0; }
      .adm-set-secret-f .adm-setting-text-input { max-width: none; flex: 1 1 160px; }
      .adm-set-where { white-space: normal; }
    }

    /* Empty state */
    .adm-empty {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      font-size: var(--font-sm);
    }
    .adm-empty svg { margin-bottom: 8px; opacity: 0.4; }

    /* Responsive */
    @media (max-width: 768px) {
      .adm-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .adm-stat-card { padding: 12px; }
      .adm-stat-value { font-size: var(--font-lg); }
      .adm-mod-card { flex-direction: column; }
      .adm-mod-thumb { width: 100%; min-width: unset; max-height: 250px; object-fit: contain; }
      .adm-user-main { flex-direction: column; align-items: flex-start; gap: 4px; }
      .adm-user-balance { text-align: left; }
      .adm-user-date { text-align: left; }
      .adm-social-card { flex-direction: column; align-items: flex-start; }
      .adm-social-actions { width: 100%; justify-content: flex-end; }
    }
  `;
  document.head.appendChild(style);
})();


// ============================================================
// Shared helpers for admin
// ============================================================

// Pending counts for the pages written before the shell. The shell owns the request
// (GET /admin/badges, a Redis read) and paints the sidebar; this keeps the old object in
// step for the pages that still read it, and never blocks a render.
let _adminPendingCounts = { tasks: 0, socials: 0, tickets: 0 };

function _loadAdminPendingCounts() {
  if (typeof AdminShell === 'undefined') return;
  AdminShell.refreshBadges().then(c => { if (c) Object.assign(_adminPendingCounts, c); });
}

function _adminGuard() {
  const u = API.user;
  if (!u) {
    Router.navigate('/admin/login');
    return false;
  }
  if (u.role !== 'admin' && u.role !== 'staff') {
    showToast('Admin access required', 'error');
    Router.navigate('/dashboard');
    return false;
  }
  return true;
}

// === ADMIN LOGIN PAGE ===
Router.register('admin/login', (app) => {
  // Already logged in as admin? Go to admin dashboard
  if (API.user && API.user.role === 'admin') {
    Router.navigate('/admin');
    return;
  }

  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>PR<span style="color:var(--accent)">.</span>SOCIAL</h1>
        <div style="font-size:0.75rem;color:var(--accent);font-weight:700;letter-spacing:0.1em;margin-top:4px">ADMIN PANEL</div>
      </div>
      <div class="auth-card" style="border:1px solid rgba(34,197,94,0.15)">
        <h2 style="display:flex;align-items:center;gap:8px">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Admin Login
        </h2>
        <form id="adminLoginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" id="adminLoginEmail" placeholder="admin@pr.social" required autocomplete="email">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-input" id="adminLoginPassword" placeholder="Password" required autocomplete="current-password">
          </div>
          <div id="adminTurnstile" class="cf-turnstile" style="margin-bottom:8px"></div>
          <div class="form-error" id="adminLoginError"></div>
          <button type="submit" class="btn btn-primary" id="adminLoginBtn" style="background:var(--accent)">Sign In</button>
        </form>
      </div>
      <div style="text-align:center;margin-top:16px">
        <a href="/" style="color:var(--text-muted);font-size:0.8rem;text-decoration:none">&larr; Back to PR.SOCIAL</a>
      </div>
    </div>
  </div>`;

  // Render Turnstile widget
  let adminTurnstileId;
  if (window.turnstile) {
    adminTurnstileId = turnstile.render('#adminTurnstile', { sitekey: '0x4AAAAAAComvejBuoADKL4m', theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', size: 'flexible' });
  }

  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('adminLoginBtn');
    const err = document.getElementById('adminLoginError');
    const email = document.getElementById('adminLoginEmail').value.trim();
    const password = document.getElementById('adminLoginPassword').value;

    // Get Turnstile token
    const cfToken = window.turnstile ? turnstile.getResponse(adminTurnstileId) : null;
    if (!cfToken) {
      err.textContent = 'Please complete the captcha';
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    err.classList.remove('visible');

    try {
      const data = await API.login(email, password, cfToken);

      // 2FA required — show code input
      if (data.requires_2fa) {
        btn.disabled = false;
        btn.textContent = 'Sign In';
        _show2faModal(data);
        return;
      }

      if (!API.user || (API.user.role !== 'admin' && API.user.role !== 'staff')) {
        await API.logout();
        throw new Error('Access denied. Admin credentials required.');
      }
      Router.navigate('/admin');
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
      if (window.turnstile) turnstile.reset(adminTurnstileId);
    }
  });
});

// Sign-in, step two. data = the /auth/login answer: { session_id, method, methods,
// hints, sent, send_error, retry_in }. Methods: email / telegram (codes sent on request),
// totp (authenticator app), recovery (one of the recovery codes).
function _show2faModal(data) {
  const existing = document.getElementById('twofa-overlay');
  if (existing) existing.remove();
  const NAMES = { email: 'E-mail', telegram: 'Telegram', totp: 'Authenticator app', recovery: 'Recovery code' };
  const st = { session: data.session_id, method: data.method, methods: (data.methods || ['email']).slice(), hints: data.hints || {}, sentAt: {}, retryAt: 0, tick: null, busy: false };
  if (data.sent) { st.sentAt[data.method] = Date.now(); st.retryAt = Date.now() + (data.retry_in || 30) * 1000; }
  if (st.hints.recovery && st.methods.indexOf('recovery') === -1) st.methods.push('recovery');

  const ov = document.createElement('div');
  ov.id = 'twofa-overlay';
  ov.className = 'cx-login-ov';
  ov.innerHTML = '<div class="cx-login-box" role="dialog" aria-modal="true" aria-labelledby="twofa-title">'
    + '<div class="cx-login-h"><span class="cx-ico" style="--a:var(--cx-c-sus);--b:var(--cx-c-sus-2)"><svg class="cx-i" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span><div><h3 id="twofa-title">Second step</h3><p id="twofa-sub"></p></div></div>'
    + '<div class="cx-login-tabs" id="twofa-tabs" role="tablist"></div>'
    + '<input type="text" id="twofa-code" class="cx-login-code" inputmode="numeric" autocomplete="one-time-code" placeholder="000000" aria-label="Code">'
    + '<div class="cx-dlg-err" id="twofa-error" hidden></div>'
    + '<label class="cx-login-trust"><input type="checkbox" id="twofa-trust"> Trust this browser for 30 days</label>'
    + '<button type="button" id="twofa-submit" class="cx-btn cx-btn-primary cx-login-btn">Verify</button>'
    + '<div class="cx-login-foot"><button type="button" id="twofa-resend" class="cx-linkbtn"></button><button type="button" id="twofa-cancel" class="cx-linkbtn">Cancel</button></div>'
    + '</div>';
  document.body.appendChild(ov);
  const $ = (id) => document.getElementById(id);
  const input = $('twofa-code'), errEl = $('twofa-error'), submitBtn = $('twofa-submit'), resendBtn = $('twofa-resend');
  const showErr = (t) => { errEl.textContent = t; errEl.hidden = !t; };
  const describe = (m) => m === 'email' ? 'We sent a 6-digit code to <b>' + escHtml(st.hints.email || 'your e-mail') + '</b>.'
    : m === 'telegram' ? 'We sent a 6-digit code to <b>' + escHtml(st.hints.telegram || 'Telegram') + '</b>.'
    : m === 'totp' ? 'Enter the 6-digit code from your authenticator app.'
    : 'Enter one of your recovery codes (XXXXX-XXXXX). Each works once.';
  const paint = () => {
    $('twofa-sub').innerHTML = describe(st.method);
    $('twofa-tabs').innerHTML = st.methods.map(m => '<button type="button" role="tab" data-m="' + m + '" aria-pressed="' + (m === st.method) + '">' + NAMES[m] + '</button>').join('');
    $('twofa-tabs').hidden = st.methods.length < 2;
    input.classList.toggle('cx-login-code-wide', st.method === 'recovery');
    input.placeholder = st.method === 'recovery' ? 'XXXXX-XXXXX' : '000000';
    input.maxLength = st.method === 'recovery' ? 11 : 6;
    input.inputMode = st.method === 'recovery' ? 'text' : 'numeric';
    const sendable = st.method === 'email' || st.method === 'telegram';
    resendBtn.hidden = !sendable;
    if (sendable) {
      const left = Math.ceil((st.retryAt - Date.now()) / 1000);
      resendBtn.disabled = left > 0 || st.busy;
      resendBtn.textContent = left > 0 ? 'Resend the code in ' + left + ' s' : 'Resend the code';
    }
  };
  const send = async (m) => {
    st.busy = true; paint();
    try {
      const r = await API.request('POST', '/auth/2fa/send', { session_id: st.session, method: m });
      st.sentAt[m] = Date.now(); st.retryAt = Date.now() + (r.retry_in || 30) * 1000; showErr('');
    } catch (e) {
      showErr(e.message);
      if (/expired|start again/i.test(e.message)) submitBtn.disabled = true;
    } finally { st.busy = false; paint(); }
  };
  const select = async (m) => {
    st.method = m; input.value = ''; showErr(''); paint(); input.focus();
    if ((m === 'email' || m === 'telegram') && !st.sentAt[m]) await send(m);
  };
  const verify = async () => {
    const raw = input.value.trim();
    const code = st.method === 'recovery' ? raw.toUpperCase() : raw.replace(/\D/g, '');
    if (st.method === 'recovery' ? code.replace(/[^A-Z0-9]/g, '').length < 10 : code.length !== 6) { showErr(st.method === 'recovery' ? 'Enter the whole recovery code' : 'Enter the 6-digit code'); return; }
    submitBtn.disabled = true; submitBtn.innerHTML = '<div class="spinner"></div>'; showErr('');
    try {
      await API.verify2fa(st.session, code, { method: st.method, trust_device: $('twofa-trust').checked });
      if (!API.user || (API.user.role !== 'admin' && API.user.role !== 'staff')) { await API.logout(); throw new Error('Access denied.'); }
      clearInterval(st.tick); ov.remove();
      Router.navigate('/admin');
    } catch (e) {
      showErr(e.message);
      submitBtn.disabled = /start the sign-in again|expired session/i.test(e.message);
      submitBtn.textContent = 'Verify';
      input.value = ''; input.focus();
    }
  };
  $('twofa-tabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-m]'); if (b && b.dataset.m !== st.method) select(b.dataset.m); });
  input.addEventListener('input', () => { if (st.method !== 'recovery') { input.value = input.value.replace(/\D/g, ''); if (input.value.length === 6) verify(); } });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); verify(); } });
  submitBtn.addEventListener('click', verify);
  resendBtn.addEventListener('click', () => send(st.method));
  $('twofa-cancel').addEventListener('click', () => { clearInterval(st.tick); ov.remove(); });
  st.tick = setInterval(paint, 1000);
  paint();
  if (data.send_error) showErr('The code could not be sent: ' + data.send_error + (st.methods.length > 1 ? ' Try another method.' : ''));
  input.focus();
}

function _openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'adm-lightbox';
  lb.innerHTML = `<img src="${escHtml(src)}">`;
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
}


function _formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + (dateStr.includes('Z') ? '' : 'Z'));
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


// ============================================================
// 1. #admin — Dashboard: public/js/admin/dashboard.js (since 2026-09-24)
// ============================================================


// admin-users (list, card, API users) moved to public/js/admin/users.js on 25.09.2026.

// ============================================================
// 4. #admin-tickets — Support Tickets
// ============================================================
Router.register('admin-tickets', async (app) => {
  if (!_adminGuard()) return;
  await _loadAdminPendingCounts();

  app.innerHTML = `<div class="app-layout">${renderAdminSidebar('admin-tickets', _adminPendingCounts)}<main class="main-content">
    <div class="page-header">${renderHamburger()}<div class="page-header-text"><h1>Support Tickets</h1><p>Manage user tickets</p></div></div>
    <div class="page-content">
      <div id="ticketView"></div>
      <div id="ticketsPagination" class="adm-pagination"></div>
    </div>
  </main></div>`;

  let currentPage = 1;
  let tSortBy = 'updated_at';
  let tSortDir = 'desc';
  let tStatusFilter = '';
  let tCatFilter = 'all';  // all|general|payment|task|account|bug|warning_appeal|restriction_appeal
  let tSearchDebounce = null;

  function _tSortIcon(col) {
    if (tSortBy !== col) return '<span class="adm-sort-icon">⇅</span>';
    return tSortDir === 'asc' ? '<span class="adm-sort-icon active">▲</span>' : '<span class="adm-sort-icon active">▼</span>';
  }

  async function loadTickets() {
    const search = document.getElementById('ticketSearch')?.value.trim() || '';
    try {
      const catQ = tCatFilter && tCatFilter !== 'all' ? `&cat=${tCatFilter}` : '';
      const data = await API.request('GET', `/admin/tickets?search=${encodeURIComponent(search)}&status=${tStatusFilter}&page=${currentPage}&limit=20&sort=${tSortBy}&dir=${tSortDir}${catQ}`);
      renderTicketList(data.tickets || [], data.total || 0, data.page, data.limit, data.categoryCounts || {});
    } catch (e) {
      showToast('Failed to load tickets: ' + e.message, 'error');
    }
  }

  function renderTicketList(tickets, total, page, limit, categoryCounts) {
    const view = document.getElementById('ticketView');
    const statusCls = (s) => ({ open: 'adm-ts-open', answered: 'adm-ts-answered', closed: 'adm-ts-closed' }[s] || 'adm-ts-closed');
    const statusLabel = (s) => ({ open: 'Pending', answered: 'Answered', closed: 'Closed' }[s] || s);

    const cc = categoryCounts || {};
    // Modern compact chip — rectangular, thin border, monospace count, no emoji.
    const catChip = (key, label, accent) => {
      const n = cc[key] != null ? cc[key] : null;
      const active = tCatFilter === key;
      // outline:none kills the browser's black focus ring (was creating double-border on active)
      const base = 'padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;font-size:12px;font-weight:500;transition:background .12s,border-color .12s,color .12s;white-space:nowrap;display:inline-flex;align-items:center;letter-spacing:0.1px;outline:none;font-family:inherit';
      const activeStyle = base.replace('color:var(--text-muted)', `color:${accent}`).replace('border:1px solid var(--border)', `border:1px solid ${accent}`).replace('background:transparent', `background:${accent}0f`) + ';font-weight:600';
      const countColor = active ? accent : 'var(--text-muted)';
      const countOpacity = active ? '0.85' : '0.55';
      // ml: explicit margin separates label from count (gap was unreliable in some browsers when count is inline)
      const countStyle = `margin-left:8px;font-size:11px;font-weight:600;color:${countColor};opacity:${countOpacity};font-variant-numeric:tabular-nums;letter-spacing:0`;
      return `<button class="adm-tct-v2" data-cat="${key}" style="${active ? activeStyle : base}">${label}${typeof n === 'number' ? `<span style="${countStyle}">${n.toLocaleString('en-US')}</span>` : ''}</button>`;
    };

    // Compact dd.mm.yyyy hh:mm formatting (relative not used — admin needs precise).
    const fmtDate = (iso) => {
      if (!iso) return '—';
      const d = new Date(iso.replace(' ', 'T') + 'Z');
      if (isNaN(d)) return iso;
      const pad = n => String(n).padStart(2, '0');
      return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // Status pill — compact, uppercase, colored dot prefix.
    const statusPill = (st) => {
      const cfg = {
        open:     { color: '#22c55e', label: 'Pending' },
        answered: { color: '#3b82f6', label: 'Answered' },
        closed:   { color: '#6b7280', label: 'Closed' },
      }[st] || { color: '#6b7280', label: st };
      return `<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:4px;border:1px solid ${cfg.color}40;background:${cfg.color}10;color:${cfg.color};font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;font-variant-numeric:tabular-nums"><span style="width:6px;height:6px;border-radius:50%;background:${cfg.color}"></span>${cfg.label}</span>`;
    };

    // Category label (uppercased small text) per ticket.
    const catLabel = (t) => {
      if (t.is_appeal) return '<span style="display:inline-block;padding:2px 6px;border-radius:3px;background:#dc262615;color:#dc2626;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase">WARN APPEAL</span>';
      const cat = (t.category || 'general').toLowerCase();
      const cfg = {
        general: { color: '#3b82f6', label: 'General' },
        payment: { color: '#10b981', label: 'Payment' },
        task:    { color: '#06b6d4', label: 'Task' },
        account: { color: '#8b5cf6', label: 'Account' },
        bug:     { color: '#f59e0b', label: 'Bug' },
        api_key: { color: '#0d9488', label: 'API key' },
      }[cat] || { color: '#71717a', label: cat };
      return `<span style="display:inline-block;padding:2px 6px;border-radius:3px;background:${cfg.color}12;color:${cfg.color};font-size:10px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase">${cfg.label}</span>`;
    };

    const sortIcon = (col) => {
      if (tSortBy !== col) return '<span style="opacity:0.45;font-size:11px;margin-left:5px;color:var(--text-muted)">↕</span>';
      return tSortDir === 'asc'
        ? '<span style="font-size:11px;margin-left:5px;color:var(--accent,#22c55e);font-weight:700">↑</span>'
        : '<span style="font-size:11px;margin-left:5px;color:var(--accent,#22c55e);font-weight:700">↓</span>';
    };

    // Reliable div-grid layout: 7 columns, no <table> reset conflicts.
    const gridCols = '80px 160px 110px 1fr 110px 140px 140px';

    view.innerHTML = `
      <div class="adm-tickets-toolbar" style="display:flex;gap:10px;margin-bottom:14px">
        <input class="adm-search" id="ticketSearch" placeholder="Search by subject, user or ID..." autocomplete="off" value="${escHtml(document.getElementById('ticketSearch')?.value || '')}">
        <select class="adm-search" id="ticketStatusFilter" style="flex:0 0 auto;min-width:130px">
          <option value="">All statuses</option>
          <option value="open" ${tStatusFilter === 'open' ? 'selected' : ''}>Pending</option>
          <option value="answered" ${tStatusFilter === 'answered' ? 'selected' : ''}>Answered</option>
          <option value="closed" ${tStatusFilter === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
      <div class="adm-tickets-cats-v2" style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px;align-items:center">
        ${catChip('all', 'All', '#374151')}
        ${catChip('general', 'General', '#3b82f6')}
        ${catChip('payment', 'Payment / Withdrawal', '#10b981')}
        ${catChip('task', 'Tasks', '#06b6d4')}
        ${catChip('account', 'Account', '#8b5cf6')}
        ${catChip('bug', 'Bug / Error', '#f59e0b')}
        ${catChip('api_key', 'API key', '#0d9488')}
        <span style="display:inline-block;width:1px;height:18px;background:var(--border);margin:0 4px"></span>
        ${catChip('warning_appeal', 'Warning appeals', '#dc2626')}
        ${catChip('restriction_appeal', 'Restriction appeals', '#4ade80')}
      </div>

      ${!tickets.length ? '<div class="adm-empty" style="padding:60px 20px;text-align:center;color:var(--text-muted);font-size:13px;border:1px solid var(--border);border-radius:8px">No tickets found</div>' : `
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--bg-card)">
        <div style="display:grid;grid-template-columns:${gridCols};gap:0;background:var(--bg-muted);border-bottom:1px solid var(--border);padding:0 4px">
          <div class="adm-sortable" data-sort="id" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none">ID${sortIcon('id')}</div>
          <div class="adm-sortable" data-sort="username" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none">User${sortIcon('username')}</div>
          <div style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Category</div>
          <div class="adm-sortable" data-sort="subject" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none">Subject${sortIcon('subject')}</div>
          <div class="adm-sortable" data-sort="status" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none">Status${sortIcon('status')}</div>
          <div class="adm-sortable" data-sort="created_at" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none;text-align:right">Created${sortIcon('created_at')}</div>
          <div class="adm-sortable" data-sort="updated_at" style="padding:11px 8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;cursor:pointer;user-select:none;text-align:right">Updated${sortIcon('updated_at')}</div>
        </div>
        ${tickets.map((t, idx) => `
        <div class="adm-tt-trow" data-tid="${t.id}" style="display:grid;grid-template-columns:${gridCols};gap:0;align-items:center;padding:0 4px;border-bottom:${idx === tickets.length - 1 ? 'none' : '1px solid var(--border)'};cursor:pointer;transition:background .1s" onmouseover="this.style.background='var(--bg-muted)'" onmouseout="this.style.background='transparent'">
          <div style="padding:11px 8px;font-size:13px;color:var(--text-muted);font-family:var(--font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-variant-numeric:tabular-nums">#${t.id}</div>
          <div style="padding:11px 8px;font-size:13px;font-weight:500;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(t.username)}</div>
          <div style="padding:11px 8px">${catLabel(t)}</div>
          <div style="padding:11px 8px;color:var(--text-primary);${t.status === 'open' ? 'font-weight:600' : 'font-weight:400'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(t.subject)}</div>
          <div style="padding:11px 8px">${statusPill(t.status)}</div>
          <div style="padding:11px 8px;text-align:right;color:var(--text-muted);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap">${fmtDate(t.created_at)}</div>
          <div style="padding:11px 8px;text-align:right;color:var(--text-muted);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap">${fmtDate(t.updated_at)}</div>
        </div>`).join('')}
      </div>`}`;

    // Row click → open ticket
    view.querySelectorAll('.adm-tt-trow').forEach(tr => {
      tr.addEventListener('click', () => adminOpenTicket(parseInt(tr.dataset.tid)));
    });

    // Search handlers
    document.getElementById('ticketSearch')?.addEventListener('input', () => {
      clearTimeout(tSearchDebounce);
      tSearchDebounce = setTimeout(() => { currentPage = 1; loadTickets(); }, 400);
    });
    document.getElementById('ticketStatusFilter')?.addEventListener('change', (e) => {
      tStatusFilter = e.target.value;
      currentPage = 1;
      loadTickets();
    });

    // Sort handlers
    view.querySelectorAll('.adm-sortable').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const col = el.dataset.sort;
        if (tSortBy === col) { tSortDir = tSortDir === 'asc' ? 'desc' : 'asc'; }
        else { tSortBy = col; tSortDir = col === 'id' ? 'desc' : (col.includes('_at') ? 'desc' : 'asc'); }
        currentPage = 1;
        loadTickets();
      });
    });

    // Category chip handlers
    view.querySelectorAll('.adm-tct-v2').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        tCatFilter = el.dataset.cat;
        currentPage = 1;
        loadTickets();
      });
    });

    // Pagination
    const totalPages = Math.ceil(total / limit);
    const pagEl = document.getElementById('ticketsPagination');
    if (totalPages <= 1) {
      pagEl.innerHTML = `<span>${total} ticket${total !== 1 ? 's' : ''}</span>`;
    } else {
      pagEl.innerHTML = `
        <button ${page <= 1 ? 'disabled' : ''} onclick="adminTicketsPage(${page - 1})">Prev</button>
        <span>Page ${page} of ${totalPages} (${total})</span>
        <button ${page >= totalPages ? 'disabled' : ''} onclick="adminTicketsPage(${page + 1})">Next</button>`;
    }
  }

  window.adminTicketsPage = function(p) { currentPage = p; loadTickets(); };

  // === OPEN TICKET DETAIL ===
  window.adminOpenTicket = async function(ticketId) {
    const view = document.getElementById('ticketView');
    document.getElementById('ticketsPagination').innerHTML = '';
    view.innerHTML = '<div class="adm-empty">Loading...</div>';

    try {
      const data = await API.request('GET', '/support/tickets/' + ticketId);
      const ticket = data.ticket;
      const msgs = data.messages || [];
      const statusCls = { open: 'adm-ts-open', answered: 'adm-ts-answered', closed: 'adm-ts-closed' }[ticket.status] || 'adm-ts-closed';
      const statusLabel = { open: 'Pending', answered: 'Answered', closed: 'Closed' }[ticket.status] || ticket.status;

      view.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
          <button class="btn btn-secondary" style="padding:6px 12px;font-size:var(--font-sm)" onclick="adminBackToTickets()">‹ Back</button>
        </div>
        <div class="adm-ticket-detail">
          <div class="adm-ticket-detail-main">
            <div class="adm-ticket-detail-header">
              <h3 style="margin:0;font-weight:700;flex:1">${escHtml(ticket.subject)}</h3>
              <span style="color:var(--text-muted);font-size:var(--font-sm)">ID: ${ticket.id}</span>
            </div>

            ${ticket.status !== 'closed' ? `
            <div class="adm-ticket-reply-box">
              <textarea class="form-input" id="adminReplyText" rows="4" placeholder="Type your reply..." maxlength="5000" style="resize:vertical;min-height:80px"></textarea>
              <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
                <button class="btn btn-primary" style="padding:8px 20px;font-size:var(--font-sm)" id="adminReplyBtn" onclick="adminReplyTicket(${ticket.id})">Submit reply</button>
                <button class="btn btn-secondary" style="padding:8px 16px;font-size:var(--font-sm)" onclick="adminCloseTicket(${ticket.id})">Close ticket</button>
                <div class="adm-user-dropdown" style="margin-left:auto">
                  <button class="adm-dropdown-btn" onclick="adminToggleDropdown(event, 'tkt-${ticket.id}')">▾</button>
                  <div class="adm-dropdown-menu" id="dropdown-tkt-${ticket.id}">
                    <div class="adm-dropdown-item adm-dropdown-danger" onclick="adminDeleteTicket(${ticket.id})">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5h12M8 5V3h4v2M6 5v11a1 1 0 001 1h6a1 1 0 001-1V5"/></svg>
                      Delete ticket
                    </div>
                  </div>
                </div>
                <button class="btn btn-secondary" style="padding:8px 12px;font-size:var(--font-xs)" title="Translate reply to user's language" onclick="adminTranslateReply(${ticket.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l4 12M15 4l-4 12M2 12h20M6 4h4M14 20h4"/></svg>
                  AI Translate
                </button>
                <button class="btn btn-accent" style="padding:8px 12px;font-size:var(--font-xs)" title="AI suggests a reply based on ticket context" onclick="adminAISuggest(${ticket.id})" id="aiSuggestBtn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 017 7c0 2.5-1.5 4.5-3 6v2H8v-2c-1.5-1.5-3-3.5-3-6a7 7 0 017-7z"/><path d="M9 21h6"/><path d="M10 17v-1"/><path d="M14 17v-1"/></svg>
                  AI Suggest
                </button>

              </div>
            </div>` : '<div style="color:var(--text-muted);text-align:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm)">Ticket is closed</div>'}

            <div class="adm-thread" id="ticketThread">
              ${msgs.slice().reverse().map(msg => `
              <div class="adm-msg ${msg.is_admin ? 'adm-msg-admin' : 'adm-msg-user'}">
                <div class="adm-msg-header">
                  <strong>${escHtml(msg.username)}</strong>
                  <span style="color:var(--text-muted);font-size:var(--font-xs)">${_formatDate(msg.created_at)}</span>
                </div>
                <div class="adm-msg-text">${escHtml(msg.message).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')}</div>
                ${msg.image_url ? `<div style="margin-top:6px"><img src="${escHtml(msg.image_url)}" style="max-width:320px;max-height:240px;border-radius:8px;cursor:pointer;border:1px solid var(--border)" onclick="_openLightbox(this.src)"></div>` : ''}
                ${!msg.is_admin ? `<button class="adm-translate-btn" data-msg-id="${msg.id}" onclick="adminTranslateMsg(this)">🌐 Translate to RU</button>` : ''}
              </div>`).join('')}
            </div>
          </div>
          <div class="adm-ticket-detail-sidebar">
            ${(() => {
              const ui = data.user_info;
              const statusColor = ui && ui.status === 'suspicious' ? '#f59e0b' : ui && ui.status === 'banned' ? '#ef4444' : ui && ui.status === 'restricted' ? '#a855f7' : '#22c55e';
              const statusBg = ui && ui.status === 'suspicious' ? '#fef3c7' : ui && ui.status === 'banned' ? '#fee2e2' : ui && ui.status === 'restricted' ? '#f3e8ff' : '#dcfce7';
              if (!ui) {
                return `
                <div style="font-weight:700;font-size:var(--font-base);margin-bottom:8px">${escHtml(ticket.username || '')}</div>
                <div style="font-size:var(--font-sm);color:var(--text-muted);margin-bottom:12px">${escHtml(ticket.email || '')}</div>
                <span class="adm-ticket-status ${statusCls}" style="display:inline-block;margin-bottom:12px">${statusLabel}</span>
                <div style="font-size:var(--font-xs);color:var(--text-muted)">Created: ${_formatDate(ticket.created_at)}</div>
                <div style="font-size:var(--font-xs);color:var(--text-muted)">Updated: ${_formatDate(ticket.updated_at)}</div>
                <div style="font-size:var(--font-xs);color:var(--text-muted)">Category: ${escHtml(ticket.category || 'general')}</div>`;
              }
              const wdHas = (ui.withdrawals.pending.c + ui.withdrawals.approved.c + ui.withdrawals.rejected.c) > 0;
              const linkedTotal = (ui.linked_accounts.ip || 0) + (ui.linked_accounts.fingerprint || 0);
              const socialChips = (ui.socials.list || []).map(s => `<span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;background:var(--bg-input);color:var(--text-secondary);margin:1px 2px;">${escHtml(s.platform)}: @${escHtml(s.username)}</span>`).join('');
              return `
              <!-- Top row: username + status pill -->
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:8px;">
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:var(--font-base);overflow:hidden;text-overflow:ellipsis;">${escHtml(ui.username || ticket.username || '')}</div>
                  <div style="font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;">${escHtml(ui.email || ticket.email || '')}</div>
                </div>
                <span style="padding:2px 8px;border-radius:999px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">${escHtml(ui.status)}</span>
              </div>
              <!-- Ticket status / category -->
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">
                <span class="adm-ticket-status ${statusCls}" style="display:inline-block;font-size:10px;">${statusLabel}</span>
                <span style="font-size:10px;color:var(--text-muted);">${escHtml(ticket.category || 'general')}</span>
                ${ui.other_open_tickets > 0 ? `<span style="font-size:10px;background:#fef3c7;color:#92400e;padding:1px 6px;border-radius:4px;font-weight:600;" title="User has other open tickets">+${ui.other_open_tickets} open</span>` : ''}
              </div>
              <!-- Stats grid -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;font-size:var(--font-xs);padding:8px;background:var(--bg-input);border-radius:6px;margin-bottom:10px;">
                <div><span style="color:var(--text-muted);">Balance:</span> <strong>$${(ui.balance / 10000).toFixed(2)}</strong></div>
                <div><span style="color:var(--text-muted);">Joined:</span> <span title="${escHtml(ui.joined_at || '')}">${ui.joined_at ? ui.joined_at.slice(0, 10) : '—'}</span></div>
                <div><span style="color:var(--text-muted);">Approved:</span> <strong style="color:#22c55e;">${ui.tasks.approved}</strong></div>
                <div><span style="color:var(--text-muted);">Rejected:</span> <strong style="color:#ef4444;">${ui.tasks.rejected}</strong></div>
                ${ui.tasks.pending > 0 ? `<div><span style="color:var(--text-muted);">Pending:</span> <strong style="color:#f59e0b;">${ui.tasks.pending}</strong></div>` : '<div></div>'}
                <div><span style="color:var(--text-muted);">Referrals:</span> <strong>${ui.referrals_count}</strong></div>
              </div>
              <!-- Withdrawals -->
              ${wdHas ? `
              <div style="font-size:var(--font-xs);margin-bottom:10px;padding:8px;background:var(--bg-input);border-radius:6px;">
                <div style="font-weight:600;margin-bottom:4px;color:var(--text-secondary);">Withdrawals</div>
                ${ui.withdrawals.pending.c > 0 ? `<div>Pending: <strong style="color:#f59e0b;">${ui.withdrawals.pending.c}</strong> · $${(ui.withdrawals.pending.sum || 0).toFixed(2)}</div>` : ''}
                ${ui.withdrawals.approved.c > 0 ? `<div>Completed: <strong style="color:#22c55e;">${ui.withdrawals.approved.c}</strong> · $${(ui.withdrawals.approved.sum || 0).toFixed(2)}</div>` : ''}
                ${ui.withdrawals.rejected.c > 0 ? `<div>Rejected: <strong style="color:#ef4444;">${ui.withdrawals.rejected.c}</strong> · $${(ui.withdrawals.rejected.sum || 0).toFixed(2)}</div>` : ''}
              </div>` : '<div style="font-size:var(--font-xs);color:var(--text-muted);margin-bottom:10px;">No withdrawals yet</div>'}
              <!-- Warnings -->
              ${ui.warnings.total > 0 ? `
              <div style="font-size:var(--font-xs);margin-bottom:10px;padding:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:6px;">
                <div style="font-weight:600;color:#dc2626;">⚠ Warnings: ${ui.warnings.total}${ui.warnings.last_7d > 0 ? ` (${ui.warnings.last_7d} new in 7d)` : ''}</div>
              </div>` : ''}
              <!-- Social accounts -->
              <div style="font-size:var(--font-xs);margin-bottom:10px;padding:8px;background:var(--bg-input);border-radius:6px;">
                <div style="font-weight:600;margin-bottom:4px;color:var(--text-secondary);">Socials: ${ui.socials.alive} active${ui.socials.deleted > 0 ? `, ${ui.socials.deleted} deleted` : ''}</div>
                <div>${socialChips || '<span style="color:var(--text-muted);">none</span>'}</div>
              </div>
              <!-- Linked accounts (anti-fraud signal) -->
              ${linkedTotal > 0 ? `
              <div style="font-size:var(--font-xs);margin-bottom:10px;padding:8px;background:${linkedTotal >= 5 ? 'rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25)'};border-radius:6px;">
                <div style="font-weight:600;color:${linkedTotal >= 5 ? '#dc2626' : '#d97706'};">Linked accounts: ${linkedTotal}</div>
                <div style="color:var(--text-muted);font-size:10px;">${ui.linked_accounts.ip} by IP, ${ui.linked_accounts.fingerprint} by fingerprint</div>
              </div>` : ''}
              <!-- Footer: links -->
              <div style="margin-top:8px;padding-top:10px;border-top:1px solid var(--border);font-size:var(--font-sm);display:flex;flex-direction:column;gap:4px;">
                <a style="color:var(--accent);cursor:pointer" onclick="event.preventDefault();Router.navigate('/admin-users');setTimeout(()=>{const s=document.getElementById('userSearch');if(s){s.value='${escHtml(ui.username || '')}';s.dispatchEvent(new Event('input'))}},300)">View full profile →</a>
                <a style="color:var(--accent);cursor:pointer;font-size:var(--font-xs);" href="/admin-finance?user=${ui.id}" target="_blank" rel="noopener">Open finance ↗</a>
              </div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">Ticket created: ${_formatDate(ticket.created_at)}</div>`;
            })()}
          </div>
        </div>`;

      // Stage 7c: if ticket is linked to a warning_appeal, render appeal section
      try {
        const appealRes = await fetch('/api/admin/tickets/' + ticket.id + '/appeal', { credentials: 'same-origin' });
        if (appealRes.ok) {
          const ap = await appealRes.json();
          if (ap && ap.appeal) {
            const a = ap.appeal;
            const main = view.querySelector('.adm-ticket-detail-main');
            if (main) {
              const card = document.createElement('div');
              card.style.cssText = 'background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.3);border-radius:8px;padding:14px;margin-bottom:14px';
              const buttons = (a.appeal_status === 'pending')
                ? '<div style="display:flex;gap:8px"><button onclick="adminApproveAppeal(' + a.warning_id + ',' + ticket.id + ')" style="padding:8px 16px;background:#22c55e;color:#fff;border:0;border-radius:6px;cursor:pointer;font-weight:600">Approve appeal</button><button onclick="adminDenyAppeal(' + a.warning_id + ',' + ticket.id + ')" style="padding:8px 16px;background:transparent;color:#dc2626;border:1px solid #dc2626;border-radius:6px;cursor:pointer">Deny appeal</button></div>'
                : '<div style="font-size:12px;color:var(--text-muted)">Already ' + a.appeal_status + '</div>';
              card.innerHTML = '<div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#dc2626">⚠ Warning Appeal</div>' +
                '<div style="font-size:13px;margin-bottom:8px"><strong>' + escHtml(a.category || a.reason) + '</strong> · warning #' + a.warning_id + ' · user #' + a.user_id + '</div>' +
                '<div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">Status: ' + a.appeal_status + '</div>' +
                buttons;
              main.insertBefore(card, main.firstChild.nextSibling);
            }
          }
        }
      } catch (_) { /* silent — non-appeal ticket */ }
    } catch (e) {
      showToast('Failed to load ticket: ' + e.message, 'error');
      loadTickets();
    }
  };

  window.adminApproveAppeal = async function(warnId, ticketId) {
    if (!confirm('Approve appeal? Warning will be removed and ticket closed.')) return;
    try {
      await API.request('POST', '/admin/warnings/' + warnId + '/appeal/approve');
      try { await API.request('POST', '/support/tickets/' + ticketId + '/close'); } catch (_) {}
      showToast('Appeal approved', 'success');
      window.adminOpenTicket(ticketId);
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.adminDenyAppeal = async function(warnId, ticketId) {
    if (!confirm('Deny appeal? Warning stays. User can try again in 24h.')) return;
    try {
      await API.request('POST', '/admin/warnings/' + warnId + '/appeal/deny');
      try { await API.request('POST', '/support/tickets/' + ticketId + '/close'); } catch (_) {}
      showToast('Appeal denied (24h cooldown)', 'success');
      window.adminOpenTicket(ticketId);
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.adminBackToTickets = function() { loadTickets(); };

  window.adminReplyTicket = async function(ticketId) {
    const textarea = document.getElementById('adminReplyText');
    const message = textarea?.value.trim();
    if (!message) return showToast('Type a message', 'error');
    const btn = document.getElementById('adminReplyBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    try {
      await API.request('POST', '/admin/tickets/' + ticketId + '/reply', { message });
      showToast('Reply sent', 'success');
      window.adminOpenTicket(ticketId);
    } catch (e) {
      showToast(e.message, 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Submit reply'; }
    }
  };

  window.adminCloseTicket = async function(ticketId) {
    if (!confirm('Close this ticket?')) return;
    try {
      await API.request('POST', '/support/tickets/' + ticketId + '/close');
      showToast('Ticket closed', 'success');
      window.adminOpenTicket(ticketId);
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.adminDeleteTicket = async function(ticketId) {
    if (!confirm('Delete this ticket permanently?')) return;
    try {
      await API.request('DELETE', '/admin/tickets/' + ticketId);
      showToast('Ticket deleted', 'success');
      loadTickets();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // AI Translate: user message → Russian (gets text from sibling .adm-msg-text)
  window.adminTranslateMsg = async function(btn) {
    const msgDiv = btn.parentElement.querySelector('.adm-msg-text');
    const text = msgDiv ? msgDiv.textContent : '';
    if (!text) return;
    btn.textContent = '⏳ Translating...';
    btn.disabled = true;
    try {
      const data = await API.request('POST', '/admin/tickets/0/translate', { text, targetLang: 'ru' });
      const div = document.createElement('div');
      div.style.cssText = 'margin-top:6px;padding:6px 10px;background:rgba(34,197,94,0.08);border-radius:6px;font-size:var(--font-sm);color:var(--text-primary);border-left:3px solid var(--accent)';
      div.textContent = '🇷🇺 ' + data.translated;
      btn.parentElement.insertBefore(div, btn.nextSibling);
      btn.textContent = '✓ Translated';
    } catch (e) {
      btn.textContent = '❌ Error';
      btn.disabled = false;
      showToast(e.message, 'error');
    }
  };

  // AI Translate: admin reply → user's language (auto-detect from last user message)
  function adminAiSuggestMeta(meta, ticketId) {
    if (!meta) return '';
    const tplTitle = meta.template ? meta.template.title : null;
    const chips = [];
    if (tplTitle) chips.push('<span style="background:#eef2ff;color:#3730a3;padding:2px 8px;border-radius:6px;font-size:11px">Template: ' + tplTitle + '</span>');
    if (meta.extracted_withdrawal_id) chips.push('<span style="background:#ecfdf5;color:#065f46;padding:2px 8px;border-radius:6px;font-size:11px">Detected ID: #' + meta.extracted_withdrawal_id + '</span>');
    if (meta.auto_queued) {
      const wid = meta.auto_queued.withdrawal_id;
      const fresh = meta.auto_queued.just_created;
      chips.push('<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600">✓ ' + (fresh ? 'Auto-queued' : 'Already in queue') + ' — withdrawal #' + wid + ' → <a href="/admin-finance#speedup" target="_blank" rel="noopener" style="color:#166534;text-decoration:underline">Speed Up</a></span>');
    }
    if (meta.manual_review_required) chips.push('<span style="background:#fef2f2;color:#b91c1c;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600">⚠ Manual review needed</span>');

    let panel = '';
    if (meta.manual_review_required) {
      const noteText = (meta.admin_note || 'AI could not extract the withdrawal ID — verify from the user message or screenshot, or proceed without priority.').replace(/"/g,'&quot;');
      panel = `
        <div id="adminPriorityPanel" data-ticket="${ticketId}" style="margin-top:10px;border:1px solid #fcd34d;background:#fffbeb;border-radius:10px;padding:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:16px">🔍</span>
            <strong style="font-size:13px;color:#92400e">Action needed — withdrawal ID for priority queue</strong>
          </div>
          <div style="font-size:12px;color:#78350f;line-height:1.45;margin-bottom:10px">${noteText}</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <input type="text" id="adminPriorityInput" placeholder="Withdrawal ID (digits or hash)" style="flex:1;min-width:180px;padding:8px 10px;border:1px solid #d4d4d8;border-radius:8px;font-size:13px">
            <button type="button" onclick="adminPrioritySubmit()" style="padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">→ Send to priority queue</button>
            <button type="button" onclick="adminPriorityNoId()" style="padding:8px 14px;background:transparent;color:#6b7280;border:1px solid #d4d4d8;border-radius:8px;cursor:pointer;font-size:13px">No ID found</button>
          </div>
          <div id="adminPriorityStatus" style="margin-top:8px;font-size:12px;color:#15803d;display:none"></div>
        </div>`;
    } else if (meta.admin_note) {
      // Non-blocking note for non-payment categories
      chips.push('<span style="display:block;margin-top:6px;color:#b45309;font-size:12px"><strong>Admin note:</strong> ' + meta.admin_note + '</span>');
    }

    const chipsHtml = chips.length ? '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center">' + chips.join('') + '</div>' : '';
    if (!chipsHtml && !panel) return '';
    return '<div id="aiSuggestMeta">' + chipsHtml + panel + '</div>';
  }

  // Lock the Close button until the agent either submits an ID or marks no-ID
  function adminPriorityLockClose(lock) {
    const closeBtn = document.querySelector('.adm-thread, button[onclick*="adminCloseTicket"]');
    // Find by text 'Close ticket' near the reply area
    const allBtns = document.querySelectorAll('button');
    allBtns.forEach(b => {
      if (/Close ticket/i.test(b.textContent || '')) {
        if (lock) {
          b.dataset.lockedByPriority = '1';
          b.disabled = true;
          b.title = 'Enter the withdrawal ID for priority queue, or click "No ID found".';
          b.style.opacity = '0.45';
          b.style.cursor = 'not-allowed';
        } else if (b.dataset.lockedByPriority === '1') {
          delete b.dataset.lockedByPriority;
          b.disabled = false;
          b.title = '';
          b.style.opacity = '';
          b.style.cursor = '';
        }
      }
    });
  }

    // Thin wrapper: surface 409 body as e.data so the UI can read suggested_reply
  async function _adminPostExposeBody(path, body) {
    const res = await fetch('/api' + path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const err = new Error((data && (data.message || data.error)) || ('HTTP ' + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  window.adminPrioritySubmit = async function() {
    const panel = document.getElementById('adminPriorityPanel');
    if (!panel) return;
    const ticketId = panel.dataset.ticket;
    const input = document.getElementById('adminPriorityInput');
    const val = (input?.value || '').trim();
    if (!val) { showToast('Enter the withdrawal ID first', 'error'); input?.focus(); return; }
    const statusEl = document.getElementById('adminPriorityStatus');
    try {
      const data = await _adminPostExposeBody('/admin/withdrawals/priority', { ticket_id: parseInt(ticketId, 10), withdrawal_id_text: val, reason: 'manual' });
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = '✓ Queued for speed-up' + (data.resolved_withdrawal_id ? ' — resolved to <strong>withdrawal #' + data.resolved_withdrawal_id + '</strong>' : ' (raw text saved)');
      }
      input.disabled = true;
      adminPriorityLockClose(false);
      showToast('Sent to priority queue', 'success');
    } catch (e) {
      // Special case: withdrawal already queued — offer one-click ack reply
      const m = (e.message || '').toLowerCase();
      const alreadyMsg = /already.*queue|already_queued/.test(m);
      const suggested = e.data && e.data.suggested_reply;
      if (alreadyMsg && suggested) {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.color = '#b45309';
          statusEl.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span>⚠ This withdrawal is already in the priority queue.</span>
              <button id="aiSuggestedReplyBtn" type="button" style="padding:6px 12px;background:#0ea5e9;color:#fff;border:0;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Use queued-ack reply →</button>
            </div>`;
          const btn = document.getElementById('aiSuggestedReplyBtn');
          if (btn) btn.onclick = () => {
            const ta = document.getElementById('adminReplyText');
            if (ta) {
              ta.value = suggested;
              ta.style.height = 'auto';
              ta.style.height = ta.scrollHeight + 'px';
              ta.focus();
            }
            showToast('Reply inserted — review and submit', 'success');
            adminPriorityLockClose(false);
          };
        }
        return;
      }
      showToast('Failed: ' + (e.message || 'error'), 'error');
    }
  };

  window.adminPriorityNoId = function() {
    const panel = document.getElementById('adminPriorityPanel');
    if (!panel) return;
    const statusEl = document.getElementById('adminPriorityStatus');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#6b7280';
      statusEl.textContent = 'Proceeding without priority queue — Close is enabled.';
    }
    document.getElementById('adminPriorityInput').disabled = true;
    adminPriorityLockClose(false);
  };

  window.adminAISuggest = async function(ticketId) {
    const btn = document.getElementById('aiSuggestBtn');
    if (!btn) return;
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ AI thinking...';
    // Clear any prior meta block
    const oldMeta = document.getElementById('aiSuggestMeta');
    if (oldMeta) oldMeta.remove();
    try {
      const data = await API.request('POST', '/admin/tickets/' + ticketId + '/ai-suggest', {});
      if (!data.suggestion) throw new Error('AI returned empty response');
      const ta = document.getElementById('adminReplyText');
      if (ta) {
        ta.value = data.suggestion;
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      }
      // Render meta-info (template / detected ID / manual-review badge)
      const metaHtml = adminAiSuggestMeta(data.meta, ticketId);
      if (metaHtml && ta && ta.parentNode) {
        ta.insertAdjacentHTML('afterend', metaHtml);
      }
      if (data.meta && data.meta.manual_review_required) {
        adminPriorityLockClose(true);
      }
      showToast('AI reply ready' + (data.meta && data.meta.manual_review_required ? ' — action needed' : ''), data.meta && data.meta.manual_review_required ? 'warning' : 'success');
    } catch (e) {
      showToast('AI suggest failed: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  };

  window.adminTranslateReply = async function(ticketId) {
    const textarea = document.getElementById('adminReplyText');
    const text = textarea?.value.trim();
    if (!text) return showToast('Write your reply first', 'error');
    // Get last user message to detect their language
    const thread = document.getElementById('ticketThread');
    const userMsgs = thread?.querySelectorAll('.adm-msg-user .adm-msg-text');
    const lastUserMsg = userMsgs?.length ? userMsgs[userMsgs.length - 1].textContent : '';
    if (!lastUserMsg) return showToast('No user messages to detect language', 'error');

    try {
      // Send both admin text and user sample — server detects language and translates
      const data = await API.request('POST', '/admin/tickets/0/translate', { text, targetLang: 'auto', userSample: lastUserMsg });
      textarea.value = data.translated;
      showToast('Translated to user\'s language', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  loadTickets();
});


// admin-ai-support: the address of the old AI console, which AI Support replaced on 16.10.2026 (public/js/admin/support-brain.js)
Router.register('admin-ai-support', async () => {
  if (typeof Router.go === 'function') { Router.go('/admin-support-brain'); return; }
  location.replace('/admin-support-brain');
});

Router.register('admin-settings', async (app) => {
  if (!_adminGuard()) return;
  await _loadAdminPendingCounts();

  app.innerHTML = `<div class="app-layout">${renderAdminSidebar('admin-settings', _adminPendingCounts)}<main class="main-content">
    <div class="page-header">${renderHamburger()}<div class="page-header-text"><h1>Settings</h1><p>The switches and numbers that have no page of their own. What has a page is linked here, not repeated; every change goes to the audit log.</p></div></div>
    <div class="page-content">
      <div id="settingsList"><div class="adm-empty">Loading settings...</div></div>
    </div>
  </main></div>`;

  // ---- Settings (rewritten 06.11.2026; the owner: «приберись, чтобы было понятно по навигации, всё актуально и рабочее») ----
  // The switches and numbers that have no page of their own, by groups, each with the page it affects. What has a page is linked
  // here, not repeated (a second place to change the same thing is a trap). Eleven switches of the old console that no code reads
  // are hidden (DEAD). Secrets never reach the page: the route masks them and only a new value is sent. Every other key of the table
  // sits behind «Every other key» with a search and a hint of where it belongs; the marks the site keeps for itself are read-only.
  // Every change goes to the audit log (routes/admin.js POST /settings).
  const NET = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'X', telegram: 'Telegram', threads: 'Threads', facebook: 'Facebook', linkedin: 'LinkedIn', reddit: 'Reddit', github: 'GitHub', snapchat: 'Snapchat', pinterest: 'Pinterest', max: 'MAX', likee: 'Likee', discord: 'Discord', twitch: 'Twitch', spotify: 'Spotify', vk: 'VK', kick: 'Kick' };
  const SECRET = /key|pass|secret|token/i;
  const DEAD = /^(maintenance_mode|registration_enabled|orders_enabled|withdrawals_enabled|support_enabled|platform_(instagram|youtube|tiktok|telegram|twitter)|prm4u_sync_interval|worker_hourly_platform_limit|worker_limit_[a-z0-9_]+)$/;
  const INTERNAL = /(_at|_cursor|_floor|_since|_first_day|_seen|_snapshot|_prices|_balance|_hash)$|^(trust_checks_from|partner_daily_cursor|api_key_hourly_)/;
  // the limits of a network and an action and the pace of an order are edited on Supply → Limits only (12.11.2026): not listed here
  const LIMIT_KEYS = /^(worker_hourly_limit_|worker_daily_limit_|worker_net_hourly_limit_|worker_net_daily_limit_|drip_)/;
  const L = (route, name) => '<a class="adm-set-link" href="/' + route + '">' + escHtml(name) + '</a>';
  const GROUPS = [
    { id: 'site', title: 'Site', lead: 'What the site lets people do.', links: [['admin-api', 'Public API']], keys: [
      ['tasks_enabled', 'Tasks', 'People can take tasks. Off: the feed is empty and a start answers «paused»; the tasks already sent are checked and paid as usual.', 'toggle'],
      ['public_api_key_selfservice', 'Keys made in the cabinet', 'A person makes an API key, or a new one in place of theirs, in the Developer area. Off: keys come from Support.', 'toggle'],
      ['public_api_key_reveal', 'Show a key in the cabinet', 'The Developer area shows the person’s own key of the Worker API. Off: the person pastes the key Support gave.', 'toggle'],
      ['door_unchecked_signin', 'Sign-in when the «not a robot» check fails', 'A browser the account has been signed in from goes on with the password alone when the check does not work in it. A browser the account does not know is still asked for the check. Off: nobody signs in without the check.', 'toggle'],
      ['door_unchecked_letter', 'Password letter when the check fails', 'The letter with a new password is sent without the check: 5 requests of an address in 15 minutes and 120 such letters of the site in an hour, then the check is asked for. Off: no letter without the check.', 'toggle'],
      ['door_mail_refuse', 'Refuse throwaway mail', 'A new account, or a new email of an account, with an address of a refused mail service is refused with «This email service is not accepted»: the services of the list below and about 10,000 known throwaway ones. Off: every address is taken.', 'toggle'],
      ['door_mail_refused_domains', 'Refused mail services', 'One domain a line; a domain refuses its subdomains too. It starts with the domains of the farms banned on 11-16.11 and the throwaway services they used.', 'list'],
      ['door_mail_allowed_domains', 'Allowed mail services', 'Taken even when a list refuses them. One domain a line.', 'list'],
      ['door_mail_refuse_new', 'Refuse a new farm domain by itself', 'A domain that gives the number below of new accounts within an hour goes on the list by itself: the next account is refused and you get a message in Telegram. Gmail, Yahoo, Outlook, iCloud and the other known services and the domains of states never go on the list this way; a domain that looks like a school is counted like any other (a real school is taken back by «Allowed mail services»). Works while «Refuse throwaway mail» is on.', 'toggle'],
      ['door_mail_refuse_new_hour', 'Accounts in an hour that put a domain on the list', 'Counted over the last hour, for one mail domain.', 'number'],
      ['farm_device_block', 'Block the devices of banned farms', 'A sign-up from a device where nearly every account is banned already is refused (the person sees the words of a failed check «not a robot»: the reason is not told), and a new account that signs in from such a device is banned at once. You get a message in Telegram, once an hour at the most. Older accounts, admins, trusted accounts and customers are never touched. Off: nothing is refused, the log only says what would have been.', 'toggle'],
      ['farm_device_min_accounts', 'Accounts on a device to judge it', 'A device is judged only when at least this many other accounts were seen on it (10).', 'number'],
      ['farm_device_banned_pct', 'Banned accounts on the device, %', 'The device is a farm’s when at least this share of those accounts is banned (80).', 'number'],
      ['farm_device_new_hours', 'An account is new for, hours', 'Only an account younger than this is banned for signing in from such a device (72).', 'number'],
      ['start_instead', 'Another task instead of «All places are taken»', 'A person presses Start on a task whose last places were taken a moment ago: the site gives another task of the same network and action that pays no less, from the person’s own list, and the window shows it. A comment task is never swapped. Off: the person sees «All places are taken» and presses again.', 'toggle'],
      ['next_task_hold', 'The next task is kept for the person', 'After a task is sent or confirmed the site names the task to take next — the best paid of the person’s own list among the orders with room — and keeps a place of it for the person for 90 seconds; «Next task» opens it, and its start cannot be refused for want of a place. The list stays for those who choose themselves. Off: «Next task» opens the next row of the list.', 'toggle'] ] },
    { id: 'orders', title: 'Orders and prices', lead: 'Orders made on the site. The price of each item and the days of its guarantee: Services → Catalog.', links: [['admin-catalog', 'Catalog'], ['admin-economics', 'Economics']], keys: [
      ['platform_margin', 'Platform margin', 'A buyer pays the people’s pay × this (2 = twice).', 'number'],
      ['guarantee_price_x', 'Guarantee price ×', 'An order with the guarantee costs its price × this.', 'number'],
      ['site_custom_comments', 'Own texts of comments', 'Buyers may send their own texts of comments. Off: the site gives its prepared texts in the chosen language.', 'toggle'],
      ['site_people_targeting', 'Audience of a campaign', 'Buyers may choose the countries, cities, languages, sex, ages and phones of the people who do their campaign.', 'toggle'],
      ['min_order_count', 'Smallest order, actions', 'An order from the site cannot ask for fewer.', 'number'],
      ['max_order_count', 'Largest order, actions', 'An order from the site cannot ask for more.', 'number'],
      ['refill_open_max', 'Refill orders in the feed at a time', 'A refill makes one small order for each original order. They wait in a line and enter the people’s feed so that at most this many are open at a time (300): thousands of small orders at once make the site slow for everybody. 0 holds the line. How many wait: Verify Center → Instagram check.', 'number'],
      ['refill_line_hours', 'Refill line works at, hours', 'Thailand time, «from-to». 1-11: refill orders enter the feed from 01:00 to 11:00 and wait through the busy hours, when small orders at the top of everybody’s list are gone in seconds and a third of all starts end with «All places are taken». Empty: at any hour.', 'text'] ] },
    { id: 'tasks', title: 'Tasks and limits', lead: 'How much one person may do — the limits an hour and a day of every network and action, the tasks a day, the pauses, the pace of an order — is on one page of its own: Supply → Limits. The Telegram app and the software fleets have their own limits on their pages.', links: [['admin-limits', 'Limits'], ['admin-verify', 'Verify Center']], keys: [],
      elsewhere: [['daily_task_limit', 'Tasks a day, per person', 'admin-limits', 'Supply → Limits'], ['min_completion_time', 'Seconds before a screenshot', 'admin-limits', 'Supply → Limits'], ['task_cooldown_sec', 'Pause between two tasks', 'admin-limits', 'Supply → Limits'],
        ['max_task_attempts', 'Attempts per task', 'admin-verify', 'Verify Center → Checks'], ['feature_auto_restrict_enabled', 'Restriction after four warnings', 'admin-ip-matches', 'Multi-accounts']] },
    { id: 'money', title: 'Money', lead: 'Payouts, top-ups and the hand of the admin. The keys of Antilopay and their check: Money → Antilopay.', links: [['admin-finance', 'Finance'], ['admin-funds', 'Top-ups'], ['admin-antilopay', 'Antilopay']], keys: [
      ['withdrawal_hold_minutes', 'Payout hold, minutes', 'A payout waits this long after the request (1440 = 24 hours). Also set in Finance → Auto-payout.', 'number'],
      ['min_withdrawal', 'Smallest payout, $', 'For the crypto ways; each way has its own floor in code (USDT and TON $2, TRX $5).', 'number'],
      ['withdrawal_fee_pct', 'Payout fee, %', 'Taken from every crypto payout.', 'number'],
      ['withdrawal_fee_usd_usdt_ton', 'USDT (TON) network fee, $', 'Taken from a payout in USDT on TON.', 'number'],
      ['withdrawal_fee_usd_toncoin', 'GRAM (Toncoin) network fee, $', 'Taken from a payout in GRAM.', 'number'],
      ['topups_enabled', 'Top-ups', 'Buyers can add money. Off: the top-up page says so.', 'toggle'],
      ['topup_fastpay_min', 'Crypto top-up, least $', '', 'number'], ['topup_fastpay_max', 'Crypto top-up, most $', '', 'number'],
      ['topup_prm4u_min', 'Transfer from PRM4U, least $', '', 'number'], ['topup_prm4u_max', 'Transfer from PRM4U, most $', '', 'number'],
      ['topup_card_enabled', 'Card top-ups (Antilopay)', '', 'toggle'], ['topup_card_min', 'Card top-up, least $', '', 'number'], ['topup_card_max', 'Card top-up, most $', '', 'number'],
      ['withdraw_card_enabled', 'Payouts to bank cards (Antilopay)', '', 'toggle'], ['withdrawal_fee_pct_card_rub', 'Card payout fee, %', '', 'number'], ['withdraw_card_min_rub', 'Card payout, least RUB', '', 'number'],
      ['card_rub_topup_markup_pct', 'Card top-up rate markup, %', 'On top of the exchange rate the site reads.', 'number'], ['card_rub_payout_markup_pct', 'Card payout rate markup, %', '', 'number'], ['card_rub_rate_fixed', 'Fixed RUB rate', '0: the rate the site reads.', 'number'],
      ['adjust_max_usd', 'Change of a balance by hand, most $', 'Users → a person → the balance.', 'number'], ['adjust_confirm_usd', 'Change by hand, typed again from $', 'A sum of this or more is typed a second time.', 'number'] ],
      elsewhere: [['ref_commission_pct', 'Referral commission, %', 'admin-referrals', 'Referrals']] },
    { id: 'shots', title: 'Screenshots', lead: 'The screenshots of tasks: how long they stay, how they shrink and when they move to the storage box. The disk and the box: Backups.', links: [['admin-backups', 'Backups']], keys: [
      ['shot_store_enabled', 'Storage box', 'Approved screenshots are shrunk and moved off the server an hour after the approval, the rest after a day; the site reads them from the box.', 'toggle'],
      ['shot_store_target', 'Storage box address', 'user@host:port of the box (the key is on the server, never here).', 'text'],
      ['screenshot_upload_effort', 'Packing at hand-in, effort 0–6', 'How hard the site tries when it packs a screenshot a person hands in. Lower is cheaper for the processor and a little heavier on the disk: 2 is 76 KB where 4 is 73 KB, in 0.57 of the time.', 'number'],
      ['screenshot_offload_after_hours', 'Move approved after, hours', 'An approved screenshot goes to the box this long after its approval.', 'number'],
      ['screenshot_archive_after_days', 'Shrink after, days', 'A screenshot that is not approved stays as sent this long (the model and the moderators read it), then is shrunk and moved.', 'number'],
      ['screenshot_archive_width', 'Kept width, px', '', 'number'], ['screenshot_archive_quality', 'Kept quality, 10–80', '', 'number'],
      ['screenshot_archive_effort', 'Packing for the box, effort 0–6', 'The same for the copy kept in the box: 2 gives the same size as 4 in 0.7 of the time.', 'number'],
      ['screenshot_offload_threads', 'Shrunk at once, 1–8', 'Files the screenshot process shrinks at once while the processor is free; it takes fewer by itself while the site needs it.', 'number'],
      ['screenshot_offload_raw_below_gb', 'Move unshrunk below, GB free', 'With less room than this on the disk, screenshots go to the box as they are: fast, but seven times heavier there. 0: never.', 'number'],
      ['screenshot_retention_days_regular', 'Keep, ordinary task, days', 'A screenshot of a judged ordinary task.', 'number'],
      ['screenshot_retention_days', 'Keep, premium or waiting task, days', 'A premium task and a task still waiting for review; never shorter than the ordinary one.', 'number'] ] },
    { id: 'email', title: 'Email', lead: 'The server the letters go out through. The letters themselves and the mailings: Mailings.', links: [['admin-mailings', 'Mailings']], keys: [
      ['smtp_host', 'SMTP host', '', 'text'], ['smtp_port', 'SMTP port', '', 'number'], ['smtp_user', 'SMTP user', '', 'text'], ['smtp_pass', 'SMTP password', '', 'secret'], ['smtp_from', 'From address', 'As people see it: Name <address>.', 'text'],
      ['email_verification_required', 'Confirmed email for a payout', 'A payout needs the address confirmed.', 'toggle'] ] },
    { id: 'integrations', title: 'Integrations', lead: 'The keys and switches of outside services. The AI check, its models and keys live in the Verify Center; the TikHub readers and their health in Verify Center → Profile ownership; the balance in TikHub Costs.',
      links: [['admin-prm4u', 'Services'], ['admin-providers', 'Link checks'], ['admin-verify?tab=models', 'Models and keys'], ['admin-verify?tab=profiles', 'TikHub readers'], ['admin-tikhub-costs', 'TikHub Costs']], keys: [
      ['prm4u_api_url', 'PRM4U API address', '', 'text'], ['prm4u_api_key', 'PRM4U API key', 'The orders of the panel come with it.', 'secret'], ['prm4u_sync_enabled', 'Orders from PRM4U', 'The pull of new orders every minute. Off: nothing new comes in.', 'toggle'],
      ['start_count_enabled', 'Start count', 'The count of a link before an order is given out (the providers per service: Link checks).', 'toggle'],
      ['rapidapi_key', 'RapidAPI key', 'The old Instagram start count; the TikHub one is on Link checks.', 'secret'], ['rapidapi_ig_host', 'RapidAPI Instagram host', '', 'text'] ],
      elsewhere: [['openai_api_key', 'OpenAI and Anthropic keys, the models, the AI check', 'admin-verify?tab=models', 'Verify Center → Models and keys']] },
  ];
  const KNOWN = new Set(GROUPS.flatMap((g) => g.keys.map((k) => k[0]).concat((g.elsewhere || []).map((k) => k[0]))));
  const WHERE = [[/^trust_/, 'Verify Center → Social Score', 'admin-verify?tab=trust'], [/^(igfc_|ig_follow)/, 'Verify Center → Instagram check', 'admin-verify?tab=igcheck'], [/^(ttfc_|tt_follow)/, 'Verify Center → TikTok check', 'admin-verify?tab=ttcheck'],
    [/^verify_/, 'Verify Center', 'admin-verify'], [/^(papi_|public_api|api_price_|api_key_)/, 'Public API', 'admin-api'], [/^(support_brain_|ai_tickets_|restriction_bot_|ai_agent_|ai_support)/, 'AI Support', 'admin-support-brain'],
    [/^tikhub_/, 'TikHub Costs', 'admin-tikhub-costs'], [/^backup_/, 'Backups', 'admin-backups'], [/^(antilopay_|topup_|withdraw|payments_|card_rub)/, 'Money', 'admin-finance'], [/^(prm4u_|service_|combo_|subs_)/, 'Services', 'admin-prm4u'],
    [/^(start_count|xpoz|link_check)/, 'Link checks', 'admin-providers'], [/^(mail|smtp|letter)/, 'Mailings', 'admin-mailings'], [/^(ref_|contest)/, 'Referrals and contests', 'admin-referrals'], [/^(one_account|unlink|early_unlink)/, 'Verify Center → Profile ownership', 'admin-verify?tab=profiles'],
    [/^ai_/, 'Verify Center → Models and keys', 'admin-verify?tab=models'], [/^(surf|ww_|web_worker|app_|fleet_)/, 'Supply: Surfing, Web Worker, App Fleet', ''], [/^(shot_|screenshot_)/, 'Settings → Screenshots', '']];
  const whereOf = (key) => { for (const [re, name, route] of WHERE) if (re.test(key)) return route ? L(route, name) : escHtml(name); return ''; };
  const isOn = (v) => v === 'true' || v === '1' || v === true;
  let allSettings = {};

  const rowToggle = (key, label, desc, v) => '<div class="adm-setting-row" data-key="' + escHtml(key) + '"><div class="adm-setting-info"><div class="adm-setting-key">' + escHtml(label) + '</div><div class="adm-setting-desc">' + escHtml(desc || '') + '</div></div>'
    + '<label class="adm-toggle"><input type="checkbox"' + (isOn(v) ? ' checked' : '') + ' onchange="adminUpdateSetting(\'' + escHtml(key) + '\', this.checked ? \'1\' : \'0\')"><span class="adm-toggle-track"></span></label></div>';
  const rowText = (key, label, desc, v, num) => '<div class="adm-setting-row" data-key="' + escHtml(key) + '"><div class="adm-setting-info"><div class="adm-setting-key">' + escHtml(label) + '</div><div class="adm-setting-desc">' + escHtml(desc || '') + '</div></div>'
    + '<input class="adm-setting-text-input' + (num ? ' adm-set-num' : '') + '" type="text"' + (num ? ' inputmode="decimal"' : '') + ' value="' + escHtml(String(v == null ? '' : v)) + '" data-key="' + escHtml(key) + '" onchange="adminUpdateSetting(\'' + escHtml(key) + '\', this.value)" onkeydown="if(event.key===\'Enter\'){adminUpdateSetting(\'' + escHtml(key) + '\', this.value)}"></div>';
  // a secret: the route sends a mask with the last four signs; a new value goes only when typed
  const rowSecret = (key, label, desc, v) => '<div class="adm-setting-row adm-set-secret" data-key="' + escHtml(key) + '"><div class="adm-setting-info"><div class="adm-setting-key">' + escHtml(label) + '</div><div class="adm-setting-desc">' + escHtml(desc || '') + (desc ? ' ' : '') + (v ? 'Set, ends with ' + escHtml(String(v).slice(-4)) + '.' : 'Not set.') + '</div></div>'
    + '<span class="adm-set-secret-f"><input class="adm-setting-text-input" type="password" autocomplete="new-password" placeholder="' + (v ? 'new value' : 'value') + '" data-key="' + escHtml(key) + '" onkeydown="if(event.key===\'Enter\'){adminUpdateSetting(\'' + escHtml(key) + '\', this.value); this.value=\'\'}"><button type="button" class="btn-sm" onclick="var i=this.previousElementSibling; if(i.value){adminUpdateSetting(\'' + escHtml(key) + '\', i.value); i.value=\'\'}">Save</button></span></div>';
  const rowElsewhere = (key, label, route, where) => '<div class="adm-setting-row adm-set-else" data-key="' + escHtml(key) + '"><div class="adm-setting-info"><div class="adm-setting-key">' + escHtml(label) + '</div><div class="adm-setting-desc">Edited in ' + L(route, where) + '.</div></div><span class="adm-set-now">' + (allSettings[key] == null || allSettings[key] === '' ? '<span class="dim">—</span>' : (/^(0|1)$/.test(String(allSettings[key])) ? (isOn(allSettings[key]) ? 'on' : 'off') : escHtml(String(allSettings[key]).slice(0, 24)))) + '</span></div>';
  // a list: one value a line, saved when the field is left (16.11.2026: the refused mail services)
  const rowList = (key, label, desc, v) => '<div class="adm-setting-row adm-set-listrow" data-key="' + escHtml(key) + '"><div class="adm-setting-info"><div class="adm-setting-key">' + escHtml(label) + '</div><div class="adm-setting-desc">' + escHtml(desc || '') + '</div></div>'
    + '<textarea class="adm-setting-text-input adm-set-list" rows="6" spellcheck="false" autocapitalize="none" aria-label="' + escHtml(label) + '" data-key="' + escHtml(key) + '" onchange="adminUpdateSetting(\'' + escHtml(key) + '\', this.value)">' + escHtml(String(v == null ? '' : v)) + '</textarea></div>';
  const rowOf = ([key, label, desc, type]) => (type === 'toggle' ? rowToggle(key, label, desc, allSettings[key]) : type === 'secret' ? rowSecret(key, label, desc, allSettings[key]) : type === 'list' ? rowList(key, label, desc, allSettings[key]) : rowText(key, label, desc, allSettings[key], type === 'number'));

  function renderSettings(settings) {
    allSettings = settings;
    const container = document.getElementById('settingsList');
    let html = '<nav class="adm-set-nav">' + GROUPS.map((g) => '<a href="#set-' + g.id + '">' + escHtml(g.title) + '</a>').join('') + '<a href="#set-other">Every other key</a></nav>';
    for (const g of GROUPS) {
      html += '<section class="adm-set-group" id="set-' + g.id + '"><div class="adm-set-head"><h2>' + escHtml(g.title) + '</h2><p>' + escHtml(g.lead) + (g.links && g.links.length ? ' ' + g.links.map(([r, n]) => L(r, n)).join(' · ') : '') + '</p></div>';
      html += g.keys.map(rowOf).join('');
      if (g.elsewhere && g.elsewhere.length) html += '<div class="adm-set-sub">On other pages</div>' + g.elsewhere.map(([k, l, r, w]) => rowElsewhere(k, l, r, w)).join('');
      html += '</section>';
    }
    // every other key: not in a group, not dead, not a limit an hour
    const rest = Object.keys(settings).filter((k) => !KNOWN.has(k) && !DEAD.test(k) && !LIMIT_KEYS.test(k)).sort();
    const row = (k) => { const v = settings[k], ro = INTERNAL.test(k), sec = SECRET.test(k);
      return '<tr data-k="' + escHtml(k) + '"><td><code>' + escHtml(k) + '</code></td><td>' + (ro ? '<span class="dim adm-set-ro">' + escHtml(String(v == null ? '' : v).slice(0, 60)) + '</span>'
        : sec ? '<span class="dim">' + (v ? 'set, ends with ' + escHtml(String(v).slice(-4)) : 'not set') + '</span>'
        : '<input class="adm-setting-text-input adm-set-raw" type="text" value="' + escHtml(String(v == null ? '' : v)) + '" onchange="adminUpdateSetting(\'' + escHtml(k) + '\', this.value)" onkeydown="if(event.key===\'Enter\'){adminUpdateSetting(\'' + escHtml(k) + '\', this.value)}">') + '</td><td class="adm-set-where">' + (ro ? '<span class="dim">a mark the site keeps for itself</span>' : whereOf(k)) + '</td></tr>'; };
    html += '<details class="adm-set-other" id="set-other"><summary><b>Every other key</b> <span>' + rest.length + ' keys of the table that have no row above: the pages named beside them edit them; a key with no page is changed here, as it is stored. The marks the site keeps for itself are shown and not edited.</span></summary>'
      + '<input class="adm-setting-text-input adm-set-search" type="search" placeholder="Search a key" oninput="adminFilterKeys(this.value)">'
      + '<div class="adm-set-tbl"><table><thead><tr><th>Key</th><th>Value</th><th>Where it lives</th></tr></thead><tbody>' + rest.map(row).join('') + '</tbody></table></div></details>';
    container.innerHTML = html;
  }
  window.adminFilterKeys = function (q) {
    const s = String(q || '').trim().toLowerCase();
    document.querySelectorAll('.adm-set-tbl tbody tr').forEach((tr) => { tr.hidden = !!s && !tr.getAttribute('data-k').toLowerCase().includes(s); });
  };

  async function loadSettings() {
    try {
      const data = await API.request('GET', '/admin/settings');
      renderSettings(data.settings || {});
    } catch (e) {
      showToast('Failed to load settings: ' + e.message, 'error');
    }
  }
  window.adminUpdateSetting = async function (key, value) {
    try {
      await API.request('POST', '/admin/settings', { key, value });
      showToast('Saved: ' + key, 'success');
      if (SECRET.test(key)) loadSettings(); // the row says «set, ends with …» again
    } catch (e) {
      showToast(e.message, 'error');
      loadSettings(); // revert UI
    }
  };

  loadSettings();
});

// admin-drip (Drip Pacing) moved into Supply → Limits on 12.11.2026 (public/js/admin/limits.js): the pace of an order is a column of the
// one table of limits, with the same switch. An old link or bookmark lands there.
Router.register('admin-drip', async () => { if (typeof Router.go === 'function') { Router.go('/admin-limits'); return; } location.replace('/admin-limits'); });

// admin-catalog (Catalog) moved to public/js/admin/services-catalog.js on 25.09.2026.

// admin-ip-matches (Multi-accounts) moved to public/js/admin/multi-accounts.js on 25.09.2026.

// ============================================================
// admin-referrals and admin-ledger moved to public/js/admin/referrals.js and ledger.js on 26.09.2026.

// ============================================================
// admin-ai-costs and admin-tikhub-costs moved to public/js/admin/ai-costs.js and tikhub-costs.js on 26.09.2026.

// ============================================================
// admin-news, admin-broadcast and admin-broadcast-tickets became one page, Mailings
// (public/js/admin/mailings.js), on 28.09.2026.

// ============================================================
// ADMIN — APP WORKERS PAGE
// ============================================================
// Раздел App Workers удалён 10.08.2026 вместе со старым Android-контуром.
// Его заменил App Fleet (public/js/pages/admin-app.js) — управление новым
// приложением, устройствами и телеметрией.

// PRM4U Sync (admin-prm4u) and Check Providers (admin-providers) moved to
// public/js/admin/services.js and services-checks.js on 25.09.2026.



// ============================================================
// PUBLIC API MANAGEMENT
// ============================================================
Router.register('admin-api', async function(app) {
  app.innerHTML = '<style>'
    + '#apiContent .pat{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}'
    + '#apiContent .pat th{text-align:left;padding:9px 10px;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.07em;font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap}'
    + '#apiContent .pat td{padding:9px 10px;border-bottom:1px solid var(--border);vertical-align:middle}'
    + '#apiContent .pat tr:last-child td{border-bottom:none}'
    + '#apiContent .pat tr:hover td{background:rgba(127,127,127,.05)}'
    + '#apiContent .pat-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;overflow:auto}'
    + '#apiContent .pat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:16px 18px}'
    + '#apiContent .pat-card .l{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600}'
    + '#apiContent .pat-card .v{font-size:24px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums}'
    + '</style>'
    + '<div class="app-layout">' + renderAdminSidebar('admin-api', _adminPendingCounts) + '<main class="main-content"><div class="page-header"><h1 class="page-title">Public API</h1></div><div class="page-content"><div id="apiKillRow" style="margin-bottom:12px"></div><div class="adm-tabs" id="apiTabs"><button class="adm-tab active" data-tab="keys">API Keys</button><button class="adm-tab" data-tab="accounts">Accounts</button><button class="adm-tab" data-tab="pools">Pools</button><button class="adm-tab" data-tab="rates">Rates</button><button class="adm-tab" data-tab="failed">Failed</button><button class="adm-tab" data-tab="logs">Request Log</button><button class="adm-tab" data-tab="stats">Stats</button><button class="adm-tab" data-tab="software">Software</button></div><div id="apiContent" style="padding:16px 0"></div></div></main></div>';
  var _apiUrl = new URL(window.location.href);
  var currentApiTab = _apiUrl.searchParams.get('tab') || 'keys', apiKeys = [], apiStats = {}, apiSettings = {};
  if (currentApiTab !== 'keys') { document.querySelectorAll('#apiTabs .adm-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === currentApiTab); }); }
  document.getElementById('apiTabs').addEventListener('click', function(e) { var tab = e.target.closest('.adm-tab'); if (!tab) return; document.querySelectorAll('#apiTabs .adm-tab').forEach(function(t) { t.classList.remove('active'); }); tab.classList.add('active'); currentApiTab = tab.dataset.tab; renderApiTab(); });
  async function loadApiData() { try { var res = await Promise.all([API.request('GET', '/admin/public-api/keys'), API.request('GET', '/admin/public-api/stats'), API.request('GET', '/admin/settings')]); apiKeys = res[0].keys || []; apiStats = res[1] || {}; var st = res[2].settings || res[2] || {}; apiSettings = st; renderKillSwitch(); renderApiTab(); } catch(e) { showToast(e.message, 'error'); } }
  function _settingVal(key) { if (Array.isArray(apiSettings)) { var row = apiSettings.find(function(s) { return s.key === key; }); return row ? row.value : undefined; } return apiSettings[key]; }
  function renderKillSwitch() {
    var el = document.getElementById('apiKillRow'); if (!el) return;
    var v = _settingVal('public_api_enabled');
    var on = String(v) === '1';
    var conc = _settingVal('account_check_worker_concurrency');
    el.innerHTML = '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--bg-card);border:1px solid ' + (on ? 'var(--border)' : '#ef4444') + ';border-radius:var(--radius);padding:12px 16px">'
      + '<span style="font-weight:600">Global switch:</span>'
      + '<span style="color:' + (on ? '#22c55e' : '#ef4444') + ';font-weight:700">' + (v === undefined ? 'not seeded' : (on ? 'ENABLED' : 'DISABLED')) + '</span>'
      + '<button class="btn ' + (on ? 'btn-ghost' : 'btn-primary') + '" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiKillSwitch(' + (on ? 0 : 1) + ')">' + (on ? 'Disable API' : 'Enable API') + '</button>'
      + '<span style="color:var(--text-muted);font-size:11px">applies within ~60s (pr-api settings cache); per-key Disable is instant</span>'
      + '<span style="flex:1"></span>'
      + '<span style="color:var(--text-muted);font-size:12px">Check worker concurrency: ' + (conc === undefined ? '—' : conc) + ' <span style="opacity:.7">(change in Settings, needs jobs restart)</span></span>'
      + '</div>';
  }
  function renderApiTab() { var c = document.getElementById('apiContent'); if (!c) return; if (currentApiTab === 'keys') renderApiKeys(c); else if (currentApiTab === 'accounts') renderApiAccounts(c); else if (currentApiTab === 'pools') renderApiPools(c); else if (currentApiTab === 'rates') renderApiRates(c); else if (currentApiTab === 'failed') renderApiFailed(c); else if (currentApiTab === 'logs') renderApiLogs(c); else if (currentApiTab === 'software') renderApiSoftware(c); else renderApiStats(c); }

  // Управление клиентами, которые ходят в этот API. Здесь же выпуск ключей:
  // ключ и клиент — две стороны одного доступа, разносить их по разным
  // экранам значит заставлять помнить, где что лежит.
  function _sw(key, fallback) { var v = _settingVal(key); return v === undefined || v === null ? (fallback === undefined ? '' : fallback) : v; }

  function _swToggle(key, label, hint) {
    var on = String(_sw(key, '0')) === '1';
    return '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid var(--border)">'
      + '<div style="min-width:230px"><div style="font-weight:600;font-size:13px">' + label + '</div>'
      + '<div style="color:var(--text-muted);font-size:11px;margin-top:2px">' + hint + '</div></div>'
      + '<span style="color:' + (on ? '#22c55e' : 'var(--text-muted)') + ';font-weight:700;font-size:12px;min-width:64px">' + (on ? 'ON' : 'OFF') + '</span>'
      + '<button class="btn ' + (on ? 'btn-ghost' : 'btn-primary') + '" style="padding:5px 13px;width:auto;font-size:12px" onclick="adminApiSetSetting(\'' + key + '\',\'' + (on ? '0' : '1') + '\')">' + (on ? 'Turn off' : 'Turn on') + '</button>'
      + '</div>';
  }

  function _swField(key, label, hint, placeholder) {
    var v = _sw(key, '');
    return '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid var(--border)">'
      + '<div style="min-width:230px"><div style="font-weight:600;font-size:13px">' + label + '</div>'
      + '<div style="color:var(--text-muted);font-size:11px;margin-top:2px">' + hint + '</div></div>'
      + '<input class="form-input" id="sw_' + key + '" value="' + escHtml(String(v)) + '" placeholder="' + (placeholder || '') + '" style="max-width:320px;padding:7px 11px;font-size:13px">'
      + '<button class="btn btn-ghost" style="padding:5px 13px;width:auto;font-size:12px" onclick="adminApiSaveField(\'' + key + '\')">Save</button>'
      + '</div>';
  }

  // Внутри вкладки четыре экрана. Настройки отвечают на вопрос «как работает
  // софт», остальные три — «что сейчас с парком»: кто на связи, что прислали
  // машины, дошли ли команды.
  window._swState = window._swState || {
    screen: 'settings',
    machines: { status: 'all', q: '', offset: 0, total: 0, selected: {} },
    logs: { level: 'all', machine: '', q: '' },
  };

  window._swRender = function () {
    var host = document.getElementById('apiContent');
    if (host) renderApiSoftware(host);
  };

  function renderApiSoftware(c) {
    var st = window._swState;
    c.innerHTML = '<div class="adm-tabs" style="margin-bottom:14px" id="swTabs">'
      + [['settings', 'Settings'], ['machines', 'Machines'], ['logs', 'Logs'], ['commands', 'Commands']]
        .map(function (t) { return '<button class="adm-tab' + (st.screen === t[0] ? ' active' : '') + '" data-sw="' + t[0] + '">' + t[1] + '</button>'; }).join('')
      + '</div><div id="swBody"></div>';
    document.getElementById('swTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.adm-tab'); if (!b) return;
      st.screen = b.dataset.sw; renderApiSoftware(c);
    });
    var body = document.getElementById('swBody');
    if (st.screen === 'machines') return renderSwMachines(body);
    if (st.screen === 'logs') return renderSwLogs(body);
    if (st.screen === 'commands') return renderSwCommands(body);
    renderSwSettings(body);
  }

  function renderSwSettings(c) {
    var released = String(_sw('desktop_tg_version', '')).length > 0;
    c.innerHTML = '<div style="display:grid;gap:16px;max-width:980px">'

      + '<div class="pat-card"><div style="font-weight:700;margin-bottom:4px">Key issuing</div>'
      + '<div style="color:var(--text-muted);font-size:12px;margin-bottom:8px">Who can get a Public API key. While self-issue is off, keys exist only after you press <strong>Issue New Key</strong> on the Keys tab; the cabinet shows a "contact us" note instead of a button.</div>'
      + _swToggle('public_api_keygen_enabled', 'Self-issue for everyone', 'While off, the button exists only for admins and the user IDs listed below')
      + _swField('public_api_keygen_allow_ids', 'Allowed user IDs', 'Comma-separated. These people see the Create key button while self-issue is off', '2')
      + _swField('public_api_default_daily_tasks', 'Default daily tasks', 'Task limit for a self-issued key', '1000')
      + _swField('public_api_default_rate', 'Default rate', 'Requests per minute for a self-issued key', '120')
      + _swField('public_api_default_requests', 'Default daily requests', 'Request limit for a self-issued key', '10000')
      + '</div>'

      + '<div class="pat-card"><div style="font-weight:700;margin-bottom:4px">PR Worker Desktop</div>'
      + '<div style="color:var(--text-muted);font-size:12px;margin-bottom:8px">'
      + (released
          ? 'Windows client for account fleets. It authenticates with the same Public API key as a bot.'
          : 'Windows client for account fleets, <strong>not released yet</strong>. Values are stored and take effect with the first release; task issuing stays closed until you turn it on.')
      + '</div>'
      + _swToggle('desktop_tg_enabled', 'Issue tasks to the desktop client', 'Master switch for every machine running the client')
      + _swField('desktop_tg_version', 'Current version', 'Version the client compares itself against', '1.0.0')
      + _swField('desktop_tg_min_version', 'Minimum version', 'Older builds are refused and asked to update', '1.0.0')
      + _swField('desktop_tg_download_url', 'Download link', 'Where the installer lives', 'https://pr.social/downloads/...')
      + _swField('desktop_tg_max_accounts', 'Accounts per machine', 'Ceiling for one registered machine', '30')
      + _swField('desktop_tg_reward_divisor', 'Reward divisor', 'Advertiser price is divided by this before paying the worker. 1 means paying the full advertiser price — the current behaviour of the whole api pool', '2')
      + _swField('desktop_tg_max_machines', 'Machines per user', 'How many computers one person may register', '3')
      + _swField('desktop_tg_poll_sec', 'Poll interval, sec', 'How often a machine asks the server for work and commands', '30')
      + _swField('desktop_tg_vm_mode', 'Virtual machines', 'monitor — flag and allow, block — refuse registration', 'monitor')
      + _swField('desktop_tg_log_keep_days', 'Keep logs, days', 'Older log lines are removed by the nightly cleanup', '14')
      + '</div></div>';
  }

  // ----------------------------------------------------------- машины

  async function renderSwMachines(c) {
    var st = window._swState.machines;
    c.innerHTML = '<div style="color:var(--text-muted);padding:20px">Loading…</div>';
    var res;
    try {
      var q = new URLSearchParams({ limit: 50, offset: st.offset });
      if (st.status !== 'all') q.set('status', st.status);
      if (st.q) q.set('q', st.q);
      res = await API.request('GET', '/admin/desktop/machines?' + q.toString());
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; return; }

    var rows = res.machines || [];
    st.total = res.total || 0;

    var head = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">'
      + '<span style="color:var(--text-muted);font-size:13px">' + st.total + ' machines</span>'
      + ['all', 'active', 'blocked', 'revoked'].map(function (s) {
          return '<button class="btn ' + (st.status === s ? 'btn-primary' : 'btn-ghost') + '" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwSet(\'status\',\'' + s + '\')">' + s + '</button>';
        }).join('')
      + '<input class="form-input" id="swSearch" placeholder="name, fingerprint or owner" value="' + escHtml(st.q) + '" style="max-width:250px;padding:6px 11px;font-size:13px" onkeydown="if(event.key===\'Enter\')adminSwSearch()">'
      + '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwSearch()">Search</button>'
      + '<span style="flex:1"></span>'
      + '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwBulk(\'send_log\')">Ask for logs</button>'
      + '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwBulk(\'pause\')">Pause</button>'
      + '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwBulk(\'resume\')">Resume</button>'
      + '</div>';

    if (!rows.length) {
      c.innerHTML = head + '<div style="text-align:center;padding:40px;color:var(--text-muted)">No machines yet. One appears here the first time the client starts with a valid API key.</div>';
      return;
    }

    var h = head + '<div class="pat-wrap"><table class="pat"><tr>'
      + ['', 'MACHINE', 'OWNER', 'SYSTEM', 'ACC', 'TASKS', 'EARNED', 'LAST SEEN', 'STATUS', 'ACTIONS']
        .map(function (t) { return '<th>' + t + '</th>'; }).join('') + '</tr>';

    rows.forEach(function (m) {
      var seen = m.last_seen_at ? new Date(String(m.last_seen_at).replace(' ', 'T') + 'Z') : null;
      var online = seen && (Date.now() - seen.getTime() < 10 * 60 * 1000);
      var color = m.status === 'active' ? (m.paused ? '#f59e0b' : '#22c55e') : (m.status === 'blocked' ? '#ef4444' : 'var(--text-muted)');
      var label = m.status === 'active' ? (m.paused ? 'Paused' : 'Active') : (m.status === 'blocked' ? 'Blocked' : 'Revoked');
      h += '<tr>'
        + '<td><input type="checkbox"' + (st.selected[m.id] ? ' checked' : '') + ' onchange="adminSwSelect(' + m.id + ',this.checked)"></td>'
        + '<td><strong>' + escHtml(m.machine_name || 'Unnamed') + '</strong>'
          + (m.is_vm ? ' <span title="Virtual machine" style="color:#f59e0b;font-size:11px">VM</span>' : '')
          + '<br><span style="color:var(--text-muted);font-size:11px;font-family:monospace">' + escHtml(String(m.machine_uid).slice(0, 18)) + '…</span></td>'
        + '<td><strong>' + escHtml(m.username || ('ID:' + m.user_id)) + '</strong><br><span style="color:var(--text-muted);font-size:11px;font-family:monospace">' + escHtml(m.key_prefix || '') + '</span></td>'
        + '<td style="font-size:12px">' + escHtml(m.os || '—') + ' ' + escHtml(m.os_version || '') + '<br><span style="color:var(--text-muted)">v' + escHtml(m.app_version || '—') + '</span></td>'
        + '<td>' + (m.accounts_count || 0) + '</td>'
        + '<td style="font-size:12px">' + (m.tasks_today || 0) + ' today<br><span style="color:var(--text-muted)">' + (m.tasks_total || 0) + ' total</span></td>'
        + '<td>$' + Number(m.earned || 0).toFixed(2) + '</td>'
        + '<td style="font-size:12px;color:' + (online ? '#22c55e' : 'var(--text-muted)') + '">' + (seen ? (online ? 'online' : seen.toLocaleString()) : 'never') + '</td>'
        + '<td><span style="color:' + color + ';font-weight:600">' + label + '</span>'
          + (m.block_reason ? '<br><span style="color:var(--text-muted);font-size:11px">' + escHtml(m.block_reason) + '</span>' : '')
          + (m.commands_pending ? '<br><span style="color:#f59e0b;font-size:11px">' + m.commands_pending + ' waiting</span>' : '') + '</td>'
        + '<td style="white-space:nowrap">'
          + '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px" onclick="adminSwCard(' + m.id + ')">Open</button> '
          + '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px" onclick="adminSwCommand(' + m.id + ',\'send_log\')">Log</button> '
          + (m.paused
              ? '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px" onclick="adminSwAction(' + m.id + ',\'resume\')">Resume</button> '
              : '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px" onclick="adminSwAction(' + m.id + ',\'pause\')">Pause</button> ')
          + (m.status === 'blocked'
              ? '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px;color:#22c55e" onclick="adminSwAction(' + m.id + ',\'unblock\')">Unblock</button>'
              : '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px;color:#ef4444" onclick="adminSwAction(' + m.id + ',\'block\')">Block</button>')
        + '</td></tr>';
    });
    h += '</table></div>';

    if (st.total > 50) {
      h += '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px">'
        + '<button class="btn btn-ghost" style="padding:5px 14px;width:auto;font-size:12px"' + (st.offset ? '' : ' disabled') + ' onclick="adminSwPage(-1)">Previous</button>'
        + '<span style="color:var(--text-muted);font-size:12px;align-self:center">' + (st.offset + 1) + '–' + Math.min(st.offset + 50, st.total) + ' of ' + st.total + '</span>'
        + '<button class="btn btn-ghost" style="padding:5px 14px;width:auto;font-size:12px"' + (st.offset + 50 < st.total ? '' : ' disabled') + ' onclick="adminSwPage(1)">Next</button>'
        + '</div>';
    }
    c.innerHTML = h;
  }

  // ----------------------------------------------------------- журналы

  async function renderSwLogs(c) {
    var st = window._swState.logs;
    c.innerHTML = '<div style="color:var(--text-muted);padding:20px">Loading…</div>';
    var rows = [];
    try {
      var q = new URLSearchParams({ limit: 100 });
      if (st.level !== 'all') q.set('level', st.level);
      if (st.machine) q.set('machine_id', st.machine);
      if (st.q) q.set('q', st.q);
      rows = (await API.request('GET', '/admin/desktop/logs?' + q.toString())).logs || [];
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; return; }

    var head = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">'
      + ['all', 'crash', 'error', 'warn', 'info'].map(function (l) {
          return '<button class="btn ' + (st.level === l ? 'btn-primary' : 'btn-ghost') + '" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwLogSet(\'level\',\'' + l + '\')">' + l + '</button>';
        }).join('')
      + '<input class="form-input" id="swLogSearch" placeholder="search in messages" value="' + escHtml(st.q) + '" style="max-width:250px;padding:6px 11px;font-size:13px" onkeydown="if(event.key===\'Enter\')adminSwLogSearch()">'
      + '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwLogSearch()">Search</button>'
      + (st.machine ? '<button class="btn btn-ghost" style="padding:5px 12px;width:auto;font-size:12px" onclick="adminSwLogSet(\'machine\',\'\')">All machines</button>' : '')
      + '</div>';

    if (!rows.length) {
      c.innerHTML = head + '<div style="text-align:center;padding:36px;color:var(--text-muted)">Nothing here. Crashes arrive on their own; for everything else ask a machine for its log on the Machines tab.</div>';
      return;
    }

    var color = { crash: '#ef4444', error: '#ef4444', warn: '#f59e0b', info: 'var(--text-muted)' };
    c.innerHTML = head + '<div class="pat-wrap"><table class="pat"><tr><th>TIME</th><th>LEVEL</th><th>MACHINE</th><th>SOURCE</th><th>MESSAGE</th></tr>'
      + rows.map(function (l) {
          return '<tr><td style="white-space:nowrap;font-size:12px;color:var(--text-muted)">' + new Date(String(l.created_at).replace(' ', 'T') + 'Z').toLocaleString() + '</td>'
            + '<td><span style="color:' + (color[l.level] || 'var(--text-muted)') + ';font-weight:600;font-size:12px">' + l.level + '</span></td>'
            + '<td style="font-size:12px"><a href="#" onclick="adminSwLogSet(\'machine\',' + l.machine_id + ');return false">' + escHtml(l.machine_name || ('#' + l.machine_id)) + '</a><br><span style="color:var(--text-muted);font-size:11px">' + escHtml(l.username || '') + '</span></td>'
            + '<td style="font-size:12px;color:var(--text-muted)">' + escHtml(l.source || '—') + '</td>'
            + '<td style="font-size:12px">' + escHtml(l.message) + (l.detail ? '<br><span style="color:var(--text-muted);font-size:11px">' + escHtml(String(l.detail).slice(0, 300)) + '</span>' : '') + '</td></tr>';
        }).join('') + '</table></div>';
  }

  // ----------------------------------------------------------- команды

  async function renderSwCommands(c) {
    c.innerHTML = '<div style="color:var(--text-muted);padding:20px">Loading…</div>';
    var rows = [];
    try { rows = (await API.request('GET', '/admin/desktop/commands?limit=100')).commands || []; }
    catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; return; }

    var note = '<div style="color:var(--text-muted);font-size:12px;margin-bottom:12px">A command waits in the queue until the machine asks for it, so a switched-off computer picks it up when it starts. <strong>sent</strong> — delivered, <strong>done</strong> — the machine reported back.</div>';
    if (!rows.length) { c.innerHTML = note + '<div style="text-align:center;padding:36px;color:var(--text-muted)">No commands yet</div>'; return; }

    var color = { pending: '#f59e0b', sent: '#2563eb', done: '#22c55e', failed: '#ef4444', expired: 'var(--text-muted)' };
    c.innerHTML = note + '<div class="pat-wrap"><table class="pat"><tr><th>CREATED</th><th>MACHINE</th><th>COMMAND</th><th>STATUS</th><th>RESULT</th><th></th></tr>'
      + rows.map(function (r) {
          return '<tr><td style="white-space:nowrap;font-size:12px;color:var(--text-muted)">' + new Date(String(r.created_at).replace(' ', 'T') + 'Z').toLocaleString() + '</td>'
            + '<td style="font-size:12px">' + escHtml(r.machine_name || ('#' + r.machine_id)) + '<br><span style="color:var(--text-muted);font-size:11px">' + escHtml(r.username || '') + '</span></td>'
            + '<td style="font-family:monospace;font-size:12px">' + escHtml(r.command) + '</td>'
            + '<td><span style="color:' + (color[r.status] || 'var(--text-muted)') + ';font-weight:600;font-size:12px">' + r.status + '</span></td>'
            + '<td style="font-size:12px;color:var(--text-muted)">' + escHtml(r.result || '') + '</td>'
            + '<td>' + (r.status === 'pending' ? '<button class="btn btn-ghost" style="padding:4px 9px;width:auto;font-size:11px" onclick="adminSwCancel(' + r.id + ')">Cancel</button>' : '') + '</td></tr>';
        }).join('') + '</table></div>';
  }
  function renderApiKeys(c) {
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><span style="color:var(--text-muted);font-size:13px">' + apiKeys.length + ' keys</span><button class="btn btn-primary" style="padding:8px 16px;width:auto" onclick="adminApiIssueKey()">Issue New Key</button></div>';
    if (!apiKeys.length) { c.innerHTML = h + '<div style="text-align:center;padding:40px;color:var(--text-muted)">No API keys yet</div>'; return; }
    h += '<div class="pat-wrap"><table class="pat"><tr>';
    ['USER','PREFIX','LIMITS D/R/A/REQ','CHECK','POOLS','ACCOUNTS','TODAY','TOTAL','LAST USED','STATUS','ACTIONS'].forEach(function(t) { h += '<th>' + t + '</th>'; });
    h += '</tr>';
    apiKeys.forEach(function(k) {
      var checkBadge = k.check_mode ? '<span style="color:#f59e0b;font-weight:600;cursor:pointer" title="TikHub check ON — orders only to passed/skipped accounts" onclick="adminApiSetCheckMode(' + k.id + ',0)">ON</span>' : '<span style="color:var(--text-muted);cursor:pointer" title="TikHub check OFF — trusted operator" onclick="adminApiSetCheckMode(' + k.id + ',1)">off</span>';
      var accCell = (k.accounts_active || 0) + (k.accounts_failed ? ' <span style="color:#ef4444;font-size:11px">(' + k.accounts_failed + ' failed)</span>' : '');

      // Откуда ключ берёт заказы. Включённый пул назван и подсвечен, выключенный
      // погашен — так видно состояние всех ключей разом, не открывая каждый.
      // Рядом с пулом стоят виды работы, если они ограничены: пул, открытый
      // целиком, и пул, открытый только под просмотры, — разные вещи, и разница
      // объясняет половину вопросов «почему софт не берёт эти заказы».
      var poolsCell = (function () {
        var cfg = null;
        try { cfg = k.pools_json ? JSON.parse(k.pools_json) : null; } catch (e) { cfg = null; }
        // Ключ без настройки работает по умолчанию — только свой пул.
        if (!cfg) return '<span style="color:#22c55e;font-size:11px;font-weight:600">api</span>'
          + '<span style="color:var(--text-muted);font-size:10px"> (default)</span>';
        var подпись = { api: 'api', manual: 'site' };
        var out = ['api', 'manual'].map(function (name) { // (28.10.2026) the phones take the work of api: no phone pool
          var p = cfg[name] || {};
          var on = !!p.on;
          var acts = p.actions ? String(p.actions).split(',').map(function (x) { return x.trim(); }).filter(Boolean) : [];
          var подсказка = name + (on ? ' — on' : ' — off')
            + (acts.length ? ', only: ' + acts.join(', ') : (on ? ', all actions' : ''));
          return '<span title="' + escHtml(подсказка) + '" style="font-size:11px;font-weight:' + (on ? '600' : '400')
            + ';color:' + (on ? '#22c55e' : 'var(--text-muted)') + '">' + подпись[name]
            + (on && acts.length ? '<span style="font-weight:400;font-size:10px">·' + acts.length + '</span>' : '')
            + '</span>';
        }).join('<span style="color:var(--border);font-size:10px"> / </span>');
        return out;
      })();
      // a key its owner made (16.10.2026): Waiting until it is activated here, Blocked by the 48-hour rule of the API (see public-api.js)
      const selfState = k.is_active || k.last_used_at ? '' : k.name === 'Self-issued' ? 'waiting' : k.name === 'Blocked: 48h of calls' ? 'blocked' : '';
      h += '<tr>'
        + '<td><strong>' + (k.username || 'ID:' + k.user_id) + '</strong>' + (k.name ? '<br><span style="color:var(--text-muted);font-size:11px">' + escHtml(k.name) + '</span>' : '') + '</td>'
        + '<td style="padding:8px;font-family:monospace;color:var(--accent)">' + (k.key_prefix || '') + '</td>'
        + '<td style="padding:8px;font-size:12px">' + (k.daily_task_limit || 0) + ' / ' + (k.rate_limit_per_min || 0) + ' / ' + (k.max_accounts || 0) + ' / ' + (k.daily_request_limit || 10000) + '</td>'
        + '<td style="padding:8px">' + checkBadge + '</td>'
        + '<td style="padding:8px;white-space:nowrap">' + poolsCell + '</td>'
        + '<td style="padding:8px">' + accCell + '</td>'
        + '<td style="padding:8px;font-size:12px">' + (k.completions_today || 0) + ' / $' + ((k.paid_today || 0) / 10000).toFixed(2) + '</td>'
        + '<td style="padding:8px;font-size:12px">' + (k.completions_total || 0) + ' / $' + ((k.paid_total || 0) / 10000).toFixed(2) + '</td>'
        + '<td style="padding:8px;color:var(--text-muted);font-size:12px">' + (k.last_used_at ? new Date(k.last_used_at).toLocaleString() : 'Never') + '</td>'
        + '<td style="padding:8px"><span style="color:' + (k.is_active ? '#22c55e' : selfState === 'waiting' ? '#d97706' : '#ef4444') + ';font-weight:600">' + (k.is_active ? 'Active' : selfState === 'waiting' ? 'Waiting' : selfState === 'blocked' ? 'Blocked' : 'Off') + '</span></td>'
        + '<td style="padding:8px;white-space:nowrap">'
        + '<button onclick=\'adminApiEditKey(' + JSON.stringify({ id: k.id, name: k.name || '', daily_task_limit: k.daily_task_limit, rate_limit_per_min: k.rate_limit_per_min, max_accounts: k.max_accounts, daily_request_limit: k.daily_request_limit, check_mode: k.check_mode }).replace(/'/g, '&#39;') + ')\' style="background:none;border:1px solid var(--border);color:var(--text-muted);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin-right:6px">Edit</button>'
        + '<button onclick="adminApiRates(' + k.id + ')" style="background:none;border:1px solid var(--border);color:var(--text-muted);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin-right:6px">Pools &amp; rates</button>'
        + '<button onclick="adminApiToggleKey(' + k.id + ',' + (k.is_active ? 0 : 1) + (selfState === 'blocked' ? ',1' : '') + ')" style="background:none;border:1px solid var(--border);color:var(--text-muted);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px">' + (k.is_active ? 'Disable' : selfState ? 'Activate' : 'Enable') + '</button></td></tr>';
    });
    c.innerHTML = h + '</table></div>';
  }
  async function renderApiAccounts(c) {
    c.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="width:20px;height:20px;border-width:2px;border-top-color:var(--accent)"></div></div>';
    var p = _apiUrl.searchParams;
    var page = parseInt(p.get('page')) || 1;
    var qs = new URLSearchParams({ page: page, limit: 50 });
    ['key_id', 'platform', 'check_status', 'status', 'search'].forEach(function(f) { if (p.get(f)) qs.set(f, p.get(f)); });
    try {
      var res = await API.request('GET', '/admin/public-api/accounts?' + qs.toString());
      var accs = res.accounts || [];
      var counts = {}; (res.by_check_status || []).forEach(function(r) { counts[r.check_status] = r.c; });
      var badge = function(cs, reason) {
        var col = cs === 'passed' ? '#22c55e' : cs === 'failed' ? '#ef4444' : cs === 'skipped' ? 'var(--text-muted)' : cs === 'pending' ? '#f59e0b' : 'var(--text-muted)';
        return '<span style="color:' + col + ';font-weight:600">' + cs + '</span>' + (reason ? '<br><span style="color:var(--text-muted);font-size:10px">' + escHtml(reason) + '</span>' : '');
      };
      var selOpt = function(v, cur, label) { return '<option value="' + v + '"' + (String(cur || '') === v ? ' selected' : '') + '>' + label + '</option>'; };
      var h = '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">'
        + '<select id="apiAcctKey" class="adm-setting-text-input" style="width:auto;padding:6px 10px;font-size:12px">' + selOpt('', p.get('key_id'), 'All keys') + apiKeys.map(function(k) { return selOpt(String(k.id), p.get('key_id'), (k.username || 'ID:' + k.user_id) + ' (' + k.key_prefix + ')'); }).join('') + '</select>'
        + '<input id="apiAcctPlatform" class="adm-setting-text-input" style="width:120px;padding:6px 10px;font-size:12px" placeholder="platform" value="' + escHtml(p.get('platform') || '') + '">'
        + '<select id="apiAcctCheck" class="adm-setting-text-input" style="width:auto;padding:6px 10px;font-size:12px">' + ['', 'none', 'pending', 'passed', 'failed', 'skipped'].map(function(v) { return selOpt(v, p.get('check_status'), v || 'All checks'); }).join('') + '</select>'
        + '<select id="apiAcctStatus" class="adm-setting-text-input" style="width:auto;padding:6px 10px;font-size:12px">' + [['', 'Active+banned'], ['active', 'active'], ['banned', 'banned'], ['unlinked', 'unlinked']].map(function(v) { return selOpt(v[0], p.get('status'), v[1]); }).join('') + '</select>'
        + '<input id="apiAcctSearch" class="adm-setting-text-input" style="width:160px;padding:6px 10px;font-size:12px" placeholder="username search" value="' + escHtml(p.get('search') || '') + '">'
        + '<button class="btn btn-ghost" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiAcctFilter()">Apply</button>'
        + '<span style="flex:1"></span>'
        + '<span style="color:var(--text-muted);font-size:12px">passed ' + (counts.passed || 0) + ' · pending ' + (counts.pending || 0) + ' · failed ' + (counts.failed || 0) + ' · none ' + (counts.none || 0) + ' · skipped ' + (counts.skipped || 0) + '</span>'
        + '</div>'
        + '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">'
        + '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px" onclick="adminApiAcctBulk(\'recheck\')">Recheck selected</button>'
        + '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px" onclick="adminApiAcctBulk(\'force_approve\')">Force-approve selected</button>'
        + '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px;color:#ef4444" onclick="adminApiAcctBulk(\'ban\')">Ban selected</button>'
        + '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px" onclick="adminApiAcctBulk(\'unban\')">Unban selected</button>'
        + '<span style="color:var(--text-muted);font-size:12px;align-self:center">' + res.total + ' accounts</span>'
        + '</div>';
      if (!accs.length) { c.innerHTML = h + '<div style="text-align:center;padding:40px;color:var(--text-muted)">No accounts</div>'; return; }
      h += '<div class="pat-wrap"><table class="pat"><tr><th style="width:30px"><input type="checkbox" onclick="document.querySelectorAll(\'.apiAcctCb\').forEach(function(c){c.checked=event.target.checked})"></th>';
      ['ID', 'KEY', 'PLATFORM', 'USERNAME', 'CHECK', 'FLW / POSTS', 'TASKS', 'CHECKED AT', 'STATUS'].forEach(function(t) { h += '<th>' + t + '</th>'; });
      h += '</tr>';
      accs.forEach(function(a) {
        h += '<tr>'
          + '<td style="padding:6px"><input type="checkbox" class="apiAcctCb" value="' + a.id + '"></td>'
          + '<td style="padding:6px;color:var(--text-muted)">' + a.id + '</td>'
          + '<td style="padding:6px;font-family:monospace;font-size:11px">' + (a.key_prefix || a.api_key_id) + '</td>'
          + '<td style="padding:6px">' + a.platform + '</td>'
          + '<td style="padding:6px"><a href="' + escHtml(a.profile_url || '#') + '" target="_blank" rel="noopener" style="color:var(--accent)">' + escHtml(a.username) + '</a></td>'
          + '<td style="padding:6px">' + badge(a.check_status, a.check_reason) + '</td>'
          + '<td style="padding:6px">' + (a.followers == null ? '—' : a.followers.toLocaleString()) + ' / ' + (a.posts == null ? '—' : a.posts) + '</td>'
          + '<td style="padding:6px">' + (a.tasks_completed || 0) + '</td>'
          + '<td style="padding:6px;color:var(--text-muted);font-size:11px">' + (a.checked_at ? new Date(a.checked_at + 'Z').toLocaleString() : '—') + '</td>'
          + '<td style="padding:6px"><span style="color:' + (a.status === 'active' ? '#22c55e' : '#ef4444') + '">' + a.status + '</span></td>'
          + '</tr>';
      });
      h += '</table></div>';
      var pages = Math.max(1, Math.ceil(res.total / res.limit));
      if (pages > 1) {
        h += '<div style="display:flex;gap:8px;justify-content:center;padding:12px">'
          + (page > 1 ? '<button class="btn btn-ghost" style="padding:4px 12px;width:auto;font-size:12px" onclick="adminApiAcctPage(' + (page - 1) + ')">Prev</button>' : '')
          + '<span style="color:var(--text-muted);font-size:12px;align-self:center">' + page + ' / ' + pages + '</span>'
          + (page < pages ? '<button class="btn btn-ghost" style="padding:4px 12px;width:auto;font-size:12px" onclick="adminApiAcctPage(' + (page + 1) + ')">Next</button>' : '')
          + '</div>';
      }
      c.innerHTML = h;
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; }
  }
  // Ставки для программ, работающих через API. Одна цена на действие для всех
  // ключей сразу — как прайс приложения у телефонов. Своя цена, заданная
  // конкретному ключу в «Pools & rates», всегда главнее этой.
  var RATE_ACTIONS = [
    ['view', 'Views', 'phone fleet pays $0.001 / 1000'],
    ['react', 'Reactions', 'phone fleet pays $0.02 / 1000'],
    ['join', 'Subscriptions', 'phone fleet pays $0.3 / 1000'],
    ['comment', 'Comments', 'phone fleet pays $1 / 1000'],
    ['follow', 'Follows', ''],
    ['like', 'Likes', ''],
  ];

  async function renderApiRates(c) {
    c.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="width:20px;height:20px;border-width:2px;border-top-color:var(--accent)"></div></div>';
    try {
      // /admin/settings отдаёт объект вида { ok, settings: { key: value } }.
      var res = await API.request('GET', '/admin/settings');
      var st = (res && res.settings) || {};

      var h = '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;max-width:760px">'
        + '<div style="font-weight:600;margin-bottom:4px">Software rates</div>'
        + '<div style="color:var(--text-muted);font-size:12px;margin-bottom:14px">Dollars per 1000 confirmed actions, paid to the software that does the work. One rate for every key; a key with its own price in <strong>Pools &amp; rates</strong> keeps that price. Leave empty to pay what the order itself pays &mdash; that is the advertiser price and it is much higher.</div>';

      RATE_ACTIONS.forEach(function (a) {
        var key = 'api_price_' + a[0] + '_per1k';
        h += '<div style="display:flex;gap:10px;align-items:center;margin-bottom:9px">'
          + '<span style="min-width:130px;font-size:13px">' + a[1] + '</span>'
          + '<input class="form-input" id="rate_' + a[0] + '" value="' + escHtml(st[key] == null ? '' : st[key]) + '" placeholder="empty = order price" style="max-width:150px;padding:6px 10px;font-size:12px">'
          + '<span style="color:var(--text-muted);font-size:11px">' + a[2] + '</span>'
          + '</div>';
      });

      h += '<div style="margin-top:14px;display:flex;gap:10px;align-items:center">'
        + '<button class="btn btn-primary" style="width:auto;padding:8px 18px;font-size:13px" onclick="adminApiRatesGlobalSave()">Save rates</button>'
        + '<span id="rateMsg" style="color:var(--text-muted);font-size:12px"></span></div>'
        + '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);color:var(--text-muted);font-size:12px">'
        + 'Fractions are kept: a view at $0.001 / 1000 is a hundredth of a unit, and the remainder is carried over to the next task instead of being rounded up. Nothing is lost and nothing is overpaid.</div>'
        + '</div>';
      c.innerHTML = h;
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; }
  }

  window.adminApiRatesGlobalSave = async function () {
    var msg = document.getElementById('rateMsg');
    try {
      for (var i = 0; i < RATE_ACTIONS.length; i++) {
        var act = RATE_ACTIONS[i][0];
        var el = document.getElementById('rate_' + act);
        if (!el) continue;
        var v = el.value.trim();
        if (v && !(parseFloat(v) > 0)) { if (msg) msg.textContent = act + ': number expected'; return; }
        await API.request('POST', '/admin/settings', { key: 'api_price_' + act + '_per1k', value: v });
      }
      if (msg) msg.textContent = 'Saved — applies within a minute';
      showToast('Rates saved', 'success');
    } catch (e) { if (msg) msg.textContent = e.message; }
  };

  async function renderApiPools(c) {
    c.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="width:20px;height:20px;border-width:2px;border-top-color:var(--accent)"></div></div>';
    var askedPool = _apiUrl.searchParams.get('pool');
    var pool = ['manual', 'app'].indexOf(askedPool) >= 0 ? askedPool : 'api';
    try {
      var res = await API.request('GET', '/admin/public-api/pool-orders?pool=' + pool + '&limit=100');
      var counts = {}; (res.counts || []).forEach(function(r) { counts[r.pool] = r.c; });
      var h = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap">'
        + '<button class="btn ' + (pool === 'api' ? 'btn-primary' : 'btn-ghost') + '" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiPoolView(\'api\')">Software and phones (' + (counts.api || 0) + ')</button>'
        + '<button class="btn ' + (pool === 'manual' ? 'btn-primary' : 'btn-ghost') + '" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiPoolView(\'manual\')">Site pool (' + (counts.manual || 0) + ')</button>'
        + (counts.app ? '<button class="btn ' + (pool === 'app' ? 'btn-primary' : 'btn-ghost') + '" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiPoolView(\'app\')">Old phone pool (' + counts.app + ')</button>' : '')
        + '<span style="color:var(--text-muted);font-size:12px">active (pending / in_progress / paused) orders only</span>'
        + '</div>'
        + '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:16px">'
        + '<div style="font-weight:600;font-size:13px;margin-bottom:8px">Bulk move orders between pools</div>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'
        + '<input id="apiPoolIds" class="adm-setting-text-input" style="flex:1;min-width:240px;padding:6px 10px;font-size:12px" placeholder="Order IDs, comma/space separated (max 500)">'
        + '<button class="btn btn-ghost" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiMovePool(\'api\')">&rarr; Software and phones</button>'
        + '<button class="btn btn-ghost" style="padding:6px 14px;width:auto;font-size:12px" onclick="adminApiMovePool(\'manual\')">&rarr; Site pool</button>'
        + '</div><div style="color:var(--text-muted);font-size:11px;margin-top:6px">Only non-final orders are moved; completed and cancelled ones are skipped. Each contour issues from its own pool: the site from the site pool, phones from the phone pool, bots and desktop software from the API pool. Moving an order changes who does the work.</div></div>';
      var orders = res.orders || [];
      if (!orders.length) { c.innerHTML = h + '<div style="text-align:center;padding:40px;color:var(--text-muted)">No active orders in this pool</div>'; return; }
      h += '<div class="pat-wrap"><table class="pat"><tr>';
      ['ID', 'SERVICE', 'URL', 'PROGRESS', 'STATUS', 'SOURCE', 'CREATED'].forEach(function(t) { h += '<th>' + t + '</th>'; });
      h += '</tr>';
      orders.forEach(function(o) {
        h += '<tr>'
          + '<td style="padding:6px;font-weight:600">' + o.id + '</td>'
          + '<td style="padding:6px">' + (o.platform || '') + ' ' + (o.action || '') + '</td>'
          + '<td style="padding:6px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="' + escHtml(o.target_url || '#') + '" target="_blank" rel="noopener" style="color:var(--accent)">' + escHtml(o.target_url || '') + '</a></td>'
          + '<td style="padding:6px">' + o.completed_count + ' / ' + o.total_count + '</td>'
          + '<td style="padding:6px">' + o.status + '</td>'
          + '<td style="padding:6px;color:var(--text-muted)">' + (o.source || '') + '</td>'
          + '<td style="padding:6px;color:var(--text-muted);font-size:11px">' + (o.created_at ? new Date(o.created_at + 'Z').toLocaleDateString() : '') + '</td>'
          + '</tr>';
      });
      c.innerHTML = h + '</table></div>';
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; }
  }
  async function renderApiFailed(c) {
    c.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="width:20px;height:20px;border-width:2px;border-top-color:var(--accent)"></div></div>';
    try {
      var res = await API.request('GET', '/admin/public-api/failed-orders');
      var orders = res.orders || [];
      var h = '<div style="color:var(--text-muted);font-size:12px;margin-bottom:12px">Orders pulled from bot issuance: distinct accounts reported a broken link and the probe confirmed (or the link is not machine-checkable). PRM4U still sees them in progress until you decide.</div>';
      if (!orders.length) { c.innerHTML = h + '<div style="text-align:center;padding:40px;color:var(--text-muted)">No failed orders</div>'; return; }
      h += '<div class="pat-wrap"><table class="pat"><tr>';
      ['ID', 'SERVICE', 'URL', 'PROGRESS', 'REASON', 'FAILED AT', 'ACTIONS'].forEach(function(t) { h += '<th>' + t + '</th>'; });
      h += '</tr>';
      orders.forEach(function(o) {
        h += '<tr>'
          + '<td style="padding:6px;font-weight:600">' + o.id + '</td>'
          + '<td style="padding:6px">' + (o.platform || '') + ' ' + (o.action || '') + '</td>'
          + '<td style="padding:6px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="' + escHtml(o.target_url || '#') + '" target="_blank" rel="noopener" style="color:var(--accent)">' + escHtml(o.target_url || '') + '</a></td>'
          + '<td style="padding:6px">' + o.completed_count + ' / ' + o.total_count + '</td>'
          + '<td style="padding:6px;max-width:260px;font-size:12px">' + escHtml(o.api_fail_reason || '') + '</td>'
          + '<td style="padding:6px;color:var(--text-muted);font-size:11px">' + (o.api_fail_at ? new Date(o.api_fail_at + 'Z').toLocaleString() : '') + '</td>'
          + '<td style="padding:6px;white-space:nowrap">'
          + '<button class="btn btn-ghost" style="padding:4px 10px;width:auto;font-size:12px" onclick="adminApiFailedAction(' + o.id + ', \'return\')">Return to work</button> '
          + '<button class="btn btn-ghost" style="padding:4px 10px;width:auto;font-size:12px;color:#ef4444" onclick="adminApiFailedAction(' + o.id + ', \'cancel\')">Cancel</button>'
          + '</td></tr>';
      });
      c.innerHTML = h + '</table></div>';
    } catch (e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; }
  }
  async function renderApiLogs(c) {
    c.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="width:20px;height:20px;border-width:2px;border-top-color:var(--accent)"></div></div>';
    try { var res = await API.request('GET', '/admin/public-api/logs?limit=100'); var logs = res.logs || [];
      if (!logs.length) { c.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">No requests yet</div>'; return; }
      var h = '<div class="pat-wrap"><table class="pat"><tr><th>TIME</th><th>USER</th><th>PATH</th><th>STATUS</th><th>MS</th><th>IP</th></tr>';
      logs.forEach(function(l) { h += '<tr><td style="color:var(--text-muted);font-size:11px">' + new Date(l.created_at).toLocaleString() + '</td><td style="padding:6px">' + (l.username||l.user_id) + '</td><td style="padding:6px;font-family:monospace;color:var(--accent)">' + l.method + ' ' + l.path + '</td><td style="padding:6px">' + (l.status_code||'') + '</td><td style="padding:6px">' + (l.duration_ms||0) + '</td><td style="padding:6px;color:var(--text-muted);font-size:11px">' + (l.ip_address||'') + '</td></tr>'; });
      c.innerHTML = h + '</table></div>';
    } catch(e) { c.innerHTML = '<div style="color:#ef4444;padding:20px">' + escHtml(String(e.message || 'Error')) + '</div>'; }
  }
  function renderApiStats(c) {
    var s = apiStats;
    var card = function(label, val, color) { return '<div class="pat-card"><div class="l">' + label + '</div><div class="v"' + (color ? ' style="color:' + color + '"' : '') + '>' + val + '</div></div>'; };
    c.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px">'
      + card('Total Keys', s.total_keys || 0)
      + card('Active Keys', s.active_keys || 0, s.active_keys ? '#22c55e' : 'var(--text-muted)')
      + card('Requests Today', s.requests_today || 0)
      + card('Completions Today', s.completions_today || 0, 'var(--accent)')
      + card('Total Completions', s.total_completions || 0)
      + card('Total Paid', '$' + ((s.total_paid || 0) / 10000).toFixed(2), '#22c55e')
      + '</div>';
  }
  loadApiData();
});

// ============================================================
// admin-worker-analytics — Worker Cards Analytics (country / language breakdown)
// ============================================================
// admin-worker-analytics moved to public/js/admin/worker-analytics.js on 25.09.2026.

window.adminApiIssueKey = function() { var m = document.getElementById('apiKeyModal'); if (m) m.remove(); m = document.createElement('div'); m.id = 'apiKeyModal'; m.style.cssText = 'display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center'; m.innerHTML = '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:440px;width:90%"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="margin:0">Issue API Key</h3><button onclick="document.getElementById(\'apiKeyModal\').remove()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&times;</button></div><div style="display:flex;flex-direction:column;gap:12px"><div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">User ID</label><input type="number" id="apiKeyUserId" class="adm-setting-text-input" style="width:100%" placeholder="User ID" min="1"></div><div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">Name</label><input type="text" id="apiKeyName" class="adm-setting-text-input" style="width:100%" placeholder="e.g. Bot v1"></div><div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">Daily Task Limit</label><input type="number" id="apiKeyTaskLimit" class="adm-setting-text-input" style="width:100%" value="1000" min="1"></div><div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">Rate (req/min)</label><input type="number" id="apiKeyRateLimit" class="adm-setting-text-input" style="width:100%" value="120" min="1"></div><div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">Daily Request Limit</label><input type="number" id="apiKeyReqLimit" class="adm-setting-text-input" style="width:100%" value="10000" min="100"></div><button class="btn btn-primary" style="padding:10px;margin-top:8px" onclick="adminApiSubmitKey()">Generate Key</button><div id="apiKeyResult" style="display:none;margin-top:8px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px"></div></div></div>'; document.body.appendChild(m); m.addEventListener('click', function(e) { if (e.target === m) m.remove(); }); };
window.adminApiSubmitKey = async function() { var u = parseInt(document.getElementById('apiKeyUserId').value), n = document.getElementById('apiKeyName').value.trim(), t = parseInt(document.getElementById('apiKeyTaskLimit').value)||1000, r = parseInt(document.getElementById('apiKeyRateLimit').value)||120, q = parseInt(document.getElementById('apiKeyReqLimit').value)||10000; if (!u||u<1) return showToast('Enter user ID','error'); try { var res = await API.request('POST','/admin/public-api/keys',{user_id:u,name:n||null,daily_task_limit:t,rate_limit_per_min:r,daily_request_limit:q}); var d = document.getElementById('apiKeyResult'); d.style.display='block'; d.innerHTML='<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Copy now (shown once):</div><div style="font-family:monospace;font-size:13px;word-break:break-all;color:#22c55e;font-weight:600">'+res.key+'</div>'; showToast('Key issued','success'); } catch(e) { showToast(e.message,'error'); } };
// unblock: a key blocked by the 48-hour rule gets its name back when it is activated, so the list does not keep calling it blocked
window.adminApiToggleKey = async function(id, s, unblock) { try { await API.request('PUT','/admin/public-api/keys/'+id, unblock ? {is_active:s, name:'Self-issued'} : {is_active:s}); showToast(s?'Enabled':'Disabled','success'); Router.navigate('/admin-api'); } catch(e) { showToast(e.message,'error'); } };
// Переключатели и поля вкладки Software. Значения хранятся в system_settings,
// поэтому сохранение — обычный POST /admin/settings; страница перерисовывается,
// чтобы человек видел применённое состояние, а не то, что он ввёл.
// Действия вкладки Software. Состояние экрана меняется на месте и
// перерисовывается — переход по адресу перезагрузил бы весь раздел админки.
window.adminSwSet = function (field, value) {
  window._swState.machines[field] = value;
  window._swState.machines.offset = 0;
  window._swRender();
};
window.adminSwSearch = function () {
  var el = document.getElementById('swSearch');
  window._swState.machines.q = el ? el.value.trim() : '';
  window._swState.machines.offset = 0;
  window._swRender();
};
window.adminSwPage = function (dir) {
  var st = window._swState.machines;
  st.offset = Math.max(0, st.offset + dir * 50);
  window._swRender();
};
window.adminSwSelect = function (id, on) { window._swState.machines.selected[id] = !!on; };
window.adminSwLogSet = function (field, value) {
  window._swState.logs[field] = value;
  window._swRender();
};
window.adminSwLogSearch = function () {
  var el = document.getElementById('swLogSearch');
  window._swState.logs.q = el ? el.value.trim() : '';
  window._swRender();
};

window.adminSwAction = async function (id, action) {
  var reason = null;
  if (action === 'block') {
    reason = prompt('Why is this machine blocked? The reason is shown to the client.');
    if (reason === null) return;
  }
  if (action === 'revoke' && !confirm('Revoke the license? The machine will have to register again.')) return;
  try {
    await API.request('POST', '/admin/desktop/machine/' + id + '/action', { action: action, reason: reason });
    showToast('Applied — the machine sees it immediately', 'success');
    window._swRender();
  } catch (e) { showToast(e.message, 'error'); }
};

window.adminSwCommand = async function (id, command) {
  try {
    await API.request('POST', '/admin/desktop/command', { command: command, machine_ids: [id] });
    showToast('Queued — the machine picks it up on its next poll', 'success');
    window._swRender();
  } catch (e) { showToast(e.message, 'error'); }
};

window.adminSwBulk = async function (what) {
  var sel = window._swState.machines.selected || {};
  var ids = Object.keys(sel).filter(function (k) { return sel[k]; }).map(Number);
  if (!ids.length) { showToast('Select machines first', 'error'); return; }
  try {
    if (what === 'send_log') await API.request('POST', '/admin/desktop/command', { command: 'send_log', machine_ids: ids });
    else await API.request('POST', '/admin/desktop/machines/bulk', { action: what, ids: ids });
    showToast('Applied to ' + ids.length + ' machine(s)', 'success');
    window._swState.machines.selected = {};
    window._swRender();
  } catch (e) { showToast(e.message, 'error'); }
};

window.adminSwCancel = async function (id) {
  try { await API.request('POST', '/admin/desktop/command/' + id + '/cancel', {}); showToast('Cancelled', 'success'); window._swRender(); }
  catch (e) { showToast(e.message, 'error'); }
};

// Карточка машины: железо, аккаунты, свежий журнал, история решений и кнопки
// удалённого управления — всё в одном окне, чтобы не собирать это по вкладкам.
window.adminSwCard = async function (id) {
  var d;
  try { d = await API.request('GET', '/admin/desktop/machine/' + id); }
  catch (e) { showToast(e.message, 'error'); return; }

  var m = d.machine;
  var when = function (t) { return t ? new Date(String(t).replace(' ', 'T') + 'Z').toLocaleString() : '—'; };
  var row = function (l, v) {
    return '<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid var(--border)">'
      + '<span style="min-width:140px;color:var(--text-muted);font-size:12px">' + l + '</span>'
      + '<span style="font-size:13px;word-break:break-word">' + v + '</span></div>';
  };

  var root = document.getElementById('swModalRoot');
  if (!root) { root = document.createElement('div'); root.id = 'swModalRoot'; document.body.appendChild(root); }

  root.innerHTML = '<div class="modal-overlay" style="display:flex;z-index:1000" onclick="if(event.target===this)adminSwCardClose()">'
    + '<div class="adm-modal-card" style="max-width:940px;width:94%" onclick="event.stopPropagation()">'
    + '<div class="modal-header"><h3>' + escHtml(m.machine_name || 'Machine') + ' #' + id + '</h3>'
    + '<button class="modal-close" onclick="adminSwCardClose()">&times;</button></div>'
    + '<div class="modal-body" style="max-height:70vh;overflow:auto">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">'
    + '<div>'
      + row('Fingerprint', '<span style="font-family:monospace;font-size:11px">' + escHtml(m.machine_uid) + '</span>')
      + row('Owner', escHtml(m.username || '') + ' (ID ' + m.user_id + ')')
      + row('API key', '<span style="font-family:monospace">' + escHtml(m.key_prefix || '') + '</span>' + (m.key_active ? '' : ' <span style="color:#ef4444">key disabled</span>'))
      + row('System', escHtml((m.os || '') + ' ' + (m.os_version || '')) + (m.is_vm ? ' <span style="color:#f59e0b">virtual machine</span>' : ''))
      + row('Hardware', escHtml(m.cpu || '—') + (m.ram_mb ? ', ' + Math.round(m.ram_mb / 1024) + ' GB RAM' : ''))
      + row('Client version', escHtml(m.app_version || '—'))
      + row('Status', escHtml(m.status) + (m.paused ? ' (paused)' : '') + (m.block_reason ? ' — ' + escHtml(m.block_reason) : ''))
      + row('First seen', when(m.first_seen_at))
      + row('Last seen', when(m.last_seen_at))
      + row('Last address', escHtml(m.last_ip || '—'))
      + row('Accounts', (m.accounts_count || 0) + ' linked')
      + row('Work', (m.tasks_today || 0) + ' today, ' + (m.tasks_total || 0) + ' total, $' + Number(m.earned || 0).toFixed(2))
      + (d.diag ? row('Client reports', d.diag.accounts + ' accounts, ' + d.diag.online + ' online, ' + d.diag.errors + ' errors') : '')
    + '</div><div>'
      + '<div style="font-weight:700;margin-bottom:6px">Recent log</div>'
      + (d.logs && d.logs.length
          ? '<div style="max-height:200px;overflow:auto;font-size:12px;border:1px solid var(--border);border-radius:8px;padding:8px">'
            + d.logs.map(function (l) {
                return '<div style="padding:4px 0;border-bottom:1px solid var(--border)"><span style="color:' + (l.level === 'info' ? 'var(--text-muted)' : (l.level === 'warn' ? '#f59e0b' : '#ef4444')) + '">' + l.level + '</span> '
                  + '<span style="color:var(--text-muted)">' + when(l.created_at) + '</span><br>' + escHtml(l.message) + '</div>';
              }).join('') + '</div>'
          : '<div style="color:var(--text-muted);font-size:12px">No lines yet — ask the machine to send its log.</div>')
      + '<div style="font-weight:700;margin:14px 0 6px">History</div>'
      + '<div style="max-height:190px;overflow:auto;font-size:12px;border:1px solid var(--border);border-radius:8px;padding:8px">'
        + (d.events || []).map(function (e) {
            return '<div style="padding:4px 0;border-bottom:1px solid var(--border)"><strong>' + escHtml(e.type) + '</strong> '
              + '<span style="color:var(--text-muted)">' + when(e.created_at) + ' · ' + escHtml(e.actor || '') + '</span>'
              + (e.detail ? '<br>' + escHtml(e.detail) : '') + '</div>';
          }).join('')
      + '</div>'
    + '</div></div>'
    + '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">'
      + '<span style="color:var(--text-muted);font-size:12px;margin-right:4px">Send command:</span>'
      + ['send_log', 'reload_settings', 'recheck_accounts', 'update', 'stop'].map(function (cmd) {
          return '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px" onclick="adminSwCommand(' + id + ',\'' + cmd + '\')">' + cmd.replace(/_/g, ' ') + '</button>';
        }).join('')
      + '<span style="flex:1"></span>'
      + '<button class="btn btn-ghost" style="padding:6px 12px;width:auto;font-size:12px;color:#ef4444" onclick="adminSwAction(' + id + ',\'revoke\')">Revoke license</button>'
    + '</div></div></div></div>';
};

window.adminSwCardClose = function () {
  var root = document.getElementById('swModalRoot');
  if (root) root.innerHTML = '';
};

window.adminApiSetSetting = async function(key, value) {
  try {
    await API.request('POST', '/admin/settings', { key: key, value: String(value) });
    showToast('Saved', 'success');
    Router.navigate('/admin-api?tab=software');
  } catch (e) {
    showToast(e.message + (e.message && e.message.indexOf('not found') !== -1 ? ' — setting not seeded, restart web process first' : ''), 'error');
  }
};

window.adminApiSaveField = async function(key) {
  var el = document.getElementById('sw_' + key);
  if (!el) return;
  await window.adminApiSetSetting(key, el.value.trim());
};

window.adminApiKillSwitch = async function(v) {
  if (!v && !confirm('Disable the WHOLE Public API? Every bot-operator request will get service_unavailable.')) return;
  try { await API.request('POST', '/admin/settings', { key: 'public_api_enabled', value: String(v) }); showToast(v ? 'Public API enabled' : 'Public API DISABLED', v ? 'success' : 'error'); Router.navigate('/admin-api'); }
  catch (e) { showToast(e.message + (e.message && e.message.indexOf('not found') !== -1 ? ' — setting not seeded, restart web process first' : ''), 'error'); }
};
window.adminApiSetCheckMode = async function(id, v) {
  try { var res = await API.request('PUT', '/admin/public-api/keys/' + id, { check_mode: v }); showToast(v ? ('Check ON' + (res.checks_queued ? ', queued ' + res.checks_queued + ' checks' : '')) : 'Check OFF', 'success'); Router.navigate('/admin-api'); }
  catch (e) { showToast(e.message, 'error'); }
};
// Пулы и ставки ключа.
//
// Пул отвечает на вопрос «откуда брать заказы», цена — «сколько за это
// платить». Оставленная пустой цена означает «столько, сколько платится в этом
// пуле» — так работает всё сегодня, и менять это молча нельзя.
window.adminApiRates = async function (keyId) {
  var cfg, actions;
  try {
    cfg = await API.request('GET', '/admin/public-api/keys/' + keyId + '/config');
    actions = (await API.request('GET', '/admin/public-api/price-actions')).actions || [];
  } catch (e) { showToast(e.message, 'error'); return; }

  var pools = cfg.pools || { api: { on: 1, price: null } };
  var POOLS = [
    ['api', 'Software and phones pool', 'The automation pool: the Public API keys and the PR Worker phones take the same orders for the same pay (since 28.10.2026).'],
    ['manual', 'Site pool', 'The same work people do on pr.social. Issuing from here needs the offer board — see the note below.'],
  ];

  var body = '<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px">Prices are in units, 10000 units = $1. Leave a price empty to pay exactly what the pool pays. A price above what the advertiser paid is capped automatically.</div>';

  POOLS.forEach(function (p) {
    var name = p[0];
    var cur = pools[name] || { on: 0, price: null };
    var custom = cur.price && typeof cur.price === 'object';
    body += '<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:12px">'
      + '<label style="display:flex;align-items:center;gap:10px;font-weight:600">'
      + '<input type="checkbox" id="pool_' + name + '"' + (cur.on ? ' checked' : '') + '> ' + p[1] + '</label>'
      + '<div style="color:var(--text-muted);font-size:11px;margin:4px 0 10px">' + p[2] + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:8px">'
      + '<span style="color:var(--text-muted);min-width:130px">Actions</span>'
      + '<input class="form-input" id="poolacts_' + name + '" value="' + escHtml(cur.actions || '') + '" placeholder="all actions" style="max-width:260px;padding:5px 9px;font-size:12px">'
      + '<span style="color:var(--text-muted);font-size:11px">comma separated, e.g. join,react,view</span></div>'
      + '<label style="display:flex;align-items:center;gap:8px;font-size:12px">'
      + '<input type="checkbox" id="poolprice_' + name + '"' + (custom ? ' checked' : '') + ' onchange="adminApiRatesToggle(\'' + name + '\')"> own price for this pool</label>'
      + '<div id="pricebox_' + name + '" style="margin-top:8px;display:' + (custom ? 'block' : 'none') + '">'
      + '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">'
      + '<span style="font-size:12px;color:var(--text-muted);min-width:130px">All actions</span>'
      + '<input class="form-input" id="priceall_' + name + '" value="' + ((custom && cur.price['*']) || '') + '" placeholder="units" style="max-width:120px;padding:5px 9px;font-size:12px"></div>'
      + '<div style="max-height:190px;overflow:auto;border-top:1px solid var(--border);padding-top:8px">'
      + actions.map(function (a) {
          var k = a.platform + ':' + a.action;
          var v = (custom && cur.price[k]) || '';
          return '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">'
            + '<span style="font-size:12px;min-width:190px">' + a.platform + ' · ' + a.action
            + '<span style="color:var(--text-muted)"> (' + (a.open_orders || 0) + ' open, pays ' + (a.min_cost || a.base_cost || 0) + ')</span></span>'
            + '<input class="form-input" data-price="' + name + '|' + k + '" value="' + v + '" placeholder="units" style="max-width:110px;padding:4px 8px;font-size:12px">'
            + '</div>';
        }).join('')
      + '</div></div></div>';
  });

  body += '<div style="background:var(--bg-input);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--text-muted)">'
    + 'Orders are issued from every pool this key is allowed to use. The site pool and the phone pool share one reservation counter with their own contours, so the same order is never handed out twice. Leave <strong>actions</strong> empty to take everything from a pool, or list them to take only what your software can actually do — for example <code>join,react,view</code>.</div>';

  var root = document.getElementById('swModalRoot');
  if (!root) { root = document.createElement('div'); root.id = 'swModalRoot'; document.body.appendChild(root); }
  root.innerHTML = '<div class="modal-overlay" style="display:flex;z-index:1000" onclick="if(event.target===this)adminSwCardClose()">'
    + '<div class="adm-modal-card" style="max-width:720px;width:94%" onclick="event.stopPropagation()">'
    + '<div class="modal-header"><h3>Pools &amp; rates — ' + escHtml(cfg.key.prefix || ('#' + keyId)) + '</h3>'
    + '<button class="modal-close" onclick="adminSwCardClose()">&times;</button></div>'
    + '<div class="modal-body" style="max-height:70vh;overflow:auto">' + body + '</div>'
    + '<div class="modal-foot"><button class="btn btn-secondary" onclick="adminSwCardClose()">Cancel</button>'
    + '<button class="btn btn-primary" onclick="adminApiRatesSave(' + keyId + ')">Save</button></div>'
    + '</div></div>';
};

window.adminApiRatesToggle = function (pool) {
  var box = document.getElementById('pricebox_' + pool);
  var on = document.getElementById('poolprice_' + pool);
  if (box && on) box.style.display = on.checked ? 'block' : 'none';
};

window.adminApiRatesSave = async function (keyId) {
  var pools = {};
  ['api', 'manual'].forEach(function (name) {
    var on = document.getElementById('pool_' + name);
    var custom = document.getElementById('poolprice_' + name);
    var acts = document.getElementById('poolacts_' + name);
    var actsVal = acts && acts.value.trim() ? acts.value.trim().toLowerCase() : null;
    var entry = { on: on && on.checked ? 1 : 0, price: null, actions: actsVal };
    if (custom && custom.checked) {
      var price = {};
      var all = document.getElementById('priceall_' + name);
      if (all && all.value.trim()) price['*'] = parseInt(all.value.trim(), 10);
      document.querySelectorAll('[data-price^="' + name + '|"]').forEach(function (el) {
        var v = el.value.trim();
        if (v) price[el.dataset.price.split('|')[1]] = parseInt(v, 10);
      });
      if (Object.keys(price).length) entry.price = price;
    }
    pools[name] = entry;
  });

  try {
    await API.request('PUT', '/admin/public-api/keys/' + keyId, { pools_json: pools });
    showToast('Saved', 'success');
    adminSwCardClose();
    Router.navigate('/admin-api?tab=keys');
  } catch (e) { showToast(e.message, 'error'); }
};

window.adminApiEditKey = function(k) {
  var m = document.getElementById('apiKeyEditModal'); if (m) m.remove();
  m = document.createElement('div'); m.id = 'apiKeyEditModal';
  m.style.cssText = 'display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center';
  var f = function(label, id, val, type) { return '<div><label style="font-size:var(--font-sm);font-weight:600;margin-bottom:4px;display:block">' + label + '</label><input type="' + (type || 'number') + '" id="' + id + '" class="adm-setting-text-input" style="width:100%" value="' + String(val).replace(/"/g, '&quot;') + '" min="1"></div>'; };
  m.innerHTML = '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:440px;width:90%">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="margin:0">Edit Key #' + k.id + '</h3><button onclick="document.getElementById(\'apiKeyEditModal\').remove()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&times;</button></div>'
    + '<div style="display:flex;flex-direction:column;gap:12px">'
    + f('Name', 'apiEditName', k.name || '', 'text')
    + f('Daily Task Limit', 'apiEditDaily', k.daily_task_limit || 1000)
    + f('Rate (req/min)', 'apiEditRate', k.rate_limit_per_min || 120)
    + f('Max Accounts', 'apiEditMaxAcc', k.max_accounts || 100)
    + f('Daily Request Limit', 'apiEditReqLimit', k.daily_request_limit || 10000)
    + '<label style="display:flex;align-items:center;gap:8px;font-size:var(--font-sm);font-weight:600;cursor:pointer"><input type="checkbox" id="apiEditCheckMode"' + (k.check_mode ? ' checked' : '') + '> TikHub account check (orders only to passed/skipped)</label>'
    + '<button class="btn btn-primary" style="padding:10px;margin-top:8px" onclick="adminApiSubmitEdit(' + k.id + ')">Save</button>'
    + '</div></div>';
  document.body.appendChild(m);
  m.addEventListener('click', function(e) { if (e.target === m) m.remove(); });
};
window.adminApiSubmitEdit = async function(id) {
  var body = {
    name: document.getElementById('apiEditName').value.trim(),
    daily_task_limit: parseInt(document.getElementById('apiEditDaily').value),
    rate_limit_per_min: parseInt(document.getElementById('apiEditRate').value),
    max_accounts: parseInt(document.getElementById('apiEditMaxAcc').value),
    daily_request_limit: parseInt(document.getElementById('apiEditReqLimit').value),
    check_mode: document.getElementById('apiEditCheckMode').checked ? 1 : 0
  };
  try { var res = await API.request('PUT', '/admin/public-api/keys/' + id, body); document.getElementById('apiKeyEditModal').remove(); showToast('Key updated' + (res.checks_queued ? ', queued ' + res.checks_queued + ' checks' : ''), 'success'); Router.navigate('/admin-api'); }
  catch (e) { showToast(e.message, 'error'); }
};
window.adminApiAcctFilter = function(extra) {
  var q = new URLSearchParams({ tab: 'accounts' });
  var kv = { key_id: 'apiAcctKey', platform: 'apiAcctPlatform', check_status: 'apiAcctCheck', status: 'apiAcctStatus', search: 'apiAcctSearch' };
  Object.keys(kv).forEach(function(name) { var el = document.getElementById(kv[name]); if (el && el.value.trim()) q.set(name, el.value.trim()); });
  if (extra && extra.page) q.set('page', extra.page);
  Router.navigate('/admin-api?' + q.toString());
};
window.adminApiAcctPage = function(p) { window.adminApiAcctFilter({ page: p }); };
window.adminApiAcctBulk = async function(action) {
  var ids = Array.prototype.map.call(document.querySelectorAll('.apiAcctCb:checked'), function(c) { return parseInt(c.value); });
  if (!ids.length) return showToast('Select accounts first', 'error');
  if (action === 'ban' && !confirm('Ban ' + ids.length + ' account(s)? They stop getting orders and cannot be re-linked.')) return;
  try { var res = await API.request('POST', '/admin/public-api/accounts/action', { action: action, ids: ids }); showToast(action + ': ' + res.affected + ' affected', 'success'); window.adminApiAcctFilter(); }
  catch (e) { showToast(e.message, 'error'); }
};
window.adminApiPoolView = function(pool) { Router.navigate('/admin-api?tab=pools&pool=' + pool); };
window.adminApiFailedAction = async function(id, action) {
  if (action === 'cancel' && !confirm('Cancel order #' + id + '? Local cancel + push cancel/partial to PRM4U.')) return;
  try {
    var res = await API.request('POST', '/admin/public-api/failed-orders/action', { order_id: id, action: action });
    showToast(action === 'return' ? 'Order #' + id + ' returned to work' : 'Order #' + id + ' cancelled' + (res.prm4u ? ' — PRM4U: ' + res.prm4u : ''), 'success');
  } catch (e) { showToast(e.message || 'Action failed', 'error'); }
  Router.navigate('/admin-api?tab=failed');
};
window.adminApiMovePool = async function(pool) {
  var raw = (document.getElementById('apiPoolIds').value || '').trim();
  var ids = raw.split(/[\s,;]+/).map(function(x) { return parseInt(x); }).filter(function(n) { return Number.isFinite(n) && n > 0; });
  if (!ids.length) return showToast('Enter order IDs', 'error');
  if (!confirm('Move ' + ids.length + ' order(s) to the ' + pool.toUpperCase() + ' pool?')) return;
  try { var res = await API.request('POST', '/admin/public-api/orders/bulk-pool', { order_ids: ids, pool: pool }); showToast('Moved ' + res.moved + (res.skipped ? ', skipped ' + res.skipped + ' (final status)' : ''), 'success'); Router.navigate('/admin-api?tab=pools&pool=' + pool); }
  catch (e) { showToast(e.message, 'error'); }
};
// ============================================================
// admin-contests moved to public/js/admin/contests.js on 26.09.2026.



// ===== Agents (staff / limited-access admin accounts) — table + modal =====
var _staffData = { staff: [], available_sections: ['dashboard', 'orders', 'tickets', 'users', 'moderation', 'speedup'] };

// admin-staff (Agents) moved to public/js/admin/agents.js on 25.09.2026.

Router.register('admin-speedup-agent', async function(app) {
  var u = API.user || {};
  var allowed = u.admin_sections || [];
  if (u.role !== 'admin' && !(u.role === 'staff' && allowed.indexOf('speedup') >= 0)) { Router.navigate('/admin'); return; }
  app.innerHTML = '<div class="app-layout">' + renderAdminSidebar('admin-speedup-agent', _adminPendingCounts) + '<main class="main-content">'
    + '<div class="page-header"><div class="page-header-text"><h1>Speed Up</h1><p>Ускорение выплат — внеси ID выплаты из чата, он попадёт в приоритетную очередь</p></div></div>'
    + '<div style="max-width:680px;margin-top:24px">'
    + '<div style="background:var(--bg-card,#fff);border:1px solid var(--border);border-radius:14px;padding:22px 22px 18px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">'
    + '<label style="display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:9px">ID выплаты из чата</label>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap"><input id="agSpeedInput" type="text" inputmode="numeric" placeholder="например, 6330" autocomplete="off" onkeydown="if(event.key===\'Enter\')agentSpeedupSubmit()" style="flex:1;min-width:220px;padding:12px 15px;border:1px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text);font-size:15px;font-weight:500"><button class="btn btn-accent" style="padding:12px 28px;font-weight:600;white-space:nowrap;font-size:14px" onclick="agentSpeedupSubmit()">Добавить в очередь</button></div>'
    + '<div id="agSpeedStatus" style="font-size:13px;margin-top:11px;min-height:18px;line-height:1.5"></div>'
    + '</div>'
    + '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px"><h3 style="font-size:17px;font-weight:700;margin:0;letter-spacing:-0.01em">История добавленных</h3><span id="agSpeedCount" style="font-size:13px;color:var(--text-muted);font-weight:500"></span></div>'
    + '<div id="agSpeedHistory"><div class="adm-empty">Загрузка…</div></div>'
    + '</div></main></div>';
  loadAgentSpeedupHistory();
});
window.agentSpeedupSubmit = async function() {
  var inp = document.getElementById('agSpeedInput');
  var st = document.getElementById('agSpeedStatus');
  if (!inp || !st) return;
  var val = (inp.value || '').trim();
  if (!val) { st.style.color = '#dc2626'; st.textContent = 'Введите ID выплаты'; inp.focus(); return; }
  st.style.color = 'var(--text-muted)'; st.textContent = 'Добавляю…';
  try {
    var r = await API.request('POST', '/admin/withdrawals/priority-agent', { withdrawal_id_text: val });
    st.style.color = '#16a34a';
    if (r.escalated) {
      st.style.color = '#d97706';
      st.innerHTML = '🔥 Уже была в тикетах — пометил <strong>срочной из ТГ</strong>, выплата <strong>#' + r.resolved_withdrawal_id + '</strong> — оплатят первой';
    } else {
      st.innerHTML = r.resolved_withdrawal_id ? ('✓ Добавлено в очередь — выплата <strong>#' + r.resolved_withdrawal_id + '</strong>') : '✓ ID сохранён в очередь (админ сверит вручную)';
    }
    inp.value = ''; inp.focus();
    loadAgentSpeedupHistory();
  } catch (e) {
    st.style.color = '#dc2626';
    var m = (e.message || '').toLowerCase();
    st.textContent = /already/.test(m) ? 'Эта выплата уже в очереди Speed Up' : ('Ошибка: ' + (e.message || e));
  }
};
window.loadAgentSpeedupHistory = async function() {
  var el = document.getElementById('agSpeedHistory'); if (!el) return;
  try {
    var d = await API.request('GET', '/admin/withdrawals/priority-agent-history');
    var items = d.items || [];
    var cnt = document.getElementById('agSpeedCount'); if (cnt) cnt.textContent = items.length ? ('всего ' + items.length) : '';
    if (!items.length) { el.innerHTML = '<div class="adm-empty" style="padding:48px 20px;text-align:center;color:var(--text-muted);border:1px dashed var(--border);border-radius:14px">Пока ничего не добавлено</div>'; return; }
    var TH = 'padding:11px 16px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em';
    var TD = 'padding:13px 16px';
    var rows = items.map(function(it) {
      var wid = it.withdrawal_id ? ('<strong style="font-size:14px">#' + it.withdrawal_id + '</strong>') : ('<span style="color:#d97706">' + escHtml(it.withdrawal_id_text || '') + ' <span style="font-size:11px;color:var(--text-muted)">(не сопоставлено)</span></span>');
      var amount = it.wd_amount_units ? ('$' + (Math.round(it.wd_amount_units) / 10000)) : '<span style="color:var(--text-muted)">—</span>';
      var wallet = it.wd_wallet ? ('<span style="font-family:monospace;font-size:12px">' + escHtml(String(it.wd_wallet).slice(0, 8)) + '…' + escHtml(String(it.wd_wallet).slice(-6)) + '</span>' + (it.wd_network ? '<br><span style="font-size:11px;color:var(--text-muted);text-transform:uppercase">' + escHtml(it.wd_network) + '</span>' : '')) : '<span style="color:var(--text-muted)">—</span>';
      var sent = '<span style="display:inline-block;padding:3px 11px;border-radius:20px;background:#dcfce7;color:#166534;font-size:12px;font-weight:600">Отправлено в приоритет</span>';
      var when = it.created_at ? new Date(it.created_at + 'Z').toLocaleString() : '—';
      return '<tr><td style="' + TD + '">' + wid + '</td><td style="' + TD + ';font-weight:500">' + (it.user_username ? escHtml(it.user_username) : '<span style="color:var(--text-muted)">—</span>') + '</td><td style="' + TD + ';font-weight:600">' + amount + '</td><td style="' + TD + '">' + wallet + '</td><td style="' + TD + '">' + sent + '</td><td style="' + TD + ';color:var(--text-muted);font-size:13px;white-space:nowrap">' + when + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="adm-table-wrap" style="border:1px solid var(--border);border-radius:14px;overflow:hidden"><table class="adm-table" style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:var(--bg-subtle,#f9fafb);text-align:left"><th style="' + TH + '">Выплата</th><th style="' + TH + '">Юзер</th><th style="' + TH + '">Сумма</th><th style="' + TH + '">Кошелёк</th><th style="' + TH + '">Статус</th><th style="' + TH + '">Добавлено</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  } catch (e) { el.innerHTML = '<div class="adm-empty">Ошибка: ' + escHtml(e.message || String(e)) + '</div>'; }
};


// ============================================================
// admin-backups moved to public/js/admin/backups.js on 28.09.2026.


// ===== Free Views TG — admin tab (engine: src/services/tg-views.js, worker: pr-staging-tgviews) =====
Router.register('admin-free-views', async (app) => {
  if (typeof _loadAdminPendingCounts === 'function') { try { await _loadAdminPendingCounts(); } catch (e) {} }
  const counts = (typeof _adminPendingCounts !== 'undefined') ? _adminPendingCounts : {};
  const fld = (label, id, val, hint) => `
    <div style="display:flex;flex-direction:column;gap:4px;min-width:150px">
      <label style="font-size:12px;color:#6b7280;font-weight:600">${label}</label>
      <input id="${id}" type="number" value="${val}" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
      ${hint ? `<span style="font-size:11px;color:#9ca3af">${hint}</span>` : ''}
    </div>`;
  app.innerHTML = `<div class="app-layout">${renderAdminSidebar('admin-free-views', counts)}<main class="main-content">
    <div class="page-header">${typeof renderHamburger==='function'?renderHamburger():''}<div class="page-header-text"><h1>Free Views TG</h1><p>Накрутка просмотров Telegram — создание заданий и автоподача</p></div></div>

    <div style="padding:0 24px 24px;max-width:1100px">

      <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:12px;padding:14px 18px;margin-bottom:20px">
        <div style="font-weight:700;color:#065f46;font-size:14px">✓ Метод работает · 51 просмотр/сек с 1 IP · 1 токен = ~100 просмотров</div>
      </div>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="font-weight:700;font-size:16px;margin-bottom:14px">Создать задание</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
          <div style="flex:1;min-width:260px;display:flex;flex-direction:column;gap:4px">
            <label style="font-size:12px;color:#6b7280;font-weight:600">Ссылка на пост Telegram</label>
            <input id="fvJobTarget" type="text" placeholder="https://t.me/yourchannel/12" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
          </div>
          <div style="width:140px;display:flex;flex-direction:column;gap:4px">
            <label style="font-size:12px;color:#6b7280;font-weight:600">Сколько просмотров</label>
            <input id="fvJobQty" type="number" value="10000" min="1" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
          </div>
          <div style="width:140px;display:flex;flex-direction:column;gap:4px">
            <label style="font-size:12px;color:#6b7280;font-weight:600">Скорость (просм/мин)</label>
            <input id="fvJobSpeed" type="number" value="1000" min="1" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
          </div>
          <button id="fvJobStart" style="padding:10px 22px;background:#10b981;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">Запустить</button>
        </div>
        <div id="fvJobMsg" style="margin-top:10px;font-size:13px"></div>
      </div>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="font-weight:700;font-size:16px;margin-bottom:14px">Задания <span style="font-size:12px;color:#9ca3af;font-weight:400">(обновляется автоматически)</span></div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead><tr style="text-align:left;color:#6b7280;border-bottom:1px solid #e5e7eb">
              <th style="padding:8px 6px">#</th><th style="padding:8px 6px">Пост</th><th style="padding:8px 6px;width:220px">Прогресс</th><th style="padding:8px 6px">Скорость</th><th style="padding:8px 6px">Статус</th><th style="padding:8px 6px">Действия</th>
            </tr></thead>
            <tbody id="fvJobsBody"><tr><td colspan="6" style="padding:14px 6px;color:#9ca3af">Загрузка…</td></tr></tbody>
          </table>
        </div>
      </div>

      <details style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px;margin-bottom:20px">
        <summary style="font-weight:700;font-size:15px;cursor:pointer">Ручной тест механики</summary>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-top:14px">
          <div style="flex:1;min-width:240px;display:flex;flex-direction:column;gap:4px">
            <label style="font-size:12px;color:#6b7280;font-weight:600">Ссылка на пост</label>
            <input id="fvTarget" type="text" placeholder="https://t.me/telegram/339" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
          </div>
          <div style="width:110px;display:flex;flex-direction:column;gap:4px">
            <label style="font-size:12px;color:#6b7280;font-weight:600">Кол-во</label>
            <input id="fvQty" type="number" value="100" min="1" max="2000" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
          </div>
          <button id="fvTest1" style="padding:9px 16px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">+1</button>
          <button id="fvTestN" style="padding:9px 16px;background:#111827;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Batch</button>
        </div>
        <div id="fvResult" style="margin-top:12px;font-size:13px;white-space:pre-wrap;font-family:ui-monospace,monospace"></div>
      </details>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="font-weight:700;font-size:16px">Настройки</div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px">
            <input id="fvEnabled" type="checkbox" style="width:18px;height:18px"> Услуга включена
          </label>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${fld('Цена за 1000 (units)', 'fvPrice', 0, '0 = бесплатно')}
          ${fld('Мин. заказ', 'fvMin', 100)}
          ${fld('Макс. заказ', 'fvMax', 100000)}
          ${fld('Скорость по умолч.', 'fvSpeed', 1000, 'просм/мин')}
          ${fld('Concurrency', 'fvConc', 40, 'параллельных')}
          ${fld('Таймаут (сек)', 'fvTimeout', 8)}
        </div>
        <div style="margin-top:16px;display:flex;gap:18px;flex-wrap:wrap;align-items:center">
          <span style="font-size:12px;color:#9ca3af">Прокси (сейчас не нужны — Telegram не банит по IP; запас на будущее):</span>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px"><input id="fvPxHttp" type="checkbox"> HTTP</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px"><input id="fvPxS4" type="checkbox"> SOCKS4</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px"><input id="fvPxS5" type="checkbox"> SOCKS5</label>
        </div>
        <button id="fvSave" style="margin-top:18px;padding:10px 22px;background:#6b7280;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">Сохранить настройки</button>
        <span id="fvSaveMsg" style="margin-left:12px;font-size:13px;color:#10b981"></span>
      </div>

    </div>
  </main></div>`;

  const api = (m, p, b) => API.request(m, p, b);

  // ---- load settings ----
  try {
    const r = await api('GET', '/admin/free-views/settings');
    const c = (r && r.config) || {};
    const set = (id, v) => { const el = document.getElementById(id); if (el && v != null) el.value = v; };
    const chk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
    chk('fvEnabled', c.enabled); set('fvPrice', c.price_per_1000); set('fvMin', c.min_order); set('fvMax', c.max_order);
    set('fvSpeed', c.speed_per_min); set('fvConc', c.concurrency); set('fvTimeout', c.timeout_sec);
    chk('fvPxHttp', c.proxy_http); chk('fvPxS4', c.proxy_socks4); chk('fvPxS5', c.proxy_socks5);
  } catch (e) {}

  // ---- jobs table ----
  const STATUS = { running:['идёт','#2563eb'], paused:['пауза','#d97706'], done:['готово','#059669'], failed:['ошибка','#dc2626'], cancelled:['отменён','#6b7280'] };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  async function renderJobs() {
    const body = document.getElementById('fvJobsBody');
    if (!body) return false; // page changed -> stop polling
    let jobs = [];
    try { const r = await api('GET', '/admin/free-views/jobs'); jobs = (r && r.jobs) || []; } catch (e) { return true; }
    if (!jobs.length) { body.innerHTML = '<tr><td colspan="6" style="padding:14px 6px;color:#9ca3af">Заданий пока нет</td></tr>'; return true; }
    body.innerHTML = jobs.map(j => {
      const req = j.qty_requested || 0, del = j.qty_delivered || 0;
      const pct = req ? Math.min(100, Math.round(del / req * 100)) : 0;
      const st = STATUS[j.status] || [j.status, '#6b7280'];
      const acts = [];
      if (j.status === 'running') acts.push(`<button data-act="pause" data-id="${j.id}" style="padding:4px 10px;border:1px solid #e5e7eb;background:#fff;border-radius:6px;cursor:pointer;font-size:12px">Пауза</button>`);
      if (j.status === 'paused') acts.push(`<button data-act="resume" data-id="${j.id}" style="padding:4px 10px;border:1px solid #e5e7eb;background:#fff;border-radius:6px;cursor:pointer;font-size:12px">Продолжить</button>`);
      if (j.status === 'running' || j.status === 'paused') acts.push(`<button data-act="cancel" data-id="${j.id}" style="padding:4px 10px;border:1px solid #fca5a5;color:#dc2626;background:#fff;border-radius:6px;cursor:pointer;font-size:12px">Стоп</button>`);
      return `<tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 6px;color:#9ca3af">${j.id}</td>
        <td style="padding:8px 6px"><a href="${esc(j.target_url || ('https://t.me/'+j.channel+'/'+j.post))}" target="_blank" style="color:#2563eb;text-decoration:none">${esc(j.channel)}/${esc(j.post)}</a></td>
        <td style="padding:8px 6px">
          <div style="background:#f3f4f6;border-radius:6px;height:8px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${st[1]}"></div></div>
          <div style="font-size:11px;color:#6b7280;margin-top:3px">${del.toLocaleString()} / ${req.toLocaleString()} (${pct}%)${j.qty_failed?(' · ошибок '+j.qty_failed):''}</div>
        </td>
        <td style="padding:8px 6px;color:#6b7280">${j.speed_per_min}/мин</td>
        <td style="padding:8px 6px"><span style="color:${st[1]};font-weight:600">${st[0]}</span></td>
        <td style="padding:8px 6px"><div style="display:flex;gap:6px">${acts.join('')}</div></td>
      </tr>`;
    }).join('');
    body.querySelectorAll('button[data-act]').forEach(btn => {
      btn.onclick = async () => {
        try { await api('POST', '/admin/free-views/jobs/' + btn.dataset.id + '/' + btn.dataset.act); await renderJobs(); } catch (e) {}
      };
    });
    return true;
  }
  await renderJobs();
  const poll = setInterval(async () => { const alive = await renderJobs(); if (!alive) clearInterval(poll); }, 3000);

  // ---- create job ----
  document.getElementById('fvJobStart').onclick = async () => {
    const target = document.getElementById('fvJobTarget').value.trim();
    const qty = parseInt(document.getElementById('fvJobQty').value, 10) || 0;
    const speed = parseInt(document.getElementById('fvJobSpeed').value, 10) || 0;
    const msg = document.getElementById('fvJobMsg');
    if (!target) { msg.style.color = '#dc2626'; msg.textContent = 'Вставь ссылку на пост.'; return; }
    if (qty < 1) { msg.style.color = '#dc2626'; msg.textContent = 'Укажи количество.'; return; }
    msg.style.color = '#6b7280'; msg.textContent = 'Создаю задание…';
    try {
      const r = await api('POST', '/admin/free-views/jobs', { target, qty, speed });
      msg.style.color = '#059669'; msg.textContent = '✓ Задание #' + r.job.id + ' запущено — накрутка пошла.';
      document.getElementById('fvJobTarget').value = '';
      await renderJobs();
    } catch (e) { msg.style.color = '#dc2626'; msg.textContent = '✗ ' + (e.error || e.message || e); }
  };

  // ---- manual test ----
  const out = document.getElementById('fvResult');
  document.getElementById('fvTest1').onclick = async () => {
    const target = document.getElementById('fvTarget').value.trim();
    if (!target) { out.textContent = 'Вставь ссылку.'; return; }
    out.textContent = 'Отправляю 1 просмотр…';
    try { const r = await api('POST', '/admin/free-views/test', { target });
      out.textContent = r.ok ? ('✓ Просмотр засчитан — ' + r.target.channel + '/' + r.target.post) : ('✗ Не засчитан: ' + JSON.stringify(r.result || r.error));
    } catch (e) { out.textContent = '✗ ' + (e.error || e.message || e); }
  };
  document.getElementById('fvTestN').onclick = async () => {
    const target = document.getElementById('fvTarget').value.trim();
    const qty = parseInt(document.getElementById('fvQty').value, 10) || 100;
    if (!target) { out.textContent = 'Вставь ссылку.'; return; }
    out.textContent = 'Лью ' + qty + '…';
    try { const r = await api('POST', '/admin/free-views/test-batch', { target, qty });
      const x = r.result || {};
      out.textContent = '✓ Доставлено ' + x.delivered + '/' + qty + ' за ' + (x.elapsedMs/1000).toFixed(1) + 'с · ≈' + Math.round(x.delivered/(x.elapsedMs/1000)) + ' просм/сек' + (x.error ? ('\n⚠ ' + x.error) : '');
    } catch (e) { out.textContent = '✗ ' + (e.error || e.message || e); }
  };

  // ---- save settings ----
  document.getElementById('fvSave').onclick = async () => {
    const num = id => parseInt(document.getElementById(id).value, 10) || 0;
    const body = {
      enabled: document.getElementById('fvEnabled').checked,
      price_per_1000: num('fvPrice'), min_order: num('fvMin'), max_order: num('fvMax'),
      speed_per_min: num('fvSpeed'), concurrency: num('fvConc'), timeout_sec: num('fvTimeout'),
      proxy_http: document.getElementById('fvPxHttp').checked,
      proxy_socks4: document.getElementById('fvPxS4').checked,
      proxy_socks5: document.getElementById('fvPxS5').checked,
    };
    const msg = document.getElementById('fvSaveMsg');
    msg.textContent = 'Сохраняю…';
    try { await api('POST', '/admin/free-views/settings', body); msg.textContent = '✓ Сохранено'; setTimeout(() => msg.textContent = '', 2500); }
    catch (e) { msg.textContent = '✗ ' + (e.error || e.message || e); }
  };
});


// ============================================================
// TELEGRAM WEB WORKER — сводка по аккаунтам, которые отдали люди
//
// Одна страница, один запрос. Всё, что здесь показано, считается на сервере
// агрегатами и кладётся в память на минуту: раздел смотрят глазами, а не
// опрашивают роботом.
// ============================================================
Router.register('admin-web-worker', async (app) => {
  const esc = (v) => (typeof escHtml === 'function' ? escHtml(String(v == null ? '' : v)) : String(v == null ? '' : v));
  const число = (v) => (Number(v) || 0).toLocaleString();
  const деньги = (v) => {
    const ч = Number(v) || 0;
    if (ч === 0) return '$0';
    if (ч >= 0.01) return '$' + ч.toFixed(2);
    return '$' + ч.toFixed(6);
  };

  const СОСТОЯНИЯ = [
    ['live', 'В работе', 'ok'],
    ['warming', 'Готовятся', 'wait'],
    ['new', 'Ждут проверки', 'wait'],
    ['checking', 'Проверяются', 'wait'],
    ['needs_login', 'Нужен вход', 'warn'],
    ['paused', 'На паузе', 'off'],
    ['rejected', 'Не приняты', 'bad'],
    ['dead', 'Заблокированы', 'bad'],
    ['withdrawn', 'Отключены', 'off'],
  ];

  app.innerHTML = `
  <div class="app-layout">
  ${renderAdminSidebar('admin-web-worker')}
  <main class="main-content">
    <div class="page-header">
      ${typeof renderHamburger === 'function' ? renderHamburger() : ''}
      <div class="page-header-text">
        <h1>Telegram Web Worker</h1>
        <p>Аккаунты, которые люди отдали в парк сами</p>
      </div>
      <button class="btn btn-secondary" id="wwReload" style="margin-left:auto">Обновить</button>
    </div>
    <div class="page-content"><div id="wwBody">Загружаем…</div></div>
  </main>
  </div>`;

  const тело = document.getElementById('wwBody');

  async function загрузить() {
    let d;
    try {
      d = await API.request('GET', '/admin/autoearn/stats');
    } catch (e) {
      тело.innerHTML = '<div class="card">Не удалось получить сводку: ' + esc(e.message) + '</div>';
      return;
    }

    const с = d.settings || {};
    const оч = d.queue || {};
    const плитка = (заголовок, значение, подпись) => `
      <div class="stat-card">
        <div class="stat-label">${esc(заголовок)}</div>
        <div class="stat-value">${значение}</div>
        ${подпись ? `<div class="stat-sub">${подпись}</div>` : ''}
      </div>`;

    тело.innerHTML = `
      <div class="stats-grid" style="margin-bottom:16px">
        ${плитка('Аккаунтов', число(d.total.accounts),
          'от ' + число(d.total.users) + ' чел.')}
        ${плитка('В работе', число((d.by_status || {}).live || 0),
          число((d.by_status || {}).warming || 0) + ' готовятся')}
        ${плитка('В очереди на проверку', число(оч.now),
          'потолок ' + число(оч.max))}
        ${плитка('Выплачено владельцам', деньги((d.payouts || {}).paid),
          'наша доля ' + деньги((d.payouts || {}).ours))}
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3>За сутки</h3></div>
        <div class="stats-grid">
          ${плитка('Принято аккаунтов', число(d.day.accepted), 'от ' + число(d.day.users) + ' чел.')}
          ${плитка('Из них в работе', число(d.day.working), '')}
          ${плитка('Отказано', число(d.day.rejected), '')}
          ${плитка('Начислено людям', деньги(d.day.paid), '')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px" class="ww-cols">
        <div class="card">
          <div class="card-header"><h3>По состояниям</h3></div>
          <table class="data-table">
            <thead><tr><th>Состояние</th><th style="text-align:right">Аккаунтов</th></tr></thead>
            <tbody>${СОСТОЯНИЯ.map(([к, имя]) => {
              const n = (d.by_status || {})[к] || 0;
              return n ? `<tr><td>${esc(имя)}</td><td style="text-align:right">${число(n)}</td></tr>` : '';
            }).join('') || '<tr><td colspan="2">пока пусто</td></tr>'}</tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header"><h3>Почему не принимали</h3></div>
          <table class="data-table">
            <thead><tr><th>Причина</th><th style="text-align:right">Раз</th></tr></thead>
            <tbody>${(d.reasons || []).map((r) => `<tr>
              <td>${esc(String(r.reason).slice(0, 90))}</td>
              <td style="text-align:right">${число(r.count)}</td></tr>`).join('')
              || '<tr><td colspan="2">отказов не было</td></tr>'}</tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3>Кто отдал больше всех</h3></div>
        <table class="data-table">
          <thead><tr>
            <th>Пользователь</th>
            <th style="text-align:right">Аккаунтов</th>
            <th style="text-align:right">В работе</th>
            <th style="text-align:right">Отказов</th>
            <th style="text-align:right">Заработали</th>
            <th>Последний</th>
          </tr></thead>
          <tbody>${(d.top || []).map((r) => `<tr>
            <td><a onclick="Router.navigate('/admin-users?id=${r.user_id}')">${esc(r.username || r.email || ('#' + r.user_id))}</a></td>
            <td style="text-align:right">${число(r.accounts)}</td>
            <td style="text-align:right">${число(r.working)}</td>
            <td style="text-align:right">${число(r.rejected)}</td>
            <td style="text-align:right">${деньги(r.earned)}</td>
            <td>${esc(String(r.last || '').slice(0, 16))}</td>
          </tr>`).join('') || '<tr><td colspan="6">никто ещё не подключал</td></tr>'}</tbody>
        </table>
      </div>

      <div class="card" id="wwSettings">
        <style>
          #wwSettings .data-table td{vertical-align:top;padding:5px 14px}
          #wwSettings .data-table th{padding:12px 14px 4px;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary,#7b869a)}
          #wwSettings .form-input{height:32px;min-height:0;padding:4px 10px;font-size:13.5px}
          #wwSettings #wwLadder td{padding:3px 6px 3px 0;border:0}
          #wwSettings .btn-sm{height:30px;padding:0 12px}
          #wwSave{width:auto;height:36px;padding:0 22px}
        </style>
        <div class="card-header"><h3>Настройки раздела</h3></div>
        ${формаНастроек(d.values || {})}
      </div>`;
    навестиФорму(d.values || {});
  }

  /* (29.10.2026) Настройки раздела меняются здесь, а не в базе. Каждое значение сервер проверяет сам (POST /admin/autoearn/settings):
     лестница доли и потолок начисления — деньги. Уходят только изменённые поля. */
  const ПОЛЯ = [
    ['Доступ', [
      ['autoearn_enabled', 'Раздел открыт', 'bool'],
      ['autoearn_test_user_ids', 'Видят только эти люди', 'text', 'номера через запятую; пусто — все'],
      ['autoearn_min_tasks', 'Заданий на сайте, чтобы открыть раздел', 'int'],
      ['autoearn_max_per_user', 'Аккаунтов на одного человека', 'int'],
    ]],
    ['Деньги', [
      ['autoearn_levels', 'Лестница доли владельца', 'levels', 'от скольких заданий (сайт + аккаунты) какая доля'],
      ['autoearn_share_pct', 'Доля, если лестница пуста, %', 'int'],
      ['autoearn_max_payout_units', 'Потолок одного начисления, units', 'int', '10 000 units = $1; выше — не начисляется, пишется в журнал'],
      ['autoearn_lock_hours', 'Часов, когда аккаунт нельзя забрать', 'int', 'от отправки на проверку'],
    ]],
    ['Приём и проверка', [
      ['autoearn_batch_max', 'Аккаунтов за одну загрузку', 'int'],
      ['autoearn_queue_max', 'Потолок общей очереди на проверку', 'int'],
      ['autoearn_max_upload_mb', 'Размер файла, МБ', 'int'],
      ['autoearn_check_timeout_min', 'Проверка, которую программа не взяла, мин', 'int'],
      ['autoearn_check_stuck_hours', 'Проверка, которую программа не закончила, ч', 'int'],
      ['autoearn_login_ttl_min', 'Срок входа по номеру, мин', 'int'],
      ['autoearn_login_max_attempts', 'Попыток кода или пароля', 'int'],
      ['autoearn_secret_keep_hours', 'Хранить сеанс отозванного аккаунта, ч', 'int'],
      ['autoearn_version', 'Версия раздела', 'text'],
    ]],
  ];
  const ТОЛЬКО_ЧТЕНИЕ = [['autoearn_payout_minutes', 'Отчёт программы, мин'], ['autoearn_actions', 'Виды работы'], ['autoearn_machine_uid', 'Машина парка']];
  const лестницаИз = (v) => { try { const a = JSON.parse(v || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const строкаСтупени = (t, p) => `<tr class="ww-st"><td><input class="form-input ww-t" type="number" min="0" step="1" value="${esc(String(t))}" style="width:110px"></td>
    <td><input class="form-input ww-p" type="number" min="1" max="99" step="1" value="${esc(String(p))}" style="width:80px"> %</td>
    <td style="text-align:right"><button type="button" class="btn btn-secondary btn-sm ww-del">Убрать</button></td></tr>`;
  function формаНастроек(v) {
    const поле = ([k, имя, вид, подсказка]) => {
      let ввод;
      if (вид === 'bool') ввод = `<select class="form-input" data-k="${k}"><option value="1"${v[k] === '1' ? ' selected' : ''}>да</option><option value="0"${v[k] !== '1' ? ' selected' : ''}>нет</option></select>`;
      else if (вид === 'levels') ввод = `<table class="data-table" style="margin:0"><thead><tr><th>От заданий</th><th>Доля</th><th></th></tr></thead>
          <tbody id="wwLadder">${лестницаИз(v[k]).map(([t, p]) => строкаСтупени(t, p)).join('')}</tbody></table>
          <button type="button" class="btn btn-secondary btn-sm" id="wwAddStep" style="margin-top:6px">Добавить ступень</button>`;
      else ввод = `<input class="form-input" data-k="${k}" type="${вид === 'int' ? 'number' : 'text'}"${вид === 'int' ? ' min="0" step="1"' : ''} value="${esc(v[k] || '')}" style="width:${вид === 'int' ? '140px' : '100%'}">`;
      return `<tr><td style="width:42%">${esc(имя)}${подсказка ? `<div style="font-size:12px;color:var(--text-secondary,#7b869a)">${esc(подсказка)}</div>` : ''}</td><td>${ввод}</td></tr>`;
    };
    return `<table class="data-table"><tbody>
        ${ПОЛЯ.map(([группа, поля]) => `<tr><th colspan="2" style="text-align:left">${esc(группа)}</th></tr>` + поля.map(поле).join('')).join('')}
        <tr><th colspan="2" style="text-align:left">Задаёт программа парка (только просмотр)</th></tr>
        ${ТОЛЬКО_ЧТЕНИЕ.map(([k, имя]) => `<tr><td>${esc(имя)}</td><td>${esc(v[k] || '—')}</td></tr>`).join('')}
      </tbody></table>
      <div style="padding:10px 14px;display:flex;gap:12px;align-items:center">
        <button type="button" class="btn btn-primary" id="wwSave">Сохранить</button><span id="wwSaveMsg" style="font-size:13px"></span>
      </div>`;
  }
  function навестиФорму(было) {
    const корень = document.getElementById('wwSettings'); if (!корень) return;
    const лестница = document.getElementById('wwLadder'), сказать = (текст, плохо) => { const m = document.getElementById('wwSaveMsg'); m.textContent = текст; m.style.color = плохо ? '#dc2626' : '#059669'; };
    document.getElementById('wwAddStep').onclick = () => {
      const ст = [...лестница.querySelectorAll('.ww-st')], посл = ст.length ? ст[ст.length - 1] : null;
      лестница.insertAdjacentHTML('beforeend', строкаСтупени(посл ? Number(посл.querySelector('.ww-t').value || 0) * 2 || 1000 : 0, посл ? посл.querySelector('.ww-p').value : 50));
    };
    лестница.onclick = (e) => { const b = e.target.closest('.ww-del'); if (b) b.closest('tr').remove(); };
    document.getElementById('wwSave').onclick = async () => {
      const стало = {};
      корень.querySelectorAll('[data-k]').forEach((el) => { стало[el.dataset.k] = el.value.trim(); });
      стало.autoearn_levels = JSON.stringify([...лестница.querySelectorAll('.ww-st')].map((r) => [Number(r.querySelector('.ww-t').value), Number(r.querySelector('.ww-p').value)]));
      const изменено = Object.fromEntries(Object.entries(стало).filter(([k, x]) => k === 'autoearn_levels' ? x !== JSON.stringify(лестницаИз(было[k])) : x !== (было[k] || '')));
      if (!Object.keys(изменено).length) { сказать('Ничего не изменено'); return; }
      const кнопка = document.getElementById('wwSave'); кнопка.disabled = true; сказать('Сохраняем…');
      try {
        const r = await fetch('/api/admin/autoearn/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ settings: изменено }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) {
          const имя = (ПОЛЯ.flatMap(([, п]) => п).find(([k]) => k === j.key) || [])[1] || j.key || '';
          сказать('Не сохранено' + (имя ? ': ' + имя : '') + (j.message ? ' — ' + j.message : ''), true); кнопка.disabled = false; return;
        }
        сказать('Сохранено: ' + j.changed.length);
        await загрузить();
      } catch (e) { сказать('Не сохранено: нет связи с сервером', true); кнопка.disabled = false; }
    };
  }

  document.getElementById('wwReload').onclick = загрузить;
  await загрузить();
});
