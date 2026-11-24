// /js/pages/premium.js — Premium Tasks (Phase 2)
// Lock screen for non-trusted users + read-only feed for trusted users.
// Trusted = >=1 successful withdrawal. Visibility = admin OR feature_premium_enabled=1.
// All UI strings via t() — translations in public/i18n/*.json (35 premium_* keys).

function escHtmlPremium(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

function premiumIconBox(platform) {
  const ico = (window.PREMIUM_PLATFORM_ICONS && window.PREMIUM_PLATFORM_ICONS[platform]) || (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[platform]) || '';
  const color = (window.PREMIUM_PLATFORM_COLORS && window.PREMIUM_PLATFORM_COLORS[platform]) || (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[platform]) || '#888';
  return `<div class="premium-card-icon" style="color:${color}">${ico}</div>`;
}

// "18+": the tasks of the networks of adult creators (Fanvue). The server says it of each task (adult: true; the one
// rule is src/services/premium.js ADULT_PLATFORMS); a chip of the platform bar is marked when its tasks are. A calm grey mark
// beside the name: it tells what the content is, it does not warn.
function premiumAgeMark(task) { return task && task.adult ? '<span class="premium-age">18+</span>' : ''; }
// The name of a task in a card, with its mark; the mark keeps its place when a long name is cut
function premiumCardLabel(task, cls) {
  const c = cls || 'premium-card-label';
  return task && task.adult
    ? `<div class="${c} premium-label-age"><span>${escHtmlPremium(task.label)}</span>${premiumAgeMark(task)}</div>`
    : `<div class="${c}">${escHtmlPremium(task.label)}</div>`;
}

function premiumFmtReward(usd) {
  const n = Number(usd) || 0;
  return '$' + n.toFixed(n >= 1 ? 2 : 3);
}

function premiumLockScreen(status) {
  // status arg kept for signature compatibility (caller passes it). Counter
  // "have/need" removed — if user sees this screen, they obviously have 0 withdrawals.
  return `
    <div class="premium-lock">
      <div class="premium-lock-nav">${renderHamburger()}</div>
      <div class="premium-lock-hero">
        <div class="premium-lock-emoji">💎</div>
        <h1>${t('premium_feed_title')}</h1>
        <p class="premium-lock-sub">${t('premium_lock_subtitle')}</p>
      </div>
      <div class="premium-lock-card">

        <div class="premium-lock-section">
          <h3>${t('premium_lock_what_title')}</h3>
          <p class="premium-lock-intro">${t('premium_lock_what_intro')}</p>
          <ul class="premium-lock-list">
            <li>${t('premium_lock_what_cat_1')}</li>
            <li>${t('premium_lock_what_cat_2')}</li>
            <li>${t('premium_lock_what_cat_3')}</li>
            <li>${t('premium_lock_what_cat_4')}</li>
            <li>${t('premium_lock_what_cat_5')}</li>
          </ul>
          <p class="premium-lock-note">${t('premium_lock_what_no_attach')}</p>
        </div>

        <div class="premium-lock-section">
          <h3>${t('premium_lock_who_title')}</h3>
          <p class="premium-lock-intro">${t('premium_lock_who_intro')}</p>
          <ul class="premium-lock-checklist">
            <li>${t('premium_lock_who_1')}</li>
            <li>${t('premium_lock_who_2')}</li>
            <li>${t('premium_lock_who_3')}</li>
          </ul>
          <p class="premium-lock-community">${t('premium_lock_who_community')}</p>
        </div>

        <div class="premium-lock-section">
          <h3>${t('premium_lock_how_title')}</h3>
          <p class="premium-lock-msg">${t('premium_lock_how_msg')}</p>
        </div>

        <div class="premium-lock-cta">
          <button class="btn btn-primary btn-lg" onclick="Router.navigate('/wallet')">
            💰 ${t('premium_lock_cta_withdraw')}
          </button>
          <button class="btn btn-secondary" onclick="Router.navigate('/tasks')">
            ${t('premium_lock_cta_tasks')}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Cached tasks for modal lookup (populated on render)
let _premiumTasksCache = [];
let _premiumInProgressCache = [];
let _premiumHistoryCache = [];
let _premiumHistTotal = 0;
let _premiumHistPage = 1;
// Pending-review premium tasks (submitted, awaiting admin moderation).
// Hydrated from /api/premium/list#my_pending_review. Read-only — user
// cannot cancel or modify; they just see "your task is in the queue".
let _premiumPendingCache = [];

function premiumCard(task) {
  const target = task.target_username || (task.target_url || '').replace(/^https?:\/\//, '').slice(0, 30);
  return `
    <div class="premium-card" data-order="${task.order_id}" onclick="openPremiumModal(${task.order_id})" role="button" tabindex="0">
      ${premiumIconBox(task.platform)}
      <div class="premium-card-body">
        ${premiumCardLabel(task)}
        <div class="premium-card-target">${escHtmlPremium(target)}</div>
        <div class="premium-card-meta">
          <span class="premium-card-available">${t('premium_card_available')}: ${task.available_count}/${task.total_count}</span>
          <span class="premium-card-mod">⏱ ${t('premium_card_mod_short')}</span>
        </div>
      </div>
      <div class="premium-card-reward">${premiumFmtReward(task.reward_dollars)}</div>
    </div>
  `;
}

// In-progress card — clickable, opens submit modal with drop-zone for screenshots.
function premiumInProgressCard(task) {
  const target = task.target_username || (task.target_url || '').replace(/^https?:\/\//, '').slice(0, 30);
  const startedAgo = _premiumTimeAgo(task.started_at);
  return `
    <div class="premium-card premium-card-in-progress" data-tc="${task.tc_id}" onclick="openPremiumSubmitModal(${task.tc_id})" role="button" tabindex="0">
      ${premiumIconBox(task.platform)}
      <div class="premium-card-body">
        ${premiumCardLabel(task)}
        <div class="premium-card-target">${escHtmlPremium(target)}</div>
        <div class="premium-card-meta">
          <span class="premium-card-status">⏳ ${escHtmlPremium(startedAgo)}</span>
          <span class="premium-card-mod">${t('premium_submit_cta') || 'Click to submit proof'}</span>
        </div>
      </div>
      <div class="premium-card-reward">${premiumFmtReward(task.reward_dollars)}</div>
    </div>
  `;
}

function _premiumTimeAgo(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso + 'Z').getTime();
  if (ms < 60000) return 'just now';
  if (ms < 3600000) return Math.floor(ms / 60000) + 'm ago';
  if (ms < 86400000) return Math.floor(ms / 3600000) + 'h ago';
  return Math.floor(ms / 86400000) + 'd ago';
}

// Atomic claim — calls POST /api/premium/start/:order_id.
// Server uses BEGIN IMMEDIATE; if 2 users race, one gets 409 SOLD_OUT.
async function premiumTakeTask(orderId) {
  const btn = document.querySelector('.premium-modal-take');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  try {
    const r = await fetch('/api/premium/start/' + orderId, {
      method: 'POST',
      credentials: 'same-origin',
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const code = j.error || 'ERROR';
      const msg = code === 'SOLD_OUT'      ? 'Already taken by someone else'
                : code === 'ALREADY_TAKEN' ? 'You already have this task in progress'
                : code === 'ORDER_NOT_FOUND' ? 'Order not found'
                : ('Error: ' + code);
      if (typeof showToast === 'function') showToast(msg, 'error');
      if (btn) { btn.disabled = false; btn.textContent = t('premium_modal_take_task') || 'Take task'; }
      return;
    }
    if (typeof showToast === 'function') showToast('Task taken — check My in progress', 'success');
    closePremiumModal();
    // Re-fetch list to refresh both Available and My in progress sections.
    let listResp;
    try { listResp = await fetch('/api/premium/list', { credentials: 'same-origin' }).then(rr => rr.json()); } catch (_) { listResp = null; }
    if (listResp) {
      _premiumTasksCache = listResp.tasks || [];
      _premiumInProgressCache = listResp.my_in_progress || [];
      _premiumPendingCache = listResp.my_pending_review || [];
      premiumRerenderFeed();
    }
  } catch (e) {
    console.error('[premiumTakeTask]', e);
    if (typeof showToast === 'function') showToast('Network error', 'error');
    if (btn) { btn.disabled = false; btn.textContent = t('premium_modal_take_task') || 'Take task'; }
  }
}
window.premiumTakeTask = premiumTakeTask;

// ── Submit modal: drop-zone for 1-2 screenshots ─────────────────────────
// Opens for in-progress cards. Drag-drop OR click-to-browse, accepts up to 2
// images (jpg/png/webp, 5MB each). On submit: POST FormData to /submit/:tc_id,
// tc moves to pending_review (Phase 4 admin queue takes it from there) and
// disappears from this user's "My in progress" feed on next list re-fetch.
let _premiumSubmitFiles = []; // selected File objects, max 2

function openPremiumSubmitModal(tcId) {
  const task = _premiumInProgressCache.find(x => x.tc_id === tcId);
  if (!task) return;
  _premiumSubmitFiles = [];
  closePremiumSubmitModal();
  closePremiumModal();

  const target = task.target_username || (task.target_url || '').replace(/^https?:\/\//, '');
  const safeUrl = escHtmlPremium(task.target_url || '#');
  const copiedMsg = (t('premium_modal_copied') || 'Copied').replace(/'/g, '\\\'');

  const modal = document.createElement('div');
  modal.id = 'premiumSubmitModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content premium-modal">
      <button class="modal-close" onclick="closePremiumSubmitModal()" aria-label="Close">&times;</button>
      <div class="premium-modal-head">
        ${premiumIconBox(task.platform)}
        <div class="premium-modal-title-block">
          <div class="premium-modal-label">${escHtmlPremium(task.label)}${premiumAgeMark(task)}</div>
          <div class="premium-modal-target-line">${escHtmlPremium(target)}</div>
        </div>
        <div class="premium-modal-reward">${premiumFmtReward(task.reward_dollars)}</div>
      </div>
      <div class="premium-modal-body">
        <div class="premium-modal-section">
          <div class="premium-modal-section-title">${t('premium_modal_target_link')}</div>
          <div class="premium-modal-link-row">
            <a class="premium-modal-link" href="${safeUrl}" target="_blank" rel="noopener nofollow">${escHtmlPremium(task.target_url || '')}</a>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(this.previousElementSibling.href);showToast('${copiedMsg}','success')">${t('premium_modal_copy')}</button>
          </div>
        </div>

        <div class="premium-modal-section">
          <div class="premium-modal-section-title">${t('premium_submit_instruction_label') || 'How to do it'}</div>
          <div class="premium-modal-instruction">${(typeof safeMarkdown === 'function') ? safeMarkdown(premiumResolveInstruction(task)) : escHtmlPremium(premiumResolveInstruction(task)) || ('<em>' + (t('premium_modal_no_instruction') || 'No instruction') + '</em>')}</div>
        </div>

        <div class="premium-account-warning" style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;padding:14px 16px;margin-bottom:14px">
          <div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <span style="font-size:16px">⚠</span> ${t('premium_submit_account_warning_title') || 'BEFORE YOU SUBMIT'}
          </div>
          <ul style="margin:0;padding-left:20px;color:#78350f;font-size:13px;line-height:1.6">
            <li>${t('premium_submit_account_warning_line1') || 'Your profile must be properly set up: avatar, username, completed bio'}</li>
            <li>${t('premium_submit_account_warning_line2') || 'Your username must be clearly visible on the screenshot'}</li>
            <li>${t('premium_submit_account_warning_line3') || 'Empty/weak profiles will be rejected and may result in a warning'}</li>
          </ul>
        </div>

        <div class="premium-modal-section">
          <div class="premium-modal-section-title">${t('premium_submit_dropzone_title') || 'Upload proof screenshot(s)'}</div>
          <div class="premium-dropzone" id="premiumDropzone" onclick="document.getElementById('premiumFileInput').click()">
            <input type="file" id="premiumFileInput" accept="image/jpeg,image/png,image/webp" multiple style="display:none" onchange="premiumOnFilePick(event)">
            <div class="premium-dropzone-empty" id="premiumDropzoneEmpty">
              <div class="premium-dropzone-icon">📤</div>
              <div class="premium-dropzone-text">${t('premium_submit_dropzone_hint') || 'Drag & drop or click to browse — up to 2 images, 5 MB each'}</div>
            </div>
            <div class="premium-dropzone-previews" id="premiumDropzonePreviews"></div>
          </div>
        </div>

        <div class="premium-modal-cta">
          <button class="btn btn-primary btn-lg premium-modal-submit" id="premiumSubmitBtn" onclick="premiumSubmitProof(${task.tc_id})" disabled>
            ${t('premium_submit_btn') || 'Submit for review'}
          </button>
          <button class="btn btn-secondary btn-sm premium-modal-cancel" style="margin-top:10px;width:100%;background:transparent;border:1px solid var(--border);color:var(--text-muted);font-size:13px" onclick="premiumCancelTask(${task.tc_id})">
            ${t('premium_cancel_btn') || 'Cancel task'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePremiumSubmitModal(); });
  document.addEventListener('keydown', _premiumSubmitKeyHandler);

  // Wire drag-drop on the dropzone.
  const dz = document.getElementById('premiumDropzone');
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation(); dz.classList.add('premium-dropzone-active');
  }));
  ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation(); dz.classList.remove('premium-dropzone-active');
  }));
  dz.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files) premiumAddFiles(dt.files);
  });
}
window.openPremiumSubmitModal = openPremiumSubmitModal;

function closePremiumSubmitModal() {
  const m = document.getElementById('premiumSubmitModal');
  if (m) m.remove();
  document.removeEventListener('keydown', _premiumSubmitKeyHandler);
  _premiumSubmitFiles = [];
}
window.closePremiumSubmitModal = closePremiumSubmitModal;

function _premiumSubmitKeyHandler(e) {
  if (e.key === 'Escape') closePremiumSubmitModal();
}

function premiumOnFilePick(e) {
  premiumAddFiles(e.target.files);
  e.target.value = ''; // allow re-pick of same file
}
window.premiumOnFilePick = premiumOnFilePick;

function premiumAddFiles(fileList) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  for (const f of fileList) {
    if (_premiumSubmitFiles.length >= 2) break;
    if (!allowed.includes(f.type)) {
      if (typeof showToast === 'function') showToast('Only JPG/PNG/WebP', 'error');
      continue;
    }
    if (f.size > 5 * 1024 * 1024) {
      if (typeof showToast === 'function') showToast('Max 5 MB per file', 'error');
      continue;
    }
    _premiumSubmitFiles.push(f);
  }
  premiumRenderDropzone();
}

function premiumRemoveFile(idx) {
  _premiumSubmitFiles.splice(idx, 1);
  premiumRenderDropzone();
}
window.premiumRemoveFile = premiumRemoveFile;

function premiumRenderDropzone() {
  const empty = document.getElementById('premiumDropzoneEmpty');
  const previews = document.getElementById('premiumDropzonePreviews');
  const btn = document.getElementById('premiumSubmitBtn');
  if (!previews || !btn) return;
  if (_premiumSubmitFiles.length === 0) {
    if (empty) empty.style.display = '';
    previews.innerHTML = '';
    btn.disabled = true;
    return;
  }
  if (empty) empty.style.display = 'none';
  previews.innerHTML = _premiumSubmitFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `
      <div class="premium-preview">
        <img src="${url}" alt="">
        <button class="premium-preview-remove" onclick="event.stopPropagation();premiumRemoveFile(${i})" aria-label="Remove">&times;</button>
        <div class="premium-preview-name">${escHtmlPremium(f.name)}</div>
      </div>
    `;
  }).join('');
  btn.disabled = false;
}

async function premiumSubmitProof(tcId) {
  if (_premiumSubmitFiles.length === 0) return;
  const btn = document.getElementById('premiumSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  const fd = new FormData();
  _premiumSubmitFiles.forEach(f => fd.append('screenshots', f));
  try {
    const r = await fetch('/api/premium/submit/' + tcId, {
      method: 'POST',
      credentials: 'same-origin',
      body: fd,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const code = j.error || 'ERROR';
      const msg = code === 'NOT_IN_PROGRESS' ? 'Already submitted'
                : code === 'TC_NOT_FOUND'    ? 'Task not found'
                : code === 'NO_FILES'        ? 'No files attached'
                : ('Error: ' + code);
      if (typeof showToast === 'function') showToast(msg, 'error');
      if (btn) { btn.disabled = false; btn.textContent = t('premium_submit_btn') || 'Submit for review'; }
      return;
    }
    if (typeof showToast === 'function') showToast('Submitted — pending admin review', 'success');
    closePremiumSubmitModal();
    let listResp;
    try { listResp = await fetch('/api/premium/list', { credentials: 'same-origin' }).then(rr => rr.json()); } catch (_) { listResp = null; }
    if (listResp) {
      _premiumTasksCache = listResp.tasks || [];
      _premiumInProgressCache = listResp.my_in_progress || [];
      _premiumPendingCache = listResp.my_pending_review || [];
      premiumRerenderFeed();
    }
  } catch (e) {
    console.error('[premiumSubmitProof]', e);
    if (typeof showToast === 'function') showToast('Network error', 'error');
    if (btn) { btn.disabled = false; btn.textContent = t('premium_submit_btn') || 'Submit for review'; }
  }
}
window.premiumSubmitProof = premiumSubmitProof;

// Cancel an in_progress premium task — releases the slot back to the pool.
// Confirmation dialog prevents accidental clicks. After success: closes the submit
// modal, refreshes the feed (the task disappears from MY IN PROGRESS, the slot
// reappears in AVAILABLE for other trusted users).
async function premiumCancelTask(tcId) {
  if (!Number.isFinite(tcId) || tcId <= 0) return;
  const confirmMsg = t('premium_cancel_confirm') || 'Cancel this premium task? The slot will be released back to other users.';
  if (typeof confirm === 'function' && !confirm(confirmMsg)) return;
  try {
    const r = await fetch('/api/premium/cancel/' + tcId, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = data?.error || 'cancel_failed';
      if (typeof showToast === 'function') showToast(t('premium_cancel_failed') || ('Cancel failed: ' + err), 'error');
      return;
    }
    if (typeof showToast === 'function') showToast(t('premium_cancel_success') || 'Task cancelled', 'success');
    closePremiumSubmitModal();
    let listResp;
    try { listResp = await fetch('/api/premium/list', { credentials: 'same-origin' }).then(rr => rr.json()); } catch (_) { listResp = null; }
    if (listResp) {
      _premiumTasksCache = listResp.tasks || [];
      _premiumInProgressCache = listResp.my_in_progress || [];
      _premiumPendingCache = listResp.my_pending_review || [];
      premiumRerenderFeed();
    }
  } catch (e) {
    console.error('[premiumCancelTask]', e);
    if (typeof showToast === 'function') showToast('Network error', 'error');
  }
}
window.premiumCancelTask = premiumCancelTask;

// Resolve instruction: per-order custom (DB) wins, otherwise template by language, fallback to English.
function premiumResolveInstruction(task) {
  const dbCustom = (task.instruction || '').trim();
  if (dbCustom) return dbCustom;
  const tpls = (typeof window !== 'undefined' && window.PREMIUM_INSTRUCTIONS) || {};
  const key = (task.platform || '') + ':' + (task.action || '');
  const lang = (typeof I18N !== 'undefined' && I18N.lang) || 'en';
  return (tpls[lang] && tpls[lang][key]) || (tpls.en && tpls.en[key]) || '';
}

function openPremiumModal(orderId) {
  const task = _premiumTasksCache.find(x => x.order_id === orderId);
  if (!task) return;
  const instructionText = premiumResolveInstruction(task);
  const md = (typeof safeMarkdown === 'function') ? safeMarkdown(instructionText) : escHtmlPremium(instructionText);
  const safeUrl = escHtmlPremium(task.target_url || '#');
  const target = task.target_username || (task.target_url || '').replace(/^https?:\/\//, '');
  const old = document.getElementById('premiumModal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.id = 'premiumModal';
  modal.className = 'modal-overlay';
  const copiedMsg = (t('premium_modal_copied') || 'Copied').replace(/'/g, '\\\'');
  modal.innerHTML = `
    <div class="modal-content premium-modal">
      <button class="modal-close" onclick="closePremiumModal()" aria-label="Close">&times;</button>
      <div class="premium-modal-head">
        ${premiumIconBox(task.platform)}
        <div class="premium-modal-title-block">
          <div class="premium-modal-label">${escHtmlPremium(task.label)}${premiumAgeMark(task)}</div>
          <div class="premium-modal-target-line">${escHtmlPremium(target)}</div>
        </div>
        <div class="premium-modal-reward">${premiumFmtReward(task.reward_dollars)}</div>
      </div>
      <div class="premium-modal-body">
        <div class="premium-modal-meta-row">
          <span class="premium-modal-badge premium-modal-badge-mod">⏱ ${t('premium_modal_mod_long')}</span>
          <span class="premium-modal-badge premium-modal-badge-avail">${t('premium_card_available')}: ${task.available_count}/${task.total_count}</span>
        </div>

        <div class="premium-modal-section">
          <div class="premium-modal-section-title">${t('premium_modal_target_link')}</div>
          <div class="premium-modal-link-row">
            <a class="premium-modal-link" href="${safeUrl}" target="_blank" rel="noopener nofollow">${escHtmlPremium(task.target_url || '')}</a>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(this.previousElementSibling.href);showToast('${copiedMsg}','success')">${t('premium_modal_copy')}</button>
          </div>
        </div>

        <div class="premium-modal-section">
          <div class="premium-modal-section-title">${t('premium_modal_what_to_do')}</div>
          <div class="premium-modal-instruction">${md || ('<em>' + t('premium_modal_no_instruction') + '</em>')}</div>
        </div>

        <div class="premium-modal-warning">
          <strong>${t('premium_modal_warning_label')}:</strong> ${t('premium_modal_warning_text')}
        </div>

        <div class="premium-modal-cta">
          <button class="btn btn-primary btn-lg premium-modal-take" onclick="premiumTakeTask(${task.order_id})">
            ${t('premium_modal_take_task')}
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePremiumModal(); });
  document.addEventListener('keydown', _premiumModalKeyHandler);
}

function closePremiumModal() {
  const m = document.getElementById('premiumModal');
  if (m) m.remove();
  document.removeEventListener('keydown', _premiumModalKeyHandler);
}

function _premiumModalKeyHandler(e) {
  if (e.key === 'Escape') closePremiumModal();
}

// Expose for inline onclick handlers
window.openPremiumModal = openPremiumModal;
window.closePremiumModal = closePremiumModal;

// Active filter state — persists across re-renders within a session.
// platform = 'all' shows all; platform = 'amazon' shows only amazon, plus second-level action bar appears.
let _premiumFilter = { platform: 'all', action: 'all' };

// Virtual platform/action remap for premium UI.
// Underlying task data stores android/ios apps as platform='site',
// action='android_download' / 'ios_download'. UI shows them as separate
// top-level platforms with a single 'download' action.
// The networks the server lists as one kind of work (task.group: the crypto listing sites are "Crypto listings"; its one rule is
// src/services/premium.js PREMIUM_GROUPS) are one chip of the first row; the second row then names the sites (taxonomy: group: true).
function premiumVirtPlatform(t) {
  if (t.platform === 'site' && t.action === 'android_download') return 'android';
  if (t.platform === 'site' && t.action === 'ios_download') return 'ios';
  if (t.group) return t.group;
  return t.platform;
}
function premiumVirtAction(t) {
  if (t.platform === 'site' && (t.action === 'android_download' || t.action === 'ios_download')) return 'download';
  if (t.group) return t.platform;
  return t.action;
}

function premiumPlatformLabel(platform) {
  const lang = (typeof I18N !== 'undefined' && I18N.lang) || 'en';
  const labels = (window.PREMIUM_PLATFORM_LABELS || {})[lang] || (window.PREMIUM_PLATFORM_LABELS || {}).en || {};
  return labels[platform] || platform;
}

function premiumActionLabel(action) {
  const lang = (typeof I18N !== 'undefined' && I18N.lang) || 'en';
  const labels = (window.PREMIUM_ACTION_LABELS || {})[lang] || (window.PREMIUM_ACTION_LABELS || {}).en || {};
  return labels[action] || action;
}

function premiumPlatformBar(allTasks) {
  const tax = window.PREMIUM_TAXONOMY || [];
  const counts = {}, adult = {};
  for (const x of allTasks) { const vp = premiumVirtPlatform(x); counts[vp] = (counts[vp] || 0) + 1; if (x.adult) adult[vp] = true; }
  const totalCount = allTasks.length;
  const ru = (I18N.lang || 'en') === 'ru';
  const allLabel = ru ? 'Все' : 'All';
  const chips = [
    `<button class="premium-platform-chip ${_premiumFilter.platform === 'all' ? 'active' : ''}" onclick="premiumSetPlatform('all')">${allLabel}<span class="premium-chip-count">${totalCount}</span></button>`,
    ...tax.filter(({ platform }) => (counts[platform] || 0) > 0 || _premiumFilter.platform === platform).map(({ platform }) => {
      const count = counts[platform] || 0;
      const color = (window.PREMIUM_PLATFORM_COLORS && window.PREMIUM_PLATFORM_COLORS[platform]) || (typeof PLATFORM_COLORS !== 'undefined' && PLATFORM_COLORS[platform]) || '#888';
      const icon = (window.PREMIUM_PLATFORM_ICONS && window.PREMIUM_PLATFORM_ICONS[platform]) || (typeof PLATFORM_ICONS !== 'undefined' && PLATFORM_ICONS[platform]) || '';
      const isEmpty = count === 0;
      return `<button class="premium-platform-chip ${_premiumFilter.platform === platform ? 'active' : ''} ${isEmpty ? 'empty' : ''}" onclick="premiumSetPlatform('${platform}')" style="--pc:${color}"><span class="premium-chip-icon">${icon}</span>${escHtmlPremium(premiumPlatformLabel(platform))}${adult[platform] ? premiumAgeMark({ adult: true }) : ''}<span class="premium-chip-count">${count}</span></button>`;
    }),
  ];
  return `<div class="premium-bar premium-bar-platforms">${chips.join('')}</div>`;
}

function premiumActionBar(allTasks) {
  if (_premiumFilter.platform === 'all') return '';
  const tax = window.PREMIUM_TAXONOMY || [];
  const platformDef = tax.find(p => p.platform === _premiumFilter.platform);
  if (!platformDef) return '';
  const ru = (I18N.lang || 'en') === 'ru';
  const allLabel = ru ? 'Все' : 'All';
  const counts = {};
  for (const x of allTasks) {
    if (premiumVirtPlatform(x) === _premiumFilter.platform) { const va = premiumVirtAction(x); counts[va] = (counts[va] || 0) + 1; }
  }
  const totalForPlatform = Object.values(counts).reduce((s, v) => s + v, 0);
  const chips = [
    `<button class="premium-action-chip ${_premiumFilter.action === 'all' ? 'active' : ''}" onclick="premiumSetAction('all')">${allLabel}<span class="premium-chip-count">${totalForPlatform}</span></button>`,
    ...platformDef.actions.filter(action => (counts[action] || 0) > 0 || _premiumFilter.action === action).map(action => {
      const count = counts[action] || 0;
      const isEmpty = count === 0;
      return `<button class="premium-action-chip ${_premiumFilter.action === action ? 'active' : ''} ${isEmpty ? 'empty' : ''}" onclick="premiumSetAction('${action}')">${escHtmlPremium(platformDef.group ? premiumPlatformLabel(action) : premiumActionLabel(action))}<span class="premium-chip-count">${count}</span></button>`;
    }),
  ];
  return `<div class="premium-bar premium-bar-actions">${chips.join('')}</div>`;
}

function premiumApplyFilter(tasks) {
  if (_premiumFilter.platform === 'all') return tasks;
  return tasks.filter(t => premiumVirtPlatform(t) === _premiumFilter.platform && (_premiumFilter.action === 'all' || premiumVirtAction(t) === _premiumFilter.action));
}

function premiumSetPlatform(p) {
  _premiumFilter = { platform: p, action: 'all' };
  premiumRerenderFeed();
}

function premiumSetAction(a) {
  _premiumFilter.action = a;
  premiumRerenderFeed();
}

function premiumRerenderFeed() {
  const main = document.querySelector('.main-content');
  if (!main) return;
  const status = window._premiumLastStatus || { trusted: true, withdrawals_completed: 0 };
  main.innerHTML = premiumFeed(status, {
    ok: true,
    tasks: _premiumTasksCache,
    my_in_progress: _premiumInProgressCache,
    my_pending_review: _premiumPendingCache,
  });
}

window.premiumSetPlatform = premiumSetPlatform;
window.premiumSetAction = premiumSetAction;

function premiumFeed(status, listResp) {
  const tasks = (listResp && listResp.tasks) || [];
  if (listResp && listResp.tasks) _premiumTasksCache = tasks;
  if (listResp && Array.isArray(listResp.my_in_progress)) _premiumInProgressCache = listResp.my_in_progress;
  if (listResp && Array.isArray(listResp.my_pending_review)) _premiumPendingCache = listResp.my_pending_review;
  window._premiumLastStatus = status;
  const visibleTasks = premiumApplyFilter(_premiumTasksCache);
  const totalAvailable = _premiumTasksCache.length;
  const cardsHtml = visibleTasks.length
    ? visibleTasks.map(premiumCard).join('')
    : `<div class="premium-empty">${t('premium_empty_available')}</div>`;
  const ipCount = _premiumInProgressCache.length;
  const ipHtml = ipCount
    ? _premiumInProgressCache.map(premiumInProgressCard).join('')
    : `<div class="premium-empty">${t('premium_empty_in_progress') || 'Nothing in progress'}</div>`;
  const prCount = _premiumPendingCache.length;
  const prHtml = prCount
    ? _premiumPendingCache.map(premiumPendingCard).join('')
    : `<div class="premium-empty">${t('premium_empty_pending_review') || 'Nothing on review'}</div>`;
  const phase3Stub = `<div class="premium-empty premium-empty-soon">${t('premium_empty_soon')}</div>`;
  return `
    <div class="premium-feed">
      <header class="premium-feed-head">
        <div class="premium-feed-title-row">
          ${renderHamburger()}
          <h1 class="premium-feed-title">💎 ${t('premium_feed_title')}</h1>
          <span class="premium-badge-trusted">✓ ${t('premium_badge_trusted')}</span>
        </div>
        <p class="premium-feed-sub">${t('premium_feed_sub')}</p>
        <div class="premium-feed-counter">${totalAvailable} ${t('premium_feed_actions_available')}</div>
      </header>

      ${premiumPlatformBar(_premiumTasksCache)}
      ${premiumActionBar(_premiumTasksCache)}

      <section class="premium-section">
        <h2 class="premium-section-title">${t('premium_section_available')} <span class="premium-section-count">(${visibleTasks.length})</span></h2>
        <div class="premium-grid">${cardsHtml}</div>
      </section>

      <section class="premium-section">
        <h2 class="premium-section-title">${t('premium_section_in_progress')} <span class="premium-section-count">(${ipCount})</span></h2>
        <div class="premium-grid">${ipHtml}</div>
      </section>

      <section class="premium-section">
        <h2 class="premium-section-title">${t('premium_section_pending_review')} <span class="premium-section-count">(${prCount})</span></h2>
        <div class="premium-grid">${prHtml}</div>
      </section>

      <section class="premium-section">
        <h2 class="premium-section-title">${t('premium_section_history')} <span class="premium-section-count">(${_premiumHistTotal})</span></h2>
        <div id="premiumHistBox">${premiumHistBoxHtml()}</div>
      </section>
    </div>
  `;
}


// ── MY ON-REVIEW card (pending_review, awaiting admin) ──────────────
// Read-only: no submit/cancel — user only watches and waits. Visual cue
// is the amber border + "Under review" pill so it doesn't get confused
// with actionable "in progress" cards.
function premiumPendingCard(item) {
  const target = item.target_username || (item.target_url || '').replace(/^https?:\/\//, '');
  const submittedAgo = _premiumTimeAgo(item.submitted_at) || (t('premium_pending_badge') || 'Under review');
  const submittedLine = (t('premium_pending_submitted_ago') || 'Submitted {ago}').replace('{ago}', submittedAgo);
  return `
    <div class="premium-card" style="border-color:#f59e0b;background:linear-gradient(180deg, rgba(251,191,36,0.04), transparent)">
      <div class="premium-card-icon-row">
        ${premiumIconBox(item.platform)}
        <span style="background:rgba(245,158,11,0.12);color:#b45309;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;border:1px solid rgba(245,158,11,0.35)">⏳ ${escHtmlPremium(t('premium_pending_badge') || 'Under review')}</span>
      </div>
      ${premiumCardLabel(item)}
      <div class="premium-card-target">${escHtmlPremium(target)}</div>
      <div class="premium-card-meta">
        <span class="premium-card-status">${escHtmlPremium(submittedLine)}</span>
      </div>
      <div class="premium-card-reward">${premiumFmtReward(item.reward_dollars)}</div>
    </div>`;
}

// ── MY HISTORY — compact table-like row (700+ completions for some workers,
// so the section is paginated 25/page and each entry is one dense line)
function premiumHistoryCard(item) {
  const ok = item.status === 'approved';
  const st = ok
    ? (t('premium_history_status_approved') || 'Approved')
    : (t('premium_history_status_rejected') || 'Rejected');
  const target = item.target_username || (item.target_url || '').replace(/^https?:\/\//, '');
  const date = item.reviewed_at ? new Date(item.reviewed_at.replace(' ', 'T') + 'Z').toLocaleDateString() : '';
  const reason = (!ok && item.reject_reason)
    ? `<div class="premium-hist-reason">${escHtmlPremium(item.reject_reason)}</div>`
    : '';
  return `
    <div class="premium-hist-row">
      <span class="premium-hist-dot" style="background:${ok ? '#22c55e' : '#ef4444'}" title="${st}"></span>
      <div class="premium-hist-main">
        ${premiumCardLabel(item, 'premium-hist-label')}
        <div class="premium-hist-sub">${escHtmlPremium(target)}${date ? ' · ' + date : ''}</div>
        ${reason}
      </div>
      <div class="premium-hist-amount" style="color:${ok ? '#16a34a' : 'var(--text-muted)'}">${ok ? '+' : ''}${premiumFmtReward(item.reward_dollars)}</div>
    </div>`;
}

function premiumHistBoxHtml() {
  const pages = Math.max(1, Math.ceil(_premiumHistTotal / 25));
  const rows = _premiumHistoryCache.length
    ? `<div class="premium-hist-list">${_premiumHistoryCache.map(premiumHistoryCard).join('')}</div>`
    : `<div class="premium-empty">${t('premium_history_empty') || 'No completed tasks yet'}</div>`;
  const pager = _premiumHistTotal > 25 ? `
    <div class="premium-hist-pager">
      <button class="btn btn-sm" onclick="premiumHistGo(-1)" ${_premiumHistPage <= 1 ? 'disabled' : ''}>${t('mt_prev') || 'Back'}</button>
      <span class="premium-hist-pagenum">${t('mt_page') || 'Page'} ${_premiumHistPage} / ${pages}</span>
      <button class="btn btn-sm" onclick="premiumHistGo(1)" ${_premiumHistPage >= pages ? 'disabled' : ''}>${t('mt_next') || 'Next'}</button>
    </div>` : '';
  return rows + pager;
}

async function premiumHistGo(delta) {
  const pages = Math.max(1, Math.ceil(_premiumHistTotal / 25));
  const next = Math.min(pages, Math.max(1, _premiumHistPage + delta));
  if (next === _premiumHistPage) return;
  try {
    const r = await fetch('/api/premium/history?page=' + next, { credentials: 'same-origin' }).then(rr => rr.json());
    if (r && Array.isArray(r.items)) {
      _premiumHistoryCache = r.items;
      _premiumHistTotal = r.total || r.items.length;
      _premiumHistPage = r.page || next;
      const box = document.getElementById('premiumHistBox');
      if (box) box.innerHTML = premiumHistBoxHtml();
    }
  } catch (e) { console.error('[premiumHistGo]', e); }
}
window.premiumHistGo = premiumHistGo;


// Lazy-load premium-only data assets (safe-md.js + premium-instructions.js +
// premium-taxonomy.js, ~52 KB total). Excluded from global index.html so 99%
// of users (who never visit /premium) save the download + parse cost.
let _premiumAssetsPromise = null;
function loadPremiumAssets() {
  if (_premiumAssetsPromise) return _premiumAssetsPromise;
  const v = (window.__APP_VER__ || Date.now()).toString();
  const files = [
    '/js/utils/safe-md.js',
    '/js/premium-data/premium-instructions.js',
    '/js/premium-data/premium-taxonomy.js',
  ];
  _premiumAssetsPromise = Promise.all(files.map(src => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src + '?v=' + v;
    s.onload = resolve;
    s.onerror = () => reject(new Error('failed to load ' + src));
    document.head.appendChild(s);
  })));
  return _premiumAssetsPromise;
}

Router.register('premium', async (app) => {
  // Visibility gate via shared 30s window-cache (sidebar already warmed it).
  let state;
  try { state = await getPremiumState(); } catch (_) { state = { visible: false }; }
  if (!state.visible) {
    Router.navigate('/dashboard');
    return;
  }
  // Kick off asset loading in parallel with trusted-status fetch.
  const assetsP = loadPremiumAssets();
  let s;
  try { s = await fetch('/api/premium/trusted-status', { credentials: 'same-origin' }).then(r => r.json()); } catch (_) { s = null; }
  if (!s || !s.ok) {
    app.innerHTML = `<div class="app-layout">${renderSidebar('premium')}<main class="main-content"><div class="error-state">${t('premium_failed_load')}</div></main></div>`;
    return;
  }
  if (!s.trusted) {
    app.innerHTML = `<div class="app-layout">${renderSidebar('premium')}<main class="main-content">${premiumLockScreen(s)}</main></div>`;
    return;
  }
  // Trusted user → fetch list AND wait for assets, then render feed.
  let listResp;
  try {
    let histResp;
    [, listResp, histResp] = await Promise.all([
      assetsP,
      fetch('/api/premium/list', { credentials: 'same-origin' }).then(r => r.json()),
      fetch('/api/premium/history', { credentials: 'same-origin' }).then(r => r.json()).catch(() => ({ items: [] })),
    ]);
    if (histResp && Array.isArray(histResp.items)) {
      _premiumHistoryCache = histResp.items;
      _premiumHistTotal = histResp.total || histResp.items.length;
      _premiumHistPage = histResp.page || 1;
    }
  } catch (_) { listResp = null; }
  app.innerHTML = `<div class="app-layout">${renderSidebar('premium')}<main class="main-content">${premiumFeed(s, listResp)}</main></div>`;
});
