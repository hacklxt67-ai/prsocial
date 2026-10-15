// Format price: 0.005 → "$0.005", 0.0025 → "$0.0025", 10 → "$10"
function fmtPrice(n) {
  if (n >= 1) return '$' + n.toLocaleString();
  const s = Number(n).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  return '$' + s;
}

// Device fingerprint — combines canvas, webgl, screen, timezone, etc into a hash
async function getDeviceFingerprint() {
  try {
    const parts = [];
    // Canvas fingerprint
    try {
      const c = document.createElement('canvas');
      c.width = 200; c.height = 50;
      const ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = '#069';
      ctx.fillText('PR.SOCIAL fp', 2, 15);
      ctx.strokeStyle = 'rgba(102,204,0,0.7)';
      ctx.arc(75, 25, 15, 0, Math.PI * 2);
      ctx.stroke();
      parts.push(c.toDataURL());
    } catch(e) { parts.push('no-canvas'); }
    // WebGL renderer
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
      parts.push(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'no-webgl');
    } catch(e) { parts.push('no-webgl'); }
    // Screen
    parts.push(screen.width + 'x' + screen.height + 'x' + (window.devicePixelRatio || 1));
    // Timezone
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    // Language
    parts.push(navigator.language || '');
    // Platform + cores
    parts.push((navigator.platform || '') + ':' + (navigator.hardwareConcurrency || 0));
    // Hash with SHA-256
    const raw = parts.join('|||');
    const buf = new TextEncoder().encode(raw);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch(e) { return null; }
}

// API client
const API = {
  user: null,

  async request(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch('/api' + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  async upload(method, path, formData) {
    const res = await fetch('/api' + path, { method, body: formData, credentials: 'same-origin' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  async login(email, password, cfToken) {
    const fingerprint = await getDeviceFingerprint();
    const data = await this.request('POST', '/auth/login', { email, password, cfToken, fingerprint });
    if (data.requires_2fa) return data; // 2FA needed — don't set user yet
    this.user = data.user;
    try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(data.user)); } catch (_) {}
    return data;
  },

  async verify2fa(sessionId, code) {
    const data = await this.request('POST', '/auth/verify-2fa', { session_id: sessionId, code });
    this.user = data.user;
    try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(data.user)); } catch (_) {}
    return data;
  },

  async register(email, password, username, ref, cfToken) {
    const fingerprint = await getDeviceFingerprint();
    const body = { email, password, username, cfToken, fingerprint };
    if (ref) body.ref = ref;
    const data = await this.request('POST', '/auth/register', body);
    this.user = data.user;
    try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(data.user)); } catch (_) {}
    return data;
  },

  async logout() {
    await this.request('POST', '/auth/logout');
    this.user = null;
    try { localStorage.removeItem('pr-user-cache-v1'); } catch (_) {}
  },

  // getMe — uses stale-while-revalidate via localStorage cache.
  // 1st visit:           waits for server (same as before).
  // Subsequent visits:   returns cached user instantly → UI renders immediately,
  //                      then re-validates in background and updates cache.
  // On 401/network err:  clears cache → next page load behaves as logged-out.
  // Cache key versioned (-v1) so we can invalidate by bumping version.
  async getMe() {
    // 1. Try cache first
    let cached = null;
    try {
      const raw = localStorage.getItem('pr-user-cache-v1');
      if (raw) cached = JSON.parse(raw);
    } catch (_) { /* corrupted cache — ignore, fall through */ }

    if (cached && cached.id) {
      // Render UI from cache instantly
      this.user = cached;

      // Re-validate in background — don't block the caller
      this.request('GET', '/auth/me').then(data => {
        if (data && data.user) {
          this.user = data.user;
          try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(data.user)); } catch (_) {}
        }
      }).catch(() => {
        // Server says not authenticated (cookie expired/invalidated) — drop cache.
        // Next page load will see no cache and follow the unauth path properly.
        this.user = null;
        try { localStorage.removeItem('pr-user-cache-v1'); } catch (_) {}
      });

      return cached;
    }

    // 2. No cache — original behavior (wait for server)
    try {
      const data = await this.request('GET', '/auth/me');
      this.user = data.user;
      try { localStorage.setItem('pr-user-cache-v1', JSON.stringify(data.user)); } catch (_) {}
      return data.user;
    } catch {
      this.user = null;
      try { localStorage.removeItem('pr-user-cache-v1'); } catch (_) {}
      return null;
    }
  }
};

// Suspicious banner — call inside <main> on every page
function renderSuspiciousBanner() {
  const u = API.user;
  if (!u || u.status !== 'suspicious') return '';
  return `<div class="suspicious-banner">
    <div class="suspicious-banner-icon">&#9888;&#65039;</div>
    <div class="suspicious-banner-content">
      <strong>${t('suspicious_banner_title')}</strong>
      <p>${t('suspicious_banner_text')}</p>
    </div>
    <a href="/support?appeal=1" class="btn btn-sm" style="white-space:nowrap;background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3)">${t('suspicious_banner_button')}</a>
  </div>`;
}
