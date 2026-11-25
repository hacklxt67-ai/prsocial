Router.register('login', (app) => {
  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <style>@media (max-width:350px){.auth-beta{left:auto!important;right:0;top:-18px!important}}</style>
        <h1 style="position:relative;display:inline-block">PR<span style="color:var(--accent)">.</span>SOCIAL<span class="auth-beta" style="position:absolute;top:-2px;left:calc(100% + 4px);white-space:nowrap;font-size:11px;font-weight:600;color:var(--accent);background:rgba(34,197,94,0.15);padding:2px 6px;border-radius:4px;letter-spacing:1px">BETA 2.0</span></h1>
        <p>${t('app_tagline')}</p>
      </div>
      <div class="auth-card">
        <h2>${t('auth_signin')}</h2>
        <form id="loginForm">
          <div class="form-group">
            <label>${t('auth_email')}</label>
            <input type="text" inputmode="email" autocapitalize="none" spellcheck="false" class="form-input" id="loginEmail" placeholder="${t('auth_email_placeholder')}" required autocomplete="username">
          </div>
          <div class="form-group">
            <label>${t('auth_password')}</label>
            <div class="password-wrapper"><input type="password" class="form-input" id="loginPassword" placeholder="${t('auth_password_placeholder')}" required autocomplete="current-password"><button type="button" class="pw-toggle" onclick="_togglePw(this)" tabindex="-1" aria-label="Show password"><svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg></button></div>
          </div>
          <div style="text-align:right;margin-bottom:8px"><a href="/forgot-password" style="font-size:12px;color:var(--accent)">${t('auth_forgot_password')}</a></div>
          <div id="loginTurnstile" class="cf-turnstile" style="margin-bottom:8px"></div>
          <div class="form-error" id="loginError"></div>
          <button type="submit" class="btn btn-primary" id="loginBtn">${t('auth_signin')}</button>
        </form>
        <div class="auth-footer">
          ${t('auth_no_account')} <a href="/register">${t('auth_create_one')}</a>
        </div>
      </div>
      <div id="loginStats" style="display:flex;justify-content:center;gap:24px;font-size:12px;color:var(--text-muted);margin-top:12px"></div>
      <div class="auth-lang-select">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <select onchange="I18N.switchTo(this.value)">
          ${I18N.available.map(l => '<option value="' + l.code + '"' + (I18N.lang === l.code ? ' selected' : '') + '>' + l.label + '</option>').join('')}
        </select>
        <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme"></button>
      </div>
      <div class="auth-bottom-footer">
        <a href="https://x.com/prsocial_app" target="_blank" rel="noopener" title="X" class="auth-footer-link"><svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;vertical-align:-2px"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        <span class="auth-footer-dot"></span>
        <a href="https://t.me/prsocial_info" target="_blank" rel="noopener" title="Telegram" class="auth-footer-link"><svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;vertical-align:-2px"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> Telegram</a>
        <span class="auth-footer-dot"></span>
        <span>&copy; 2021–${new Date().getFullYear()} PR.SOCIAL</span>
        <span class="auth-footer-dot"></span>
        <a href="/privacy" class="auth-footer-link">${t('pp_title')}</a>
        <span class="auth-footer-dot"></span>
        <a href="/terms" class="auth-footer-link">${t('tos_title')}</a>
        <span class="auth-footer-dot"></span>
        <a href="/rules" class="auth-footer-link">${t('rules_link')}</a>
        <span class="auth-footer-dot"></span>
        <a href="/guides" class="auth-footer-link">${t('nav_guides') || 'Guides'}</a>
        <span class="auth-footer-dot"></span>
        <a href="/api" class="auth-footer-link">API</a>
      </div>
      <div class="auth-bottom-footer" style="margin-top:4px;font-size:10px;opacity:0.5">
        ${t('footer_partners')}: <a href="https://prm4u.com" target="_blank" rel="noopener" class="auth-footer-link">prm4u.com</a>
        <span class="auth-footer-dot"></span>
        <a href="https://smm.guide" target="_blank" rel="noopener" class="auth-footer-link">smm.guide</a>
        <span class="auth-footer-dot"></span>
        <a href="https://fast-pay.money" target="_blank" rel="noopener" class="auth-footer-link">fast-pay.money</a>
        <span class="auth-footer-dot"></span>
        <a href="https://pr-safe.com" target="_blank" rel="noopener" class="auth-footer-link">pr-safe.com</a>
      </div>
    </div>
  </div>`;

  // Render Turnstile widget
  let loginTurnstileId;
  if (window.turnstile) {
    loginTurnstileId = turnstile.render('#loginTurnstile', { sitekey: '0x4AAAAAAComvejBuoADKL4m', theme: 'auto', size: 'flexible' });
  }

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const err = document.getElementById('loginError');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Get Turnstile token
    const cfToken = window.turnstile ? turnstile.getResponse(loginTurnstileId) : null;
    if (!cfToken) {
      err.textContent = 'Please complete the captcha';
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    err.classList.remove('visible');

    try {
      const data = await API.login(email, password, cfToken);
      // a person who turned 2-step verification on: the code is asked here, and the cabinet opens after it
      if (data && data.requires_2fa && data.person) { loginSecondStep(app.querySelector('.auth-card'), data); return; }
      showToast(t('auth_welcome_back'), 'success');
      Router.navigate(Router._returnTo || '/dashboard');
      Router._returnTo = null;
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.add('visible');
    } finally {
      if (document.getElementById('loginBtn')) { // the form is still there (the second step replaces it)
        btn.disabled = false;
        btn.textContent = t('auth_signin');
        if (window.turnstile) turnstile.reset(loginTurnstileId);
      }
    }
  });

  // Load live stats
  fetch('/api/public/stats').then(r => r.json()).then(d => {
    if (!d.ok) return;
    var el = document.getElementById('loginStats');
    if (!el) return;
    function fmtN(n) { return n.toLocaleString('en-US'); }
    el.innerHTML = '<span><strong>' + fmtN(d.users) + '</strong> users</span>'
      + '<span><strong>' + fmtN(d.tasks) + '</strong> tasks done</span>'
      + '<span><strong>$' + fmtN(d.earned) + '</strong> earned</span>';
  }).catch(function(){});
});

// The second step of signing in, for a person who turned 2-step verification on in their profile: the code from Telegram
// or from the authenticator app, or a recovery code. The server keeps the sign-in open for ten minutes and gives the
// session only after the code (POST /api/auth/2fa/send and /verify-2fa). Staff sign in through the admin console.
function loginSecondStep(card, first) {
  const has = first.methods || [], hints = first.hints || {};
  const st = { way: first.method === 'totp' ? 'app' : 'tg', wait: first.retry_in || 0, stop: '', err: first.sent === false ? t('tfa_not_sent') : '', busy: false, trust: false };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const device = getDeviceFingerprint().catch(() => null);
  const post = async (path, body) => {
    try {
      const r = await fetch('/api/auth/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      return Object.assign(d, { ok: r.ok && d.ok === true });
    } catch (e) { return { ok: false, code: 'OFFLINE' }; }
  };
  const link = 'background:none;border:none;color:var(--accent);cursor:pointer;font:inherit;font-size:13px;padding:12px 8px;min-height:44px';
  const timer = setInterval(() => {
    if (!card.isConnected) { clearInterval(timer); return; }
    if (st.wait <= 0) return;
    st.wait--;
    const el = card.querySelector('#tfaWait');
    if (el && st.wait > 0) el.textContent = t('tfa_resend_in').replace('{time}', mmss(st.wait)); else if (el) draw();
  }, 1000);

  function draw() {
    const typed = card.querySelector('#tfaCode') ? card.querySelector('#tfaCode').value : '';
    if (st.stop) {
      card.innerHTML = '<h2>' + esc(t('tfa_stop_' + st.stop + '_t')) + '</h2><p style="color:var(--text-muted);font-size:14px;line-height:1.5;margin:0 0 16px">' + esc(t('tfa_stop_' + st.stop)) + '</p>'
        + '<button type="button" class="btn btn-primary" id="tfaRestart">' + esc(t('tfa_restart')) + '</button>';
      card.querySelector('#tfaRestart').addEventListener('click', () => location.reload());
      return;
    }
    const rc = st.way === 'rc';
    const sub = st.way === 'tg' ? esc(t('tfa_sub_tg')).replace('{name}', '<bdi>' + esc(hints.telegram || 'Telegram') + '</bdi>') : rc ? esc(t('tfa_sub_rc')) : '';
    const other = [st.way !== 'tg' && has.includes('telegram') ? 'tg' : '', st.way !== 'app' && has.includes('totp') ? 'app' : '', !rc && has.includes('totp') && hints.recovery ? 'rc' : ''].filter(Boolean);
    card.innerHTML = '<h2>' + esc(t('tfa_title_' + st.way)) + '</h2>' + (sub ? '<p style="color:var(--text-muted);font-size:14px;margin:0 0 14px">' + sub + '</p>' : '')
      + '<form id="tfaForm" novalidate>'
      + '<label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 14px;cursor:pointer;text-align:start"><input type="checkbox" id="tfaTrust"' + (st.trust ? ' checked' : '') + ' style="width:20px;height:20px;margin:2px 0 0;flex:none">'
      + '<span><b style="display:block;font-size:14px">' + esc(t('tfa_trust')) + '</b><small style="color:var(--text-muted);font-size:12px">' + esc(t('tfa_trust_note')) + '</small></span></label>'
      + '<div class="form-group"><label for="tfaCode">' + esc(t('tfa_label_' + st.way)) + '</label>'
      + (rc ? '<input class="form-input" id="tfaCode" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" maxlength="11" placeholder="XXXXX-XXXXX" style="letter-spacing:2px;text-transform:uppercase">'
        : '<input class="form-input" id="tfaCode" inputmode="numeric" autocomplete="one-time-code" enterkeyhint="go" maxlength="6" placeholder="000000" style="letter-spacing:6px;font-size:20px;text-align:center">')
      + (rc ? '' : '<small style="display:block;margin-top:6px;color:var(--text-muted);font-size:12px">' + esc(t('tfa_hint_' + st.way)) + '</small>') + '</div>'
      + '<div class="form-error' + (st.err ? ' visible' : '') + '" id="tfaError">' + esc(st.err) + '</div>'
      + '<button type="submit" class="btn btn-primary" id="tfaBtn"' + (st.busy ? ' disabled' : '') + '>' + (st.busy ? '<div class="spinner"></div>' : esc(t('tfa_signin'))) + '</button></form>'
      + '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:0 8px;margin-top:8px">'
      + (st.way === 'tg' ? (st.wait > 0 ? '<span id="tfaWait" style="' + link + ';color:var(--text-muted);cursor:default;display:inline-flex;align-items:center">' + esc(t('tfa_resend_in').replace('{time}', mmss(st.wait))) + '</span>' : '<button type="button" id="tfaResend" style="' + link + '">' + esc(t('tfa_resend')) + '</button>') : '')
      + other.map((w) => '<button type="button" data-tfa-way="' + w + '" style="' + link + '">' + esc(t('tfa_way_' + w)) + '</button>').join('') + '</div>'
      + '<div class="auth-footer"><a href="/login" id="tfaOther">' + esc(t('tfa_other_account')) + '</a> · <a href="mailto:support@pr.social">' + esc(t('tfa_no_code')) + '</a></div>';
    const input = card.querySelector('#tfaCode');
    if (typed && !st.fresh) input.value = typed;
    st.fresh = false;
    card.querySelector('#tfaTrust').addEventListener('change', (e) => { st.trust = e.target.checked; });
    card.querySelector('#tfaForm').addEventListener('submit', (e) => { e.preventDefault(); go(); });
    card.querySelector('#tfaOther').addEventListener('click', (e) => { e.preventDefault(); location.reload(); });
    card.querySelectorAll('[data-tfa-way]').forEach((b) => b.addEventListener('click', () => { st.way = b.getAttribute('data-tfa-way'); st.err = ''; st.fresh = true; draw(); }));
    const again = card.querySelector('#tfaResend');
    if (again) again.addEventListener('click', resend);
    // the sixth digit signs in at once, as a code field does everywhere on the site
    if (!rc) input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); if (input.value.length === 6 && !st.busy) go(); });
    if (!st.busy) input.focus();
  }

  async function resend() {
    if (st.busy) return;
    const d = await post('2fa/send', { session_id: first.session_id, method: 'telegram' });
    if (d.ok) { st.wait = d.retry_in || 30; st.err = ''; showToast(t('tfa_sent'), 'success'); }
    else if (d.code === 'WAIT') st.wait = d.retry_in || 30;
    else if (d.code === 'NO_MORE_CODES') st.stop = 'nosend';
    else if (d.code === 'EXPIRED') st.stop = 'gone';
    else st.err = d.code === 'OFFLINE' ? t('tfa_err_net') : t('tfa_not_sent');
    draw();
  }

  async function go() {
    const input = card.querySelector('#tfaCode'), rc = st.way === 'rc', code = (input ? input.value : '').trim();
    if (rc ? code.replace(/[^A-Za-z0-9]/g, '').length !== 10 : !/^\d{6}$/.test(code)) { st.err = t(rc ? 'tfa_err_short_rc' : 'tfa_err_short'); draw(); return; }
    st.busy = true; st.err = ''; draw();
    const d = await post('verify-2fa', { session_id: first.session_id, code, method: { tg: 'telegram', app: 'totp', rc: 'recovery' }[st.way], trust_device: st.trust, fingerprint: await device });
    st.busy = false;
    if (d.ok && d.user) {
      clearInterval(timer);
      API.user = d.user;
      try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(d.user)); } catch (_) {}
      showToast(t('auth_welcome_back'), 'success');
      Router.navigate(Router._returnTo || '/dashboard');
      Router._returnTo = null;
      return;
    }
    st.fresh = true;
    if (d.code === 'BAD_CODE') st.err = t('tfa_err_bad_' + Math.min(4, Math.max(1, d.left || 1)));
    else if (d.code === 'LOCKED') st.stop = 'lock';
    else if (d.code === 'EXPIRED') st.stop = 'gone';
    else st.err = d.code === 'OFFLINE' ? t('tfa_err_net') : (d.error || t('tfa_err_net'));
    draw();
  }

  draw();
}
