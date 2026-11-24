Router.register('wallet', async (app) => {
  const u = API.user || {};
  const bal = u.balance || 0;

  // Load transaction history + withdrawals in parallel (was sequential — 2× TTFB).
  const [txData, wData] = await Promise.all([
    API.request('GET', '/profile/transactions').catch(() => ({})),
    API.request('GET', '/wallet/withdrawals').catch(() => ({})),
  ]);
  const txns = txData.transactions || [];
  const txEarned = txData.earned || 0;
  const txSpent = txData.spent || 0;
  const withdrawals = wData.withdrawals || [];

  // Stats from server totals (not limited to 50 txns)
  const earned = txEarned;
  const withdrawn = withdrawals.filter(w => w.status === 'completed').reduce((s, w) => s + w.net_amount, 0);
  const pending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.net_amount, 0);

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('wallet')}
    <main class="main-content">
      ${renderSuspiciousBanner()}
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('wallet_title')}</h1>
          <p>${t('wallet_subtitle')}</p>
        </div>
      </div>
      <div class="page-content">

        <!-- Balance hero card -->
        <div class="w-balance-card">
          <div class="w-balance-label">${t('wallet_available')}</div>
          <div class="w-balance-amount">$${bal.toLocaleString()}</div>
          <div class="w-balance-stats">
            <div class="w-stat">
              <svg viewBox="0 0 16 16" fill="none" stroke="#10b981" stroke-width="1.5"><path d="M8 12V4M5 7l3-3 3 3"/></svg>
              <span class="w-stat-val" style="color:#10b981">$${earned.toLocaleString()}</span>
              <span class="w-stat-lbl">${t('wallet_earned')}</span>
            </div>
            <div class="w-stat-divider"></div>
            <div class="w-stat">
              <svg viewBox="0 0 16 16" fill="none" stroke="#ef4444" stroke-width="1.5"><path d="M8 4v8M5 9l3 3 3-3"/></svg>
              <span class="w-stat-val" style="color:#ef4444">$${withdrawn.toLocaleString()}</span>
              <span class="w-stat-lbl">${t('wallet_withdrawn')}</span>
            </div>
            ${pending > 0 ? `
            <div class="w-stat-divider"></div>
            <div class="w-stat">
              <svg viewBox="0 0 16 16" fill="none" stroke="#f59e0b" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>
              <span class="w-stat-val" style="color:#f59e0b">$${pending.toLocaleString()}</span>
              <span class="w-stat-lbl">${t('wallet_pending')}</span>
            </div>` : ''}
          </div>
        </div>

        <!-- Withdraw button -->
        <div class="w-actions">
          <button class="w-action-btn w-withdraw" id="withdrawBtn" style="flex:1;max-width:400px" ${API.user && API.user.status === 'suspicious' ? 'disabled title="' + t('suspicious_withdraw_blocked') + '"' : ''}>
            <div class="w-action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7 7 7-7"/></svg>
            </div>
            <span>${t('wallet_withdraw')}</span>
          </button>
        </div>

        <!-- Transaction history -->
        <div class="w-history-section">
          <div class="w-history-header">
            <h3>${t('wallet_history')}</h3>
            <div class="w-filter-chips" id="walletFilterChips">
              <div class="w-chip active" data-filter="all">${t('wallet_all')}</div>
              <div class="w-chip" data-filter="income">${t('wallet_income')}</div>
              <div class="w-chip" data-filter="withdrawals">${t('wallet_type_withdrawal')}</div>
            </div>
          </div>
          <div id="walletTxList">
            ${txns.length ? txns.map(renderTx).join('') : `
            <div class="w-empty">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.2">
                <rect x="6" y="10" width="36" height="28" rx="4"/>
                <path d="M6 20h36"/>
                <circle cx="16" cy="32" r="2"/>
              </svg>
              <div class="w-empty-title">${t('wallet_no_transactions')}</div>
              <div class="w-empty-hint">${t('wallet_no_transactions_hint')}</div>
            </div>`}
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- Withdraw Modal -->
  <div class="modal-overlay" id="withdrawModal" style="display:none">
    <div class="modal-card">
      <div class="modal-header">
        <h3>${t('wallet_withdraw_title')}</h3>
        <button class="modal-close" onclick="document.getElementById('withdrawModal').style.display='none'">&times;</button>
      </div>
      <div class="modal-body" id="withdrawModalBody">
        <div class="w-empty"><div class="w-empty-title">Loading...</div></div>
      </div>
    </div>
  </div>`;

  // Filter chips
  document.getElementById('walletFilterChips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.w-chip');
    if (!chip) return;
    document.querySelectorAll('.w-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    const list = document.getElementById('walletTxList');
    if (filter === 'withdrawals') {
      list.innerHTML = withdrawals.length ? withdrawals.map(renderWithdrawal).join('') : `
        <div class="w-empty">
          <div class="w-empty-title">${t('wallet_no_transactions')}</div>
        </div>`;
    } else {
      const filtered = filter === 'all' ? txns :
        filter === 'income' ? txns.filter(tx => tx.amount > 0) :
        txns.filter(tx => tx.amount < 0);
      list.innerHTML = filtered.length ? filtered.map(renderTx).join('') : `
        <div class="w-empty">
          <div class="w-empty-title">${t('wallet_no_transactions')}</div>
        </div>`;
    }
  });

  // === WITHDRAW ===
  document.getElementById('withdrawBtn').addEventListener('click', async () => {
    if (!u.email_verified) {
      showToast(t('wallet_verify_to_withdraw'), 'error');
      return;
    }
    var modal = document.getElementById('withdrawModal');
    var body = document.getElementById('withdrawModalBody');
    modal.style.display = 'flex';

    try {
      var data = await API.request('GET', '/wallet/withdraw-info');
      var methods = data.methods || [];

      // Method icons
      var methodIcons = {
        usdt_trc20: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="10" cy="10" r="8"/><path d="M6 8h8M10 8v7"/></svg>',
        usdt_bep20: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="10" cy="10" r="8"/><path d="M6 8h8M10 8v7"/></svg>',
        toncoin: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 2l7 5v6l-7 5-7-5V7z"/><path d="M10 8v7"/></svg>',
        trx: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 5l14 0-7 12z"/><path d="M3 5l10 3"/></svg>',
        russian_bank: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="6" width="14" height="9" rx="2"/><path d="M3 10h14"/></svg>',
        indian_bank: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="6" width="14" height="9" rx="2"/><path d="M3 10h14"/><circle cx="14" cy="12" r="1.5"/></svg>'
      };
      methodIcons.usdt_ton = methodIcons.usdt_bep20; // USDT on TON (29.10.2026)

      // Show method selection grid
      var html = '<div class="w-withdraw-info">'
        + '<div class="form-group"><label style="font-weight:600;margin-bottom:8px;display:block">'
        + t('wallet_available') + ': <span style="color:var(--accent)">$' + data.balance.toLocaleString() + '</span></label></div>'
        + '<div class="form-group"><label style="font-weight:600;margin-bottom:8px;display:block">Choose withdrawal method</label>'
        + '<div id="methodGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';

      for (var i = 0; i < methods.length; i++) {
        var m = methods[i];
        var icon = methodIcons[m.id] || methodIcons.usdt_trc20;
        html += '<div class="w-method-card" data-method-id="' + m.id + '" style="border:2px solid var(--border);border-radius:var(--radius);padding:12px;cursor:pointer;text-align:center;transition:all 0.2s">'
          + '<div style="width:28px;height:28px;margin:0 auto 6px;color:var(--accent)">' + icon + '</div>'
          + '<div style="font-size:var(--font-sm);font-weight:600">' + m.name + '</div>'
          + '<div style="font-size:var(--font-xs);color:var(--text-muted)">min $' + m.min + '</div>'
          + '</div>';
      }

      html += '</div></div>'
        + '<div style="font-size:var(--font-xs);color:var(--text-muted);margin-top:0.75rem;text-align:center">'
        + 'Fee: 0% · Processing: 24-48h</div>'
        + '</div>';

      body.innerHTML = html;

      // Method card click handlers
      document.querySelectorAll('.w-method-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() { card.style.borderColor = 'var(--accent)'; });
        card.addEventListener('mouseleave', function() { card.style.borderColor = 'var(--border)'; });
        card.addEventListener('click', function() {
          var methodId = card.dataset.methodId;
          var method = methods.find(function(m) { return m.id === methodId; });
          if (method) _showWithdrawForm(body, data, method, modal);
        });
      });

    } catch (e) {
      body.innerHTML = '<div class="w-empty"><div class="w-empty-title">' + e.message + '</div></div>';
    }
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  });
});

function _showWithdrawForm(body, data, method, modal) {
  var html = '<div class="w-withdraw-info">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:1rem;cursor:pointer" id="withdrawBack">'
    + '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4l-6 6 6 6"/></svg>'
    + '<span style="font-size:var(--font-sm);color:var(--text-muted)">Back to methods</span></div>'
    + '<div style="font-weight:600;font-size:var(--font-lg);margin-bottom:1rem">' + method.name + '</div>'
    + '<div class="form-group">'
    + '<label>' + t('wallet_available') + '</label>'
    + '<div style="font-size:var(--font-lg);font-weight:700;color:var(--text)">$' + data.balance.toLocaleString() + '</div></div>'
    + '<div class="form-group">'
    + '<label>' + (t('wallet_amount') || 'Amount') + '</label>'
    + '<input type="number" class="form-input" id="withdrawAmount" min="' + method.min + '" max="' + data.balance + '" step="0.01" placeholder="Min $' + method.min + '">'
    + '</div>'
    + '<div class="form-group">'
    + '<label>' + (method.fieldLabel || 'Address') + '</label>'
    + '<input type="text" class="form-input" id="withdrawAddress" placeholder="' + (method.placeholder || '') + '" style="font-family:monospace;font-size:var(--font-sm)"></div>'
    + '<div class="form-error" id="withdrawError"></div>'
    + '<button class="btn btn-primary" id="withdrawSubmitBtn" style="width:100%">' + t('wallet_withdraw_submit') + '</button>'
    + '<div style="font-size:var(--font-xs);color:var(--text-muted);margin-top:0.75rem;text-align:center">Fee: 0% · Processing: 24-48h</div>'
    + '</div>';

  body.innerHTML = html;

  // Back button
  document.getElementById('withdrawBack').addEventListener('click', function() {
    document.getElementById('withdrawBtn').click();
  });

  // Submit
  document.getElementById('withdrawSubmitBtn').addEventListener('click', async function() {
    var btn = document.getElementById('withdrawSubmitBtn');
    var err = document.getElementById('withdrawError');
    var amount = document.getElementById('withdrawAmount').value;
    var address = document.getElementById('withdrawAddress').value.trim();
    err.textContent = '';
    err.classList.remove('visible');

    if (!amount || parseFloat(amount) < method.min) {
      err.textContent = 'Minimum amount is $' + method.min;
      err.classList.add('visible');
      return;
    }
    if (!address) {
      err.textContent = 'Please enter your ' + (method.fieldLabel || 'address');
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
      var result = await API.request('POST', '/wallet/withdraw', {
        amount: parseFloat(amount),
        wallet_address: address,
        method: method.id
      });
      showToast('Withdrawal of $' + result.netAmount + ' submitted! Processing in 24-48h.', 'success');
      modal.style.display = 'none';
      if (API.user) API.user.balance -= result.amount;
      Router.handle();
    } catch (e) {
      err.textContent = e.message;
      err.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = t('wallet_withdraw_submit');
    }
  });
}

function renderTx(tx) {
  const isIncome = tx.amount > 0;
  const icon = getTxIcon(tx.type);
  const color = isIncome ? '#10b981' : '#ef4444';
  const label = getTxLabel(tx.type);
  // For refund transactions tied to a rejected withdrawal, the backend adds
  // `withdrawal_reason` via LEFT JOIN. Show only when admin provided a reason
  // (NULL/empty means no technical log, we show nothing).
  const reason = (tx.type === 'refund' && typeof tx.withdrawal_reason === 'string' && tx.withdrawal_reason.trim())
    ? tx.withdrawal_reason.trim() : '';
  const row = `
  <div class="w-tx-row">
    <div class="w-tx-icon" style="color:${color};background:${color}15">${icon}</div>
    <div class="w-tx-body">
      <div class="w-tx-label">${label}</div>
      <div class="w-tx-desc">${tx.description || ''}</div>
    </div>
    <div style="text-align:right">
      <div class="w-tx-amount" style="color:${color}">${isIncome ? '+' : '-'}$${_fmtWalletAmt(tx.amount)}</div>
      ${tx.created_at ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px">${_walletTimeAgo(tx.created_at)}</div>` : ''}
    </div>
  </div>`;
  if (!reason) return row;
  return `<div class="w-tx-group">${row}<div class="w-tx-reason"><span class="w-tx-reason-label">${t('wallet_wd_reason')}:</span> ${_wdReasonHtml(reason)}</div></div>`;
}

// Map a stored withdrawal admin_note to user-facing HTML. Localizes the
// quality multi-select marker "[lqp:instagram,twitter]" into the user's
// language; strips the analytics "[code]" prefix from any other reason.
const _WD_LQ_NAMES = {
  instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'X / Twitter',
  facebook: 'Facebook', threads: 'Threads', reddit: 'Reddit', linkedin: 'LinkedIn', telegram: 'Telegram',
};
function _wdReasonHtml(note) {
  // "Social account not verified" rejections are stored as a bare tag so the
  // sentence can be written in the reader's language. The tag must stand alone:
  // a tag followed by text means an admin wrote their own words, and those ship
  // as typed. Historic rows were normalized to the bare tag on 2026-08-11.
  const nsm = note.match(/^\[no_([a-z]+)\]$/i);
  if (nsm) {
    const code = nsm[1].toLowerCase();
    // Inside a sentence the network is named the way the brand writes it;
    // the slashed form above is for comma-separated lists, not prose.
    const name = (code === 'twitter' ? 'X (Twitter)' : (_WD_LQ_NAMES[code] || code));
    const tpl = t('wallet_wd_no_social');
    if (tpl && tpl !== 'wallet_wd_no_social') {
      return _escHtmlMini(tpl.replace(/\{platform\}/g, name));
    }
  }
  const lqm = note.match(/^\[lqp:([a-z0-9_,]+)\]$/i);
  if (lqm) {
    const names = lqm[1].split(',').filter(Boolean).map(p => _WD_LQ_NAMES[p] || p).join(', ');
    return _escHtmlMini(t('wallet_wd_lq_accounts') + ': ' + names);
  }
  const clean = note.replace(/^\[[a-z0-9_-]{1,40}\]\s*/i, '');
  return _escHtmlMini(clean);
}

function renderWithdrawal(w) {
  const statusColors = { pending: '#f59e0b', completed: '#10b981', rejected: '#ef4444' };
  const statusLabels = { pending: t('wallet_wd_pending'), completed: t('wallet_wd_completed'), rejected: t('wallet_wd_rejected') };
  const color = statusColors[w.status] || '#888';
  const icon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 6v8M7 11l3 3 3-3"/><rect x="3" y="3" width="14" height="14" rx="3"/></svg>';
  const note = (w.status === 'rejected' && typeof w.admin_note === 'string' && w.admin_note.trim()) ? w.admin_note.trim() : '';
  // Completed payouts: pull the tx hash from admin_note ("TX: 0x...") and build
  // an explorer link so the user can verify the payment on-chain.
  let _txUrl = '';
  if (w.status === 'completed' && typeof w.admin_note === 'string') {
    const _m = w.admin_note.match(/(0x[a-fA-F0-9]{64}|[A-Za-z0-9_-]{43,})/);
    const _h = _m ? _m[1] : '';
    if (_h) {
      const _n = (w.network || '').toLowerCase();
      if (_n.indexOf('bep20') >= 0 || _n.indexOf('bsc') >= 0) _txUrl = 'https://bscscan.com/tx/' + _h;
      else if (_n.indexOf('trx') >= 0 || _n.indexOf('tron') >= 0) _txUrl = 'https://tronscan.org/#/transaction/' + _h;
      else if (_n.indexOf('ton') >= 0) _txUrl = 'https://tonviewer.com/transaction/' + _h;
    }
  }
  // TON payouts have no easy tx hash — link to the user's address so they see the incoming transfer.
  if (!_txUrl && w.status === 'completed' && (w.network || '').toLowerCase().indexOf('ton') >= 0 && w.wallet_address) {
    _txUrl = 'https://tonviewer.com/' + w.wallet_address;
  }
  const row = `
  <div class="w-tx-row">
    <div class="w-tx-icon" style="color:${color};background:${color}15">${icon}</div>
    <div class="w-tx-body">
      <div class="w-tx-label">${t('wallet_type_withdrawal')}</div>
      <div class="w-tx-desc">#${w.id} ${w.network || ''} ${w.wallet_address ? w.wallet_address.substring(0, 12) + '...' : ''}</div>
    </div>
    <div style="text-align:right">
      <div class="w-tx-amount" style="color:#ef4444">-$${w.amount.toLocaleString()}</div>
      <div style="font-size:11px;margin-top:2px"><span style="color:${color};font-weight:600">${statusLabels[w.status] || w.status}</span></div>
      ${w.created_at ? `<div style="font-size:10px;color:var(--text-muted);margin-top:1px">${_walletTimeAgo(w.created_at)}</div>` : ''}
      ${w.status === 'completed' && w.processed_at ? `<div style="font-size:10px;color:#10b981;margin-top:1px">${t('wallet_wd_paid')} ${_walletTimeAgo(w.processed_at)}</div>` : ''}
      ${_txUrl ? `<div style="font-size:10px;margin-top:2px"><a href="${_txUrl}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline">${t('wallet_wd_view_tx')} \u2197</a></div>` : ''}
    </div>
  </div>`;
  if (!note) return row;
  return `<div class="w-tx-group">${row}<div class="w-tx-reason"><span class="w-tx-reason-label">${t('wallet_wd_reason')}:</span> ${_wdReasonHtml(note)}</div></div>`;
}

// Minimal HTML escape for user-facing text (admin note may contain unexpected characters)
function _escHtmlMini(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function getTxIcon(type) {
  const icons = {
    task_reward: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.5-.8z"/></svg>',
    referral: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 8a3 3 0 10-6 0 3 3 0 006 0zM2 17c0-3 3-5 6-5s6 2 6 5"/><path d="M16 3l2 2-4 4"/></svg>',
    deposit: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 14V6M7 9l3-3 3 3"/><rect x="3" y="3" width="14" height="14" rx="3"/></svg>',
    withdrawal: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 6v8M7 11l3 3 3-3"/><rect x="3" y="3" width="14" height="14" rx="3"/></svg>',
    order: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 8h6M7 12h4"/></svg>',
    refund: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10a6 6 0 1112 0 6 6 0 01-12 0z"/><path d="M10 7v6M7 10h6"/></svg>',
    admin_credit: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.5-.8z"/></svg>',
    admin_debit: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7"/><path d="M7 10h6"/></svg>',
    achievement_bonus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l1.5 3.1 3.4.5-2.5 2.4.6 3.4L10 9.7 7 11.4l.6-3.4-2.5-2.4 3.4-.5z"/><path d="M6 14l-2 4h12l-2-4"/></svg>',
    forum_reward: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5h12a2 2 0 012 2v6a2 2 0 01-2 2H8l-4 3v-3a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>',
    worker_card_bonus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="14" height="12" rx="2"/><path d="M7 9h6M7 12h4"/><circle cx="13" cy="7" r="1.5"/></svg>',
    contest_prize: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4z"/></svg>',
  };
  return icons[type] || icons.task_reward;
}

function getTxLabel(type) {
  const map = {
    task_reward: t('wallet_type_task_reward'),
    referral: t('wallet_type_referral'),
    deposit: t('wallet_type_deposit'),
    withdrawal: t('wallet_type_withdrawal'),
    order: t('wallet_type_order'),
    refund: t('wallet_type_refund'),
    admin_credit: t('wallet_type_admin_credit'),
    admin_debit: t('wallet_type_admin_debit'),
    achievement_bonus: t('wallet_type_achievement_bonus') || 'Achievement Bonus',
    forum_reward: t('wallet_type_forum_reward') || 'Forum Reward',
    worker_card_bonus: t('wallet_type_worker_card_bonus') || 'Worker Card Bonus',
    contest_prize: t('wallet_type_contest_prize') || 'Contest Prize',
  };
  return map[type] || type;
}

function _fmtWalletAmt(amount) {
  const abs = Math.abs(amount);
  if (abs < 0.001) return abs.toFixed(4);  // micro amounts (referral commissions $0.0002+)
  if (abs < 0.01) return abs.toFixed(3);
  if (abs < 1) return abs.toFixed(2);
  return abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function _walletTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  let isoStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  if (!isoStr.endsWith('Z')) isoStr += 'Z';
  const d = new Date(isoStr);
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return I18N.lang === 'ru' ? 'только что' : 'just now';
  if (mins < 60) return mins + (I18N.lang === 'ru' ? ' мин' : 'm ago');
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + (I18N.lang === 'ru' ? ' ч' : 'h ago');
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + (I18N.lang === 'ru' ? ' дн' : 'd ago');
  return d.toLocaleDateString(I18N.lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' });
}
