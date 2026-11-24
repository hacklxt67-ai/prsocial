Router.register('leaderboard', async (app) => {
  var currentTab = 'workers';
  var currentPage = 1;
  var data = null;

  app.innerHTML = renderSidebar('leaderboard') + '<main class="main-content"><div class="page-header">' + renderHamburger() + '</div><div class="page-content" id="lbContent" style="padding-top:0"><div style="color:var(--text-muted);padding:40px;text-align:center">' + t('loading') + '</div></div></main>';

  async function loadAndRender() {
    try {
      data = await API.request('GET', '/tasks/leaderboard?tab=' + currentTab + '&page=' + currentPage);
    } catch (e) { console.error('Leaderboard error:', e); data = null; }

    var content = document.getElementById('lbContent');
    if (!content) return;
    if (!data || !data.ok) { content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">' + t('lb_error') + '</div>'; return; }

    var html = '';
    var weekEnd = new Date(data.week_end.replace(' ', 'T') + 'Z');
    var weekStart = new Date(data.week_start.replace(' ', 'T') + 'Z');
    var startStr = weekStart.toLocaleDateString(I18N.lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' });
    var endStr = weekEnd.toLocaleDateString(I18N.lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' });
    var totalPrize = data.prizes ? (data.prizes['1st'] + data.prizes['2nd'] + data.prizes['3rd']) : 0;
    var maxPrize = data.prizes ? data.prizes['1st'] : 0;

    // === HEADER ===
    html += '<div class="lb-header">';
    html += '<div><div class="lb-header-title">' + t('lb_title') + '</div>';
    html += '<div class="lb-header-sub">' + startStr + ' — ' + endStr + ' · ' + t('lb_subtitle') + '</div></div>';
    // Honest freshness: the board is a jobs-computed snapshot (every ~5 min),
    // so show WHEN it was built instead of the old "updates live" badge.
    var lbUpd = data.snapshot_at ? new Date(data.snapshot_at).toLocaleTimeString(I18N.lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : null;
    html += '<div class="lb-header-live"><span class="lb-live-dot"></span> ' + (lbUpd ? t('lb_updated_at').replace('{time}', lbUpd) : t('lb_updates_live')) + '</div>';
    html += '</div>';

    // === COMPETITION BANNER ===
    html += '<div class="lb-comp-banner">';
    html += '<div class="lb-comp-left">';
    html += '<div class="lb-comp-label">' + t('lb_this_week') + '</div>';
    html += '<div class="lb-comp-headline">' + t('lb_win_up_to').replace('{amount}', '$' + maxPrize) + '</div>';
    html += '</div>';
    html += '<div class="lb-comp-timer" id="lbTimer"></div>';
    html += '</div>';

    // === PRIZE CARDS ===
    html += '<div class="lb-prize-cards">';
    html += '<div class="lb-prize-card lb-prize-1st"><span class="lb-prize-place">1st</span><span class="lb-prize-label">' + t('lb_winner') + '</span><span class="lb-prize-amount">$' + (data.prizes ? data.prizes['1st'] : 0) + '</span></div>';
    html += '<div class="lb-prize-card lb-prize-2nd"><span class="lb-prize-place">2nd</span><span class="lb-prize-label">' + t('lb_runner_up') + '</span><span class="lb-prize-amount">$' + (data.prizes ? data.prizes['2nd'] : 0) + '</span></div>';
    html += '<div class="lb-prize-card lb-prize-3rd"><span class="lb-prize-place">3rd</span><span class="lb-prize-label">' + t('lb_third_place') + '</span><span class="lb-prize-amount">$' + (data.prizes ? data.prizes['3rd'] : 0) + '</span></div>';
    html += '<div class="lb-prize-card lb-prize-total"><span class="lb-prize-label">' + t('lb_total_pool') + '</span><span class="lb-prize-amount">$' + totalPrize + '</span><svg class="lb-prize-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg></div>';
    html += '</div>';

    // === PODIUM (Top 3) ===
    if (data.page === 1 && data.rows.length >= 3) {
      var top3 = data.rows.slice(0, 3);
      var podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
      var podiumHeights = ['120px', '160px', '100px'];
      var podiumPlaces = [2, 1, 3];
      var podiumColors = ['#C0C0C0', '#FFD700', '#CD7F32'];
      var podiumPrizeKeys = ['2nd', '1st', '3rd'];

      html += '<div class="lb-podium">';
      for (var pi = 0; pi < 3; pi++) {
        var pr = podiumOrder[pi];
        var place = podiumPlaces[pi];
        var prizeVal = data.prizes ? data.prizes[podiumPrizeKeys[pi]] : 0;
        var initial = (pr.username || 'U')[0].toUpperCase();
        var isMe = API.user && pr.user_id === API.user.id;
        var countLabel = currentTab === 'workers' ? t('lb_tasks').toLowerCase() : t('lb_active_referrals').toLowerCase();

        html += '<div class="lb-podium-item">';
        // Crown for #1
        if (place === 1) html += '<div class="lb-podium-crown">&#x1F451;</div>';
        // Avatar
        html += '<div class="lb-podium-avatar" style="border-color:' + podiumColors[pi] + '">';
        if (pr.avatar_url) {
          html += '<img src="' + escHtml(pr.avatar_url) + '">';
        } else {
          html += '<span>' + initial + '</span>';
        }
        html += '<div class="lb-podium-badge" style="background:' + podiumColors[pi] + '">' + place + '</div>';
        html += '</div>';
        // Name + count
        html += '<div class="lb-podium-name' + (isMe ? ' lb-podium-me' : '') + '">' + escHtml(pr.username) + '</div>';
        html += '<div class="lb-podium-count">' + pr.count + ' ' + countLabel + '</div>';
        if (prizeVal > 0) html += '<div class="lb-podium-prize">$' + prizeVal + '</div>';
        // Pedestal
        html += '<div class="lb-podium-pedestal" style="height:' + podiumHeights[pi] + ';background:linear-gradient(180deg, ' + podiumColors[pi] + '22, ' + podiumColors[pi] + '08)">';
        html += '<div class="lb-podium-pedestal-num">' + place + '</div>';
        html += '</div>';
        html += '</div>';
      }
      html += '</div>';
    }

    // === YOUR RANK ===
    var myCount = currentTab === 'workers' ? data.me.tasks : data.me.active_refs;
    var myRank = data.me.worker_rank;
    var myUsername = API.user ? API.user.username : '';
    // Calculate "need X more" — find #3 count from rows
    var top3count = (data.page === 1 && data.rows.length >= 3) ? data.rows[2].count : 0;
    var needMore = (myRank && myRank > 3 && top3count > 0) ? Math.max(0, top3count - myCount + 1) : 0;

    html += '<div class="lb-mypos">';
    html += '<div class="lb-mypos-left">';
    html += '<div class="lb-mypos-badge">' + t('lb_your_rank') + '</div>';
    html += '<div class="lb-mypos-rank">#' + (myRank || '—') + '</div>';
    html += '<div class="lb-mypos-info">';
    html += '<div class="lb-mypos-name">' + escHtml(myUsername) + '</div>';
    if (needMore > 0) {
      html += '<div class="lb-mypos-hint">' + t('lb_need_more').replace('{n}', needMore) + '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '<div class="lb-mypos-right">';
    // Progress bar
    if (myRank && top3count > 0) {
      var pct = Math.min(100, Math.round((myCount / top3count) * 100));
      html += '<div class="lb-mypos-progress-wrap">';
      html += '<div class="lb-mypos-progress-labels"><span>' + myCount + ' ' + t('lb_tasks').toLowerCase() + '</span><span>' + top3count + ' ' + t('lb_to_pass') + '</span></div>';
      html += '<div class="lb-mypos-progress-bar"><div class="lb-mypos-progress-fill" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    }
    html += '<span class="lb-mypos-count">' + myCount + ' <small>' + t('lb_tasks').toLowerCase() + '</small></span>';
    html += '<a href="#tasks" class="lb-mypos-cta">' + t('lb_get_tasks') + ' &rarr;</a>';
    html += '</div></div>';

    // === HOW IT WORKS ===
    html += '<div class="lb-rules">';
    html += '<div class="lb-rules-grid">';
    html += '<div class="lb-rules-item"><div class="lb-rules-icon">1</div><div><div class="lb-rules-strong">' + t('lb_rule_1_title') + '</div><div class="lb-rules-text">' + t('lb_rule_1_desc') + '</div></div></div>';
    html += '<div class="lb-rules-item"><div class="lb-rules-icon">2</div><div><div class="lb-rules-strong">' + t('lb_rule_2_title') + '</div><div class="lb-rules-text">' + t('lb_rule_2_desc') + '</div></div></div>';
    html += '<div class="lb-rules-item"><div class="lb-rules-icon">3</div><div><div class="lb-rules-strong">' + t('lb_rule_3_title') + '</div><div class="lb-rules-text">' + t('lb_rule_3_desc') + '</div></div></div>';
    html += '</div></div>';

    // === TABS ===
    html += '<div class="ref-period-tabs" id="lbTabs" style="margin-bottom:20px">';
    html += '<button class="ref-period-tab ' + (currentTab === 'workers' ? 'active' : '') + '" data-tab="workers">' + t('lb_top_workers') + '</button>';
    html += '<button class="ref-period-tab ' + (currentTab === 'referrers' ? 'active' : '') + '" data-tab="referrers">' + t('lb_top_referrers') + '</button>';
    html += '</div>';

    // === TABLE ===
    var countColLabel = currentTab === 'workers' ? t('lb_tasks') : t('lb_active_referrals');
    var startRank = (data.page - 1) * data.limit;
    var maxCount = (data.rows.length > 0) ? data.rows[0].count : 1;
    var borderColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

    html += '<div class="lb-table-wrap"><table class="lb-table">';
    html += '<thead><tr><th class="lb-th-rank">#</th><th class="lb-th-user">' + t('lb_user') + '</th><th class="lb-th-progress">' + t('lb_progress') + '</th><th class="lb-th-count">' + countColLabel + '</th></tr></thead>';
    html += '<tbody>';

    if (data.rows.length === 0) {
      html += '<tr><td colspan="4" class="lb-empty">' + (currentTab === 'workers' ? t('lb_no_data') : t('lb_no_refs')) + '</td></tr>';
    } else {
      data.rows.forEach(function(row, i) {
        var rank = startRank + i + 1;
        var isMe = API.user && row.user_id === API.user.id;
        var initial = (row.username || 'U')[0].toUpperCase();
        var trClass = 'lb-row';
        if (isMe) trClass += ' lb-row-me';
        if (rank <= 3) trClass += ' lb-row-top3';
        var prizeForRank = (rank <= 3 && data.prizes) ? data.prizes[['1st','2nd','3rd'][rank-1]] : 0;
        var progressPct = Math.min(100, Math.round((row.count / maxCount) * 100));
        var barColor = rank <= 3 ? borderColors[rank - 1] : 'var(--text-muted)';
        var leftBorder = rank <= 3 ? 'border-left:3px solid ' + borderColors[rank - 1] : '';

        html += '<tr class="' + trClass + '" style="' + leftBorder + '">';
        // Rank
        html += '<td class="lb-td-rank">';
        if (rank <= 3) {
          html += '<span class="lb-star" style="color:' + borderColors[rank - 1] + '">&#9733;</span>';
        } else {
          html += '<span class="lb-rank-num">' + rank + '</span>';
        }
        html += '</td>';
        // User
        html += '<td class="lb-td-user"><div class="lb-user-cell">';
        if (row.avatar_url) {
          html += '<img class="lb-avatar" src="' + escHtml(row.avatar_url) + '">';
        } else {
          html += '<div class="lb-avatar lb-avatar-placeholder">' + initial + '</div>';
        }
        html += '<div class="lb-user-info">';
        html += '<span class="lb-username' + (isMe ? ' lb-username-me' : '') + '">' + escHtml(row.username);
        if (isMe) html += ' <span class="lb-you-tag">(' + t('lb_you') + ')</span>';
        html += '</span>';
        if (prizeForRank > 0) {
          html += '<span class="lb-prize-inline">+$' + prizeForRank + '</span>';
        } else if (isMe && needMore > 0) {
          html += '<span class="lb-tasks-to">' + needMore + ' ' + t('lb_tasks_to_3') + '</span>';
        }
        html += '</div></div></td>';
        // Progress bar
        html += '<td class="lb-td-progress"><div class="lb-progress-cell">';
        html += '<span class="lb-progress-label">' + row.count + ' ' + t('lb_tasks').toLowerCase() + '</span>';
        html += '<div class="lb-progress-bar"><div class="lb-progress-fill" style="width:' + progressPct + '%;background:' + barColor + ';opacity:0.6"></div></div>';
        html += '</div></td>';
        // Count
        html += '<td class="lb-td-count' + (rank <= 3 ? ' lb-count-top' : '') + '">' + row.count + '</td>';
        html += '</tr>';
      });
    }
    html += '</tbody></table></div>';

    // === PAGINATION ===
    var totalCapped = Math.min(data.total, 100);
    var totalPages = Math.ceil(totalCapped / data.limit);
    if (totalPages > 1) {
      html += '<div class="lb-pagination">';
      for (var p = 1; p <= totalPages; p++) {
        html += '<button class="lb-page-btn' + (p === data.page ? ' lb-page-active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
      html += '</div>';
    }

    content.innerHTML = html;

    // === EVENT HANDLERS ===
    document.getElementById('lbTabs').addEventListener('click', async function(e) {
      var tab = e.target.closest('.ref-period-tab');
      if (!tab) return;
      currentTab = tab.dataset.tab;
      currentPage = 1;
      await loadAndRender();
    });

    content.querySelectorAll('[data-page]').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        currentPage = parseInt(this.dataset.page);
        await loadAndRender();
        var tabs = document.getElementById('lbTabs');
        if (tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // CTA button
    content.querySelectorAll('.lb-mypos-cta').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        Router.navigate('tasks');
      });
    });

    _startLbTimer(weekEnd);
  }

  await loadAndRender();
});

var _lbTimerInterval = null;
function _startLbTimer(weekEnd) {
  if (_lbTimerInterval) clearInterval(_lbTimerInterval);
  function update() {
    var el = document.getElementById('lbTimer');
    if (!el) { clearInterval(_lbTimerInterval); return; }
    var now = new Date();
    var diff = weekEnd - now;
    if (diff <= 0) { el.innerHTML = '<span class="lb-timer-ended">' + t('lb_week_ended') + '</span>'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = '<div class="lb-timer-label">' + t('lb_ends_in').toUpperCase() + '</div><div class="lb-timer-blocks">' +
      '<div class="lb-timer-block"><span>' + d + '</span><small>' + t('lb_d') + '</small></div>' +
      '<div class="lb-timer-sep">:</div>' +
      '<div class="lb-timer-block"><span>' + String(h).padStart(2, '0') + '</span><small>' + t('lb_h') + '</small></div>' +
      '<div class="lb-timer-sep">:</div>' +
      '<div class="lb-timer-block"><span>' + String(m).padStart(2, '0') + '</span><small>' + t('lb_m') + '</small></div>' +
      '<div class="lb-timer-sep">:</div>' +
      '<div class="lb-timer-block"><span>' + String(s).padStart(2, '0') + '</span><small>' + t('lb_s') + '</small></div>' +
      '</div>';
  }
  update();
  _lbTimerInterval = setInterval(update, 1000);
}
