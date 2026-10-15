// Мои задания.
//
// Прежняя версия грузила последние 50 заданий и считала по ним же «оплачено»,
// из-за чего цифры в шапке и в списке расходились: «Paid 59», а ниже
// «PAID (24)». Источники Chrome / Web были фильтром по способу отправки, а не
// разделами работы, и Android там всегда показывал ноль.
//
// Теперь разделы = три контура работы: ручная работа на сайте, приложение и
// премиум. Деньги и счётчики приходят из готовых дневных итогов (одно чтение),
// список — страницами по 25. Ботоводов здесь нет: у них свой кабинет.

Router.register('my-tasks', async (app) => {
  const TABS = [
    { id: 'manual',  label: () => t('mt_tab_manual')  || 'Manual tasks' },
    { id: 'app',     label: () => t('mt_tab_app')     || 'Android' },
    { id: 'premium', label: () => t('mt_tab_premium') || 'Premium' },
    { id: 'rates',   label: () => t('mt_tab_rates')   || 'Rates' },
  ];

  const STATUSES = [
    { id: '',               label: () => t('tasks_all') || 'All' },
    { id: 'approved',       label: () => t('tasks_status_approved_short') || 'Approved' },
    { id: 'pending_review', label: () => t('tasks_status_pending') || 'On review' },
    { id: 'in_progress',    label: () => t('tasks_status_in_progress') || 'In progress' },
    { id: 'rejected',       label: () => t('tasks_status_rejected_short') || 'Rejected' },
  ];

  let tab = 'manual';
  let status = '';
  let page = 1;
  let platform = '';
  let summary = null;

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('my-tasks')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('my_tasks_title')}</h1>
          <p>${t('my_tasks_subtitle')}</p>
        </div>
      </div>
      <div class="page-content">
        <div id="mtSummary"></div>
        <div class="mt-tabs" id="mtTabs">
          ${TABS.map(x => `<button class="mt-tab${x.id === tab ? ' active' : ''}" data-tab="${x.id}">${x.label()}</button>`).join('')}
        </div>
        <div id="mtBody"></div>
      </div>
    </main>
  </div>`;

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Дата в виде «3 дня назад»: точная отметка человеку тут не нужна, а место
  // на телефоне экономит заметно.
  function ago(iso) {
    if (!iso) return '—';
    const d = new Date(String(iso).replace(' ', 'T') + 'Z');
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days < 1) return t('mt_today') || 'today';
    if (days === 1) return t('mt_yesterday') || 'yesterday';
    return `${days} ${t('mt_days_ago') || 'd ago'}`;
  }

  // Общий формат цен округляет до четырёх знаков — для приложения этого мало:
  // один просмотр стоит $0.000001 и превратился бы в «$0». Крупные суммы
  // показываем как везде, мелкие — со значащими знаками.
  function fmtApp(n) {
    const v = Number(n) || 0;
    if (v >= 0.01) return fmtPrice(v);
    if (v <= 0) return '$0';
    return '$' + v.toFixed(7).replace(/0+$/, '').replace(/\.$/, '');
  }

  // Названия действий приложения. Ключ — то, что телефон присылает в отчёте.
  const APP_ACT = {
    view: () => t('mt_act_view') || 'Views',
    react: () => t('mt_act_react') || 'Reactions',
    join: () => t('mt_act_join') || 'Subscriptions',
    comment_emoji: () => t('mt_act_comment') || 'Comments',
  };
  const actName = (a) => (APP_ACT[a] ? APP_ACT[a]() : String(a || '').replace(/_/g, ' '));
  // Порядок колонок в разбивке — от массового к дорогому, чтобы взгляд шёл
  // слева направо так же, как растёт цена действия.
  // Цвет вида работы: подписки дороже реакций, реакции дороже просмотров —
  // по цвету человек различает строки, не вчитываясь.
  const APP_ACT_COLOR = {
    view: '#3b82f6', react: '#a855f7', comment_emoji: '#f59e0b', join: '#10b981',
  };

  // Дата-время отчёта в местном времени телефона/браузера: сервер отдаёт UTC.
  function when(iso) {
    const d = new Date(String(iso).replace(' ', 'T') + 'Z');
    if (isNaN(d)) return '—';
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return sameDay ? time : d.toLocaleDateString([], { day: '2-digit', month: '2-digit' }) + ' ' + time;
  }

  const STATUS_COLOR = {
    approved: '#10b981', pending_review: '#f59e0b', in_progress: '#3b82f6',
    rejected: '#ef4444', cancelled: '#94a3b8', link_dead: '#94a3b8',
  };

  function statusLabel(s) {
    return ({
      approved: t('tasks_status_approved_short') || 'Approved',
      pending_review: t('tasks_status_pending') || 'On review',
      in_progress: t('tasks_status_in_progress') || 'In progress',
      rejected: t('tasks_status_rejected_short') || 'Rejected',
      cancelled: t('mt_status_cancelled') || 'Cancelled',
      link_dead: t('mt_status_link_dead') || 'Link dead',
      abandoned: t('mt_status_abandoned'),
    })[s] || s;
  }

  // ---------------------------------------------------------------- сводка --
  function renderSummary() {
    if (!summary) { $('mtSummary').innerHTML = ''; return; }
    const s = summary;
    const scope = s.scopes[tab] || { count: 0, earned: 0 };
    const other = (s.earned_total || 0)
      - (s.scopes.manual.earned || 0) - (s.scopes.premium.earned || 0) - (s.scopes.app.earned || 0);

    $('mtSummary').innerHTML = `
      <div class="mt-balance-card">
        <div>
          <div class="mt-balance-label">${t('mt_balance') || 'Balance'}</div>
          <div class="mt-balance-value">${fmtPrice(s.balance)}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="Router.navigate('/wallet')">${t('mt_withdraw') || 'Withdraw'}</button>
      </div>
      <div class="mt-cards">
        <div class="mt-card">
          <div class="mt-card-val">${fmtPrice(s.earned_total)}</div>
          <div class="mt-card-lbl">${t('mt_earned_all') || 'Earned, all time'}</div>
        </div>
        <div class="mt-card">
          <div class="mt-card-val">${fmtPrice(s.periods.month.earned)}</div>
          <div class="mt-card-lbl">${t('mt_earned_month') || 'Last 30 days'}</div>
        </div>
        <div class="mt-card">
          <div class="mt-card-val">${fmtPrice(s.periods.today.earned)}</div>
          <div class="mt-card-lbl">${t('mt_earned_today') || 'Today'}</div>
        </div>
        <div class="mt-card">
          <div class="mt-card-val">${(s.paid_tasks_total != null ? s.paid_tasks_total : (s.statuses.approved || 0)).toLocaleString()}</div>
          <div class="mt-card-lbl">${t('mt_paid') || 'Paid tasks'}</div>
        </div>
      </div>
      <div class="mt-platforms" id="mtPlatforms"></div>
      <div class="mt-split">
        ${[
          ['#ea580c', s.scopes.manual.earned, t('mt_tab_manual') || 'Manual'],
          ['#3b82f6', s.scopes.app.earned, t('mt_tab_app') || 'Android'],
          ['#a855f7', s.scopes.premium.earned, t('mt_tab_premium') || 'Premium'],
          ['#10b981', other > 0.0001 ? other : 0, t('mt_other_earnings') || 'Bonuses'],
        ].filter(([, v]) => v > 0.0001).map(([c, v, label]) => `
          <div class="mt-seg">
            <span class="mt-seg-dot" style="background:${c}"></span>
            <span class="mt-seg-val">${fmtPrice(v)}</span>
            <span class="mt-seg-lbl">${label}</span>
          </div>`).join('')}
      </div>`;
  }

  function renderPlatforms() {
    const box = document.getElementById('mtPlatforms');
    if (!box) return;
    const list = (summary && summary.platforms) || [];
    if (!list.length) { box.innerHTML = ''; return; }
    const max = Math.max(...list.map((p) => p.earned)) || 1;
    box.innerHTML = `
      <div class="mt-plat-head">${t('mt_by_network') || 'By network, all time'}</div>
      <div class="mt-plat-grid">
        ${list.map((p) => {
          const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[p.platform]) || '#ea580c';
          const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[p.platform]) || '';
          const pct = Math.max(4, Math.round((p.earned / max) * 100));
          return `
            <div class="mt-plat${p.platform === platform ? ' active' : ''}" data-plat="${esc(p.platform)}">
              <div class="mt-plat-top">
                <span class="mt-plat-ico" style="color:${color}">${icon}</span>
                <span class="mt-plat-name">${esc(p.platform)}</span>
                <span class="mt-plat-cnt">${p.count.toLocaleString()}</span>
                <span class="mt-plat-sum">${fmtPrice(p.earned)}</span>
              </div>
              <div class="mt-plat-bar"><i style="width:${pct}%;background:${color}"></i></div>
            </div>`;
        }).join('')}
      </div>`;

    box.onclick = (e) => {
      const card = e.target.closest('.mt-plat');
      if (!card) return;
      // Повторный клик по той же сети снимает фильтр — так человеку не нужно
      // искать отдельную кнопку «сбросить».
      platform = card.dataset.plat === platform ? '' : card.dataset.plat;
      page = 1;
      if (tab === 'rates') { tab = 'manual'; document.querySelectorAll('#mtTabs .mt-tab').forEach(x => x.classList.toggle('active', x.dataset.tab === 'manual')); }
      renderPlatforms();
      loadList();
    };
  }

  // ------------------------------------------------------------ список дел --
  function taskRow(x) {
    const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[x.platform]) || '';
    const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[x.platform]) || '#ea580c';
    // В базе имя лежит и с собачкой, и без неё — приводим к одному виду,
    // иначе на экране получается '@@name'.
    const uname = (x.target_username || '').replace(/^@+/, '');
    const target = uname ? '@' + uname : (x.target_url || '');
    return `
      <tr class="mt-row" data-order="${x.order_id}" title="${t('mt_open_task') || 'Open task'}">
        <td class="mt-td-task">
          <span class="mt-ico" style="color:${color}">${icon}</span>
          <span class="mt-task-text">
            <b>${esc(x.label || x.action)}</b>
            <i>${esc(target).slice(0, 60)}</i>
          </span>
        </td>
        <td class="mt-td-status">
          <span class="mt-dot" style="background:${STATUS_COLOR[x.status] || '#94a3b8'}"></span>${statusLabel(x.status)}
        </td>
        <td class="mt-td-date">${ago(x.started_at)}</td>
        <td class="mt-td-money">${x.paid == null ? '<span class="mt-unpaid">—</span>' : '+' + fmtPrice(x.paid)}</td>
      </tr>`;
  }

  // Строка работы приложения: тот же вид, что у ручных заданий — что сделано,
  // сколько, когда и сколько заплатили. Построчного журнала действий у
  // приложения нет и не будет (миллионы дешёвых действий стоили бы гигабайты),
  // поэтому одна строка — это вид работы за день, а не отдельное действие.
  function dayRow(x) {
    const icon = (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS.telegram) || '';
    const color = (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS.telegram) || '#2AABEE';
    const dot = APP_ACT_COLOR[x.action] || '#94a3b8';
    return `
      <tr>
        <td class="mt-td-task">
          <span class="mt-ico" style="color:${color}">${icon}</span>
          <span class="mt-task-text">
            <b>${esc(actName(x.action))}</b>
            <i>${esc(x.day)} · ${x.count.toLocaleString()} ${t('mt_actions') || 'actions'}</i>
          </span>
        </td>
        <td class="mt-td-status">
          <span class="mt-dot" style="background:${dot}"></span>${t('mt_status_paid') || 'Paid'}
        </td>
        <td class="mt-td-date">${ago(x.day)}</td>
        <td class="mt-td-money">+${fmtApp(x.earned)}</td>
      </tr>`;
  }

  function pager(p, hasMore) {
    return `
      <div class="mt-pager">
        <button class="btn btn-sm" id="mtPrev" ${p <= 1 ? 'disabled' : ''}>${t('mt_prev') || 'Back'}</button>
        <span class="mt-page-num">${t('mt_page') || 'Page'} ${p}</span>
        <button class="btn btn-sm" id="mtNext" ${hasMore ? '' : 'disabled'}>${t('mt_next') || 'Next'}</button>
      </div>`;
  }

  async function loadList() {
    const body = $('mtBody');
    body.innerHTML = `<div class="mt-loading">${t('stats_loading') || 'Loading…'}</div>`;
    try {
      const q = new URLSearchParams({ scope: tab, page: String(page) });
      if (status && tab !== 'app') q.set('status', status);
      if (platform && tab !== 'app') q.set('platform', platform);
      const d = await API.request('GET', '/tasks/my/list?' + q);
      const isApp = d.kind === 'daily';

      if (!d.items.length) {
        body.innerHTML = `
          ${tab === 'app' ? '' : renderStatusChips()}
          <div class="card"><div class="card-body"><div class="empty-state">
            <h3>${t('my_tasks_empty')}</h3>
            <p>${tab === 'app' ? (t('mt_app_empty') || 'Nothing from the app yet.') : t('my_tasks_empty_hint')}</p>
          </div></div></div>`;
        return;
      }

      body.innerHTML = `
        ${isApp ? '' : renderStatusChips()}
        ${platform && !isApp ? `<div class="mt-filter-on">${t('mt_filtered_by') || 'Filtered by'}: <b>${esc(platform)}</b><button class="mt-filter-off" id="mtClearPlat">&times;</button></div>` : ''}
        ${isApp ? `<div class="mt-note">${d.last_report
            ? (t('mt_app_synced') || 'Updates after every batch from your phone · last update {time}')
                .replace('{time}', esc(when(d.last_report)))
            : (t('mt_app_synced_none') || 'Updates after every batch from your phone.')}</div>` : ''}
        <div class="mt-table-wrap">
          <table class="mt-table">
            <thead><tr>
              <th>${t('mt_col_task') || 'Task'}</th>
              <th>${t('mt_col_status') || 'Status'}</th>
              <th>${t('mt_col_when') || 'When'}</th>
              <th class="mt-th-money">${t('mt_col_paid') || 'Paid'}</th>
            </tr></thead>
            <tbody>${d.items.map(isApp ? dayRow : taskRow).join('')}</tbody>
          </table>
        </div>
        ${pager(d.page, d.has_more)}`;

      // Клик по строке открывает карточку задания — ту же, что на странице
      // заданий. Когда её закроют, список и суммы обновляются сами: человек
      // мог отменить задание или отправить его на проверку.
      body.querySelectorAll('.mt-row').forEach((tr) => {
        tr.onclick = (ev) => {
          const id = tr.dataset.order;
          if (!id || typeof openTask !== 'function') return;
          openTask(id);
          const started = Date.now();
          const watch = setInterval(() => {
            const open = document.querySelector('.modal-overlay, .modal, #taskModal');
            if (!open && Date.now() - started > 800) {
              clearInterval(watch);
              API.request('GET', '/tasks/my/summary')
                .then((s) => { summary = s; renderSummary(); renderPlatforms(); })
                .catch(() => {});
              loadList();
            }
            if (Date.now() - started > 600000) clearInterval(watch);
          }, 700);
        };
      });

      const prev = $('mtPrev'); const next = $('mtNext');
      if (prev) prev.onclick = () => { if (page > 1) { page--; loadList(); scrollTop(); } };
      if (next) next.onclick = () => { page++; loadList(); scrollTop(); };
      bindStatusChips();
      const clr = document.getElementById('mtClearPlat');
      if (clr) clr.onclick = () => { platform = ''; page = 1; renderPlatforms(); loadList(); };
    } catch (e) {
      body.innerHTML = `<div class="card"><div class="card-body">${esc(e.message)}</div></div>`;
    }
  }

  function scrollTop() {
    const el = document.querySelector('.main-content');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStatusChips() {
    const byScope = summary && summary.statuses_by_scope;
    const n = (byScope && byScope[tab === 'premium' ? 'premium' : 'manual'])
      || (summary ? summary.statuses : {});
    return `<div class="mt-chips" id="mtChips">${STATUSES.map(s => {
      const c = s.id ? (n[s.id] || 0) : '';
      return `<button class="mt-chip${s.id === status ? ' active' : ''}" data-st="${s.id}">${s.label()}${c ? ` <i>${c}</i>` : ''}</button>`;
    }).join('')}</div>`;
  }

  function bindStatusChips() {
    const box = $('mtChips');
    if (!box) return;
    box.onclick = (e) => {
      const b = e.target.closest('.mt-chip');
      if (!b) return;
      status = b.dataset.st;
      page = 1;
      loadList();
    };
  }

  // ----------------------------------------------------------------- цены ---
  async function loadRates() {
    const body = $('mtBody');
    body.innerHTML = `<div class="mt-loading">${t('stats_loading') || 'Loading…'}</div>`;
    try {
      const d = await API.request('GET', '/tasks/my/rates');
      const table = (rows, title) => !rows.length ? '' : `
        <div class="mt-note">${title}</div>
        <div class="mt-table-wrap">
          <table class="mt-table">
            <thead><tr>
              <th>${t('mt_col_service') || 'Service'}</th>
              <th>${t('mt_col_platform') || 'Platform'}</th>
              <th class="mt-th-money">${t('mt_col_reward') || 'You get'}</th>
            </tr></thead>
            <tbody>${rows.map(r => `
              <tr>
                <td class="mt-td-task"><b>${esc(r.label)}</b></td>
                <td class="mt-td-status">${esc(r.platform)}</td>
                <td class="mt-td-money">${fmtPrice(r.reward)}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>`;

      const app = d.app || {};
      const appRow = (name, r) => (!r || !r.per_1000) ? '' : `
        <tr>
          <td class="mt-td-task"><b>${name}</b></td>
          <td class="mt-td-status">${fmtPrice(r.per_1000)} / 1000</td>
          <td class="mt-td-money">${fmtApp(r.per_action || 0)}</td>
        </tr>`;

      body.innerHTML = `
        ${table(d.manual, t('mt_rates_manual') || 'Manual tasks — reward per completed task')}
        ${table(d.premium, t('mt_rates_premium') || 'Premium tasks')}
        <div class="mt-note">${t('mt_rates_app') || 'PR Worker Telegram — reward per 1000 actions'}</div>
        <div class="mt-table-wrap">
          <table class="mt-table">
            <thead><tr>
              <th>${t('mt_col_action') || 'Action'}</th>
              <th>${t('mt_col_per1k') || 'Per 1000'}</th>
              <th class="mt-th-money">${t('mt_col_per_one') || 'Per action'}</th>
            </tr></thead>
            <tbody>
              ${appRow(actName('view'), app.view)}
              ${appRow(actName('react'), app.react)}
              ${appRow(actName('comment_emoji'), app.comment)}
              ${appRow(actName('join'), app.join)}
            </tbody>
          </table>
        </div>`;
    } catch (e) {
      body.innerHTML = `<div class="card"><div class="card-body">${esc(e.message)}</div></div>`;
    }
  }

  // ---------------------------------------------------------------- запуск --
  $('mtTabs').onclick = (e) => {
    const b = e.target.closest('.mt-tab');
    if (!b || b.dataset.tab === tab) return;
    tab = b.dataset.tab;
    page = 1;
    status = '';
    platform = '';
    document.querySelectorAll('#mtTabs .mt-tab').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
    renderSummary();
    renderPlatforms();
    if (tab === 'rates') loadRates(); else loadList();
  };

  try {
    summary = await API.request('GET', '/tasks/my/summary');
    renderSummary();
    renderPlatforms();
  } catch (e) { /* сводка не критична для списка */ }
  loadList();
});
