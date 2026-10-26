/* GNCK notice board (website v1.9, WEB1).
   1) Text notices: Google Sheet tab "Notice" (CHALU, column E = ALL or WEBSITE) via ?action=notice.
   2) PDF notices: /notices/list.json (Claude adds the file + one line).
   Shows a yellow bar under the header on every page, and the full list on /notices/. */
(function () {
  var SHEET = 'https://script.google.com/macros/s/AKfycby5KEXSxmiqXUC0hCk6jRTdc_-XagevQAWsCiEWTKjU1HLqtYm1RLPSQWn6513rPHhTHA/exec?action=notice';
  var LIST = '/notices/list.json';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // https links inside a Sheet notice become a short button (Drive PDF, form, etc.)
  function linkify(text, label) {
    return esc(text).replace(/https:\/\/[^\s<]+/g, function (u) {
      var clean = u.replace(/[).,;:!?]+$/, ''), tail = u.slice(clean.length);
      return '<a class="nlink" href="' + clean + '" target="_blank" rel="noopener nofollow">' + label + '</a>' + tail;
    });
  }
  function today() {
    try { return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function getJson(url) {
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    return fetch(url, ctl ? { signal: ctl.signal, cache: 'no-store' } : { cache: 'no-store' })
      .then(function (r) { clearTimeout(t); return r.ok ? r.json() : null; })
      .catch(function () { clearTimeout(t); return null; });
  }
  function fmtDate(d, ur) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); if (!m) return '';
    var en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var u = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
    return (+m[3]) + ' ' + (ur ? u[+m[2] - 1] : en[+m[2] - 1]) + ' ' + m[1];
  }
  function B(en, ur) { return '<span class="en">' + en + '</span><span class="ur" data-nosnippet>' + ur + '</span>'; }

  var css = '' +
    '.nbar{background:var(--warn-bg,#fff6dc);color:var(--warn-fg,#6b4e00);border-bottom:1px solid rgba(201,162,39,.45)}' +
    '.nbar .nwrap{max-width:1240px;margin:0 auto;padding:8px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px}' +
    '.nbar .ni{display:flex;gap:8px;align-items:baseline;min-width:0;font-size:.95rem;line-height:1.45;flex:1 1 320px}' +
    '.nbar .ni i{font-style:normal;flex:none}' +
    '.nbar .ni .tx{min-width:0;overflow-wrap:anywhere}' +
    '.nbar a{color:inherit;font-weight:700}' +
    '.nbar .nall{flex:none;margin-inline-start:auto;font-size:.9rem;white-space:nowrap}' +
    '.nlink,.nfile{display:inline-block;margin-inline-start:6px;padding:1px 9px;border-radius:999px;background:var(--green,#0b3d24);color:#fff!important;text-decoration:none;font-size:.85em;font-weight:700;white-space:nowrap}' +
    'html[lang="ur"] .nbar .ni{line-height:2}' +
    '.nl{list-style:none;margin:0;padding:0;display:grid;gap:10px}' +
    '.nl li{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid var(--line,#d8e0da);border-radius:12px;background:var(--card,#fff)}' +
    '.nl li .ic{flex:none;font-size:1.3rem;line-height:1.3}' +
    '.nl li .bd{flex:1;min-width:0;overflow-wrap:anywhere}' +
    '.nl li .dt{display:block;font-size:.85rem;color:var(--muted,#56645b)}' +
    '.nl li .new{display:inline-block;margin-inline-start:6px;padding:0 7px;border-radius:6px;background:var(--gold,#c9a227);color:#1b1400;font-size:.75rem;font-weight:700;vertical-align:middle}' +
    '.nempty{color:var(--muted,#56645b)}';

  function run() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var full = document.getElementById('nlist');
    Promise.all([getJson(SHEET), getJson(LIST)]).then(function (res) {
      var sheet = (res[0] && res[0].notices) || [], files = (res[1] && res[1].items) || [], t = today();
      files = files.filter(function (f) { return f && f.file && f.title_en; })
                   .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

      // ---- bar (every page): Sheet notices + PDF notices still "on the bar"
      var bar = [];
      sheet.forEach(function (n) {
        bar.push('<div class="ni"><i aria-hidden="true">&#128227;</i><span class="tx">' +
          B(linkify(n.en, 'Open'), linkify(n.ur, 'کھولیں')) + '</span></div>');
      });
      files.forEach(function (f) {
        if (f.bar_until && f.bar_until >= t) {
          bar.push('<div class="ni"><i aria-hidden="true">&#128196;</i><span class="tx">' +
            B(esc(f.title_en), esc(f.title_ur || f.title_en)) +
            '<a class="nfile" href="' + esc(f.file) + '" target="_blank" rel="noopener">' + B('PDF', 'پی ڈی ایف') + '</a></span></div>');
        }
      });
      var header = document.querySelector('header.top');
      if (bar.length && header && !full) {
        var d = document.createElement('div');
        d.className = 'nbar'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Notices');
        d.innerHTML = '<div class="nwrap">' + bar.join('') +
          '<a class="nall" href="/notices/">' + B('All notices &rarr;', 'تمام نوٹس &larr;') + '</a></div>';
        header.insertAdjacentElement('afterend', d);
      }

      // ---- full list (/notices/ page only)
      if (full) {
        var li = [];
        sheet.forEach(function (n) {
          li.push('<li><span class="ic" aria-hidden="true">&#128227;</span><span class="bd">' +
            B(linkify(n.en, 'Open'), linkify(n.ur, 'کھولیں')) + '</span></li>');
        });
        files.forEach(function (f) {
          var isNew = f.bar_until && f.bar_until >= t;
          li.push('<li><span class="ic" aria-hidden="true">&#128196;</span><span class="bd"><b>' +
            B(esc(f.title_en), esc(f.title_ur || f.title_en)) + '</b>' +
            (isNew ? '<span class="new">' + B('NEW', 'نیا') + '</span>' : '') +
            '<span class="dt">' + B(fmtDate(f.date, false), fmtDate(f.date, true)) + (f.size ? ' · ' + esc(f.size) : '') + '</span>' +
            '<a class="nfile" style="margin:6px 0 0" href="' + esc(f.file) + '" target="_blank" rel="noopener">' + B('Download PDF', 'پی ڈی ایف ڈاؤن لوڈ') + '</a></span></li>');
        });
        full.innerHTML = li.length ? '<ul class="nl">' + li.join('') + '</ul>' :
          '<p class="nempty">' + B('No notice at the moment. Please check again later or follow the WhatsApp Channel.',
            'اس وقت کوئی نوٹس نہیں۔ بعد میں دوبارہ دیکھیں یا واٹس ایپ چینل فالو کریں۔') + '</p>';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
