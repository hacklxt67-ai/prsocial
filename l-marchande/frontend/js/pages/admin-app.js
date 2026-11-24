// Admin page: mobile app fleet (/admin-app). Six tabs — Overview, Devices,
// Accounts, Analytics, Health, Control.
//
// Kept in its own file rather than bolted onto the 987KB admin.js: this section
// will keep growing as the app ships, and the old contour died partly because
// everything lived in one place nobody dared to touch.
//
// Every number here is either a Redis counter or a jobs-computed snapshot; the
// only SQL behind these screens is the paginated device/account list.

Router.register('admin-app', async (app) => {
  let tab = new URL(window.location.href).searchParams.get('tab') || 'overview';
  let refreshTimer = null;

  const esc = (s) => (typeof escHtml === 'function' ? escHtml(String(s == null ? '' : s)) : String(s == null ? '' : s));
  const num = (n) => (Number(n) || 0).toLocaleString('ru-RU');
  // Время сервера в том же виде, в каком его пишет БД (UTC, YYYY-MM-DD HH:MM:SS):
  // сравнивать строки надёжнее, чем гонять даты через часовые пояса.
  const nowUtc = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
  // Деньги приложения измеряются долями цента: просмотр — стотысячные доллара.
  // Фиксированные три знака показывали бы «$0.000» там, где заработок есть,
  // поэтому знаки подбираются под величину.
  const usd = (v) => {
    const x = Number(v) || 0;
    if (x <= 0) return '$0';
    const digits = x >= 1 ? 2 : (x >= 0.01 ? 3 : (x >= 0.0001 ? 5 : 7));
    return '$' + x.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
  };
  // Тысячные доли unit → доллары. 1 unit = $0.0001, 1 milli = $0.0000001.
  const usdMilli = (m) => usd((Number(m) || 0) / 10000000);
  const ago = (iso) => {
    if (!iso) return '—';
    const s = Math.max(0, Math.floor((Date.now() - new Date(iso.replace(' ', 'T') + (iso.includes('Z') ? '' : 'Z')).getTime()) / 1000));
    if (s < 60) return s + 'с назад';
    if (s < 3600) return Math.floor(s / 60) + ' мин назад';
    if (s < 86400) return Math.floor(s / 3600) + ' ч назад';
    return Math.floor(s / 86400) + ' дн назад';
  };
  const api = (path, opts) => API.request(opts?.method || 'GET', '/admin/app' + path, opts?.body);

  // Своё подтверждение: showConfirm из Verify Center — локальная функция той
  // страницы и снаружи недоступна. Страница должна быть самодостаточной.
  function confirmBox({ title, body, confirmLabel = 'Подтвердить', danger = false }) {
    return new Promise(resolve => {
      const m = document.createElement('div');
      m.className = 'af-modal';
      m.innerHTML = '<div class="af-modal-inner">'
        + '<div class="af-modal-title">' + esc(title) + '</div>'
        + '<div class="af-modal-body">' + (body || '') + '</div>'
        + '<div class="af-modal-actions">'
        + '<button class="af-btn" data-no>Отмена</button>'
        + '<button class="af-btn ' + (danger ? 'danger' : 'primary') + '" data-yes>' + esc(confirmLabel) + '</button>'
        + '</div></div>';
      document.body.appendChild(m);
      const done = (v) => { m.remove(); resolve(v); };
      m.querySelector('[data-no]').onclick = () => done(false);
      m.querySelector('[data-yes]').onclick = () => done(true);
      m.onclick = (e) => { if (e.target === m) done(false); };
    });
  }

  if (typeof _adminGuard === 'function' && !_adminGuard()) return;
  if (typeof _loadAdminPendingCounts === 'function') { try { await _loadAdminPendingCounts(); } catch (e) {} }

  app.innerHTML = '<div class="app-layout">'
    + renderAdminSidebar('admin-app', typeof _adminPendingCounts !== 'undefined' ? _adminPendingCounts : {})
    + `<main class="main-content">
        <div class="page-header">${renderHamburger()}<div class="page-header-text">
          <h1>App Fleet</h1><p>Управление приложением, устройствами и телеметрией</p>
        </div></div>
        <div class="page-content">
          <div class="adm-tabs" id="appTabs">
            ${[['overview', 'Обзор'], ['devices', 'Устройства'], ['accounts', 'Аккаунты'],
               ['problems', 'Проблемы'], ['events', 'История'], ['analytics', 'Аналитика'], ['health', 'Здоровье'], ['logs', 'Журналы'], ['release', 'Версии и сообщения'], ['control', 'Управление']]
              .map(([k, label]) => `<button class="adm-tab ${tab === k ? 'active' : ''}" data-tab="${k}">${label}</button>`).join('')}
          </div>
          <div id="appBody"><div class="adm-empty"><p>Загрузка…</p></div></div>
        </div>
      </main></div>`;

  document.getElementById('appTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.adm-tab');
    if (!b) return;
    document.querySelectorAll('#appTabs .adm-tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    tab = b.dataset.tab;
    history.replaceState(null, '', '/admin-app?tab=' + tab);
    render();
  });

  // ---------------------------------------------------------------- helpers
  function kpi(label, value, hint, color) {
    return `<div class="af-kpi">
      <div class="af-kpi-label">${label}</div>
      <div class="af-kpi-value" ${color ? `style="color:${color}"` : ''}>${value}</div>
      ${hint ? `<div class="af-kpi-hint">${hint}</div>` : ''}
    </div>`;
  }

  function bars(points, height) {
    if (!points || !points.length) return '<div class="af-nodata">нет данных</div>';
    const max = Math.max(1, ...points.map(p => p.v));
    return `<div class="af-bars" style="height:${height || 60}px">${points.map(p =>
      `<div class="af-bar" style="height:${Math.max(2, Math.round((p.v / max) * 100))}%" title="${p.t}: ${p.v}"></div>`).join('')}</div>`;
  }

  // ---------------------------------------------------------------- OVERVIEW
  async function renderOverview(el) {
    const d = await api('/overview');
    const live = d.live || {};
    const t = d.totals || {};
    const rpm = live.rpm || {};
    const totalRpm = (rpm.ping_work || 0) + (rpm.ping_idle || 0) + (rpm.batch || 0) + (rpm.report || 0);
    const mirrorStale = d.policy_mirror && d.policy_mirror.age_sec != null && d.policy_mirror.age_sec > 90;

    el.innerHTML = `
      ${d.paused ? `<div class="af-master off">
        <div>
          <div class="af-master-title">Контур на <b>ПАУЗЕ</b></div>
          <div class="af-master-sub">Новые задания не выдаются, отчёты о выполненном принимаются. Устройства ждут и не нагружают сервер. Снять — во вкладке «Управление».</div>
        </div>
      </div>` : ''}
      <div class="af-master ${d.enabled ? 'on' : 'off'}">
        <div>
          <div class="af-master-title">Контур приложения: <b>${d.enabled ? 'ВКЛЮЧЁН' : 'ВЫКЛЮЧЕН'}</b></div>
          <div class="af-master-sub">
            ${d.enabled
              ? 'Устройства могут получать задания. Аварийное выключение — мгновенное.'
              : 'Приложение не обслуживается: все запросы устройств получают отказ.'}
            ${mirrorStale ? ' <span style="color:#dc2626">⚠ зеркало настроек не обновлялось ' + d.policy_mirror.age_sec + 'с — проверь процесс jobs</span>' : ''}
          </div>
        </div>
        <button class="af-btn ${d.enabled ? 'danger' : 'primary'}" id="afMaster">${d.enabled ? 'Выключить' : 'Включить'}</button>
      </div>

      <div class="af-kpis">
        ${kpi('Онлайн сейчас', num(live.online_5m), 'за 5 минут', live.online_5m ? '#16a34a' : null)}
        ${kpi('Активны за час', num(live.online_60m), 'уникальных устройств')}
        ${kpi('Аккаунтов на связи', num(t.accounts_online_5m), `за час ${num(t.accounts_online_60m)}`, t.accounts_online_5m ? '#16a34a' : null)}
        ${kpi('Запросов в минуту', num(totalRpm), `ожидают ${num(rpm.ping_idle)} · работают ${num(rpm.batch)}`)}
        ${kpi('Отказов за спешку', num(rpm.flood), 'нарушили темп', rpm.flood ? '#f59e0b' : null)}
        ${kpi('Задач выдано', num(live.tasks_issued_5m), 'за 5 минут')}
        ${kpi('Задач выполнено', num(live.tasks_done_5m), 'за 5 минут', '#16a34a')}
        ${kpi('Заработано', usd(live.earned_60m), `за час · на баланс ушло ${usd(live.paid_60m)}`)}
        ${kpi('Заказов в очереди', num((d.queue || {}).available_orders), (d.queue || {}).dry_since ? 'работы нет' : 'есть работа')}
      </div>

      <div class="af-grid2">
        <div class="af-card">
          <h3>Парк устройств</h3>
          <table class="af-table">
            <tr><td>Всего зарегистрировано</td><td class="af-num">${num(t.devices_total)}</td></tr>
            <tr><td>Активны (не заблокированы)</td><td class="af-num">${num(t.devices_active)}</td></tr>
            <tr><td>Заходили за сутки</td><td class="af-num">${num(t.devices_day)}</td></tr>
            <tr><td>Заблокировано</td><td class="af-num" style="color:#dc2626">${num(t.devices_blocked)}</td></tr>
            <tr><td>Помечены как эмулятор</td><td class="af-num" style="color:#f59e0b">${num(t.devices_emulator)}</td></tr>
            <tr><td>Telegram-аккаунтов</td><td class="af-num">${num(t.accounts_active)}</td></tr>
            <tr><td>Владельцев</td><td class="af-num">${num(t.users_total)}</td></tr>
          </table>
        </div>
        <div class="af-card">
          <h3>Оформление аккаунтов</h3>
          <table class="af-table">
            <tr><td>Хорошо оформлены</td><td class="af-num" style="color:#16a34a">${num((t.quality || {}).good)}</td></tr>
            <tr><td>Есть замечания</td><td class="af-num" style="color:#f59e0b">${num((t.quality || {}).weak)}</td></tr>
            <tr><td>Пустые профили</td><td class="af-num" style="color:#dc2626">${num((t.quality || {}).bad)}</td></tr>
            <tr><td>Без фото</td><td class="af-num">${num((t.quality || {}).no_photo)}</td></tr>
            <tr><td>Без описания</td><td class="af-num">${num((t.quality || {}).no_bio)}</td></tr>
            <tr><td>Слабое имя</td><td class="af-num">${num((t.quality || {}).weak_username)}</td></tr>
            <tr><td>Смен аккаунтов за неделю</td><td class="af-num">${num(t.changes_7d)}</td></tr>
          </table>
          <div class="af-hint">Оценка справочная: запреты включаются во вкладке «Управление». Частые смены — повод посмотреть вкладку «История».</div>
        </div>
        <div class="af-card">
          <h3>Выработка</h3>
          <table class="af-table">
            <tr><td>Задач сегодня</td><td class="af-num">${num(t.tasks_today)}</td></tr>
            <tr><td>Начислено сегодня</td><td class="af-num">${usdMilli(t.milli_today)}</td></tr>
            <tr><td>Задач за неделю</td><td class="af-num">${num(t.tasks_week)}</td></tr>
            <tr><td>Начислено за неделю</td><td class="af-num">${usdMilli(t.milli_week)}</td></tr>
            <tr><td>Средняя выработка на устройство</td><td class="af-num">${t.devices_day ? (t.tasks_today / t.devices_day).toFixed(1) : '0'}</td></tr>
          </table>
          <div class="af-hint">Данные снапшота: ${d.snapshot_at ? ago(d.snapshot_at) : '—'}</div>
        </div>
      </div>

      <div class="af-card">
        <h3>Активность по часам (сутки)</h3>
        ${bars((d.hourly || []).map(h => ({ t: h.h + ':00', v: h.tasks })), 90)}
      </div>`;

    document.getElementById('afMaster').addEventListener('click', async () => {
      const turnOn = !d.enabled;
      const ok = await confirmBox({
        title: turnOn ? 'Включить контур приложения?' : 'Выключить контур приложения?',
        body: turnOn
          ? 'Устройства начнут получать задания. Убедись, что пул заказов настроен и версия приложения актуальна.'
          : 'Все устройства мгновенно перестанут получать задания и будут получать отказ. Незавершённые пачки вернутся в общий котёл автоматически.',
        confirmLabel: turnOn ? 'Включить' : 'Выключить',
        danger: !turnOn,
      });
      if (!ok) return;
      await api('/settings', { method: 'POST', body: { key: 'app_api_enabled', value: turnOn ? 1 : 0 } });
      showToast(turnOn ? 'Контур включён' : 'Контур выключен', turnOn ? 'success' : 'warning');
      render();
    });
  }

  // ----------------------------------------------------------------- DEVICES
  let devFilter = 'all';
  let devPage = 1;
  let devQuery = '';
  async function renderDevices(el) {
    const d = await api(`/devices?filter=${devFilter}&page=${devPage}&limit=50${devQuery ? '&q=' + encodeURIComponent(devQuery) : ''}`);
    const rows = (d.devices || []).map(x => {
      // Признак приходит с сервера из телеметрии: телефон может опрашивать
      // сервер и при этом не иметь свежей работы, а по last_seen_at он
      // выглядел «пропавшим» — из-за этого живое устройство считали мёртвым.
      const online = x.online === true;
      return `<tr>
        <td><span class="af-dot ${online ? 'on' : ''}"></span>#${x.id}</td>
        <td><b>${esc(x.username || '—')}</b> <button class="af-btn sm" data-dev="${x.id}" data-user="${x.user_id}" data-name="${esc(x.username || '')}" data-act="msguser" title="Сообщение человеку: на все его работающие телефоны">Написать человеку</button>
          <div class="af-sub">${esc(x.model || '')} ${esc(x.manufacturer ? '· ' + x.manufacturer : '')}</div></td>
        <td>v${esc(x.app_version || '?')}<div class="af-sub">Android ${esc(x.os_version || '?')}</div></td>
        <td class="af-num">${x.accounts_active || 0}</td>
        <td class="af-num">${num(x.tasks_today)}</td>
        <td class="af-num">${num(x.tasks_total)}</td>
        <td>${ago(x.last_seen_at)}<div class="af-sub">${esc(x.last_ip || '')}</div>
            ${x.diag ? `<div class="af-sub" title="сводка с телефона">служба ок · готово ${x.diag.ready}/${x.diag.acc}${x.diag.paused ? ` · под ограничением ${x.diag.paused}` : ''}${x.diag.errors ? ` · ошибок ${x.diag.errors}` : ''}${x.diag.idle_sec != null ? ` · без заданий ${Math.round(x.diag.idle_sec / 60)} мин` : ''}</div>` : ''}</td>
        <td>${x.status === 'blocked'
              ? `<span class="af-badge red">блок</span><div class="af-sub">${esc(x.block_reason || '')}</div>`
              : x.status === 'off' ? `<span class="af-badge">отключён</span><div class="af-sub">${esc(x.off_why === 'app' ? 'в приложении' : x.off_why === 'person' ? 'владельцем на сайте' : (x.off_why || ''))}</div>`
              : '<span class="af-badge green">активно</span>'}
            <div class="af-sub">${x.code ? 'подключён кодом' : 'ключ 1.7'}</div>
            ${x.is_emulator === 1 ? '<span class="af-badge amber">эмулятор</span>' : ''}</td>
        <td class="af-actions">
          <button class="af-btn sm" data-dev="${x.id}" data-act="card">Карточка</button>
          <button class="af-btn sm" data-dev="${x.id}" data-act="log" title="Попросить телефон прислать журнал работы">Журнал</button>
          <button class="af-btn sm" data-dev="${x.id}" data-act="msg" title="Сообщение на этот телефон">Написать</button>
          ${x.status === 'active' && x.code ? `<button class="af-btn sm" data-dev="${x.id}" data-act="off" title="Телефон покажет новый код, аккаунты Telegram останутся на нём">Отключить</button>` : ''}
          ${x.status === 'blocked'
            ? `<button class="af-btn sm" data-dev="${x.id}" data-act="unblock">Разблокировать</button>`
            : `<button class="af-btn sm danger" data-dev="${x.id}" data-act="block">Заблокировать</button>`}
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `
      <div class="af-toolbar">
        ${[['all', 'Все'], ['online', 'Онлайн'], ['active', 'Активные'], ['off', 'Отключённые'], ['blocked', 'Заблокированные'], ['emulator', 'Эмуляторы']]
          .map(([k, l]) => `<button class="af-chip ${devFilter === k ? 'active' : ''}" data-f="${k}">${l}</button>`).join('')}
        <input id="afSearch" class="af-input" placeholder="Юзер, модель или ID устройства" value="${esc(devQuery)}">
        <button class="af-btn sm" id="afSearchBtn">Найти</button>
        <span class="af-spacer"></span>
        <button class="af-btn sm danger" id="afBulkEmu">Заблокировать все эмуляторы</button>
      </div>
      ${d.total === 0 ? '<div class="adm-empty"><p>Устройств пока нет.</p></div>' : `
      <div class="af-card nopad">
        <table class="af-table wide">
          <thead><tr><th>ID</th><th>Владелец / модель</th><th>Версия</th><th>Акк.</th><th>Сегодня</th><th>Всего</th><th>Работал</th><th>Статус</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="af-pager">Всего: ${num(d.total)} · страница ${d.page}
        ${d.page > 1 ? '<button class="af-btn sm" id="afPrev">← назад</button>' : ''}
        ${d.total > d.page * d.limit ? '<button class="af-btn sm" id="afNext">вперёд →</button>' : ''}
      </div>`}
      <div id="afDevCard"></div>`;

    el.querySelectorAll('.af-chip').forEach(c => c.addEventListener('click', () => { devFilter = c.dataset.f; devPage = 1; render(); }));
    const doSearch = () => { devQuery = document.getElementById('afSearch').value.trim(); devPage = 1; render(); };
    document.getElementById('afSearchBtn')?.addEventListener('click', doSearch);
    document.getElementById('afSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    document.getElementById('afPrev')?.addEventListener('click', () => { devPage--; render(); });
    document.getElementById('afNext')?.addEventListener('click', () => { devPage++; render(); });
    document.getElementById('afBulkEmu')?.addEventListener('click', async () => {
      const ok = await confirmBox({ title: 'Заблокировать все устройства-эмуляторы?',
        body: 'Каждое устройство с признаками эмулятора будет заблокировано и перестанет получать задания. Разблокировать можно поштучно.',
        confirmLabel: 'Заблокировать', danger: true });
      if (!ok) return;
      const r = await api('/devices/bulk', { method: 'POST', body: { scope: 'emulators', reason: 'эмулятор (массовая блокировка)' } });
      showToast(`Заблокировано: ${r.changed}`, r.changed ? 'success' : 'warning');
      render();
    });

    el.querySelectorAll('[data-dev]').forEach(b => b.addEventListener('click', async () => {
      const id = b.dataset.dev;
      const act = b.dataset.act;
      if (act === 'card') return showDeviceCard(id);
      if (act === 'msg') return writeMessage({ deviceId: Number(id), who: 'Только этот телефон.' });
      if (act === 'msguser') return writeMessage({ userId: Number(b.dataset.user), who: (b.dataset.name || 'Человек #' + b.dataset.user) + ': все его работающие телефоны.' });
      if (act === 'log') {
        // Журнал не приходит мгновенно: телефон увидит просьбу на ближайшем
        // опросе. Говорим об этом прямо, иначе админ решит, что кнопка не
        // сработала, и нажмёт ещё десять раз.
        await api(`/device/${id}/action`, { method: 'POST', body: { action: 'request_log' } });
        showToast('Журнал запрошен — придёт на ближайшем опросе телефона', 'success');
        return;
      }
      if (act === 'off') {
        const yes = await confirmBox({ title: 'Отключить телефон?', body: 'Телефон перестанет получать задания и покажет новый код. Аккаунты Telegram останутся на нём — после нового подключения продолжат работу.', confirmLabel: 'Отключить', danger: true });
        if (!yes) return;
        await api(`/device/${id}/action`, { method: 'POST', body: { action: 'off', reason: 'admin' } });
        showToast('Телефон отключён — покажет новый код', 'success');
        return render();
      }
      let reason = null;
      if (act === 'block') {
        reason = prompt('Причина блокировки (увидит только админ):', 'нарушение правил');
        if (reason === null) return;
      }
      await api(`/device/${id}/action`, { method: 'POST', body: { action: act, reason } });
      showToast(act === 'block' ? 'Устройство заблокировано' : 'Устройство разблокировано', 'success');
      render();
    }));
  }

  async function showDeviceCard(id) {
    const [d, ms] = await Promise.all([api('/device/' + id), api('/messages?device_id=' + id + '&limit=10')]);
    const wrap = document.getElementById('afDevCard');
    if (!d.ok) return;
    wrap.innerHTML = `<div class="af-card" style="margin-top:14px">
      <h3>Устройство #${d.device.id} · ${esc(d.device.username || '—')}</h3>
      <div class="af-toolbar">
        <button class="af-btn sm" id="afCardMsg">Написать на этот телефон</button>
        <button class="af-btn sm" id="afCardMsgUser">Написать человеку (все телефоны)</button>
        <button class="af-btn sm" id="afCardLog">Запросить журнал</button>
      </div>
      <div class="af-sub" style="margin:6px 0">Сообщения этому телефону</div>
      <div id="afCardMsgs">${msgTable(ms.items || [], false)}</div>
      <div class="af-grid2">
        <table class="af-table">
          <tr><td>Модель</td><td>${esc(d.device.manufacturer || '')} ${esc(d.device.model || '')}</td></tr>
          <tr><td>Версия приложения</td><td>v${esc(d.device.app_version || '?')}</td></tr>
          <tr><td>Android</td><td>${esc(d.device.os_version || '?')}</td></tr>
          <tr><td>Первый запуск</td><td>${ago(d.device.first_seen_at)}</td></tr>
          <tr><td>Последняя работа</td><td>${ago(d.device.last_seen_at)}</td></tr>
          <tr><td>IP</td><td>${esc(d.device.last_ip || '—')}</td></tr>
          <tr><td>Эмулятор</td><td>${d.device.is_emulator === 1 ? '<span class="af-badge amber">да</span>' : 'нет'}</td></tr>
          <tr><td>Заработано</td><td><b>${usdMilli(d.earned_milli)}</b></td></tr>
        </table>
        <div>
          <div class="af-sub" style="margin-bottom:6px">Telegram-аккаунты (${d.accounts.length})</div>
          <table class="af-table">
            ${d.accounts.map(a => `<tr><td>@${esc(a.username || a.identity)}</td>
              <td class="af-num">${num(a.tasks_today)} сегодня</td>
              <td>${a.status === 'active' ? '<span class="af-badge green">активен</span>' : `<span class="af-badge red">${esc(a.status)}</span>`}</td></tr>`).join('') || '<tr><td>нет</td></tr>'}
          </table>
        </div>
      </div>
      <div class="af-grid2" style="margin-top:12px">
        <div>
          <div class="af-sub" style="margin-bottom:6px">По дням (${(d.daily || []).length})</div>
          <table class="af-table wide">
            <thead><tr><th>День</th><th>Задач</th><th>Начислено</th></tr></thead>
            <tbody>${(d.daily || []).map(r => `<tr><td>${esc(r.day)}</td>
              <td class="af-num">${num(r.tasks)}</td><td class="af-num">${usdMilli(r.earned_milli)}</td></tr>`).join('')
              || '<tr><td colspan="3">ещё не работало</td></tr>'}</tbody>
          </table>
        </div>
        <div>
          <div class="af-sub" style="margin-bottom:6px">Действия за месяц</div>
          <table class="af-table wide">
            <thead><tr><th>Действие</th><th>Сделано</th><th>Начислено</th></tr></thead>
            <tbody>${(d.actions || []).map(r => `<tr><td>${esc(r.action)}</td>
              <td class="af-num">${num(r.tasks)}</td><td class="af-num">${usdMilli(r.earned_milli)}</td></tr>`).join('')
              || '<tr><td colspan="3">нет данных</td></tr>'}</tbody>
          </table>
          <div class="af-hint">Построчный журнал действий не ведётся: при массовых задачах он стоил бы гигабайты в неделю. Деньги видны в транзакциях пользователя, объёмы — здесь.</div>
        </div>
      </div>
    </div>`;
    document.getElementById('afCardMsg').onclick = () => writeMessage({ deviceId: d.device.id, who: 'Только этот телефон.' });
    document.getElementById('afCardMsgUser').onclick = () => writeMessage({ userId: d.device.user_id, who: (d.device.username || 'Человек #' + d.device.user_id) + ': все его работающие телефоны.' });
    document.getElementById('afCardLog').onclick = async () => {
      await api(`/device/${d.device.id}/action`, { method: 'POST', body: { action: 'request_log' } });
      showToast('Журнал запрошен: придёт при ближайшем обращении телефона, он появится во вкладке «Журналы»', 'success');
    };
    bindMsgRemove(wrap, () => showDeviceCard(id));
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ---------------------------------------------------------------- ACCOUNTS
  let accQuery = '';
  let accPage = 1;
  async function renderAccounts(el) {
    const d = await api(`/accounts?page=${accPage}&limit=50${accQuery ? '&q=' + encodeURIComponent(accQuery) : ''}`);
    el.innerHTML = `
      <div class="af-toolbar">
        <input id="afAccSearch" class="af-input" placeholder="@username или Telegram ID" value="${esc(accQuery)}">
        <button class="af-btn sm" id="afAccBtn">Найти</button>
      </div>
      ${d.total === 0 ? '<div class="adm-empty"><p>Аккаунтов пока нет.</p></div>' : `
      <div class="af-card nopad">
        <table class="af-table wide">
          <thead><tr><th>Аккаунт</th><th>Владелец</th><th>Устройство</th><th>Слот</th><th>Оформление</th><th>Сегодня</th><th>Всего</th><th>Последняя задача</th><th>Статус</th><th></th></tr></thead>
          <tbody>${(d.accounts || []).map(a => `<tr>
            <td><b>@${esc(a.username || '—')}</b><div class="af-sub">${esc(a.identity)}</div></td>
            <td>${esc(a.owner || '—')}</td>
            <td>#${a.device_id}<div class="af-sub">${esc(a.model || '')}</div></td>
            <td class="af-num">${a.slot || '—'}</td>
            <td>${qualityBadge(a)}</td>
            <td class="af-num">${num(a.tasks_today)}</td>
            <td class="af-num">${num(a.tasks_total)}</td>
            <td>${ago(a.last_task_at)}</td>
            <td>${a.status === 'active' ? '<span class="af-badge green">активен</span>' : `<span class="af-badge red">${esc(a.status)}</span>`}
                ${a.rest_until && a.rest_until > nowUtc() ? `<div class="af-sub" title="${esc(a.problem || '')}"><span class="af-badge amber">ограничение</span> до ${esc(String(a.rest_until).slice(11, 16))}</div>` : ''}</td>
            <td class="af-actions"><button class="af-btn sm ${a.status === 'active' ? 'danger' : ''}" data-acc="${a.id}" data-act="${a.status === 'active' ? 'block' : 'unblock'}">${a.status === 'active' ? 'Заблокировать' : 'Разблокировать'}</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="af-pager">Всего: ${num(d.total)} · страница ${d.page}
        ${d.page > 1 ? '<button class="af-btn sm" id="afAccPrev">← назад</button>' : ''}
        ${d.total > d.page * d.limit ? '<button class="af-btn sm" id="afAccNext">вперёд →</button>' : ''}
      </div>`}`;
    const doSearch = () => { accQuery = document.getElementById('afAccSearch').value.trim(); accPage = 1; render(); };
    document.getElementById('afAccBtn')?.addEventListener('click', doSearch);
    document.getElementById('afAccSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    document.getElementById('afAccPrev')?.addEventListener('click', () => { accPage--; render(); });
    document.getElementById('afAccNext')?.addEventListener('click', () => { accPage++; render(); });
    el.querySelectorAll('[data-acc]').forEach(b => b.addEventListener('click', async () => {
      await api(`/account/${b.dataset.acc}/action`, { method: 'POST', body: { action: b.dataset.act } });
      showToast('Готово', 'success');
      render();
    }));
  }

  // Оформление аккаунта одним взглядом: цвет — общая оценка, значки —
  // что именно отсутствует. Наводить мышь не нужно, но подсказка есть.
  function qualityBadge(a) {
    const q = a.quality || null;
    const marks = [
      ['фото', a.photo_ok === 1],
      ['описание', a.bio_ok === 1],
      ['имя', a.username_ok === 1],
    ];
    const missing = marks.filter(m => !m[1]).map(m => m[0]);
    const cls = q === 'good' ? 'green' : (q === 'bad' ? 'red' : (q === 'weak' ? 'amber' : ''));
    const label = q === 'good' ? 'хорошо' : (q === 'bad' ? 'пусто' : (q === 'weak' ? 'слабо' : '—'));
    const hint = missing.length ? `нет: ${missing.join(', ')}` : (a.bio ? esc(String(a.bio).slice(0, 40)) : '');
    return `<span class="af-badge ${cls}">${label}</span>${hint ? `<div class="af-sub">${hint}</div>` : ''}`;
  }

  // ---------------------------------------------------------------- PROBLEMS
  // Один экран отвечает на вопрос «почему не выполняется»: мёртвые ссылки и
  // аккаунты, которых Telegram попросил отдохнуть.
  async function renderProblems(el) {
    const d = await api('/problems');
    const orders = d.orders || [];
    const accounts = d.accounts || [];
    const PROB = {
      limited: ['ограничен Telegram', 'red'],
      flood: ['просили сбавить темп', 'amber'],
      channels_full: ['лимит каналов', 'amber'],
      session_dead: ['сессия слетела', 'red'],
      daily_limit: ['дневная норма выбрана', 'amber'],
      quality: ['оформление аккаунта', 'amber'],
    };
    // Почему заказ снят с выдачи. Наведение на ячейку показывает подробности:
    // какую реакцию просили и какие на посте доступны.
    const PROBLEM_REASONS = {
      target_dead: '<span class="af-badge red">пост удалён</span>',
      bad_link: '<span class="af-badge red">ссылка не подходит</span>',
      reaction_unavailable: '<span class="af-badge amber">канал не принимает эту реакцию</span>',
      reactions_disabled: '<span class="af-badge amber">реакции на посте отключены</span>',
    };

    // Что телефоны услышали от Telegram. Причина «никто не смог» сама по себе
    // ничего не объясняет: закрытые реакции, удалённый пост и запрет по региону
    // выглядят в списке одинаково, и без этой строки остаётся только гадать.
    const FAIL_CODES = {
      REACTION_NOT_AVAILABLE: 'канал не принимает ни одну из заказанных',
      REACTIONS_DISABLED: 'реакции у поста выключены',
      POST_NOT_FOUND: 'пост не найден',
      CHANNEL_NOT_FOUND: 'канала не существует',
      CHANNEL_PRIVATE: 'канал закрытый',
      USER_BANNED_IN_CHANNEL: 'аккаунты забанены в канале',
    };
    const failNote = (codes) => {
      const list = String(codes || '').split(',').map(c => c.trim()).filter(Boolean);
      if (!list.length) return '';
      const said = list.map(c => FAIL_CODES[c] || c).join(' · ');
      return `<div class="af-sub">Telegram: ${esc(said)}</div>`;
    };

    // Набор смайлов, который купил заказчик. Сверять его с тем, что канал
    // реально разрешил, приходится глазами — поэтому он и нужен на экране.
    const wantedEmoji = (raw) => {
      let list = [];
      try { list = JSON.parse(raw || '[]'); } catch (e) { list = []; }
      if (!Array.isArray(list) || !list.length) return '<span class="af-sub">—</span>';
      return `<span style="font-size:15px;letter-spacing:2px">${esc(list.join(''))}</span>`;
    };
    el.innerHTML = `
      <div class="af-card nopad">
        <div style="padding:14px 16px 0"><h3 style="margin:0">Заказы с нерабочими ссылками</h3></div>
        ${orders.length === 0 ? '<div class="adm-empty"><p>Жалоб нет.</p></div>' : `
        <table class="af-table wide">
          <thead><tr><th>Заказ</th><th>Ссылка</th><th>Действие</th><th>Просит</th><th>Причина</th><th>Жалоб</th><th>Выполнено</th><th>Замечено</th><th>Статус</th><th></th></tr></thead>
          <tbody>${orders.map(o => `<tr>
            <td>#${o.order_id}</td>
            <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis">${esc(o.target_url || '—')}</td>
            <td>${esc(o.action || '—')}</td>
            <td style="max-width:150px">${wantedEmoji(o.comment_list)}</td>
            <td title="${esc(o.note || '')}">${PROBLEM_REASONS[o.reason] || esc(o.reason || '—')}${failNote(o.fail_codes)}</td>
            <td class="af-num">${num(o.votes)}</td>
            <td class="af-num">${num(o.completed_count)} / ${num(o.total_count)}</td>
            <td>${ago(o.last_seen_at)}</td>
            <td>${o.status === 'blocked' ? '<span class="af-badge red">снят с выдачи</span>' : '<span class="af-badge green">возвращён</span>'}</td>
            <td class="af-actions">${o.status === 'blocked' ? `<button class="af-btn sm" data-resolve="${o.order_id}">Вернуть в выдачу</button>` : ''}</td>
          </tr>`).join('')}</tbody>
        </table>`}
        <div class="af-hint" style="padding:0 16px 14px">Заказ снимается с выдачи, когда на него пожаловались несколько устройств подряд — значит, дело в ссылке, а не в одном аккаунте. Пока он снят, задания по нему не выдаются никому.</div>
      </div>

      <div class="af-card nopad" style="margin-top:14px">
        <div style="padding:14px 16px 0"><h3 style="margin:0">Аккаунты на отдыхе</h3></div>
        ${accounts.length === 0 ? '<div class="adm-empty"><p>Все аккаунты в работе.</p></div>' : `
        <table class="af-table wide">
          <thead><tr><th>Аккаунт</th><th>Владелец</th><th>Устройство</th><th>Причина</th><th>Отдыхает до</th><th></th></tr></thead>
          <tbody>${accounts.map(a => {
            const [label, cls] = PROB[a.problem] || [a.problem || '—', ''];
            return `<tr>
              <td><b>@${esc(a.username || '—')}</b><div class="af-sub">${esc(a.identity)}${a.country ? ' · ' + esc(a.country) : ''}</div></td>
              <td>${esc(a.owner || '—')}</td>
              <td>${esc(a.model || '—')}</td>
              <td><span class="af-badge ${cls}">${label}</span><div class="af-sub">${ago(a.problem_at)}</div></td>
              <td>${a.rest_until ? esc(String(a.rest_until).slice(0, 16)) : '—'}</td>
              <td class="af-actions"><button class="af-btn sm" data-wake="${a.id}">Вернуть в работу</button></td>
            </tr>`;
          }).join('')}</tbody>
        </table>`}
        <div class="af-hint" style="padding:0 16px 14px">Отдых назначается автоматически, когда Telegram ограничивает аккаунт или просит сбавить темп. Возвращать досрочно стоит только если причина понятна — иначе ограничение станет жёстче.</div>
      </div>`;

    el.querySelectorAll('[data-resolve]').forEach(b => b.addEventListener('click', async () => {
      const ok = await confirmBox({ title: `Вернуть заказ #${b.dataset.resolve} в выдачу?`,
        body: 'Устройства снова начнут получать по нему задания. Если ссылка так и не работает, заказ снимется опять.', confirmLabel: 'Вернуть' });
      if (!ok) return;
      await api('/problem/resolve', { method: 'POST', body: { order_id: Number(b.dataset.resolve) } });
      showToast('Готово', 'success'); render();
    }));
    el.querySelectorAll('[data-wake]').forEach(b => b.addEventListener('click', async () => {
      const ok = await confirmBox({ title: 'Вернуть аккаунт в работу?',
        body: 'Отдых снимется, и аккаунт сразу начнёт получать задания. Если Telegram ограничил его всерьёз, ограничение может стать жёстче.', confirmLabel: 'Вернуть', danger: true });
      if (!ok) return;
      await api(`/account/${b.dataset.wake}/wake`, { method: 'POST', body: {} });
      showToast('Готово', 'success'); render();
    }));
  }

  // ------------------------------------------------------------------ EVENTS
  // История состава аккаунтов. Здесь видно и человека, который один раз
  // поменял слетевший аккаунт, и ферму, которая крутит их по кругу.
  let evPage = 1;
  let evFilter = '';

  async function renderEvents(el) {
    const d = await api(`/events?page=${evPage}&limit=50${evFilter ? '&event=' + evFilter : ''}`);
    const EV = {
      added: ['добавлен', 'green'],
      replaced: ['замена', 'amber'],
      removed: ['выход', 'red'],
    };
    el.innerHTML = `
      <div class="af-toolbar">
        ${[['', 'Все'], ['added', 'Добавления'], ['replaced', 'Замены'], ['removed', 'Выходы']]
          .map(([v, label]) => `<button class="af-btn sm ${evFilter === v ? 'primary' : ''}" data-ev="${v}">${label}</button>`).join('')}
      </div>
      ${d.total === 0 ? '<div class="adm-empty"><p>Пока ничего не менялось.</p></div>' : `
      <div class="af-card nopad">
        <table class="af-table wide">
          <thead><tr><th>Когда</th><th>Что</th><th>Аккаунт</th><th>Слот</th><th>Владелец</th><th>Устройство</th><th>Заметка</th></tr></thead>
          <tbody>${(d.events || []).map(e => {
            const [label, cls] = EV[e.event] || [e.event, ''];
            return `<tr>
              <td>${ago(e.created_at)}<div class="af-sub">${esc(String(e.created_at || '').slice(0, 16))}</div></td>
              <td><span class="af-badge ${cls}">${label}</span></td>
              <td><b>@${esc(e.username || '—')}</b><div class="af-sub">${esc(e.identity)}${e.prev_identity ? ` ← ${esc(e.prev_identity)}` : ''}</div></td>
              <td class="af-num">${e.slot || '—'}</td>
              <td>${esc(e.owner || '—')}</td>
              <td>#${e.device_id}<div class="af-sub">${esc(e.model || '')}</div></td>
              <td class="af-sub">${esc(e.note || '')}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <div class="af-pager">Всего: ${num(d.total)} · страница ${d.page}
        ${d.page > 1 ? '<button class="af-btn sm" id="afEvPrev">← назад</button>' : ''}
        ${d.total > d.page * d.limit ? '<button class="af-btn sm" id="afEvNext">вперёд →</button>' : ''}
      </div>`}
      <div class="af-hint">Слот можно менять не чаще, чем раз в заданное число дней (раздел «Управление»). Возврат того же аккаунта сменой не считается и в историю не попадает.</div>`;
    el.querySelectorAll('[data-ev]').forEach(b => b.addEventListener('click', () => {
      evFilter = b.dataset.ev; evPage = 1; render();
    }));
    document.getElementById('afEvPrev')?.addEventListener('click', () => { evPage--; render(); });
    document.getElementById('afEvNext')?.addEventListener('click', () => { evPage++; render(); });
  }

  // --------------------------------------------------------------- ANALYTICS
  async function renderAnalytics(el) {
    const d = await api('/analytics');
    const f = d.funnel || {};
    const r = d.retention || {};
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    el.innerHTML = `
      <div class="af-grid2">
        <div class="af-card">
          <h3>Воронка</h3>
          <table class="af-table">
            <tr><td>Зарегистрировали устройство</td><td class="af-num">${num(f.registered)}</td><td class="af-num">100%</td></tr>
            <tr><td>Привязали Telegram-аккаунт</td><td class="af-num">${num(f.with_account)}</td><td class="af-num">${pct(f.with_account, f.registered)}%</td></tr>
            <tr><td>Выполнили хотя бы одну задачу</td><td class="af-num">${num(f.worked)}</td><td class="af-num">${pct(f.worked, f.registered)}%</td></tr>
            <tr><td>Работали сегодня</td><td class="af-num">${num(f.worked_today)}</td><td class="af-num">${pct(f.worked_today, f.registered)}%</td></tr>
          </table>
          <div class="af-hint">Где отваливаются — там и надо чинить приложение.</div>
        </div>
        <div class="af-card">
          <h3>Удержание</h3>
          <table class="af-table">
            <tr><td>Пришли вчера</td><td class="af-num">${num(r.cohort_d1)}</td></tr>
            <tr><td>из них работают сегодня</td><td class="af-num">${num(r.back_d1)} <span class="af-sub">(${pct(r.back_d1, r.cohort_d1)}%)</span></td></tr>
            <tr><td>Пришли неделю назад</td><td class="af-num">${num(r.cohort_d7)}</td></tr>
            <tr><td>из них ещё работают</td><td class="af-num">${num(r.back_d7)} <span class="af-sub">(${pct(r.back_d7, r.cohort_d7)}%)</span></td></tr>
          </table>
        </div>
      </div>

      <div class="af-card">
        <h3>Динамика за 14 дней</h3>
        ${bars((d.daily || []).map(x => ({ t: x.d, v: x.tasks })), 90)}
        <table class="af-table wide" style="margin-top:10px">
          <thead><tr><th>Дата</th><th>Задач</th><th>Устройств</th><th>Начислено</th></tr></thead>
          <tbody>${(d.daily || []).slice(-7).reverse().map(x => `<tr><td>${esc(x.d)}</td><td class="af-num">${num(x.tasks)}</td>
            <td class="af-num">${num(x.devices)}</td><td class="af-num">${usdMilli(x.milli)}</td></tr>`).join('') || '<tr><td>нет данных</td></tr>'}</tbody>
        </table>
      </div>

      <div class="af-grid2">
        <div class="af-card">
          <h3>Версии приложения</h3>
          <table class="af-table">
            ${(d.by_version || []).map(v => `<tr><td>v${esc(v.version)}</td><td class="af-num">${num(v.devices)}</td>
              <td class="af-sub">активны ${num(v.active_day)}</td></tr>`).join('') || '<tr><td>нет данных</td></tr>'}
          </table>
          <div class="af-hint">Старые версии отсекаются во вкладке «Управление».</div>
        </div>
        <div class="af-card">
          <h3>Топ устройств за неделю</h3>
          <table class="af-table">
            ${(d.top_devices || []).slice(0, 10).map(x => `<tr><td>#${x.device_id} ${esc(x.username || '')}</td>
              <td class="af-num">${num(x.tasks)}</td><td class="af-num">${usdMilli(x.milli)}</td></tr>`).join('') || '<tr><td>нет данных</td></tr>'}
          </table>
        </div>
      </div>

      <div class="af-card">
        <h3>Модели устройств</h3>
        <table class="af-table wide">
          <thead><tr><th>Производитель</th><th>Модель</th><th>Устройств</th></tr></thead>
          <tbody>${(d.by_model || []).map(m => `<tr><td>${esc(m.manufacturer)}</td><td>${esc(m.model)}</td><td class="af-num">${num(m.devices)}</td></tr>`).join('') || '<tr><td colspan="3">нет данных</td></tr>'}</tbody>
        </table>
      </div>
      <div class="af-hint">Снапшот: ${d.snapshot_at ? ago(d.snapshot_at) : '—'}</div>`;
  }

  // ------------------------------------------------------------------ HEALTH
  async function renderHealth(el) {
    const [ov, sIdle, sWork, sFlood, sBatch, sDone] = await Promise.all([
      api('/overview'),
      api('/series?type=ping_idle&minutes=60'),
      api('/series?type=ping_work&minutes=60'),
      api('/series?type=flood&minutes=60'),
      api('/series?type=batch&minutes=60'),
      api('/series?type=tasks_done&minutes=60'),
    ]);
    const rpm = (ov.live || {}).rpm || {};
    const totalPing = (rpm.ping_idle || 0) + (rpm.ping_work || 0);
    const floodShare = totalPing ? Math.round((rpm.flood / (totalPing + rpm.flood)) * 100) : 0;
    const q = ov.queue || {};
    const dn = ov.denials_60m || {};
    const boardAge = q.updated_at ? Math.round((Date.now() - q.updated_at) / 1000) : null;

    el.innerHTML = `
      <div class="af-kpis">
        ${kpi('Опросов в минуту', num(totalPing), 'из них с работой ' + num(rpm.ping_work))}
        ${kpi('Доля отказов за спешку', floodShare + '%', 'норма < 5%', floodShare > 5 ? '#dc2626' : '#16a34a')}
        ${kpi('Выдач пачек', num(rpm.batch), 'в минуту')}
        ${kpi('Отчётов', num(rpm.report), 'в минуту')}
        ${kpi('Витрина заказов', boardAge == null ? '—' : boardAge + 'с', 'возраст данных', boardAge > 60 ? '#dc2626' : null)}
        ${kpi('Зеркало настроек', (ov.policy_mirror || {}).age_sec == null ? '—' : ov.policy_mirror.age_sec + 'с', 'возраст', (ov.policy_mirror || {}).age_sec > 90 ? '#dc2626' : null)}
      </div>

      <div class="af-card">
        <h3>Опросы «работы нет» (час)</h3>
        ${bars(sIdle.points, 70)}
        <div class="af-hint">Это основной фон от парка. Растёт линейно с числом устройств — если график взлетел без роста парка, значит кто-то не соблюдает темп.</div>
      </div>
      <div class="af-grid2">
        <div class="af-card"><h3>Опросы «есть работа»</h3>${bars(sWork.points, 60)}</div>
        <div class="af-card"><h3>Отказы за спешку</h3>${bars(sFlood.points, 60)}
          <div class="af-hint">Всплеск = приложение игнорирует поле «приходи через N секунд», либо кто-то пишет свой клиент.</div></div>
      </div>
      <div class="af-grid2">
        <div class="af-card"><h3>Выдачи пачек</h3>${bars(sBatch.points, 60)}</div>
        <div class="af-card"><h3>Выполнено задач</h3>${bars(sDone.points, 60)}</div>
      </div>

      <div class="af-card">
        <h3>Почему устройства уходят без заданий (за час)</h3>
        <table class="af-table">
          <thead><tr><th>Причина</th><th class="af-num">Отказов</th><th>Что это значит</th></tr></thead>
          <tbody>
            ${[
              ['Нет подходящих заказов', dn.no_work, 'Аккаунт уже сделал всё, что было, либо пул пуст.'],
              ['Дневная норма выбрана', dn.daily_limit, 'Аккаунт упёрся в суточный лимит — до завтра. Видно на вкладке «Проблемы».'],
              ['Ровный темп', dn.pace, 'Норма ещё есть, но час уже отработан: лимит делится на сутки, чтобы не бить залпом.'],
              ['Отдых по Telegram', dn.resting, 'Аккаунт под ограничением или получил «сбавьте темп» — пауза назначена автоматически.'],
              ['Пауза владельца', dn.paused, 'Человек сам остановил аккаунт в приложении.'],
              ['Оформление аккаунта', dn.quality, 'Требования к профилю включены, а аккаунт им не отвечает.'],
              ['Брак ссылки в заказе', dn.bad_link, 'Ссылка не подходит под действие (инвайт, бот, канал вместо поста) — заказ снят с выдачи.'],
            ].map(([name, v, hint]) => `<tr>
              <td><b>${name}</b></td>
              <td class="af-num">${num(v || 0)}</td>
              <td class="af-sub">${hint}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="af-hint">Отказ — это не поломка: устройство спросило работу и получило честный ответ «сейчас нельзя, приходи через N секунд». Тревожно, только если растёт «Отдых по Telegram» — значит лимиты выставлены слишком щедро.</div>
      </div>

      <div class="af-card">
        <h3>Что смотреть при проблемах</h3>
        <ul class="af-list">
          <li><b>Опросы растут, выдачи нет</b> — заказов в пуле нет: проверь, что услуги в prm4u направлены в пул приложения.</li>
          <li><b>Много отказов за спешку</b> — клиент не соблюдает темп; отсеки старую версию во вкладке «Управление».</li>
          <li><b>Витрина старше минуты</b> — процесс jobs не обновляет данные, устройства перестанут видеть работу.</li>
          <li><b>Зеркало настроек не обновляется</b> — рубильник будет срабатывать с задержкой; тот же процесс jobs.</li>
        </ul>
      </div>`;
  }

  // ----------------------------------------------------------------- CONTROL
  const LABELS = {
    app_api_enabled: ['Контур приложения', 'Главный рубильник. Выключение мгновенно останавливает выдачу заданий всем устройствам.'],
    app_tools_download_enabled: ['Скачивание в Tools', 'Кнопка «Скачать APK» на странице Tools. ВЫКЛ — юзеры видят «скоро», ссылка на сборку наружу не отдаётся.'],
    app_profile_keygen_enabled: ['Ключи приложения в профиле', 'Разрешить всем пользователям выпускать ключ приложения на странице профиля. Пока выключено — при нажатии юзер видит «недоступно».'],
    app_profile_keygen_allow_ids: ['Тех-аккаунты (ID через запятую)', 'Кому разрешён выпуск ключей при выключенном тумблере. Админы могут всегда. По умолчанию 13550.'],
    app_min_version: ['Минимальная версия', 'Ниже этой сборки работа не выдаётся: телефон получает требование обновиться. 0 — обязательной считается последняя выложенная сборка.'],
    app_force_update: ['Обновление обязательно', 'Пока телефон не встал на выложенную версию, задания ему не выдаются. Отчёт о уже сделанном принимается всегда.'],
    app_emulator_mode: ['Эмуляторы', 'off — пускать всех · monitor — пускать и помечать · block — не пускать. Начинать всегда с monitor.'],
    app_max_devices_per_user: ['Устройств на юзера', 'Сколько телефонов может привязать один пользователь.'],
    app_max_accounts_per_device: ['Аккаунтов на устройство', 'Сколько Telegram-аккаунтов помещается в одно приложение.'],
    app_max_parallel_accounts: ['Аккаунтов одновременно', 'Сколько аккаунтов телефон обрабатывает параллельно. 1 — по очереди, как раньше: пятый аккаунт весь день ждёт первого и суточные лимиты не выбираются. Больше — человек зарабатывает кратно числу аккаунтов, но и запросов от телефона приходит во столько же раз больше. Начинать стоит с 2.'],
    app_batch_size: ['Размер пачки', 'Сколько заданий выдаётся за один запрос. Больше пачка — реже обращения к серверу.'],
    app_task_interval_sec: ['Пауза между заданиями', 'Секунд между действиями внутри пачки. Это темп работы на телефоне.'],
    app_poll_work_sec: ['Опрос: есть работа', 'Через сколько секунд возвращаться, когда работа есть.'],
    app_poll_idle_sec: ['Опрос: работы нет', 'Через сколько возвращаться при пустой очереди.'],
    app_poll_long_idle_sec: ['Опрос: долго нет работы', 'Интервал после часа простоя — экономит запросы на тихом дне.'],
    app_daily_limit_per_account: ['Лимит на аккаунт в сутки', 'Потолок ВСЕХ действий приложения для одного Telegram-аккаунта, поверх лимитов по типам. 0 — потолка нет, работают только лимиты по действиям. К ручному пулу сайта отношения не имеет.'],
    app_batch_ttl_sec: ['Наибольший срок пачки', 'Пачка берёт столько заданий, сколько телефон успеет сделать за этот срок в своём темпе. Места в заказах держатся по времени её работы плюс запас на отчёт, не дольше.'],
    app_report_grace_sec: ['Запас на отчёт', 'Сколько секунд после последнего задания пачки телефон ещё может отчитаться и получить оплату. По умолчанию 300.'],
  };

  // Подписи настроек второго слоя. Ключи, которых нет в LABELS, выводятся
  // как есть — поэтому забытая настройка не ломает страницу, а просто
  // выглядит скучно.
  Object.assign(LABELS, {
    app_daily_limit_view: ['Просмотров в сутки', 'На один аккаунт. Из этого числа выводится темп: 5000 в сутки — это одно действие раз в 17 секунд. 0 — отдельного лимита нет.'],
    app_daily_limit_bot_start: ['Стартов бота в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 берут предел из «Виды заданий» в карточке PR Worker 2.0. По умолчанию 30.'],
    app_daily_limit_comment_text: ['Комментариев из списка в сутки (старый запрос)', 'Только для старого запроса /batch (вид comment). Телефоны 2.0 — «Виды заданий». По умолчанию 10.'],
    app_daily_limit_comment_custom: ['Своих комментариев в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 — «Виды заданий». По умолчанию 10.'],
    app_daily_limit_share: ['Пересылок в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 — «Виды заданий». По умолчанию 30.'],
    app_daily_limit_story_view: ['Просмотров историй в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 — «Виды заданий». По умолчанию 300.'],
    app_daily_limit_vote: ['Голосов в опросах в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 — «Виды заданий». По умолчанию 20.'],
    app_daily_limit_join_vote: ['Вступлений с голосом в сутки (старый запрос)', 'Только для старого запроса /batch. Телефоны 2.0 — «Виды заданий». По умолчанию 20.'],
    app_daily_limit_react: ['Реакций в сутки', 'На один аккаунт. Реакции заметнее просмотров, поэтому лимит обычно ниже.'],
    app_daily_limit_join: ['Подписок в сутки', 'На один аккаунт. Самое рискованное действие для Telegram — держите небольшим.'],
    app_daily_limit_comment: ['Эмодзи-комментариев в сутки', 'На один аккаунт. Комментарий заметнее реакции — лимит держите ниже, чем у реакций.'],
    app_rest_after_limit_hours: ['Отдых после ограничения', 'На сколько часов аккаунт уходит на отдых, если Telegram его ограничил.'],
    app_react_any_allowed: ['Любая разрешённая реакция', 'Если заказанной реакции нет в наборе канала, телефон ставит любую разрешённую: заказ выполняется, но заказчик получает не тот смайл, что купил. Выключено — такой заказ решают отказы (как у софта: 5 разных аккаунтов — снятие и расчёт с панелью).'],
    app_notice_text: ['Объявление для устройств', 'Короткий текст, который увидит человек в приложении. Показывается один раз. Пусто — объявления нет.'],
    app_premium_only_actions: ['Только для Premium', 'Действия, доступные лишь аккаунтам с Telegram Premium. Пусто — ограничения нет.'],
    app_paused: ['Пауза', 'Работу не выдаём, отчёты о сделанном принимаем. Устройства показывают «сервис на паузе» и не долбят сервер.'],
    app_pause_poll_sec: ['Возврат на паузе', 'Как часто устройство проверяет, снята ли пауза.'],
    app_account_change_days: ['Окно смены аккаунтов', 'За столько дней на телефоны человека приходит не больше разных аккаунтов, чем у него мест (мест на телефоне × телефонов): первые, замены, новые после удалённых. Тот же аккаунт, вернувшийся в окне, второй раз не считается. 0 — без ограничения.'],
    app_quality_block: ['Не принимать плохие аккаунты', 'Отказывать при добавлении, если нет ни имени, ни фото, ни описания.'],
    app_require_photo: ['Требовать фото', 'Без аватара аккаунт не добавить.'],
    app_require_bio: ['Требовать описание', 'Без текста в «о себе» аккаунт не добавить.'],
    app_username_min_len: ['Минимум букв в имени', 'Короткие имена помечаются как слабые.'],
    app_username_max_digit_run: ['Цифр подряд в имени', 'Больше — имя выглядит сгенерированным.'],
  });

  // PR Worker 2.0 (30.10.2026): телефоны новой сборки, один запрос sync. На телефоны 1.7 эти настройки не действуют.
  const AF2_GROUPS = [
    ['Аккаунты и сутки', ['app2_parallel', 'app2_day_total', 'app2_hour_pct']],
    ['Темп', ['app2_pace_view', 'app2_pace_react', 'app2_pace_join', 'app2_pace_comment', 'app2_pace_other', 'app2_gap_sec', 'app2_device_order_gap_min']],
    ['Очередь и места', ['app2_horizon_sec', 'app2_step_sec', 'app2_slow_ahead_sec']],
    ['Ограничения', ['app2_full_hours']],
    ['Нагрузка на сервер', ['app2_target_rps', 'app2_sync_min', 'app2_sync_max', 'app2_sync_rest_max', 'app2_sync_idle', 'app2_market_ttl', 'app2_flush_sec', 'app2_flush_batch', 'app2_credit_min', 'app2_cand_sec']],
  ];
  // Виды заданий телефонов 2.0 (имена сайта, как в договоре с приложением): галочка — вид открыт телефонам (app_kinds_enabled),
  // рядом — сколько раз в сутки его может сделать один аккаунт (app2_day_<вид>, по умолчанию — как у софта).
  const AF2_KINDS = [
    ['view', 'Просмотры постов'], ['story_view', 'Просмотры историй'], ['react', 'Реакции'],
    ['join', 'Подписки', 'вместе с вступлениями по приглашениям; каналов у аккаунта Telegram — до 500 (Premium 1000), телефоны из них не выходят'],
    ['join_vote', 'Подписка + голос', 'если приложение умеет'], ['bot_start', 'Запуски ботов'], ['share', 'Пересылки в Избранное'],
    ['comment_emoji', 'Эмодзи-комментарии'], ['comment', 'Комментарии из списка заказа'], ['comment_custom', 'Свои комментарии заказчика'],
    ['vote', 'Голоса в опросах'], ['ads_view', 'Реклама в канале'], ['bot_ads_view', 'Реклама в боте'], ['search_ads_view', 'Реклама в поиске'],
  ];
  const AF2_KINDS_DEFAULT = 'view,react,join,comment_emoji';
  Object.assign(LABELS, {
    app2_parallel: ['Аккаунтов одновременно', 'Сколько аккаунтов телефона работают одновременно. Слабый телефон урежет сам (до 3 ГБ памяти — 1). Плюс один аккаунт, следующий в очереди, получает работу заранее.'],
    app2_day_total: ['Всех действий на аккаунт в сутки', 'Все виды вместе, считаются и неудачные попытки — как у софта (по умолчанию 200). 0 — без общего потолка. Пределы каждого вида — в «Виды заданий» выше. Общий лимит 1.7 («Лимиты») на телефоны 2.0 не действует.'],
    app2_pace_view: ['Темп просмотров, с', 'От начала одного задания до начала следующего, случайно в пределах «от-до».'],
    app2_pace_react: ['Темп реакций, с', ''],
    app2_pace_join: ['Темп вступлений, с', 'Вступление ждёт своего срока, а между ними идут просмотры и реакции.'],
    app2_pace_comment: ['Темп комментариев, с', 'Эмодзи-комментарии и комментарии из списка.'],
    app2_pace_other: ['Темп прочих видов, с', 'Виды 2.0 без своего темпа. Вид с темпом от 60 с выдаётся по одному, к сроку.'],
    app2_gap_sec: ['Разнос действий аккаунта, с', 'Не меньше этого между любыми двумя действиями одного аккаунта.'],
    app2_device_order_gap_min: ['Один заказ телефону, мин', 'Одна цель аккаунтам одного телефона — не чаще раза в столько минут: не идти к цели залпом с одного адреса.'],
    app2_horizon_sec: ['Очередь вперёд, с', 'На сколько секунд работы телефон получает быстрые задания заранее. Места в заказах держатся примерно столько же.'],
    app2_step_sec: ['Время шага, с', 'Сколько может длиться одно задание: место держится до срока задания + это время + запас на отчёт.'],
    app2_slow_ahead_sec: ['Медленное задание заранее, с', 'Вступление или комментарий выдаётся, когда до его срока осталось не больше стольких секунд.'],
    app2_full_hours: ['Каналы заполнены: проба через, ч', 'Telegram ответил, что каналов слишком много: вступления этому аккаунту не выдаются до пробы.'],
    app2_hour_pct: ['Доля суток в час, %', 'Сколько процентов суточного предела вида можно выдать за один час. 0 — без часовой доли.'],
    app2_sync_min: ['Обращение к серверу не чаще, с', 'Нижняя граница next_sync, пока аккаунты работают.'],
    app2_sync_max: ['Обращение к серверу не реже, с', 'Верхняя граница next_sync, пока аккаунты работают.'],
    app2_sync_rest_max: ['Все отдыхают: вернуться через ≤, с', ''],
    app2_sync_idle: ['Работы нет: вернуться через, с', ''],
    app2_market_ttl: ['Цены на экране «Задания»: обновлять раз в, с', 'Только пока человек смотрит экран; цены считаются на сервере каждые 20 с'],
    app2_target_rps: ['Целевых sync в секунду на весь парк', 'Чем больше телефонов, тем реже каждый приходит и тем длиннее его очередь. 0 — без подстройки.'],
    app2_flush_sec: ['Запись в базу, с', 'Как часто jobs пишет сделанное в базу одной транзакцией на пачку.'],
    app2_flush_batch: ['Запись в базу: пачка', 'Записей в одной транзакции; столько накопилось — запись сразу.'],
    app2_credit_min: ['Начисление на баланс, мин', 'Как часто заработанное уходит на баланс: одна строка в журнале денег на человека. В приложении «сегодня» видно сразу.'],
    app2_cand_sec: ['Обновление списка заказов, с', 'Как часто jobs перечитывает открытые заказы пула для выдачи телефонам.'],
  });

  // ------------------------------------------------------------------ LOGS
  /*
   * Журналы, присланные телефонами.
   *
   * До этого журнал жил только на устройстве человека, и разобрать поломку
   * можно было лишь по скриншоту, который он прислал сам. Сюда попадает две
   * вещи: падения (телефон присылает сам) и выгрузки по кнопке «Журнал» в
   * списке устройств.
   */
  let logKind = '';
  async function renderLogs(el) {
    const d = await api('/logs?limit=100' + (logKind ? '&kind=' + logKind : ''));
    const rows = (d.items || []).map(x => `<tr>
      <td>#${x.id}</td>
      <td>#${x.device_id}<div class="af-sub">${esc(x.model || '')} ${esc(x.manufacturer || '')}</div></td>
      <td>${x.kind === 'crash' ? '<span class="af-badge red">падение</span>'
            : x.kind === 'user' ? '<span class="af-badge amber">от человека</span>'
            : '<span class="af-badge">по запросу</span>'}</td>
      <td>v${esc(x.app_version || '?')}</td>
      <td class="af-num">${num(x.size)}</td>
      <td>${ago(x.created_at)}</td>
      <td class="af-actions"><button class="af-btn sm" data-log="${x.id}">Открыть</button></td>
    </tr>`).join('');

    el.innerHTML = `
      <div class="af-toolbar">
        ${[['', 'Все'], ['crash', 'Падения'], ['requested', 'По запросу'], ['user', 'От людей']]
          .map(([k, l]) => `<button class="af-chip ${logKind === k ? 'active' : ''}" data-lk="${k}">${l}</button>`).join('')}
        <span class="af-spacer"></span>
        <span class="af-sub">Всего журналов: ${num(d.total)}</span>
      </div>
      ${!d.items || !d.items.length ? '<div class="adm-empty"><p>Журналов пока нет. Запросить можно кнопкой «Журнал» в списке устройств.</p></div>' : `
      <div class="af-card nopad">
        <table class="af-table wide">
          <thead><tr><th>ID</th><th>Устройство</th><th>Повод</th><th>Версия</th><th>Символов</th><th>Когда</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`}
      <div id="afLogView"></div>`;

    el.querySelectorAll('[data-lk]').forEach(c => c.addEventListener('click', () => { logKind = c.dataset.lk; render(); }));
    el.querySelectorAll('[data-log]').forEach(b => b.addEventListener('click', async () => {
      const r = await api('/log?id=' + b.dataset.log);
      if (!r.ok) return;
      const v = document.getElementById('afLogView');
      v.innerHTML = `<div class="af-card" style="margin-top:14px">
        <h3>Журнал #${r.log.id} · устройство #${r.log.device_id} · ${esc(r.log.kind)}</h3>
        <div class="af-sub">${esc(r.log.model || '')} ${esc(r.log.manufacturer || '')} · сборка v${esc(r.log.app_version || '?')} · ${esc(r.log.created_at)}</div>
        <pre style="margin-top:10px;max-height:520px;overflow:auto;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.45">${esc(r.log.text)}</pre>
      </div>`;
      v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
  }

  async function renderControl(el) {
    const d = await api('/settings');
    const s = d.settings || {};
    const schema = d.schema || {};
    /*
     * Страховка от рассинхрона.
     *
     * Карточки ниже перечисляют настройки руками — так их можно объяснить
     * человеческим языком и сгруппировать по смыслу. Обратная сторона: новая
     * настройка на сервере легко остаётся невидимой, и владелец управляет
     * не тем, что реально работает. Поэтому считаем разницу: всё, что знает
     * сервер и не показала ни одна карточка, попадает в раздел «Прочие».
     */
    const AF_SHOWN = [
      'app_api_enabled', 'app_paused', 'app_emulator_mode', 'app_force_update', 'app_min_version',
      'app_profile_keygen_enabled', 'app_profile_keygen_allow_ids', 'app_tools_download_enabled',
      'app_max_devices_per_user', 'app_max_accounts_per_device', 'app_max_parallel_accounts',
      'app_daily_limit_per_account',
      'app_batch_size', 'app_task_interval_sec', 'app_poll_work_sec', 'app_poll_idle_sec',
      'app_poll_long_idle_sec', 'app_batch_ttl_sec', 'app_report_grace_sec',
      'app_daily_limit_view', 'app_daily_limit_react', 'app_daily_limit_join', 'app_daily_limit_comment',
      'app_rest_after_limit_hours', 'app_react_any_allowed',
      'app_pause_poll_sec', 'app_notice_text',
      'app_beta_version', 'app_beta_update_url', 'app_latest_version', 'app_update_url',
      'app_account_change_days', 'app_quality_block', 'app_require_photo', 'app_require_bio',
      'app_username_min_len', 'app_username_max_digit_run', 'app_premium_only_actions',
      'app_done_keep_days', 'app_keep_daily_days', 'app_logs_keep_days',
      ...AF2_GROUPS.flatMap((g) => g[1]),
      'app_kinds_enabled', ...AF2_KINDS.map((k) => 'app2_day_' + k[0]),
    ];
    // Виды заданий 2.0: открытые телефонам (пусто — четыре вида 1.7) и предел каждого в сутки
    const DEF = d.defaults || {};
    const kindsOn = () => String(s.app_kinds_enabled || AF2_KINDS_DEFAULT).split(',').map((x) => x.trim()).filter(Boolean);
    const kindsTable = () => {
      const on = kindsOn();
      return `<table class="af-table wide"><thead><tr><th>Вид</th><th>Открыт телефонам</th><th>В сутки на аккаунт</th></tr></thead><tbody>${AF2_KINDS.map(([k, label, hint]) => {
        const key = 'app2_day_' + k, sp = schema[key] || { min: 0, max: 100000 };
        return `<tr><td><b>${label}</b> <span class="af-sub">${k}</span>${hint ? `<div class="af-sub">${hint}</div>` : ''}</td>
          <td><label style="display:inline-flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" data-kind="${k}" ${on.includes(k) ? 'checked' : ''}>
            <span class="af-badge ${on.includes(k) ? 'green' : ''}">${on.includes(k) ? 'ВКЛ' : 'ВЫКЛ'}</span></label></td>
          <td class="af-ctl"><input class="af-input sm" type="number" min="${sp.min}" max="${sp.max}" value="${esc(s[key] == null ? '' : s[key])}" data-key="${key}" placeholder="${esc(DEF[key] == null ? '' : DEF[key])}">
            <span class="af-sub">${s[key] == null || s[key] === '' ? 'по умолчанию ' + esc(DEF[key] == null ? '—' : DEF[key]) : '0 — без предела'}</span></td></tr>`;
      }).join('')}</tbody></table>`;
    };
    const afRestKeys = Object.keys(schema).filter(k => !AF_SHOWN.includes(k));
    // Что означает текущее значение — человеческим языком. Считается на лету,
    // поэтому последствия правки видно до сохранения.
    const explain = (key, val) => {
      const n = Number(val);
      const общий = Number(s.app_daily_limit_per_account || 300);
      const base = Number(s.app_task_interval_sec || 10);
      switch (key) {
        case 'app_daily_limit_view':
        case 'app_daily_limit_react':
        case 'app_daily_limit_join':
        case 'app_daily_limit_comment': {
          if (!n) return `<span class="af-badge">ВЫКЛ</span> отдельного лимита нет — действует только общий: ${num(общий)} действий в сутки на аккаунт`;
          const pace = Math.max(base, Math.floor(86400 / n));
          const perHour = Math.ceil((n / 24) * 1.2);
          const paceText = pace >= 60 ? `${Math.round(pace / 60)} мин` : `${pace} с`;
          const over = n > общий
            ? ` <b style="color:#dc2626">выше общего лимита (${num(общий)}) — сработает общий</b>`
            : '';
          return `<span class="af-badge green">ВКЛ</span> ${num(n)} в сутки → одно действие раз в ${paceText}, до ${num(perHour)} в час${over}`;
        }
        case 'app_daily_limit_per_account':
          return n
            ? `<span class="af-badge green">ВКЛ</span> верхняя граница по всем действиям сразу: ${num(n)} в сутки на аккаунт — она главнее лимитов по типам`
            : `<span class="af-badge">ВЫКЛ</span> общего потолка нет — действуют только лимиты по типам действий`;
        case 'app_task_interval_sec':
          return `базовый интервал между заданиями; если у действия задан суточный лимит, темп берётся из него`;
        case 'app_rest_after_limit_hours':
          return `аккаунт не получает заданий ${num(n)} ч после ограничения Telegram`;
        case 'app_pause_poll_sec':
          return `на паузе устройство проверяет сайт раз в ${Math.round(n / 60)} мин`;
        case 'app_poll_idle_sec':
          return `нет работы — устройство вернётся через ${Math.round(n / 60)} мин`;
        case 'app_poll_work_sec':
          return `есть работа — устройство вернётся через ${n} с`;
        case 'app_batch_size':
          return `за один раз выдаём до ${num(n)} заданий`;
        case 'app_max_parallel_accounts':
          return n <= 1
            ? 'аккаунты работают по очереди — как было раньше'
            : `${num(n)} аккаунта работают одновременно`;
        case 'app_max_accounts_per_device':
          return `до ${num(n)} Telegram-аккаунтов на одном телефоне`;
        case 'app_max_devices_per_user':
          return `до ${num(n)} устройств на одного человека`;
        case 'app_account_change_days':
          return n ? `сменить аккаунт в слоте можно раз в ${num(n)} дн.` : `<span class="af-badge">ВЫКЛ</span> менять аккаунты можно без ограничений`;
        case 'app_min_version':
          return n ? `<b style="color:#dc2626">сборки ниже ${num(n)} не работают вовсе</b>` : `<span class="af-badge">ВЫКЛ</span> старые сборки не отсекаются`;
        case 'app_username_min_len':
          return n ? `имя короче ${n} символов помечается слабым` : `<span class="af-badge">ВЫКЛ</span> длину имени не проверяем`;
        case 'app_username_max_digit_run':
          return n ? `больше ${n} цифр подряд в имени — пометка «выглядит сгенерированным»` : `<span class="af-badge">ВЫКЛ</span> цифры в имени не проверяем`;
        default:
          return '';
      }
    };

    const row = (key) => {
      const [label, hint] = LABELS[key] || [key, ''];
      const sp = schema[key] || {};
      let input;
      if (sp.type === 'bool') {
        const on = s[key] === '1';
        input = `<button class="af-btn ${on ? 'danger' : 'primary'}" data-key="${key}" data-toggle="${on ? 0 : 1}">${on ? 'Выключить' : 'Включить'}</button>
                 <span class="af-badge ${on ? 'green' : 'red'}">${on ? 'ВКЛ' : 'ВЫКЛ'}</span>`;
      } else if (sp.type === 'enum') {
        input = `<select class="af-input" data-key="${key}">${sp.values.map(v => `<option value="${v}" ${s[key] === v ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
      } else if (sp.type === 'text') {
        input = `<input class="af-input" type="text" value="${esc(s[key])}" data-key="${key}" placeholder="Например: 15 августа с 3:00 до 5:00 возможны перебои" style="min-width:340px">`;
      } else if (sp.type === 'actions_or_empty') {
        input = `<input class="af-input" type="text" value="${esc(s[key])}" data-key="${key}" placeholder="пусто — без ограничения">`;
      } else if (sp.type === 'ids') {
        input = `<input class="af-input" type="text" value="${esc(s[key] || '')}" data-key="${key}" placeholder="пусто = 13550 (по умолчанию)" style="min-width:220px">`;
      } else if (sp.type === 'actions') {
        input = `<input class="af-input" type="text" value="${esc(s[key])}" data-key="${key}" placeholder="join">`;
      } else if (sp.type === 'url') {
        input = `<input class="af-input" type="url" inputmode="url" value="${esc(s[key] || '')}" data-key="${key}" placeholder="https://…" style="min-width:340px">`;
      } else if (sp.type === 'price1k') {
        input = `<input class="af-input sm" type="text" inputmode="decimal" value="${esc(s[key] || '')}" data-key="${key}" placeholder="пусто">`;
      } else if (sp.type === 'int') {
        input = `<input class="af-input sm" type="number" min="${sp.min}" max="${sp.max}" value="${esc(s[key])}" data-key="${key}"${DEF[key] != null ? ` placeholder="${esc(DEF[key])}"` : ''}>
                 <span class="af-sub">${sp.min}–${sp.max}</span>`;
      } else if (sp.type === 'range') {
        input = `<input class="af-input sm" type="text" inputmode="numeric" value="${esc(s[key] || '')}" data-key="${key}" placeholder="от-до">
                 <span class="af-sub">с, от-до</span>`;
      } else {
        input = `<input class="af-input" type="text" value="${esc(s[key] || '')}" data-key="${key}">`;
      }
      const live = explain(key, s[key]);
      return `<tr>
        <td><b>${label}</b><div class="af-sub">${hint}</div>
          ${live ? `<div class="af-live" id="live_${key}" style="margin-top:6px;font-size:12px;color:var(--text-muted)">${live}</div>` : ''}</td>
        <td class="af-ctl">${input}</td></tr>`;
    };

    // Сводка сверху: одним взглядом видно, в каком режиме работает контур.
    const state = [
      s.app_api_enabled === '1'
        ? '<span class="af-badge green">контур включён</span>'
        : '<span class="af-badge red">контур выключен</span>',
      s.app_paused === '1' ? '<span class="af-badge amber">пауза</span>' : '',
      Number(s.app_min_version) ? `<span class="af-badge amber">минимальная версия ${esc(s.app_min_version)}</span>` : '',
      Number(s.app_beta_version) ? `<span class="af-badge amber">тестовый канал: билд ${esc(s.app_beta_version)}</span>` : '',
      s.app_emulator_mode === 'block' ? '<span class="af-badge red">эмуляторы блокируются</span>'
        : (s.app_emulator_mode === 'monitor' ? '<span class="af-badge">эмуляторы под наблюдением</span>' : ''),
      s.app_quality_block === '1' ? '<span class="af-badge amber">плохие аккаунты не принимаются</span>' : '',
      Number(s.app_notice_id) ? '<span class="af-badge">объявление показывается</span>' : '',
    ].filter(Boolean).join(' ');

    // Release card: beta channel on the left, production on the right, the
    // release button moves the left pane into the right one. Inputs reuse the
    // same data-key change handler as the settings tables.
    const relNum = (key) => {
      const sp = schema[key] || {};
      return `<input class="af-input sm" type="number" min="${sp.min}" max="${sp.max}" value="${esc(s[key])}" data-key="${key}">`;
    };
    const relUrl = (key) => `<input class="af-input" type="url" inputmode="url" value="${esc(s[key] || '')}" data-key="${key}" placeholder="https://…">`;
    const betaV = Number(s.app_beta_version) || 0;
    const prodV = Number(s.app_latest_version) || 0;

    el.innerHTML = `<div class="af-control">
      <div class="af-card">
        <h3>Что сейчас применено</h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${state}</div>
        <div class="af-hint">Настройки применяются сразу после изменения — устройства узнают о них при ближайшем обращении (обычно в пределах минуты).</div>
      </div>
      <div class="af-card">
        <h3>Рубильники</h3>
        <table class="af-table wide">${['app_api_enabled', 'app_profile_keygen_enabled', 'app_profile_keygen_allow_ids', 'app_min_version', 'app_emulator_mode'].map(row).join('')}</table>
      </div>
      <div class="af-card">
        <h3>Лимиты</h3>
        <table class="af-table wide">${['app_max_devices_per_user', 'app_max_accounts_per_device', 'app_max_parallel_accounts', 'app_daily_limit_per_account'].map(row).join('')}</table>
      </div>
      <div class="af-card">
        <h3>Темп и нагрузка</h3>
        <table class="af-table wide">${['app_batch_size', 'app_task_interval_sec', 'app_poll_work_sec', 'app_poll_idle_sec', 'app_poll_long_idle_sec', 'app_batch_ttl_sec', 'app_report_grace_sec'].map(row).join('')}</table>
        <div class="af-hint">Эти четыре параметра определяют нагрузку на сервер. Ориентир: при 100 000 устройств и опросе раз в 300 секунд получается ~330 запросов в секунду — это 2% мощности одного ядра.</div>
      </div>
      <div class="af-card">
        <h3>PR Worker 2.0 <span class="af-sub">— телефоны новой сборки</span></h3>
        <div class="af-sub" style="margin:12px 0 4px;font-weight:600">Виды заданий</div>
        ${kindsTable()}
        <div class="af-hint">Телефон получает вид, только если он открыт здесь, его умеет приложение и его выбрал человек (виды и цену «от–до» по каждому виду человек выбирает в приложении). Новые виды открывать после проверки на своём телефоне. Пустое поле — предел по умолчанию, как у софта; считаются и неудачные попытки.</div>
        ${AF2_GROUPS.map(([title, keys]) => `<div class="af-sub" style="margin:12px 0 4px;font-weight:600">${title}</div>
        <table class="af-table wide">${keys.map(row).join('')}</table>`).join('')}
        <div class="af-hint">Телефон 2.0 говорит с сервером одним запросом: сдаёт сделанное и получает следующую работу каждому аккаунту ко времени. Флуд Telegram (FLOOD_WAIT) — отдыхает весь аккаунт столько, сколько назвал Telegram (час, если не назвал), как у софта; ограничение (PEER_FLOOD, спам) — «Отдых после ограничения» ниже. Общее с 1.7: виды заданий, только для Premium, запас на отчёт, пауза. Телефоны 1.7 этих настроек не видят.</div>
      </div>
      <div class="af-card">
        <h3>Оплата телефонов <span class="af-sub">— одна с софтом</span></h3>
        <div class="af-hint">С 28.10.2026 телефоны и софт — один пул: «Software and phones (API)» в Services. Телефон берёт те же заказы, что софт (просмотры, реакции, подписки, эмодзи-комментарии), и получает ту же оплату заказа. Отдельных цен приложения больше нет: оплата задаётся одна, в Services → услуга → Worker pay; «Платить от цены клиента» действует и на телефоны. Заказы людей с сайта телефоны не берут.</div>
      </div>
      <div class="af-card">
        <h3>Лимиты по действиям <span class="af-sub">— и темп, который из них следует</span></h3>
        <table class="af-table wide">${['app_daily_limit_view', 'app_daily_limit_react', 'app_daily_limit_join', 'app_daily_limit_comment', 'app_rest_after_limit_hours', 'app_react_any_allowed'].map(row).join('')}</table>
        <div class="af-hint">Суточный лимит задаёт не только «сколько», но и «как часто»: сутки делятся на лимит, и аккаунт работает ровно, а не всплеском. Внутри часа выдаётся примерно 1/24 нормы — так дневной объём расходуется равномерно. Общий лимит аккаунта («Лимиты») остаётся верхней границей поверх этих. Учёт приложения ведётся отдельно от заданий сайта и с ними не пересекается.</div>
      </div>
      <div class="af-card">
        <h3>Невыполнимые заказы <span class="af-sub">— общие правила с софтом</span></h3>
        <div class="af-hint">С 28.10.2026 отказы телефонов считаются вместе с аккаунтами софта (Public API), одними порогами. «Поста нет» от 3 разных аккаунтов — проверка ссылки; ссылка мертва — отмена с возвратом или частичное закрытие. «Ссылка жива, но сделать нельзя» (реакции нет в наборе канала, реакции или пересылка запрещены) от 5 разных аккаунтов — заказ снимается с выдачи для всех и рассчитывается с панелью. Флуд, ограничения и проблемы самого аккаунта, сбои связи в счёт не идут: такой аккаунт просто больше не берёт этот заказ. Реакции, выключенные на посте совсем, закрывают заказ сразу.</div>
      </div>
      <div class="af-card">
        <h3>Пауза <span class="af-sub">— мягкая, в отличие от рубильника</span></h3>
        <table class="af-table wide">${['app_paused', 'app_pause_poll_sec'].map(row).join('')}</table>
        <div class="af-hint">На паузе новые задания не выдаются, но отчёты о уже выполненном принимаются — люди не теряют заработанное. Начатая пачка доделывается на устройстве. Кнопка «Начать» в приложении честно отвечает, что работа временно недоступна.</div>
      </div>
      <div class="af-card">
        <h3>Объявление для устройств</h3>
        <table class="af-table wide">${['app_notice_text'].map(row).join('')}</table>
        <div class="af-hint">Текст доходит до телефонов с ближайшим запросом (обычно в течение минут) и показывается один раз. Отдельная служба уведомлений не нужна: приложение и так приходит к серверу по расписанию, а телефоны без сервисов Google получат сообщение наравне со всеми.</div>
      </div>
      <div class="af-card">
        <h3>Обновления PR Worker 1.7 <span class="af-sub">(файлы, тестеры и выпуск PR Worker 2.0: вкладка «Версии и сообщения»)</span></h3>
        <div class="af-rel">
          <div class="af-rel-pane">
            <div class="af-rel-head"><b>Тестовый канал</b>
              ${betaV ? `<span class="af-badge amber">билд ${esc(s.app_beta_version)}</span>` : '<span class="af-badge">пусто</span>'}</div>
            <div class="af-rel-sub">Обновление на эту сборку видят только тех-аккаунты из белого списка («Рубильники») и админы. Остальные устройства о ней не знают.</div>
            <label class="af-rel-field"><span>Билд (versionCode)</span>${relNum('app_beta_version')}</label>
            <label class="af-rel-field"><span>Ссылка на APK</span>${relUrl('app_beta_update_url')}</label>
            <div class="af-rel-actions">
              ${s.app_beta_update_url
                ? `<a class="af-btn" href="${esc(s.app_beta_update_url)}" target="_blank" rel="noopener">Скачать тестовую сборку</a>`
                : '<span class="af-sub">впиши ссылку — появится кнопка скачивания</span>'}
            </div>
          </div>
          <div class="af-rel-arrow">→</div>
          <div class="af-rel-pane">
            <div class="af-rel-head"><b>Боевой канал</b>
              ${prodV ? `<span class="af-badge green">билд ${esc(s.app_latest_version)}</span>` : '<span class="af-badge">выкл</span>'}</div>
            <div class="af-rel-sub">Эту версию предлагаем всем устройствам; эта же ссылка будет раздаваться пользователям в разделе Tools. 0 — просьбу обновиться не показываем.</div>
            <label class="af-rel-field"><span>Билд (versionCode)</span>${relNum('app_latest_version')}</label>
            <label class="af-rel-field"><span>Ссылка на APK</span>${relUrl('app_update_url')}</label>
            <div class="af-rel-actions">
              ${s.app_update_url
                ? `<a class="af-btn" href="${esc(s.app_update_url)}" target="_blank" rel="noopener">Скачать боевую сборку</a>`
                : '<span class="af-sub">ссылки нет — кнопки обновления у устройств не будет</span>'}
            </div>
          </div>
        </div>
        <div class="af-rel-release">
          <button class="af-btn primary" id="btnReleaseBeta" ${betaV > 0 ? '' : 'disabled'}>Раскатить тестовую на всех</button>
          <span class="af-sub">${betaV > 0 ? `билд ${esc(s.app_beta_version)} заместит боевой${s.app_beta_update_url ? ' вместе со ссылкой' : ' (ссылка останется прежней)'}` : 'сначала заполни тестовый канал'}</span>
        </div>
        <table class="af-table wide" style="margin-top:12px">${['app_tools_download_enabled'].map(row).join('')}</table>
        <div class="af-hint">Порядок релиза: 1) заполняешь тестовый канал — сборку видят только тех-аккаунты; 2) «Скачать тестовую сборку», проверяешь на своём устройстве; 3) «Раскатить тестовую на всех» — билд и ссылка переезжают в боевой канал, все устройства ниже получают предложение обновиться с ближайшим опросом, тестовый канал очищается. Жёсткая стена для совсем старых сборок — «Минимальная версия» в «Рубильниках». Обновление не разлогинивает Telegram-аккаунты.</div>
      </div>
      <div class="af-card">
        <h3>Аккаунты и качество</h3>
        <table class="af-table wide">${['app_account_change_days', 'app_quality_block', 'app_require_photo', 'app_require_bio', 'app_username_min_len', 'app_username_max_digit_run', 'app_premium_only_actions'].map(row).join('')}</table>
        <div class="af-hint">По умолчанию ничего не запрещено: слабый аккаунт получает подсказки в приложении, а решение — за этими тумблерами. Требования включай осторожно: у живых людей бывает и пустое описание, и имя вида ivan1990.</div>
      </div>
      <div class="af-card">
        <h3>Хранение данных <span class="af-sub">— сколько живут подробности</span></h3>
        <table class="af-table wide">${['app_done_keep_days', 'app_keep_daily_days', 'app_logs_keep_days'].map(row).join('')}</table>
        <div class="af-hint">Итог по дням хранится всегда — это одна строка в сутки. Ограничены только подробности: отметки о выполненном (нужны, чтобы одно задание не выдавалось человеку дважды), дневные срезы по устройствам и аккаунтам, и журналы, присланные телефонами.</div>
      </div>
      ${afRestKeys.length ? `<div class="af-card">
        <h3>Прочие настройки <span class="af-sub">— всё, что не попало в разделы выше</span></h3>
        <table class="af-table wide">${afRestKeys.map(row).join('')}</table>
        <div class="af-hint">Этот раздел собирается сам: сюда попадает любая настройка контура, которую не разложили по смысловым карточкам. Пусто — значит в панели видно всё, чем управляет сервер.</div>
      </div>` : ''}
      <div class="af-card">
        <h3>Отсечь версию</h3>
        <div class="af-toolbar">
          <input class="af-input sm" id="afBlockVer" placeholder="например 1">
          <button class="af-btn danger" id="afBlockVerBtn">Заблокировать все устройства этой версии</button>
        </div>
        <div class="af-hint">Разовая мера, если конкретная сборка ведёт себя неправильно. Обычный путь — поднять минимальную версию, тогда люди просто обновятся.</div>
      </div></div>`;

    el.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', async () => {
      const on = Number(b.dataset.toggle) === 1;
      // Текст подтверждения — про ту настройку, которую жмут. Общая фраза
      // «устройства перестанут получать задания» на тумблере «требовать фото»
      // пугала бы зря.
      const WARN = {
        app_api_enabled: [
          ['Включить контур приложения?', 'Устройства начнут получать задания.'],
          ['Выключить контур приложения?', 'Все устройства мгновенно перестанут получать задания, включая отчёты о уже сделанном. Для временной остановки лучше «Пауза».'],
        ],
        app_paused: [
          ['Поставить на паузу?', 'Новые задания выдаваться не будут. Уже выполненное примем и оплатим, начатые пачки доделаются. Устройства увидят «сервис на паузе».'],
          ['Снять паузу?', 'Устройства вернутся к работе в течение назначенного им интервала.'],
        ],
        app_quality_block: [
          ['Не принимать плохие аккаунты?', 'Аккаунты без имени, фото и описания перестанут добавляться, а уже добавленные — получать задания.'],
          ['Разрешить любые аккаунты?', 'Оценка останется справочной и на работу влиять не будет.'],
        ],
        app_require_photo: [
          ['Требовать фото профиля?', 'Аккаунт без аватара нельзя будет добавить.'],
          ['Не требовать фото?', 'Аккаунты без аватара снова можно добавлять.'],
        ],
        app_require_bio: [
          ['Требовать описание профиля?', 'Аккаунт с пустым «о себе» нельзя будет добавить.'],
          ['Не требовать описание?', 'Аккаунты без описания снова можно добавлять.'],
        ],
        app_profile_keygen_enabled: [
          ['Открыть выпуск ключей всем?', 'Любой пользователь сможет выпустить ключ приложения в своём профиле.'],
          ['Закрыть выпуск ключей?', 'Кнопка в профиле будет отвечать «недоступно» всем, кроме админов и тех-аккаунтов из списка.'],
        ],
        app_tools_download_enabled: [
          ['Открыть скачивание приложения всем?', 'Кнопка «Скачать APK» на странице Tools станет активной для всех пользователей, ссылка на сборку станет публичной.'],
          ['Закрыть скачивание?', 'Кнопка на странице Tools сменится на «скоро», ссылка на сборку перестанет отдаваться.'],
        ],
      };
      const pair = WARN[b.dataset.key];
      const [title, body] = pair ? (on ? pair[0] : pair[1])
        : [on ? 'Включить?' : 'Выключить?', 'Настройка изменится сразу.'];
      const ok = await confirmBox({
        title, body,
        confirmLabel: on ? 'Включить' : 'Выключить',
        danger: !on || b.dataset.key !== 'app_api_enabled',
      });
      if (!ok) return;
      await api('/settings', { method: 'POST', body: { key: b.dataset.key, value: b.dataset.toggle } });
      showToast('Сохранено', 'success');
      render();
    }));
    const rb = el.querySelector('#btnReleaseBeta');
    if (rb) rb.addEventListener('click', async () => {
      const ok = await confirmBox({
        title: 'Раскатить тестовую версию на всех?',
        body: 'Тестовая сборка станет боевой: все устройства со сборкой ниже неё получат предложение обновиться с ближайшим опросом. Тестовый канал очистится.',
        confirmLabel: 'Раскатить',
        danger: false,
      });
      if (!ok) return;
      const r = await api('/release-beta', { method: 'POST', body: {} });
      showToast('Версия ' + (r.released_version || '') + ' раскатана на всех', 'success');
      render();
    });
    // Галочка вида: весь список видов уходит одной настройкой; виды вне таблицы (если были вписаны руками) сохраняются.
    el.querySelectorAll('input[data-kind]').forEach(cb => cb.addEventListener('change', async () => {
      const list = kindsOn().filter((x) => x !== cb.dataset.kind);
      if (cb.checked) list.push(cb.dataset.kind);
      const value = list.join(',');
      try {
        await api('/settings', { method: 'POST', body: { key: 'app_kinds_enabled', value } });
        s.app_kinds_enabled = value;
        const badge = cb.parentElement.querySelector('.af-badge');
        if (badge) { badge.textContent = cb.checked ? 'ВКЛ' : 'ВЫКЛ'; badge.classList.toggle('green', cb.checked); }
        showToast(cb.checked ? 'Вид открыт телефонам' : 'Вид закрыт для телефонов', 'success');
      } catch (e) { showToast('Не сохранено: ' + (e.message || ''), 'error'); render(); }
    }));
    // Пересчёт объяснения прямо во время ввода: последствия видно ДО сохранения.
    el.querySelectorAll('input[data-key]').forEach(inp => inp.addEventListener('input', () => {
      const live = document.getElementById('live_' + inp.dataset.key);
      if (live) live.innerHTML = explain(inp.dataset.key, inp.value);
    }));

    el.querySelectorAll('input[data-key], select[data-key]').forEach(inp => inp.addEventListener('change', async () => {
      try {
        await api('/settings', { method: 'POST', body: { key: inp.dataset.key, value: inp.value } });
        s[inp.dataset.key] = inp.value;
        const live = document.getElementById('live_' + inp.dataset.key);
        if (live) live.innerHTML = explain(inp.dataset.key, inp.value);
        // Видимая отметка у самого поля: тост уходит, а вопрос «применилось ли»
        // остаётся, если рядом с настройкой ничего не изменилось.
        inp.style.transition = 'box-shadow .2s';
        inp.style.boxShadow = '0 0 0 2px rgba(22,163,74,.45)';
        setTimeout(() => { inp.style.boxShadow = 'none'; }, 1200);
        showToast('Сохранено', 'success');
        if (['app_beta_version', 'app_beta_update_url', 'app_latest_version', 'app_update_url'].includes(inp.dataset.key)) render();
      } catch (e) { showToast('Не сохранено: ' + (e.message || ''), 'error'); render(); }
    }));
    document.getElementById('afBlockVerBtn')?.addEventListener('click', async () => {
      const v = document.getElementById('afBlockVer').value.trim();
      if (!v) return;
      const ok = await confirmBox({ title: `Заблокировать устройства версии ${v}?`,
        body: 'Все устройства этой версии перестанут получать задания, пока их не разблокировать.', confirmLabel: 'Заблокировать', danger: true });
      if (!ok) return;
      const r = await api('/devices/bulk', { method: 'POST', body: { scope: 'version', version: v, reason: 'версия отключена админом' } });
      showToast(`Заблокировано: ${r.changed}`, 'success');
    });
  }

  // ---------------------------------------------------------- RELEASE (2.0)
  // PR Worker 2.0 (30.10.2026): the file of the newest version, the test people, «всем», «обязательно»; the files to download; the
  // versions on the working phones; the messages to a person or a phone (services/app-control.js). Nothing moves for the phones
  // until a button here is pressed, and every button asks first, saying how many phones it reaches.
  const ERR = {
    no_file: 'Сначала выберите файл 2.0', stale: 'Страница устарела: версия сменилась. Обновите вкладку', already_all: 'Эта версия уже предложена всем',
    not_offered_to_all: 'Сначала предложите версию всем', already_required: 'Эта версия уже обязательна', no_such_file: 'Такого файла нет в папке приложений',
    not_pr_worker: 'Это не PR Worker: у файла другое приложение', version_mismatch: 'В файле другой билд', version_unknown: 'Билд не прочитан из файла: впишите его',
    older_than_all: 'Этот файл старее версии, предложенной всем', bad_ids: 'Номера людей через запятую, не больше 500', no_such_user: 'Таких людей нет',
    not_apk: 'Это не APK (не прочитан манифест)', file_exists: 'Файл этой версии уже есть, и он другой: соберите новый билд', too_big: 'Файл больше 300 МБ',
    no_phones: 'У человека нет работающих телефонов', no_device: 'Такого телефона нет', empty: 'Пустой текст', redis: 'Redis не ответил, попробуйте ещё раз',
  };
  const errText = (e) => ERR[e && e.message] || (e && e.message) || 'ошибка';
  const size = (b) => (b > 0 ? (b / 1048576).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' МБ' : '—');
  const MSG_STATE = { waiting: ['amber', 'ждёт телефона'], delivered: ['green', 'доставлено'], closed: ['', 'закрыто'], replaced: ['', 'заменено новым'], removed: ['', 'убрано'], unknown: ['red', 'нет данных'] };

  // A window of this page: html inside, the buttons of the caller; → the element and its close().
  function windowBox(title, html) {
    const m = document.createElement('div');
    m.className = 'af-modal';
    m.innerHTML = '<div class="af-modal-inner" style="max-width:640px">' + '<div class="af-modal-title">' + esc(title) + '</div>' + html + '</div>';
    document.body.appendChild(m);
    const close = () => m.remove();
    m.onclick = (e) => { if (e.target === m) close(); };
    return { m, close };
  }
  // A message to a person (all their working phones) or to one phone, written here and sent at once.
  function writeMessage({ userId, deviceId, who }) {
    const { m, close } = windowBox(deviceId ? 'Сообщение на телефон #' + deviceId : 'Сообщение человеку', `
      <div class="af-modal-body">${esc(who || '')}<textarea id="afMsgText" class="af-input" rows="5" maxlength="500" style="width:100%;margin-top:8px" placeholder="Текст, который человек увидит в приложении"></textarea>
        <div class="af-hint">Телефон 2.0 покажет сообщение на экране и уведомлением, даже когда работа выключена (проверяет раз в 30 минут и при открытии приложения). Телефон 1.7 покажет его в приложении. Новое сообщение заменяет прежнее на этом телефоне.</div></div>
      <div class="af-modal-actions"><button class="af-btn" data-no>Отмена</button><button class="af-btn primary" data-yes>Отправить</button></div>`);
    m.querySelector('[data-no]').onclick = close;
    m.querySelector('[data-yes]').onclick = async () => {
      const text = m.querySelector('#afMsgText').value.trim();
      if (!text) return;
      try {
        const r = await api('/messages', { method: 'POST', body: { user_id: userId || undefined, device_id: deviceId || undefined, text } });
        close();
        showToast('Отправлено: телефонов ' + r.devices.length + '. Дойдёт при ближайшем обращении телефона', 'success');
        if (tab === 'release') render();
      } catch (e) { showToast('Не отправлено: ' + errText(e), 'error'); }
    };
  }
  function msgTable(items, showWho) {
    if (!items.length) return '<div class="af-nodata">сообщений нет</div>';
    return `<table class="af-table wide"><thead><tr><th>Когда</th>${showWho ? '<th>Кому</th>' : ''}<th>Текст</th><th>Состояние</th><th></th></tr></thead><tbody>${items.map((x) => {
      const st = MSG_STATE[x.state] || ['', x.state];
      return `<tr><td>${ago(x.created_at)}</td>
        ${showWho ? `<td><b>${esc(x.username || '#' + x.user_id)}</b><div class="af-sub">телефон #${x.device_id}${x.model ? ' · ' + esc(x.model) : ''}${x.app_version ? ' · v' + esc(x.app_version) : ''}</div></td>` : ''}
        <td style="max-width:420px;white-space:pre-wrap">${esc(x.text)}</td>
        <td><span class="af-badge ${st[0]}">${st[1]}</span>${x.delivered_at ? `<div class="af-sub">доставлено ${ago(x.delivered_at)}</div>` : ''}${x.closed_at ? `<div class="af-sub">закрыто ${ago(x.closed_at)}</div>` : ''}</td>
        <td>${['waiting', 'delivered'].includes(x.state) ? `<button class="af-btn sm" data-msg-remove="${x.id}">Убрать</button>` : ''}</td></tr>`;
    }).join('')}</tbody></table>`;
  }
  function bindMsgRemove(root, after) {
    root.querySelectorAll('[data-msg-remove]').forEach((b) => b.addEventListener('click', async () => {
      try { await api('/message/' + b.dataset.msgRemove + '/remove', { method: 'POST', body: {} }); showToast('Сообщение убрано', 'success'); after(); }
      catch (e) { showToast('Не убрано: ' + errText(e), 'error'); }
    }));
  }

  async function renderRelease(el) {
    const [d, ms] = await Promise.all([api('/release'), api('/messages?limit=30')]);
    const r = d.release, v17 = d.v17, files = d.files || [];
    const tCount = (d.testers || []).length;
    // the name of a build as people know it
    const nameOf = (code) => (code && code === r.version ? r.name : code && code === r.all ? r.all_name : code && code === v17.version ? v17.name : '') || '';
    const least = Math.max(v17.min || 0, r.min || 0);
    const steps = [
      r.version ? `<span class="af-badge green">файл: ${esc(r.name)} (билд ${r.version})</span>` : '<span class="af-badge">файла 2.0 нет</span>',
      `<span class="af-badge ${tCount ? 'amber' : ''}">тестеры: ${tCount} чел.${r.version && tCount ? `, предложено телефонам: ${d.reach.testers}` : ''}</span>`,
      r.beta_required ? '<span class="af-badge red">обязательна для тестеров</span>' : '',
      r.all ? `<span class="af-badge green">всем: ${esc(r.all_name)} (билд ${r.all})</span>` : '<span class="af-badge">всем: не предложена</span>',
      r.min ? `<span class="af-badge red">обязательна с билда ${r.min}</span>` : '<span class="af-badge">не обязательна</span>',
    ].join(' ');
    const canAll = r.version > 0 && r.url && r.all < r.version;
    const canReq = r.all > 0 && r.min < r.all;
    el.innerHTML = `<div class="af-control">
      <div class="af-card">
        <h3>PR Worker 2.0 <span class="af-sub">кому предлагается</span></h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${steps}</div>
        <div class="af-toolbar" style="margin-top:12px">
          <button class="af-btn" id="afRelFile">Файл 2.0…</button>
          <button class="af-btn" id="afRelTesters">Тестеры…</button>
          <label class="af-sub" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" id="afRelBetaReq" ${r.beta_required ? 'checked' : ''} ${r.beta_required || (r.version && r.url && tCount) ? '' : 'disabled'}> Обязательно для тестовых</label>
          <button class="af-btn primary" id="afRelAll" ${canAll ? '' : 'disabled'}>Предложить ${esc(r.name || '2.0')} всем</button>
          <button class="af-btn danger" id="afRelReq" ${canReq ? '' : 'disabled'}>Сделать ${esc(r.all_name || '')} обязательной</button>
          <span class="af-spacer"></span>
          ${r.min ? '<button class="af-btn sm" id="afRelUnReq">Отменить обязательность</button>' : ''}
          ${r.all ? '<button class="af-btn sm" id="afRelUnAll">Не предлагать всем</button>' : ''}
        </div>
        <div class="af-hint">Порядок: 1) «Файл 2.0…»: загрузите APK или выберите из папки, билд и версия читаются из самого файла; 2) «Тестеры…»: номера людей. Только их телефонам (и 2.0, и 1.7) приходит предложение обновиться; галочка «Обязательно для тестовых»: телефоны тестеров ниже новейшего файла не получают задания, пока не обновятся (остальных это не касается, а новый файл, пока галочка стоит, сразу обязателен для тестеров); 3) «Предложить всем»: предложение получают все телефоны ниже этой версии, работать можно и без обновления; 4) «Сделать обязательной»: телефоны ниже перестают получать задания, пока не обновятся (сделанное принимается). Новый файл не меняет то, что уже предложено всем и обязательно: каждая ступень двигается только кнопкой.</div>
      </div>
      <div class="af-card">
        <h3>Файлы новейших версий <span class="af-sub">скачать, чтобы поставить на свой телефон или отправить тестеру</span></h3>
        <table class="af-table wide"><thead><tr><th>Приложение</th><th>Версия</th><th>Билд</th><th>Файл</th><th>Размер</th><th></th></tr></thead><tbody>
          <tr><td><b>PR Worker 2.0</b></td><td>${esc(r.name || '—')}</td><td class="af-num">${r.version || '—'}</td>
            <td>${r.file ? `<code>${esc(r.file)}</code>` : '<span class="af-sub">файла нет: «Файл 2.0…»</span>'}</td><td class="af-num">${size(r.size)}</td>
            <td>${r.url ? `<a class="af-btn sm primary" href="${esc(r.url)}" download>Скачать APK</a>` : ''}</td></tr>
          ${r.all && r.all !== r.version ? `<tr><td>PR Worker 2.0 <span class="af-sub">предложена всем</span></td><td>${esc(r.all_name)}</td><td class="af-num">${r.all}</td><td><code>${esc(r.all_file)}</code></td><td></td>
            <td><a class="af-btn sm" href="${esc(r.all_url)}" download>Скачать APK</a></td></tr>` : ''}
          <tr><td><b>PR Worker 1.7</b> <span class="af-sub">сейчас у парка</span></td><td>${esc(v17.name || '—')}</td><td class="af-num">${v17.version || '—'}</td>
            <td>${v17.file ? `<code>${esc(v17.file)}</code>` : '<span class="af-sub">ссылки нет («Управление» → «Обновления PR Worker 1.7»)</span>'}</td><td></td>
            <td>${v17.url ? `<a class="af-btn sm" href="${esc(v17.url)}" download>Скачать APK</a>` : ''}</td></tr>
        </tbody></table>
      </div>
      <div class="af-card">
        <h3>Версии на устройствах <span class="af-sub">работающие телефоны; минимальный билд сейчас ${least || 'не задан'}</span></h3>
        <table class="af-table wide"><thead><tr><th>Версия</th><th>Билд</th><th>Телефонов</th><th>На связи сегодня</th><th>Сейчас</th></tr></thead><tbody>
          ${(d.versions || []).map((x) => `<tr><td>${esc(nameOf(x.code) || x.v || '—')}${x.coded && x.coded === x.n ? ' <span class="af-sub">2.0</span>' : ''}</td><td class="af-num">${x.code || '—'}</td>
            <td class="af-num">${num(x.n)}</td><td class="af-num">${num(x.day)}</td>
            <td>${x.works ? '<span class="af-badge green">работает</span>' : '<span class="af-badge red">должен обновиться</span>'}</td></tr>`).join('') || '<tr><td colspan="5">работающих телефонов нет</td></tr>'}
        </tbody></table>
        <div class="af-hint">Счёт обновляется раз в минуту. «На связи сегодня»: телефон обращался к сайту с начала суток (UTC), в том числе с выключенной работой.</div>
      </div>
      <div class="af-card">
        <h3>Сообщения людям и телефонам</h3>
        <div class="af-toolbar"><button class="af-btn" id="afMsgUser">Написать человеку…</button>
          <span class="af-sub">Сообщение конкретному телефону: «Устройства» → «Написать» или карточка телефона. Объявление всему парку: «Управление» → «Объявление для устройств».</span></div>
        <div id="afMsgList">${msgTable(ms.items || [], true)}</div>
      </div>
    </div>`;

    bindMsgRemove(el, render);
    document.getElementById('afMsgUser').onclick = () => {
      const id = parseInt(prompt('Номер человека (ID на сайте):', '') || '', 10);
      if (id > 0) writeMessage({ userId: id, who: 'Человек #' + id + ': все его работающие телефоны.' });
    };
    document.getElementById('afRelTesters').onclick = () => {
      const { m, close } = windowBox('Тестеры PR Worker 2.0', `
        <div class="af-modal-body">Номера людей через запятую. Их телефонам (и 2.0, и 1.7) предлагается новейший файл 2.0; остальным ничего не меняется.
          <input id="afTesterIds" class="af-input" style="width:100%;margin-top:8px" value="${esc((d.testers || []).map((t) => t.id).join(', '))}">
          <table class="af-table wide" style="margin-top:8px">${(d.testers || []).map((t) => `<tr><td>#${t.id}</td><td>${esc(t.username || '—')}</td><td class="af-num">телефонов: ${t.phones}</td><td class="af-num">предложено: ${t.offered}</td></tr>`).join('')}</table></div>
        <div class="af-modal-actions"><button class="af-btn" data-no>Отмена</button><button class="af-btn primary" data-yes>Сохранить</button></div>`);
      m.querySelector('[data-no]').onclick = close;
      m.querySelector('[data-yes]').onclick = async () => {
        try { const x = await api('/release/testers', { method: 'POST', body: { ids: m.querySelector('#afTesterIds').value } }); close(); showToast('Тестеров: ' + x.ids.length, 'success'); render(); }
        catch (e) { showToast('Не сохранено: ' + errText(e), 'error'); }
      };
    };
    document.getElementById('afRelBetaReq').onchange = async (ev) => {
      const on = ev.target.checked;
      ev.target.checked = !on; // stays as it was until the server says
      const ok = await confirmBox(on
        ? { title: `Сделать ${r.name} обязательной для тестеров?`,
          body: `Телефоны тестеров ниже билда ${r.version} перестанут получать задания, пока не обновятся: сейчас таких работающих телефонов <b>${num(d.reach.testers)}</b> (и 2.0, и 1.7). Остальных людей это не касается. Пока включено, каждый новый файл 2.0 сразу становится обязательным для тестеров.`,
          confirmLabel: 'Сделать обязательной', danger: true }
        : { title: 'Снять обязательность для тестеров?', body: 'Телефоны тестеров снова получат задания на своей версии. Предложение обновиться остаётся.', confirmLabel: 'Снять' });
      if (!ok) return;
      try { const x = await api('/release/beta-required', { method: 'POST', body: { on: on ? 1 : 0, version: r.version } }); showToast(on ? 'Обязательна для тестеров. Остановлено до обновления: ' + num(x.stopped) : 'Обязательность для тестеров снята', 'success'); render(); }
      catch (e) { showToast('Не сделано: ' + errText(e), 'error'); render(); }
    };
    document.getElementById('afRelFile').onclick = () => fileDialog(r, files);
    document.getElementById('afRelAll').onclick = async () => {
      const ok = await confirmBox({ title: `Предложить ${r.name} всем?`,
        body: `Предложение обновиться до ${esc(r.name)} (билд ${r.version}) получат все работающие телефоны ниже этой версии: <b>${num(d.reach.all)}</b>. Это не обязательно: без обновления они продолжают работать.`,
        confirmLabel: 'Предложить всем' });
      if (!ok) return;
      try { const x = await api('/release/offer-all', { method: 'POST', body: { version: r.version } }); showToast('Предложено всем: телефонов ' + num(x.reached), 'success'); render(); }
      catch (e) { showToast('Не сделано: ' + errText(e), 'error'); render(); }
    };
    document.getElementById('afRelReq').onclick = async () => {
      const ok = await confirmBox({ title: `Сделать ${r.all_name} обязательной?`,
        body: `Телефоны ниже билда ${r.all} перестанут получать задания, пока не обновятся: сейчас таких работающих телефонов <b>${num(d.reach.required)}</b>. Уже сделанное они сдадут как обычно. Отменить можно кнопкой «Отменить обязательность».`,
        confirmLabel: 'Сделать обязательной', danger: true });
      if (!ok) return;
      try { const x = await api('/release/require', { method: 'POST', body: { version: r.all } }); showToast('Обязательна. Остановлено до обновления: ' + num(x.stopped), 'success'); render(); }
      catch (e) { showToast('Не сделано: ' + errText(e), 'error'); render(); }
    };
    const undo = (what, title, body) => async () => {
      if (!(await confirmBox({ title, body, confirmLabel: 'Отменить' }))) return;
      try { await api('/release/withdraw', { method: 'POST', body: { what } }); showToast('Сделано', 'success'); render(); }
      catch (e) { showToast('Не сделано: ' + errText(e), 'error'); }
    };
    const unReq = document.getElementById('afRelUnReq');
    if (unReq) unReq.onclick = undo('required', 'Отменить обязательность?', 'Телефоны ниже билда ' + r.min + ' снова получат задания. Предложение обновиться остаётся.');
    const unAll = document.getElementById('afRelUnAll');
    if (unAll) unAll.onclick = undo('all', 'Не предлагать ' + r.all_name + ' всем?', 'Телефоны перестанут получать предложение обновиться (и обязательность снимется). Тестеры по-прежнему видят новейший файл.');
  }

  // «Файл 2.0…»: the files of the folder of the apps with what each says of itself; a new APK is uploaded here. The chosen file becomes
  // the newest version (offered to the test people at once).
  function fileDialog(r, files) {
    const list = (fs) => fs.length ? fs.map((f) => `<label style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border,#eee)">
        <input type="radio" name="afApk" value="${esc(f.name)}" ${f.name === r.file ? 'checked' : ''} ${f.code ? '' : 'disabled'}>
        <span style="flex:1"><code>${esc(f.name)}</code><div class="af-sub">${f.code ? `версия ${esc(f.version || '?')}, билд ${f.code}` : 'не прочитан: ' + esc(f.error || '')} · ${size(f.size)} · ${ago(f.at)}</div></span></label>`).join('')
      : '<div class="af-nodata">в папке приложений нет APK</div>';
    const { m, close } = windowBox('Файл PR Worker 2.0', `
      <div class="af-modal-body">
        <div id="afApkList">${list(files)}</div>
        <div style="margin-top:12px"><b>Загрузить новый APK</b> <span class="af-sub">ляжет в папку под именем своей версии; файл с тем же именем не перезаписывается</span>
          <input type="file" id="afApkFile" accept=".apk" style="display:block;margin-top:6px"><div class="af-sub" id="afApkUp"></div></div>
        <div class="af-hint">Выбранный файл сразу предлагается тестерам. Всем: кнопкой «Предложить всем».</div>
      </div>
      <div class="af-modal-actions"><button class="af-btn" data-no>Отмена</button><button class="af-btn primary" data-yes>Сделать новейшей версией</button></div>`);
    m.querySelector('[data-no]').onclick = close;
    m.querySelector('#afApkFile').onchange = async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const st = m.querySelector('#afApkUp');
      st.textContent = 'загружается ' + size(f.size) + '…';
      try {
        const fd = new FormData(); fd.append('apk', f);
        const x = await API.upload('POST', '/admin/app/release/upload', fd);
        st.textContent = 'загружен: ' + x.file + ' (версия ' + x.version + ', билд ' + x.code + ')';
        const fresh = await api('/release');
        m.querySelector('#afApkList').innerHTML = list(fresh.files || []);
        const radio = m.querySelector(`input[name="afApk"][value="${CSS.escape(x.file)}"]`);
        if (radio) radio.checked = true;
      } catch (err) { st.textContent = 'не загружен: ' + errText(err); }
    };
    m.querySelector('[data-yes]').onclick = async () => {
      const pick = m.querySelector('input[name="afApk"]:checked');
      if (!pick) return showToast('Выберите файл', 'warning');
      try { const x = await api('/release/file', { method: 'POST', body: { file: pick.value } }); close(); showToast('Новейшая версия 2.0: ' + x.name + ' (билд ' + x.version + ')', 'success'); render(); }
      catch (e) { showToast('Не сохранено: ' + errText(e), 'error'); }
    };
  }

  // ------------------------------------------------------------------ render
  async function render() {
    const el = document.getElementById('appBody');
    if (!el) return;
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
    try {
      if (tab === 'overview') { await renderOverview(el); refreshTimer = setInterval(() => { if (document.getElementById('appBody') && tab === 'overview') renderOverview(el).catch(() => {}); else clearInterval(refreshTimer); }, 15000); }
      else if (tab === 'devices') await renderDevices(el);
      else if (tab === 'accounts') await renderAccounts(el);
      else if (tab === 'problems') await renderProblems(el);
      else if (tab === 'events') await renderEvents(el);
      else if (tab === 'analytics') await renderAnalytics(el);
      else if (tab === 'health') { await renderHealth(el); refreshTimer = setInterval(() => { if (document.getElementById('appBody') && tab === 'health') renderHealth(el).catch(() => {}); else clearInterval(refreshTimer); }, 20000); }
      else if (tab === 'logs') await renderLogs(el);
      else if (tab === 'release') await renderRelease(el);
      else await renderControl(el);
    } catch (e) {
      el.innerHTML = `<div class="adm-empty"><p>Ошибка загрузки: ${esc(e.message || '')}</p></div>`;
    }
  }

  render();
});
