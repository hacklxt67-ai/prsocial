// i18n — multilingual with auto-detection + English fallback
const I18N = {
  lang: 'en',
  strings: {},
  _enStrings: null,
  available: [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'ar', label: 'العربية' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'es', label: 'Español' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'uz', label: 'O\'zbekcha' },
    { code: 'zh', label: '中文' },
    { code: 'pt', label: 'Português' },
    { code: 'id', label: 'Indonesia' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'uk', label: 'Українська' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ur', label: 'اردو' },
    { code: 'ps', label: 'پښتو' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
  ],

  async init() {
    const codes = this.available.map(l => l.code);
    // Check saved preference, then browser language
    const saved = localStorage.getItem('pr-social-lang');
    if (saved && codes.includes(saved)) {
      this.lang = saved;
    } else {
      const browserLang = (navigator.language || 'en').substring(0, 2).toLowerCase();
      this.lang = codes.includes(browserLang) ? browserLang : 'en';
    }
    await this.load(this.lang);
  },

  async _fetchJson(url, tries = 3) {
    let lastErr;
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
      } catch (e) {
        lastErr = e;
        // network blip: back off (200ms, 400ms) and retry before giving up
        if (i < tries - 1) await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
    throw lastErr;
  },

  async load(lang) {
    try {
      const v = (typeof window !== 'undefined' && window.__APP_BUILD__) ? window.__APP_BUILD__ : Date.now();
      // Always load English as fallback base
      if (!this._enStrings) {
        this._enStrings = await this._fetchJson('/i18n/en.json?v=' + v);
      }
      if (lang === 'en') {
        this.strings = this._enStrings;
      } else {
        const langStrings = await this._fetchJson(`/i18n/${lang}.json?v=${v}`);
        // Merge: English base + language overlay (missing keys fall back to English)
        this.strings = { ...this._enStrings, ...langStrings };
      }
      this.lang = lang;
      localStorage.setItem('pr-social-lang', lang);
      // Apply lang + direction to <html> for CSS scoping ([lang="X"]) and RTL layout.
      // Arabic-script languages need RTL. Done after every switchTo so direction
      // toggles immediately without full reload.
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
        const RTL_LANGS = new Set(['ar', 'ur', 'ps']);
        document.documentElement.setAttribute('dir', RTL_LANGS.has(lang) ? 'rtl' : 'ltr');
      }
    } catch {
      console.error('Failed to load language:', lang);
      if (lang !== 'en') await this.load('en');
    }
  },

  // Tells the server which language this person reads the site in (users.lang), so mailings
  // reach them in it. Once per account and language on this device.
  report() {
    try {
      if (typeof API === 'undefined' || !API.user || !API.user.id) return;
      const mark = API.user.id + ':' + this.lang;
      if (localStorage.getItem('pr-social-lang-sent') === mark) return;
      API.request('POST', '/profile/lang', { lang: this.lang })
        .then(() => { try { localStorage.setItem('pr-social-lang-sent', mark); } catch (e) { /* storage blocked */ } })
        .catch(() => {});
    } catch (e) { /* storage blocked */ }
  },

  t(key) {
    return this.strings[key] || key;
  },

  async switchTo(lang) {
    await this.load(lang);
    this.report();
    // Re-render current page
    Router.handle();
  }
};

// Shortcut
function t(key) { return I18N.t(key); }
