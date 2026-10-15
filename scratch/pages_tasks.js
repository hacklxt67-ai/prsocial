// PLATFORM_ICONS and PLATFORM_COLORS are defined in /js/components/platforms.js
// Platforms reserved for Premium Tasks — exclude from regular /tasks chips.
// Their tasks live in /premium and never appear here, so showing the chip
// would mislead the user (always 0 count).
const PREMIUM_PLATFORMS_TASKS = (typeof PREMIUM_PLATFORMS_LIST !== 'undefined') ? PREMIUM_PLATFORMS_LIST : ['site', 'amazon', 'ebay', 'etsy', 'steam', 'avito', 'yandex_market', 'megamarket', 'ozon', 'wildberries', 'other_marketplaces', 'google_maps', 'trustpilot'];

// Format large numbers: 1234 → "1.2K", 10000 → "10K", 1500000 → "1.5M"
function fmtCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('time_just_now');
  if (mins < 60) return mins + ' ' + t('time_min_ago');
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + ' ' + t('time_hr_ago');
  const days = Math.floor(hrs / 24);
  return days + ' ' + t('time_day_ago');
}

// Action group icons for section headers
const ACTION_ICONS = {
  follow: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 14v-1.5a3 3 0 00-3-3H4.5a3 3 0 00-3 3V14"/><circle cx="6.25" cy="4.5" r="2.5"/><path d="M13 6.5v4M15 8.5h-4"/></svg>`,
  subscribe: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 14v-1.5a3 3 0 00-3-3H4.5a3 3 0 00-3 3V14"/><circle cx="6.25" cy="4.5" r="2.5"/><path d="M13 6.5v4M15 8.5h-4"/></svg>`,
  like: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14s-5.5-3.5-5.5-7A3 3 0 018 4.5 3 3 0 0113.5 7C13.5 10.5 8 14 8 14z"/></svg>`,
  retweet: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 2.5l2 2-2 2"/><path d="M2 7.5V6a2 2 0 012-2h8.5"/><path d="M3.5 13.5l-2-2 2-2"/><path d="M14 8.5V10a2 2 0 01-2 2H3.5"/></svg>`,
  join: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 12l4-4-4-4"/></svg>`,
  comment: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V3z"/></svg>`,
  comment_custom: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V3z"/></svg>`,
  comment_emoji: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="7"/><path d="M5.5 9.5s1 1.5 2.5 1.5 2.5-1.5 2.5-1.5"/><circle cx="6" cy="6.5" r=".5" fill="currentColor"/><circle cx="10" cy="6.5" r=".5" fill="currentColor"/></svg>`,
  comment_crypto: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="7"/><path d="M6 4v8M10 4v8M5 6h6M5 10h6"/></svg>`,
  review: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1l2.35 4.76 5.25.76-3.8 3.7.9 5.24L8 13.27l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76z"/></svg>`,
  connection: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2.5"/><path d="M1.5 14v-1a3 3 0 013-3h3a3 3 0 013 3v1"/><path d="M12.5 5.5v4M14.5 7.5h-4"/></svg>`,
  // Outbound arrow icon — matches the "Share" affordance across most apps (TikTok/IG/YT/etc.).
  share: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5l4 4-4 4"/><path d="M13 5.5H6.5a4 4 0 00-4 4V14"/></svg>`,
};

// === TASKS FEED ===
Router.register('tasks', async (app) => {
  if (API.user && API.user.status === 'restricted') {
    app.innerHTML = `<div class="app-layout">${renderSidebar('tasks')}<main class="main-content"><div class="restricted-block-screen" style="max-width:560px;margin:60px auto 0;padding:24px;text-align:center"><img src="/images/restoration-miner.png" alt="" style="width:160px;height:auto;margin-bottom:18px"><h2 style="margin:0 0 12px;font-size:24px;font-weight:700;color:var(--text-primary)">${t('restricted_block_title')}</h2><p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:var(--text-secondary)">${t('restricted_block_subtitle')}</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a href="/support?appeal=1" class="btn btn-primary">${t('suspicious_banner_button')}</a><a href="/profile" class="btn btn-secondary" onclick="event.preventDefault();Router.navigate('/profile')">${t('restricted_block_btn_warnings')}</a></div></div></main></div>`;
    return;
  }
  if (API.user && API.user.status === 'suspicious') {
    app.innerHTML = `<div class="app-layout">${renderSidebar('tasks')}<main class="main-content">${renderSuspiciousBanner()}<div class="suspicious-blocked"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg><h3>${t('suspicious_tasks_blocked')}</h3><p>${t('suspicious_banner_text')}</p><a href="/support?appeal=1" class="btn btn-primary">${t('suspicious_banner_button')}</a></div></main></div>`;
    return;
  }
  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('tasks')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('tasks_title')}</h1>
          <p>${t('tasks_subtitle')}</p>
        </div>
      </div>
      <div class="page-content">
        <div class="task-toolbar" id="taskToolbar">
          <div class="platform-chips" id="platformChips">
            ${Object.keys(PLATFORM_ICONS).filter(p => !PREMIUM_PLATFORMS_TASKS.includes(p)).map((p, i) => `<div class="platform-chip${i === 0 ? ' active' : ''}" data-platform="${p}" style="--pc:${PLATFORM_COLORS[p] || '#ea580c'}">${PLATFORM_ICONS[p]}<span class="chip-count" id="cnt-${p}"></span></div>`).join('')}
          </div>
          <div class="sort-toggle">
            <button class="sort-btn active" data-sort="reward"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 11l4 4 4-4"/><path d="M6 15V1"/><path d="M14 5l-2-4-2 4"/><path d="M10 5h4"/><path d="M10 8h3"/><path d="M10 11h2"/></svg></button>
            <button class="sort-btn" data-sort="new"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/></svg></button>
          </div>
        </div>
        <div class="action-tabs" id="actionTabs"></div>
        <div id="tasksList" class="tasks-grid"></div>
        <div id="tasksLoadMore" class="tasks-load-more-wrap" style="display:none">
          <button class="btn btn-secondary tasks-load-more" id="loadMoreBtn">${t('tasks_show_more') || 'Show more'}</button>
        </div>
        <div id="tasksEmpty" style="display:none" class="card"><div class="card-body">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <h3>${t('tasks_no_tasks')}</h3>
            <p>${t('tasks_no_tasks_hint')}</p>
          </div>
        </div></div>
      </div>
    </main>
  </div>`;

  let currentPlatform = Object.keys(PLATFORM_ICONS).filter(p => !PREMIUM_PLATFORMS_TASKS.includes(p))[0] || 'instagram';
  let currentSort = 'reward';
  let currentAction = 'all';
  let allTasks = []; // full task list from API
  let visibleCount = 20; // how many tasks currently shown
  let currentPage = 1; // server-side pagination
  const PAGE_SIZE = 500;
  let linkedPlatforms = new Set(); // platforms with approved social accounts

  // Load user's linked social accounts
  async function loadLinkedPlatforms() {
    try {
      const data = await API.request('GET', '/profile/socials');
      linkedPlatforms = new Set((data.accounts || []).filter(a => a.status === 'approved').map(a => a.platform));
      // Mark unlinked chips with lock icon
      document.querySelectorAll('#platformChips .platform-chip[data-platform]').forEach(chip => {
        const p = chip.dataset.platform;
        if (p === 'all') return;
        if (!linkedPlatforms.has(p)) {
          chip.classList.add('chip-locked');
          if (!chip.querySelector('.chip-lock')) {
            const lock = document.createElement('span');
            lock.className = 'chip-lock';
            lock.innerHTML = `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`;
            chip.appendChild(lock);
          }
        }
      });
    } catch (e) { /* ignore — will just show all tasks */ }
  }

  function showLinkPrompt(platform) {
    const list = document.getElementById('tasksList');
    const empty = document.getElementById('tasksEmpty');
    empty.style.display = 'none';
    const color = PLATFORM_COLORS[platform] || '#ea580c';
    const icon = PLATFORM_ICONS[platform] || '';
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    list.innerHTML = `
      <div class="tasks-link-prompt">
        <div class="tlp-icon" style="color:${color}">${icon}</div>
        <h3>${t('tasks_link_required_title').replace('{platform}', platformName)}</h3>
        <p>${t('tasks_link_required_desc').replace('{platform}', platformName)}</p>
        <button class="btn btn-primary btn-sm" onclick="Router.navigate('/profile')" style="margin-top:12px;width:auto;padding:10px 24px">
          ${t('tasks_link_go_profile')}
        </button>
      </div>`;
  }

  function showLinkPromptGeneral() {
    const list = document.getElementById('tasksList');
    const empty = document.getElementById('tasksEmpty');
    empty.style.display = 'none';
    list.innerHTML = `
      <div class="tasks-link-prompt">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        <h3>${t('tasks_link_none_title')}</h3>
        <p>${t('tasks_link_none_desc')}</p>
        <button class="btn btn-primary btn-sm" onclick="Router.navigate('/profile')" style="margin-top:12px;width:auto;padding:10px 24px">
          ${t('tasks_link_go_profile')}
        </button>
      </div>`;
  }

  // Build action tabs from tasks data
  function buildActionTabs(tasks) {
    const actionOrder = ['follow', 'subscribe', 'like', 'comment', 'view', 'retweet', 'share', 'join', 'connection'];
    const counts = {};
    for (const task of tasks) {
      counts[task.action] = (counts[task.action] || 0) + 1;
    }
    const actions = Object.keys(counts).sort((a, b) => {
      const ia = actionOrder.indexOf(a), ib = actionOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    const tabsEl = document.getElementById('actionTabs');
    if (!actions.length || actions.length <= 1) {
      tabsEl.style.display = 'none';
      return;
    }
    tabsEl.style.display = 'flex';

    let html = `<button class="action-tab ${currentAction === 'all' ? 'active' : ''}" data-action="all">${t('tasks_all')} <span class="action-tab-count">${tasks.length}</span></button>`;
    for (const action of actions) {
      const icon = ACTION_ICONS[action] || '';
      const label = t('action_group_' + action) || action;
      html += `<button class="action-tab ${currentAction === action ? 'active' : ''}" data-action="${action}">${icon}<span>${label}</span><span class="action-tab-count">${counts[action]}</span></button>`;
    }
    tabsEl.innerHTML = html;
  }

  // Filter tasks by current action tab
  function getFilteredTasks() {
    if (currentAction === 'all') return allTasks;
    return allTasks.filter(t => t.action === currentAction);
  }

  // Render visible tasks with pagination
  function renderVisibleTasks() {
    const filtered = getFilteredTasks();
    const list = document.getElementById('tasksList');
    const empty = document.getElementById('tasksEmpty');
    const loadMoreWrap = document.getElementById('tasksLoadMore');

    if (!filtered.length) {
      list.innerHTML = '';
      empty.style.display = 'block';
      loadMoreWrap.style.display = 'none';
      return;
    }
    empty.style.display = 'none';

    const toShow = filtered.slice(0, visibleCount);
    list.innerHTML = renderGroupedTasks(toShow, filtered.length);

    // Show/hide load more button
    if (visibleCount < filtered.length) {
      loadMoreWrap.style.display = 'flex';
      const remaining = filtered.length - visibleCount;
      const nextBatch = Math.min(remaining, PAGE_SIZE);
      document.getElementById('loadMoreBtn').textContent =
        (t('tasks_show_more') || 'Show more') + ` (${remaining})`;
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }

async function loadTasks(append = false) {
  await ensureApiCheckFlag();
    // If platform not linked → link prompt (resets state)
    if (!linkedPlatforms.has(currentPlatform)) {
      showLinkPrompt(currentPlatform);
      return;
    }
    if (!append) {
      currentPage = 1;
      allTasks = [];
      visibleCount = PAGE_SIZE;
    }
    const params = new URLSearchParams({
      platform: currentPlatform,
      sort: currentSort,
      page: String(currentPage),
      limit: '500',
    });
    try {
      const data = await API.request('GET', '/tasks/available?' + params);
      const newTasks = data.tasks || [];
      if (append) {
        allTasks = allTasks.concat(newTasks);
        visibleCount += PAGE_SIZE;
      } else {
        allTasks = newTasks;
      }
      // Build action tabs from currently loaded tasks
      buildActionTabs(allTasks);
      renderVisibleTasks();
      // Update chip counts — show counts only for linked platforms (data has aggregated platformCounts)
      const counts = {};
      for (const pc of (data.platformCounts || [])) counts[pc.platform] = pc.count;
      for (const [p, n] of Object.entries(counts)) {
        const el = document.getElementById('cnt-' + p);
        if (el) {
          const display = linkedPlatforms.has(p) ? n : 0;
          el.textContent = fmtCount(display);
          // Keep raw value in data-count so inline decrement after claim can read
          // the exact number (textContent may be "1.2K" after fmtCount formatting).
          el.dataset.count = String(display);
        }
      }
      // Hide loadMore if backend returned less than page size — no more pages
      const loadMoreWrap = document.getElementById('tasksLoadMore');
      if (loadMoreWrap) loadMoreWrap.style.display = newTasks.length < PAGE_SIZE ? 'none' : '';
      // Hourly-cap banner — server tells us which (platform,action) pairs are
      // currently capped for this user, with retry-after minutes. Shows above
      // the toolbar so users know why TikTok/follow disappeared.
      _renderHourlyBanner(data.exhausted_pairs || []);
    } catch (e) { showToast(e.message, 'error'); }
  }

  function _renderHourlyBanner(pairs) {
    let host = document.getElementById('hourlyCapBanner');
    if (!pairs || !pairs.length) { if (host) host.remove(); return; }
    if (!host) {
      host = document.createElement('div');
      host.id = 'hourlyCapBanner';
      host.style.cssText = 'background:#fef3c7;border:1px solid #fbbf24;color:#92400e;border-radius:10px;padding:10px 14px;margin:0 0 12px;font-size:13px;line-height:1.4';
      const toolbar = document.getElementById('taskToolbar');
      if (toolbar && toolbar.parentNode) toolbar.parentNode.insertBefore(host, toolbar);
      else return;
    }
    const tpl = t('tasks_hourly_banner_item') || '⏱ {platform}/{action} — paused for ~{minutes} min';
    const items = pairs.map(p => tpl
      .replace('{platform}', p.platform)
      .replace('{action}', p.action)
      .replace('{minutes}', p.retry_after_min)
      .replace('{limit}', p.limit)
    );
    host.innerHTML = items.map(s => `<div>${s.replace(/[<>]/g, '')}</div>`).join('');
  }

  function renderGroupedTasks(tasks, totalCount) {
    // If a specific action tab is selected, render flat list (no group headers)
    if (currentAction !== 'all') {
      return tasks.map(renderTaskCard).join('');
    }

    // "All" tab: group by action with collapsible headers showing count
    const groups = {};
    const actionOrder = ['follow', 'subscribe', 'like', 'comment', 'view', 'retweet', 'share', 'join', 'connection'];
    for (const task of tasks) {
      const a = task.action;
      if (!groups[a]) groups[a] = [];
      groups[a].push(task);
    }
    const sortedActions = Object.keys(groups).sort((a, b) => {
      const ia = actionOrder.indexOf(a), ib = actionOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    // If only 1 group, skip header
    if (sortedActions.length <= 1) return tasks.map(renderTaskCard).join('');
    // Render with headers
    let html = '';
    for (const action of sortedActions) {
      const groupTasks = groups[action];
      const label = t('action_group_' + action) || action;
      const icon = ACTION_ICONS[action] || '';
      html += `<div class="task-group-header">${icon}<span>${label}</span><span class="task-group-count">${groupTasks.length}</span></div>`;
      html += groupTasks.map(renderTaskCard).join('');
    }
    return html;
  }

  // Platform chips click handler
  document.getElementById('platformChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.platform-chip');
    if (!chip) return;
    const platform = chip.dataset.platform;
    document.querySelectorAll('.platform-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentPlatform = platform;
    currentAction = 'all'; // reset action filter on platform change

    // If platform is locked (not linked), show link prompt
    if (!linkedPlatforms.has(platform)) {
      showLinkPrompt(platform);
      return;
    }
    currentPage = 1;
    loadTasks();
  });

  // Action tabs click handler
  document.getElementById('actionTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.action-tab');
    if (!tab) return;
    document.querySelectorAll('.action-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentAction = tab.dataset.action;
    visibleCount = PAGE_SIZE; // reset pagination on action change
    renderVisibleTasks();
  });

  // Load more button — fetch next page from server
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage += 1;
    loadTasks(true);
  });

  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      currentPage = 1;
      loadTasks();
    });
  });
  // Expose a closure-bound helper for the global startTask() function (defined OUTSIDE
  // this Router.register scope) to remove the just-claimed task from the feed and
  // decrement the platform chip counter without triggering an extra API call.
  // Reason this is a window.* function and not a direct reference: startTask is
  // declared at module scope, so it doesn't capture `allTasks` / `renderVisibleTasks` /
  // `fmtCount` from this closure. Earlier inline `allTasks.filter(...)` inside startTask
  // produced "allTasks is not defined" runtime error on every claim (2026-05-06).
  window.__tasksRemoveFromFeed = function(taskId, platform) {
    const idx = allTasks.findIndex(item => item.id === taskId);
    if (idx === -1) return; // task not in current feed (filter changed / page navigated)
    allTasks = allTasks.filter(item => item.id !== taskId);
    renderVisibleTasks();
    if (platform) {
      const cntEl = document.getElementById('cnt-' + platform);
      if (cntEl && cntEl.dataset.count) {
        const cur = parseInt(cntEl.dataset.count, 10);
        if (!isNaN(cur) && cur > 0) {
          const next = cur - 1;
          cntEl.dataset.count = String(next);
          cntEl.textContent = fmtCount(next);
        }
      }
    }
  };
  await loadLinkedPlatforms();
  loadTasks();
});

function getTaskLabel(task) {
  const key = 'task_label_' + task.platform + '_' + task.action;
  const translated = t(key);
  return translated !== key ? translated : task.label;
}

function renderTaskCard(task) {
  const color = PLATFORM_COLORS[task.platform] || '#ea580c';
  const icon = PLATFORM_ICONS[task.platform] || '';
  const remaining = task.total_count - task.completed_count;
  const label = getTaskLabel(task);

  return `
  <div class="task-card" onclick="openTask(${task.id})">
    <div class="task-card-row">
      <div class="tc-icon" style="color:${color}">${icon}</div>
      <div class="tc-body">
        <div class="tc-name">${escHtml(label)}</div>
        <div class="tc-sub">${escHtml(task.target_username || '')} <span class="tc-rem">· ${remaining} ${t('tasks_remaining')}</span></div>
      </div>
      <div class="tc-reward">${fmtPrice(task.worker_reward || task.cost_per_task)}</div>
    </div>
  </div>`;
}

// === TASK MODAL ===
async function openTask(taskId) {
  try {
    const data = await API.request('GET', '/tasks/' + taskId);
    applyApiCheckFlag(data);
    showTaskModal(data.task, data.completion);
  } catch (e) { showToast(e.message, 'error'); }
}

function showTaskModal(task, completion) {
  const color = PLATFORM_COLORS[task.platform] || '#ea580c';
  const icon = PLATFORM_ICONS[task.platform] || '';
  const remaining = task.total_count - task.completed_count;
  const status = completion?.status || 'none';
  // Some legacy orders store target_url without protocol (e.g. "www.tiktok.com/@user").
  // The SPA router only skips links starting with "http", so a protocol-less href
  // would be intercepted and resolved as an internal route → fallback to dashboard.
  const targetHref = /^https?:\/\//i.test(task.target_url || '') ? task.target_url : 'https://' + (task.target_url || '');

  document.getElementById('taskModal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'taskModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
  <div class="modal-content task-modal">
    <button class="modal-close" onclick="closeTaskModal()">&times;</button>

    <!-- Header -->
    <div class="tm-header" style="border-left:4px solid ${color}">
      <div class="task-platform-icon" style="color:${color};width:40px;height:40px">${icon}</div>
      <div style="flex:1;min-width:0">
        <div class="tm-title">${escHtml(getTaskLabel(task))}</div>
        <div class="tm-target">${escHtml(task.target_username || '')}</div>
      </div>
    </div>

    <!-- Info grid -->
    <div class="tm-info-grid">
      <div class="tm-info-item">
        <div class="tm-info-value" style="color:var(--accent)">${fmtPrice(task.worker_reward || task.cost_per_task)}</div>
        <div class="tm-info-label">${t('tasks_reward')}</div>
      </div>
      <div class="tm-info-item">
        <div class="tm-info-value">${remaining}</div>
        <div class="tm-info-label">${t('tasks_spots_left')}</div>
      </div>
      <div class="tm-info-item">
        <div class="tm-info-value">~3 ${t('time_min')}</div>
        <div class="tm-info-label">${t('tasks_review_time')}</div>
      </div>
    </div>


    <!-- Steps -->
    ${status === 'none' || status === 'in_progress' ? `
    <div class="tm-steps">
      <div class="tm-steps-title">${t('tasks_how_to')}</div>
      ${getInstructions(task).map((s, i) => {
        const done = status === 'in_progress' && i === 0;
        return `<div class="tm-step ${done ? 'done' : ''}"><span class="tm-step-num">${done ? '✓' : i + 1}</span><span>${s}</span></div>`;
      }).join('')}
    </div>` : ''}

    <!-- Comment / Reaction block (only after starting; reactions get a distinct UI to avoid the
         "post as comment" misread — no Copy button, no 30-min timer, dedicated title and hint) -->
    ${status === 'in_progress' && completion?.assigned_comment ? (
      (task.comment_type === 'reaction' || task.action === 'react' || task.action === 'reaction_rec') ? `
    <div class="tm-comment-box tm-reaction-box">
      <div class="tm-comment-label">${t('tasks_reaction_title')}</div>
      <div class="tm-comment-content">
        <div class="tm-comment-text tm-reaction-emoji" id="assignedCommentText" style="font-size:36px;line-height:1;text-align:center;">${escHtml(completion.assigned_comment)}</div>
      </div>
      <div class="tm-comment-hint" style="color:var(--accent);font-weight:500;">${t('tasks_reaction_hint')}</div>
    </div>` : (task.comment_type === 'vote' || task.action === 'vote' || task.action === 'join_vote') ? `
    <div class="tm-comment-box tm-reaction-box">
      <div class="tm-comment-label">${t('tasks_vote_title')}</div>
      <div class="tm-comment-content">
        <div class="tm-comment-text tm-reaction-emoji" id="assignedCommentText" style="font-size:48px;line-height:1;text-align:center;font-weight:700;color:var(--accent);">№${escHtml(completion.assigned_comment)}</div>
      </div>
      <div class="tm-comment-hint" style="color:var(--accent);font-weight:500;">${t('tasks_vote_hint')}</div>
    </div>` : `
    <div class="tm-comment-box">
      <div class="tm-comment-label">${t('tasks_comment_title')}</div>
      <div class="tm-comment-content">
        <div class="tm-comment-text" id="assignedCommentText">${escHtml(completion.assigned_comment)}</div>
        <button class="btn btn-primary btn-sm tm-comment-copy" onclick="navigator.clipboard.writeText(document.getElementById('assignedCommentText').textContent);showToast(t('tasks_comment_copied'),'success');this.innerHTML='✓ Copied'">${t('tasks_comment_copy')}</button>
      </div>
      <div class="tm-comment-hint">${getCommentHint(task)}</div>
      <div class="tm-comment-timer" id="commentTimer"></div>
    </div>`
    ) : ''}

    <!-- Target link (only after starting task) -->
    ${status === 'in_progress' ? `
    <div class="tm-link-box">
      <div class="tm-link-label">${t('tasks_target_link')}</div>
      <div class="tm-link-row">
        <a href="${escHtml(targetHref)}" target="_blank" rel="noopener" class="tm-link">${escHtml(task.target_url)}</a>
        <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${escHtml(task.target_url)}');showToast(t('tasks_link_copied'),'success')">${t('tasks_copy')}</button>
      </div>
    </div>

    <div class="tm-warning" ${_apiCheckEnabled === 1 ? 'style="display:none"' : ''}>
      <div class="tm-warning-row">
        <svg class="tm-warning-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div class="tm-warning-text">${t('tasks_warning_fake')}</div>
      </div>
    </div>` : ''}

    <!-- Action area -->
    <div id="taskActionArea">
      ${renderTaskAction(task, completion)}
    </div>
  </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeTaskModal(); });
  if (status === 'in_progress') {
    setTimeout(initUploadHandlers, 50);
    // Start 30-min countdown timer for comment tasks
    if (completion?.assigned_comment && completion?.started_at) {
      startCommentTimer(completion.started_at);
    }
  }
}

function renderTaskAction(task, completion) {
  const status = completion?.status || 'none';
  const color = PLATFORM_COLORS[task.platform] || '#ea580c';

  // Reported as broken link — closed for this user, no retry, no start button
  if (status === 'link_dead') {
    return `
    <div class="tm-action">
      <div class="tm-status-bar rejected">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ${t('tasks_status_link_dead') || 'You reported this link as broken — the task is closed for you.'}
      </div>
    </div>`;
  }

  // NOT STARTED / CANCELLED / ABANDONED / SKIPPED — all retryable
  if (status === 'none' || status === 'cancelled' || status === 'abandoned' || status === 'skipped') {
    return `
    <div class="tm-action tm-action-sticky">
      <button class="btn btn-primary" id="startTaskBtn" onclick="startTask(${task.id})" style="width:100%;padding:14px 24px;font-size:var(--font-base)">
        ${t('tasks_start_btn')} — ${fmtPrice(task.worker_reward || task.cost_per_task)}
      </button>
      <div class="tm-action-hint">${t('tasks_start_hint')}</div>
    </div>`;
  }

  // IN PROGRESS
  if (status === 'in_progress') {
    return `
    <div class="tm-action">
      <div class="tm-status-bar in-progress">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        ${t('tasks_status_in_progress')}
      </div>

      ${_apiCheckEnabled === 1 ? `
      <div class="tm-upload" id="apiCheckBox" style="margin-bottom:10px;border:1px solid var(--accent);border-radius:12px;padding:14px">
        <div class="tm-upload-title">⚡ ${t('tasks_api_check_title')}</div>
        <div style="font-size:var(--font-xs);color:var(--text-muted);margin:6px 0 10px">${(task.action || '').indexOf('comment') === 0 ? t('tasks_api_check_desc_comment') : t('tasks_api_check_desc')}</div>
        <button class="btn btn-primary" style="width:100%" id="apiCheckBtn" onclick="apiCheckTask(${task.id}, '${task.platform}', '${task.action}')">${(task.action || '').indexOf('comment') === 0 ? t('tasks_api_check_btn_comment') : t('tasks_api_check_btn')}</button>
        <div id="apiCheckMsg" style="display:none;margin-top:8px;font-size:var(--font-xs);line-height:1.45"></div>
      </div>` : ''}
      <div class="tm-upload" id="screenshotUpload" ${_apiCheckEnabled === 1 ? 'style="display:none"' : ''}>
        <div class="tm-upload-title">${t('tasks_upload_title')}</div>

        <div class="upload-dropzone" id="uploadDropzone">
          <svg class="upload-icon-desktop" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <svg class="upload-icon-mobile" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r="1"/></svg>
          <div class="upload-text-desktop">${t('tasks_upload_drag')}</div>
          <div class="upload-text-mobile">${t('tasks_upload_tap')}</div>
          <div class="upload-hint">${t('tasks_upload_formats')}</div>
          <input type="file" id="screenshotInput" accept=".jpg,.jpeg,.png,.webp" style="display:none">
        </div>

        <div id="uploadPreview" class="tm-preview" style="display:none">
          <img id="previewImg" class="tm-preview-img">
          <div class="tm-preview-info">
            <span id="uploadFileName"></span>
            <button class="btn btn-secondary btn-sm" onclick="clearUpload()">${t('tasks_change_file')}</button>
          </div>
        </div>

        <div id="uploadProgress" style="display:none" class="tm-uploading">
          <div class="upload-progress-bar"><div class="upload-progress-fill" id="uploadProgressFill"></div></div>
          <div class="tm-uploading-text">${t('tasks_uploading')}</div>
        </div>
      </div>

      <div class="tm-tips" ${_apiCheckEnabled === 1 ? 'style="display:none"' : ''}>
        <div class="tm-tips-title">${t('tasks_tips_title')}</div>
        <div class="tm-tip">${t('tasks_tip_1')}</div>
        <div class="tm-tip">${t('tasks_tip_2')}</div>
        <div class="tm-tip">${t('tasks_tip_3')}</div>
        <div class="tm-tip">${t('tasks_tip_4')}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="cancelTask(${task.id})" style="width:100%;opacity:.5;font-size:var(--font-xs);margin-bottom:8px">${t('tasks_cancel')}</button>
      <button class="btn btn-secondary btn-sm" onclick="reportTask(${task.id})" style="width:100%;opacity:.5;font-size:var(--font-xs);margin-bottom:8px">${t('tasks_report_btn')}</button>

      <div class="tm-action-sticky" ${_apiCheckEnabled === 1 ? 'style="display:none"' : ''}>
        <button class="btn btn-primary" style="width:100%" id="submitProofBtn" onclick="submitTask(${task.id})">
          ${t('tasks_submit_proof')}
        </button>
      </div>
    </div>`;
  }


  // PENDING REVIEW
  if (status === 'pending_review') {
    return `
    <div class="tm-action">
      <div class="tm-status-bar pending">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        ${t('tasks_status_pending')}
      </div>

      ${completion.screenshot_path ? `
      <div class="tm-screenshot-preview">
        <img src="${completion.screenshot_path}" class="tm-preview-img">
        <div class="tm-submitted-at">${t('tasks_submitted')}: ${timeAgo(completion.submitted_at)}</div>
      </div>` : ''}

      <div class="tm-what-next">
        <div class="tm-what-next-title">${t('tasks_what_next')}</div>
        <div class="tm-what-next-item">${t('tasks_next_1')}</div>
        <div class="tm-what-next-item">${t('tasks_next_2')}</div>
        <div class="tm-what-next-item">${t('tasks_next_3')}</div>
      </div>

      <div class="tm-nav-btns">
        <button class="btn btn-secondary btn-sm" onclick="closeTaskModal();Router.navigate('/tasks')" style="flex:1">${t('tasks_browse_more')}</button>
        <button class="btn btn-primary btn-sm" onclick="closeTaskModal();Router.navigate('/my-tasks')" style="flex:1">${t('tasks_go_my_tasks')}</button>
      </div>
    </div>`;
  }

  // APPROVED
  if (status === 'approved') {
    return `
    <div class="tm-action">
      <div class="tm-status-bar approved">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
        ${t('tasks_status_approved')} — +${fmtPrice(task.worker_reward || task.cost_per_task)}
      </div>
      <div class="tm-nav-btns">
        <button class="btn btn-primary" onclick="closeTaskModal();Router.navigate('/tasks')" style="flex:1">${t('tasks_earn_more')}</button>
      </div>
    </div>`;
  }

  // REJECTED
  if (status === 'rejected') {
    return `
    <div class="tm-action">
      <div class="tm-status-bar rejected">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
        ${t('tasks_status_rejected')}
      </div>
      ${completion.ai_reason ? `<div class="tm-reject-reason"><strong>${t('tasks_reason')}:</strong> ${escHtml(completion.ai_reason)}</div>` : ''}
      <button class="btn btn-primary" onclick="startTask(${task.id})" style="width:100%;margin-top:8px">${t('tasks_try_again')}</button>
    </div>`;
  }
  // Unknown/future status — never leave the modal without an explanation
  return `
  <div class="tm-action">
    <div class="tm-status-bar">
      ${t('tasks_status_generic') || 'This task is not available for you anymore.'}
    </div>
  </div>`;

}

function getInstructions(task) {
  // Platform-specific overrides: when generic instructions ("Tap the reaction shown above")
  // aren't enough because the platform's UX is unfamiliar to most workers, we walk them
  // through the exact action. Add new branches here as needed.
  if (task.platform === 'max' && task.action === 'react') {
    // MAX is a Russian messenger most non-CIS workers haven't used. Spell out the
    // long-press gesture and screenshot framing so they don't fail on UX confusion.
    return [
      t('tasks_step_max_open'),
      t('tasks_step_max_react'),
      t('tasks_step_max_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'max' && task.action === 'bot_start') {
    // MAX bot start — Telegram-style bot launch. Worker opens the bot link,
    // taps "Start" inside the bot chat, screenshots the chat showing the bot
    // greeting message + their MAX profile in the header.
    return [
      t('tasks_step_max_open'),
      t('tasks_step_max_bot_start'),
      t('tasks_step_max_bot_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'max' && task.action === 'share') {
    // MAX share — Telegram-style forward/share. Worker opens the post link,
    // taps the share/forward icon, selects a chat or copy link, screenshots
    // either the share menu or the confirmation that the post was forwarded.
    return [
      t('tasks_step_max_open'),
      t('tasks_step_max_share'),
      t('tasks_step_max_share_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'telegram' && task.action === 'vote') {
    // Telegram poll vote. Worker opens the post, finds the poll, taps the option
    // matching the number shown in the "Vote for option №X" block above.
    return [
      t('tasks_step_open_link'),
      t('tasks_step_tg_vote'),
      t('tasks_step_vote_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'telegram' && task.action === 'join_vote') {
    // Telegram join + vote. Worker must first join the channel (private polls
    // require membership), then vote for the option shown above.
    return [
      t('tasks_step_open_link'),
      t('tasks_step_tg_join_first'),
      t('tasks_step_tg_vote'),
      t('tasks_step_vote_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'max' && task.action === 'vote') {
    // MAX poll vote. Worker opens the message in MAX, finds the poll, taps the
    // option matching the number shown above.
    return [
      t('tasks_step_max_open'),
      t('tasks_step_max_vote'),
      t('tasks_step_vote_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'tiktok' && task.action === 'share') {
    // TikTok share = arrow icon on the right side → pick "Copy link" or
    // "Send to friends". Generic "share the post" is not enough — workers
    // don't know which button is the share button on TikTok specifically.
    return [
      t('tasks_step_share_tiktok_open'),
      t('tasks_step_share_tiktok_action'),
      t('tasks_step_share_tiktok_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'instagram' && task.action === 'share') {
    // Instagram share = paper-plane icon under the post → DM / Add to Story / Copy link.
    // Workers may try to confuse "DM their own message" with "actually sharing the post" —
    // make it explicit that the screenshot must show the share dialog or sent confirmation.
    return [
      t('tasks_step_share_instagram_open'),
      t('tasks_step_share_instagram_action'),
      t('tasks_step_share_instagram_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'youtube' && task.action === 'share') {
    // YouTube share = arrow icon below the video → opens system share menu with
    // Copy link / WhatsApp / Telegram / etc. Calling out the arrow location and
    // common destinations helps workers find the right control across mobile/desktop.
    return [
      t('tasks_step_share_youtube_open'),
      t('tasks_step_share_youtube_action'),
      t('tasks_step_share_youtube_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'facebook' && task.action === 'share') {
    // Facebook share offers several distinct flows (Public timeline post, Story,
    // Messenger DM, Group, Copy link) — list the common ones so workers can pick
    // the easiest path. Public "Share now" is the highest-value but Copy link is
    // also accepted; either should be visible in the screenshot.
    return [
      t('tasks_step_share_facebook_open'),
      t('tasks_step_share_facebook_action'),
      t('tasks_step_share_facebook_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'threads' && task.action === 'share') {
    // Threads share = paper-plane icon under the post. Repost is the strongest
    // signal (puts post on user's Threads timeline) but Copy link / Send via
    // Direct / Story are also valid — match Instagram's UX since Threads inherits it.
    return [
      t('tasks_step_share_threads_open'),
      t('tasks_step_share_threads_action'),
      t('tasks_step_share_threads_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'vkontakte' && task.action === 'share') {
    // VK share = arrow under the post → "To my page" (repost to wall) is the
    // canonical action, but VK also offers "In a message" / "In a community" /
    // "Copy link" — list all so workers know which counts as a valid share.
    return [
      t('tasks_step_share_vkontakte_open'),
      t('tasks_step_share_vkontakte_action'),
      t('tasks_step_share_vkontakte_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'linkedin' && task.action === 'share') {
    // LinkedIn share = "Share" affordance under the post; modern LinkedIn UI offers
    // "Repost with your thoughts" / plain "Repost" / "Send" (DM) / "Copy link".
    // Repost is highest signal, but the others are accepted too.
    return [
      t('tasks_step_share_linkedin_open'),
      t('tasks_step_share_linkedin_action'),
      t('tasks_step_share_linkedin_screenshot'),
      t('tasks_step_upload'),
    ];
  }
  if (task.platform === 'quora' && task.action === 'share') {
    // Quora share = arrow under the answer → social-network shortcuts (Twitter,
    // Facebook, LinkedIn, Email) + Copy link. There is no native "repost" — share
    // means broadcasting the link via one of these external channels.
    return [
      t('tasks_step_share_quora_open'),
      t('tasks_step_share_quora_action'),
      t('tasks_step_share_quora_screenshot'),
      t('tasks_step_upload'),
    ];
  }

  const map = {
    follow: [t('tasks_step_open_link'), t('tasks_step_follow'), t('tasks_step_screenshot_follow'), t('tasks_step_upload')],
    subscribe: [t('tasks_step_open_link'), t('tasks_step_subscribe'), t('tasks_step_screenshot_sub'), t('tasks_step_upload')],
    like: [t('tasks_step_open_link'), t('tasks_step_like'), t('tasks_step_screenshot_like'), t('tasks_step_upload')],
    comment: [t('tasks_step_copy_comment'), t('tasks_step_open_link'), t('tasks_step_comment'), t('tasks_step_screenshot_comment'), t('tasks_step_upload')],
    comment_custom: [t('tasks_step_copy_comment'), t('tasks_step_open_link'), t('tasks_step_comment_custom'), t('tasks_step_screenshot_comment'), t('tasks_step_upload')],
    comment_emoji: [t('tasks_step_copy_comment'), t('tasks_step_open_link'), t('tasks_step_comment_emoji'), t('tasks_step_screenshot_comment'), t('tasks_step_upload')],
    comment_crypto: [t('tasks_step_copy_comment'), t('tasks_step_open_link'), t('tasks_step_comment'), t('tasks_step_screenshot_comment'), t('tasks_step_upload')],
    review: [t('tasks_step_copy_comment'), t('tasks_step_open_link'), t('tasks_step_review'), t('tasks_step_screenshot_review'), t('tasks_step_upload')],
    view: [t('tasks_step_open_link'), t('tasks_step_view'), t('tasks_step_screenshot_view'), t('tasks_step_upload')],
    story_view: [t('tasks_step_open_link'), t('tasks_step_story'), t('tasks_step_screenshot_story'), t('tasks_step_upload')],
    retweet: [t('tasks_step_open_link'), t('tasks_step_retweet'), t('tasks_step_screenshot_retweet'), t('tasks_step_upload')],
    join: [t('tasks_step_open_link'), t('tasks_step_join'), t('tasks_step_screenshot_join'), t('tasks_step_upload')],
    connection: [t('tasks_step_open_link'), t('tasks_step_connect'), t('tasks_step_screenshot_connect'), t('tasks_step_upload')],
    react: [t('tasks_step_open_link'), t('tasks_step_react'), t('tasks_step_screenshot_react'), t('tasks_step_upload')],
    reaction_rec: [t('tasks_step_open_link'), t('tasks_step_react'), t('tasks_step_screenshot_react'), t('tasks_step_upload')],
    share: [t('tasks_step_open_link'), t('tasks_step_share'), t('tasks_step_screenshot_share'), t('tasks_step_upload')],
  };
  return map[task.action] || [t('tasks_step_open_link'), t('tasks_step_generic'), t('tasks_step_screenshot_generic'), t('tasks_step_upload')];
}

function getCommentHint(task) {
  if (task.comment_type === 'custom' || task.action === 'comment_custom') return t('tasks_comment_hint_custom');
  if (task.comment_type === 'emoji' || task.action === 'comment_emoji') return t('tasks_comment_hint_emoji');
  if (task.comment_type === 'reaction' || task.action === 'react' || task.action === 'reaction_rec') return t('tasks_reaction_hint');
  if (task.comment_type === 'crypto' || task.action === 'comment_crypto') return t('tasks_comment_hint_crypto');
  if (task.comment_type === 'review' || task.action === 'review') return t('tasks_comment_hint_review');
  return t('tasks_comment_hint_random');
}

function isCommentAction(action) {
  return ['comment', 'comment_custom', 'comment_emoji', 'comment_crypto', 'review'].includes(action);
}

let _commentTimerInterval = null;
function startCommentTimer(startedAt) {
  if (_commentTimerInterval) clearInterval(_commentTimerInterval);
  const timerEl = document.getElementById('commentTimer');
  if (!timerEl) return;

  const startMs = new Date(startedAt + 'Z').getTime();
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const endMs = startMs + TIMEOUT_MS;

  function updateTimer() {
    const remaining = endMs - Date.now();
    if (remaining <= 0) {
      timerEl.innerHTML = `<span class="timer-expired">${t('tasks_comment_expired')}</span>`;
      clearInterval(_commentTimerInterval);
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const pct = Math.max(0, (remaining / TIMEOUT_MS) * 100);
    const color = pct > 30 ? 'var(--accent)' : pct > 10 ? '#f59e0b' : '#ef4444';
    timerEl.innerHTML = `
      <div class="timer-bar"><div class="timer-fill" style="width:${pct}%;background:${color}"></div></div>
      <div class="timer-text">${t('tasks_comment_timer')}: ${mins}:${secs.toString().padStart(2,'0')}</div>`;
  }
  updateTimer();
  _commentTimerInterval = setInterval(updateTimer, 1000);
}

// === ACTIONS ===
const _MULTI_ACC_PLATFORMS = ['instagram', 'tiktok', 'youtube'];

async function startTask(taskId, explicitAccountId) {
  const btn = document.getElementById('startTaskBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>'; }
  try {
    // Single roundtrip: server resolves default/fallback account, creates the
    // completion and returns the full task+completion record. Only falls back
    // to the picker (with another POST after user selects) when the platform
    // is multi AND user has >1 approved AND no default set.
    const body = explicitAccountId ? { social_account_id: explicitAccountId } : {};
    const resp = await fetch('/api/tasks/' + taskId + '/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (resp.status === 409 && data.code === 'PICK_ACCOUNT_REQUIRED' && Array.isArray(data.accounts)) {
      _showAccountPicker(taskId, data.platform, data.accounts);
      return;
    }
    if (resp.status === 429 && data.code === 'HOURLY_LIMIT') {
      _showHourlyLimitModal(data);
      return;
    }
    if (!resp.ok) {
      showToast(data.error || 'Error', 'error');
      return;
    }
    if (data.ok && data.task && data.completion) {
      showToast(t('tasks_started'), 'success');
      applyApiCheckFlag(data);
      showTaskModal(data.task, data.completion);
      // Ask the /tasks Router (if mounted) to remove the just-claimed card from the
      // feed and decrement the platform chip counter. window.__tasksRemoveFromFeed
      // is set by Router.register('tasks') and stays alive while the page is open.
      // No-op on other routes, no extra API call. Backend cache TTL 20s catches up.
      if (typeof window !== 'undefined' && typeof window.__tasksRemoveFromFeed === 'function') {
        window.__tasksRemoveFromFeed(taskId, data.task.platform);
      }
    }
  } catch (e) {
    showToast(e.message || 'Network error', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = t('tasks_start') || 'Start'; }
  }
}

// Modal to pick which multi-platform account to use for this task.
// Hides the underlying taskModal to avoid double-overlay visual mess.
// On account pick → calls startTask(taskId, accountId). On cancel → restores taskModal.
// Modal shown when /tasks/:id/start returns 429 + code='HOURLY_LIMIT'.
// Same look as the account picker — minimal markup, dismissable.
function _showHourlyLimitModal(data) {
  document.getElementById('hourlyLimitModal')?.remove();
  const taskModal = document.getElementById('taskModal');
  if (taskModal) taskModal.style.display = 'none';

  const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const platform = data.platform || '';
  const action = data.action || '';
  const limit = data.limit || 0;
  const minutes = data.retry_after_min || 1;

  const title = t('tasks_hourly_limit_title') || 'Hourly limit reached';
  const bodyTemplate = t('tasks_hourly_limit_body')
    || 'You\'ve completed {limit} {platform} {action} tasks this hour. Try again in ~{minutes} min, or pick a different platform.';
  const body = bodyTemplate
    .replace('{limit}', limit)
    .replace('{platform}', platform)
    .replace('{action}', action)
    .replace('{minutes}', minutes);

  const modal = document.createElement('div');
  modal.id = 'hourlyLimitModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:10010;padding:16px';
  modal.innerHTML = `
    <div class="account-picker-box" style="text-align:center">
      <div style="font-size:42px;margin-bottom:8px">⏱</div>
      <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:var(--text-primary)">${esc(title)}</h3>
      <p style="color:var(--text-muted);font-size:14px;margin:0 0 18px;line-height:1.5">${esc(body)}</p>
      <button class="btn btn-primary" style="width:100%" onclick="document.getElementById('hourlyLimitModal').remove()">${esc(t('common_ok') || 'OK')}</button>
    </div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _showAccountPicker(taskId, platform, accounts) {
  document.getElementById('accountPickerModal')?.remove();

  // Hide any existing task modal so only the picker is visible on top
  const taskModal = document.getElementById('taskModal');
  const wasVisible = taskModal && taskModal.style.display !== 'none';
  if (taskModal) taskModal.style.display = 'none';

  const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const modal = document.createElement('div');
  modal.id = 'accountPickerModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:10010;padding:16px';

  modal.innerHTML = `
    <div class="account-picker-box">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
        <h3 style="margin:0;font-size:18px;font-weight:700;color:var(--text-primary)">${t('tasks_pick_account') || 'Choose account'}</h3>
        <button aria-label="Close" style="background:none;border:none;color:var(--text-muted);font-size:22px;line-height:1;cursor:pointer;padding:0 4px" onclick="__closeAccountPicker()">×</button>
      </div>
      <p style="color:var(--text-muted);font-size:13px;margin:0 0 18px;line-height:1.5">
        ${(t('tasks_pick_account_hint') || 'Select which {platform} account to use for this task').replace('{platform}', platform)}
      </p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${accounts.map(a => `
          <button class="account-picker-item" onclick="__closeAccountPicker();startTask(${taskId}, ${a.id})">
            <span style="display:flex;align-items:center;gap:8px;font-weight:600;min-width:0;flex:1">
              ${a.is_default ? '<span style="color:#f59e0b;font-size:16px;line-height:1;flex-shrink:0">★</span>' : ''}
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">@${esc(a.username)}</span>
            </span>
            ${a.task_count ? `<span style="font-size:11px;color:var(--text-muted);flex-shrink:0;margin-left:8px">${a.task_count} ${t('profile_tasks_done') || 'tasks'}</span>` : ''}
          </button>
        `).join('')}
      </div>
      <button class="account-picker-cancel" onclick="__closeAccountPicker()">
        ${t('common_cancel') || 'Cancel'}
      </button>
    </div>`;

  // Close helper: remove picker AND restore task modal
  window.__closeAccountPicker = function() {
    document.getElementById('accountPickerModal')?.remove();
    const tm = document.getElementById('taskModal');
    if (tm && wasVisible) tm.style.display = '';
  };

  // Click on overlay (outside the box) closes as cancel
  modal.addEventListener('click', (e) => { if (e.target === modal) window.__closeAccountPicker(); });

  document.body.appendChild(modal);
}

async function submitTask(taskId) {
  const input = document.getElementById('screenshotInput');
  if (!input?.files[0]) { showToast(t('tasks_select_screenshot'), 'error'); return; }

  const submitBtn = document.getElementById('submitProofBtn');
  const previewEl = document.getElementById('uploadPreview');
  const progressEl = document.getElementById('uploadProgress');
  if (previewEl) previewEl.style.display = 'none';
  if (progressEl) progressEl.style.display = 'block';

  const formData = new FormData();
  formData.append('screenshot', input.files[0]);

  try {
    // Use XHR for upload progress
    const data = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/tasks/' + taskId + '/submit');
      xhr.withCredentials = true;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          const fill = document.getElementById('uploadProgressFill');
          if (fill) fill.style.width = pct + '%';
        }
      };
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) reject(new Error(res.error));
        else resolve(res);
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });

    showToast(t('tasks_submitted_success'), 'success');
    const taskData = await API.request('GET', '/tasks/' + taskId);
    applyApiCheckFlag(taskData);
    showTaskModal(taskData.task, taskData.completion);
  } catch (e) {
    showToast(e.message, 'error');
    if (progressEl) progressEl.style.display = 'none';
    if (previewEl) previewEl.style.display = 'block';
  }
}


let _apiCheckCooldown = null;

let _apiCheckEnabled = null;
let _apiCheckConfirmed = false; // true only once the server actually answered
function applyApiCheckFlag(data) {
  // Authoritative: the flag rides along with the task response itself, so it
  // cannot blip on a separate request. When present it wins over any preload.
  if (data && typeof data.api_check_enabled !== 'undefined') {
    _apiCheckEnabled = data.api_check_enabled === 1 ? 1 : 0;
    _apiCheckConfirmed = true;
  }
}
async function ensureApiCheckFlag() {
  if (_apiCheckConfirmed) return _apiCheckEnabled;
  // Retry the flag request — a single network blip must NOT silently drop the
  // worker into the screenshot flow while the server mode is still API-check.
  for (let i = 0; i < 3; i++) {
    try {
      const r = await API.request('GET', '/tasks/api-check-enabled');
      if (r && typeof r.enabled !== 'undefined') {
        _apiCheckEnabled = r.enabled === 1 ? 1 : 0;
        _apiCheckConfirmed = true;
        try { localStorage.setItem('pr_apicheck_enabled', String(_apiCheckEnabled)); } catch (e) { /* ignore */ }
        return _apiCheckEnabled;
      }
    } catch (e) { /* retry */ }
    await new Promise((res) => setTimeout(res, 300 * (i + 1)));
  }
  // Still no answer: fall back to the last value the server gave us (or assume
  // API-check ON), and DO NOT mark confirmed so the next openTask retries.
  let fb = 1;
  try {
    const saved = localStorage.getItem('pr_apicheck_enabled');
    if (saved !== null) fb = Number(saved);
  } catch (e) { /* ignore */ }
  _apiCheckEnabled = fb;
  return fb;
}

async function apiCheckTask(taskId, platform, action) {
  // Twitter follow uses its own shorter memo texts (keys suffixed _x).
  const _twx = (k) => (platform === 'twitter' ? t(k + '_x') : platform === 'instagram' ? t(k + '_ig') : t(k));
  const btn = document.getElementById('apiCheckBtn');
  const msg = document.getElementById('apiCheckMsg');
  const box = document.getElementById('apiCheckBox');
  if (!btn || !box) return;
  btn.disabled = true;
  const origLabel = t('tasks_api_check_btn');
  btn.textContent = t('tasks_api_check_checking');
  const show = (text, color, asHtml) => { msg.style.display = 'block'; msg.style.color = color || 'var(--text-muted)'; if (asHtml) { msg.innerHTML = text; } else { msg.textContent = text; } };
  const accName = (data) => escHtml((data && data.account) || '');
  const reEnable = (sec) => {
    clearInterval(_apiCheckCooldown);
    let leftSec = sec;
    btn.textContent = origLabel + ' (' + leftSec + 's)';
    _apiCheckCooldown = setInterval(() => {
      leftSec--;
      if (leftSec <= 0) { clearInterval(_apiCheckCooldown); btn.disabled = false; btn.textContent = origLabel; }
      else btn.textContent = origLabel + ' (' + leftSec + 's)';
    }, 1000);
  };
  try {
    const data = await API.request('POST', '/tasks/' + taskId + '/api-check');
    if (data.eligible === false) {
      box.style.display = 'none';
      const su = document.getElementById('screenshotUpload');
      if (su) su.style.display = '';
      document.querySelectorAll('.tm-tips, .tm-action-sticky').forEach((el) => { el.style.display = ''; });
      _apiCheckEnabled = 0;
      return;
    }
    if (data.found === true && data.approved) {
      showToast(t('tasks_api_check_success'), 'success');
      closeTaskModal();
      loadTasks();
      return;
    }
    const code = data.code || '';
    if (code === 'rechecking') { show(platform === 'instagram' ? t('tasks_api_check_rechecking_ig') : t('tasks_api_check_rechecking'), 'var(--text-muted)'); reEnable(30); return; }
    if (code === 'cooldown') {
      btn.style.display = 'none';
      let hrs = data.hours ? String(data.hours) : '';
      if (!hrs && data.until) {
        const msLeft = new Date(String(data.until).replace(' ', 'T')).getTime() - Date.now();
        if (msLeft > 0) hrs = String(Math.max(1, Math.ceil(msLeft / 3600000)));
      }
      show(_twx('tasks_api_check_cooldown').replace(/{account}/g, accName(data)).replace(/{hours}/g, hrs || '…'), 'var(--warning, #f59e0b)', true);
      return;
    }
    if (code === 'unlinked') {
      btn.style.display = 'none';
      show(_twx('tasks_api_check_unlinked').replace(/{account}/g, accName(data)), 'var(--danger, #ef4444)', true);
      return;
    }
    if (code === 'too_fast') { show(t('tasks_api_check_too_fast'), 'var(--warning, #f59e0b)'); reEnable(Math.min(60, data.wait || 15)); return; }
    if (code === 'private') { btn.style.display = 'none'; show(_twx('tasks_api_check_private'), 'var(--warning, #f59e0b)'); return; }
    if (code === 'attempts_exhausted') { btn.style.display = 'none'; show(t('tasks_api_check_use_screenshot'), 'var(--warning, #f59e0b)'); return; }
    if (code === 'busy' || data.found === null) { show(t('tasks_api_check_busy'), 'var(--text-muted)'); reEnable(30); return; }
    if (code === 'comment_rejected') { btn.style.display = 'none'; show(t('tasks_api_check_comment_rejected').replace(/{account}/g, accName(data)), 'var(--danger, #ef4444)', true); return; }
    if (code === 'comment_not_found') { show(t('tasks_api_check_comment_not_found').replace(/{account}/g, accName(data)), 'var(--danger, #ef4444)', true); reEnable(30); return; }
    // not_found -> full instruction (app / VPN / shadow-ban)
    const left = typeof data.attempts_left === 'number' ? data.attempts_left : null;
    show(_twx('tasks_api_check_not_found').replace(/{account}/g, accName(data)), 'var(--danger, #ef4444)', true);
    reEnable(30);
  } catch (e) {
    show(t('tasks_api_check_busy'), 'var(--text-muted)');
    reEnable(30);
  }
}

async function cancelTask(taskId) {
  try {
    await API.request('POST', '/tasks/' + taskId + '/cancel');
    showToast(t('tasks_cancelled'), 'info');
    closeTaskModal();
  } catch (e) { showToast(e.message, 'error'); }
}

async function reportTask(taskId) {
  const title = t('tasks_report_confirm_title') || 'Report this task?';
  const body  = t('tasks_report_confirm_body')  || 'The task will be removed from your list. You will not receive any reward. Continue?';
  if (!confirm(title + '\n\n' + body)) return;
  try {
    await API.request('POST', '/tasks/' + taskId + '/report-task');
    showToast(t('tasks_report_btn'), 'info');
    closeTaskModal();
  } catch (e) { showToast(e.message, 'error'); }
}

function closeTaskModal() { document.getElementById('taskModal')?.remove(); }

function initUploadHandlers() {
  const dropzone = document.getElementById('uploadDropzone');
  const input = document.getElementById('screenshotInput');
  if (!dropzone || !input) return;

  dropzone.addEventListener('click', () => input.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault(); dropzone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; handleFile(e.dataTransfer.files[0]); }
  });
  input.addEventListener('change', () => { if (input.files[0]) handleFile(input.files[0]); });

  function handleFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      showToast(t('tasks_file_too_large'), 'error'); return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showToast(t('tasks_invalid_format'), 'error'); return;
    }
    // Compress via canvas: max 1600px, JPEG 80%
    compressImage(file, 1600, 0.8).then(({ dataUrl, blob }) => {
      document.getElementById('previewImg').src = dataUrl;
      document.getElementById('uploadFileName').textContent = `${file.name} (${(blob.size / 1024).toFixed(0)} KB)`;
      // Replace input file with compressed blob
      const dt = new DataTransfer();
      dt.items.add(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
      input.files = dt.files;
      dropzone.style.display = 'none';
      document.getElementById('uploadPreview').style.display = 'block';
    });
  }

  function compressImage(file, maxSize, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          const ratio = Math.min(maxSize / w, maxSize / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          resolve({ dataUrl: URL.createObjectURL(blob), blob });
        }, 'image/jpeg', quality);
      };
      img.src = URL.createObjectURL(file);
    });
  }
}

function clearUpload() {
  const dz = document.getElementById('uploadDropzone');
  const p = document.getElementById('uploadPreview');
  const i = document.getElementById('screenshotInput');
  if (dz) dz.style.display = 'flex';
  if (p) p.style.display = 'none';
  if (i) i.value = '';
}
