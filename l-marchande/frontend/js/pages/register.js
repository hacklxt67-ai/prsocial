Router.register('register', (app) => {
  // Auto-detect ref code from URL params
  const urlParams = new URLSearchParams(window.location.search);
  let refFromUrl = urlParams.get('ref') || '';
  // Fallback: check localStorage (ref may have been lost during SPA navigation)
  if (!refFromUrl) {
    const savedRef = localStorage.getItem('pr_ref');
    const savedTs = parseInt(localStorage.getItem('pr_ref_ts') || '0');
    // Use saved ref if less than 24 hours old
    if (savedRef && (Date.now() - savedTs) < 86400000) {
      refFromUrl = savedRef;
    }
  }

  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <style>@media (max-width:350px){.auth-beta{left:auto!important;right:0;top:-18px!important}}</style>
        <h1 style="position:relative;display:inline-block">PR<span style="color:var(--accent)">.</span>SOCIAL<span class="auth-beta" style="position:absolute;top:-2px;left:calc(100% + 4px);white-space:nowrap;font-size:11px;font-weight:600;color:var(--accent);background:rgba(34,197,94,0.15);padding:2px 6px;border-radius:4px;letter-spacing:1px">BETA 2.0</span></h1>
        <p>${t('app_tagline')}</p>
      </div>
      <div class="auth-card">
        <h2>${t('auth_signup')}</h2>
        <form id="registerForm">
          <div class="form-group">
            <label>${t('auth_username')}</label>
            <input type="text" class="form-input" id="regUsername" placeholder="${t('auth_username_placeholder')}" required minlength="3" maxlength="30" pattern="[a-zA-Z0-9_]+" autocomplete="username">
          </div>
          <div class="form-group">
            <label>${t('auth_email')}</label>
            <input type="email" class="form-input" id="regEmail" placeholder="${t('auth_email_placeholder')}" required autocomplete="email">
          </div>
          <div class="form-group">
            <label>${t('auth_password')}</label>
            <input type="password" class="form-input" id="regPassword" placeholder="${t('auth_password_min')}" required minlength="6" autocomplete="new-password">
          </div>
          <div class="form-group">
            <label>${t('auth_confirm_password')}</label>
            <input type="password" class="form-input" id="regPassword2" placeholder="${t('auth_repeat_password')}" required autocomplete="new-password">
          </div>
          <div class="form-group">
            <label>${t('auth_ref_code')} <span style="color:var(--text-muted);font-weight:400">(${t('auth_optional')})</span></label>
            <input type="text" class="form-input" id="regRef" placeholder="${t('auth_ref_placeholder')}" maxlength="20" value="${refFromUrl}" ${refFromUrl ? 'readonly style="opacity:0.7"' : ''}>
          </div>
          <div id="regTurnstile" class="cf-turnstile" style="margin-bottom:8px"></div>
          <div class="form-error" id="regError"></div>
          <button type="submit" class="btn btn-primary" id="regBtn">${t('auth_signup')}</button>
        </form>
        <div class="auth-footer">
          ${t('auth_has_account')} <a href="/login">${t('auth_signin')}</a>
        </div>
      </div>
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
  let regTurnstileId;
  if (window.turnstile) {
    regTurnstileId = turnstile.render('#regTurnstile', { sitekey: '0x4AAAAAAComvejBuoADKL4m', theme: 'auto', size: 'flexible' });
  }

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('regBtn');
    const err = document.getElementById('regError');
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    const ref = document.getElementById('regRef').value.trim();

    // Get Turnstile token
    const cfToken = window.turnstile ? turnstile.getResponse(regTurnstileId) : null;
    if (!cfToken) {
      err.textContent = 'Please complete the captcha';
      err.classList.add('visible');
      return;
    }

    if (password !== password2) {
      err.textContent = t('auth_passwords_mismatch');
      err.classList.add('visible');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    err.classList.remove('visible');

    try {
      await API.register(email, password, username, ref || undefined, cfToken);
      localStorage.removeItem('pr_ref');
      localStorage.removeItem('pr_ref_ts');
      showToast(t('auth_account_created'), 'success');
      Router.navigate('/dashboard');
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = t('auth_signup');
      if (window.turnstile) turnstile.reset(regTurnstileId);
    }
  });
});
