/* GNCK website v2.9.2: "FINAL admission: bring these to the college" card.
   Shown wherever the page has <div id="bring" data-full="..."></div> (home + /xi-admission/).
   English + Urdu spans (the page CSS shows one language). */
(function () {
  var box = document.getElementById('bring');
  if (!box) return;
  function b(en, ur) { return '<span class="en">' + en + '</span><span class="ur" data-nosnippet>' + ur + '</span>'; }
  var O = b('ORIGINAL + COPY', 'اصل + کاپی'), C = b('COPY', 'کاپی');
  var MAT = ['Matric marksheet', 'میٹرک کی مارکس شیٹ', O],
      NIN = ['9th marksheet', 'نویں جماعت کی مارکس شیٹ', O],
      SLP = ['Provisional admission slip (SECCAP)', 'عارضی داخلہ سلپ (سیکیپ)', O],
      MIG = ['Migration certificate', 'مائیگریشن سرٹیفکیٹ', C],
      PER = ['Permission letter', 'اجازت نامہ', C];
  var LIST = {
    k: [MAT, NIN, SLP],
    o: [MAT, NIN, SLP, MIG, PER],
    l: [['O-Level result', 'او لیول کا رزلٹ', O], ['IBCC Equivalence certificate', 'آئی بی سی سی ایکوئیولنس سرٹیفکیٹ', O], SLP, MIG, PER]
  };
  var css = '' +
    '.bring{background:var(--card);border:2px solid var(--gold);border-radius:18px;padding:18px 18px 14px;margin:16px 0;box-shadow:0 6px 18px rgba(11,61,36,.08)}' +
    '.bring .bh{display:flex;gap:12px;align-items:flex-start}' +
    '.bring .bi{flex:0 0 46px;height:46px;border-radius:12px;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center}' +
    '.bring .bi svg{width:26px;height:26px}' +
    '.bring h2{margin:0;font-family:var(--f-display);font-size:1.3rem;line-height:1.3;color:var(--fg)}' +
    '.bring .sub{margin:4px 0 0;color:var(--muted);font-size:.95rem}' +
    '.bring .bp{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 10px}' +
    '.bring .bp button{font:inherit;font-size:.95rem;font-weight:600;border:1.5px solid var(--line);background:var(--paper);color:var(--fg);border-radius:999px;padding:6px 14px;cursor:pointer;min-height:40px}' +
    '.bring .bp button[aria-selected="true"]{background:var(--green);border-color:var(--green);color:#fff}' +
    '.bring ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}' +
    '.bring li{display:flex;align-items:center;gap:10px;justify-content:space-between;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:10px 12px}' +
    '.bring li b{font-weight:600}' +
    '.bring .n{flex:0 0 26px;height:26px;border-radius:50%;background:var(--chip);color:var(--green);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:.85rem}' +
    '.bring .t{flex:1}' +
    '.bring .tag{flex:0 0 auto;font-size:.75rem;font-weight:700;letter-spacing:.03em;border-radius:6px;padding:3px 8px;white-space:nowrap}' +
    '.bring .tag.o{background:var(--green);color:#fff}.bring .tag.c{background:var(--gold-soft,#f3dc8f);color:#3d2f00}' +
    '.bring .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 4px;font-size:.9rem}' +
    '@media (max-width:620px){.bring .steps{grid-template-columns:1fr}}' +
    '.bring .steps .s{display:flex;align-items:center;gap:8px;background:var(--chip);color:var(--fg);border-radius:10px;padding:6px 10px}' +
    '.bring .steps .s i{font-style:normal;flex:0 0 22px;height:22px;border-radius:50%;background:var(--green);color:#fff;font-weight:700;font-size:.8rem;display:flex;align-items:center;justify-content:center}' +
    '.bring .steps .s.now{outline:2px solid var(--gold)}' +
    '.bring .foot{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-top:10px;font-size:.9rem}' +
    '.bring .foot a{color:var(--accent);font-weight:600}' +
    'html[lang="ur"] .bring h2{font-family:var(--f-urdu);font-size:1.15rem;line-height:2}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var full = box.getAttribute('data-full') || '#documents';
  box.classList.add('bring');
  box.setAttribute('aria-labelledby', 'bring-h');
  box.innerHTML =
    '<div class="bh"><div class="bi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1z"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg></div>' +
    '<div><h2 id="bring-h">' + b('FINAL admission: bring these to the college', 'فائنل داخلہ: یہ دستاویزات کالج ساتھ لائیں') + '</h2>' +
    '<p class="sub">' + b('After you fill the online form, come to the college with these. The staff checks them and your admission becomes FINAL.', 'آن لائن فارم بھرنے کے بعد یہ دستاویزات لے کر کالج آئیں۔ عملہ انہیں چیک کرے گا اور آپ کا داخلہ فائنل ہو جائے گا۔') + '</p></div></div>' +
    '<div class="bp" role="tablist" aria-label="Board">' +
    '<button type="button" role="tab" data-b="k" aria-selected="true">' + b('Karachi Board', 'کراچی بورڈ') + '</button>' +
    '<button type="button" role="tab" data-b="o" aria-selected="false">' + b('Other Board', 'دوسرا بورڈ') + '</button>' +
    '<button type="button" role="tab" data-b="l" aria-selected="false">' + b('O-Level', 'او لیول') + '</button></div>' +
    '<ol id="bring-l"></ol>' +
    '<div class="steps" aria-label="Steps"><div class="s"><i>1</i><div>' + b('Fill the online form', 'آن لائن فارم بھریں') + '</div></div>' +
    '<div class="s now"><i>2</i><div>' + b('Bring these documents', 'یہ دستاویزات لائیں') + '</div></div>' +
    '<div class="s"><i>3</i><div>' + b('Get your slip + ID card (Check Status)', 'سلپ + آئی ڈی کارڈ لیں (چیک اسٹیٹس)') + '</div></div></div>' +
    '<div class="foot"><span>' + b('Bring the documents yourself. Admission is free: never pay anyone.', 'دستاویزات خود لائیں۔ داخلہ مفت ہے: کسی کو پیسے نہ دیں۔') + '</span>' +
    '<a href="' + full + '">' + b('All document lists &rsaquo;', 'تمام دستاویزات کی فہرست') + '</a></div>';
  function draw(k) {
    var ol = document.getElementById('bring-l');
    ol.innerHTML = LIST[k].map(function (x, i) {
      var orig = x[2] === O;
      return '<li><span class="n">' + (i + 1) + '</span><b class="t">' + b(x[0], x[1]) + '</b><span class="tag ' + (orig ? 'o' : 'c') + '">' + x[2] + '</span></li>';
    }).join('');
  }
  box.querySelectorAll('.bp button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      box.querySelectorAll('.bp button').forEach(function (o) { o.setAttribute('aria-selected', o === btn ? 'true' : 'false'); });
      draw(btn.getAttribute('data-b'));
    });
  });
  draw('k');
})();
