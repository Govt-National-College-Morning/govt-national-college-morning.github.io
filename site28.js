/* GNCK website v2.8 - design + full control from the Control Panel (XI Code_v28.0, WEB23 / WEB24 / WEB25).
   Reads the same public settings (<exec>?action=settings: no passwords, no keys): theme, colours, fonts, banner,
   order of the sections, special days, own sections, logo, menu, footer, popup, ticker, pages ON / OFF,
   Google title / description, countdowns, downloads, calendar, social links, first language, bigger text,
   faculty page, daily quote, copyright line, video guides (groups, versions, "watch first?").
   Nothing from Google = the page stays as it is written. */
(function () {
  var EXEC = 'https://script.google.com/macros/s/AKfycby5KEXSxmiqXUC0hCk6jRTdc_-XagevQAWsCiEWTKjU1HLqtYm1RLPSQWn6513rPHhTHA/exec';
  var KEY = 'gnckSet1', root = document.documentElement;
  var P = location.pathname.replace(/index\.html$/, ''), PAGE = P === '/' ? 'home' : P.replace(/^\/|\/$/g, '');
  var pv = (location.search.match(/[?&]preview=([A-Za-z0-9]{6,20})/) || [])[1] || '';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safe(u) { u = String(u || ''); return /^https:\/\/[^\s"'<>]+$/.test(u) || /^\/[A-Za-z0-9_\-./]*$/.test(u) ? u : ''; }
  function bil(en, ur) { return '<span class="en">' + esc(en) + '</span><span class="ur" data-nosnippet>' + esc(ur || en) + '</span>'; }
  function ur() { return root.getAttribute('lang') === 'ur'; }
  function T(en, u) { return ur() ? (u || en) : en; }
  function today() { var d = new Date(Date.now() + 5 * 3600e3); return d.toISOString().slice(0, 10); }
  function inRange(a, b) { var t = today(); return (!a || t >= a) && (!b || t <= b); }
  function drop(id) { var e = document.getElementById(id); if (e) e.parentNode.removeChild(e); }
  function hash(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h >>> 0); }
  var THEMES = {
    NEELA: { green: '#0d47a1', 'green-2': '#1565c0', gold: '#f9a825', 'gold-soft': '#fff3c4' },
    MAROON: { green: '#6d1b2b', 'green-2': '#8e2439', gold: '#c9a227', 'gold-soft': '#f8ecd0' },
    DARK: { green: '#0e3b25', 'green-2': '#1b5e3b', gold: '#d4af37', paper: '#101714', card: '#18221d', fg: '#e8efe9', muted: '#a9b8ae', line: '#2b3a32', chip: '#203029' },
    AZADI: { green: '#01411c', 'green-2': '#0a5a2d', gold: '#ffffff', 'gold-soft': '#e8f5ec' },
    EID: { green: '#00695c', 'green-2': '#00897b', gold: '#ffd54f', 'gold-soft': '#fff8e1' },
    RESULT: { green: '#1a237e', 'green-2': '#283593', gold: '#ffca28', 'gold-soft': '#fff8e1' }
  };
  var CSS = '.bn28{position:relative;overflow:hidden;border-radius:14px;margin:12px auto;max-width:1180px}.bn28 img{width:100%;max-height:360px;object-fit:cover;display:block}.bn28 .cap{position:absolute;left:0;right:0;bottom:0;padding:10px 14px;background:linear-gradient(transparent,rgba(0,0,0,.6));color:#fff;font-weight:700}' +
    '.tk28{background:var(--green,#0b3d24);color:#fff;overflow:hidden;white-space:nowrap;font-weight:600}.tk28 span{display:inline-block;padding:7px 0;padding-left:100%;animation:tk28 28s linear infinite}@keyframes tk28{to{transform:translateX(-100%)}}' +
    '.sd28{background:var(--gold,#c9a227);color:#13261b;text-align:center;padding:8px 12px;font-weight:700}' +
    '.blk28,.cd28,.dl28,.cal28w,.q28{max-width:1180px;margin:18px auto;padding:0 16px}.blk28 .card,.cd28 .card,.dl28 .card,.cal28w .card,.q28 .card{padding:16px}.blk28 img{max-width:100%;border-radius:10px}' +
    '.cd28 .row{display:flex;flex-wrap:wrap;gap:10px}.cd28 .b{flex:1 1 220px;background:var(--chip,#eef3ef);border-radius:12px;padding:12px;text-align:center}.cd28 .n{font-size:1.6rem;font-weight:800;color:var(--green,#0b3d24)}' +
    '.dl28 a{display:block;padding:9px 0;border-bottom:1px solid var(--line,#ddd)}.q28 .card{border-left:5px solid var(--gold,#c9a227);font-style:italic}' +
    '.pop28{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999;display:flex;align-items:center;justify-content:center;padding:16px}.pop28 .box{background:var(--card,#fff);color:var(--fg,#13261b);border-radius:16px;max-width:520px;width:100%;padding:18px;max-height:90vh;overflow:auto}' +
    '.pop28 .x{float:right;border:0;background:transparent;font-size:1.6rem;cursor:pointer;color:inherit}.vgv28{width:100%;aspect-ratio:16/9;border:0;border-radius:10px;background:#000;margin:6px 0}' +
    '.a11y28{position:fixed;right:12px;bottom:76px;z-index:90;border:0;border-radius:999px;padding:9px 13px;background:var(--green,#0b3d24);color:#fff;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer}' +
    'html.big28{font-size:118%}html.hc28 body{filter:contrast(1.25)}.ft28{max-width:1180px;margin:10px auto;padding:0 16px;font-size:.92rem}.ft28 a{margin-inline-end:12px}.soc28 a{display:inline-block;margin:4px 6px 4px 0;padding:6px 12px;border-radius:999px;background:var(--chip,#eef3ef)}' +
    '.off28{max-width:700px;margin:40px auto;padding:22px;text-align:center}';
  function style(id, css) { var e = document.getElementById(id); if (!e) { e = document.createElement('style'); e.id = id; document.head.appendChild(e); } e.textContent = css; }
  function theme(w) {
    var vars = {}, sd = (w.special || []).filter(function (x) { return x && x.from && inRange(x.from, x.to || x.from); })[0];
    var name = sd ? sd.theme : (w.theme || 'ASAL');
    if (THEMES[name]) vars = THEMES[name];
    if (!sd && name === 'APNA' && w.colors) { var c = w.colors; ['green', 'gold', 'paper', 'fg'].forEach(function (k) { if (/^#[0-9a-f]{6}$/i.test(c[k] || '')) vars[k] = c[k]; }); if (vars.green) vars['green-2'] = vars.green; }
    var f = w.fonts || {}, fl = [];
    if (f.en && f.en !== 'DEFAULT') { vars['f-body'] = '"' + f.en + '",system-ui,sans-serif'; fl.push(f.en); }
    if (f.ur && f.ur !== 'DEFAULT') { vars['f-urdu'] = '"' + f.ur + '",serif'; fl.push(f.ur); }
    style('t28', ':root{' + Object.keys(vars).map(function (k) { return '--' + k + ':' + vars[k]; }).join(';') + '}' + (vars.paper ? 'body{background:' + vars.paper + ';color:' + (vars.fg || 'inherit') + '}' : '') + CSS);
    drop('f28');
    if (fl.length) { var l = document.createElement('link'); l.id = 'f28'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?' + fl.map(function (x) { return 'family=' + encodeURIComponent(x).replace(/%20/g, '+') + ':wght@400;700'; }).join('&') + '&display=swap'; document.head.appendChild(l); }
    drop('sd28');
    if (sd && (sd.en || sd.ur)) { var b = document.createElement('div'); b.id = 'sd28'; b.className = 'sd28'; b.innerHTML = bil(sd.en, sd.ur); var h = $('header.top') || document.body.firstChild; h.parentNode.insertBefore(b, h.nextSibling); }
  }
  function afterHeader(el) { var h = $('header.top'); if (h && h.parentNode) h.parentNode.insertBefore(el, h.nextSibling); else document.body.insertBefore(el, document.body.firstChild); }
  function banner(w) {
    drop('bn28');
    var B = w.banner || {}, L = (B.imgs || []).filter(function (x) { return x && safe(x.url); });
    if (PAGE !== 'home' || !B.mode || B.mode === 'NONE' || !L.length) return;
    if (B.mode === 'ONE') L = L.slice(0, 1);
    var d = document.createElement('div'); d.id = 'bn28'; d.className = 'bn28';
    d.innerHTML = '<img src="' + esc(L[0].url) + '" alt="' + esc(L[0].alt || '') + '" referrerpolicy="no-referrer">' + (L[0].alt ? '<div class="cap">' + esc(L[0].alt) + '</div>' : '');
    var sec = $('#services'); if (sec && sec.parentNode) sec.parentNode.insertBefore(d, sec); else afterHeader(d);
    if (L.length > 1) { var i = 0, ms = Math.max(2, parseInt(B.sec, 10) || 5) * 1000; clearInterval(window.__bn28); window.__bn28 = setInterval(function () { i = (i + 1) % L.length; var im = $('#bn28 img'), cp = $('#bn28 .cap'); if (!im) return; im.src = L[i].url; if (cp) cp.textContent = L[i].alt || ''; }, ms); }
  }
  var IDS = ['services', 'leader', 'process', 'documents', 'faculties', 'cutoff', 'enrollment', 'faq', 'staff', 'contact'];
  function order(w) {
    if (PAGE !== 'home' || !w.order || !w.order.length) return;
    var first = $('#services'); if (!first) return;
    var par = first.parentNode, anchor = null;
    w.order.forEach(function (id) { if (IDS.indexOf(id) < 0) return; var s = document.getElementById(id); if (!s || s.parentNode !== par) return; if (!anchor) { anchor = s; return; } par.insertBefore(s, anchor.nextSibling); anchor = s; });
  }
  function blocks(w) {
    $$('.blk28').forEach(function (e) { e.parentNode.removeChild(e); });
    if (PAGE !== 'home') return;
    (w.blocks || []).forEach(function (b, i) {
      if (!b || b.on === false || !(b.en || b.ur || b.ben || b.bur)) return;
      var s = document.createElement('section'); s.className = 'blk28'; s.id = 'blk28-' + i;
      s.innerHTML = '<div class="card">' + (b.en || b.ur ? '<h2>' + bil(b.en, b.ur) + '</h2>' : '') + (safe(b.img) ? '<img src="' + esc(b.img) + '" alt="" referrerpolicy="no-referrer" loading="lazy">' : '') +
        (b.ben || b.bur ? '<p>' + bil(b.ben, b.bur) + '</p>' : '') + (b.btn && safe(b.url) ? '<p><a class="btn" href="' + esc(b.url) + '"' + (/^https/.test(b.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(b.btn) + '</a></p>' : '') + '</div>';
      var at = b.after && b.after !== 'TOP' ? document.getElementById(b.after) : null;
      if (at && at.parentNode) at.parentNode.insertBefore(s, at.nextSibling); else { var f = $('#services'); if (f && f.parentNode) f.parentNode.insertBefore(s, f); else afterHeader(s); }
    });
  }
  function logo(w) { if (!safe(w.logo)) return; $$('header.top img').slice(0, 1).forEach(function (im) { im.src = w.logo; im.referrerPolicy = 'no-referrer'; }); }
  function menu(w) {
    $$('.m28').forEach(function (e) { e.parentNode.removeChild(e); });
    var nav = $('nav.navlinks'); if (!nav) return;
    (w.menu || []).forEach(function (m) { if (!m || m.on === false || !safe(m.url) || !(m.en || m.ur)) return; var a = document.createElement('a'); a.className = 'm28'; a.href = m.url; if (/^https/.test(m.url)) { a.target = '_blank'; a.rel = 'noopener'; } a.innerHTML = bil(m.en, m.ur); nav.appendChild(a); });
  }
  var SOCN = { Facebook: 'Facebook', YouTube: 'YouTube', Instagram: 'Instagram', TikTok: 'TikTok', X: 'X', WhatsApp: 'WhatsApp', LinkedIn: 'LinkedIn' };
  function footer(w, s) {
    drop('ft28');
    var f = w.footer || {}, links = (f.links || []).filter(function (l) { return l && safe(l.url); }), soc = (w.social || []).filter(function (x) { return x && SOCN[x.name] && safe(x.url); });
    var cp = w.copy && w.copy.on === true, site = (s && s.links && s.links.site) || 'https://gnck.edu.pk';
    var fac = w.faculty && w.faculty.on === true;
    if (!f.en && !f.ur && !links.length && !soc.length && !cp && !fac) return;
    var d = document.createElement('div'); d.id = 'ft28'; d.className = 'ft28';
    d.innerHTML = (f.en || f.ur ? '<p>' + bil(f.en, f.ur) + '</p>' : '') + (links.length || fac ? '<p>' + links.map(function (l) { return '<a href="' + esc(l.url) + '">' + bil(l.en, l.ur) + '</a>'; }).join('') + (fac ? '<a href="/faculty/">' + bil('Our Teachers', 'ہمارے اساتذہ') + '</a>' : '') + '</p>' : '') +
      (soc.length ? '<p class="soc28">' + soc.map(function (x) { return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(SOCN[x.name]) + '</a>'; }).join('') + '</p>' : '') +
      (cp ? '<p><b>' + bil('© Govt. National College (Morning), Karachi. Official website: ' + site.replace(/^https?:\/\//, '') + '. Beware of fake websites: admission is FREE.', '© گورنمنٹ نیشنل کالج (مارننگ)، کراچی۔ سرکاری ویب سائٹ: ' + site.replace(/^https?:\/\//, '') + '۔ جعلی ویب سائٹس سے ہوشیار رہیں: داخلہ مفت ہے۔') + '</b></p>' : '');
    var ft = $('footer'); if (ft) ft.appendChild(d); else document.body.appendChild(d);
  }
  function popup(w) {
    var p = w.popup || {};
    if (p.on !== true || !(p.en || p.ur) || !inRange(p.from, p.to) || pv || $('#pop28')) return;
    var k = 'gnckPop28', h = hash(JSON.stringify([p.en, p.ur, p.url]));
    try { if (localStorage.getItem(k) === h) return; } catch (e) {}
    var o = document.createElement('div'); o.id = 'pop28'; o.className = 'pop28';
    o.innerHTML = '<div class="box" role="dialog" aria-modal="true"><button class="x" type="button" aria-label="Close">&times;</button><p style="font-size:1.1rem">' + bil(p.en, p.ur) + '</p>' + (safe(p.url) ? '<p><a class="btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + bil('Open', 'کھولیں') + '</a></p>' : '') + '</div>';
    function close() { try { localStorage.setItem(k, h); } catch (e) {} o.parentNode && o.parentNode.removeChild(o); }
    o.addEventListener('click', function (e) { if (e.target === o || (e.target.closest && e.target.closest('.x'))) close(); });
    document.body.appendChild(o);
  }
  function ticker(w) {
    drop('tk28');
    var t = w.ticker || {}, L = (t.items || []).filter(function (x) { return x && (x.en || x.ur); });
    if (t.on !== true || !L.length) return;
    var d = document.createElement('div'); d.id = 'tk28'; d.className = 'tk28';
    d.innerHTML = '<span>' + L.map(function (x) { return bil(x.en, x.ur); }).join(' &nbsp; &#9670; &nbsp; ') + '</span>';
    afterHeader(d);
  }
  var PG = { 'xi-admission': 'xi', 'xii-enrollment-card': 'xii-enrollment-card', 'xii-admission': 'xii-admission', attendance: 'attendance', 'salary-slips': 'salary-slips', notices: 'notices', gallery: 'gallery', complaint: 'complaint' };
  function pages(w) {
    var pg = w.pages || {};
    Object.keys(PG).forEach(function (path) {
      var off = pg[PG[path]] === false;
      $$('a[href^="/' + path + '/"]').forEach(function (a) { if (!a.closest('.off28')) a.style.display = off ? 'none' : ''; });
      if (off && PAGE === path && !$('#off28')) {
        var m = $('main') || document.body, d = document.createElement('div'); d.id = 'off28'; d.className = 'card off28';
        d.innerHTML = '<h2>' + bil('This page is closed for now.', 'یہ صفحہ فی الحال بند ہے۔') + '</h2><p><a class="btn" href="/">' + bil('Home', 'ہوم') + '</a></p>';
        $$('main > *, body > section, body > .wrap').forEach(function (e) { if (e.id !== 'off28') e.style.display = 'none'; });
        m.insertBefore(d, m.firstChild);
      }
    });
  }
  function seo(w) {
    (w.seo || []).forEach(function (x) {
      if (!x || x.page !== (PAGE === 'xi-admission' ? 'xi' : PAGE)) return;
      if (x.title) document.title = String(x.title).slice(0, 70);
      if (x.desc) { var m = $('meta[name="description"]'); if (m) m.setAttribute('content', String(x.desc).slice(0, 170)); }
    });
  }
  function homeBox(id, cls, html) { drop(id); if (PAGE !== 'home' || !html) return; var s = document.createElement('section'); s.id = id; s.className = cls; s.innerHTML = '<div class="card">' + html + '</div>'; var at = $('#services'); if (at && at.parentNode) at.parentNode.insertBefore(s, at.nextSibling); }
  function countdown(w) {
    var L = (w.count || []).filter(function (c) { return c && c.on !== false && /^\d{4}-\d{2}-\d{2}$/.test(c.date || '') && c.date >= today(); });
    homeBox('cd28', 'cd28', L.length ? '<div class="row">' + L.map(function (c, i) { return '<div class="b"><div>' + bil(c.en, c.ur) + '</div><div class="n" data-cd28="' + esc(c.date) + '">-</div></div>'; }).join('') + '</div>' : '');
    function tick() { $$('[data-cd28]').forEach(function (e) { var ms = new Date(e.getAttribute('data-cd28') + 'T23:59:59+05:00') - new Date(); if (ms < 0) ms = 0; var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); e.textContent = d + T(' days ', ' دن ') + h + T(' h ', ' گھنٹے ') + m + T(' min', ' منٹ'); }); }
    clearInterval(window.__cd28); if (L.length) { tick(); window.__cd28 = setInterval(tick, 30000); }
  }
  function downloads(w) {
    var L = (w.downloads || []).filter(function (d) { return d && d.on !== false && safe(d.url) && (d.en || d.ur); });
    homeBox('dl28', 'dl28', L.length ? '<h2>' + bil('Downloads', 'ڈاؤن لوڈز') + '</h2>' + L.map(function (d) { return '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">&#128196; ' + bil(d.en, d.ur) + '</a>'; }).join('') : '');
  }
  function calendar(w, s) {
    var C = (s && s.cal28) || [];
    homeBox('cal28w', 'cal28w', w.calendar === true && C.length ? '<h2>' + bil('College calendar', 'کالج کیلنڈر') + '</h2>' + C.slice(0, 12).map(function (c) { return '<p><b dir="ltr">' + esc(c.nice) + '</b> &middot; ' + bil(c.en, c.ur) + '</p>'; }).join('') : '');
  }
  function quote(w) {
    var q = w.quotes || {}, L = (q.items || []).filter(function (x) { return x && (x.en || x.ur); });
    if (q.on !== true || !L.length) { drop('q28'); return; }
    var n = Math.floor((Date.now() + 5 * 3600e3) / 864e5) % L.length, x = L[n];
    homeBox('q28', 'q28', '<p style="font-size:1.1rem;margin:0">&ldquo;' + bil(x.en, x.ur) + '&rdquo;</p>' + (x.by ? '<p style="text-align:end;margin:6px 0 0">&mdash; ' + esc(x.by) + '</p>' : ''));
  }
  function a11y(w) {
    drop('a11y28');
    if (w.a11y === false) { root.classList.remove('big28', 'hc28'); return; }
    var st = ''; try { st = localStorage.getItem('gnckA11y') || ''; } catch (e) {}
    root.classList.toggle('big28', st.indexOf('B') >= 0); root.classList.toggle('hc28', st.indexOf('C') >= 0);
    var b = document.createElement('button'); b.id = 'a11y28'; b.className = 'a11y28'; b.type = 'button'; b.title = 'Bigger text / strong colours'; b.textContent = 'A+';
    b.onclick = function () { var s2 = ''; try { s2 = localStorage.getItem('gnckA11y') || ''; } catch (e) {} s2 = s2 === '' ? 'B' : (s2 === 'B' ? 'BC' : ''); try { localStorage.setItem('gnckA11y', s2); } catch (e) {} root.classList.toggle('big28', s2.indexOf('B') >= 0); root.classList.toggle('hc28', s2.indexOf('C') >= 0); };
    document.body.appendChild(b);
  }
  function lang(w) {
    var had = null; try { had = localStorage.getItem('gnckLang'); } catch (e) {}
    if (had || w.lang !== 'UR' || ur()) return;
    var b = $('#langbtn'); if (b) b.click();
  }
  function portalTile(s) {
    drop('pt28');
    if (PAGE !== 'home' || !s.portal) return;
    var qa = $('#services .qa'); if (!qa) return;
    var a = document.createElement('a'); a.id = 'pt28'; a.className = 'card tile qt'; a.href = EXEC + '?action=portal'; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<span class="ic">&#127891;</span><span class="t">' + bil('Student Portal', 'اسٹوڈنٹ پورٹل') + '</span><span class="d">' + bil('Profile, attendance, ID card, slip and notices', 'پروفائل، حاضری، آئی ڈی کارڈ، سلپ اور نوٹس') + '</span>';
    qa.appendChild(a);
  }
  // ---------- video guides ----------
  var VPAGE = { xi: 'xi-admission', home: 'home', xii: 'xii-admission', enroll: 'xii-enrollment-card', attendance: 'attendance', staff: 'staff-app' };
  function ytId(u) { var m = String(u || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : ''; }
  function player(p) {
    if (p.src === 'yt') { var id = ytId(p.url); return id ? '<iframe class="vgv28" src="https://www.youtube-nocookie.com/embed/' + id + '" title="' + esc(p.en) + '" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' : ''; }
    if (p.src === 'drv') return /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/preview$/.test(p.url) ? '<iframe class="vgv28" src="' + esc(p.url) + '" title="' + esc(p.en) + '" loading="lazy" allow="autoplay" allowfullscreen></iframe>' : '';
    return safe(p.url) ? '<video class="vgv28" controls playsinline preload="none"' + (safe(p.poster) ? ' poster="' + esc(p.poster) + '"' : '') + '><source src="' + esc(p.url) + '" type="video/mp4"></video>' : '';
  }
  function partsHtml(g) { return g.parts.map(function (p) { return '<figure style="margin:8px 0">' + player(p) + '<figcaption><b>' + bil(p.en, p.ur) + '</b></figcaption></figure>'; }).join(''); }
  var VG = [];
  function videos(s) {
    VG = (s.vg || []).filter(function (g) { return g && g.on && g.parts && g.parts.length; });
    try { localStorage.setItem('gnckVidSeen', '1'); } catch (e) {}   // the old one-time question is replaced by this one
    (s.vg || []).forEach(function (g) {
      if (VPAGE[g.page] !== PAGE) return;
      var box = $('#video-guide') && g.id === 'xi' ? $('#video-guide') : document.getElementById('vg28-' + g.id);
      if (!g.on) { if (box) box.style.display = 'none'; return; }
      if (!box) { box = document.createElement('section'); box.id = 'vg28-' + g.id; box.className = 'vg card'; box.style.cssText = 'max-width:1180px;margin:18px auto;padding:16px'; var at = $('main') || document.body; at.insertBefore(box, at.firstChild); }
      box.style.display = '';
      box.innerHTML = '<h2>&#9654; ' + bil(g.en, g.ur) + '</h2>' + partsHtml(g);
    });
  }
  function btnOf(a) {
    var h = a.getAttribute('href') || '';
    if (/[?&]action=apply\b/.test(h)) return 'apply';
    if (/xii-enrollment-card|action=enroll|EnrollmentCard|AKfycbw6/i.test(h)) return 'enroll';
    if (/xii-admission/.test(h)) return 'xii';
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.closest('.pop28')) return;
    var k = btnOf(a); if (!k) return;
    var g = VG.filter(function (x) { return x.btn === k && x.ask !== 'OFF'; })[0]; if (!g) return;
    var sk = 'gnckVg_' + g.id; try { if (localStorage.getItem(sk) === g.ver) return; } catch (x) {}
    e.preventDefault(); e.stopImmediatePropagation();
    ask(g, a.href, sk);
  }, true);
  function ask(g, href, sk) {
    drop('vq28');
    var must = g.ask === 'MUST', o = document.createElement('div'); o.id = 'vq28'; o.className = 'pop28';
    o.innerHTML = '<div class="box" role="dialog" aria-modal="true"><button class="x" type="button" aria-label="Close">&times;</button><h3>' + bil('Watch the video guide first', 'پہلے ویڈیو گائیڈ دیکھیں') + '</h3>' +
      '<p>' + bil(must ? 'Please watch the video, then the form opens.' : 'It helps you fill the form without mistakes.', must ? 'براہ کرم ویڈیو دیکھیں، پھر فارم کھلے گا۔' : 'اس سے فارم بغیر غلطی کے بھرنے میں مدد ملے گی۔') + '</p>' + partsHtml(g) +
      '<p style="margin-top:10px"><a class="btn" id="vq28go" href="' + esc(href) + '" target="_blank" rel="noopener"' + (must ? ' style="opacity:.45;pointer-events:none"' : '') + '>' + bil('Go to the form', 'فارم پر جائیں') + '</a>' +
      (must ? ' <a href="' + esc(href) + '" target="_blank" rel="noopener" id="vq28skip" style="display:none;font-size:.9rem">' + bil('Video not playing? Open the form', 'ویڈیو نہیں چل رہی؟ فارم کھولیں') + '</a>' : '') + '</p></div>';
    document.body.appendChild(o);
    var go = o.querySelector('#vq28go');
    function open() { go.style.opacity = ''; go.style.pointerEvents = ''; }
    function done() { try { localStorage.setItem(sk, g.ver); } catch (x) {} setTimeout(function () { o.parentNode && o.parentNode.removeChild(o); }, 300); }
    go.addEventListener('click', done); var sp = o.querySelector('#vq28skip'); if (sp) sp.addEventListener('click', done);
    o.addEventListener('click', function (e) { if (e.target === o || (e.target.closest && e.target.closest('.x'))) o.parentNode.removeChild(o); });
    if (must) {
      $$('video', o).forEach(function (v) { v.addEventListener('playing', function () { setTimeout(open, 15000); }); v.addEventListener('ended', open); v.addEventListener('error', function () { if (sp) sp.style.display = ''; }); });
      if (!$('video', o)) setTimeout(open, 30000);      // YouTube / Drive: no "watched" signal inside the frame
      setTimeout(function () { if (sp) sp.style.display = ''; }, 20000);   // never block the form (net slow / video does not play)
    }
  }
  function faculty(w) {
    if (PAGE !== 'faculty') return;
    var F = w.faculty || {}, box = $('#fac28'); if (!box) return;
    var L = (F.list || []).filter(function (x) { return x && x.name; });
    box.innerHTML = F.on === true && L.length ? L.map(function (x) {
      return '<div class="card" style="display:flex;gap:12px;align-items:center;padding:12px;margin:8px 0">' + (x.ok === true && safe(x.img) ? '<img src="' + esc(x.img) + '" alt="" width="64" height="64" style="border-radius:50%;object-fit:cover" referrerpolicy="no-referrer">' : '<span style="font-size:2rem">&#128100;</span>') +
        '<div><b>' + esc(x.name) + '</b><div>' + esc(x.post || '') + (x.subj ? ' &middot; ' + esc(x.subj) : '') + '</div></div></div>';
    }).join('') : '<p>' + bil('This page is not ready yet.', 'یہ صفحہ ابھی تیار نہیں۔') + '</p>';
  }
  function apply(s) {
    if (!s || !s.ok) return;
    var w = s.web28 && typeof s.web28 === 'object' ? s.web28 : {};
    var steps = [function () { theme(w); }, function () { banner(w); }, function () { order(w); }, function () { blocks(w); }, function () { logo(w); }, function () { menu(w); }, function () { footer(w, s); },
      function () { ticker(w); }, function () { pages(w); }, function () { seo(w); }, function () { countdown(w); }, function () { downloads(w); }, function () { calendar(w, s); }, function () { quote(w); },
      function () { a11y(w); }, function () { lang(w); }, function () { portalTile(s); }, function () { videos(s); }, function () { faculty(w); }, function () { popup(w); }];
    steps.forEach(function (f) { try { f(); } catch (e) {} });
  }
  var cached = null;
  if (!pv) { try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {} }
  if (cached && cached.ok) apply(cached);
  if (window.GNCK_SETTINGS_P) window.GNCK_SETTINGS_P.then(function (s) { if (s) apply(s); });
  else fetch(EXEC + '?action=settings' + (pv ? '&preview=' + pv : ''), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (s) {
    if (!s || !s.ok) return; if (!pv) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} } apply(s);
  }).catch(function () {});
})();
