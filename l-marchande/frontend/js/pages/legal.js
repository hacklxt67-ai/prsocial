// Privacy Policy, Terms of Service & Platform Rules
// All text via i18n keys for multi-language support

// Shared legal page layout helper
function legalPage(activeLink) {
  const links = [
    { href: '/terms', key: 'tos_title' },
    { href: '/privacy', key: 'pp_title' },
    { href: '/rules', key: 'rules_title' },
    { href: '/faq', key: 'nav_faq' },
  ];
  const nav = links.map(l =>
    `<a href="${l.href}" class="legal-tab${activeLink === l.href ? ' active' : ''}">${t(l.key)}</a>`
  ).join('');
  // Language switcher — same I18N.available list used across the app (sidebar/login).
  // switchTo() re-renders the current route, so the legal text updates instantly.
  const langs = (typeof I18N !== 'undefined' && I18N.available) ? I18N.available : [{ code: 'en', label: 'EN' }];
  const langSel = `<select class="lang-select legal-lang-select" onchange="I18N.switchTo(this.value)" aria-label="Language" style="margin-left:auto">`
    + langs.map(l => `<option value="${l.code}"${(typeof I18N !== 'undefined' && I18N.lang === l.code) ? ' selected' : ''}>${l.label}</option>`).join('')
    + `</select>`;
  return nav + langSel;
}

// === PRIVACY POLICY ===
Router.register('privacy', (app) => {
  app.innerHTML = `
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-back">
        <a href="/" onclick="event.preventDefault();Router.navigate('/dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:-2px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          PR.SOCIAL
        </a>
      </div>

      <div class="legal-tabs">${legalPage('/privacy')}</div>

      <div class="legal-header">
        <div class="legal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <div>
          <h1>${t('pp_title')}</h1>
          <p class="legal-updated">${t('pp_updated')}</p>
        </div>
      </div>

      <p class="legal-intro">${t('pp_intro')}</p>

      <!-- Section 1: Information We Collect -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          ${t('pp_s1_title')}
        </h2>

        <div class="legal-card">
          <h3>${t('pp_s1_sub1')}</h3>
          <p>${t('pp_s1_p1')}</p>
          <ul>
            <li>${t('pp_s1_1')}</li>
            <li>${t('pp_s1_2')}</li>
            <li>${t('pp_s1_3')}</li>
          </ul>
        </div>

        <div class="legal-card">
          <h3>${t('pp_s1_sub2')}</h3>
          <p>${t('pp_s1_p2')}</p>
          <ul>
            <li>${t('pp_s1_4')}</li>
            <li>${t('pp_s1_5')}</li>
          </ul>
          <p class="legal-note">${t('pp_s1_p3')}</p>
        </div>

        <div class="legal-card">
          <h3>${t('pp_s1_sub3')}</h3>
          <ul>
            <li>${t('pp_s1_6')}</li>
            <li>${t('pp_s1_7')}</li>
          </ul>
        </div>

        <div class="legal-card">
          <h3>${t('pp_s1_sub4')}</h3>
          <ul>
            <li>${t('pp_s1_8')}</li>
            <li>${t('pp_s1_9')}</li>
            <li>${t('pp_s1_10')}</li>
            <li>${t('pp_s1_11')}</li>
          </ul>
          <p class="legal-note">${t('pp_s1_p4')}</p>
        </div>

        <div class="legal-card">
          <h3>${t('pp_s1_sub5')}</h3>
          <ul>
            <li>${t('pp_s1_12')}</li>
            <li>${t('pp_s1_13')}</li>
          </ul>
        </div>

        <div class="legal-card">
          <h3>${t('pp_s1_sub6')}</h3>
          <p>${t('pp_s1_p5')}</p>
          <ul>
            <li>${t('pp_s1_14')}</li>
            <li>${t('pp_s1_15')}</li>
            <li>${t('pp_s1_16')}</li>
          </ul>
          <p class="legal-note">${t('pp_s1_p6')}</p>
        </div>
      </div>

      <!-- Section 2: How We Use -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${t('pp_s2_title')}
        </h2>
        <ul class="legal-list">
          <li>${t('pp_s2_1')}</li>
          <li>${t('pp_s2_2')}</li>
          <li>${t('pp_s2_3')}</li>
          <li>${t('pp_s2_4')}</li>
          <li>${t('pp_s2_5')}</li>
          <li>${t('pp_s2_6')}</li>
          <li>${t('pp_s2_7')}</li>
        </ul>
        <div class="legal-highlight">${t('pp_s2_p1')}</div>
      </div>

      <!-- Section 3: Third-Party -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          ${t('pp_s3_title')}
        </h2>
        <div class="legal-card">
          <ul>
            <li><strong>OpenAI</strong> — ${t('pp_s3_1').replace('OpenAI — ', '')}</li>
            <li><strong>Cloudflare</strong> — ${t('pp_s3_2').replace('Cloudflare — ', '')}</li>
            <li><strong>Blockchain</strong> — ${t('pp_s3_3').replace('Blockchain networks — ', '')}</li>
          </ul>
        </div>
      </div>

      <!-- Section 4: Retention -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${t('pp_s4_title')}
        </h2>
        <div class="legal-retention">
          <div class="legal-retention-row"><span>${t('pp_s4_1').split(' — ')[0]}</span><span>${t('pp_s4_1').split(' — ')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('pp_s4_2').split(' — ')[0]}</span><span>${t('pp_s4_2').split(' — ')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('pp_s4_3').split(' — ')[0]}</span><span>${t('pp_s4_3').split(' — ')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('pp_s4_4').split(' — ')[0]}</span><span>${t('pp_s4_4').split(' — ')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('pp_s4_5').split(' — ')[0]}</span><span>${t('pp_s4_5').split(' — ')[1] || ''}</span></div>
        </div>
        <p class="legal-note">${t('pp_s4_p1')}</p>
      </div>

      <!-- Section 5: Security -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          ${t('pp_s5_title')}
        </h2>
        <div class="legal-card">
          <ul>
            <li>${t('pp_s5_1')}</li>
            <li>${t('pp_s5_2')}</li>
            <li>${t('pp_s5_3')}</li>
            <li>${t('pp_s5_4')}</li>
            <li>${t('pp_s5_5')}</li>
          </ul>
        </div>
      </div>

      <!-- Section 6: Your Rights -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${t('pp_s6_title')}
        </h2>
        <p>${t('pp_s6_p1')}</p>
        <div class="legal-card">
          <ul>
            <li>${t('pp_s6_1')}</li>
            <li>${t('pp_s6_2')}</li>
            <li>${t('pp_s6_3')}</li>
            <li>${t('pp_s6_4')}</li>
          </ul>
        </div>
      </div>

      <!-- Section 7-9 -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${t('pp_s7_title')}
        </h2>
        <p>${t('pp_s7_p1')}</p>
      </div>

      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          ${t('pp_s8_title')}
        </h2>
        <p>${t('pp_s8_p1')}</p>
      </div>

      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          ${t('pp_s9_title')}
        </h2>
        <p>${t('pp_s9_p1')}</p>
      </div>

      <div class="legal-footer-links">
        <a href="/terms">${t('tos_title')}</a>
        <a href="/rules">${t('rules_title')}</a>
        <a href="/faq">${t('nav_faq')}</a>
      </div>
    </div>
  </div>`;
});

// === TERMS OF SERVICE ===
Router.register('terms', (app) => {
  app.innerHTML = `
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-back">
        <a href="/" onclick="event.preventDefault();Router.navigate('/dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:-2px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          PR.SOCIAL
        </a>
      </div>

      <div class="legal-tabs">${legalPage('/terms')}</div>

      <div class="legal-header">
        <div class="legal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        <div>
          <h1>${t('tos_title')}</h1>
          <p class="legal-updated">${t('tos_updated')}</p>
        </div>
      </div>

      <p class="legal-intro">${t('tos_intro')}</p>

      <!-- 1. About -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          ${t('tos_s1_title')}
        </h2>
        <p>${t('tos_s1_p1')}</p>
        <p>${t('tos_s1_p2')}</p>
      </div>

      <!-- 2. Eligibility -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
          ${t('tos_s2_title')}
        </h2>
        <div class="legal-card">
          <ul>
            <li>${t('tos_s2_1')}</li>
            <li>${t('tos_s2_2')}</li>
            <li>${t('tos_s2_3')}</li>
          </ul>
        </div>
      </div>

      <!-- 3. Account -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${t('tos_s3_title')}
        </h2>
        <div class="legal-highlight">${t('tos_s3_p1')}</div>
        <p>${t('tos_s3_p2')}</p>
      </div>

      <!-- 4. Earning -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          ${t('tos_s4_title')}
        </h2>

        <div class="legal-card">
          <h3>${t('tos_s4_sub1')}</h3>
          <p>${t('tos_s4_p1')}</p>
          <div class="legal-rates">
            <div class="legal-rate"><span class="legal-rate-label">${t('tos_s4_rate1').split(':')[0]}</span><span class="legal-rate-value">${t('tos_s4_rate1').split(':')[1] || ''}</span></div>
            <div class="legal-rate"><span class="legal-rate-label">${t('tos_s4_rate2').split(':')[0]}</span><span class="legal-rate-value">${t('tos_s4_rate2').split(':')[1] || ''}</span></div>
          </div>
          <p class="legal-note">${t('tos_s4_p2')}</p>
        </div>

        <div class="legal-card">
          <h3>${t('tos_s4_sub2')}</h3>
          <p>${t('tos_s4_p3')}</p>
        </div>

        <div class="legal-card">
          <h3>${t('tos_s4_sub3')}</h3>
          <p>${t('tos_s4_p4')}</p>
        </div>
      </div>

      <!-- 5. Withdrawals -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="1.5"/></svg>
          ${t('tos_s5_title')}
        </h2>
        <div class="legal-retention">
          <div class="legal-retention-row"><span>${t('tos_s5_min').split(':')[0]}</span><span>${t('tos_s5_min').split(':')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('tos_s5_methods').split(':')[0]}</span><span>${t('tos_s5_methods').split(':')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('tos_s5_processing').split(':')[0]}</span><span>${t('tos_s5_processing').split(':')[1] || ''}</span></div>
          <div class="legal-retention-row"><span>${t('tos_s5_fee').split(':')[0]}</span><span>${t('tos_s5_fee').split(':')[1] || ''}</span></div>
        </div>
        <p>${t('tos_s5_p1')}</p>
      </div>

      <!-- 6. Referral -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${t('tos_s6_title')}
        </h2>
        <p>${t('tos_s6_p1')}</p>
        <p>${t('tos_s6_p2')}</p>
      </div>

      <!-- 7. Rules -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${t('tos_s7_title')}
        </h2>
        <div class="legal-highlight">${t('tos_s7_p1')}</div>
        <p>${t('tos_s7_p2')}</p>

        <div class="legal-card">
          <h3>${t('tos_s7_sub1')}</h3>
          <p>${t('tos_s7_p3')}</p>
        </div>
        <div class="legal-card">
          <h3>${t('tos_s7_sub2')}</h3>
          <p>${t('tos_s7_p4')}</p>
        </div>
      </div>

      <!-- 8. Automation -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          ${t('tos_s8_title')}
        </h2>
        <p>${t('tos_s8_p1')}</p>
        <div class="legal-card">
          <ul>
            <li>${t('tos_s8_tool1')}</li>
            <li>${t('tos_s8_tool2')}</li>
            <li>${t('tos_s8_tool3')}</li>
            <li>${t('tos_s8_tool4')}</li>
          </ul>
        </div>
        <div class="legal-highlight" style="border-color:#ef4444;background:rgba(239,68,68,0.06)">${t('tos_s8_p2')}</div>
        <p class="legal-note">${t('tos_s8_p3')}</p>
      </div>

      <!-- 9. IP -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          ${t('tos_s9_title')}
        </h2>
        <p>${t('tos_s9_p1')}</p>
      </div>

      <!-- 10. Liability -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${t('tos_s10_title')}
        </h2>
        <div class="legal-card">
          <ul>
            <li>${t('tos_s10_1')}</li>
            <li>${t('tos_s10_2')}</li>
            <li>${t('tos_s10_3')}</li>
            <li>${t('tos_s10_4')}</li>
          </ul>
        </div>
      </div>

      <!-- 11. Changes -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          ${t('tos_s11_title')}
        </h2>
        <p>${t('tos_s11_p1')}</p>
      </div>

      <!-- 12. Contact -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          ${t('tos_s12_title')}
        </h2>
        <p><a href="mailto:support@pr.social" style="color:var(--accent)">support@pr.social</a></p>
      </div>

      <div class="legal-footer-links">
        <a href="/privacy">${t('pp_title')}</a>
        <a href="/rules">${t('rules_title')}</a>
        <a href="/faq">${t('nav_faq')}</a>
      </div>
    </div>
  </div>`;
});

// === PLATFORM RULES ===
Router.register('rules', (app) => {
  const prohibitedItems = ['1','2','3','4','5','6','7','8'];

  app.innerHTML = `
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-back">
        <a href="/" onclick="event.preventDefault();Router.navigate('/dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:-2px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          PR.SOCIAL
        </a>
      </div>

      <div class="legal-tabs">${legalPage('/rules')}</div>

      <div class="legal-header">
        <div class="legal-icon" style="background:rgba(34,197,94,0.12);color:var(--accent)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h1>${t('rules_title')}</h1>
          <p class="legal-updated">${t('rules_updated')}</p>
        </div>
      </div>

      <p class="legal-intro">${t('rules_subtitle')}</p>

      <!-- 1. General -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${t('rules_s1_title')}
        </h2>
        <ol class="legal-list legal-list-ordered">
          <li>${t('rules_s1_1')}</li>
          <li>${t('rules_s1_2')}</li>
          <li>${t('rules_s1_3')}</li>
          <li>${t('rules_s1_4')}</li>
          <li>${t('rules_s1_5')}</li>
        </ol>
      </div>

      <!-- 2. Prohibited -->
      <div class="legal-section">
        <h2 style="color:#ef4444">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          ${t('rules_s2_title')}
        </h2>
        <div class="legal-card" style="border-color:rgba(239,68,68,0.2)">
          <ul class="legal-prohibited">
            ${prohibitedItems.map(i => '<li><span class="legal-x">&#10007;</span> ' + t('rules_s2_' + i) + '</li>').join('')}
          </ul>
        </div>
      </div>

      <!-- 3. Warning System -->
      <div class="legal-section">
        <h2 style="color:#f59e0b">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${t('rules_s3_title')}
        </h2>
        <p>${t('rules_s3_intro')}</p>
        <ul class="legal-list">
          <li>${t('rules_s3_v1')}</li>
          <li>${t('rules_s3_v2')}</li>
          <li>${t('rules_s3_v3')}</li>
          <li>${t('rules_s3_v4')}</li>
          <li>${t('rules_s3_v5')}</li>
        </ul>
        <div class="legal-levels">
          <div><span class="legal-dot" style="background:#22c55e"></span>${t('rules_s3_level1')}</div>
          <div><span class="legal-dot" style="background:#f59e0b"></span>${t('rules_s3_level2')}</div>
          <div><span class="legal-dot" style="background:#ef4444"></span>${t('rules_s3_level3')}</div>
        </div>
      </div>

      <!-- 4. Balance -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
          ${t('rules_s4_title')}
        </h2>
        <ul class="legal-list">
          <li>${t('rules_s4_1')}</li>
          <li>${t('rules_s4_2')}</li>
        </ul>
      </div>

      <!-- 5. Referral -->
      <div class="legal-section">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${t('rules_s5_title')}
        </h2>
        <ul class="legal-list">
          <li>${t('rules_s5_1')}</li>
          <li>${t('rules_s5_2')}</li>
          <li>${t('rules_s5_3')}</li>
        </ul>
      </div>

      <!-- 6. Appeals -->
      <div class="legal-section">
        <h2 style="color:#3b82f6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${t('rules_s6_title')}
        </h2>
        <ul class="legal-list">
          <li>${t('rules_s6_1')}</li>
          <li>${t('rules_s6_2')}</li>
          <li>${t('rules_s6_3')}</li>
          <li>${t('rules_s6_4')}</li>
        </ul>
      </div>

      <div class="legal-footer-links">
        <a href="/terms">${t('tos_title')}</a>
        <a href="/privacy">${t('pp_title')}</a>
        <a href="/faq">${t('nav_faq')}</a>
      </div>
    </div>
  </div>`;
});
