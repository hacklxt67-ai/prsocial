Router.register('landing', (app) => {
  const check = `<svg viewBox="0 0 20 20" fill="currentColor" class="lp-check"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>`;

  app.innerHTML = `
  <div class="lp">
    <div class="lp-bg"></div>

    <!-- Nav -->
    <nav class="lp-nav">
      <div class="lp-nav-logo"><strong>PR</strong><span>.</span>SOCIAL</div>
      <div class="lp-nav-right">
        <select class="lang-select" onchange="I18N.switchTo(this.value)">
          <option value="en" ${I18N.lang === 'en' ? 'selected' : ''}>EN</option>
          <option value="ru" ${I18N.lang === 'ru' ? 'selected' : ''}>RU</option>
        </select>
        <a class="lp-nav-link" href="/login">${t('auth_signin')}</a>
        <a class="lp-nav-btn" href="/register">${t('auth_signup')}</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="lp-hero">
      <div class="lp-hero-badge">${I18N.lang === 'ru' ? 'Микрозадачи в соцсетях' : 'Social Media Microtasks'}</div>
      <h1>${I18N.lang === 'ru' ? 'Выполняй задания.<br>Получай оплату.' : 'Complete Tasks.<br>Get Paid.'}</h1>
      <p class="lp-hero-sub">${I18N.lang === 'ru' ? 'Подписки, лайки и просмотры на Instagram, YouTube, TikTok и Twitter. Ручной режим или полная автоматизация через приложение — выбирай, как удобно.' : 'Follows, likes and views on Instagram, YouTube, TikTok and Twitter. Manual mode or full automation via the app — you choose how to work.'}</p>
      <div class="lp-carousel-wrap">
        <div class="lp-carousel-fade lp-carousel-fade-l"></div>
        <div class="lp-carousel-track">
          ${(() => {
            const nets = ['Instagram', 'YouTube', 'TikTok', 'X (Twitter)'];
            const items = nets.map(name => '<div class="lp-ci"><span>' + name + '</span></div>').join('');
            return items + items + items;
          })()}
        </div>
        <div class="lp-carousel-fade lp-carousel-fade-r"></div>
      </div>
      <div class="lp-hero-cta">
        <a class="lp-btn-primary" href="/register">
          ${I18N.lang === 'ru' ? 'Начать работу' : 'Get Started'}
          <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/></svg>
        </a>
        <a class="lp-btn-ghost" href="/login">${t('auth_signin')}</a>
      </div>
      <div class="lp-hero-stats">
        <div class="lp-hero-stat"><strong id="lpStatUsers">13.5K+</strong>${I18N.lang === 'ru' ? 'исполнителей' : 'workers'}</div>
        <div class="lp-hero-divider"></div>
        <div class="lp-hero-stat"><strong id="lpStatTasks">1.4M+</strong>${I18N.lang === 'ru' ? 'выполнено заданий' : 'tasks completed'}</div>
        <div class="lp-hero-divider"></div>
        <div class="lp-hero-stat"><strong id="lpStatEarned">$77.8K+</strong>${I18N.lang === 'ru' ? 'выплачено' : 'paid out'}</div>
      </div>
    </section>

    <!-- Trust strip -->
    <section class="lp-trust">
      <div class="lp-trust-item">
        <div class="lp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
        <span>${I18N.lang === 'ru' ? 'Оплата за каждое задание' : 'Pay Per Task'}</span>
      </div>
      <div class="lp-trust-item">
        <div class="lp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
        <span>${I18N.lang === 'ru' ? 'Android + Chrome' : 'Android + Chrome'}</span>
      </div>
      <div class="lp-trust-item">
        <div class="lp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <span>${I18N.lang === 'ru' ? 'Вывод от $1 на USDT' : 'Withdraw from $1 USDT'}</span>
      </div>
      <div class="lp-trust-item">
        <div class="lp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
        <span>${I18N.lang === 'ru' ? 'Режим автопилота' : 'Autopilot Mode'}</span>
      </div>
    </section>

    <!-- Features — why us -->
    <section class="lp-section">
      <h2>${I18N.lang === 'ru' ? 'Как устроена платформа' : 'How the Platform Works'}</h2>
      <div class="lp-two-cols">

        <div class="lp-col lp-col-earn">
          <div class="lp-col-glow"></div>
          <div class="lp-col-tag">${I18N.lang === 'ru' ? 'Автоматизация' : 'Automation'}</div>
          <h3>${I18N.lang === 'ru' ? 'Задания выполняются сами' : 'Tasks Run Themselves'}</h3>
          <p class="lp-col-desc">${I18N.lang === 'ru' ? 'Установи приложение на Android или расширение в Chrome. Задания берутся из очереди и выполняются автоматически — ты просто наблюдаешь за балансом.' : 'Install the Android app or Chrome extension. Tasks are picked from the queue and completed automatically — just watch your balance grow.'}</p>
          <ul class="lp-perks">
            <li>${check}${I18N.lang === 'ru' ? 'Android-приложение с фоновым режимом' : 'Android app with background mode'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Chrome-расширение для десктопа' : 'Chrome extension for desktop'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Задержки и лимиты для защиты аккаунтов' : 'Delays and limits to protect accounts'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Ручной режим тоже доступен' : 'Manual mode also available'}</li>
          </ul>
          <a class="lp-col-btn lp-col-btn-earn" href="/register">${I18N.lang === 'ru' ? 'Попробовать бесплатно' : 'Try for Free'}</a>
        </div>

        <div class="lp-col lp-col-promo">
          <div class="lp-col-glow"></div>
          <div class="lp-col-tag">${I18N.lang === 'ru' ? 'Выплаты' : 'Payouts'}</div>
          <h3>${I18N.lang === 'ru' ? 'Прозрачные условия и быстрый вывод' : 'Clear Terms, Fast Withdrawals'}</h3>
          <p class="lp-col-desc">${I18N.lang === 'ru' ? 'Каждое задание имеет фиксированную стоимость. Деньги зачисляются сразу после проверки. Вывод — на USDT TRC20 без скрытых комиссий.' : 'Every task has a fixed rate. Funds are credited right after verification. Withdraw to USDT TRC20 with no hidden fees.'}</p>
          <ul class="lp-perks">
            <li>${check}${I18N.lang === 'ru' ? 'Ставки от $0.003 до $0.01 за задание' : 'Rates from $0.003 to $0.01 per task'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Баланс обновляется после каждого задания' : 'Balance updates after each task'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Минимальный вывод — $1' : 'Minimum withdrawal — $1'}</li>
            <li>${check}${I18N.lang === 'ru' ? 'Реферальная программа: +5% от дохода приглашённых' : 'Referral program: +5% from invitees\'s earnings'}</li>
          </ul>
          <a class="lp-col-btn lp-col-btn-promo" href="/register">${I18N.lang === 'ru' ? 'Зарегистрироваться' : 'Sign Up'}</a>
        </div>

      </div>
    </section>

    <!-- How it works -->
    <section class="lp-section lp-section-glow-right">
      <div class="lp-how-header">
        <div class="lp-how-pill">3 ${I18N.lang === 'ru' ? 'шага' : 'steps'}</div>
        <h2>${I18N.lang === 'ru' ? 'Начало работы' : 'Getting Started'}</h2>
        <p class="lp-how-sub">${I18N.lang === 'ru' ? 'От регистрации до первого вывода — меньше дня' : 'From sign-up to first withdrawal — less than a day'}</p>
      </div>
      <div class="lp-timeline">
        <div class="lp-timeline-line"></div>

        <div class="lp-tl-item">
          <div class="lp-tl-left">
            <span class="lp-tl-big">01</span>
            <div class="lp-tl-node"></div>
          </div>
          <div class="lp-tl-card">
            <div class="lp-tl-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
            </div>
            <div class="lp-tl-content">
              <h3>${I18N.lang === 'ru' ? 'Создай аккаунт' : 'Create Account'}</h3>
              <p>${I18N.lang === 'ru' ? 'Email и пароль — всё, что нужно. Залогинься в соцсети, с которых будешь работать.' : 'Email and password — that\'s all you need. Log into the social accounts you\'ll work with.'}</p>
              <div class="lp-tl-chips">
                <span class="lp-tl-chip">${I18N.lang === 'ru' ? 'Бесплатно' : 'Free'}</span>
                <span class="lp-tl-chip">${I18N.lang === 'ru' ? 'Без верификации' : 'No verification'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lp-tl-item">
          <div class="lp-tl-left">
            <span class="lp-tl-big">02</span>
            <div class="lp-tl-node"></div>
          </div>
          <div class="lp-tl-card">
            <div class="lp-tl-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="lp-tl-content">
              <h3>${I18N.lang === 'ru' ? 'Выполняй задания' : 'Complete Tasks'}</h3>
              <p>${I18N.lang === 'ru' ? 'Подписки, лайки и просмотры на четырёх платформах. Включи автоматический режим или выполняй вручную — оплата начисляется после проверки.' : 'Follows, likes and views across four platforms. Turn on auto mode or complete manually — payment is credited after verification.'}</p>
              <div class="lp-tl-chips">
                <span class="lp-tl-chip">${I18N.lang === 'ru' ? 'Авто / вручную' : 'Auto / Manual'}</span>
                <span class="lp-tl-chip">Instagram, YouTube, TikTok, X</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lp-tl-item">
          <div class="lp-tl-left">
            <span class="lp-tl-big">03</span>
            <div class="lp-tl-node"></div>
          </div>
          <div class="lp-tl-card">
            <div class="lp-tl-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="lp-tl-content">
              <h3>${I18N.lang === 'ru' ? 'Выводи на кошелёк' : 'Cash Out'}</h3>
              <p>${I18N.lang === 'ru' ? 'Накопил от $1 — выводи на USDT TRC20. Заявки обрабатываются в течение 24 часов, комиссия платформы — 0%.' : 'Reached $1 — withdraw to USDT TRC20. Requests are processed within 24 hours, platform fee — 0%.'}</p>
              <div class="lp-tl-chips">
                <span class="lp-tl-chip">USDT TRC20</span>
                <span class="lp-tl-chip">${I18N.lang === 'ru' ? 'от $1' : 'from $1'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Earnings table -->
    <section class="lp-section lp-section-glow-left">
      <h2>${I18N.lang === 'ru' ? 'Тарифы за задания' : 'Task Rates'}</h2>
      <div class="lp-prices">
        <table class="lp-price-table">
          <thead>
            <tr>
              <th>${I18N.lang === 'ru' ? 'Задание' : 'Task'}</th>
              <th>${I18N.lang === 'ru' ? 'Оплата' : 'Payment'}</th>
              <th>${I18N.lang === 'ru' ? 'За 100 шт.' : 'Per 100'}</th>
            </tr>
          </thead>
          <tbody id="lpPrices"></tbody>
        </table>
      </div>
      <div style="text-align:center;margin-top:16px;color:var(--text-muted);font-size:var(--font-sm)">
        ${I18N.lang === 'ru' ? '* В автоматическом режиме — до 200+ заданий в сутки' : '* In auto mode — up to 200+ tasks per day'}
      </div>
    </section>

    <!-- Live feed -->
    <section class="lp-section lp-section-glow-left">
      <h2 class="lp-feed-title"><span class="lp-feed-live-dot"></span> ${I18N.lang === 'ru' ? 'Последние выплаты' : 'Recent Payouts'}</h2>
      <div class="lp-feed-wrap"><div class="lp-feed" id="lpFeed"></div></div>
    </section>

    <!-- FAQ -->
    <section class="lp-section">
      <h2>${I18N.lang === 'ru' ? 'Вопросы и ответы' : 'Questions & Answers'}</h2>
      <div class="lp-faq-grid">
        <div class="lp-faq-col">
          ${[
            [I18N.lang === 'ru' ? 'Сколько реально заработать?' : 'What are realistic earnings?',
             I18N.lang === 'ru' ? 'В автоматическом режиме — 200+ заданий в сутки, это $0.60–$2.00 в зависимости от типа заданий. Доход зависит от наличия заказов и количества подключённых платформ. Реферальная программа добавляет 5% от заработка приглашённых.' : 'In auto mode — 200+ tasks per day, that is $0.60–$2.00 depending on task type. Earnings depend on order availability and connected platforms. Referral program adds 5% from invitees\'s earnings.'],
            [I18N.lang === 'ru' ? 'Не заблокируют ли мой аккаунт?' : 'Will my account get banned?',
             I18N.lang === 'ru' ? 'Система использует задержки между действиями и суточные лимиты, чтобы активность выглядела естественно. Если платформа отправляет временный блок — приложение останавливается и ждёт автоматически. Риск есть, но он минимизирован.' : 'The system uses delays between actions and daily limits so activity looks natural. If a platform sends a temporary block — the app pauses and waits automatically. Risk exists but is minimized.'],
            [I18N.lang === 'ru' ? 'Когда поступает оплата?' : 'When do I get paid?',
             I18N.lang === 'ru' ? 'Баланс обновляется сразу после проверки каждого задания. Вывод на USDT TRC20 — заявки обрабатываются в течение 24 часов. Минимальная сумма вывода — $1.' : 'Balance updates right after each task is verified. USDT TRC20 withdrawal — requests are processed within 24 hours. Minimum withdrawal — $1.'],
            [I18N.lang === 'ru' ? 'На каких устройствах работает?' : 'What devices are supported?',
             I18N.lang === 'ru' ? 'Android 7+ (APK-приложение с авторежимом), ПК с Chrome (расширение с фоновым режимом). Также есть ручной режим через браузер на любом устройстве.' : 'Android 7+ (APK app with auto mode), PC with Chrome (extension with background mode). Manual mode via browser is also available on any device.'],
            [I18N.lang === 'ru' ? 'Платформа берёт комиссию?' : 'Does the platform charge fees?',
             I18N.lang === 'ru' ? 'Регистрация и использование бесплатны. Комиссия на вывод — 0%. Платформа зарабатывает на разнице между стоимостью заказов и выплатами исполнителям.' : 'Registration and usage are free. Withdrawal fee — 0%. The platform earns from the margin between order costs and worker payouts.'],
          ].map(([q, a], i) => `
          <div class="lp-faq-item${i===0?' open':''}">
            <div class="lp-faq-q" onclick="this.parentElement.classList.toggle('open')">${q}<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></div>
            <div class="lp-faq-a">${a}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="lp-bottom">
      <h2>${I18N.lang === 'ru' ? 'Начни сегодня' : 'Start Today'}</h2>
      <p>${I18N.lang === 'ru' ? 'Регистрация занимает минуту. Первые задания — сразу после входа.' : 'Registration takes a minute. First tasks — right after login.'}</p>
      <a class="lp-btn-primary" href="/register">${I18N.lang === 'ru' ? 'Создать аккаунт' : 'Create Account'}</a>
    </section>

    <footer class="lp-footer">
      <span>PR.SOCIAL &copy; 2021–${new Date().getFullYear()}</span>
      <span style="margin:0 6px;opacity:0.3">·</span>
      <a href="/privacy" style="color:inherit;opacity:0.5;text-decoration:none;font-size:13px">Privacy</a>
      <span style="margin:0 6px;opacity:0.3">·</span>
      <a href="/terms" style="color:inherit;opacity:0.5;text-decoration:none;font-size:13px">Terms</a>
    </footer>
  </div>`;

  // Load live stats
  fetch('/api/public/stats').then(r => r.json()).then(d => {
    if (!d.ok) return;
    function fmtStat(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M+';
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'K+';
      return n + '+';
    }
    const elUsers = document.getElementById('lpStatUsers');
    const elTasks = document.getElementById('lpStatTasks');
    const elEarned = document.getElementById('lpStatEarned');
    if (elUsers && d.users > 0) elUsers.textContent = fmtStat(d.users);
    if (elTasks && d.tasks > 0) elTasks.textContent = fmtStat(d.tasks);
    if (elEarned && d.earned > 0) elEarned.textContent = '$' + fmtStat(d.earned);
  }).catch(() => {});

  // Earnings table (earner perspective only)
  const prices = [
    ['Instagram', 'Follow', 0.005, 0.50],
    ['Instagram', 'Like', 0.003, 0.30],
    ['YouTube', 'Subscribe', 0.01, 1.00],
    ['YouTube', 'Like', 0.005, 0.50],
    ['TikTok', 'Follow', 0.005, 0.50],
    ['TikTok', 'Like', 0.003, 0.30],
    ['Twitter/X', 'Follow', 0.005, 0.50],
    ['Twitter/X', 'Like', 0.003, 0.30],
    ['Twitter/X', 'Retweet', 0.005, 0.50],
  ];
  const platformKey = { 'Instagram': 'instagram', 'YouTube': 'youtube', 'TikTok': 'tiktok', 'Twitter/X': 'twitter' };
  const tb = document.getElementById('lpPrices');
  if (tb) {
    tb.innerHTML = prices.map(([p, a, earn, per100]) => {
      const key = platformKey[p] || 'twitter';
      const color = PLATFORM_COLORS[key] || '#71717a';
      return '<tr><td><span class="lp-price-dot" style="background:' + color + '"></span><span class="lp-price-platform">' + p + '</span><span class="lp-price-action">' + a + '</span></td><td class="lp-price-green">$' + earn + '</td><td class="lp-price-green" style="opacity:0.7">$' + per100.toFixed(2) + '</td></tr>';
    }).join('');
  }

  // Live feed (earnings only — no "created order")
  const feed = document.getElementById('lpFeed');
  if (feed) {
    const names = ['Alex','Maria','John','Anna','Mike','Sofia','David','Elena','Carlos','Yuki','Ahmed','Lisa','Omar','Nina','Leo'];
    const avatarColors = ['#dc2626','#ea580c','#d97706','#65a30d','#0891b2','#7c3aed','#db2777','#2563eb','#059669','#e11d48'];
    const actions = [
      ['$0.005', 'Instagram Follow'],
      ['$0.01', 'YouTube Subscribe'],
      ['$0.003', 'TikTok Like'],
      ['$0.005', 'Twitter Follow'],
      ['$0.003', 'Instagram Like'],
      ['$0.005', 'Twitter Retweet'],
      ['$0.01', 'YouTube Subscribe'],
      ['$0.005', 'TikTok Follow'],
    ];

    function makeFeedItem(minutesAgo) {
      const name = names[Math.floor(Math.random() * names.length)];
      const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
      const [amount, detail] = actions[Math.floor(Math.random() * actions.length)];
      const mins = minutesAgo || Math.floor(Math.random() * 30) + 1;
      return '<div class="lp-feed-item"><span class="lp-feed-avatar" style="background:' + color + '">' + name[0] + '</span><span class="lp-feed-name">' + name + '</span> <span class="lp-feed-action-earned">' + (I18N.lang === 'ru' ? 'получил' : 'earned') + ' ' + amount + '</span> <span class="lp-feed-detail">' + detail + '</span><span class="lp-feed-time">' + mins + 'm</span></div>';
    }

    const initial = [];
    for (let i = 0; i < 8; i++) initial.push(makeFeedItem(Math.floor(Math.random() * 25) + 1));
    feed.innerHTML = initial.join('');

    function scheduleFeedCycle() {
      setTimeout(() => {
        const el = feed;
        if (!el || !document.querySelector('.lp-feed-wrap')) return;
        if (el.children.length >= 8) {
          const last = el.children[el.children.length - 1];
          last.classList.add('lp-feed-out');
          setTimeout(() => last.remove(), 300);
        }
        setTimeout(() => {
          el.insertAdjacentHTML('afterbegin', makeFeedItem(Math.floor(Math.random() * 2) + 1));
        }, 350);
        scheduleFeedCycle();
      }, Math.floor(Math.random() * 3000) + 4000);
    }
    scheduleFeedCycle();
  }
});
