Router.register('faq', (app) => {
  const sectionIcons = {
    general: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    earning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    payments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>',
    referrals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    safety: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };

  const sections = [
    { key: 'general', items: ['1','2','3','4'] },
    { key: 'earning', items: ['1','2','3','4','5'] },
    { key: 'payments', items: ['1','2','3'] },
    { key: 'referrals', items: ['1','2','3'] },
    { key: 'safety', items: ['1','2','3','4','5','6'] },
  ];

  const prefix = { general:'faq_g', earning:'faq_e', payments:'faq_w', referrals:'faq_r', safety:'faq_s' };

  let qNum = 0;

  app.innerHTML = `
  <div class="app-layout">
  ${renderSidebar('faq')}
  <main class="main-content">
    <div class="page-header">
      ${renderHamburger()}
      <div class="page-header-text">
        <h1>${t('faq_title')}</h1>
        <p>${t('faq_subtitle')}</p>
      </div>
    </div>
    <div class="page-content">

      <div class="faq-search">
        <svg class="faq-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="${t('faq_search_placeholder') || 'Search questions...'}" oninput="faqFilter(this.value)">
      </div>

      <div class="faq-nav">
        ${sections.map(s => `
          <button class="faq-nav-pill" onclick="document.getElementById('faq-${s.key}').scrollIntoView({behavior:'smooth',block:'start'})">
            ${sectionIcons[s.key]}
            ${t('faq_' + s.key)}
          </button>
        `).join('')}
      </div>

      <div class="faq-sections" id="faqSections">
        ${sections.map(s => `
          <div class="faq-section" id="faq-${s.key}">
            <h3 class="faq-section-title">
              <div class="faq-section-icon">${sectionIcons[s.key]}</div>
              ${t('faq_' + s.key)}
              <span class="faq-section-count">${s.items.length}</span>
            </h3>
            <div class="faq-list">
              ${s.items.map(i => {
                qNum++;
                const p = prefix[s.key];
                const answer = t(p + i + '_a').replace(/\\n/g, '<br>');
                return `
                <div class="faq-item" data-q="${t(p + i + '_q').toLowerCase()}" onclick="this.classList.toggle('open')">
                  <div class="faq-q">
                    <span class="faq-num">${qNum}</span>
                    <span class="faq-text">${t(p + i + '_q')}</span>
                    <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div class="faq-a">${answer}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </main>
  </div>`;
});

function faqFilter(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.faq-item').forEach(el => {
    const text = (el.getAttribute('data-q') || '') + ' ' + (el.querySelector('.faq-a')?.textContent || '').toLowerCase();
    el.style.display = !q || text.includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.faq-section').forEach(sec => {
    const visible = sec.querySelectorAll('.faq-item:not([style*="display: none"])').length;
    sec.style.display = visible ? '' : 'none';
  });
}
