// Tools — official apps for earning. First tool: the Android app.
// Everything dynamic (rates, version, requirements, download link) comes from
// one cheap endpoint; while the download switch is off the page shows a
// “coming soon” button and no APK link exists anywhere in the DOM.
Router.register('tools', async (app) => {
  const esc = (s) => (typeof escHtml === 'function' ? escHtml(String(s == null ? '' : s)) : String(s == null ? '' : s));

  // Стили хаба кладутся один раз.
  if (!document.getElementById('tl2-styles')) {
    const st = document.createElement('style');
    st.id = 'tl2-styles';
    st.textContent = `
      .tl-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                gap: 18px; margin-bottom: 24px; align-items: stretch; }
      @media (max-width: 780px) { .tl-two { grid-template-columns: 1fr } }

      .tl-tool { background: var(--card-bg, #fff); border: 1.5px solid var(--border-light, #eef1f6);
                 border-radius: 14px; padding: 22px 24px; display: flex; flex-direction: column; gap: 18px;
                 cursor: pointer; transition: border-color .15s, box-shadow .15s;
                 box-shadow: 0 1px 2px rgba(16,21,31,.04), 0 10px 30px -22px rgba(16,21,31,.3); }
      .tl-tool:hover { border-color: rgba(47,85,212,.35); }
      /* Выбранная карточка обведена: видно, о каком способе речь. */
      .tl-tool.picked { border-color: #2f55d4; box-shadow: 0 1px 2px rgba(16,21,31,.04), 0 12px 32px -20px rgba(47,85,212,.5); }

      .tl-tool-top { display: flex; gap: 14px; align-items: flex-start; }
      .tl-tool-ic { width: 44px; height: 44px; border-radius: 12px; flex: none; display: grid; place-items: center;
                    background: rgba(47,85,212,.07); color: #2f55d4; }
      .tl-tool-ic svg { width: 21px; height: 21px; }
      .tl-tool-txt { min-width: 0; padding-top: 1px; }
      .tl-tool h2 { margin: 0 0 5px; font-size: 17.5px; font-weight: 650; letter-spacing: -.01em; }
      .tl-ver-chip { margin-left: 9px; font-size: 11.5px; font-weight: 600; vertical-align: 3px;
                     color: var(--text-secondary, #7b869a); background: var(--bg-secondary, #f2f4f8);
                     border-radius: 20px; padding: 2px 8px; font-variant-numeric: tabular-nums; }
      .tl-tool-lead { font-size: 14px; color: var(--text-secondary, #6f7a90); line-height: 1.5; }

      .tl-feats { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
      .tl-feats li { display: flex; gap: 11px; align-items: flex-start; font-size: 14.5px; line-height: 1.4; }
      .tl-feats li::before { content: ""; flex: none; width: 16px; height: 16px; margin-top: 2px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232f55d4' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center/16px no-repeat; }
      .tl-feats b { font-weight: 650; }

      .tl-tool-cta { margin-top: auto; }
      .tl-open, .tl-tool-cta .tl-dl {
        width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 9px;
        border-radius: 12px; padding: 15px 20px; font: inherit; font-size: 15px; font-weight: 600;
        cursor: pointer; text-decoration: none; }
      .tl-open { border: 0; background: #2f55d4; color: #fff; }
      .tl-open:hover { background: #2748b8; }
      .tl-tool-cta .tl-dl { background: var(--card-bg, #fff); color: var(--text-primary, #10151f);
                            border: 1px solid var(--border, #e5e7eb); box-shadow: none; }
      .tl-tool-cta .tl-dl:hover { background: var(--bg-secondary, #f7f9fc); }
      .tl-tool-cta .tl-dl svg { width: 17px; height: 17px; }
      .tl-tool-cta .tl-tip, .tl-tool-cta .tl-ver { display: none; }

      .tl-section-h { display: flex; align-items: baseline; gap: 9px; margin: 0 0 11px; }
      .tl-section-h h3 { margin: 0; font-size: 15px; font-weight: 650; }
      .tl-section-h span { font-size: 12.5px; color: var(--text-secondary, #7b869a); }
    `;
    document.head.appendChild(st);
  }

  // Hint bubbles: an (i) icon instead of a wall of text. Hover on desktop,
  // tap (focus) on phones. Position is clamped to the viewport below.
  const tip = (text) => `<span class="tl-tip" tabindex="0" aria-label="${esc(text)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <span class="tl-tip-pop">${esc(text)}</span></span>`;

  app.innerHTML = `
  <div class="app-layout">
  ${renderSidebar('tools')}
  <main class="main-content">
    <div class="page-header">
      ${renderHamburger()}
      <div class="page-header-text">
        <h1>${t('tools_title') || 'Tools'}</h1>
        <p>${t('tools_sub') || 'Official PR.social apps for earning'}</p>
      </div>
    </div>
    <div class="page-content">
      <div id="toolsBody"><div class="tl-loading">…</div></div>
    </div>
  </main>
  </div>`;

  let info = {};
  try { info = await API.request('GET', '/tools/app-info') || {}; } catch (e) { info = {}; }
  const prices = info.prices_per1k || {};
  const req = info.requirements || {};
  // Окно смены аккаунта словами: сутки — самый частый случай, поэтому
  // отдельная формулировка; ноль — ограничения нет.
  const changeDays = Number(info.account_change_days || 0);
  const changeWindow = !changeDays
    ? (t('tools_req_change_free') || 'any time')
    : changeDays === 1
      ? (t('tools_req_change_24h') || 'once in 24 h')
      : ((t('tools_req_change_days') || 'once in {n} days').replace('{n}', changeDays));
  const havePrices = ['view', 'react', 'join', 'join_v2', 'comment'].some(k => prices[k] > 0);

  // Три причины поставить приложение. Иконка + заголовок + одна строка
  // объяснения: список чипов с подсказками читали единицы, потому что
  // подсказку надо ещё догадаться открыть.
  const PERKS = [
    ['bg', 'tools_perk_bg_t', 'tools_perk_bg_d',
      '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 2"/><circle cx="19" cy="5" r="2.4" fill="currentColor" stroke="none"/>'],
    ['vol', 'tools_perk_vol_t', 'tools_perk_vol_d',
      '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>'],
    ['acc', 'tools_perk_acc_t', 'tools_perk_acc_d',
      '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6"/><path d="M18.5 20c0-2.5-1-4.3-2.6-5.2"/>'],
  ];
  // eslint-disable-next-line no-unused-vars -- оставлено до чистки
  const perkCard = ([key, tKey, dKey, path]) => `
    <div class="tl-perk" data-perk="${key}">
      <span class="tl-perk-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${path}</svg></span>
      <span class="tl-perk-txt">
        <b>${t(tKey)}</b>
        <i>${t(dKey)}</i>
      </span>
    </div>`;

  const priceRow = (labelKey, val) => val > 0 ? `
    <div class="tl-row">
      <span class="tl-row-name">${t(labelKey)}</span>
      <span class="tl-row-val">$${esc(val)} <em>/ 1000</em></span>
    </div>` : '';

  const badge = (required) => required
    ? `<span class="tl-badge tl-badge-req">${t('tools_req_required') || 'Required'}</span>`
    : `<span class="tl-badge">${t('tools_req_recommended') || 'Recommended'}</span>`;

  const dlBlock = info.download_enabled && info.url
    ? `<a class="tl-dl" href="${esc(info.url)}" rel="noopener">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
         ${t('tools_download') || 'Download APK'}</a>
       `
    : `<button class="tl-dl tl-dl-soon" disabled>
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
         ${t('tools_soon') || 'Coming soon'}</button>
       ${tip(t('tools_tip_soon') || 'The app is being prepared for release. The download will appear right here.')}`;

  // Два инструмента заработка. Отличаются они одним: где работают аккаунты —
  // на наших серверах или на телефоне человека. Всё остальное в карточках
  // подчинено этой развилке, чтобы выбор читался с первого взгляда.
  const T2 = (k, зап) => (t(k) && t(k) !== k ? t(k) : зап);
  const пункты = (ключи) => `<ul class="tl-feats">${ключи.map((k) => `<li><span>${T2(k, '')}</span></li>`).join('')}</ul>`;

  document.getElementById('toolsBody').innerHTML = `
    <div class="tl-two">
      <div class="tl-tool">
        <div class="tl-tool-top">
          <div class="tl-tool-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>
          </div>
          <div class="tl-tool-txt">
            <h2>PR Worker Telegram${(info.version_name || info.version)
              ? `<span class="tl-ver-chip">v${esc(info.version_name || info.version)}</span>` : ''}</h2>
            <div class="tl-tool-lead">${esc(T2('ae_app_card_lead', 'Android app — accounts work on your phone.'))}</div>
          </div>
        </div>
        ${пункты(['ae_app_card_f1', 'ae_app_card_f2', 'ae_app_card_f3', 'ae_tools_card_f4'])}
        <div class="tl-tool-cta">${dlBlock}</div>
      </div>

      ${info.web_worker_enabled ? `
      <div class="tl-tool">
        <div class="tl-tool-top">
          <div class="tl-tool-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>
              <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></svg>
          </div>
          <div class="tl-tool-txt">
            <h2>${esc(T2('ae_tools_card_title', 'Telegram Web Worker'))}${info.web_worker_version
              ? `<span class="tl-ver-chip">v${esc(info.web_worker_version)}</span>` : ''}</h2>
            <div class="tl-tool-lead">${esc(T2('ae_tools_card_lead', 'Accounts work on our servers — no app to install.'))}</div>
          </div>
        </div>
        ${пункты(['ae_tools_card_f1', 'ae_tools_card_f2', 'ae_tools_card_f3', 'ae_tools_card_f4'])}
        <div class="tl-tool-cta">
          <button class="tl-open" id="tlOpenWeb">${esc(T2('ae_tools_card_btn', 'Connect account'))}</button>
        </div>
      </div>` : ''}
    </div>

`;

  const кнопкаВеб = document.getElementById('tlOpenWeb');
  if (кнопкаВеб) кнопкаВеб.onclick = (e) => { e.stopPropagation(); Router.navigate('/autoearn'); };

  // Выбор способа: карточка целиком кликабельна, выбранная обведена.
  // Первая отмечена сразу — страница не должна открываться без выбора.
  const карточки = [...document.querySelectorAll('.tl-tool')];
  const выбрать = (к) => карточки.forEach((x) => x.classList.toggle('picked', x === к));
  if (карточки.length) выбрать(карточки[0]);
  карточки.forEach((к) => {
    к.setAttribute('role', 'button');
    к.setAttribute('tabindex', '0');
    к.onclick = () => выбрать(к);
    к.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); выбрать(к); } };
  });

  // Keep hint bubbles inside the viewport: centred by default, nudged
  // sideways when the icon sits near a screen edge (phones).
  const body = document.getElementById('toolsBody');
  const clampTip = (target) => {
    const el = target && target.closest ? target.closest('.tl-tip') : null;
    if (!el) return;
    const pop = el.querySelector('.tl-tip-pop');
    if (!pop) return;
    pop.style.transform = 'translateX(-50%)';
    requestAnimationFrame(() => {
      const r = pop.getBoundingClientRect();
      if (!r.width) return;
      const pad = 10;
      let dx = 0;
      if (r.left < pad) dx = pad - r.left;
      else if (r.right > window.innerWidth - pad) dx = (window.innerWidth - pad) - r.right;
      if (dx) pop.style.transform = 'translateX(calc(-50% + ' + dx + 'px))';
    });
  };
  body.addEventListener('focusin', (e) => clampTip(e.target));
  body.addEventListener('mouseover', (e) => clampTip(e.target));
});
