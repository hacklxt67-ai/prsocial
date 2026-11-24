// /js/pages/recovery.js — Restoration section (10-language i18n)
(function() {
  const API_BASE = '/api/recovery';
  let _recoveryCurrentPage = 1;

  function _t(key, fallback) {
    try { var v = (typeof t === 'function') ? t(key) : null; if (v && v !== key) return v; } catch (_) {}
    return fallback || key;
  }

  async function loadRestoration(app) {
    const main = app || document.getElementById('app') || document.querySelector('main') || document.body;

    // FEATURE CLOSED 2026-05-09 — Recovery section disabled, all restricted users
    // were unblocked. Showing a polite maintenance notice instead of the original
    // restoration flow. To restore: delete this block (down to the next blank line)
    // and the recovery feature will resume from the original code below.
    main.innerHTML = `
      <div class="container" style="padding:60px 24px;text-align:center;max-width:560px;margin:0 auto">
        <div style="font-size:56px;margin-bottom:20px">🛠️</div>
        <h2 style="margin:0 0 14px;font-size:24px;color:var(--text-primary)">${_t('recovery_maintenance_title', 'Section under maintenance')}</h2>
        <p style="margin:0 0 28px;font-size:15px;color:var(--text-secondary);line-height:1.6">${_t('recovery_maintenance_text', 'This section is temporarily closed for technical maintenance. You can continue earning in the Tasks section as usual. Thanks for your patience!')}</p>
        <a href="/tasks" class="btn btn-primary" onclick="event.preventDefault();Router.navigate('/tasks')" style="display:inline-block;padding:11px 28px;background:var(--accent);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${_t('recovery_maintenance_btn', 'Go to Tasks →')}</a>
      </div>`;
    return;

    main.innerHTML = '<div class="container" style="padding:24px"><div style="text-align:center;padding:40px">' + _t('restoration_loading', 'Loading...') + '</div></div>';

    let status, listData;
    try {
      status = await fetch(API_BASE + '/status', { credentials: 'same-origin' }).then(r => r.json());
    } catch (e) {
      main.innerHTML = '<div class="container" style="padding:24px"><div style="color:#ef4444">Network error: ' + e.message + '</div></div>';
      return;
    }

    const isAdmin = (typeof API !== 'undefined' && API.user && API.user.role === 'admin');
    const isRestricted = status.status === 'restricted';

    if (!isRestricted && !isAdmin) { renderLockScreen(main); return; }
    if (isAdmin && !isRestricted && !location.search.includes('preview=1')) {
      renderLockScreen(main, { adminPreviewLink: true });
      return;
    }

    try {
      listData = await fetch(API_BASE + '/list?page=' + _recoveryCurrentPage, { credentials: 'same-origin' }).then(r => r.json());
    } catch (e) {
      main.innerHTML = '<div class="container" style="padding:24px"><div style="color:#ef4444">Failed to load tasks: ' + e.message + '</div></div>';
      return;
    }
    if (!listData.ok) listData = { tasks: [], my_in_progress: [], pagination: { page: 1, total_pages: 1, total: 0 } };
    renderActive(main, status, listData);
  }

  // Render compact pagination (« 1 2 3 ... N ») — only when more than 1 page
  function _renderPagination(p) {
    if (!p || !p.total_pages || p.total_pages <= 1) return '';
    var html = '<div class="recovery-pagination" style="display:flex;justify-content:center;gap:6px;margin-top:20px;flex-wrap:wrap">';
    for (var i = 1; i <= p.total_pages; i++) {
      var isActive = (i === p.page);
      var style = isActive
        ? 'background:#3b82f6;color:#fff;border:1px solid #3b82f6;padding:6px 12px;border-radius:6px;cursor:default;font-weight:600;min-width:36px'
        : 'background:#fff;color:#374151;border:1px solid #d1d5db;padding:6px 12px;border-radius:6px;cursor:pointer;min-width:36px';
      if (isActive) {
        html += '<button style="' + style + '" disabled>' + i + '</button>';
      } else {
        html += '<button style="' + style + '" onclick="restorationGoToPage(' + i + ')">' + i + '</button>';
      }
    }
    html += '</div>';
    return html;
  }

  function renderLockScreen(main, opts) {
    opts = opts || {};
    const sb = (typeof renderSidebar === 'function') ? renderSidebar('recovery') : '';
    main.innerHTML =
      '<div class="app-layout">' + sb + '<main class="main-content">' +
      '<div class="container" style="padding:24px;max-width:700px;margin:0 auto">' +

        '<div style="text-align:center;margin-bottom:32px">' +
          '<div style="font-size:64px;line-height:1;margin-bottom:12px">⛏️</div>' +
          '<h1 style="margin:0 0 6px;font-size:32px;font-weight:700;color:var(--text-primary)">' + _t('restoration_title', 'Restoration') + '</h1>' +
          '<p style="margin:0;color:var(--text-muted);font-size:15px">' + _t('restoration_subtitle_lock', 'Section for accounts under restriction.') + '</p>' +
        '</div>' +

        '<div class="card" style="padding:28px;border-radius:14px">' +

          '<div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;margin-bottom:10px">' + _t('restoration_what_label', 'WHAT IT IS') + '</div>' +
          '<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:var(--text-primary)">' + _t('restoration_what_text', '') + '</p>' +

          '<div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;margin-bottom:10px;margin-top:24px">' + _t('restoration_who_label', 'WHO IS IT FOR') + '</div>' +
          '<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:var(--text-primary)">' + _t('restoration_who_intro', '') + '</p>' +
          '<ul style="margin:0 0 18px;padding-left:20px;font-size:14px;line-height:1.8;color:var(--text-primary)">' +
            '<li>' + _t('restoration_who_3warn_html', '') + '</li>' +
            '<li>' + _t('restoration_who_fakework_html', '') + '</li>' +
          '</ul>' +
          '<p style="margin:0 0 18px;font-size:13px;color:var(--text-muted);font-style:italic">' + _t('restoration_who_note', '') + '</p>' +

          '<div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;margin-bottom:10px;margin-top:24px">' + _t('restoration_how_label', 'HOW IT WORKS') + '</div>' +
          '<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:var(--text-primary)">' + _t('restoration_how_text_html', '') + '</p>' +

          (opts.adminPreviewLink ?
            '<div style="text-align:center;margin-top:18px;font-size:12px;color:var(--text-muted)"><a href="/recovery?preview=1" style="color:var(--accent)">' + _t('restoration_admin_preview_link', 'Admin preview: open active feed →') + '</a></div>'
            : '') +
        '</div>' +
      '</div>' +
      '</main></div>';
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers (private)
  // ─────────────────────────────────────────────────────────────────

  // Localized instruction text per action. Falls back to empty string
  // for unknown actions (caller should hide section in that case).
  function _recoveryInstruction(action, emoji) {
    var key, fallback;
    switch (action) {
      case 'reaction_rec':
        key = 'restoration_instruction_reaction';
        fallback = 'Tap reaction {emoji} on the post. You do NOT need to subscribe to the channel.';
        break;
      case 'view_rec':
        key = 'restoration_instruction_view';
        fallback = 'Open the post and view for 5+ seconds.';
        break;
      case 'like_rec':
        key = 'restoration_instruction_like';
        fallback = 'Tap the Like button on the post.';
        break;
      default:
        return '';
    }
    var text = _t(key, fallback);
    return text.replace('{emoji}', emoji ? '<span style="font-size:18px;vertical-align:middle">' + escapeHtml(emoji) + '</span>' : '');
  }

  // Reusable link block: clickable URL + Copy + Open buttons.
  // Used in both Available card, In-Progress card, and Submit modal.
  function _recoveryLinkBlock(targetUrl) {
    if (!targetUrl) return '';
    var safeUrl = escapeHtml(targetUrl);
    var jsUrl = targetUrl.replace(/'/g, "\\'");
    return '' +
      '<div style="background:var(--bg-input,#f3f4f6);border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:10px 12px;margin:8px 0;display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:140px;font-size:12px;color:var(--text-secondary);word-break:break-all;font-family:ui-monospace,monospace">' + safeUrl + '</div>' +
        '<a href="' + safeUrl + '" target="_blank" rel="noopener nofollow" class="btn btn-secondary btn-sm" style="padding:6px 12px;font-size:12px;text-decoration:none;white-space:nowrap">↗ ' + _t('restoration_open_link', 'Open') + '</a>' +
        '<button class="btn btn-secondary btn-sm" onclick="restorationCopyLink(\'' + jsUrl + '\', this)" style="padding:6px 12px;font-size:12px;white-space:nowrap">📋 ' + _t('restoration_copy_link', 'Copy link') + '</button>' +
      '</div>';
  }

  function _recoveryEmojiBadge(task) {
    if (task.action === 'reaction_rec' && task.reaction_emoji) {
      return '<span style="font-size:22px;margin-right:6px;vertical-align:middle">' + task.reaction_emoji + '</span>';
    }
    return '';
  }

  // Unified card renderer for both Available and In-Progress modes.
  // Differences: CTA button + reward visibility + accent color.
  function _recoveryCard(task, mode) {
    var emojiBadge = _recoveryEmojiBadge(task);
    var label = escapeHtml(task.label);
    var target = escapeHtml(task.target_username || (task.target_url || '').replace(/^https?:\/\//, ''));
    var linkBlock = _recoveryLinkBlock(task.target_url);
    var safeEmoji = (task.reaction_emoji || '').replace(/'/g, '');
    var safeAction = (task.action || '').replace(/'/g, '');
    var safeUrl = (task.target_url || '').replace(/'/g, "\\'");

    var borderLeft = mode === 'in_progress' ? 'border-left:3px solid #f59e0b;' : '';
    var statusOrReward;
    if (mode === 'in_progress') {
      statusOrReward = '<div style="font-size:11px;color:#f59e0b;margin-top:6px;font-weight:600">⏳ ' + _t('restoration_awaiting', 'Awaiting your submission') + '</div>';
    } else {
      var reward = (task.reward_dollars || 0).toFixed(4);
      statusOrReward = '<div style="font-size:11px;color:var(--text-muted);margin-top:6px">' + _t('restoration_reward_label', 'Reward') + ': $' + reward + ' · ' + (task.available_count || 0) + ' ' + _t('restoration_slots_left', 'slot(s) left') + '</div>';
    }

    var cta;
    if (mode === 'in_progress') {
      cta = '<button class="btn btn-primary" onclick="restorationOpenSubmit(' + task.tc_id + ', \'' + safeAction + '\', \'' + safeEmoji + '\', \'' + safeUrl + '\')" style="width:100%;padding:10px 16px;margin-top:10px;font-weight:600">' + _t('restoration_submit_button', 'Submit screenshot') + '</button>';
    } else {
      cta = '<button class="btn btn-primary" onclick="restorationTakeTask(' + task.order_id + ')" style="width:100%;padding:10px 16px;margin-top:10px;font-weight:600">' + _t('restoration_take_button', 'Take task') + '</button>';
    }

    return '' +
      '<div class="card" style="padding:14px 18px;margin-bottom:10px;' + borderLeft + '">' +
        '<div style="font-weight:600;font-size:14px;margin-bottom:4px">' + emojiBadge + label + '</div>' +
        '<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">' + target + '</div>' +
        linkBlock +
        statusOrReward +
        cta +
      '</div>';
  }

  // ─────────────────────────────────────────────────────────────────
  // Render: page sections
  // ─────────────────────────────────────────────────────────────────

  function renderActive(main, status, data) {
    const debt = status.debt || 0;
    const tasksHtml = (data.tasks || []).map(function(t) { return _recoveryCard(t, 'available'); }).join('') ||
      '<div style="text-align:center;color:var(--text-muted);padding:40px">' + _t('restoration_no_tasks', 'No tasks available right now. Please check back soon.') + '</div>';
    const inProgressHtml = (data.my_in_progress || []).map(function(t) { return _recoveryCard(t, 'in_progress'); }).join('');
    const sb = (typeof renderSidebar === 'function') ? renderSidebar('recovery') : '';

    main.innerHTML =
      '<div class="app-layout">' + sb + '<main class="main-content">' +
      '<div class="container" style="padding:24px;max-width:960px;margin:0 auto">' +

        '<div style="text-align:center;margin-bottom:24px">' +
          '<div style="font-size:48px;line-height:1;margin-bottom:10px">⛏️</div>' +
          '<h1 style="margin:0 0 6px;font-size:28px;font-weight:700">' + _t('restoration_title', 'Restoration') + '</h1>' +
          '<p style="color:var(--text-secondary);margin:0 0 4px;font-size:14px;line-height:1.5">' + _t('restoration_active_subtitle', '') + '</p>' +
          '<p style="color:var(--text-muted);margin:0;font-size:12px;line-height:1.5">' + _t('restoration_active_note', '') + '</p>' +
        '</div>' +

        '<div class="card" style="padding:18px;margin-bottom:24px;border-left:4px solid #dc2626">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
            '<div>' +
              '<div style="font-size:13px;color:var(--text-muted);margin-bottom:2px">' + _t('restoration_remaining_label', 'Tasks remaining') + '</div>' +
              '<div style="font-size:28px;font-weight:700;color:#dc2626">' + debt + '</div>' +
            '</div>' +
            '<div style="font-size:13px;color:var(--text-secondary);max-width:380px;text-align:right">' + _t('restoration_remaining_note_html', '') + '</div>' +
          '</div>' +
        '</div>' +

        (inProgressHtml ?
          '<div style="margin-bottom:24px"><h3 style="font-size:16px;margin:0 0 12px">' + _t('restoration_in_progress_title', 'In progress') + '</h3>' + inProgressHtml + '</div>'
          : '') +

        '<div><h3 style="font-size:16px;margin:0 0 12px">' + _t('restoration_available_title', 'Available tasks') + '</h3>' + tasksHtml + _renderPagination(data.pagination) + '</div>' +
      '</div>' +
      '</main></div>';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Window-exposed handlers (called from inline onclick)
  // ─────────────────────────────────────────────────────────────────

  window.restorationGoToPage = function(page) {
    if (page === _recoveryCurrentPage) return;
    _recoveryCurrentPage = page;
    loadRestoration();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
  };

  window.restorationCopyLink = function(url, btn) {
    if (window.event) window.event.stopPropagation();
    try {
      navigator.clipboard.writeText(url);
      if (typeof showToast === 'function') {
        showToast(_t('restoration_link_copied', 'Link copied'), 'success');
      } else if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '✓';
        setTimeout(function() { btn.innerHTML = orig; }, 1200);
      }
    } catch (e) {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(_) {}
      document.body.removeChild(ta);
      if (typeof showToast === 'function') showToast(_t('restoration_link_copied', 'Link copied'), 'success');
    }
  };

  window.restorationTakeTask = async function(orderId) {
    try {
      const res = await fetch(API_BASE + '/start/' + orderId, { method: 'POST', credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) { alert((data.error || data.code || 'Failed')); return; }
      loadRestoration();
    } catch (e) { alert('Network error: ' + e.message); }
  };

  window.restorationOpenSubmit = function(tcId, action, emoji, targetUrl) {
    if (window.event) window.event.stopPropagation();
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto';

    var instructionText = _recoveryInstruction(action, emoji);
    var instructionBlock = instructionText ?
      '<div style="background:var(--bg-input,#f3f4f6);border-radius:8px;padding:12px 14px;margin-bottom:12px">' +
        '<div style="font-weight:600;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">' + _t('restoration_instruction_label', 'What to do') + '</div>' +
        '<div style="color:var(--text-primary);font-size:14px;line-height:1.5">' + instructionText + '</div>' +
      '</div>' : '';

    var linkBlock = targetUrl ?
      '<div style="margin-bottom:12px">' +
        '<div style="font-weight:600;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">' + _t('restoration_link_label', 'Task link') + '</div>' +
        _recoveryLinkBlock(targetUrl) +
      '</div>' : '';

    var reactionWarning = (action === 'reaction_rec') ?
      '<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px 14px;margin-bottom:14px">' +
        '<div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:4px">' + (emoji ? '<span style="font-size:18px;vertical-align:middle;margin-right:4px">' + emoji + '</span>' : '') + _t('restoration_reaction_only_title', 'REACTION ONLY') + '</div>' +
        '<div style="color:#78350f;font-size:13px;line-height:1.5">' + _t('restoration_no_subscribe_warning', 'You do NOT need to subscribe to the channel — just put the reaction on the post.') + '</div>' +
      '</div>' : '';

    overlay.innerHTML =
      '<div style="background:var(--surface-1,#fff);padding:24px;border-radius:12px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto">' +
        '<h3 style="margin:0 0 16px;font-size:18px">' + _t('restoration_submit_title', 'Submit screenshot') + '</h3>' +
        linkBlock +
        instructionBlock +
        reactionWarning +
        '<div style="font-weight:600;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">' + _t('restoration_submit_dropzone_title', 'Upload screenshot') + '</div>' +
        '<input type="file" id="restorationFile" accept="image/jpeg,image/png,image/webp" style="margin-bottom:14px;width:100%;padding:12px;border:1px dashed var(--border,#d1d5db);border-radius:8px;background:var(--bg-input,#fafafa);cursor:pointer">' +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
          '<button id="restorationCancel" style="padding:10px 18px;border:1px solid var(--border);border-radius:8px;background:transparent;cursor:pointer;font-size:14px">' + _t('restoration_cancel', 'Cancel') + '</button>' +
          '<button id="restorationSubmit" class="btn btn-primary" style="padding:10px 18px;font-weight:600;font-size:14px">' + _t('restoration_submit', 'Submit') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#restorationCancel').onclick = function() { overlay.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    overlay.querySelector('#restorationSubmit').onclick = async function() {
      const f = overlay.querySelector('#restorationFile').files[0];
      if (!f) { alert(_t('restoration_pick_screenshot', 'Please pick a screenshot')); return; }
      const fd = new FormData();
      fd.append('screenshot', f);
      try {
        const res = await fetch(API_BASE + '/submit/' + tcId, { method: 'POST', credentials: 'same-origin', body: fd });
        const data = await res.json();
        if (!res.ok) { alert((data.error || 'Unknown')); return; }
        overlay.remove();
        loadRestoration();
      } catch (e) { alert('Network error: ' + e.message); }
    };
  };

    if (typeof Router !== 'undefined' && Router.register) {
    Router.register('recovery', function () { Router.navigate('/tasks'); }); // section removed — redirect
  }
  window.loadRestoration = loadRestoration;
})();
