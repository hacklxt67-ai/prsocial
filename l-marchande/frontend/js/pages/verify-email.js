Router.register('verify-email', async (app) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-logo"><h1>PR<span style="color:var(--accent)">.</span>SOCIAL</h1></div>
        <div class="auth-card">
          <h2>Email Verification</h2>
          <p style="color:var(--text-muted)">Invalid verification link. No token provided.</p>
          <a href="/login" class="btn btn-primary" style="margin-top:1rem;display:block;text-align:center">Go to Login</a>
        </div>
      </div>
    </div>`;
    return;
  }

  app.innerHTML = `
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo"><h1>PR<span style="color:var(--accent)">.</span>SOCIAL</h1></div>
      <div class="auth-card">
        <h2>Verifying...</h2>
        <div class="spinner" style="margin:2rem auto"></div>
      </div>
    </div>
  </div>`;

  try {
    const data = await API.request('GET', `/auth/verify-email?token=${encodeURIComponent(token)}`);
    app.querySelector('.auth-card').innerHTML = `
      <div style="text-align:center">
        <svg viewBox="0 0 48 48" fill="none" stroke="#10b981" stroke-width="2" style="width:48px;height:48px;margin-bottom:1rem">
          <circle cx="24" cy="24" r="20"/><path d="M14 24l7 7 13-13"/>
        </svg>
        <h2 style="color:#10b981">Email Verified!</h2>
        <p style="color:var(--text-muted);margin-top:0.5rem">${data.message || 'Your email has been verified.'}</p>
        <a href="/dashboard" class="btn btn-primary" style="margin-top:1.5rem;display:inline-block">Go to Dashboard</a>
      </div>`;
    if (API.user) API.user.email_verified = 1;
    try {
      const cached = JSON.parse(localStorage.getItem('pr-user-cache-v1') || '{}');
      if (cached && cached.id) {
        cached.email_verified = 1;
        localStorage.setItem('pr-user-cache-v1', JSON.stringify(cached));
      }
      if (typeof API.refreshMe === 'function') await API.refreshMe();
    } catch (_) {}
  } catch (e) {
    app.querySelector('.auth-card').innerHTML = `
      <div style="text-align:center">
        <svg viewBox="0 0 48 48" fill="none" stroke="#ef4444" stroke-width="2" style="width:48px;height:48px;margin-bottom:1rem">
          <circle cx="24" cy="24" r="20"/><path d="M16 16l16 16M32 16l-16 16"/>
        </svg>
        <h2 style="color:#ef4444">Verification Failed</h2>
        <p style="color:var(--text-muted);margin-top:0.5rem">${e.message || 'Invalid or expired link.'}</p>
        <a href="/login" class="btn btn-primary" style="margin-top:1.5rem;display:inline-block">Go to Login</a>
      </div>`;
  }
});
