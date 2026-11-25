CAB.lang = {"af":"/cab/lang.af.live.1657cbb34bb9.js","am":"/cab/lang.am.live.153ada538379.js","ar":"/cab/lang.ar.live.b3bd6f06b123.js","as":"/cab/lang.as.live.be337ccdaa57.js","az":"/cab/lang.az.live.e30f28ebc310.js","bg":"/cab/lang.bg.live.2d17201ac231.js","bn":"/cab/lang.bn.live.e7d4d3ffb05c.js","cs":"/cab/lang.cs.live.17ade3b8dba6.js","da":"/cab/lang.da.live.e51ac9d6efd0.js","de":"/cab/lang.de.live.99d7b5814ef9.js","el":"/cab/lang.el.live.4a005a897c2f.js","es":"/cab/lang.es.live.8913b6bd2404.js","et":"/cab/lang.et.live.1f67347d826c.js","fa":"/cab/lang.fa.live.c1d0d18e4d1f.js","fi":"/cab/lang.fi.live.a561ddbe9c80.js","fr":"/cab/lang.fr.live.d240777d0a87.js","gu":"/cab/lang.gu.live.1564134aefc6.js","ha":"/cab/lang.ha.live.d40336f9ef78.js","he":"/cab/lang.he.live.448eb20353a8.js","hi":"/cab/lang.hi.live.62c28a298b34.js","hr":"/cab/lang.hr.live.21e403575524.js","ht":"/cab/lang.ht.live.55dd6ba39654.js","hu":"/cab/lang.hu.live.b0059e58fcb1.js","hy":"/cab/lang.hy.live.bd7659aabe02.js","id":"/cab/lang.id.live.ff2ae4f7d8f9.js","ig":"/cab/lang.ig.live.28c0f1ba9d79.js","is":"/cab/lang.is.live.81f836402f02.js","it":"/cab/lang.it.live.2824b948b6b3.js","ja":"/cab/lang.ja.live.162e13df24c6.js","ka":"/cab/lang.ka.live.95af3463b26d.js","kk":"/cab/lang.kk.live.c838018f4bb1.js","km":"/cab/lang.km.live.1b7b665e5be8.js","kn":"/cab/lang.kn.live.93cdbae7eb82.js","ko":"/cab/lang.ko.live.f3600d50aa74.js","ky":"/cab/lang.ky.live.5dae97c39f28.js","ln":"/cab/lang.ln.live.2d14f69aa46a.js","lo":"/cab/lang.lo.live.fed098ce3332.js","lt":"/cab/lang.lt.live.1dfdfc6fb51c.js","lv":"/cab/lang.lv.live.0dd9575441a9.js","mg":"/cab/lang.mg.live.36890f222fd7.js","mk":"/cab/lang.mk.live.3acb69c79d90.js","ml":"/cab/lang.ml.live.5ca1491cebcd.js","mn":"/cab/lang.mn.live.52b957ec2c7a.js","mr":"/cab/lang.mr.live.0540d83c8a65.js","ms":"/cab/lang.ms.live.f055d01b129d.js","my":"/cab/lang.my.live.5486855ee33d.js","ne":"/cab/lang.ne.live.5c539a26c1a7.js","nl":"/cab/lang.nl.live.f28b8a72891d.js","no":"/cab/lang.no.live.2459ede77da7.js","om":"/cab/lang.om.live.9acecdec2833.js","or":"/cab/lang.or.live.a0f7ea026fb2.js","pa":"/cab/lang.pa.live.8e706145f3c9.js","pl":"/cab/lang.pl.live.230cd17ff3b4.js","ps":"/cab/lang.ps.live.0f7d373af0ec.js","pt":"/cab/lang.pt.live.eb40b445ed3f.js","ro":"/cab/lang.ro.live.7b874d860e04.js","ru":"/cab/lang.ru.live.55fead85bade.js","rw":"/cab/lang.rw.live.8254c3b83759.js","sd":"/cab/lang.sd.live.60a12f6ae80e.js","si":"/cab/lang.si.live.b3a8a14b9d43.js","sk":"/cab/lang.sk.live.80c23cee385d.js","sl":"/cab/lang.sl.live.96a8f41e4058.js","so":"/cab/lang.so.live.c5a7f5758187.js","sq":"/cab/lang.sq.live.0ee5aed095fd.js","sr":"/cab/lang.sr.live.5aa0e2c1ebf7.js","sv":"/cab/lang.sv.live.d791d0ad923a.js","sw":"/cab/lang.sw.live.97d746865460.js","ta":"/cab/lang.ta.live.57abb2b81967.js","te":"/cab/lang.te.live.d98b0728b146.js","tg":"/cab/lang.tg.live.89a03f41f7a6.js","th":"/cab/lang.th.live.65f03aa79ff3.js","tk":"/cab/lang.tk.live.bbb964c3b391.js","tl":"/cab/lang.tl.live.5d94a36c7ec8.js","tr":"/cab/lang.tr.live.728108c11092.js","ug":"/cab/lang.ug.live.9906d71dac8c.js","uk":"/cab/lang.uk.live.1d1a7948e5cd.js","ur":"/cab/lang.ur.live.a84b771e6982.js","uz":"/cab/lang.uz.live.86f8ef27fcc9.js","vi":"/cab/lang.vi.live.d7e50d99dded.js","yo":"/cab/lang.yo.live.9d4594a0d500.js","zh":"/cab/lang.zh.live.fe2945958b09.js","zu":"/cab/lang.zu.live.21dd6ae840e0.js"};
const DOC_TABS = [['guides', 'Guides'], ['faq', 'FAQ~short'], ['rules', 'Rules'], ['terms', 'Terms of use'], ['privacy', 'Privacy policy'], ['refund', 'Refund policy']];
const DOC = { at: 0, tick: 0, pin: -1, pinY: 0, pinOn: false, pinT: 0 };
const docNn = (i) => String(i + 1).padStart(2, '0');
const DOC_TONE = { blue: ['#3b82f6', '#6366f1'], green: ['#10b981', '#059669'], amber: ['#f59e0b', '#ef4444'], red: ['#fb7185', '#e11d48'], violet: ['#8b5cf6', '#d946ef'], teal: ['#14b8a6', '#0ea5e9'], orange: ['#4ade80', '#22c55e'], slate: ['#64748b', '#334155'] };
const docIco = (icon, tone) => ico(I[icon], DOC_TONE[tone][0], DOC_TONE[tone][1]);
const docSaid = (x) => (x && x.said !== undefined ? x.said : T(x));
const docSteps = (rows) => '<ol class="doc-steps">' + rows.map((x, i) => '<li><i>' + (i + 1) + '</i><span>' + docSaid(x) + '</span></li>').join('') + '</ol>';
const docFacts = (rows) => '<dl class="doc-facts">' + rows.map((x) => '<div><dt><i>' + I[x[2]] + '</i><span>' + x[0] + '</span></dt><dd>' + x[1] + '</dd></div>').join('') + '</dl>';
const docShotSrc = (id, small) => { const sh = STATE.shots || { base: 'guide-shots/', lang: 'en' }, v = sh.v && sh.v[sh.lang];
  return sh.base + sh.lang + '/' + String(id).padStart(2, '0') + (small ? '.s' : '') + '.webp' + (v ? '?v=' + v : ''); };
const docShots = (rows) => '<div class="doc-shots">' + rows.map((x) => '<figure><button class="doc-shot" data-doc="zoom" data-src="' + docShotSrc(x[0]) + '" aria-label="' + docSaid(x[1]) + '"><img src="' + docShotSrc(x[0], true) + '" alt="' + docSaid(x[1]) + '" loading="lazy" width="390" height="760"></button><figcaption>' + docSaid(x[1]) + '</figcaption></figure>').join('') + '</div>';
const docBody = (i, blocks, tone) => { let k = 0; const num = () => (i + 1) + '.' + (++k), ul = (kind, icon, rows) => '<ul class="doc-ul ' + kind + '">' + rows.map((x) => '<li>' + icon + '<span>' + docSaid(x) + '</span></li>').join('') + '</ul>';
  return blocks.map((b) => (b.pts ? '<ol class="doc-p">' + b.pts.map((x) => '<li><em>' + num() + '</em><span>' + docSaid(x) + '</span></li>').join('') + '</ol>'
    : b.yes ? ul('yes', I.check, b.yes) : b.no ? ul('no', I.x, b.no) : b.off ? ul('off', I.minus, b.off)
    : b.kv ? '<dl class="doc-kv" style="--tn:' + (tone || '#22c55e') + '">' + b.kv.map((x) => '<div><i>' + I[x[2] || 'info'] + '</i><dt>' + docSaid(x[0]) + '</dt><dd>' + docSaid(x[1]) + '</dd></div>').join('') + '</dl>'
    : b.two ? '<div class="doc-two">' + b.two.map((x) => '<div' + (x[2] ? ' class="' + x[2] + '"' : '') + '><em>' + num() + '</em><b>' + docSaid(x[0]) + '</b><p>' + docSaid(x[1]) + '</p></div>').join('') + '</div>'
    : b.say ? '<p class="doc-say">' + I.info + '<span>' + docSaid(b.say) + '</span></p>'
    : b.text ? b.text.map((x) => '<p class="doc-t">' + docSaid(x) + '</p>').join('')
    : b.steps ? docSteps(b.steps) : b.facts ? docFacts(b.facts) : b.shots ? docShots(b.shots) : '')).join(''); };
const docSections = (S) => S.map((s, i) => [T(s[0]), docBody(i, s[3], DOC_TONE[s[2]][0]), docIco(s[1], s[2])]);
const docOrgSaid = (s) => ({ said: '<bdi class="doc-org" dir="ltr" lang="ru">' + s + '</bdi>' });
const DOC_ORG = ['Company details', 'file', 'slate', [{ kv: [
  ['Legal entity', docOrgSaid('ОсОО «Альянс Торг Компани»'), 'file'],
  ['Company address', docOrgSaid('Кыргызская Республика, Бишкек, Октябрьский район, <span>7-мкр.</span>, <span>ул. Безымянная</span>, <span>д. 37/2</span>'), 'pin'],
  ['Registration number (OGRN)', docOrgSaid('310076-3301-ООО'), 'tag'],
  ['Taxpayer number (INN)', docOrgSaid('9909710244'), 'tag']] }]];
const DOC_MAIL = 'support@pr.social', docMail = () => '<a class="doc-a" href="mailto:' + DOC_MAIL + '" translate="no">' + DOC_MAIL + '</a>';
const docHead = (id) => {
  const tools = '<span class="doc-tools"><button class="doc-lang" data-k="langs" aria-haspopup="dialog" aria-label="' + TF('{name}: {value}', { name: T('Language'), value: langOf(STATE.lang)[1] }) + '">' + I.globe + '<span lang="' + (STATE.lang || 'en') + '">' + langOf(STATE.lang)[1] + '</span>' + I.down + '</button>'
    + '<button class="doc-theme" data-k="theme-toggle" role="switch" aria-checked="' + (STATE.theme === 'dark') + '" aria-label="' + T('Dark theme') + '">' + I.moon + '</button></span>';
  return '<header class="doc-bar"><a class="doc-back" href="' + href('dashboard') + '" translate="no">' + I.back + '<b>PR<i>.</i>SOCIAL</b></a>'
    + '<nav class="doc-tabs">' + DOC_TABS.map((t) => '<a href="' + href(t[0]) + '"' + (t[0] === id ? ' class="on" aria-current="page"' : '') + '>' + T(t[1]) + '</a>').join('') + '</nav>' + tools + '<i class="doc-prog"></i></header>';
};
const docPage = (d) => {
  const n = d.sections.length;
  const up = '<button class="doc-up" data-doc="prev" aria-label="' + T('Previous section') + '">' + I.arrow + '</button>', dn = '<button class="doc-dn" data-doc="next" aria-label="' + T('Next section') + '">' + I.arrow + '</button>';
  const links = d.sections.map((s, i) => '<li><a href="#s' + (i + 1) + '" data-toc="' + (i + 1) + '"><em>' + docNn(i) + '</em><span>' + s[0] + '</span></a></li>').join('');
  return '<div class="doc">' + docHead(d.id)
    + '<div class="doc-grid"><aside class="doc-toc"><b>' + T('On this page') + '</b><ol>' + links + '</ol><div class="doc-step">' + up + dn + '<span class="doc-of"></span></div></aside>'
    + '<article class="doc-art"><span class="doc-eye">' + d.icon + d.eye + '</span><h1>' + d.title + '</h1><p class="doc-lead">' + d.lead + '</p>'
    + (d.changed ? '<p class="doc-meta"><span>' + I.clock + TF('Last changed: {date}', { date: DT.dayY(d.changed) }) + '</span></p>' : '') + (d.under || '')
    + d.sections.map((s, i) => '<section class="doc-s" id="s' + (i + 1) + '">' + (s[2] ? '<div class="doc-sh">' + s[2] + '<div><div class="doc-n">' + docNn(i) + '</div><h2>' + s[0] + '</h2></div></div>' : '<div class="doc-n">' + docNn(i) + '</div><h2>' + s[0] + '</h2>') + s[1] + '</section>').join('')
    + '<footer class="doc-foot">' + DOC_TABS.filter((t) => t[0] !== d.id).map((t) => '<a href="' + href(t[0]) + '">' + T(t[1]) + I.arrow + '</a>').join('') + '</footer></article></div>'
    + '<dialog class="doc-zoom" aria-label="' + T('Close') + '"><img alt=""><button data-doc="zoom-off" aria-label="' + T('Close') + '">' + I.x + '</button></dialog>'
    + '<nav class="doc-nav off" data-n="' + n + '" aria-label="' + T('On this page') + '">' + up + '<details class="doc-jump"><summary><em></em><span></span>' + I.down + '</summary><ol>' + links + '</ol></details>' + dn + '</nav></div>';
};
const docBar = () => { const b = document.querySelector('.doc-bar'); return b ? b.offsetHeight : 0; };
const docLine = () => docBar() + Math.min(window.innerHeight * 0.3, 240);
const docTo = (y) => window.scrollTo({ top: Math.max(0, y), behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
const docStarts = () => [].slice.call(document.querySelectorAll('.doc-s')).filter((s) => !s.hidden).map((s) => s.getBoundingClientRect().top + window.scrollY - docBar() - 14);
const docPin = (i, y) => { const full = document.documentElement.scrollHeight - window.innerHeight; DOC.pin = i; DOC.pinY = Math.max(0, Math.min(y, full)); DOC.pinOn = false; DOC.pinT = Date.now(); docTo(y); docSoon(); };
const docGo = (i) => { const el = document.getElementById('s' + (i + 1)); if (el) docPin(i, el.getBoundingClientRect().top + window.scrollY - docBar() - 14); else { DOC.pin = -1; docTo(0); } };
const docStep = (down) => { const y = window.scrollY, st = docStarts(), full = document.documentElement.scrollHeight - window.innerHeight;
  const all = [].slice.call(document.querySelectorAll('.doc-s')), shown = all.filter((s) => !s.hidden), go = (k) => docPin(all.indexOf(shown[k]), st[k]);
  if (down) { const k = st.findIndex((v) => v > y + 24); if (k >= 0) go(k); return; }
  let k = -1; st.forEach((v, j) => { if (v < y - 24) k = j; }); if (k >= 0) go(k); else { DOC.pin = -1; docTo(0); } };
const docSpy = () => { DOC.tick = 0; const root = document.querySelector('.doc'); if (!root) return;
  const secs = [].slice.call(root.querySelectorAll('.doc-s')), line = docLine(), full = document.documentElement.scrollHeight - window.innerHeight;
  let at = 0; secs.forEach((s, i) => { if (!s.hidden && s.getBoundingClientRect().top <= line) at = i; });
  if (full > 0 && window.scrollY >= full - 2) { for (let i = secs.length - 1; i >= 0; i--) if (!secs[i].hidden) { at = i; break; } }
  if (DOC.pin >= 0) { const off = Math.abs(window.scrollY - DOC.pinY); if (off < 6) DOC.pinOn = true;
    if ((DOC.pinOn && off > 48) || (!DOC.pinOn && Date.now() - DOC.pinT > 1600) || !secs[DOC.pin] || secs[DOC.pin].hidden) DOC.pin = -1; else at = DOC.pin; }
  DOC.at = at; root.style.setProperty('--p', full > 0 ? Math.min(1, Math.max(0, window.scrollY / full)).toFixed(4) : '0');
  root.querySelectorAll('a[data-toc]').forEach((a) => { const on = +a.dataset.toc === at + 1; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  const nav = root.querySelector('.doc-nav'), sum = nav && nav.querySelector('summary'), cur = secs[at];
  if (sum && cur) { sum.querySelector('em').textContent = docNn(at); sum.querySelector('span').textContent = cur.querySelector('h2').textContent; }
  if (nav) nav.classList.toggle('off', !secs.length || secs[0].getBoundingClientRect().top > line);
  root.querySelectorAll('.doc-of').forEach((x) => { x.textContent = (at + 1) + ' / ' + secs.length; });
  root.querySelectorAll('[data-doc="prev"]').forEach((b) => { b.disabled = window.scrollY < 4; });
  const more = full > 0 && window.scrollY < full - 2 && docStarts().some((v) => v > window.scrollY + 24);
  root.querySelectorAll('[data-doc="next"]').forEach((b) => { b.disabled = !more; });
};
const docSoon = () => { if (!DOC.tick) DOC.tick = requestAnimationFrame(docSpy); };
const docClick = (e) => { const root = document.querySelector('.doc'); if (!root) return false;
  const jump = root.querySelector('.doc-jump'), a = e.target.closest('a[data-toc]'), b = e.target.closest('[data-doc]');
  if (jump && jump.open && !e.target.closest('.doc-jump summary')) jump.open = false;
  if (a) { e.preventDefault(); docGo(+a.dataset.toc - 1); return true; }
  const zoom = root.querySelector('.doc-zoom');
  if (zoom && zoom.open && (e.target === zoom || e.target.closest('[data-doc="zoom-off"]') || e.target.tagName === 'IMG')) { zoom.close(); return true; }
  if (b && b.dataset.doc === 'zoom') { zoom.querySelector('img').src = b.dataset.src; if (zoom.showModal) zoom.showModal(); return true; }
  if (b) { docStep(b.dataset.doc === 'next'); return true; }
  return false; };
window.addEventListener('scroll', docSoon, { passive: true });
window.addEventListener('resize', docSoon);
PLUG.click.push(docClick);
PLUG.keys.push((e) => { const j = document.querySelector('.doc-jump'); if (e.key === 'Escape' && j && j.open) { j.open = false; j.querySelector('summary').focus(); return true; } return false; });
PLUG.after.push(() => { const on = document.querySelector('.doc-tabs .on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' }); docSpy(); });
const DOC_COIN = { usdt_bep20: 'USDT BEP20', trx: 'TRX', toncoin: 'GRAM', usdt_ton: 'USDT TON' };
const docCoin = (id) => (id === 'card_rub' ? T('Bank card') + ' (RUB)' : DOC_COIN[id] || String(id).toUpperCase());
const docSaidBy = (f) => ({ pay: f.pay && f.pay.map((m) => [docCoin(m.id), m.min, m.fee_pct || 0]), fee: f.fee_pct, hold: f.hold_hours, holdMin: f.hold_minutes != null ? f.hold_minutes : f.hold_hours * 60, cool: f.cooldown_hours,
  share: f.share_pct, tries: f.attempts_max, premium: f.premium_top, warnMax: f.warn_max, warnDays: f.warn_days, unlinkDays: f.unlink_days, early: f.early_unlink, freeIg: f.free_alive == null ? undefined : f.free_alive.on ? f.free_alive.hours : 0,
  one: f.one_account == null ? undefined : f.one_account ? Date.parse(String(f.one_account).replace(' ', 'T') + 'Z') : 0,
  surf: f.surf == null ? undefined : f.surf ? 1 : 0,
  idle: f.idle_days == null ? undefined : f.idle_days });
function docLive(key) {
  const drawn = PAGE.state;
  PAGE.state = (q) => {
    const s = drawn(q), d = LIVE.page || {}, said = docSaidBy(d.facts || {});
    if (key && s[key]) Object.keys(s[key]).forEach((k) => { if (said[k] != null) s[key][k] = said[k]; });
    if (s.shots && d.shots) { s.shots.base = d.shots.base; s.shots.have = d.shots.langs; s.shots.v = d.shots.v || {}; }
    return s;
  };
  PAGE.live = { open: true, path: () => '/api/cabinet/docs', fill: () => ({}) };
}
NET.usdt_bep20 = { color: '#26a17b', svg: sv('<path d="M6.500 6.500h11M12 6.500V18"/><ellipse cx="12" cy="11.300" rx="6.300" ry="1.700" stroke-width="1.500"/>', 2.2) };
NET.trx = { color: '#eb0029', svg: sv('<path d="M4 5.500l13 2.700 3 3.100L11.600 20z"/><path d="M4 5.500l8 6.400 8-.600M12 11.900L11.600 20M17 8.200l-5 3.700"/>', 1.6) };
NET.usdt_trc20 = NET.usdt_bep20;
NET.usdt_ton = { color: '#0098ea', svg: NET.usdt_bep20.svg };
NET.toncoin = { color: '#0098ea', svg: sv('<path d="M5.500 6.500h13L12 18.500z"/><path d="M12 6.500v12"/>', 2) };
NET.card_rub = { color: '#2f6f4f', svg: sv('<rect x="3.500" y="6" width="17" height="12" rx="2"/><path d="M3.500 10h17M7 14.500h4"/>', 1.8) };
const COIN = {
  usdt_bep20: { name: 'USDT', net: 'BNB Smart Chain (BEP20)', tag: 'BEP20', unit: 'USDT', re: /^0x[a-fA-F0-9]{40}$/, shape: 'It starts with 0x and has 42 characters.', ex: 'bscscan.com/tx/',
    where: 'In your wallet or exchange open Deposit, choose USDT and the network BNB Smart Chain (BEP20), then copy the address.' },
  trx: { name: 'TRX', net: 'Tron', tag: 'TRX', unit: 'TRX', re: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, shape: 'It starts with T and has 34 characters.', ex: 'tronscan.org/#/transaction/',
    where: 'In your wallet or exchange open Deposit, choose TRX (the Tron network), then copy the address.' },
  toncoin: { name: 'GRAM', net: 'TON', tag: 'TON', unit: 'GRAM', re: /^(?:[EU]Q[A-Za-z0-9_-]{46}|0:[a-fA-F0-9]{64})$/, shape: 'It starts with UQ or EQ and has 48 characters.', ex: 'tonviewer.com/transaction/',
    where: 'In your wallet or exchange open Deposit, choose GRAM and the network TON, then copy the address.' },
  usdt_ton: { name: 'USDT', net: 'TON', tag: 'TON', unit: 'USDT', re: /^(?:[EU]Q[A-Za-z0-9_-]{46}|0:[a-fA-F0-9]{64})$/, shape: 'It starts with UQ or EQ and has 48 characters.', ex: 'tonviewer.com/transaction/',
    where: 'In your wallet or exchange open Deposit, choose USDT and the network TON, then copy the address.' },
  usdt_trc20: { name: 'USDT', net: 'Tron (TRC20)', tag: 'TRC20', unit: 'USDT', re: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, shape: 'It starts with T and has 34 characters.', ex: 'tronscan.org/#/transaction/', where: '' },
  card_rub: { get name() { return T('Bank card'); }, get net() { return T('Russian bank, RUB'); }, tag: 'RUB', unit: 'RUB', card: true, re: { test: (a) => cardNoOk(a) || /^[•*]{4} ?\d{4}$/.test(String(a || '').trim()) },
    shape: 'A card number has 16 to 19 digits.', ex: '', where: 'The number is on the front of your card. Payouts go to cards of Russian banks, in roubles.' },
};
function cardNoOk(a) {
  const d = String(a || '').replace(/[\s-]/g, '');
  if (!/^\d{16,19}$/.test(d)) return false;
  let sum = 0, dbl = false;
  for (let i = d.length - 1; i >= 0; i--) { let x = d.charCodeAt(i) - 48; if (dbl) { x *= 2; if (x > 9) x -= 9; } sum += x; dbl = !dbl; }
  return sum % 10 === 0;
}
const netName = (k) => netLabel(k);
const WHY = {
  no: ['Your {p} account could not be verified', 'It is blocked, deleted or no longer linked to your profile. Part of this balance was earned on {p}, so a working account is needed before a payout. Link a working {p} account in your profile and request again.', 'Open profile', 'profile',
    '“We could not verify your {platform} account — it is blocked, deleted, or no longer linked to your profile. …” (the only reason that is translated)'],
  nos: ['Your {p} accounts could not be verified', 'They are blocked, deleted or no longer linked to your profile. Part of this balance was earned on these networks, so a working account on each of them is needed before a payout. Link working accounts in your profile and request again.', 'Open profile', 'profile',
    '“We could not verify your Instagram and X (Twitter) accounts …” (several networks, 20.10.2026)'],
  lqp: ['Account quality: {p}', 'These accounts did not pass the quality check for payouts. See your linked accounts and warnings in your profile.', 'Open profile', 'profile', '“Low-quality account: Instagram, TikTok”'],
  invalid_wallet: ['The address does not fit the network', 'The address of this request is not a valid {net} address. Request again with the right address.', '', '', '“Wallet address looks invalid for the selected network.” (in English for every language)'],
  account_banned: ['The account is restricted', 'Payouts are not sent while an account is banned or restricted. You can appeal in support.', 'Write to support', 'support', '“Account is banned or restricted.”'],
  multi_accounting: ['The address is used by several accounts', 'One person may have one account. A payout to an address shared by several accounts is not sent.', 'Write to support', 'support', '“Multiple accounts withdrawing to the same wallet — multi-accounting.”'],
  self_referral: ['Referral rules were broken', 'Invited accounts must belong to other people.', 'Write to support', 'support', '“Self-referral / fake-referral abuse detected.”'],
  fake_work: ['Some tasks were not really done', 'The check found tasks that were sent without the action being done.', 'Write to support', 'support', '“Detected pattern of fake or cheated task submissions.”'],
  follows_kept: ['Kept for Instagram follows', 'The following count of {acc} does not show part of the Instagram follows you were paid for (not shown: {n}). What was earned by breaking the rules is not paid out (the Rules 8.3), so this request was kept.', 'Write to support', 'support', 'the whole request kept'],
  none: ['No reason was given', 'Write to support to find out why.', 'Write to support', 'support', 'nothing is shown'],
};
function whyOf(r) {
  const w = r.why;
  if (/^text:/.test(w)) return { title: T('A note from the team'), text: '<bdi>' + esc(w.slice(5)) + '</bdi>', btn: T('Write to support'), go: 'support', key: 'text' };
  const key = /^no_/.test(w) ? 'no' : /^nos:/.test(w) ? 'nos' : /^lqp:/.test(w) ? 'lqp' : WHY[w] ? w : 'none', m = WHY[key];
  const p = key === 'no' ? netName(w.slice(3)) : key === 'nos' || key === 'lqp' ? commaList(w.slice(4).split(',').map(netName)) : '';
  const f = (s) => TF(s, { p, net: COIN[r.m].tag, n: r.kept ? r.kept.follows : '', acc: r.kept ? '<bdi>' + esc((r.kept.accounts || []).map((a) => '@' + a).join(', ')) + '</bdi>' : '' });
  return { title: f(m[0]), text: f(m[1]), btn: m[2] ? T(m[2]) : '', go: m[3], key };
}
const LV_WINS = [12, 24, 48];
const LV_STEP = 20;
let LVD = null;
const lvAt = () => (LVD && LVD.at) || DT.now();
const lvWin = () => (LV_WINS.includes(Number(STATE.h)) ? Number(STATE.h) : 24);
const lvSpark = () => liveMark(LVD && LVD.hours ? LVD.hours.slice(0, -1).map((x) => x[1]) : null);
const lvBar = () => '<header class="doc-bar lv-bar"><a class="doc-back" href="' + href('dashboard') + '" translate="no">' + I.back + '<b>PR<i>.</i>SOCIAL</b></a>'
  + '<span class="lv-name">' + lvSpark() + T('Live~page') + '</span>'
  + '<span class="doc-tools"><button class="doc-lang" data-k="langs" aria-haspopup="dialog" aria-label="' + TF('{name}: {value}', { name: T('Language'), value: langOf(STATE.lang)[1] }) + '">' + I.globe
  + '<span lang="' + (STATE.lang || 'en') + '">' + langOf(STATE.lang)[1] + '</span></button>'
  + '<button class="doc-theme" data-k="theme-toggle" role="switch" aria-checked="' + (STATE.theme === 'dark') + '" aria-label="' + T('Dark theme') + '">' + I.moon + '</button></span></header>';
const lvCoin = (m, quiet) => { const c = NET[m] || NET.usdt_bep20; return '<span class="lv-coin' + (quiet ? ' lv-q' : '') + '" style="--c:' + c.color + '" aria-hidden="true">' + c.svg + '</span>'; };
const lvNet = (m) => { const c = COIN[m]; return c ? c.name + (c.tag && c.tag !== c.name ? ' ' + c.tag : '') : m; };
const lvNetShort = (m) => { const c = COIN[m]; return c ? (c.tag || c.name) : m; };
const lvSince = (h) => plF(h, 'in the last {n} hour', 'in the last {n} hours', { n: h });
const lvMoney = (v) => { const s = usd(v), i = s.lastIndexOf('.'); return i < 0 ? s : s.slice(0, i) + '<small class="lv-c">' + s.slice(i) + '</small>'; };
const lvSay = (i) => { const hs = LVD && LVD.hours; if (!hs || !hs.length) return ''; const k = i >= 0 && hs[i] ? i : hs.length - 1, p = hs[k];
  return '<b>' + DT.time(p[0]) + '–' + DT.time(p[0] + 3600e3) + (k === hs.length - 1 ? ' · ' + T('now') : '') + '</b><span>' + plF(p[1], '{n} payout', '{n} payouts', { n: n(p[1]) }) + ' · ' + usd(p[2]) + '</span>'; };
const lvHourText = (i) => { const p = LVD.hours[i]; return DT.time(p[0]) + ', ' + plF(p[1], '{n} payout', '{n} payouts', { n: n(p[1]) }) + ', ' + usd(p[2]); };
const lvBars = () => {
  const hs = LVD.hours || [], top = Math.max(1, ...hs.map((x) => x[2])), pick = Number.isInteger(STATE.bar) && hs[STATE.bar] ? STATE.bar : -1, cur = pick >= 0 ? pick : hs.length - 1;
  const bars = hs.map((x, i) => '<span class="lv-b' + (i === hs.length - 1 ? ' lv-cur' : '') + (i === pick ? ' lv-pick' : '') + '"><i style="--h:' + Math.max(3, Math.round((x[2] / top) * 100)) + '%"></i></span>').join('');
  const ax = hs.length ? '<div class="lv-ax" aria-hidden="true"><span>' + DT.time(hs[0][0]) + '</span><span>' + DT.time(hs[Math.floor(hs.length / 2)][0]) + '</span><span>' + T('now') + '</span></div>' : '';
  return '<div class="lv-bars" role="slider" tabindex="0" aria-label="' + T('Payouts by hour') + '" aria-valuemin="0" aria-valuemax="' + Math.max(0, hs.length - 1) + '" aria-valuenow="' + Math.max(0, cur)
    + '" aria-valuetext="' + esc(hs.length ? lvHourText(cur) : '') + '">' + bars + '</div>'
    + ax + '<p class="lv-say" aria-live="polite">' + lvSay(pick) + '</p>';
};
const lvNets = () => {
  const ns = (LVD.nets || []).filter((x) => x[2] > 0), all = ns.reduce((a, x) => a + x[2], 0) || 1;
  if (!ns.length) return '';
  const pct = (v) => { const p = (v / all) * 100; return p >= 10 ? Math.round(p) + '%' : p >= 1 ? p.toFixed(1).replace(/\.0$/, '') + '%' : '<1%'; };
  return '<section class="lv-nets" aria-label="' + T('Networks~coin') + '"><h2>' + T('Networks~coin') + '</h2><div class="lv-strip">' + ns.map((x) => '<i style="--c:' + (NET[x[0]] || NET.usdt_bep20).color + ';--g:' + Math.round((x[2] / all) * 1000) + '"></i>').join('') + '</div>'
    + '<ul>' + ns.map((x) => '<li>' + lvCoin(x[0], true) + '<span class="lv-nn"><b>' + lvNet(x[0]) + '</b><small>' + plF(x[1], '{n} payout', '{n} payouts', { n: n(x[1]) }) + '</small></span><em>' + pct(x[2]) + '</em></li>').join('') + '</ul></section>';
};
const lvTxShort = (h) => h.slice(0, h.startsWith('0x') ? 6 : 6) + '…' + h.slice(-4);
const lvTx = (r) => (r[5] && COIN[r[2]] && COIN[r[2]].ex && /^(0x)?[0-9a-f]{64}$/i.test(r[5])
  ? '<a class="lv-tx" href="https://' + COIN[r[2]].ex + r[5] + '" target="_blank" rel="noopener noreferrer nofollow" translate="no" title="' + esc(T('Transaction on the blockchain')) + '">' + lvTxShort(r[5]) + I.out + '</a>' : '');
const lvRow = (r) => '<li class="lv-row' + (STATE.fresh && STATE.fresh.includes(r[0]) ? ' lv-fresh' : '') + '">' + lvCoin(r[2], true)
  + '<b class="lv-who" translate="no"><span class="lv-nm">' + esc(r[1]) + '</span><em class="lv-id" dir="ltr">#' + r[0] + '</em></b><b class="lv-sum">' + usd(r[3]) + '</b>'
  + '<small class="lv-via"><em translate="no" dir="ltr">#' + r[0] + '</em><span><i class="lv-nf">' + lvNet(r[2]) + '</i><i class="lv-ns">' + lvNetShort(r[2]) + '</i></span>' + lvTx(r) + '</small>'
  + '<time class="lv-when" datetime="' + new Date(r[4]).toISOString() + '" title="' + esc(DT.relT(r[4])) + '">' + DT.ago(r[4]) + '</time></li>';
const lvSkel = () => '<div class="lv-skel" aria-hidden="true">' + '<i></i>'.repeat(5) + '</div>';
const lvHero = () => {
  const h = lvWin(), s = LVD.sum || [0, 0, 0], wins = LVD.wins || {};
  const seg = '<div class="seg even lv-seg" role="group" aria-label="' + T('Period') + '">' + LV_WINS.map((w) => '<button data-lv="h" data-h="' + w + '" aria-pressed="' + (w === h) + '">'
    + TF('{n} h', { n: w }) + '</button>').join('') + '</div>';
  const figs = '<dl class="lv-figs"><div><dt>' + T('Payouts') + '</dt><dd>' + n(s[0]) + '</dd></div>'
    + '<div><dt>' + T('People paid') + '</dt><dd>' + n(s[2]) + '</dd></div>'
    + '<div><dt>' + T('Last payout') + '</dt><dd>' + (LVD.last ? DT.ago(LVD.last) : '—') + '</dd></div></dl>';
  return '<section class="lv-hero"><div class="lv-top"><h1 class="lv-h">' + T('Payouts') + '</h1><span class="lv-at">'
    + TF('Updated {when}', { when: DT.ago(lvAt()) }) + '</span></div>'
    + '<p class="lv-big" data-v="' + s[1] + '">' + lvMoney(s[1]) + '</p>'
    + '<p class="lv-cap">' + plF(s[2], 'sent to {n} person {since}', 'sent to {n} people {since}', { n: n(s[2]), since: lvSince(h) }) + '</p>'
    + seg + lvBars() + figs + '</section>';
};
const lvList = () => {
  const h = lvWin(), rows = LVD.rows || [], wait = Number(STATE.waiting) || 0, page = LVD.page || 1, pages = LVD.pages || 1, total = (LVD.sum || [0])[0];
  const sort = '<div class="seg lv-sort" role="group" aria-label="' + T('Sort') + '"><button data-lv="sort" data-s="new" aria-pressed="' + (STATE.sort !== 'big') + '">' + T('Newest~sort') + '</button>'
    + '<button data-lv="sort" data-s="big" aria-pressed="' + (STATE.sort === 'big') + '">' + T('Largest~sort') + '</button></div>';
  const head = '<header class="lv-lh"><div><h2>' + (STATE.sort === 'big' ? T('Largest payouts') : T('Latest payouts')) + '</h2><small>' + lvSince(h) + '</small></div>' + sort + '</header>'
    + (wait && STATE.sort !== 'big' && page === 1 ? '<button class="lv-pill" data-lv="pull">' + I.arrow + plF(wait, '{n} new payout', '{n} new payouts', { n: n(wait) }) + '</button>' : '');
  const body = !rows.length ? '<div class="lv-empty">' + I.clock + '<b>' + T('No payouts yet in this period') + '</b><p>' + T('They appear here the moment they are sent.') + '</p>'
      + (h < 48 ? '<button class="btn" data-lv="h" data-h="48">' + TF('Show {n} hours', { n: 48 }) + '</button>' : '') + '</div>'
    : '<ol class="lv-rows"' + (STATE.busy ? ' aria-busy="true"' : '') + '>' + rows.map(lvRow).join('') + '</ol>' + lvPager(page, pages, rows.length, total);
  return '<section class="lv-list" aria-label="' + T('Payouts') + '">' + head + body + '</section>';
};
const lvPager = (page, pages, shown, total) => { if (pages <= 1) return '';
  const from = (page - 1) * LV_STEP + 1, to = from + Math.max(1, shown) - 1, range = '<b>' + n(from) + (to > from ? '–' + n(to) : '') + '</b>';
  return '<nav class="lv-pager" aria-label="' + T('Payouts') + '"><span class="lv-pt">' + TF('{range} of {total}', { range, total: n(total) }) + '</span>'
    + '<button class="lv-pb" data-lv="pg" data-p="' + (page - 1) + '" aria-label="' + T('Previous page') + '"' + (page <= 1 || STATE.busy ? ' disabled' : '') + '>' + I.back + '</button>'
    + '<button class="lv-pb" data-lv="pg" data-p="' + (page + 1) + '" aria-label="' + T('Next page') + '"' + (page >= pages || STATE.busy ? ' disabled' : '') + '>' + I.chev + '</button></nav>'; };
const lvFoot = () => (STATE.guest === false ? '<a class="btn lv-go" href="' + href('wallet') + '">' + I.wallet + T('Go to the Wallet') + '</a>'
    : '<a class="btn lv-go" href="' + href('register', 'scene=up') + '">' + I.bolt + T('Start earning') + '</a>');
function lvScrub() {
  const box = document.querySelector('.lv-bars'); if (!box || box.dataset.on || !LVD || !LVD.hours) return;
  box.dataset.on = '1';
  const k = LVD.hours.length, bars = box.querySelectorAll('.lv-b'), say = document.querySelector('.lv-say');
  const at = (x) => { const r = box.getBoundingClientRect(); let i = Math.floor(((x - r.left) / r.width) * k); if (getComputedStyle(box).direction === 'rtl') i = k - 1 - i; return Math.max(0, Math.min(k - 1, i)); };
  const show = (i) => { if (i === STATE.bar) return; STATE.bar = i; bars.forEach((b, j) => b.classList.toggle('lv-pick', j === i)); if (say) say.innerHTML = lvSay(i);
    box.setAttribute('aria-valuenow', i); box.setAttribute('aria-valuetext', lvHourText(i)); };
  let down = false;
  box.addEventListener('pointerdown', (e) => { down = true; try { box.setPointerCapture(e.pointerId); } catch (x) {  } show(at(e.clientX)); });
  box.addEventListener('pointermove', (e) => { if (down || e.pointerType === 'mouse') show(at(e.clientX)); });
  ['pointerup', 'pointercancel'].forEach((t) => box.addEventListener(t, () => { down = false; }));
  box.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse' || down) return; STATE.bar = null; bars.forEach((b) => b.classList.remove('lv-pick')); if (say) say.innerHTML = lvSay(-1);
    box.setAttribute('aria-valuenow', k - 1); box.setAttribute('aria-valuetext', lvHourText(k - 1)); });
  box.addEventListener('keydown', (e) => { const d = { ArrowLeft: -1, ArrowRight: 1, Home: -k, End: k }[e.key]; if (!d) return; e.preventDefault();
    const rtl = getComputedStyle(box).direction === 'rtl' && Math.abs(d) === 1 ? -1 : 1; show(Math.max(0, Math.min(k - 1, (Number.isInteger(STATE.bar) ? STATE.bar : k - 1) + d * rtl))); });
}
const lvHead = () => { const h = document.querySelector('.lv-lh'), l = document.querySelector('.lv'); if (h && l) l.style.setProperty('--lh', h.offsetHeight + 'px'); };
let lvHeadOn = false;
const lvToTop = () => { const l = document.querySelector('.lv-list'); if (l && l.getBoundingClientRect().top < 0) l.scrollIntoView({ block: 'start' }); };
function lvCount() {
  const el = document.querySelector('.lv-big'); if (!el || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const v = Number(el.dataset.v) || 0, t0 = performance.now();
  const step = (t) => { const p = Math.min(1, (t - t0) / 650), e = 1 - Math.pow(1 - p, 3); if (!el.isConnected) return; el.innerHTML = lvMoney(Math.round(v * e * 100) / 100); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const PAGE = {
  id: 'live', title: 'Live~page', short: 'Live~page',
  solo: true,
  state: (q) => Object.assign({ h: LV_WINS.includes(Number(q.get('h'))) ? Number(q.get('h')) : 24, sort: q.get('sort') === 'big' ? 'big' : 'new', page: 1, bar: null, fresh: [], waiting: 0, countUp: true }, PAGE.preset ? PAGE.preset(q) : null),
  render() {
    const fail = STATE.load === 'fail', wait = !LVD || STATE.load === 'wait';
    const side = fail ? '<section class="lv-fail">' + I.warn + '<b>' + T('The numbers could not be loaded') + '</b><p>' + T('Check your connection and try again.') + '</p><button class="btn" data-lv="again">' + I.refresh + T('Try again') + '</button></section>'
      : wait ? '<section class="lv-hero lv-wait" aria-busy="true"><div class="lv-top"><h1 class="lv-h">' + T('Payouts') + '</h1></div>' + lvSkel() + '</section>'
      : lvHero() + lvNets();
    return '<div class="lv">' + lvBar() + '<main class="lv-main"><div class="lv-side">' + side + lvFoot() + '</div>' + (fail || wait ? '' : lvList()) + '</main></div>';
  },
  click(e) {
    const b = e.target.closest('[data-lv]');
    if (!b) return false;
    const k = b.dataset.lv;
    if (k === 'h') { const h = Number(b.dataset.h); if (h !== lvWin()) { STATE.h = h; STATE.bar = null; STATE.waiting = 0; STATE.countUp = true; PAGE.ask && PAGE.ask(); render(); } return true; }
    if (k === 'sort') { const s = b.dataset.s === 'big' ? 'big' : 'new'; if (s !== STATE.sort) { STATE.sort = s; STATE.bar = null; STATE.countUp = true; PAGE.ask && PAGE.ask(); render(); } return true; }
    if (k === 'pg') { const p = Number(b.dataset.p); if (!STATE.busy && LVD && p >= 1 && p <= (LVD.pages || 1) && p !== (LVD.page || 1) && PAGE.go) PAGE.go(p); return true; }
    if (k === 'pull') { if (PAGE.pull) PAGE.pull();  const l = document.querySelector('.lv-list'); if (l) l.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
    if (k === 'again') { STATE.load = 'wait'; PAGE.ask && PAGE.ask(); render(); return true; }
    return false;
  },
  after() { lvScrub(); lvHead(); if (!lvHeadOn) { lvHeadOn = true; window.addEventListener('resize', lvHead); } if (STATE.countUp && LVD && !STATE.busy) { STATE.countUp = false; lvCount(); } },
};
const LV_POLL_MS = 30000;
const lvUrl = (h, sort, page) => '/api/cabinet/live?h=' + h + '&sort=' + (sort === 'big' ? 'big' : 'new') + '&page=' + page;
let lvSeq = 0, lvLast = 0, lvPolling = false, lvWatching = false;
const lvNew = (rows, had) => { const known = new Set((had || []).map((x) => x[0])), top = had && had[0] ? had[0][4] : 0; return (rows || []).filter((x) => !known.has(x[0]) && x[4] >= top).map((x) => x[0]); };
async function lvGet(h, sort, page) { const seq = ++lvSeq, r = await ask('GET', lvUrl(h, sort, page)); return seq === lvSeq ? r : null; }
function lvTake(r, then) {
  if (!r) return false;
  STATE.busy = false;
  if (!r.ok || !r.data || !r.data.rows) {
    if (!LVD) STATE.load = 'fail'; else toast('Check your connection and try again.');
    render(); return false;
  }
  LVD = r.data; lvLast = Date.now(); STATE.load = '';
  if (then) then();
  render(); return true;
}
PAGE.ask = () => { STATE.page = 1; STATE.fresh = []; STATE.waiting = 0; STATE.busy = true; lvGet(lvWin(), STATE.sort, 1).then((r) => lvTake(r)); };
PAGE.go = (p) => { STATE.busy = true; render(); lvGet(lvWin(), STATE.sort, p).then((r) => { if (lvTake(r, () => { STATE.page = p; STATE.fresh = []; })) lvToTop(); }); };
PAGE.pull = () => {
  const had = LVD && LVD.rows;
  STATE.busy = true; render();
  lvGet(lvWin(), STATE.sort, 1).then((r) => lvTake(r, () => { STATE.page = 1; STATE.waiting = 0; STATE.fresh = lvNew(LVD.rows, had); }));
};
function lvPoll() {
  if (lvPolling || document.visibilityState !== 'visible' || !LVD || STATE.busy || STATE.load || STATE.sort === 'big' || (STATE.page || 1) !== 1) return;
  if (Date.now() - lvLast < LV_POLL_MS) return;
  const h = lvWin(), had = LVD.rows;
  lvPolling = true; lvLast = Date.now();
  ask('GET', lvUrl(h, 'new', 1)).then((r) => {
    lvPolling = false;
    if (!r.ok || !r.data || !r.data.rows || lvWin() !== h || STATE.sort === 'big' || (STATE.page || 1) !== 1 || STATE.busy || STATE.load) return;
    if (r.data.at === LVD.at) return;
    const fresh = lvNew(r.data.rows, had);
    const list = document.querySelector('.lv-list'), seen = !list || list.getBoundingClientRect().top > -40;
    if (!fresh.length || seen) { LVD = r.data; STATE.fresh = fresh; STATE.waiting = 0; }
    else { LVD = Object.assign({}, r.data, { rows: LVD.rows }); STATE.waiting = fresh.length; }
    render();
  });
}
{ const drawn = PAGE.state;
  PAGE.state = (q) => Object.assign(drawn(q), { guest: !(LIVE.frame && LIVE.frame.user), load: LVD ? '' : 'fail', page: (LVD && LVD.page) || 1 }); }
PAGE.live = {
  open: true,
  path: () => { const q = new URLSearchParams(location.search), h = Number(q.get('h')); return lvUrl(LV_WINS.includes(h) ? h : 24, q.get('sort'), 1); },
  fill: (f, d) => { LVD = d && d.rows ? d : null; lvLast = Date.now(); return {}; },
  async ready() {
    if (lvWatching) return;
    lvWatching = true;
    setInterval(lvPoll, 5000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') lvPoll(); });
  },
};
start();