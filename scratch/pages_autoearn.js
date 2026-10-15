// Telegram Web Worker — подключение своих аккаунтов в работу.
//
// Человек отдаёт аккаунт, тот работает на наших серверах, человеку идёт доля.
// Страница показывает состояние каждого аккаунта, заработок и уровень доли,
// и ведёт вход по номеру телефона — пошагово, потому что разговор с Telegram
// идёт через программу и занимает минуты.
Router.register('autoearn', async (app) => {
  const esc = (s) => (typeof escHtml === 'function' ? escHtml(String(s == null ? '' : s)) : String(s == null ? '' : s));
  const T = (k, зап) => (t(k) && t(k) !== k ? t(k) : зап);
  // Подстановка чисел в строку перевода: {tasks} и подобные.
  const F = (s, п) => String(s).replace(/\{(\w+)\}/g, (_, k) => (п[k] != null ? п[k] : ''));
  // Знаков ровно столько, чтобы сумма была видна. Реакция приносит тысячные
  // доли цента, и на четырёх знаках весь заработок превращается в «$0.0000» —
  // человек решает, что ему ничего не платят.
  const деньги = (v) => {
    const ч = Number(v) || 0;
    if (ч === 0) return '$0';
    if (ч >= 0.01) return '$' + ч.toFixed(2);
    if (ч >= 0.0001) return '$' + ч.toFixed(4);
    return '$' + ч.toFixed(6);
  };
  // Почему аккаунт в таком состоянии. Программа присылает код, а не готовую
  // фразу: иначе человек с английским сайтом читал бы русский текст. Код
  // старше словаря молча уступает место общему пояснению по статусу.
  const пояснение = (a) => {
    if (a.reason_code) {
      const свой = T('ae_reason_' + a.reason_code, '');
      if (свой) return F(свой, { until: a.reason_until || '' });
    }
    if (a.status_hint) return a.status_hint;
    return F(T('ae_hint_' + a.status, ''), { minutes: (состояние || {}).payout_minutes || 15 });
  };

  const число = (v) => (Number(v) || 0).toLocaleString();


  // Стили раздела кладутся один раз: страница перерисовывается часто, и
  // вставлять их при каждом рендере значило бы плодить теги в <head>.
  if (!document.getElementById('ae-styles')) {
    const st = document.createElement('style');
    st.id = 'ae-styles';
    st.textContent = `
      .ae-head { display: flex; align-items: flex-start; gap: 16px; flex-wrap: nowrap; }
      .ae-head .page-header-text { flex: 1 1 auto; min-width: 0; }
      #aeAddBtn { flex: 0 0 auto; margin-left: auto; align-self: center; white-space: nowrap;
                  padding: 13px 22px; border-radius: 11px; font-size: 15px; }
      @media (max-width: 720px) {
        .ae-head { flex-wrap: wrap; }
        #aeAddBtn { width: 100%; margin-left: 0; }
      }
      .ae-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; cursor: pointer;
                 color: var(--text-secondary, #7b869a); margin-bottom: 6px; }
      .ae-back::before { content: "←"; }
      .ae-back:hover { color: var(--primary, #1c5fd6); }

      .ae-chart { margin-bottom: 18px; padding-bottom: 8px; }
      .ae-chart h2 { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      .ae-chart h2 small { display: inline; font-size: 12.5px; font-weight: 400;
                           color: var(--text-secondary, #9aa5bb); margin: 0; }
      .ae-chart svg { display: block; width: 100%; height: 150px; }

      .ae-here { display: inline-block; width: 0; height: 0; margin-right: 7px; vertical-align: 1px;
                 border-left: 5px solid var(--primary, #1c5fd6);
                 border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
      .ae-share-foot { padding: 12px 16px 4px; display: flex; flex-direction: column; gap: 9px; }
      .ae-share-foot .ae-share-next { font-size: 13.5px; padding: 0; }
      .ae-files { display: flex; flex-direction: column; gap: 4px; }
      .ae-file { display: flex; gap: 8px; align-items: baseline; font-size: 12.5px; }
      .ae-file .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ae-file .sz { margin-left: auto; color: var(--text-secondary, #7b869a); font-variant-numeric: tabular-nums; }
      .ae-file.bad .nm { color: #b0243a; }
      .ae-file .why { color: #b0243a; font-size: 11.5px; }
      .ae-file.bad .sz { color: #b0243a; text-decoration: none; }
      .ae-resend { border: 0; background: none; padding: 0; font: inherit; font-size: 12.5px;
                   color: var(--primary, #1c5fd6); cursor: pointer; text-decoration: underline; }
      .ae-resend:disabled { color: var(--text-secondary, #9aa5bb); cursor: default; text-decoration: none; }
      .ae-load, .ae-empty { padding: 28px; text-align: center; color: var(--text-secondary, #6b7280); }
      .ae-empty { background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; line-height: 1.6; }
      .ae-warn { background: #fdf0da; color: #9a5b00; border-radius: 10px; padding: 11px 14px; margin-bottom: 14px; font-size: 13.5px; }

      .ae-btn { border: 1px solid transparent; border-radius: 9px; padding: 9px 16px; font: inherit;
                font-weight: 600; cursor: pointer; background: var(--primary, #1c5fd6); color: #fff; }
      .ae-btn:disabled { opacity: .5; cursor: default; }
      .ae-btn.ghost { background: transparent; color: var(--text-secondary, #4a5568); border-color: var(--border, #e5e7eb); }
      .ae-btn.sm { padding: 6px 12px; font-size: 13px; border-radius: 7px; }

      .ae-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 16px; }
      .ae-stat { background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; padding: 14px 16px; }
      .ae-stat .k { font-size: 11.5px; color: var(--text-secondary, #7b869a); text-transform: uppercase; letter-spacing: .05em; }
      .ae-stat .v { font-size: 23px; font-weight: 650; margin-top: 3px; font-variant-numeric: tabular-nums; }
      .ae-stat .s { font-size: 12.5px; color: var(--text-secondary, #7b869a); margin-top: 2px; }
      .ae-stat.earn .v { color: #0f7a3d; }
      .ae-badge { font-size: 12px; color: var(--primary, #1c5fd6); background: rgba(28,95,214,.1);
                  border-radius: 20px; padding: 2px 8px; vertical-align: 3px; font-weight: 600; }

      .ae-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
      @media (max-width: 900px) { .ae-cols { grid-template-columns: 1fr } }
      .ae-panel { background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; overflow: hidden; }
      .ae-panel h2 { margin: 0; padding: 13px 16px 9px; font-size: 14.5px; font-weight: 650; }
      .ae-panel h2 small { display: block; font-size: 12px; font-weight: 400; color: var(--text-secondary, #7b869a); margin-top: 2px; }
      .ae-scroll { overflow-x: auto; }
      .ae-table { width: 100%; border-collapse: collapse; font-size: 13.5px; font-variant-numeric: tabular-nums; }
      .ae-table th, .ae-table td { padding: 8px 16px; text-align: left; border-top: 1px solid var(--border-light, #eef1f6); }
      .ae-table th { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary, #7b869a); font-weight: 600; }
      .ae-table .r { text-align: right; }
      .ae-table .ok { color: #0f7a3d; font-weight: 600; }
      .ae-table tr.now td { background: rgba(28,95,214,.07); font-weight: 650; }
      .ae-note { padding: 10px 16px; font-size: 12.5px; color: var(--text-secondary, #7b869a); border-top: 1px solid var(--border-light, #eef1f6); }

      .ae-share { padding-bottom: 15px; }
      .ae-share h2 { padding-bottom: 4px; }
      .ae-bar { height: 7px; border-radius: 4px; background: var(--border-light, #eef1f6); margin: 0 16px; overflow: hidden; }
      .ae-bar i { display: block; height: 100%; border-radius: 4px; background: #0f7a3d; }
      .ae-share-next { padding: 9px 16px 0; font-size: 13.5px; }

      .ae-list-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
      .ae-list-head h2 { margin: 0; font-size: 14.5px; font-weight: 650; }
      .ae-filters { display: flex; gap: 6px; flex-wrap: wrap; }
      .ae-chip { border: 1px solid var(--border, #e5e7eb); background: var(--card-bg, #fff); color: var(--text-secondary, #4a5568);
                 border-radius: 20px; padding: 5px 12px; font: inherit; font-size: 13px; cursor: pointer; }
      .ae-chip[aria-pressed="true"] { border-color: var(--primary, #1c5fd6); color: var(--primary, #1c5fd6); font-weight: 600; }

      .ae-rows { display: flex; flex-direction: column; gap: 8px; }
      .ae-search { border: 1px solid var(--border, #e5e7eb); border-radius: 20px; padding: 5px 13px;
                   font: inherit; font-size: 13px; background: var(--card-bg, #fff); color: inherit;
                   min-width: 210px; }
      .ae-search:focus { outline: none; border-color: var(--primary, #1c5fd6); }
      .ae-more { width: 100%; margin-top: 8px; padding: 12px; border-radius: 11px; }
      .ae-row { background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; overflow: hidden; }
      .ae-row-main { display: grid; grid-template-columns: 1fr auto auto; gap: 14px; align-items: center; padding: 12px 15px; cursor: pointer; }
      .ae-row-main .n { font-weight: 600; }
      .ae-row-main .m { font-size: 12.5px; color: var(--text-secondary, #7b869a); }
      .ae-row-main .money { text-align: right; font-variant-numeric: tabular-nums; }
      .ae-row-main .money .v { font-weight: 650; }
      .ae-row-main .money .s { font-size: 12px; color: var(--text-secondary, #7b869a); }
      .ae-state { display: inline-flex; align-items: center; gap: 6px; border-radius: 20px; padding: 4px 10px; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
      .ae-state .dot { width: 7px; height: 7px; border-radius: 50%; }
      .ae-st-ok { background: #e3f5ea; color: #0f7a3d; } .ae-st-ok .dot { background: #0f7a3d; }
      .ae-st-check { background: rgba(28,95,214,.1); color: #1c5fd6; } .ae-st-check .dot { background: #1c5fd6; }
      .ae-st-warn { background: #fdf0da; color: #9a5b00; } .ae-st-warn .dot { background: #9a5b00; }
      .ae-st-bad { background: #fdeaed; color: #b0243a; } .ae-st-bad .dot { background: #b0243a; }
      .ae-st-idle { background: #eef1f6; color: #56607a; } .ae-st-idle .dot { background: #56607a; }

      .ae-detail { display: none; border-top: 1px solid var(--border-light, #eef1f6); padding: 0 15px 14px; }
      .ae-row.open .ae-detail { display: block; }
      .ae-detail .ae-note { border: 0; padding: 12px 0; }
      .ae-detail .ae-note.warn { color: #9a5b00; } .ae-detail .ae-note.bad { color: #b0243a; }
      .ae-detail-cols { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,.9fr); gap: 12px; align-items: start; }
      @media (max-width: 860px) { .ae-detail-cols { grid-template-columns: 1fr } }
      .ae-facts { display: flex; flex-direction: column; gap: 1px; background: var(--border-light, #eef1f6);
                  border: 1px solid var(--border-light, #eef1f6); border-radius: 10px; overflow: hidden; }
      .ae-fact { background: var(--card-bg, #fff); display: flex; gap: 12px; align-items: baseline; padding: 7px 12px; }
      .ae-fact .k { font-size: 12.5px; color: var(--text-secondary, #7b869a); flex: 1; }
      .ae-fact .v { font-weight: 600; font-size: 13.5px; text-align: right; }

      .ae-did h4 { margin: 0 0 7px; font-size: 11.5px; color: var(--text-secondary, #7b869a); text-transform: uppercase; letter-spacing: .05em; }
      .ae-did-rows { display: flex; flex-direction: column; gap: 1px; background: var(--border-light, #eef1f6);
                     border: 1px solid var(--border-light, #eef1f6); border-radius: 10px; overflow: hidden; }
      .ae-did-row { background: var(--card-bg, #fff); display: grid; grid-template-columns: 1fr auto auto; gap: 12px;
                    padding: 7px 12px; font-size: 13px; font-variant-numeric: tabular-nums; }
      .ae-did-row .cnt { text-align: right; min-width: 58px; font-weight: 600; }
      .ae-did-row .sum { text-align: right; min-width: 70px; color: #0f7a3d; font-weight: 650; }
      .ae-did-row.total { background: var(--bg-secondary, #f7f9fc); font-weight: 650; }

      .ae-acts { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
      .ae-lock { font-size: 12.5px; color: var(--text-secondary, #7b869a); }

      .ae-veil { position: fixed; inset: 0; background: rgba(10,14,22,.55); display: grid; place-items: center; padding: 16px; z-index: 1000; }
      .ae-modal { background: var(--card-bg, #fff); border-radius: 14px; width: min(560px, 100%); max-height: 90vh; overflow: auto; }
      .ae-grip { display: none; }
      .ae-modal header { padding: 16px 18px 0; }
      .ae-modal h3 { margin: 0 0 3px; font-size: 17px; }
      .ae-modal .sub { font-size: 13px; color: var(--text-secondary, #7b869a); }
      .ae-modal-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 13px; }
      .ae-modal footer { display: flex; gap: 8px; justify-content: flex-end; padding: 0 18px 18px; }

      .ae-tabs { display: flex; gap: 4px; background: var(--bg-secondary, #f7f9fc); border: 1px solid var(--border, #e5e7eb); border-radius: 10px; padding: 4px; }
      .ae-tabs button { flex: 1; border: 0; background: transparent; font: inherit; font-size: 13.5px; font-weight: 600;
                        color: var(--text-secondary, #4a5568); padding: 8px; border-radius: 7px; cursor: pointer; }
      .ae-tabs button[aria-selected="true"] { background: var(--card-bg, #fff); color: var(--text-primary, #10151f); }
      .ae-pane { display: none; flex-direction: column; gap: 13px; }
      .ae-pane.on { display: flex; }

      .ae-field label { display: block; font-size: 12.5px; color: var(--text-secondary, #7b869a); margin-bottom: 5px; }
      .ae-field .opt { color: var(--text-secondary, #9aa5bb); }
      .ae-field input, .ae-modal textarea { width: 100%; padding: 10px 12px; font: inherit; border: 1px solid var(--border, #e5e7eb);
                                            border-radius: 9px; background: var(--bg-secondary, #f7f9fc); color: inherit; }
      .ae-field input.code { letter-spacing: .3em; font-size: 18px; text-align: center; }
      .ae-field .hint { font-size: 12px; color: var(--text-secondary, #7b869a); margin-top: 5px; }
      .ae-step { font-size: 13px; color: var(--primary, #1c5fd6); font-weight: 600; }
      .ae-step.wait::after { content: " …"; }
      .ae-sub { font-size: 12.5px; color: var(--text-secondary, #7b869a); margin-bottom: 5px; }
      .ae-drop { display: flex; flex-direction: column; align-items: center; gap: 4px;
                 border: 1.5px dashed var(--border, #e5e7eb); border-radius: 12px; padding: 26px 18px;
                 text-align: center; background: var(--bg-secondary, #f7f9fc); cursor: pointer;
                 transition: border-color .15s, background .15s; }
      .ae-drop:hover { border-color: var(--primary, #1c5fd6); background: rgba(28,95,214,.04); }
      .ae-drop-ic { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center;
                    background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); margin-bottom: 4px; }
      .ae-drop-ic svg { width: 21px; height: 21px; color: var(--primary, #1c5fd6); }
      .ae-drop .big { font-weight: 600; font-size: 14.5px; }
      .ae-drop .small { font-size: 12.5px; color: var(--text-secondary, #7b869a); line-height: 1.45; max-width: 380px; }

      /* Редкие способы — под раскрывающейся строкой. */
      .ae-more { border: 1px solid var(--border, #e5e7eb); border-radius: 10px; overflow: hidden; }
      .ae-more > summary { list-style: none; cursor: pointer; padding: 11px 14px; font-size: 13.5px;
                           font-weight: 600; color: var(--text-secondary, #4a5568); display: flex; align-items: center; gap: 8px; }
      .ae-more > summary::-webkit-details-marker { display: none; }
      .ae-more > summary::before { content: ""; width: 7px; height: 7px; flex: none; transform: rotate(45deg);
                                   border-right: 1.8px solid currentColor; border-bottom: 1.8px solid currentColor;
                                   transition: transform .15s; margin-left: 2px; }
      .ae-more[open] > summary { color: var(--text-primary, #10151f); border-bottom: 1px solid var(--border-light, #eef1f6); }
      .ae-more[open] > summary::before { transform: rotate(-135deg); }
      .ae-more > *:not(summary) { margin: 12px 14px; }
      .ae-more textarea { width: calc(100% - 28px); }
      .ae-agree { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--text-secondary, #4a5568); cursor: pointer; }
      .ae-agree input { margin-top: 3px; width: 16px; height: 16px; }

      .ae-toasts { position: fixed; right: 16px; bottom: 16px; z-index: 1100; display: flex; flex-direction: column;
                   gap: 8px; width: min(370px, calc(100vw - 32px)); }
      .ae-toast { display: flex; gap: 10px; align-items: flex-start; background: var(--card-bg, #fff);
                  border: 1px solid var(--border, #e5e7eb); border-left-width: 3px; border-radius: 10px;
                  padding: 10px 12px; box-shadow: 0 10px 30px -12px rgba(0,0,0,.35); font-size: 13.5px; }
      .ae-toast.ae-ok { border-left-color: #0f7a3d; } .ae-toast.ae-ok .ic { color: #0f7a3d; }
      .ae-toast.ae-err { border-left-color: #b0243a; } .ae-toast.ae-err .ic { color: #b0243a; }
      .ae-toast.ae-warn { border-left-color: #9a5b00; } .ae-toast.ae-warn .ic { color: #9a5b00; }
      .ae-toast.ae-info { border-left-color: #1c5fd6; } .ae-toast.ae-info .ic { color: #1c5fd6; }
      .ae-toast .tt { font-weight: 650; }
      .ae-toast .ds { font-size: 12.5px; color: var(--text-secondary, #7b869a); margin-top: 1px; }
      .ae-toast .x { margin-left: auto; border: 0; background: none; font-size: 15px; cursor: pointer; color: var(--text-secondary, #7b869a); }

      @media (max-width: 760px) {
        .ae-stats { grid-template-columns: repeat(2, 1fr); }
        .ae-row-main { grid-template-columns: 1fr auto; }
        .ae-row-main .money { grid-column: 1 / -1; display: flex; gap: 8px; text-align: left; }
        .ae-toasts { left: 10px; right: 10px; bottom: 10px; width: auto; }
        .ae-veil { padding: 0; place-items: end stretch; }
        .ae-modal { border-radius: 16px 16px 0 0; width: 100%; max-height: 92vh; }
        .ae-grip { display: block; width: 38px; height: 4px; border-radius: 3px; background: var(--border, #e5e7eb); margin: 10px auto 2px; }
        .ae-modal footer { position: sticky; bottom: 0; background: var(--card-bg, #fff); padding: 12px 16px; border-top: 1px solid var(--border-light, #eef1f6); }
        .ae-modal footer .ae-btn { flex: 1; padding: 12px; }
      }
      @media (max-width: 380px) { .ae-stats { grid-template-columns: 1fr } }
    `;
    document.head.appendChild(st);
  }

  app.innerHTML = `
  <div class="app-layout">
  ${renderSidebar('tools')}
  <main class="main-content">
    <div class="page-header ae-head">
      ${renderHamburger()}
      <div class="page-header-text">
        <a class="ae-back" id="aeBack">${esc(T('ae_back', 'Tools'))}</a>
        <h1>${esc(T('ae_title', 'Telegram Web Worker'))}</h1>
        <p>${esc(T('ae_sub', 'Your accounts work on our servers and earn money.'))}</p>
      </div>
      <button class="ae-btn" id="aeAddBtn">${esc(T('ae_btn_add', 'Add accounts'))}</button>
    </div>
    <div class="page-content"><div id="aeBody"><div class="ae-load">…</div></div></div>
  </main>
  </div>
  <div class="ae-toasts" id="aeToasts" aria-live="polite"></div>`;

  const body = document.getElementById('aeBody');
  let состояние = null;
  let данные = null;
  let фильтр = 'all';
  let опрос = null;
  let поиск = '';
  let страница = [];          // то, что уже подгружено
  let ещёЕсть = false;        // есть ли что подгружать
  let грузим = false;         // чтобы не запросить одно и то же дважды
  const НА_СТРАНИЦЕ = 50;

  // ── Уведомления ──────────────────────────────────────────────────────
  const ЗНАЧКИ = { ok: '✓', err: '✕', warn: '!', info: 'i' };
  function toast(тип, заголовок, текст, живёт = 6000) {
    const box = document.getElementById('aeToasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'ae-toast ae-' + тип;
    el.innerHTML = `<span class="ic">${ЗНАЧКИ[тип] || 'i'}</span>
      <div class="tx"><div class="tt">${esc(заголовок)}</div>${текст ? `<div class="ds">${esc(текст)}</div>` : ''}</div>
      <button class="x" aria-label="close">×</button>`;
    el.querySelector('.x').onclick = () => el.remove();
    box.appendChild(el);
    if (живёт) setTimeout(() => el.remove(), живёт);
  }

  // Запрос к разделу. Общий API.request отдаёт только код ошибки, а нам нужны
  // и код (чтобы перевести), и числа из ответа (сколько мест осталось,
  // сколько заданий не хватает) — поэтому свой тонкий вызов.
  async function зов(метод, путь, тело) {
    const о = { method: метод, headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' };
    if (тело) о.body = JSON.stringify(тело);
    let о2;
    try {
      о2 = await fetch('/api' + путь, о);
    } catch (сбой) {
      // До сервера не достучались: связь оборвалась или он занят.
      const e = new Error('offline'); e.сеть = true; throw e;
    }
    const д = await о2.json().catch(() => ({}));
    if (!о2.ok) {
      const e = new Error(д.error || 'error');
      e.код = д.error; e.тело = д;
      // Пятисотые и «сервис занят» — то же самое для человека: не дошло,
      // попробуйте ещё раз.
      if (о2.status >= 500 && !д.message) e.сеть = true;
      throw e;
    }
    return д;
  }

  // Файлы идут отдельным вызовом: заголовок Content-Type для них ставит сам
  // браузер — вместе с границей между файлами. Своим его перебивать нельзя.
  async function зовФайлы(путь, fd) {
    let о;
    try {
      о = await fetch('/api' + путь, { method: 'POST', body: fd, credentials: 'same-origin' });
    } catch (сбой) {
      const e = new Error('offline'); e.сеть = true; throw e;
    }
    const д = await о.json().catch(() => ({}));
    if (!о.ok) {
      const e = new Error(д.error || 'error');
      e.код = д.error; e.тело = д;
      if (о.status >= 500 && !д.message) e.сеть = true;
      throw e;
    }
    return д;
  }

  // Ошибки переводим на языке человека. Сервер присылает код и русский текст;
  // код даёт перевод, текст — запасной вариант, если ключа ещё нет.
  const ОШИБКИ = {
    consent_required: ['ae_err_consent'],
    bad_phone: ['ae_err_phone'],
    bad_code: ['ae_err_code'],
    bad_password: ['ae_err_password'],
    limit_reached: ['ae_err_limit', (д, с) => ({ max: (с || {}).max_per_user || '' })],
    not_enough_tasks: ['ae_err_min_tasks', (д, с) => ({ tasks: (с || {}).min_tasks || '', have: (с || {}).my_tasks || 0 })],
    taken: ['ae_err_taken'],
    already_yours: ['ae_err_already'],
    autoearn_disabled: ['ae_err_disabled'],
    user_blocked: ['ae_err_blocked'],
    nothing_to_add: ['ae_err_nothing'],
    queue_full: ['ae_err_queue'],
    too_often: ['ae_err_often'],
    wrong_step: ['ae_err_step'],
    not_found: ['ae_err_gone'],
    still_working: ['ae_err_still_working'],
    cannot_cancel: ['ae_err_step'],
  };
  const ошибка = (e) => {
    // Сервер не ответил вовсе: сеть, перезапуск, всплеск нагрузки. Это не
    // ошибка человека, и говорить надо именно так — с предложением повторить.
    if (e && e.сеть) {
      toast('err', T('ae_err_offline', 'The server did not respond'),
        T('ae_err_offline_sub', 'The attempt did not go through. Please try again in a few seconds.'), 8000);
      return;
    }
    const код = (e && e.код) || '';
    const правило = ОШИБКИ[код];
    let текст = (e && e.тело && e.тело.message) || (e && e.message) || '';
    if (правило) {
      const шаблон = T(правило[0], '');
      if (шаблон) текст = правило[1] ? F(шаблон, правило[1](e.тело, состояние)) : шаблон;
    }
    toast('err', текст || T('ae_err_generic', 'Something did not go through.'));
  };

  // ── Загрузка ─────────────────────────────────────────────────────────
  // Запрос списка: отбор, поиск и страница считаются на сервере.
  const адресСписка = (сдвиг) => '/autoearn/accounts?limit=' + НА_СТРАНИЦЕ
    + '&offset=' + сдвиг
    + (фильтр !== 'all' ? '&filter=' + фильтр : '')
    + (поиск ? '&q=' + encodeURIComponent(поиск) : '');

  async function загрузить() {
    try {
      const [st, acc] = await Promise.all([
        зов('GET', '/autoearn/status'),
        зов('GET', адресСписка(0)),
      ]);
      состояние = st || {};
      данные = acc || {};
      страница = (acc && acc.accounts) || [];
      ещёЕсть = !!(acc && acc.page && acc.page.has_more);
      рисовать();
    } catch (e) {
      // Связь пропала — показываем последнее, что знали: заработок идёт на
      // нашей стороне и от браузера не зависит.
      if (данные) toast('warn', T('ae_toast_offline', 'No connection to the server'),
        T('ae_toast_offline_sub', 'Showing the latest data.'));
      else body.innerHTML = `<div class="ae-empty">${esc(T('ae_err_generic', 'Something did not go through.'))}</div>`;
    }
  }

  // Какие карточки человек раскрыл и где он на странице: обновление списка
  // не должно ни закрывать их, ни уводить прокрутку.
  const раскрытые = new Set();

  // Следующая часть списка. Ничего не перерисовываем целиком — дописываем
  // карточки в конец, чтобы страница не дёргалась под руками.
  async function подгрузить() {
    if (грузим || !ещёЕсть) return;
    грузим = true;
    const кнопка = document.getElementById('aeMore');
    if (кнопка) { кнопка.disabled = true; кнопка.textContent = T('ae_loading', 'Loading…'); }
    try {
      const порция = await зов('GET', адресСписка(страница.length));
      страница = страница.concat((порция && порция.accounts) || []);
      ещёЕсть = !!(порция && порция.page && порция.page.has_more);
      данные = Object.assign({}, данные, { accounts: страница, page: порция && порция.page });
      рисовать();
    } catch (e) { ошибка(e); }
    finally { грузим = false; }
  }

  // ── Разметка ─────────────────────────────────────────────────────────
  function рисовать() {
    const место = window.scrollY || null;
    const с = состояние || {};
    const св = (данные && данные.summary) || {};
    const список = (данные && данные.accounts) || [];
    const ур = с.levels || null;

    const плитки = `
      <div class="ae-stats">
        <div class="ae-stat">
          <div class="k">${esc(T('ae_stat_accounts', 'Accounts'))}</div>
          <div class="v">${число(св.total)}</div>
          <div class="s">${esc(F(T('ae_stat_accounts_sub', '{working} working · {attention} need attention'),
            { working: (данные.counts && данные.counts.working) || св.working || 0,
              attention: (данные.counts && данные.counts.attention) || 0 }))}</div>
        </div>
        <div class="ae-stat earn">
          <div class="k">${esc(T('ae_stat_earned', 'Earned in total'))}</div>
          <div class="v">${деньги(св.earned)}</div>
          <div class="s">${(данные && данные.days)
            ? esc(F(T('ae_stat_earned_sub', 'over {days} days'), { days: данные.days }))
            : esc(F(T('ae_stat_earned_tasks', '{tasks} actions done'), { tasks: число(св.tasks) }))}</div>
        </div>
        <div class="ae-stat">
          <div class="k">${esc(T('ae_stat_today', 'Today'))}</div>
          <div class="v">${деньги(св.earned_today || 0)}</div>
          <div class="s">${esc(F(T('ae_stat_today_sub', 'paid out every {minutes} minutes'),
            { minutes: с.payout_minutes || 15 }))}</div>
        </div>
        ${ур ? `<div class="ae-stat">
          <div class="k">${esc(T('ae_stat_level', 'Your level'))}</div>
          <div class="v">${ур.current_index} <span class="ae-badge">${esc(F(T('ae_stat_level_share', '{share}% share'), { share: ур.current_share }))}</span></div>
          <div class="s">${ур.next_share
            ? esc(F(T('ae_stat_level_next', 'to {share}% — {tasks} more tasks'),
                { tasks: число(ур.tasks_to_next), share: ур.next_share }))
            : esc(T('ae_stat_level_top', 'top level reached'))}</div>
        </div>` : ''}
      </div>`;

    // Заработок по дням. Ломаная нагляднее любой таблицы: видно, растёт ли
    // доход, и не оборвался ли он вчера.
    const график = (() => {
      const дни = (данные && данные.daily) || [];
      if (дни.length < 2) return '';
      // Пока заработка не было, график — пустая рамка на пол-экрана.
      // Показываем его, когда есть что показывать.
      if (!дни.some((d) => d.earned > 0)) return '';
      const Ш = 900, В = 150, отступ = 10;
      const макс = Math.max(...дни.map((d) => d.earned), 0.0001);
      const точки = дни.map((d, i) => {
        const x = отступ + i * ((Ш - отступ * 2) / (дни.length - 1));
        const y = В - отступ - (d.earned / макс) * (В - отступ * 2);
        return [x, y];
      });
      const линия = точки.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
      const заливка = линия + ` L${точки[точки.length - 1][0].toFixed(1)} ${В} L${точки[0][0].toFixed(1)} ${В} Z`;
      const последняя = точки[точки.length - 1];
      return `
      <div class="ae-panel ae-chart">
        <h2>${esc(T('ae_chart_title', 'Earnings by day'))}
          <small>${esc(T('ae_chart_sub', 'last 14 days'))}</small></h2>
        <svg viewBox="0 0 ${Ш} ${В}" preserveAspectRatio="none" role="img"
             aria-label="${esc(T('ae_chart_title', 'Earnings by day'))}">
          <defs><linearGradient id="aeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0f7a3d" stop-opacity=".18"/>
            <stop offset="1" stop-color="#0f7a3d" stop-opacity="0"/>
          </linearGradient></defs>
          <path d="${заливка}" fill="url(#aeFill)"/>
          <path d="${линия}" fill="none" stroke="#0f7a3d" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <circle cx="${последняя[0].toFixed(1)}" cy="${последняя[1].toFixed(1)}" r="3.5" fill="#0f7a3d"/>
        </svg>
      </div>`;
    })();

    const ставки = (с.rates && с.rates.length) ? `
      <div class="ae-panel">
        <h2>${esc(T('ae_rates_title', 'Rates per 1000 actions'))}</h2>
        <div class="ae-scroll"><table class="ae-table">
          <thead><tr>
            <th>${esc(T('ae_rates_task', 'Task'))}</th>
            <th class="r">${esc(T('ae_rates_per1k', 'Per 1000'))}</th>
            <th class="r">${esc(T('ae_rates_yours', 'Your share'))}</th>
          </tr></thead>
          <tbody>${с.rates.map((r) => `<tr>
            <td>${esc(T('ae_task_' + r.action, r.action))}</td>
            <td class="r">${r.min === r.max ? деньги(r.min) : деньги(r.min) + ' – ' + деньги(r.max)}</td>
            <td class="r ok">${r.min === r.max ? деньги(r.min * (ур ? ур.current_share : 50) / 100)
              : деньги(r.min * (ур ? ур.current_share : 50) / 100) + ' – ' + деньги(r.max * (ур ? ур.current_share : 50) / 100)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div class="ae-note">${esc(T('ae_rates_note', 'Accounts take whatever tasks are in the queue.'))}</div>
      </div>` : '';

    const лестница = ур ? (() => {
      const шаг = ур.steps[ур.current_index - 1] || { tasks: 0 };
      const следующий = ур.steps[ур.current_index] || null;
      const сделано = Number(с.my_tasks) || 0;
      const низ = Number(шаг.tasks) || 0;
      const верх = следующий ? Number(следующий.tasks) || 0 : 0;
      const доля = следующий && верх > низ
        ? Math.max(3, Math.min(100, Math.round((сделано - низ) / (верх - низ) * 100)))
        : 100;

      return `
      <div class="ae-panel ae-share">
        <h2>${esc(T('ae_levels_title', 'Your share'))}
          <small>${esc(T('ae_levels_sub', 'counted across all your tasks on the site'))}</small></h2>
        <div class="ae-scroll"><table class="ae-table">
          <thead><tr>
            <th>${esc(T('ae_levels_level', 'Level'))}</th>
            <th class="r">${esc(T('ae_levels_tasks', 'Tasks'))}</th>
            <th class="r">${esc(T('ae_levels_yours', 'You get'))}</th>
          </tr></thead>
          <tbody>${ур.steps.map((s2, i) => `<tr class="${i + 1 === ур.current_index ? 'now' : ''}">
            <td>${i + 1 === ур.current_index ? '<i class="ae-here"></i>' : ''}${i + 1}</td>
            <td class="r">${s2.tasks
              ? esc(F(T('ae_levels_from', 'from {tasks}'), { tasks: число(s2.tasks) }))
              : esc(F(T('ae_levels_upto', 'up to {tasks}'), { tasks: число((ур.steps[1] || {}).tasks || 0) }))}</td>
            <td class="r">${s2.share}%</td>
          </tr>`).join('')}</tbody>
        </table></div>
        ${следующий ? `<div class="ae-share-foot">
          <div class="ae-share-next">${esc(F(T('ae_levels_progress', 'To level {level} — {tasks} tasks'),
            { level: ур.current_index + 1, tasks: число(ур.tasks_to_next) }))}</div>
          <div class="ae-bar"><i style="width:${доля}%"></i></div>
        </div>` : `<div class="ae-share-foot">
          <div class="ae-share-next">${esc(T('ae_share_max', 'This is the highest share.'))}</div>
        </div>`}
      </div>`;
    })() : '';

    // Счётчики приходят с сервера: они считаются по всем аккаунтам, а не по
    // той части, что успела подгрузиться.
    const счёт = (данные && данные.counts) || { all: список.length, working: 0, attention: 0 };
    const видимые = список;

    body.innerHTML = плитки
      + график
      + `<div class="ae-cols">${ставки}${лестница}</div>`
      + `<div class="ae-list-head">
           <h2>${esc(T('ae_list_title', 'My accounts'))}</h2>
           <div class="ae-filters">
             ${(счёт.all > 12 || поиск) ? `<input class="ae-search" id="aeSearch" type="search"
               placeholder="${esc(T('ae_search', 'Search by number or name'))}" value="${esc(поиск)}">` : ''}
             ${[['all', T('ae_filter_all', 'All')], ['working', T('ae_filter_working', 'Working')],
                ['attention', T('ae_filter_attention', 'Need attention')]]
               .map(([k, l]) => `<button class="ae-chip" data-f="${k}" aria-pressed="${фильтр === k}">${esc(l)} ${счёт[k]}</button>`).join('')}
           </div>
         </div>`
      + (видимые.length
          ? `<div class="ae-rows">${видимые.map(строка).join('')}</div>`
            + (ещёЕсть ? `<button class="ae-btn ghost ae-more" id="aeMore">${esc(
                F(T('ae_more', 'Show more ({left})'),
                  { left: число(((данные.page && данные.page.total) || 0) - видимые.length) }))}</button>` : '')
          : `<div class="ae-empty"><b>${esc(T('ae_empty_title', 'No accounts connected yet'))}</b><br>
               ${esc(T('ae_empty_text', 'Connect your Telegram account and it will start earning within minutes.'))}</div>`);

    const кнопка = document.getElementById('aeAddBtn');
    if (кнопка) { кнопка.disabled = !(с.enabled && с.allowed); кнопка.onclick = открытьОкно; }
    const назад = document.getElementById('aeBack');
    if (назад) назад.onclick = () => Router.navigate('/tools');

    if (с.enabled && !с.allowed) {
      body.insertAdjacentHTML('afterbegin',
        `<div class="ae-warn">${esc(F(T('ae_err_min_tasks',
          'This section opens after {tasks} completed tasks on the site. You have {have}.'),
          { tasks: с.min_tasks, have: с.my_tasks }))}</div>`);
    }
    if (!с.enabled) {
      body.insertAdjacentHTML('afterbegin',
        `<div class="ae-warn">${esc(T('ae_err_disabled', 'The section is temporarily closed.'))}</div>`);
    }

    // Возвращаем раскрытые карточки и место на странице.
    //
    // Список обновляется сам раз в минуту. Без этого раскрытая карточка
    // схлопывалась прямо под руками, а страница прыгала к началу — читать
    // что-либо становилось невозможно.
    раскрытые.forEach((id) => {
      const р = body.querySelector(`.ae-row[data-id="${id}"]`);
      if (р) р.classList.add('open');
    });
    if (место != null) window.scrollTo({ top: место });

    // Отбор меняется на сервере: список перезапрашивается с первой страницы.
    body.querySelectorAll('.ae-chip').forEach((c) => c.onclick = async () => {
      фильтр = c.dataset.f;
      await загрузить();
    });

    const кнопкаЕщё = document.getElementById('aeMore');
    if (кнопкаЕщё) кнопкаЕщё.onclick = подгрузить;

    // Поиск ждёт, пока человек допечатает: запрос на каждую букву не нужен.
    const поле = document.getElementById('aeSearch');
    if (поле) {
      поле.oninput = () => {
        clearTimeout(поле._таймер);
        поле._таймер = setTimeout(async () => {
          поиск = поле.value.trim();
          await загрузить();
          const п = document.getElementById('aeSearch');
          if (п) { п.focus(); п.setSelectionRange(п.value.length, п.value.length); }
        }, 400);
      };
    }
    body.querySelectorAll('.ae-row-main').forEach((r) => r.onclick = async () => {
      const строка = r.parentElement;
      строка.classList.toggle('open');
      const id = строка.dataset.id;
      if (!строка.classList.contains('open')) { раскрытые.delete(id); return; }
      раскрытые.add(id);

      // Подробности и разбивку заработка спрашиваем в этот момент, а не для
      // всего списка сразу: при пятистах аккаунтах это была бы половина
      // мегабайта на каждое обновление страницы.
      const карточка = страница.find((x) => String(x.id) === String(id));
      if (!карточка || карточка._подробно) return;
      try {
        const полная = await зов('GET', `/autoearn/accounts/${id}`);
        if (полная && полная.account) {
          Object.assign(карточка, полная.account, { _подробно: true });
          рисовать();
        }
      } catch { /* не дочитали — карточка останется краткой */ }
    });
    body.querySelectorAll('[data-act]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); действие(b.dataset.act, b.dataset.id); });
  }

  // Одна строка списка вместе с раскрытой карточкой.
  function строка(a) {
    const чек = a.check || {};
    const тон = { live: 'ok', new: 'check', checking: 'check', warming: 'check', needs_login: 'warn',
                  rejected: 'bad', dead: 'bad', paused: 'idle', withdrawn: 'idle' }[a.status] || 'idle';
    const факт = (k, v) => v == null || v === '' ? '' :
      `<div class="ae-fact"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`;

    // Что это за состояние по сути: работает, ждёт проверки, или всё кончилось.
    const работает = ['live', 'warming', 'paused', 'needs_login'].includes(a.status);
    const кончилось = ['rejected', 'dead', 'withdrawn'].includes(a.status);

    const разбивка = (работает && a.breakdown && a.breakdown.length) ? `
      <div class="ae-did">
        <h4>${esc(T('ae_did_title', 'What the account did'))}</h4>
        <div class="ae-did-rows">
          ${a.breakdown.map((b) => `<div class="ae-did-row">
            <span class="nm">${esc(T('ae_task_' + b.action, b.action))}</span>
            <span class="cnt">${число(b.done)}</span>
            <span class="sum">${деньги(b.earned)}</span></div>`).join('')}
          <div class="ae-did-row total"><span class="nm">${esc(T('ae_did_total', 'Total'))}</span>
            <span class="cnt">${число(a.tasks_total)}</span><span class="sum">${деньги(a.earned)}</span></div>
        </div>
      </div>` : '';

    // Подробности об аккаунте нужны, только когда он в работе: пока идёт
    // проверка, их ещё нет, а после отказа они уже ничего не значат.
    const факты = работает ? `
      <div class="ae-facts">
        ${факт(T('ae_f_country', 'Country'), a.country)}
        ${факт(T('ae_f_activity', 'Last activity'), чек.last_activity)}
        ${факт(T('ae_f_premium', 'Telegram Premium'), чек.premium == null ? null : (чек.premium ? T('ae_f_yes', 'Yes') : T('ae_f_no', 'No')))}
        ${факт(T('ae_f_password', 'Cloud password'), чек.has_password == null ? null : (чек.has_password ? T('ae_f_password_yours', 'Set by you') : T('ae_f_password_none', 'Not set')))}
        ${факт(T('ae_f_channels', 'Channels'), чек.channels)}
        ${факт(T('ae_f_groups', 'Groups'), чек.groups)}
        ${факт(T('ae_f_chats', 'Chats'), чек.dialogs)}
        ${факт(T('ae_f_limits', 'Telegram limits'), чек.spam_block_until || T('ae_f_none', 'None'))}
        ${факт(T('ae_f_share', 'Your share'), a.share_pct ? a.share_pct + '%' : null)}
      </div>` : '';

    // Действия — только те, что в этом состоянии имеют смысл. У отказа одно:
    // убрать из списка. У того, что проверяется, — ни одного: трогать аккаунт
    // посреди проверки нельзя.
    const кнопки = [];
    if (работает) {
      if (a.can_pause) кнопки.push(['pause', T('ae_act_pause', 'Stop'), 'main']);
      if (a.status === 'paused') кнопки.push(['resume', T('ae_act_resume', 'Resume'), 'main']);
      if (a.status === 'needs_login') кнопки.push(['relogin', T('ae_act_relogin', 'Sign in again'), 'main']);
      if (a.can_withdraw) кнопки.push(['withdraw', T('ae_act_withdraw', 'Disconnect')]);
      if (a.can_download) кнопки.push(['download', T('ae_act_download', 'Download')]);
    } else if (кончилось) {
      // Аккаунт человека остаётся его аккаунтом, даже когда Telegram его
      // заблокировал: забрать свои данные он вправе, и до того, как уберёт
      // карточку из списка, — тем более.
      if (a.can_download) кнопки.push(['download', T('ae_act_download', 'Download')]);
      кнопки.push(['remove', T('ae_act_remove', 'Remove from list'), 'main']);
    }

    return `<div class="ae-row" data-id="${a.id}">
      <div class="ae-row-main">
        <div class="who">
          <div class="t">
            <div class="n">${esc(a.phone || a.name || '#' + a.id)}</div>
            <div class="m">${esc([a.username ? '@' + a.username : '', a.country || ''].filter(Boolean).join(' · '))}</div>
          </div>
        </div>
        <div class="money">
          <div class="v">${a.earned ? деньги(a.earned) : '—'}</div>
          <div class="s">${a.tasks_total ? число(a.tasks_total) : ''}</div>
        </div>
        <span class="ae-state ae-st-${тон}"><i class="dot"></i>${esc(T('ae_status_' + a.status, a.status_label || a.status))}</span>
      </div>
      <div class="ae-detail">
        <div class="ae-note ${тон === 'bad' ? 'bad' : тон === 'warn' ? 'warn' : ''}">${esc(пояснение(a))}</div>
        ${факты || разбивка ? `<div class="ae-detail-cols">${факты}${разбивка}</div>` : ''}
        ${кнопки.length || (работает && a.lock_hours_left) ? `<div class="ae-acts">
          ${кнопки.map(([k, l, вид]) => `<button class="ae-btn ${вид === 'main' ? '' : 'ghost'} sm"
            data-act="${k}" data-id="${a.id}">${esc(l)}</button>`).join('')}
          ${работает && a.lock_hours_left ? `<span class="ae-lock">${esc(F(T('ae_lock_left', 'You can stop the account in {hours} h'), { hours: a.lock_hours_left }))}</span>` : ''}
        </div>` : ''}
      </div>
    </div>`;
  }

  // ── Действия над аккаунтом ───────────────────────────────────────────
  async function действие(что, id) {
    try {
      if (что === 'pause') {
        await зов('POST', `/autoearn/accounts/${id}/pause`);
        toast('info', T('ae_toast_paused', 'Account is stopping'), T('ae_toast_paused_sub', ''));
      } else if (что === 'resume') {
        await зов('POST', `/autoearn/accounts/${id}/resume`);
        toast('ok', T('ae_toast_resumed', 'Account is working again'));
      } else if (что === 'withdraw') {
        await зов('POST', `/autoearn/accounts/${id}/withdraw`);
        toast('warn', T('ae_toast_withdrawn', 'Account removed from work'), T('ae_toast_withdrawn_sub', ''));
      } else if (что === 'remove') {
        await зов('POST', `/autoearn/accounts/${id}/remove`);
      } else if (что === 'download') {
        // Файл отдаёт сервер — уводим на него отдельным окном, чтобы не
        // ломать страницу, если браузер откроет содержимое вместо загрузки.
        window.open('/api/autoearn/accounts/' + id + '/download', '_blank');
        return;
      } else if (что === 'relogin') {
        // Человек вернулся входить заново — сразу показываем поле номера,
        // а не заставляем искать его под строкой.
        открытьОкно();
        const т = document.getElementById('aeMorePhone');
        if (т) { т.open = true; т.scrollIntoView({ block: 'nearest' }); }
        const п = document.getElementById('aePhone');
        if (п) п.focus();
        return;
      }
      await загрузить();
    } catch (e) { ошибка(e); }
  }

  // ── Окно подключения ─────────────────────────────────────────────────
  let заявка = null;

  function открытьОкно() {
    const с = состояние || {};
    const окно = document.createElement('div');
    окно.className = 'ae-veil';
    окно.id = 'aeVeil';
    окно.innerHTML = `
      <div class="ae-modal" role="dialog" aria-modal="true">
        <div class="ae-grip"></div>
        <header>
          <h3>${esc(T('ae_add_title', 'Connect accounts'))}</h3>
          <div class="sub">${esc(F(T('ae_add_slots', 'Slots left: {left} of {max}'),
            { left: с.slots_left != null ? с.slots_left : '', max: с.max_per_user || '' }))}</div>
        </header>
        <div class="ae-modal-body">
          <label class="ae-drop">
            <input type="file" id="aeFiles" multiple hidden>
            <span class="ae-drop-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 16V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/>
                <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
            </span>
            <span class="big">${esc(T('ae_file_drop', 'Drag files here or click to choose'))}</span>
            <span class="small">${T('ae_file_types', '')}</span>
          </label>
          <div id="aeFileList"></div>

          <details class="ae-more" id="aeMorePhone">
            <summary>${esc(T('ae_tab_phone', 'By phone number'))}</summary>
            <div class="ae-field" id="aeFPhone">
              <label>${esc(T('ae_phone_label', 'Account phone number'))}</label>
              <input type="tel" id="aePhone" inputmode="tel" placeholder="+1 234 567 89 01">
              <div class="hint">${esc(T('ae_phone_hint', 'The same number you use to sign in to Telegram.'))}</div>
            </div>
            <div class="ae-field" id="aeFCode" hidden>
              <label>${esc(T('ae_code_label', 'Code from Telegram'))}</label>
              <input class="code" id="aeCode" inputmode="numeric" maxlength="7">
              <div class="hint" id="aeCodeHint">${esc(T('ae_code_hint', 'The code arrives inside Telegram.'))}</div>
              <div class="hint"><button class="ae-resend" id="aeResend">${esc(T('ae_code_resend', 'Send again'))}</button></div>
            </div>
            <div class="ae-field" id="aeFPass" hidden>
              <label>${esc(T('ae_pass_label', 'Cloud password'))} <span class="opt">${esc(T('ae_pass_optional', 'optional'))}</span></label>
              <input type="password" id="aePass" autocomplete="off" placeholder="${esc(T('ae_pass_placeholder', ''))}">
              <div class="hint">${esc(T('ae_pass_hint', ''))}</div>
            </div>
            <div class="ae-step" id="aeStep" hidden></div>
          </details>

          <details class="ae-more" id="aeMoreText">
            <summary>${esc(T('ae_file_text', 'Or paste session strings — one per line'))}</summary>
            <textarea id="aeSessions" rows="3" placeholder="1BQ..."></textarea>
          </details>

          <details class="ae-more" id="aeMorePass">
            <summary>${esc(T('ae_tdata_pass_title', 'Password for the tdata folder'))}</summary>
            <div class="ae-field">
              <input type="password" id="aeTdataPass" autocomplete="off"
                placeholder="${esc(T('ae_tdata_pass_ph', 'Only if the folder is locked'))}">
              <div class="hint">${esc(T('ae_tdata_pass_hint',
                'This is the passcode Telegram Desktop asks for at startup. It is used once, to open the folder, and is not stored.'))}</div>
            </div>
          </details>

          <label class="ae-agree">
            <input type="checkbox" id="aeConsent">
            <span>${esc(T('ae_consent', ''))}</span>
          </label>
        </div>
        <footer>
          <button class="ae-btn ghost" id="aeCancel">${esc(T('ae_btn_cancel', 'Cancel'))}</button>
          <button class="ae-btn" id="aeGo">${esc(T('ae_btn_connect', 'Connect account'))}</button>
        </footer>
      </div>`;
    document.body.appendChild(окно);

    окно.onclick = (e) => { if (e.target === окно) закрытьОкно(); };
    окно.querySelector('#aeCancel').onclick = закрытьОкно;
    окно.querySelector('#aeGo').onclick = подключить;
    // Кнопка называется тем, что она сделает: отправит файлы или начнёт вход.
    const подписьКнопки = () => {
      окно.querySelector('#aeGo').textContent = вкладка() === 'phone'
        ? T('ae_btn_connect', 'Connect account') : T('ae_btn_send', 'Send for checking');
    };
    подписьКнопки();

    // Открыт может быть только один дополнительный способ: два сразу сбивают
    // с толку — непонятно, что произойдёт по кнопке.
    // Пароль от папки — не отдельный способ подключения, а уточнение к
    // файлам: он не должен закрывать строку с вводом по номеру и наоборот.
    const оба = [окно.querySelector('#aeMoreText'), окно.querySelector('#aeMorePhone')];
    оба.forEach((д) => д.addEventListener('toggle', () => {
      if (д.open) оба.forEach((x) => { if (x !== д) x.open = false; });
      подписьКнопки();
    }));
    // Enter в поле — то же, что нажать кнопку: люди вводят код и жмут Enter,
    // не глядя вниз.
    ['#aePhone', '#aeCode', '#aePass'].forEach((sel) => {
      const п = окно.querySelector(sel);
      if (п) п.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); подключить(); } };
    });

    // Код не пришёл — обычная история: связь, чужой номер, задержка.
    // Кнопка отменяет текущую попытку и начинает заново.
    окно.querySelector('#aeResend').onclick = async () => {
      const b = окно.querySelector('#aeResend');
      b.disabled = true;
      try {
        if (заявка) { try { await зов('POST', `/autoearn/login/${заявка.id}/cancel`); } catch { /* уже нет — не беда */ } }
        заявка = null;
        if (опрос) { clearInterval(опрос); опрос = null; }
        окно.querySelector('#aeCode').value = '';
        await подключить();
        toast('info', T('ae_toast_code_sent', 'Code sent to Telegram'));
      } catch (e) { ошибка(e); }
      finally { setTimeout(() => { b.disabled = false; }, 20000); }
    };

    // Что именно человек выбрал — видно списком. Заодно сразу отсекаем то,
    // что программа всё равно не примет: чужие расширения и слишком тяжёлое.
    const ГОДНЫЕ = ['.txt', '.session', '.json', '.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.tdata', '.dat'];
    окно.querySelector('#aeFiles').onchange = (e) => {
      const файлы = Array.from(e.target.files || []);
      const пределМб = Number((состояние || {}).max_upload_mb) || 25;
      окно.querySelector('#aeFileList').innerHTML = файлы.length ? `<div class="ae-files">${файлы.map((f) => {
        const имя = String(f.name || '');
        const тотТип = ГОДНЫЕ.some((р) => имя.toLowerCase().endsWith(р));
        const влезает = f.size <= пределМб * 1024 * 1024;
        const мб = f.size / 1048576;
        const причина = тотТип ? (влезает ? '' : F(T('ae_file_too_big', 'over {mb} MB'), { mb: пределМб }))
                               : T('ae_file_wrong_type', 'not a supported file');
        return `<div class="ae-file ${причина ? 'bad' : ''}">
          <span class="nm">${esc(имя)}</span>
          ${причина ? `<span class="why">${esc(причина)}</span>` : ''}
          <span class="sz">${мб < 0.1 ? Math.round(f.size / 1024) + ' KB' : мб.toFixed(1) + ' MB'}</span></div>`;
      }).join('')}</div>` : '';
      const плохие = файлы.filter((f) => !ГОДНЫЕ.some((р) => String(f.name || '').toLowerCase().endsWith(р)));
      if (плохие.length) toast('warn', T('ae_err_file_type', 'Some files will be skipped'),
        плохие.slice(0, 3).map((f) => f.name).join(', '));
      const тяжёлые = файлы.filter((f) => f.size > пределМб * 1024 * 1024);
      if (тяжёлые.length) toast('warn', F(T('ae_err_file_size', 'Files over {mb} MB are skipped'), { mb: пределМб }));
    };
  }

  function закрытьОкно() {
    const о = document.getElementById('aeVeil');
    if (о) о.remove();
    if (опрос) { clearInterval(опрос); опрос = null; }
    заявка = null;
  }

  // Что человек делает прямо сейчас: раскрыл вход по номеру — значит номер,
  // всё остальное — файлы и строки.
  const вкладка = () => {
    const т = document.getElementById('aeMorePhone');
    return т && т.open ? 'phone' : 'file';
  };

  // Подключение: одна кнопка ведёт человека по всем шагам.
  async function подключить() {
    const о = document.getElementById('aeVeil');
    if (!о) return;
    const согласие = о.querySelector('#aeConsent').checked ? '1' : '';
    if (!согласие) return toast('err', T('ae_err_consent', 'Please confirm you accept the terms.'));

    const кнопка = о.querySelector('#aeGo');
    кнопка.disabled = true;
    try {
      if (вкладка() === 'file') {
        const fd = new FormData();
        fd.append('consent', '1');
        fd.append('sessions', о.querySelector('#aeSessions').value || '');
        const парольПапки = (о.querySelector('#aeTdataPass') || {}).value || '';
        if (парольПапки) fd.append('tdata_password', парольПапки);
        for (const f of (о.querySelector('#aeFiles').files || [])) fd.append('files', f);
        const r = await зовФайлы('/autoearn/upload', fd);
        toast('ok', T('ae_toast_connected', 'Account connected'), (r && r.message) || '');
        закрытьОкно(); await загрузить();
        return;
      }

      // Вход по номеру — по шагам.
      if (!заявка) {
        const r = await зов('POST', '/autoearn/login/start',
          { phone: о.querySelector('#aePhone').value, consent: '1' });
        заявка = r.login;
        шагВид();
        начатьОпрос();
      } else if (заявка.step === 'code_sent') {
        const r = await зов('POST', '/autoearn/login/code',
          { id: заявка.id, code: о.querySelector('#aeCode').value });
        заявка = r.login; шагВид();
      } else if (заявка.step === 'password') {
        const r = await зов('POST', '/autoearn/login/password',
          { id: заявка.id, password: о.querySelector('#aePass').value });
        заявка = r.login; шагВид();
      }
    } catch (e) { ошибка(e); }
    finally { кнопка.disabled = false; }
  }

  // Показ полей под текущий шаг.
  function шагВид() {
    const о = document.getElementById('aeVeil');
    if (!о || !заявка) return;
    const ш = заявка.step;
    о.querySelector('#aePhone').disabled = ш !== 'phone';
    о.querySelector('#aeFCode').hidden = !['code_sent', 'code'].includes(ш);
    о.querySelector('#aeFPass').hidden = !['password', 'password_sent'].includes(ш);
    const шаг = о.querySelector('#aeStep');
    шаг.hidden = false;
    шаг.textContent = T('ae_step_' + ш, заявка.label || '');
    шаг.className = 'ae-step' + (заявка.waiting ? ' wait' : '');
    if (заявка.hint) о.querySelector('#aeCodeHint').textContent = заявка.hint;
    if (заявка.error) toast('err', заявка.error);
    о.querySelector('#aeGo').disabled = !!заявка.waiting;
  }

  // Пока идёт вход, состояние спрашиваем сами: ответ приходит от программы,
  // а она отвечает не мгновенно.
  function начатьОпрос() {
    if (опрос) clearInterval(опрос);
    опрос = setInterval(async () => {
      if (!заявка) return;
      try {
        const r = await зов('GET', `/autoearn/login/${заявка.id}`);
        const было = заявка.step;
        заявка = r.login;
        if (заявка.step !== было) шагВид();
        if (заявка.step === 'done') {
          clearInterval(опрос); опрос = null;
          toast('ok', T('ae_toast_connected', 'Account connected'), T('ae_toast_connected_sub', ''));
          закрытьОкно(); await загрузить();
        }
        if (заявка.step === 'failed') { clearInterval(опрос); опрос = null; }
      } catch { /* сеть моргнула — спросим на следующем круге */ }
    }, 2500);
  }

  await загрузить();

  // Список обновляем сам, пока страница открыта: начисления приходят в фоне.
  const тик = setInterval(() => { if (document.getElementById('aeBody')) загрузить(); else clearInterval(тик); }, 60000);
});
