// History API SPA router (clean URLs).
//
// Pages register a render function per route. Since 2026-09-23 the router also knows:
//   - lazy bundles: a route with no handler may belong to a bundle fetched on first use
//     (the admin console — regular visitors never download it);
//   - layouts: a persistent frame (sidebar, top bar) around a family of routes, drawn
//     once and kept, with each page rendering into the frame's content area;
//   - a page context (Router.ctx / second render argument): timers, listeners and
//     fetches a page starts through it are dropped when the user navigates away, and
//     a render that finishes after the user has moved on is discarded instead of being
//     drawn over the new page.
const Router = {
  routes: {},
  current: null,
  lazy: [],
  layouts: [],
  ctx: null,
  _nav: 0,
  _layout: null,

  // Route → section for staff accounts: the one place on the frontend that says which
  // admin routes a staff member may open (the server enforces the same list in
  // src/routes/admin.js sectionForAdminPath). Routes not listed here are admin-only.
  staffSections: { 'admin': 'dashboard', 'admin-orders': 'orders', 'admin-tickets': 'tickets', 'admin-users': 'users', 'admin-moderation': 'moderation', 'admin-speedup-agent': 'speedup', 'admin-account': 'account' },

  register(path, renderFn) {
    this.routes[path] = renderFn;
  },

  // match(route) → bool; load() → Promise settled once the bundle's scripts have run and
  // registered their routes; canLoad(route) → bool, false sends the user home without
  // downloading anything.
  registerLazy(match, load, canLoad) {
    this.lazy.push({ match, load, canLoad, promise: null });
  },

  // layout: { mount(app, route) → element the page renders into, unmount(app),
  //           denied(target, route) (optional) → draws the "no access" page }
  registerLayout(match, layout) {
    this.layouts.push({ match, layout });
  },

  // A page with unsaved work registers a leave guard (ctx.guard). Links, the admin's
  // jump-to-section list and back/forward ask it; navigate() does not — a page that
  // calls it has asked already. Without a guard nothing changes.
  canLeave() {
    const g = this.ctx && this.ctx._guard;
    if (!g) return Promise.resolve(true);
    return Promise.resolve().then(g).then(ok => !!ok, (e) => { console.error('[router] leave guard failed:', e); return true; });
  },
  go(url) {
    if (!(this.ctx && this.ctx._guard)) { this.navigate(url); return; }
    this.canLeave().then(ok => { if (ok) this.navigate(url); });
  },

  navigate(url) {
    // Strip leading # if someone passes old-style hash
    if (url.startsWith('#')) url = '/' + url.slice(1);
    if (!url.startsWith('/')) url = '/' + url;
    // Preserve query string in URL but route by path only
    history.pushState(null, '', url);
    this.handle();
  },

  getPath() {
    // Get clean path: dashboard, tasks, admin, admin/login etc
    let p = window.location.pathname.replace(/\/+$/, '') || '/';
    if (p === '/') return 'login';
    // Remove leading slash, keep sub-paths (admin/login)
    return p.slice(1).split('?')[0];
  },

  _newContext(route) {
    if (this.ctx) this.ctx.dispose();
    const ac = new AbortController();
    const timers = new Set();
    const leave = [];
    const ctx = {
      route,
      signal: ac.signal,
      get alive() { return Router.ctx === ctx; },
      interval(fn, ms) { const id = setInterval(fn, ms); timers.add(id); return id; },
      timeout(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; },
      on(target, type, fn, opts) { target.addEventListener(type, fn, opts); leave.push(() => target.removeEventListener(type, fn, opts)); },
      onLeave(fn) { leave.push(fn); },
      // Unsaved work: fn() → true, or a promise of true, when leaving is fine.
      guard(fn) { ctx._guard = fn; },
      dispose() {
        ctx._guard = null;
        for (const id of timers) { clearInterval(id); clearTimeout(id); }
        timers.clear();
        ac.abort();
        while (leave.length) { try { leave.pop()(); } catch (e) { console.error('[router] cleanup failed:', e); } }
      },
    };
    this.ctx = ctx;
    return ctx;
  },

  _renderNotice(el, text) {
    el.innerHTML = '';
    const d = document.createElement('div');
    d.style.cssText = 'padding:48px 24px;text-align:center;color:var(--text-secondary,#888);font-size:14px';
    d.textContent = text;
    el.appendChild(d);
  },

  async handle() {
    const nav = ++this._nav;
    const stale = () => nav !== this._nav;
    const route = this.getPath();
    this._here = window.location.pathname + window.location.search;
    const app = document.getElementById('app');

    // Auth guard
    const publicRoutes = ['login', 'register', 'admin/login', 'verify-email', 'forgot-password', 'reset-password', 'privacy', 'terms', 'rules', 'guides', 'guides/profile-setup', 'guides/instagram', 'guides/youtube', 'guides/tiktok', 'guides/telegram', 'guides/twitter', 'guides/facebook', 'guides/linkedin', 'guides/threads', 'guides/reddit', 'guides/quora', 'guides/snapchat', 'guides/likee', 'guides/discord', 'guides/kick', 'guides/github', 'guides/google-maps', 'guides/trustpilot', 'guides/max'];
    if (!publicRoutes.includes(route) && !API.user) {
      const user = await API.getMe();
      if (stale()) return;
      if (!user) {
        // Remember where user wanted to go, redirect to login
        this._returnTo = window.location.pathname;
        this.navigate('/login');
        return;
      }
    }

    // If logged in and on auth/landing pages, redirect appropriately
    if (['login', 'register'].includes(route) && API.user) {
      const returnTo = this._returnTo || '/dashboard';
      this._returnTo = null;
      this.navigate(returnTo);
      return;
    }
    // The door of the new look (sign in, a new account, a lost password): the server has it as a page of its own and says so with
    // the cookie door=new (src/lib/cabinet-pages.js markDoor). A guest who presses "Sign in" here leaves for it; the same mark
    // as below keeps a person in this app if the server answers with this app again.
    if (!API.user && ['login', 'register', 'forgot-password', 'reset-password', 'verify-email'].includes(route) && /(?:^|; )door=new(?:;|$)/.test(document.cookie)) {
      // the page the person wanted before they were asked to sign in goes along, so that they land on it afterwards
      const back = route === 'login' && this._returnTo && /^\/[a-z]/.test(this._returnTo) && !window.location.search ? '?next=' + encodeURIComponent(this._returnTo) : '';
      const here = window.location.pathname + window.location.search + back;
      let mark = null;
      try { mark = JSON.parse(sessionStorage.getItem('cab-left') || 'null'); } catch (e) { /* storage is closed */ }
      if (!(mark && mark.at === here && Date.now() - mark.t < 60000)) {
        try { sessionStorage.setItem('cab-left', JSON.stringify({ at: here, t: Date.now() })); } catch (e) { /* storage is closed */ }
        window.location.replace(here);
        return;
      }
    }
    // The new cabinet has this page for this person (the server says which, API.user.cabinet): it is a page of its own, not a route
    // of this app — leave for it. A mark is left on the way out and the new page removes it when it opens. Finding the mark still
    // here means the server answered with this app again: the two sides disagree, and the person stays in this app for a minute
    // instead of going round in circles.
    if (API.user && Array.isArray(API.user.cabinet) && API.user.cabinet.includes(route)) {
      const here = window.location.pathname + window.location.search;
      let mark = null;
      try { mark = JSON.parse(sessionStorage.getItem('cab-left') || 'null'); } catch (e) { /* storage is closed */ }
      if (!(mark && mark.at === here && Date.now() - mark.t < 60000)) {
        try { sessionStorage.setItem('cab-left', JSON.stringify({ at: here, t: Date.now() })); } catch (e) { /* storage is closed */ }
        window.location.replace(here);
        return;
      }
    }
    // Admin login: if already logged in as admin, go to admin panel
    if (route === 'admin/login' && API.user) {
      if (API.user.role === 'admin' || API.user.role === 'staff') {
        this.navigate('/admin');
      } else {
        this.navigate('/dashboard');
      }
      return;
    }

    // Staff (limited admin): deny-by-default. A section outside the grant is not hidden
    // and not redirected away — the console shows its "no access" page there, and the
    // API refuses the section's requests regardless (src/routes/admin.js adminAuth).
    let denied = false;
    if (API.user && API.user.role === 'staff' && route.indexOf('admin') === 0 && route !== 'admin/login') {
      const sec = this.staffSections[route];
      const allowed = API.user.admin_sections || [];
      // 'account' (own settings) is every staff member's, whatever was granted.
      denied = !sec || (sec !== 'account' && allowed.indexOf(sec) === -1);
    }

    // A route with no handler may live in a bundle that is loaded on first use.
    if (!this.routes[route]) {
      const entry = this.lazy.find(l => l.match(route));
      if (entry) {
        if (entry.canLoad && !entry.canLoad(route)) {
          this.navigate('/dashboard');
          return;
        }
        if (!entry.promise) {
          entry.promise = entry.load().catch(e => { entry.promise = null; throw e; });
          if (this._layout) { try { this._layout.unmount(app); } catch (e) { console.error('[router] layout unmount failed:', e); } this._layout = null; }
          this._renderNotice(app, 'Loading…');
        }
        try {
          await entry.promise;
        } catch (e) {
          console.error('[router] bundle failed to load:', e);
          if (!stale()) this._renderNotice(app, 'Could not load this section. Check the connection and reload the page.');
          return;
        }
        if (stale()) return;
      }
    }

    const render = this.routes[route];
    if (!render) {
      this.navigate('/dashboard');
      return;
    }

    // Keep the frame when the next route uses the same layout, drop it otherwise.
    const found = this.layouts.find(l => l.match(route));
    const layout = found ? found.layout : null;
    if (this._layout && this._layout !== layout) {
      try { this._layout.unmount(app); } catch (e) { console.error('[router] layout unmount failed:', e); }
    }
    this._layout = layout;

    this.current = route;
    const ctx = this._newContext(route);
    let target = app;
    if (layout) {
      target = layout.mount(app, route);
    } else {
      app.innerHTML = '';
    }
    if (denied) {
      if (layout && layout.denied) layout.denied(target, route);
      else this._renderNotice(target, 'Your account has no access to this section.');
      return;
    }
    try {
      await render(target, ctx);
    } catch (e) {
      console.error('[router] render failed:', route, e);
      if (!stale()) this._renderNotice(target, 'This page hit an error: ' + (e && e.message ? e.message : e));
    }
  },

  init() {
    // Save referral code to localStorage (survives page navigation)
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      localStorage.setItem('pr_ref', refParam);
      localStorage.setItem('pr_ref_ts', Date.now().toString());
    }
    // Auto-redirect referral links: /register?ref=CODE
    if (refParam && (window.location.pathname === '/' || window.location.pathname === '/login')) {
      history.replaceState(null, '', '/register?ref=' + encodeURIComponent(refParam));
    }

    // Handle back/forward buttons
    // A page with unsaved work is asked first; while it asks, the address shows it again.
    window.addEventListener('popstate', () => {
      const here = this._here;
      if (!(this.ctx && this.ctx._guard && here && window.location.pathname !== here.split('?')[0])) { this.handle(); return; }
      const target = window.location.pathname + window.location.search;
      history.pushState(null, '', here);
      this.canLeave().then(ok => { if (ok) this.navigate(target); });
    });

    // Intercept all <a> clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      // Skip external links, API calls, uploads, # anchors
      if (!href || href.startsWith('http') || href.startsWith('/api/') || href.startsWith('/uploads/') || href === '#') return;
      // Skip /guides and localized /{lang}/guides — served as static HTML outside the SPA (full page load)
      if (href === '/guides' || href.startsWith('/guides/') || /^\/(ru|es|pt|ar|hi|tr|uz|id|zh)\/guides(\/|$)/.test(href)) return;
      // Handle old hash links and internal links
      if (href.startsWith('#')) {
        e.preventDefault();
        this.go('/' + href.slice(1));
      } else if (href.startsWith('/') && !href.includes('.')) {
        e.preventDefault();
        this.go(href);
      }
    });

    this.handle();
  }
};
