// === SUPPORT TICKET LIST ===
Router.register('support', async (app) => {
  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('support')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('support_title')}</h1>
          <p>${t('support_subtitle')}</p>
        </div>
      </div>
      <div class="page-content">
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
          <button class="btn btn-primary" style="width:auto" id="btnNewTicket">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            ${t('support_new_ticket')}
          </button>
        </div>
        <div id="ticketsList"></div>
        <div id="ticketsEmpty" style="display:none" class="card"><div class="card-body">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3>${t('support_no_tickets')}</h3>
            <p>${t('support_no_tickets_hint')}</p>
          </div>
        </div></div>
      </div>
    </main>
  </div>`;

  // New ticket modal
  document.getElementById('btnNewTicket').addEventListener('click', showNewTicketModal);

  async function loadTickets() {
    try {
      const data = await API.request('GET', '/support/tickets?lang=' + encodeURIComponent(I18N.lang));
      _accountRestricted = !!data.is_restricted;
      renderTickets(data.tickets || []);
    } catch (e) { showToast(e.message, 'error'); }
  }

  function renderTickets(tickets) {
    _supNoticeCss();
    const list = document.getElementById('ticketsList');
    const empty = document.getElementById('ticketsEmpty');
    if (!tickets.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    list.innerHTML = tickets.map(renderTicketRow).join('');
  }

  function renderTicketRow(ticket) {
    const statusMap = {
      open:     { text: t('support_status_open'),     cls: 'sup-status-open' },
      answered: { text: t('support_status_answered'),  cls: 'sup-status-answered' },
      closed:   { text: t('support_status_closed'),    cls: 'sup-status-closed' },
    };
    const catMap = {
      general: t('support_cat_general'),
      payment: t('support_cat_payment'),
      task:    t('support_cat_task'),
      account: t('support_cat_account'),
      bug:     t('support_cat_bug'),
      broadcast: t('support_cat_broadcast'),
    };
    const s = statusMap[ticket.status] || statusMap.open;
    const catLabel = catMap[ticket.category] || catMap.general;
    const preview = ticket.last_message ? escHtml(ticket.last_message.length > 80 ? ticket.last_message.substring(0, 80) + '...' : ticket.last_message) : '';
    const unreadNotice = ticket.is_broadcast && !ticket.last_read_at;

    return `
    <div class="sup-ticket-row${ticket.is_broadcast ? ' sup-ticket-notice' : ''}${unreadNotice ? ' is-unread' : ''}" onclick="Router.navigate('/support-ticket?id=${ticket.id}')">
      <div class="sup-ticket-body">
        <div class="sup-ticket-top">
          <span class="sup-ticket-subject">${escHtml(ticket.subject)}</span>
          <span class="sup-cat-badge sup-cat-${ticket.category}">${catLabel}</span>
        </div>
        <div class="sup-ticket-preview">${preview}</div>
        <div class="sup-ticket-meta">
          ${ticket.is_broadcast ? '' : `<span class="sup-status-badge ${s.cls}">${s.text}</span>`}
          <span class="sup-ticket-time">${timeAgo(ticket.updated_at)}</span>
          ${ticket.is_broadcast ? '' : `<span class="sup-ticket-msgs">${ticket.message_count || 0} msg</span>`}
        </div>
      </div>
      <svg class="sup-ticket-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`;
  }

  loadTickets();

  // Auto-open new ticket modal if appeal param
  if (new URLSearchParams(window.location.search).get('appeal') === '1') {
    setTimeout(() => showNewTicketModal(), 300);
  }
});

// Styles of the notices from PR.SOCIAL (mailings), added once.
function _supNoticeCss() {
  if (document.getElementById('supNoticeCss')) return;
  const st = document.createElement('style');
  st.id = 'supNoticeCss';
  st.textContent = `
.sup-ticket-notice .sup-ticket-subject{font-weight:700}
.sup-ticket-notice.is-unread{box-shadow:inset 3px 0 0 var(--primary,#ea580c)}
.sup-ticket-notice.is-unread .sup-ticket-subject::after{content:"";display:inline-block;width:7px;height:7px;margin-left:7px;border-radius:50%;background:var(--primary,#ea580c);vertical-align:2px}
.sup-cat-broadcast{background:rgba(234,88,12,.12)!important;color:#ea580c!important}
.sup-notice{margin-top:8px;padding:20px 22px;border-radius:16px;background:linear-gradient(135deg,rgba(234,88,12,.07),transparent 55%),var(--bg-card,#fff);border:1px solid var(--border,#e5e7eb);max-width:760px}
.sup-notice-top{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:12px;color:var(--text-muted,#6b7280)}
.sup-notice-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;background:rgba(234,88,12,.12);color:#ea580c;font-weight:700;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.sup-notice-title{margin:12px 0 10px;font-size:19px;line-height:1.3;font-weight:800;color:var(--text-primary,#111)}
.sup-notice-img{display:block;max-width:100%;max-height:360px;border-radius:12px;margin:0 0 12px;object-fit:cover}
.sup-notice-body{font-size:14.5px;line-height:1.6;color:var(--text-secondary,#374151);word-wrap:break-word;overflow-wrap:anywhere}
.sup-notice-body a{color:#ea580c;font-weight:600;text-decoration:underline;text-underline-offset:2px}
.sup-notice-body blockquote{margin:8px 0;padding:6px 12px;border-left:3px solid #ea580c;background:rgba(234,88,12,.06);border-radius:6px}
.sup-notice-body code,.sup-notice-body pre{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;background:rgba(127,127,127,.12);border-radius:5px;padding:1px 5px}
.sup-notice-body pre{display:block;padding:8px 10px;white-space:pre-wrap}
.sup-notice-sign{margin-top:16px;font-weight:700;font-size:13.5px;color:var(--text-primary,#111)}
.sup-notice-note{margin-top:12px;max-width:760px;font-size:13px;color:var(--text-muted,#6b7280)}
@media (max-width:600px){.sup-notice{padding:16px}.sup-notice-title{font-size:17px}}`;
  document.head.appendChild(st);
}

// === NEW TICKET MODAL ===
/* Set from the ticket list response. A restricted account may only appeal;
 * an unrestricted one has nothing to appeal, so it never sees that category. */
let _accountRestricted = false;

function showNewTicketModal() {
  // Remove existing modal
  document.querySelector('.modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      <div class="task-modal">
        <h3 style="font-size:var(--font-lg);font-weight:700;margin-bottom:16px">${t('support_new_ticket')}</h3>
        <div class="form-group">
          <label>${t('support_subject')}</label>
          <input class="form-input" id="ticketSubject" placeholder="${t('support_subject_placeholder')}" maxlength="200">
        </div>
        <div class="form-group">
          <label>${t('support_category')}</label>
          ${_accountRestricted ? `
            <input type="hidden" id="ticketCategory" value="restriction">
            <div class="form-input" style="display:flex;align-items:center;background:var(--bg-subtle,rgba(0,0,0,.03));color:var(--text-muted);cursor:default">
              ${t('support_cat_restriction')}
            </div>` : `
            <select class="form-input" id="ticketCategory">
              <option value="payment">${t('support_cat_payment')}</option>
              <option value="task">${t('support_cat_task')}</option>
              <option value="bug">${t('support_cat_bug')}</option>
            </select>`}
        </div>
        <div class="form-group">
          <label>${t('support_message')}</label>
          <textarea class="form-input" id="ticketMessage" rows="5" placeholder="${t('support_message_placeholder')}" maxlength="5000" style="resize:vertical;min-height:100px"></textarea>
        </div>
        <div class="form-group">
          <label>${t('support_attach_image') || 'Attach image'}</label>
          <div id="ticketImageArea" style="display:flex;align-items:center;gap:8px">
            <label for="ticketImage" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px dashed var(--border);border-radius:var(--radius);cursor:pointer;font-size:var(--font-sm);color:var(--text-muted);transition:border-color 0.2s">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              <span id="ticketImageLabel">${t('support_choose_image') || 'Choose image (max 5MB)'}</span>
            </label>
            <input type="file" id="ticketImage" accept="image/*" style="display:none">
            <div id="ticketImagePreview" style="display:none;position:relative">
              <img id="ticketImageThumb" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
              <button type="button" id="ticketImageRemove" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--danger);color:#fff;border:none;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">&times;</button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" id="btnSubmitTicket">${t('support_send')}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  // Restriction eligibility error interceptor
  (function() {
    const orig = window.fetch ? window.fetch.bind(window) : null;
    if (!orig) return;
    window.fetch = async function(url, opts) {
      const res = await orig(url, opts);
      try {
        if (res.status === 403 && typeof url === 'string' && url.includes('/api/support/tickets') && opts && (opts.method || '').toUpperCase() === 'POST') {
          const cloned = res.clone();
          const data = await cloned.json().catch(() => null);
          if (data && (data.error === 'restriction_not_eligible' || data.error === 'restriction_not_applicable')) {
            if (typeof showToast === 'function') {
              /* Server wording is the fallback: the gate is normally invisible
               * because the category is not offered in the first place. */
              showToast(data.message || (typeof t === 'function' && t('support_restriction_not_eligible')) || 'This category is not available for your account.', 'error');
            }
          }
        }
      } catch {}
      return res;
    };
  })();

  /* ?appeal=1 lands here from the restriction banner. Only a restricted
   * account can appeal, and its category is already fixed above, so this just
   * fills in the subject and the hint. */
  if (new URLSearchParams(window.location.search).get('appeal') === '1') {
    if (_accountRestricted) {
      const subj = document.getElementById('ticketSubject');
      const msg = document.getElementById('ticketMessage');
      if (subj && !subj.value) subj.value = (typeof t === 'function' ? t('suspicious_appeal_subject') : 'Account restriction appeal');
      if (msg) {
        const hint = (typeof t === 'function' ? t('suspicious_appeal_hint') : '');
        if (hint) msg.placeholder = hint;
      }
    }
    history.replaceState(null, '', '/support');
  }

  // Image preview
  document.getElementById('ticketImage').addEventListener('change', function() {
    var file = this.files[0];
    var preview = document.getElementById('ticketImagePreview');
    var thumb = document.getElementById('ticketImageThumb');
    var label = document.getElementById('ticketImageLabel');
    if (file) {
      thumb.src = URL.createObjectURL(file);
      preview.style.display = 'block';
      label.textContent = file.name.substring(0, 20) + (file.name.length > 20 ? '...' : '');
    }
  });
  document.getElementById('ticketImageRemove')?.addEventListener('click', function() {
    document.getElementById('ticketImage').value = '';
    document.getElementById('ticketImagePreview').style.display = 'none';
    document.getElementById('ticketImageLabel').textContent = t('support_choose_image') || 'Choose image (max 5MB)';
  });

  document.getElementById('btnSubmitTicket').addEventListener('click', async () => {
    const subject = document.getElementById('ticketSubject').value.trim();
    const category = document.getElementById('ticketCategory').value;
    const message = document.getElementById('ticketMessage').value.trim();

    if (!subject || !message) return showToast(t('profile_fill_all'), 'error');

    const btn = document.getElementById('btnSubmitTicket');
    btn.disabled = true;
    try {
      const fd = new FormData();
      fd.append('subject', subject);
      fd.append('category', category);
      fd.append('message', message);
      const imgFile = document.getElementById('ticketImage').files[0];
      if (imgFile) fd.append('image', imgFile);
      await API.upload('POST', '/support/tickets', fd);
      showToast(t('support_created'), 'success');
      overlay.remove();
      // Reload ticket list
      Router.handle();
    } catch (e) {
      const msg = (e && (e.message || e.error || String(e))) || '';
      if (msg.indexOf('already_open_ticket') >= 0) {
        showToast((typeof t === 'function' && t('support_already_open_ticket')) || 'You already have an open ticket. Please wait for our reply.', 'error');
      } else {
        showToast(msg || 'Error', 'error');
      }
      btn.disabled = false;
    }
  });
}

// === SUPPORT TICKET DETAIL ===
Router.register('support-ticket', async (app) => {
  const params = new URLSearchParams(window.location.search);
  const ticketId = params.get('id');
  if (!ticketId) { Router.navigate('/support'); return; }

  app.innerHTML = `
  <div class="app-layout">
    ${renderSidebar('support')}
    <main class="main-content">
      <div class="page-header">
        ${renderHamburger()}
        <div class="page-header-text">
          <h1>${t('support_title')}</h1>
          <p id="ticketSubjectHeader"></p>
        </div>
      </div>
      <div class="page-content">
        <a class="sup-back-link" onclick="Router.navigate('/support')">${t('support_back')}</a>
        <div id="ticketHeader"></div>
        <div class="sup-chat" id="ticketChat"></div>
        <div id="ticketReplyForm"></div>
      </div>
    </main>
  </div>`;

  async function loadTicket() {
    try {
      const data = await API.request('GET', `/support/tickets/${ticketId}?lang=` + encodeURIComponent(I18N.lang));
      if (data.ticket && data.ticket.is_broadcast && data.notice) renderNotice(data.ticket, data.notice);
      else renderTicketDetail(data.ticket, data.messages);
    } catch (e) {
      showToast(e.message, 'error');
      Router.navigate('/support');
    }
  }

  // A notice from PR.SOCIAL (a mailing): the text in the reader's language, links that work,
  // signed by the team — not a chat with a staff member's name on it.
  function renderNotice(ticket, n) {
    _supNoticeCss();
    document.getElementById('ticketSubjectHeader').textContent = n.title || ticket.subject;
    document.getElementById('ticketHeader').innerHTML = '';
    const img = n.image_url && /^https:\/\//.test(n.image_url) ? `<img class="sup-notice-img" src="${escHtml(n.image_url)}" alt="" loading="lazy">` : '';
    document.getElementById('ticketChat').outerHTML = `<div class="sup-notice" id="ticketChat" dir="auto">
        <div class="sup-notice-top"><span class="sup-notice-badge">${t('support_cat_broadcast')}</span><span class="sup-ticket-time">${timeAgo(ticket.created_at)}</span></div>
        <h2 class="sup-notice-title">${escHtml(n.title || ticket.subject)}</h2>
        ${img}
        <div class="sup-notice-body">${n.html || ''}</div>
        <div class="sup-notice-sign">${t('support_broadcast_from')}</div>
      </div>`;
    document.getElementById('ticketReplyForm').innerHTML = `<div class="sup-notice-note">${t('support_broadcast_note')}</div>`;
  }

  function renderTicketDetail(ticket, messages) {
    const statusMap = {
      open:     { text: t('support_status_open'),     cls: 'sup-status-open' },
      answered: { text: t('support_status_answered'),  cls: 'sup-status-answered' },
      closed:   { text: t('support_status_closed'),    cls: 'sup-status-closed' },
    };
    const catMap = {
      general: t('support_cat_general'),
      payment: t('support_cat_payment'),
      task:    t('support_cat_task'),
      account: t('support_cat_account'),
      bug:     t('support_cat_bug'),
    };
    const s = statusMap[ticket.status] || statusMap.open;
    const catLabel = catMap[ticket.category] || catMap.general;

    document.getElementById('ticketSubjectHeader').textContent = ticket.subject;

    document.getElementById('ticketHeader').innerHTML = `
      <div class="sup-detail-header">
        <div class="sup-detail-info">
          <span class="sup-cat-badge sup-cat-${ticket.category}">${catLabel}</span>
          <span class="sup-status-badge ${s.cls}">${s.text}</span>
          <span class="sup-ticket-time">${timeAgo(ticket.created_at)}</span>
        </div>
        ${ticket.status !== 'closed' ? `<button class="btn btn-secondary btn-sm" id="btnCloseTicket">${t('support_close_ticket')}</button>` : ''}
      </div>`;

    // Chat messages
    const chatEl = document.getElementById('ticketChat');
    chatEl.innerHTML = messages.map(msg => {
      const isOwn = !msg.is_admin;
      return `
      <div class="sup-msg ${isOwn ? 'sup-msg-own' : 'sup-msg-admin'}">
        <div class="sup-msg-bubble">
          <div class="sup-msg-text">${escHtml(msg.message).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')}</div>
          ${msg.image_url ? '<div style="margin-top:6px"><img src="' + msg.image_url + '" style="max-width:280px;max-height:200px;border-radius:8px;cursor:pointer;border:1px solid var(--border)" onclick="window.open(this.src,\'_blank\')">' + '</div>' : ''}
          <div class="sup-msg-meta">
            <span>${escHtml(msg.username)}</span>
            <span>${timeAgo(msg.created_at)}</span>
          </div>
        </div>
      </div>`;
    }).join('');

    // Scroll to bottom
    chatEl.scrollTop = chatEl.scrollHeight;

    // Reply form
    const replyEl = document.getElementById('ticketReplyForm');
    if (ticket.status !== 'closed') {
      replyEl.innerHTML = `
        <div class="sup-reply-form">
          <textarea class="form-input" id="replyMessage" rows="3" placeholder="${t('support_reply_placeholder')}" maxlength="5000" style="resize:vertical;min-height:60px"></textarea>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
            <label for="replyImage" style="display:flex;align-items:center;gap:4px;padding:6px 10px;border:1.5px dashed var(--border);border-radius:var(--radius);cursor:pointer;font-size:var(--font-xs);color:var(--text-muted)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              <span id="replyImageLabel">Image</span>
            </label>
            <input type="file" id="replyImage" accept="image/*" style="display:none">
            <div id="replyImagePreview" style="display:none;position:relative">
              <img id="replyImageThumb" style="width:36px;height:36px;object-fit:cover;border-radius:4px;border:1px solid var(--border)">
              <button type="button" id="replyImageRemove" style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--danger);color:#fff;border:none;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center">&times;</button>
            </div>
          </div>
          <button class="btn btn-primary" style="margin-top:8px" id="btnSendReply">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            ${t('support_send')}
          </button>
        </div>`;

      // Reply image preview
      document.getElementById('replyImage')?.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
          document.getElementById('replyImageThumb').src = URL.createObjectURL(file);
          document.getElementById('replyImagePreview').style.display = 'block';
          document.getElementById('replyImageLabel').textContent = file.name.substring(0, 15) + (file.name.length > 15 ? '...' : '');
        }
      });
      document.getElementById('replyImageRemove')?.addEventListener('click', function() {
        document.getElementById('replyImage').value = '';
        document.getElementById('replyImagePreview').style.display = 'none';
        document.getElementById('replyImageLabel').textContent = 'Image';
      });

      document.getElementById('btnSendReply').addEventListener('click', async () => {
        const message = document.getElementById('replyMessage').value.trim();
        const imgFile = document.getElementById('replyImage')?.files[0];
        if (!message && !imgFile) return;

        const btn = document.getElementById('btnSendReply');
        btn.disabled = true;
        try {
          const fd = new FormData();
          fd.append('message', message || '(image)');
          if (imgFile) fd.append('image', imgFile);
          await API.upload('POST', `/support/tickets/${ticketId}/reply`, fd);
          showToast(t('support_replied'), 'success');
          loadTicket();
        } catch (e) {
          showToast(e.message, 'error');
          btn.disabled = false;
        }
      });
    } else {
      replyEl.innerHTML = `<div class="sup-closed-notice">${t('support_status_closed')}</div>`;
    }

    // Close ticket button
    const closeBtn = document.getElementById('btnCloseTicket');
    if (closeBtn) {
      closeBtn.addEventListener('click', async () => {
        closeBtn.disabled = true;
        try {
          await API.request('POST', `/support/tickets/${ticketId}/close`);
          showToast(t('support_closed'), 'success');
          loadTicket();
        } catch (e) {
          showToast(e.message, 'error');
          closeBtn.disabled = false;
        }
      });
    }
  }

  loadTicket();
});
