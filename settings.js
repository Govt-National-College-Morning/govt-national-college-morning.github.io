/* GNCK website v2.1 - settings from the Control Panel (XI Code v21.4, WEB13).
   Reads <exec>?action=settings (public JSON: no passwords, no keys) and puts the
   admin's choices on the page: admission status + dates, buttons, sections,
   cut-off, FAQ, principal, contacts, links, office timings, email, maintenance.
   No internet / Google slow = the page simply keeps what is written in it. */
(function () {
  var EXEC = 'https://script.google.com/macros/s/AKfycby5KEXSxmiqXUC0hCk6jRTdc_-XagevQAWsCiEWTKjU1HLqtYm1RLPSQWn6513rPHhTHA/exec';
  var KEY = 'gnckSet1';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function hide(el, off) { if (el) el.style.display = off ? 'none' : ''; }
  function txt(el, v) { if (el && v) el.textContent = v; }
  function safeUrl(u) { return /^https:\/\/[^\s"'<>]+$/.test(String(u || '')) ? u : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bil(en, ur) { return '<span class="en">' + esc(en) + '</span><span class="ur" data-nosnippet>' + esc(ur || en) + '</span>'; }

  // which link is which button
  function btnKind(a) {
    var soon = a.getAttribute('data-soon'), h = a.getAttribute('href') || '';
    if (soon === 'idcard') return 'idcard';
    if (soon === 'attendance') return 'att';
    if (/[?&]action=apply\b/.test(h)) return 'apply';
    if (h === EXEC || h === EXEC + '/') return 'status';
    if (h === '/gallery/') return 'gallery';
    if (h === '#enrollment') return 'enroll';
    if (h === '#staff') return 'salary';
    return '';
  }
  var SEC = { free: '.free', tiles: '#services', principal: '#leader', process: '#process', docs: '#documents', faculties: '#faculties',
    cutoff: '#cutoff', enroll: '#enrollment', faq: '#faq', staff: '#staff', contact: '#contact' };
  var DEF_WA = 'https://whatsapp.com/channel/0029VbDTnoP7j6g4Ll3sgT3F', DEF_MAP = 'https://maps.app.goo.gl/5RZTDBZNfoEu52ge6?g_st=ac';
  var DEF_WEEK = 'Monday to Thursday 8:00 AM to 1:30 PM', DEF_FRI = 'Friday 8:00 AM to 11:30 AM';

  function apply(s) {
    if (!s || !s.ok) return;
    var G = window.GNCK;
    // 1) status + dates
    if (G && s.form) G.setStatus(s.status, s.form.start, s.form.end);
    // closed faculties (form open for the others)
    var fc = $('#facclosed');
    var names = { PE: ['Pre-Engineering', 'پری انجینئرنگ'], PM: ['Pre-Medical', 'پری میڈیکل'], CS: ['Computer Science', 'کمپیوٹر سائنس'], CM: ['Commerce', 'کامرس'], HU: ['Humanities', 'ہیومینٹیز'] };
    var off = Object.keys((s.form && s.form.fac) || {}).filter(function (k) { return s.form.fac[k] === false && names[k]; });
    if (off.length && s.status !== 'CLOSED') {
      if (!fc) { fc = document.createElement('div'); fc.id = 'facclosed'; fc.style.cssText = 'margin-top:10px;font-size:.85rem;background:#fff3cd;color:#6b5200;border-radius:8px;padding:6px 10px'; var st = $('aside.status'); if (st) st.appendChild(fc); }
      fc.innerHTML = bil('Form closed for: ' + off.map(function (k) { return names[k][0]; }).join(', '), 'ان فیکلٹیز کا فارم بند: ' + off.map(function (k) { return names[k][1]; }).join('، '));
    } else if (fc) fc.remove();
    // 2) maintenance banner
    var mb = $('#maintbar');
    if (s.maint && s.maint.on) {
      if (!mb) { mb = document.createElement('div'); mb.id = 'maintbar'; mb.setAttribute('role', 'status'); mb.style.cssText = 'background:#b71c1c;color:#fff;text-align:center;padding:10px 14px;font-weight:600'; document.body.insertBefore(mb, document.body.firstChild); }
      mb.innerHTML = '&#128679; ' + bil(s.maint.en, s.maint.ur);
    } else if (mb) mb.remove();
    // 3) buttons
    var btn = s.btn || {};
    $$('.hero .cta a, .qa a').forEach(function (a) {
      var k = btnKind(a);
      if (!k) return;
      var on = btn[k] !== false;
      if (k === 'status' || k === 'idcard') on = on && !(s.services && s.services[k] === false);
      if (k === 'att') on = on && !(s.services && s.services.parents === false);
      if (k === 'apply') on = on && s.status !== 'CLOSED' && !(s.maint && s.maint.on);
      hide(a, !on);
    });
    // 4) sections
    Object.keys(SEC).forEach(function (k) { if (s.sec && s.sec[k] !== undefined) $$(SEC[k]).forEach(function (el) { hide(el, s.sec[k] === false); }); });
    // 5) texts
    if (s.head && (s.head.en || s.head.ur)) { var h1 = $('.hero h1') || $('h1'); if (h1) { txt($('.en', h1), s.head.en); txt($('.ur', h1), s.head.ur || s.head.en); } }
    if (s.free && (s.free.en || s.free.ur)) { var fp = $('.free p'); if (fp) { txt($(':scope > .en', fp), s.free.en ? s.free.en + ' ' : ''); txt($(':scope > .ur', fp), s.free.ur ? s.free.ur + ' ' : ''); } }
    if (s.email) $$('.mail').forEach(function (m) { m.textContent = s.email; });
    if (s.xii) {
      var xe = $('#xiinote');
      if (!xe) { var es = $('#enrollment .sh'); if (es) { xe = document.createElement('p'); xe.id = 'xiinote'; xe.style.cssText = 'margin:6px 0 0;font-weight:600;color:#0b3d24'; es.appendChild(xe); } }
      if (xe) xe.innerHTML = bil('XII admission: ' + s.xii, 'بارہویں داخلہ: ' + s.xii);
    }
    // 6) cut-off + FAQ
    if (G && s.cutoff) G.setCut(s.cutoff);
    if (G && s.faq && s.faq.length) G.setFaq(s.faq);
    // 7) links
    var wa = safeUrl(s.links && s.links.wa), mp = safeUrl(s.links && s.links.maps);
    if (wa && wa !== DEF_WA) $$('a[href*="whatsapp.com/channel/"]').forEach(function (a) { a.href = wa; });
    if (mp && mp !== DEF_MAP) $$('a[href*="maps.app.goo.gl"]').forEach(function (a) { a.href = mp; });
    // 8) office timings (contact card: 1st and 2nd paragraph)
    var ci = $('#contact .card.ci');
    if (ci && s.office) {
      var ps = $$('p', ci);
      if (s.office.week && s.office.week !== DEF_WEEK && ps[0]) ps[0].innerHTML = bil(s.office.week, s.office.week);
      if (s.office.fri && s.office.fri !== DEF_FRI && ps[1]) ps[1].innerHTML = bil(s.office.fri, s.office.fri);
    }
    // 9) principal
    var pr = s.principal || {};
    if (pr.en) {
      var lead = $('#leader .lead');
      if (lead) {
        var b = $('.lb b', lead); if (b) b.innerHTML = bil(pr.en, pr.ur);
        var im = $('img', lead); if (im) { if (safeUrl(pr.photo)) { im.src = pr.photo; im.referrerPolicy = 'no-referrer'; } im.alt = pr.en + ', Principal, Govt. National College (Morning), Karachi'; }
        var pm = $('#prmsg', lead);
        if (pr.msgEn || pr.msgUr) { if (!pm) { pm = document.createElement('p'); pm.id = 'prmsg'; pm.style.cssText = 'margin:10px 0 0;font-style:italic'; var lb = $('.lb', lead); if (lb) lb.appendChild(pm); } if (pm) pm.innerHTML = bil(pr.msgEn || pr.msgUr, pr.msgUr || pr.msgEn); }
        else if (pm) pm.remove();
      }
      $$('.prin b').forEach(function (x, i) { x.textContent = i % 2 ? (pr.ur || pr.en) : pr.en; });
      $$('footer .wrap > div > span').forEach(function (x) {
        if (/^Principal: /.test(x.textContent)) x.textContent = 'Principal: ' + pr.en;
        else if (/^پرنسپل: /.test(x.textContent)) x.textContent = 'پرنسپل: ' + (pr.ur || pr.en);
      });
    }
    // 10) contacts (Phone card) + developer photo / WhatsApp
    var cs = Array.isArray(s.contacts) ? s.contacts : null, card = null;
    $$('#contact .card.ci').forEach(function (c) { if ($('.person', c)) card = c; });
    if (cs && card) {
      $$('.person', card).forEach(function (p) { p.remove(); });
      cs.forEach(function (c, i) {
        var d = document.createElement('div'); d.className = 'person';
        var ph = c.phone ? '<span class="phone" id="sp' + i + '">' + esc(c.phone) + '</span>' : '';
        d.innerHTML = '<div style="display:flex;gap:10px;align-items:center">' + (safeUrl(c.photo) ? '<img src="' + esc(c.photo) + '" alt="" width="44" height="44" referrerpolicy="no-referrer" style="border-radius:50%;object-fit:cover;flex:none">' : '') +
          '<div><b>' + bil(c.en, c.ur) + '</b>' + (c.role ? '<small style="display:block;color:var(--muted)">' + esc(c.role) + '</small>' : '') + ph + '</div></div>' +
          (c.phone ? '<button class="copy" type="button" data-sc="sp' + i + '">' + bil('Copy', 'کاپی') + '</button>' : '');
        card.appendChild(d);
      });
      var dev = cs.filter(function (c) { return c.dev; })[0];
      $$('.smpanel .help .wa').forEach(function (a) { hide(a, !(dev && dev.phone)); });
      if (dev && safeUrl(dev.photo)) $$('.smpanel .help img, footer .credit .dev img').forEach(function (im) { im.src = dev.photo; im.referrerPolicy = 'no-referrer'; });
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-sc]');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-sc')), old = b.innerHTML, G = window.GNCK;
    function done(m) { b.textContent = m; setTimeout(function () { b.innerHTML = old; }, 1500); }
    try { navigator.clipboard.writeText(el.textContent).then(function () { done(G ? G.T('Copied', 'کاپی ہو گیا') : 'Copied'); }); } catch (x) {}
  });

  var last = null;
  try { last = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (last && last.ok) { try { apply(last); } catch (e) {} }
  if (window.GNCK) GNCK.onRender = function () { if (last) try { apply(last); } catch (e) {} };
  var ctl = ('AbortController' in window) ? new AbortController() : null;
  var tm = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
  fetch(EXEC + '?action=settings', { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (r) { return r.json(); }).then(function (s) {
    clearTimeout(tm);
    if (!s || !s.ok) return;
    last = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    apply(s);
  }).catch(function () {});
})();
