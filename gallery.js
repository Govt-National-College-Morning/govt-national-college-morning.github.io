/* GNCK Events & Gallery (website v2.0, WEB11).
   Reads the album list from the GNCK Gallery Google web app (?action=gallery)
   and shows albums, photos and YouTube videos. Photos stay in Google Drive. */
(function () {
  'use strict';
  // The Gallery web app link (Deploy > Web app > /exec). Empty = "coming soon".
  var GALLERY_URL = '';

  var box = document.getElementById('gal');
  if (!box) return;
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_UR = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
  var CAT_UR = { Events: 'تقریبات', Programs: 'پروگرام', Sports: 'کھیل', Festivals: 'جشن' };
  var DATA = null, FILTER = 'all', YEAR = 'all', LB = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function B(en, ur) { return '<span class="en">' + en + '</span><span class="ur" data-nosnippet>' + ur + '</span>'; }
  function okId(s) { return /^[A-Za-z0-9_-]{10,80}$/.test(String(s || '')); }
  function thumb(id, w) { return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + w; }
  function ytThumb(id) { return 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg'; }
  function dl(id) { return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id); }
  function fmtDate(d, long) {
    var m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return B(esc(d), esc(d));
    var mi = +m[2] - 1, day = +m[3];
    return B(day + ' ' + (long ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mi] : MON[mi]) + ' ' + m[1], day + ' ' + MON_UR[mi] + ' ' + m[1]);
  }
  function counts(a) {
    var p = a.photos.length, v = a.videos.length;
    var en = p + (p === 1 ? ' photo' : ' photos') + (v ? ' · ' + v + (v === 1 ? ' video' : ' videos') : '');
    var ur = p + ' تصویریں' + (v ? ' · ' + v + ' ویڈیوز' : '');
    return B(en, ur);
  }
  function isNew(a) {
    var t = Date.parse(String(a.updated || a.date).replace(' ', 'T'));
    return isFinite(t) && Date.now() - t < 14 * 864e5;
  }
  function message(en, ur) { box.innerHTML = '<div class="card gmsg"><p>' + B(en, ur) + '</p></div>'; }

  function load() {
    if (!GALLERY_URL) { message('The college gallery is opening soon. Photos of events, programs, sports and festivals will be here.', 'کالج گیلری جلد کھلے گی۔ تقریبات، پروگرام، کھیل اور جشن کی تصویریں یہاں ہوں گی۔'); return; }
    message('Loading albums…', 'البم لوڈ ہو رہے ہیں…');
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    fetch(GALLERY_URL + '?action=gallery', ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.json(); }).then(function (j) {
      clearTimeout(timer);
      if (!j || !Array.isArray(j.albums)) throw new Error('bad');
      DATA = j.albums.filter(function (a) { return a && okId(a.id) && Array.isArray(a.photos) && Array.isArray(a.videos); }).map(function (a) {
        a.photos = a.photos.filter(okId); a.videos = a.videos.filter(function (v) { return /^[A-Za-z0-9_-]{11}$/.test(v); }); return a;
      });
      route();
    }).catch(function () {
      clearTimeout(timer);
      message('The gallery could not be loaded. Please check the internet and try again.', 'گیلری نہیں کھل سکی۔ انٹرنیٹ دیکھ کر دوبارہ کوشش کریں۔');
    });
  }

  function route() {
    if (!DATA) return;
    var m = location.hash.match(/album=([^&]+)/), id = m ? decodeURIComponent(m[1]) : '';
    var a = id && DATA.filter(function (x) { return x.id === id; })[0];
    if (a) showAlbum(a); else showList();
  }

  function showList() {
    closeLb();
    if (!DATA.length) { message('No albums yet. The first photos will be here soon.', 'ابھی کوئی البم نہیں۔ پہلی تصویریں جلد یہاں ہوں گی۔'); return; }
    var cats = ['Events', 'Programs', 'Sports', 'Festivals'], years = {};
    DATA.forEach(function (a) { years[a.date.slice(0, 4)] = 1; });
    var ys = Object.keys(years).sort().reverse();
    var h = '<div class="chips" role="group" aria-label="Filter">';
    h += '<button type="button" class="chip' + (FILTER === 'all' ? ' on' : '') + '" data-f="all">' + B('All', 'سب') + '</button>';
    cats.forEach(function (c) {
      var n = DATA.filter(function (a) { return a.cat === c; }).length;
      if (n) h += '<button type="button" class="chip' + (FILTER === c ? ' on' : '') + '" data-f="' + c + '">' + B(c, CAT_UR[c]) + '</button>';
    });
    if (ys.length > 1) ys.forEach(function (y) { h += '<button type="button" class="chip yr' + (YEAR === y ? ' on' : '') + '" data-y="' + y + '">' + y + '</button>'; });
    h += '</div><div class="albums">';
    var list = DATA.filter(function (a) { return (FILTER === 'all' || a.cat === FILTER) && (YEAR === 'all' || a.date.slice(0, 4) === YEAR); });
    list.forEach(function (a) {
      var cover = a.cover && okId(a.cover) ? thumb(a.cover, 600) : (a.photos[0] ? thumb(a.photos[0], 600) : (a.videos[0] ? ytThumb(a.videos[0]) : ''));
      h += '<a class="album" href="#album=' + encodeURIComponent(a.id) + '"><span class="cover">' + (cover ? '<img src="' + cover + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') +
        '<span class="tag">' + B(esc(a.cat), esc(CAT_UR[a.cat] || a.cat)) + '</span>' + (isNew(a) ? '<span class="new">' + B('NEW', 'نیا') + '</span>' : '') + '</span>' +
        '<span class="meta"><b>' + esc(a.title) + '</b><span class="sub">' + fmtDate(a.date) + ' · ' + counts(a) + '</span></span></a>';
    });
    if (!list.length) h += '<p class="gmsg">' + B('No album in this group yet.', 'اس گروپ میں ابھی کوئی البم نہیں۔') + '</p>';
    h += '</div>';
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('.chip'), function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-f')) FILTER = b.getAttribute('data-f');
        if (b.hasAttribute('data-y')) YEAR = YEAR === b.getAttribute('data-y') ? 'all' : b.getAttribute('data-y');
        showList();
      });
    });
    document.title = 'GNCK Events & Gallery | Govt. National College Karachi';
  }

  function items(a) {
    var out = [];
    a.videos.forEach(function (v) { out.push({ t: 'v', id: v }); });
    a.photos.forEach(function (p) { out.push({ t: 'p', id: p }); });
    return out;
  }

  function showAlbum(a) {
    var it = items(a);
    var h = '<p class="back"><a href="#">' + B('‹ All albums', '‹ تمام البم') + '</a></p><div class="card albumv"><span class="tag2">' + B(esc(a.cat), esc(CAT_UR[a.cat] || a.cat)) + '</span><h2>' + esc(a.title) + '</h2>' +
      '<p class="sub">' + fmtDate(a.date, true) + ' · ' + counts(a) + '</p><p class="hint">' + B('Tap a photo to see it big.', 'بڑا دیکھنے کے لیے تصویر پر ٹیپ کریں۔') + '</p><div class="pgrid">';
    it.forEach(function (x, i) {
      h += '<button type="button" class="pi" data-i="' + i + '" aria-label="' + (x.t === 'v' ? 'Video' : 'Photo') + ' ' + (i + 1) + '"><img src="' + (x.t === 'v' ? ytThumb(x.id) : thumb(x.id, 400)) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' + (x.t === 'v' ? '<span class="play" aria-hidden="true"><i></i></span>' : '') + '</button>';
    });
    h += '</div></div>';
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('.pi'), function (b) { b.addEventListener('click', function () { openLb(a, it, +b.getAttribute('data-i')); }); });
    document.title = a.title + ' | GNCK Events & Gallery';
    window.scrollTo(0, 0);
  }

  function openLb(a, it, i) {
    closeLb();
    LB = document.createElement('div');
    LB.className = 'lbx'; LB.setAttribute('role', 'dialog'); LB.setAttribute('aria-modal', 'true');
    document.body.appendChild(LB); document.body.style.overflow = 'hidden';
    var cur = i, sx = null;
    function draw() {
      var x = it[cur];
      var media = x.t === 'v'
        ? '<div class="vwrap"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(x.id) + '?rel=0" title="Video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
        : '<img src="' + thumb(x.id, 1600) + '" alt="" referrerpolicy="no-referrer">';
      LB.innerHTML = '<button type="button" class="x" aria-label="Close">✕</button>' + media +
        '<p class="cap">' + esc(a.title) + ' · ' + (cur + 1) + ' / ' + it.length + '</p><div class="bar">' +
        '<button type="button" class="pv" aria-label="Previous">‹</button>' +
        (x.t === 'p' ? '<a class="dlb" href="' + dl(x.id) + '" target="_blank" rel="noopener">' + B('Download', 'ڈاؤن لوڈ') + '</a>' : '<a class="dlb" href="https://youtu.be/' + encodeURIComponent(x.id) + '" target="_blank" rel="noopener">YouTube</a>') +
        '<button type="button" class="nx" aria-label="Next">›</button></div>';
      LB.querySelector('.x').onclick = closeLb;
      LB.querySelector('.pv').onclick = function () { cur = (cur - 1 + it.length) % it.length; draw(); };
      LB.querySelector('.nx').onclick = function () { cur = (cur + 1) % it.length; draw(); };
    }
    LB.addEventListener('click', function (e) { if (e.target === LB) closeLb(); });
    LB.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    LB.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { cur = (cur + (dx < 0 ? 1 : -1) + it.length) % it.length; draw(); }
    });
    LB._key = function (e) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') { cur = (cur + 1) % it.length; draw(); }
      else if (e.key === 'ArrowLeft') { cur = (cur - 1 + it.length) % it.length; draw(); }
    };
    document.addEventListener('keydown', LB._key);
    draw();
  }

  function closeLb() {
    if (!LB) return;
    document.removeEventListener('keydown', LB._key);
    LB.remove(); LB = null; document.body.style.overflow = '';
  }

  window.addEventListener('hashchange', route);
  load();
})();
