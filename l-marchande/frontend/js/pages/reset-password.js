Router.register('forgot-password', (app) => {
  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1 style="position:relative;display:inline-block">PR<span style="color:var(--accent)">.</span>SOCIAL</h1>
        <p>${t('app_tagline')}</p>
      </div>
      <div class="auth-card">
        <h2>${t('auth_forgot_password')}</h2>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">${t('auth_forgot_desc')}</p>
        <form id="forgotForm">
          <div class="form-group">
            <label>${t('auth_email')}</label>
            <input type="email" class="form-input" id="forgotEmail" placeholder="${t('auth_email_placeholder')}" required autocomplete="email">
          </div>
          <div id="forgotTurnstile" class="cf-turnstile" style="margin-bottom:8px"></div>
          <div class="form-error" id="forgotError"></div>
          <div class="form-success" id="forgotSuccess" style="display:none;color:#22c55e;font-size:13px;margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary" id="forgotBtn">${t('auth_send_reset')}</button>
        </form>
        <div class="auth-footer">
          <a href="/login">${t('auth_back_to_login')}</a>
        </div>
      </div>
    </div>
  </div>`;

  let forgotTurnstileId;
  if (window.turnstile) {
    forgotTurnstileId = turnstile.render('#forgotTurnstile', { sitekey: '0x4AAAAAAComvejBuoADKL4m', theme: 'auto', size: 'flexible' });
  }

  document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('forgotBtn');
    const err = document.getElementById('forgotError');
    const suc = document.getElementById('forgotSuccess');
    const email = document.getElementById('forgotEmail').value.trim();
    const cfToken = window.turnstile ? turnstile.getResponse(forgotTurnstileId) : null;

    if (!cfToken) {
      err.textContent = t('auth_captcha_required');
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    err.classList.remove('visible');
    suc.style.display = 'none';

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cfToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      suc.textContent = t('auth_reset_sent');
      suc.style.display = 'block';
      btn.disabled = true;
      btn.textContent = t('auth_email_sent');
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.add('visible');
      btn.disabled = false;
      btn.textContent = t('auth_send_reset');
      if (window.turnstile) turnstile.reset(forgotTurnstileId);
    }
  });
});

Router.register('reset-password', (app) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || '';

  if (!token) {
    app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card" style="text-align:center">
          <h2>${t('auth_invalid_link')}</h2>
          <p style="color:var(--text-muted);margin:12px 0">${t('auth_reset_expired')}</p>
          <a href="/forgot-password" class="btn btn-primary" style="display:inline-block;margin-top:8px">${t('auth_request_new')}</a>
        </div>
      </div>
    </div>`;
    return;
  }

  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1 style="position:relative;display:inline-block">PR<span style="color:var(--accent)">.</span>SOCIAL</h1>
        <p>${t('app_tagline')}</p>
      </div>
      <div class="auth-card">
        <h2>${t('auth_new_password')}</h2>
        <form id="resetForm">
          <div class="form-group">
            <label>${t('auth_password')}</label>
            <div class="password-wrapper">
              <input type="password" class="form-input" id="resetPass" placeholder="${t('auth_password_min')}" required minlength="6" autocomplete="new-password">
              <button type="button" class="pw-toggle" onclick="_togglePw(this)" tabindex="-1" aria-label="Show password">
                <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>${t('auth_confirm_password')}</label>
            <div class="password-wrapper">
              <input type="password" class="form-input" id="resetPass2" placeholder="${t('auth_repeat_password')}" required autocomplete="new-password">
              <button type="button" class="pw-toggle" onclick="_togglePw(this)" tabindex="-1" aria-label="Show password">
                <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="form-error" id="resetError"></div>
          <button type="submit" class="btn btn-primary" id="resetBtn">${t('auth_reset_password')}</button>
        </form>
      </div>
    </div>
  </div>`;

  document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('resetBtn');
    const err = document.getElementById('resetError');
    const pass = document.getElementById('resetPass').value;
    const pass2 = document.getElementById('resetPass2').value;

    if (pass !== pass2) {
      err.textContent = t('auth_passwords_mismatch');
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    err.classList.remove('visible');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: pass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      showToast(t('auth_password_updated'), 'success');
      Router.navigate('/login');
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.add('visible');
      btn.disabled = false;
      btn.textContent = t('auth_reset_password');
    }
  });
});
