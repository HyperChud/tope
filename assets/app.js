/* Topé — UI. Vanilla JS, no network requests. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var NATIVE = typeof window.Android !== 'undefined';
  var C = window.Calc;

  // ---------------------------------------------------------------- icons
  var ICONS = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    cal: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z',
    chart: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    left: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    right: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    del: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
    scale: 'M12 2a2.5 2.5 0 0 0-2.45 2H5.6L2 12.5C2 14.43 3.57 16 5.5 16S9 14.43 9 12.5L6.4 6.5h4.1V20H6v2h12v-2h-4.5V6.5h4.1L15 12.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5L18.4 4h-3.95A2.5 2.5 0 0 0 12 2zM5.5 8.9l1.9 4.1H3.6zm13 0 1.9 4.1h-3.8z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    down: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    up: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    eye: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2z',
    phone: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z',
    info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    trash: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z'
  };
  // ---- substance name (cosmetic only)
  function subList() { return window.SUBS[LANG] || window.SUBS.fr; }
  function subAll(lang) { var o = [], S = window.SUBS[lang]; Object.keys(S).forEach(function (g0) { S[g0].forEach(function (x) { o.push(x); }); }); return o; }
  var subSurprise = {};   // picked once per launch and per language
  function subDefault() { return L('shit', 'hash'); }
  function deForm(n) { n = n.trim(); var m = n.match(/^(la |le |les |l’|l')/i); var base = m ? n.slice(m[0].length) : n; return /^[aeiouyéèêàâîïôûh]/i.test(base) ? 'd’' + base : 'de ' + base; }
  // n: the name · de: the French "de …" form, the plain name in English
  function subName() {
    var s = data && data.settings || {}, x;
    if (s.sub === 'surprise') {
      if (!subSurprise[LANG]) { var all = subAll(LANG); subSurprise[LANG] = all[Math.floor(Math.random() * all.length)]; }
      x = subSurprise[LANG];
    } else if (s.sub === 'custom' && s.subCustom) return { n: s.subCustom, de: L(deForm(s.subCustom), s.subCustom) };
    else {
      var key = s.sub || subDefault();
      x = subAll(LANG).filter(function (y) { return y[0] === key; })[0] || subAll(LANG === 'en' ? 'fr' : 'en').filter(function (y) { return y[0] === key; })[0];
      if (!x) x = subAll(LANG).filter(function (y) { return y[0] === subDefault(); })[0];
    }
    return { n: x[0], de: LANG === 'en' ? x[0] : (x[1] || deForm(x[0])) };
  }
  function ic(n) { return '<svg class="i" viewBox="0 0 24 24"><path d="' + ICONS[n] + '"/></svg>'; }
  document.querySelectorAll('[data-icon]').forEach(function (el) { el.innerHTML = ic(el.dataset.icon); });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function parseNum(v) { if (v == null) return NaN; v = String(v).trim().replace(',', '.').replace(/\s/g, ''); return v === '' ? NaN : Number(v); }

  // ---------------------------------------------------------------- formats
  // ---- language: L('texte fr', 'english text')
  var LANG = 'fr', LOC = 'fr-FR';
  function L(fr, en) { return LANG === 'en' ? en : fr; }
  var NF1, NF2, NF0, NFg2, DF, DFs, DFm, DFms;
  function setLocale() {
    LOC = LANG === 'en' ? 'en-GB' : 'fr-FR';
    NF1 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 1 });
    NF2 = new Intl.NumberFormat(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    NF0 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 0 });
    NFg2 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 2 });
    DF = new Intl.DateTimeFormat(LOC, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
    DFs = new Intl.DateTimeFormat(LOC, { day: 'numeric', month: 'short', timeZone: 'UTC' });
    DFm = new Intl.DateTimeFormat(LOC, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    DFms = new Intl.DateTimeFormat(LOC, { month: 'short', timeZone: 'UTC' });
  }
  setLocale();
  function g(x) { return x == null ? '—' : (x >= 100 ? NF0 : NF1).format(x); }
  function g2(x) { return x == null ? '—' : NFg2.format(x); }
  function eur(x) { return x == null ? '—' : (Math.abs(x) >= 1000 ? NF0 : NF2).format(x); }
  function eur0(x) { return x == null ? '—' : (Math.abs(x) >= 100 ? NF0 : NF2).format(x); }
  function dl(n) { return DF.format(new Date(n * 864e5)); }
  function ds(n) { return DFs.format(new Date(n * 864e5)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function rel(n) {
    var d = C.todayNum() - n;
    if (d === 0) return L('aujourd’hui', 'today'); if (d === 1) return L('hier', 'yesterday'); if (d === -1) return L('demain', 'tomorrow');
    if (d > 1 && d < 7) return L('il y a ' + d + ' j', d + ' days ago');
    return dl(n);
  }

  // ---------------------------------------------------------------- data
  var dyn = null;
  try { if (NATIVE && Android.getColors) { var cc = Android.getColors(); if (cc) dyn = JSON.parse(cc); } } catch (e) { dyn = null; }

  var data;
  function defaults() {
    return { v: 1, achats: [], pesees: [], settings: { theme: 'auto', color: dyn ? 'dynamic' : 'vert', hue: 160, mat: 'plein', bg: 'gradient', amoled: false, calm: false, widgetHide: false, rem: { on: false, days: 2, time: '20:00' } } };
  }
  function load() {
    var raw = '';
    try { raw = NATIVE ? Android.load() : (localStorage.getItem('tope') || ''); } catch (e) { raw = ''; }
    try { data = raw ? JSON.parse(raw) : defaults(); } catch (e) { data = defaults(); }
    dirty = true;
    if (!data || typeof data !== 'object') data = defaults();
    data.achats = Array.isArray(data.achats) ? data.achats : [];
    data.pesees = Array.isArray(data.pesees) ? data.pesees : [];
    data.settings = Object.assign(defaults().settings, data.settings || {});
    // language: picked on the welcome screen; defaults to the phone's, and to French for an existing log
    if (data.settings.lang !== 'fr' && data.settings.lang !== 'en')
      data.settings.lang = raw ? 'fr' : (/^fr/i.test(navigator.language || 'fr') ? 'fr' : 'en');
    setLang(data.settings.lang, true);
    if (data.settings.color === 'dynamic' && !dyn) data.settings.color = 'vert';
    if (data.settings.amoled) { if (data.settings.theme !== 'light') data.settings.theme = 'amoled'; data.settings.amoled = false; }
  }
  function setLang(l, quiet) {
    LANG = l === 'en' ? 'en' : 'fr'; setLocale();
    document.documentElement.lang = LANG;
    var nl = { home: L('Accueil', 'Home'), cal: L('Calendrier', 'Calendar'), graph: L('Graphiques', 'Charts'), set: L('Réglages', 'Settings') };
    document.querySelectorAll('#nav button').forEach(function (b) { var t = b.querySelector('.nt'); if (t) t.textContent = nl[b.dataset.tab]; });
    try { if (NATIVE && Android.setLang) Android.setLang(LANG); } catch (e) { }
    if (!quiet) { lastWidget = ''; counters = {}; }
  }
  function save() {
    var s = JSON.stringify(data);
    dirty = true;
    try { if (NATIVE) Android.save(s); else localStorage.setItem('tope', s); } catch (e) { snack(L('Oups, sauvegarde impossible', 'Oops, couldn’t save')); }
  }
  function nget(fn, def) { try { return NATIVE && Android[fn] ? Android[fn]() : def; } catch (e) { return def; } }

  // ---------------------------------------------------------------- theme
  var HUES = { vert: 140, violet: 272, orange: 28, bleu: 212, rose: 335 };
  function hsl(h, s, l) { return 'hsl(' + ((h % 360) + 360) % 360 + ' ' + s + '% ' + l + '%)'; }
  function hslPal(h, dark) {
    return dark ? {
      primary: hsl(h, 55, 72), 'on-primary': hsl(h, 70, 14), 'primary-container': hsl(h, 42, 25), 'on-primary-container': hsl(h, 70, 88),
      'secondary-container': hsl(h + 10, 16, 27), 'on-secondary-container': hsl(h, 30, 88),
      'tertiary-container': hsl(h + 60, 32, 25), 'on-tertiary-container': hsl(h + 60, 60, 88),
      surface: hsl(h, 10, 7), 'surface-low': hsl(h, 9, 10), 'surface-c': hsl(h, 9, 12), 'surface-high': hsl(h, 8, 16), 'surface-highest': hsl(h, 7, 20),
      'on-surface': hsl(h, 10, 90), 'on-surface-variant': hsl(h, 8, 76), outline: hsl(h, 6, 57), 'outline-variant': hsl(h, 7, 30), error: '#ffb4ab',
      blob1: hsl(h, 55, 32), blob2: hsl(h + 70, 50, 30), blob3: hsl(h - 50, 50, 27)
    } : {
      primary: hsl(h, 48, 31), 'on-primary': '#ffffff', 'primary-container': hsl(h, 62, 84), 'on-primary-container': hsl(h, 80, 10),
      'secondary-container': hsl(h + 10, 28, 87), 'on-secondary-container': hsl(h, 40, 12),
      'tertiary-container': hsl(h + 60, 52, 86), 'on-tertiary-container': hsl(h + 60, 80, 10),
      surface: hsl(h, 30, 97), 'surface-low': hsl(h, 22, 95), 'surface-c': hsl(h, 18, 92), 'surface-high': hsl(h, 14, 89), 'surface-highest': hsl(h, 12, 87),
      'on-surface': hsl(h, 10, 10), 'on-surface-variant': hsl(h, 8, 27), outline: hsl(h, 5, 45), 'outline-variant': hsl(h, 10, 78), error: '#ba1a1a',
      blob1: hsl(h, 62, 70), blob2: hsl(h + 70, 62, 74), blob3: hsl(h - 50, 60, 72)
    };
  }
  function dynPal(dark) {
    var d = function (k) { return dyn[k]; };
    return dark ? {
      primary: d('a1_200'), 'on-primary': d('a1_800'), 'primary-container': d('a1_700'), 'on-primary-container': d('a1_100'),
      'secondary-container': d('a2_700'), 'on-secondary-container': d('a2_100'),
      'tertiary-container': d('a3_700'), 'on-tertiary-container': d('a3_100'),
      surface: d('n1_900'), 'surface-low': d('n1_900'), 'surface-c': d('n1_800'), 'surface-high': d('n2_800'), 'surface-highest': d('n1_700'),
      'on-surface': d('n1_100'), 'on-surface-variant': d('n2_200'), outline: d('n2_400'), 'outline-variant': d('n2_700'), error: '#ffb4ab',
      blob1: d('a1_700'), blob2: d('a3_800'), blob3: d('a2_700')
    } : {
      primary: d('a1_600'), 'on-primary': d('a1_0'), 'primary-container': d('a1_100'), 'on-primary-container': d('a1_900'),
      'secondary-container': d('a2_100'), 'on-secondary-container': d('a2_900'),
      'tertiary-container': d('a3_100'), 'on-tertiary-container': d('a3_900'),
      surface: d('n1_10'), 'surface-low': d('n1_50'), 'surface-c': d('n2_50'), 'surface-high': d('n1_100'), 'surface-highest': d('n2_100'),
      'on-surface': d('n1_900'), 'on-surface-variant': d('n2_700'), outline: d('n2_500'), 'outline-variant': d('n2_200'), error: '#ba1a1a',
      blob1: d('a1_300'), blob2: d('a3_200'), blob3: d('a2_300')
    };
  }
  function isDark() {
    var t = data.settings.theme;
    if (t === 'dark' || t === 'amoled') return true;
    if (t === 'light') return false;
    if (NATIVE && Android.isNight) { try { return !!Android.isNight(); } catch (e) { } }
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  var bgUrl = null;
  function curHue() { var s = data.settings; return s.color === 'custom' ? (+s.hue || 0) : (HUES[s.color] || 140); }
  function applyTheme() {
    document.documentElement.className = '';
    var s = data.settings, dark = isDark(), root = document.documentElement;
    var pal = (s.color === 'dynamic' && dyn) ? dynPal(dark) : hslPal(curHue(), dark);
    var amoled = s.theme === 'amoled';
    if (amoled) {
      ['blob1', 'blob2', 'blob3'].forEach(function (k) { pal[k] = 'color-mix(in srgb,' + pal[k] + ' 62%,#000)'; });
      pal.surface = '#000000'; pal['surface-low'] = '#000000'; pal['surface-c'] = '#0e0f0e';
      pal['surface-high'] = '#191a19'; pal['surface-highest'] = '#232423';
    }
    var st = root.style;
    Object.keys(pal).forEach(function (k) { st.setProperty('--' + k, pal[k]); });
    st.setProperty('--hl', dark ? 'rgba(255,255,255,.30)' : 'rgba(255,255,255,.85)');
    st.setProperty('--hl2', dark ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.38)');
    st.setProperty('--sh', dark ? 'rgba(0,0,0,.38)' : 'rgba(0,0,0,.10)');
    st.setProperty('--glass-a', dark ? '34%' : '38%');
    st.setProperty('--mica-tint', amoled ? '.74' : dark ? '.66' : '.56');
    st.setProperty('--img-scrim', dark ? '.48' : '.36');
    var mat = s.mat || 'plein', bg = s.bg || 'gradient';
    if (bg === 'image' && !bgUrl) bgUrl = loadBg();
    if (bg === 'image' && !bgUrl) bg = 'gradient';
    st.setProperty('--bgimg', bgUrl ? 'url("' + bgUrl + '")' : 'none');
    ['mat-mica', 'mat-glass', 'bg-aurora', 'bg-image', 'bg-shader', 'calm'].forEach(function (c) { root.classList.remove(c); });
    var shType = mat !== 'plein' && bg.indexOf('sh-') === 0 ? bg.slice(3) : null;
    if (mat !== 'plein') { root.classList.add('mat-' + mat); if (shType) root.classList.add('bg-shader'); else if (bg !== 'gradient') root.classList.add('bg-' + bg); }
    if (s.calm) root.classList.add('calm');
    root.classList.toggle('no-pat', s.pattern === false);
    root.classList.toggle('dk', dark);
    st.setProperty('--mica-lum', dark ? '.55' : '.5');
    applyAdv();
    setTimeout(applyLens, 60);
    // shader background (after the theme colors are computed)
    if (shType) setTimeout(function () { if (!shStart(shType)) { root.classList.remove('bg-shader'); shStop(); } }, 0); else shStop();
    st.setProperty('--pat-a', ((dark ? (mat === 'plein' ? .13 : .16) : (mat === 'plein' ? .1 : .13)) * adv('patA') / 100).toFixed(3));
    if (mat !== 'plein') pal['surface-low'] = pal.surface;
    if (NATIVE && Android.setBars) {
      try {
        var probe = document.createElement('div'); probe.style.color = pal['surface-low']; document.body.appendChild(probe);
        var top = getComputedStyle(probe).color; probe.style.color = pal.surface; var bg = getComputedStyle(probe).color; probe.remove();
        Android.setBars(rgbHex(bg), rgbHex(top), !dark);
      } catch (e) { }
    }
  }
  // ---------------------------------------------------------------- Knobs (advanced customization)
  // g: group (all / glass / mica) · d: default (number or function(dark, amoled))
  var POTS = [
    { g: 'all', k: 'patA', l: ['Motif · présence', 'Pattern · presence'], min: 0, max: 200, u: ' %', d: 100 },
    { g: 'all', k: 'patS', l: ['Motif · taille', 'Pattern · size'], min: 50, max: 200, u: ' %', d: 100 },
    { g: 'all', k: 'patV', l: ['Motif · vitesse', 'Pattern · speed'], min: 0, max: 300, u: ' %', d: 100 },
    { g: 'all', k: 'shV', l: ['Fond animé · vitesse', 'Animated background · speed'], min: 0, max: 300, u: ' %', d: 100 },
    { g: 'glass', k: 'gBlur', l: ['Flou', 'Blur'], min: 0, max: 40, u: ' px', d: 10 },
    { g: 'glass', k: 'gA', l: ['Opacité des panneaux', 'Panel opacity'], min: 0, max: 90, u: ' %', d: function (dk) { return dk ? 34 : 38; } },
    { g: 'glass', k: 'gSat', l: ['Saturation', 'Saturation'], min: 100, max: 250, u: ' %', d: 170 },
    { g: 'glass', k: 'gRim', l: ['Liseré', 'Rim light'], min: 0, max: 200, u: ' %', d: 100 },
    { g: 'glass', k: 'gSheen', l: ['Reflet', 'Sheen'], min: 0, max: 250, u: ' %', d: 100 },
    { g: 'glass', k: 'gLens', l: ['Effet loupe', 'Lens effect'], min: 0, max: 100, u: '', d: 46 },
    { g: 'glass', k: 'gPrism', l: ['Prisme', 'Prism'], min: 0, max: 100, u: ' %', d: 30 },
    { g: 'mica', k: 'mBlur', l: ['Flou du fond', 'Background blur'], min: 16, max: 120, u: ' px', d: 64 },
    { g: 'mica', k: 'mTint', l: ['Teinte du fond', 'Background tint'], min: 0, max: 95, u: ' %', d: function (dk, am) { return am ? 74 : dk ? 66 : 56; } },
    { g: 'mica', k: 'mA', l: ['Opacité des panneaux', 'Panel opacity'], min: 10, max: 100, u: ' %', d: 58 },
    { g: 'mica', k: 'mCBlur', l: ['Flou des panneaux', 'Panel blur'], min: 0, max: 40, u: ' px', d: 14 },
    { g: 'mica', k: 'mGrain', l: ['Grain', 'Grain'], min: 0, max: 100, u: ' %', d: 40 }
  ];
  var POT = {}; POTS.forEach(function (p) { POT[p.k] = p; });
  function advDef(k) { var p = POT[k], d = p.d; return typeof d === 'function' ? d(isDark(), data.settings.theme === 'amoled') : d; }
  function adv(k) {
    var p = POT[k], v = data.settings.adv && data.settings.adv[k];
    v = (typeof v === 'number' && isFinite(v)) ? v : advDef(k);
    return Math.max(p.min, Math.min(p.max, v));
  }
  function clampPct(x) { return Math.max(0, Math.min(100, Math.round(x))) + '%'; }
  function applyAdv() {
    var st = document.documentElement.style, dark = isDark();
    // pattern
    var ps = Math.round(260 * adv('patS') / 100), pv = adv('patV');
    st.setProperty('--pat-s', ps + 'px');
    st.setProperty('--pat-dur', pv > 0 ? (80 * (ps / 260) / (pv / 100)).toFixed(1) + 's' : '0s');
    document.documentElement.classList.toggle('pat-still', pv === 0);
    // glass
    var ga = adv('gA');
    st.setProperty('--glass-a', clampPct(ga)); st.setProperty('--glass-a2', clampPct(ga + 8));
    st.setProperty('--glass-a3', clampPct(ga + 5)); st.setProperty('--glass-nav', clampPct(ga + 22));
    st.setProperty('--glass-sheet', clampPct(ga + 30)); st.setProperty('--glass-dlg', clampPct(ga + 42));
    st.setProperty('--g-blur', adv('gBlur') + 'px'); st.setProperty('--g-sat', (adv('gSat') / 100).toFixed(2));
    var rim = adv('gRim') / 100;
    st.setProperty('--rim1', Math.min(1, (dark ? .45 : .75) * rim).toFixed(2));
    st.setProperty('--rim2', Math.min(1, (dark ? .14 : .28) * rim).toFixed(2));
    st.setProperty('--rim-w', (rim > 0 ? 1.3 : 0) + 'px');
    st.setProperty('--g-sheen', Math.min(1, .22 * adv('gSheen') / 100).toFixed(3));
    // mica
    var mb = adv('mBlur'), ma = adv('mA');
    st.setProperty('--mica-blur', mb + 'px'); st.setProperty('--mica-sc', (1 + mb * 0.0042).toFixed(3));
    st.setProperty('--mica-tint', (adv('mTint') / 100).toFixed(2));
    st.setProperty('--mica-a', clampPct(ma)); st.setProperty('--mica-a2', clampPct(ma + 14));
    st.setProperty('--mica-a3', clampPct(ma + 12)); st.setProperty('--mica-nav', clampPct(ma + 26));
    st.setProperty('--mica-sheet', clampPct(ma + 16));
    st.setProperty('--mica-cblur', adv('mCBlur') + 'px');
    st.setProperty('--mica-grain', (adv('mGrain') / 100).toFixed(2));
  }

  // ---------------------------------------------------------------- Animated backgrounds (WebGL shaders)
  // Rendered at low resolution (≈ 1/3 of the screen) then upscaled: it's blurred behind the glass anyway,
  // so it's nearly free for the GPU. Colors come from the theme. Paused while the app is in the background.
  var SHADERS = {
    silk: 'vec3 run(vec2 p,vec2 uv){float t=T*.05;vec2 q=p;' +
      'for(int i=1;i<5;i++){float f=float(i);q.x+=.32/f*sin(f*2.1*q.y+t*1.3+f*1.7);q.y+=.32/f*cos(f*1.7*q.x+t*1.1+f*.9);}' +
      'float v=.5+.5*sin(q.x*2.2+q.y*1.4);return mix(BG,pal(v*.75+t*.15),.42+.4*v);}',
    plasma: 'vec3 run(vec2 p,vec2 uv){float t=T*.11;' +
      'float v=sin(p.x*2.6+t)+sin(p.y*3.1-t*1.1)+sin((p.x+p.y)*2.2+t*.7)+sin(length(p*2.8)-t*1.3);' +
      'return mix(BG,pal(v*.12+.5+t*.04),.62);}',
    lava: 'vec3 run(vec2 p,vec2 uv){float t=T*.14,f=0.;float ar=R.x/R.y;' +
      'for(int i=0;i<6;i++){float k=float(i);vec2 c=vec2(sin(t*(.5+k*.13)+k*2.1)*.5*ar,sin(t*(.37+k*.11)+k*1.3)*.62);' +
      'float r=.16+.05*sin(k*1.7);vec2 d=p-c;f+=r*r/(dot(d,d)+.0004);}' +
      'float m=smoothstep(.85,1.25,f);vec3 blob=mix(C1,C2,uv.y);' +
      'return mix(mix(BG,C3,smoothstep(.25,.9,f)*.22),blob,m*.82);}',
    nebula: 'vec3 run(vec2 p,vec2 uv){float t=T*.02;vec2 q=p*1.5;' +
      'float a=fbm(q+vec2(t,-t*.7));float b=fbm(q*1.6+a*1.7+vec2(-t*.5,t));' +
      'vec3 c=mix(BG,C1,smoothstep(.32,.85,b)*.85);c=mix(c,C2,smoothstep(.5,.95,a*b*1.7)*.8);c=mix(c,C3,smoothstep(.62,1.,b)*.5);' +
      'vec2 g=floor(gl_FragCoord.xy/2.5);float s=h(g);c+=step(.992,s)*(.45+.45*sin(T*1.6+s*60.))*.7;return c;}',
    waves: 'vec3 run(vec2 p,vec2 uv){float t=T*.22;vec3 c=BG;' +
      'for(int i=0;i<5;i++){float k=float(i);float y=.42-k*.2+.07*sin(p.x*(1.4+k*.35)+t*(1.+k*.18)+k)+.03*sin(p.x*3.7-t*1.4+k*2.);' +
      'float a=smoothstep(y+.006,y-.006,p.y);c=mix(c,mix(BG,pal(k*.19+.08),.34+k*.1),a);}return c;}'
  };
  var SH_HEAD = 'precision mediump float;uniform vec2 R;uniform float T;uniform vec3 C1,C2,C3,BG;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}' +
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}' +
    'vec3 pal(float t){t=fract(t);return t<.3333?mix(C1,C2,t*3.):t<.6666?mix(C2,C3,(t-.3333)*3.):mix(C3,C1,(t-.6666)*3.);}';
  var SH_MAIN = 'void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec3 c=run(p,uv);' +
    'c+=(h(gl_FragCoord.xy+fract(T))-.5)/255.;gl_FragColor=vec4(c,1.);}';
  var sh = { gl: null, cv: null, progs: {}, type: null, raf: 0, start: performance.now(), u: null, cols: null };
  function cssRgb(v) {
    var d = document.createElement('i'); d.style.color = v; d.style.display = 'none'; document.body.appendChild(d);
    var c = getComputedStyle(d).color; d.remove();
    var m = c.match(/[\d.]+/g) || [0, 0, 0], k = /^color\(/.test(c) ? 1 : 255;
    if (/^color\(/.test(c)) m = c.replace(/^color\(\s*\w+/, '').match(/[\d.]+/g) || [0, 0, 0];
    return [m[0] / k, m[1] / k, m[2] / k];
  }
  function shCompile(type) {
    var gl = sh.gl;
    if (sh.progs[type]) return sh.progs[type];
    function mk(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, SH_HEAD + SHADERS[type] + SH_MAIN));
    gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    var u = {}; ['R', 'T', 'C1', 'C2', 'C3', 'BG'].forEach(function (n0) { u[n0] = gl.getUniformLocation(pr, n0); });
    return (sh.progs[type] = { p: pr, u: u });
  }
  function shSize() {
    if (!sh.cv) return;
    var q = 0.34 * Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(64, Math.round(innerWidth * q)), hh = Math.max(64, Math.round(innerHeight * q));
    if (sh.cv.width !== w || sh.cv.height !== hh) { sh.cv.width = w; sh.cv.height = hh; }
  }
  function shFrame(now) {
    sh.raf = 0;
    if (!sh.type || !sh.gl) return;
    var gl = sh.gl, P = shCompile(sh.type), sp = adv('shV') / 100;
    sh.t = (sh.t || 0) + Math.min(0.05, ((now || performance.now()) - (sh.last || now || 0)) / 1000) * sp;
    sh.last = now || performance.now();
    gl.viewport(0, 0, sh.cv.width, sh.cv.height);
    gl.useProgram(P.p);
    gl.uniform2f(P.u.R, sh.cv.width, sh.cv.height); gl.uniform1f(P.u.T, 20 + sh.t);
    var c = sh.cols; gl.uniform3fv(P.u.C1, c[0]); gl.uniform3fv(P.u.C2, c[1]); gl.uniform3fv(P.u.C3, c[2]); gl.uniform3fv(P.u.BG, c[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (sp > 0 && !calm() && !document.hidden) sh.raf = requestAnimationFrame(shFrame);
  }
  function shStart(type) {
    if (!sh.cv) {
      sh.cv = document.createElement('canvas'); sh.cv.id = 'shd';
      $('#bd').insertBefore(sh.cv, $('#bd').firstChild);
      sh.gl = sh.cv.getContext('webgl', { antialias: false, depth: false, stencil: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!sh.gl) return false;
      var gl = sh.gl, b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      sh.cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); sh.progs = {}; });
      sh.cv.addEventListener('webglcontextrestored', function () { sh.gl = null; sh.cv.remove(); sh.cv = null; if (sh.type) shStart(sh.type); });
    }
    if (!sh.gl) return false;
    try { shCompile(type); } catch (e) { return false; }
    sh.type = type;
    sh.cols = ['--blob1', '--blob2', '--blob3', '--surface'].map(function (v) { return cssRgb('var(' + v + ')'); });
    shSize();
    sh.last = performance.now();
    if (!sh.raf) sh.raf = requestAnimationFrame(shFrame);
    return true;
  }
  function shStop() { sh.type = null; if (sh.raf) cancelAnimationFrame(sh.raf); sh.raf = 0; }
  function shWake() { if (sh.type && !sh.raf && !document.hidden) { sh.last = performance.now(); sh.raf = requestAnimationFrame(shFrame); } }
  document.addEventListener('visibilitychange', shWake);
  window.addEventListener('resize', function () { shSize(); shWake(); });
  var SH_LIST = function () { return [['sh-silk', L('Soie', 'Silk')], ['sh-plasma', 'Plasma'], ['sh-lava', L('Lave', 'Lava')], ['sh-nebula', L('Nébuleuse', 'Nebula')], ['sh-waves', L('Vagues', 'Waves')]]; };

  // ---------------------------------------------------------------- Liquid glass: lens
  // For the main card and the bottom bar, we generate a displacement map at their exact size:
  // nothing moves in the center; on a band near the edges the background is pulled inward (lens effect),
  // with three slightly different strengths for R, G, B (slight iridescence on the edges).
  var lensCache = {};
  function lensMap(w, h, rad, bezel) {
    var k = w + 'x' + h + 'x' + rad, sc = 0.5;
    if (lensCache[k]) return lensCache[k];
    var W = Math.max(8, Math.round(w * sc)), Hh = Math.max(8, Math.round(h * sc)), R = rad * sc, B = bezel * sc;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
    var cx = cv.getContext('2d'), img = cx.createImageData(W, Hh), d = img.data;
    for (var y = 0; y < Hh; y++) for (var x = 0; x < W; x++) {
      // signed distance to the edge of a rounded rectangle (negative inside)
      var qx = Math.abs(x + .5 - W / 2) - (W / 2 - R), qy = Math.abs(y + .5 - Hh / 2) - (Hh / 2 - R);
      var ox = Math.max(qx, 0), oy = Math.max(qy, 0), dist = Math.min(Math.max(qx, qy), 0) + Math.sqrt(ox * ox + oy * oy) - R;
      var depth = -dist, i = (y * W + x) * 4, dx = 0, dy = 0;
      if (depth > 0 && depth < B) {
        var t = 1 - depth / B, m = t * t;                      // stronger right next to the edge
        var nx = x + .5 - W / 2, ny = y + .5 - Hh / 2;          // outward = approximate normal
        if (qx > 0 && qy > 0) { var l = Math.sqrt(ox * ox + oy * oy) || 1; nx = Math.sign(nx) * ox / l; ny = Math.sign(ny) * oy / l; }
        else if (qx > qy) { nx = Math.sign(nx); ny = 0; } else { nx = 0; ny = Math.sign(ny); }
        dx = -nx * m; dy = -ny * m;                            // sample the background further inside
      }
      d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    cx.putImageData(img, 0, 0);
    return (lensCache[k] = cv.toDataURL());
  }
  function lensFilter(id, el, scale) {
    var b = el.getBoundingClientRect(); if (b.width < 20 || b.height < 20) return;
    var rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 20;
    var w = Math.round(b.width), h = Math.round(b.height), href = lensMap(w, h, Math.min(rad, h / 2, w / 2), Math.min(26, h / 3));
    var svg = $('#lens-defs');
    if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.id = 'lens-defs'; svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute'; document.body.appendChild(svg); }
    var f = svg.querySelector('#' + id);
    var sig = w + 'x' + h + '@' + scale + '/' + adv('gPrism');
    if (f && f.getAttribute('data-sig') === sig) { el.style.setProperty('--lens', 'url(#' + id + ')'); el.classList.add('lens'); return; }
    var ch = function (s, mx, res) {
      return '<feDisplacementMap in="SourceGraphic" in2="m" scale="' + s + '" xChannelSelector="R" yChannelSelector="G" result="d' + res + '"/>' +
        '<feColorMatrix in="d' + res + '" type="matrix" values="' + mx + '" result="' + res + '"/>';
    };
    var pr = adv('gPrism') / 100;
    var html = '<filter id="' + id + '" data-sig="' + sig + '" filterUnits="userSpaceOnUse" x="0" y="0" width="' + w + '" height="' + h + '" color-interpolation-filters="sRGB">' +
      '<feImage href="' + href + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="m"/>' +
      ch(scale, '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0', 'r') + ch(scale * (1 - pr / 6), '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0', 'g') + ch(scale * (1 - pr / 3), '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0', 'b') +
      '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/></filter>';
    if (f) f.outerHTML = html; else svg.insertAdjacentHTML('beforeend', html);
    el.style.setProperty('--lens', 'url(#' + id + ')'); el.classList.add('lens');
  }
  // All the main panels: the main card, tiles, rows, cards, big buttons,
  // the bottom bar, sheets and dialogs. Panels of the same size share the same filter
  // (4 tiles = 1 filter, all rows = 1 filter), and a panel nested in another one gets none.
  var LENS_SEL = '#main .hero, #main .tile, #main .row, #main .card, #main .btn.big.tonal, #nav, .sheet.on, .dialog.on';
  function applyLens() {
    var sc = document.documentElement.classList.contains('mat-glass') ? adv('gLens') : 0;
    if (sc <= 0) {
      document.querySelectorAll('.lens').forEach(function (el) { el.classList.remove('lens'); el.style.removeProperty('--lens'); });
      return;
    }
    var els = document.querySelectorAll(LENS_SEL), used = 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.parentElement && el.parentElement.closest('.card,.hero,.tile,.sheet,.dialog')) continue;   // already under a glass panel
      var b = el.getBoundingClientRect();
      if (b.width < 40 || b.height < 30) continue;
      // strength scales with size: a thin row bends less than a big card
      var k = Math.max(0.35, Math.min(1, Math.min(b.width, b.height) / 170));
      var s0 = el.id === 'nav' ? sc * 34 / 46 : sc * k;
      lensFilter('lens-' + Math.round(b.width) + 'x' + Math.round(b.height) + '-' + Math.round(s0), el, Math.round(s0));
      used++;
    }
    // cleanup: keep at most 40 filters in memory
    var defs = document.querySelectorAll('#lens-defs filter');
    if (defs.length > 40) {
      var live = {}; document.querySelectorAll('.lens').forEach(function (el) { var m = (el.style.getPropertyValue('--lens') || '').match(/#([^)]+)\)/); if (m) live[m[1]] = 1; });
      defs.forEach(function (f) { if (!live[f.id]) f.remove(); });
    }
  }
  window.addEventListener('resize', function () { clearTimeout(applyLens.t); applyLens.t = setTimeout(applyLens, 150); });

  // ---------------------------------------------------------------- Liquid glass: light follows the phone
  // Exponential smoothing of the sensor + 2° dead zone, so hand tremor doesn't make the highlights flicker.
  var tilt = { b: 45, g: 0, sb: null, sg: 0, raf: 0, la: 135, lx: 25, ly: 0 };
  window.addEventListener('deviceorientation', function (e) {
    if (e.beta == null || !document.documentElement.classList.contains('mat-glass') || data.settings.calm || data.settings.gyro !== true) return;   // off by default
    if (tilt.sb == null) { tilt.sb = e.beta; tilt.sg = e.gamma; }
    tilt.sb += (e.beta - tilt.sb) * 0.12; tilt.sg += (e.gamma - tilt.sg) * 0.12;
    if (tilt.raf) return;
    tilt.raf = requestAnimationFrame(function () {
      tilt.raf = 0;
      var gx = Math.max(-1, Math.min(1, tilt.sg / 45)), gy = Math.max(-1, Math.min(1, (tilt.sb - 45) / 45));
      var la = 135 + gx * 50 - gy * 25;
      if (Math.abs(la - tilt.la) < 2) return;                 // dead zone
      tilt.la = la; tilt.lx = 25 - gx * 30; tilt.ly = -gy * 30;
      var st = document.documentElement.style;
      st.setProperty('--la', la.toFixed(1) + 'deg'); st.setProperty('--lx', tilt.lx.toFixed(1) + '%'); st.setProperty('--ly', tilt.ly.toFixed(1) + '%');
    });
  });

  function loadBg() {
    try { return NATIVE ? (Android.getBackground() || null) : (localStorage.getItem('tope_bg') || null); } catch (e) { return null; }
  }
  function rgbHex(c) {
    var m = c.match(/\d+(\.\d+)?/g); if (!m) return '#000000';
    return '#' + m.slice(0, 3).map(function (x) { return ('0' + Math.round(+x).toString(16)).slice(-2); }).join('');
  }

  // ---------------------------------------------------------------- small texts
  var Q = {
    fr: {
      home: ['Bien roulé, bien noté.', 'Ici, tout est pesé.', 'Gramme après gramme.', 'Pas de fumée sans chiffres.', 'Le compte est bon.', 'Le carnet qui a du flair.', 'Topé, pesé, rangé.'],
      achat: ['Topé ! C’est dans le carnet.', 'Ajouté au panier. Enfin, au carnet.', 'Bonne pioche.', 'Ravitaillement : check ✅', 'Le plein est fait ⛽'],
      pesee: ['Pesé, emballé.', 'La balance a parlé ⚖️', 'Au gramme près.', 'Pesée faite, stats affûtées.'],
      edit: ['Retouché, rien à signaler.', 'Corrigé, c’est mieux comme ça.'],
      del: ['Effacé. Rien vu, rien su.', 'Hop, parti en fumée.'],
      cal: ['Le mois, case par case.', 'Plus c’est foncé, plus ça a fumé.', 'Les jours passent, les cases se remplissent.'],
      graph: ['Les courbes ne mentent pas.', 'Des chiffres qui montent au cerveau.', 'La tendance, sans le blabla.'],
      set: ['Réglé comme du papier à rouler.', 'Fais comme chez toi.', 'Aux petits oignons.'],
      help: ['Des pros, gratuits, au bout du fil.', 'Un numéro, c’est déjà un début.'],
      adv: ['Tourne les potards, pas la tête.', 'Réglé au poil près.', 'Ta déco, tes règles.', 'Fait main, fait maison.']
    },
    en: {
      home: ['Rolled up, written down.', 'Every gram counts.', 'Gram by gram.', 'No smoke without numbers.', 'Weighed and filed.', 'The logbook with a nose for it.', 'Scored, weighed, sorted.'],
      achat: ['Scored! It’s in the book.', 'Added to cart. Well, to the book.', 'Good pick.', 'Restock: check ✅', 'Tank’s full ⛽'],
      pesee: ['Weighed and wrapped.', 'The scale has spoken ⚖️', 'Down to the gram.', 'Weighed in, stats sharpened.'],
      edit: ['Touched up, all good.', 'Fixed. Better like that.'],
      del: ['Gone. Saw nothing.', 'Poof, up in smoke.'],
      cal: ['The month, square by square.', 'Darker square, smokier day.', 'Days go by, squares fill up.'],
      graph: ['Curves don’t lie.', 'Numbers that go to your head.', 'The trend, no fluff.'],
      set: ['Tuned like rolling paper.', 'Make yourself at home.', 'Just the way you like it.'],
      help: ['Free pros, one call away.', 'A number is already a start.'],
      adv: ['Turn the knobs, not your head.', 'Tuned to the hair.', 'Your look, your rules.', 'Handmade, homemade.']
    }
  };
  function q(k) { return (Q[LANG] || Q.fr)[k]; }
  var snackT;
  function snack(t) {
    var s = $('#snack'); s.classList.add('on');
    s.textContent = t;
    clearTimeout(snackT); snackT = setTimeout(function () { s.classList.remove('on'); }, 2600);
  }

  // ---------------------------------------------------------------- state
  var state = { tab: 'home', showAll: false, range: '3m', calY: 0, calM: 0, calSel: null };
  var res, dirty = true, lastCompute = 0;
  function recompute() {
    var now = Date.now();
    if (!dirty && res && now - lastCompute < 60000) return;
    res = C.compute(data); dirty = false; lastCompute = now; res._heat = null;
  }
  (function () { var t = new Date(); state.calY = t.getFullYear(); state.calM = t.getMonth(); })();

  function title(t) { return { home: 'Topé', cal: L('Calendrier', 'Calendar'), graph: L('Graphiques', 'Charts'), set: L('Réglages', 'Settings'), adv: L('Potards', 'Knobs'), help: L('Se faire aider', 'Get help') }[t]; }
  function go(tab) {
    state.tab = tab;
    var nt = (tab === 'adv' || tab === 'help') ? 'set' : tab;
    document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === nt); });
    $('#title').innerHTML = title(tab).split('').map(function (ch, i) {
      return ch === ' ' ? '<span class="sp"></span>' : '<span class="ch" style="--i:' + i + '">' + esc(ch) + '</span>';
    }).join('');
    $('#title').setAttribute('aria-label', title(tab));
    $('#quip').textContent = pick(q(tab));
    $('#main').scrollTop = 0;
    render(true);
    requestAnimationFrame(measureTop);
  }
  // anim: true = entering the screen (everything animates) · 'charts' = charts only · 'cal' = the month
  function render(anim) {
    recompute();
    var html = state.tab === 'home' ? vHome() : state.tab === 'cal' ? vCal() : state.tab === 'graph' ? vGraph() : state.tab === 'adv' ? vAdv() : state.tab === 'help' ? vHelp() : vSet();
    var m = $('#main');
    var cls = anim === true ? 'screen enter' : anim === 'charts' ? 'charts' : anim === 'cal' ? 'cal-anim' : '';
    m.innerHTML = '<div class="' + cls + '">' + html + '</div>';
    if (anim === true) {
      var kids = m.firstChild.children;
      for (var i = 0; i < kids.length && i < 14; i++) kids[i].style.setProperty('--i', i);
    }
    if (state.bump) { var hero = m.querySelector('.hero'); if (hero) hero.classList.add('bump'); state.bump = false; }
    requestAnimationFrame(function () {
      var gg = document.querySelector('.gauge>div'); if (gg) gg.style.setProperty('--w', (gg.dataset.w / 100).toFixed(3));
      countUp(anim === true);
    });
    clearTimeout(render.wt); render.wt = setTimeout(pushWidget, 400);
    applyLens();
    fadeLoose();
  }

  // ---------------------------------------------------------------- counters
  var counters = {};
  var FMT = { g: function (x) { return g(x); }, g2: function (x) { return g2(x); }, eur0: function (x) { return eur0(x); }, eur: function (x) { return eur(x); } };
  function calm() { return data.settings.calm || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function num(k, val, fmt) {
    if (val == null || isNaN(val)) return '—';
    var prev = counters[k];
    return '<span data-n="' + val + '" data-k="' + k + '" data-f="' + fmt + '">' + FMT[fmt](prev != null ? prev : val) + '</span>';
  }
  function countUp(fromZero) {
    var els = document.querySelectorAll('[data-n]'), quiet = calm();
    Array.prototype.forEach.call(els, function (el) {
      var k = el.dataset.k, to = +el.dataset.n, f = FMT[el.dataset.f], from = counters[k];
      if (from == null || fromZero) from = fromZero && !quiet ? 0 : to;
      counters[k] = to;
      if (quiet || Math.abs(to - from) < 1e-9) { el.textContent = f(to); return; }
      var t0 = performance.now(), dur = 750;
      (function step(t) {
        var p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
        el.textContent = f(from + (to - from) * e);
        if (p < 1 && el.isConnected) requestAnimationFrame(step);
      })(t0);
    });
  }

  // ---------------------------------------------------------------- home
  var BLOB = '<svg class="blob" viewBox="0 0 200 200"><path d="M100 0c13 0 18 15 30 20s27-1 35 9 2 24 6 36 18 22 14 35-19 13-27 23-7 26-20 30-23-7-38-7-25 11-38 7-12-20-20-30-23-10-27-23 10-23 14-35-2-28 6-36 23-4 35-9S87 0 100 0z"/></svg>';
  function lastRefill() {
    var a = data.achats.slice().sort(function (x, y) { return x.date < y.date ? 1 : x.date > y.date ? -1 : 0; })[0];
    return a ? (Number(a.g) || 0) + (Number(a.reste) || 0) : 0;
  }
  function vHome() {
    var r = res, h = '', de = esc(subName().de);
    if (r.empty) {
      return '<div class="hero">' + BLOB + '<div class="lbl">' + heroLbl(de) + '</div><div class="big">0<small>' + GJ() + '</small></div>' +
        '<div class="sub">' + L('Rien dans le carnet pour l’instant.', 'Nothing in the book yet.') + '</div></div>' + actions() +
        '<div class="empty">' + emptyArt() + '<b>' + L('Premier achat ?', 'First buy?') + '</b>' + L('Appuie sur « J’ai topé » : grammes, prix, c’est tout.<br>L’appli calcule ta conso toute seule entre deux achats.',
        'Tap “Scored”: grams, price, that’s it.<br>The app works out your use on its own between two buys.') + '</div>';
    }
    // main card: average use, its trend and the last 30 days
    var perDay = (r.avg30 != null && r.currentPpg != null) ? r.avg30 * r.currentPpg : null;
    var lines = [];
    if (r.notEnough) lines.push(L('Ta moyenne s’affiche dès le 2ᵉ achat ou une pesée.', 'Your average shows up after your 2nd buy or a weigh-in.'));
    else {
      if (perDay != null) lines.push(L('Soit environ ' + eur(perDay) + ' € par jour.', 'That’s about ' + eur(perDay) + ' € a day.'));
      var tr = trend(r);
      if (tr != null) lines.push(Math.abs(tr) < 3 ? L('→ Stable par rapport aux 30 jours d’avant.', '→ Steady compared with the 30 days before.') : (tr < 0 ? '↘ ' : '↗ ') + NF0.format(Math.abs(tr)) + L(' % par rapport aux 30 jours d’avant.', '% vs the 30 days before.'));
    }
    if (!r.notEnough) lines.push('<span class="upto">' + upTo(r) + '</span>');
    h += '<div class="hero">' + BLOB + '<div class="lbl">' + heroLbl(de) + '</div><div class="big">' + num('avg', r.avg30, 'g2') + (r.avg30 != null ? '<small>' + GJ() + '</small>' : '') + '</div>' +
      '<div class="sub">' + lines.join('<br>') + '</div>' + (r.notEnough ? '' : spark(r)) + '</div>';
    // tiles: the last known stock (real) + a projection labeled as such
    var cap = projection(r);
    var curM = C.dayStr(r.today).slice(0, 7), mc = null;
    r.months.forEach(function (m) { if (m.month === curM) mc = m.conso; });
    h += '<div class="tiles">' +
      tile(L('Ce mois-ci', 'This month'), num('month', r.monthSpend, 'eur0'), '€') +
      tile(L('Conso du mois', 'Used this month'), num('mconso', r.notEnough ? null : (mc || 0), 'g'), 'g') +
      tile(L('Prix moyen', 'Average price'), num('ppg', r.ppgAvg, 'eur'), '€/g') +
      tile(L('Dernier stock', 'Last stash'), num('stock', r.stock, 'g'), 'g', cap) + '</div>';
    h += actions();
    var items = data.achats.map(function (a) { return { k: 'achat', o: a }; }).concat(data.pesees.map(function (p) { return { k: 'pesee', o: p }; }));
    items.sort(function (x, y) { var kx = x.o.date + (x.o.heure || (x.k === 'pesee' ? '24' : '12')), ky = y.o.date + (y.o.heure || (y.k === 'pesee' ? '24' : '12')); return kx < ky ? 1 : kx > ky ? -1 : 0; });
    var n = state.showAll ? items.length : Math.min(6, items.length);
    h += '<div class="section-t">' + L('Dernières saisies', 'Latest entries') + '</div><div class="list">' + items.slice(0, n).map(rowHtml).join('') + '</div>';
    if (items.length > 6) h += '<button class="btn text wide" data-act="all">' + (state.showAll ? L('Réduire', 'Show less') : L('Tout l’historique (', 'Full history (') + items.length + ')') + '</button>';
    return h;
  }
  function GJ() { return L('g/j', 'g/day'); }
  function heroLbl(de) { return L('Conso ' + de + ' · 30 jours', cap(de) + ' use · 30 days'); }
  function tile(l, v, u, cap) { return '<div class="tile"><div class="l">' + l + '</div><div class="v">' + v + (v !== '—' ? '<small>' + u + '</small>' : '') + '</div>' + (cap ? '<div class="t3">' + cap + '</div>' : '') + '</div>'; }
  // average trend: last 30 measured days vs the 30 before (in %), if the history goes back that far
  function trend(r) {
    if (r.avg30 == null || r.avgPrev == null || r.avgPrev < 0.01) return null;
    return (r.avg30 / r.avgPrev - 1) * 100;
  }
  // "Measured up to yesterday 23:10": figures stop at the last stock point, nothing is made up after it
  function when(t) {
    var d = Math.floor(t - 1e-9), f = t - d, s = rel(d);
    if (f > 0.0007 && f < 0.9993 && Math.abs(f - 0.5) > 0.0007) {
      var m = Math.round(f * 1440); s += ' ' + L('à ', 'at ') + ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
    }
    return s;
  }
  function upTo(r) {
    var late = r.today - r.measuredDay;
    return L('Mesuré jusqu’à ', 'Measured up to ') + when(r.measuredTo) + (late >= 2 ? L(' · pèse pour mettre à jour', ' · weigh in to update') : '');
  }
  function projection(r) {
    if (r.notEnough || r.daysLeft == null) return r.stockMesure ? L('pesé ', 'weighed ') + when(r.measuredTo) : null;
    var dl0 = r.daysLeft;
    if (dl0 <= 0) return L('à ce rythme, déjà vide ?', 'at this pace, already out?');
    if (dl0 < 1) return L('à ce rythme, vide d’ici demain', 'at this pace, out by tomorrow');
    var n = Math.round(dl0);
    return L('à ce rythme, vide dans ~' + n + ' j', 'at this pace, out in ~' + n + ' d');
  }
  // mini chart of the last 30 days in the main card
  function spark(r) {
    var ser = C.series(r, r.measuredDay - 29, r.measuredDay), mx = 0;
    ser.forEach(function (x) { if (x.g > mx) mx = x.g; });
    if (mx <= 0) return '';
    var w = 300 / 30, s = '<svg class="spark" viewBox="0 0 300 40" preserveAspectRatio="none">';
    ser.forEach(function (x, i) {
      var hh = Math.max(x.g > 0 ? 2 : 0, x.g / mx * 38);
      s += '<rect class="bar" style="--i:' + i * 12 + '" x="' + (i * w + 1.2).toFixed(1) + '" y="' + (40 - hh).toFixed(1) + '" width="' + (w - 2.4).toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="2" opacity="' + (x.est ? .35 : .75) + '"/>';
    });
    return s + '</svg>';
  }
  function actions() {
    return '<div class="actions"><button class="btn big filled" data-act="new" data-k="achat">' + ic('cart') + L('J’ai topé', 'Scored') + '</button>' +
      '<button class="btn big tonal" data-act="new" data-k="pesee">' + ic('scale') + L('Pesée', 'Weigh') + '</button></div>';
  }
  function rowHtml(it) {
    var o = it.o, dn = C.dayNum(o.date);
    if (it.k === 'achat') {
      var ppg = o.g > 0 ? o.eur / o.g : null;
      return '<button class="row" data-act="edit" data-k="achat" data-id="' + esc(o.id) + '"><span class="ic a">' + ic('cart') + '</span>' +
        '<span class="tx"><div class="t1">' + g2(+o.g) + ' g · ' + eur0(+o.eur) + ' €</div><div class="t2">' +
        (ppg != null ? eur(ppg) + ' €/g' : '') + (o.reste != null && o.reste !== '' ? L(' · restait ', ' · had ') + g2(+o.reste) + L(' g', ' g left') : '') + (o.note ? ' · ' + esc(o.note) : '') +
        '</div></span><span class="end">' + rel(dn) + (o.heure ? '<br>' + esc(o.heure) : '') + '</span></button>';
    }
    return '<button class="row" data-act="edit" data-k="pesee" data-id="' + esc(o.id) + '"><span class="ic p">' + ic('scale') + '</span>' +
      '<span class="tx"><div class="t1">' + L('Pesée', 'Weigh-in') + ' · ' + g2(+o.g) + ' g</div><div class="t2">' + L('Stock mesuré', 'Measured stash') + '</div></span><span class="end">' + rel(dn) + (o.heure ? '<br>' + esc(o.heure) : '') + '</span></button>';
  }
  function emptyArt() {
    return '<svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="var(--secondary-container)"/>' +
      '<rect x="44" y="46" width="72" height="70" rx="16" fill="var(--primary-container)"/><rect x="44" y="46" width="72" height="20" rx="10" fill="var(--primary)"/>' +
      '<circle cx="66" cy="88" r="5" fill="var(--on-primary-container)"/><circle cx="94" cy="88" r="5" fill="var(--on-primary-container)"/>' +
      '<path d="M68 100q12 10 24 0" stroke="var(--on-primary-container)" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<rect x="58" y="38" width="8" height="16" rx="4" fill="var(--on-primary-container)"/><rect x="94" y="38" width="8" height="16" rx="4" fill="var(--on-primary-container)"/></svg>';
  }

  // ---------------------------------------------------------------- entry form (bottom sheet)
  var form = null;
  function openEntry(kind, editId, date) {
    var o = null;
    if (editId) o = (kind === 'achat' ? data.achats : data.pesees).filter(function (x) { return x.id === editId; })[0] || null;
    var nw = new Date(), today = C.dayStr(C.todayNum());
    var d0 = o ? o.date : (date || today);
    form = { kind: kind, edit: o, date: d0, heure: o ? (o.heure || '') : (d0 === today ? ('0' + nw.getHours()).slice(-2) + ':' + ('0' + nw.getMinutes()).slice(-2) : ''),
      showReste: !!(o && o.reste != null && o.reste !== ''), autoTime: !o };
    drawSheet();
    $('#scrim').classList.add('on'); $('#sheet').classList.add('on');
    if (!o) setTimeout(function () { var f = $('#f-g'); if (f) f.focus(); }, 420);
  }
  function v(id) { var e = $('#' + id); return e ? e.value : ''; }
  function drawSheet() {
    var f = form, o = f.edit || {}, a = f.kind === 'achat', h = '<div class="handle"></div>';
    h += '<h3>' + (f.edit ? L('Modifier', 'Edit') : (a ? L('J’ai topé', 'Scored') : L('Pesée', 'Weigh-in'))) + '</h3>';
    if (!f.edit) h += '<div class="seg"><button data-act="kind" data-k="achat" class="' + (a ? 'on' : '') + '">' + L('Achat', 'Buy') + '</button><button data-act="kind" data-k="pesee" class="' + (!a ? 'on' : '') + '">' + L('Pesée', 'Weigh-in') + '</button></div>';
    var gv = o.g != null ? String(o.g).replace('.', ',') : '';
    h += '<label class="field huge"><div class="fl">' + (a ? L('Combien ', 'How much ') + esc(subName().de) : L('Il te reste combien ' + esc(subName().de), 'How much ' + esc(subName().de) + ' is left')) + '</div><div class="wrap"><input id="f-g" inputmode="decimal" autocomplete="off" placeholder="0" value="' + esc(gv) + '"><span class="unit">g</span></div></label>';
    if (a) {
      h += '<div class="chips">' + [1, 2, 5, 10, 25].map(function (x) { return '<button class="chip" data-act="qg" data-v="' + x + '">' + x + ' g</button>'; }).join('') + '</div>';
      h += '<label class="field"><div class="fl">' + L('Pour combien', 'For how much') + '</div><div class="wrap"><input id="f-eur" inputmode="decimal" autocomplete="off" placeholder="0" value="' + esc(o.eur != null ? String(o.eur).replace('.', ',') : '') + '"><span class="unit">€</span></div></label>';
      h += dateTime(f);
      h += '<div class="hint" id="f-hint"></div>';
      if (f.showReste) {
        h += '<label class="field"><div class="fl">' + L('Il t’en restait (optionnel)', 'You still had (optional)') + '</div><div class="wrap"><input id="f-reste" inputmode="decimal" autocomplete="off" placeholder="' + L('rien', 'none') + '" value="' + esc(o.reste != null ? String(o.reste).replace('.', ',') : '') + '"><span class="unit">g</span></div></label>';
      } else {
        h += '<div class="chips"><button class="chip" data-act="reste">' + ic('scale') + L('Il m’en restait un peu', 'I still had some') + '</button></div>';
      }
      h += '<label class="field"><div class="fl">' + L('Note (optionnel)', 'Note (optional)') + '</div><input id="f-note" maxlength="60" autocomplete="off" placeholder="' + L('qualité, plan…', 'quality, plug…') + '" value="' + esc(o.note || '') + '"></label>';
    } else {
      h += dateTime(f);
      h += '<div class="hint">' + L('Pèse ce qui te reste : la courbe devient plus précise. Avec l’heure, encore plus.', 'Weigh what’s left: the curve gets sharper. Even more with the time.') + '</div>';
    }
    h += '<div class="sheet-actions">' + (f.edit ? '<button class="btn outline danger" data-act="delentry">' + ic('del') + L('Supprimer', 'Delete') + '</button>' : '<button class="btn outline" data-act="close">' + L('Annuler', 'Cancel') + '</button>') +
      '<button class="btn filled" data-act="saveentry">' + (f.edit ? L('Enregistrer', 'Save') : L('Valider', 'Done')) + '</button></div>';
    $('#sheet').innerHTML = h;
    clearTimeout(applyLens.s); applyLens.s = setTimeout(applyLens, 420);   // after the opening animation
    updHint();
  }
  function dateTime(f) {
    return '<div class="two"><label class="field"><div class="fl">' + L('Jour', 'Day') + '</div><input id="f-date" type="date" value="' + esc(f.date) + '"></label>' +
      '<label class="field"><div class="fl">' + L('Heure', 'Time') + ' <span style="font-weight:600;opacity:.7">' + L('(optionnel)', '(optional)') + '</span></div><div class="wrap"><input id="f-time" type="time" value="' + esc(f.heure) + '"><button type="button" class="iconbtn" data-act="notime" aria-label="' + L('Sans heure', 'No time') + '" style="width:32px;height:32px">' + ic('close') + '</button></div></label></div>';
  }
  function updHint() {
    var el = $('#f-hint'); if (!el) return;
    var gg = parseNum(v('f-g')), ee = parseNum(v('f-eur'));
    el.innerHTML = (gg > 0 && ee >= 0) ? L('Soit <b>', 'That’s <b>') + eur(ee / gg) + ' €/g</b>' + (res && res.ppgAvg ? L(' · ta moyenne : ', ' · your average: ') + eur(res.ppgAvg) + ' €/g' : '') : '';
  }
  function keepForm() { // keep typed values when re-rendering
    if (!form) return;
    var o = form.edit ? Object.assign({}, form.edit) : {};
    if ($('#f-g')) o.g = v('f-g');
    if ($('#f-eur')) o.eur = v('f-eur');
    if ($('#f-reste')) o.reste = v('f-reste');
    if ($('#f-note')) o.note = v('f-note');
    if ($('#f-date')) form.date = v('f-date');
    if ($('#f-time')) form.heure = v('f-time');
    form.edit = form.edit ? Object.assign(form.edit, {}) : null;
    form.draft = o;
  }
  function saveEntry() {
    var gg = parseNum(v('f-g')), date = v('f-date') || C.dayStr(C.todayNum()), heure = /^\d{2}:\d{2}/.test(v('f-time')) ? v('f-time').slice(0, 5) : undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return snack(L('Date invalide', 'Invalid date'));
    if (form.kind === 'achat') {
      var ee = parseNum(v('f-eur')), rr = $('#f-reste') ? parseNum(v('f-reste')) : NaN, note = $('#f-note') ? v('f-note').trim() : '';
      if (!(gg > 0)) return snack(L('Combien de grammes ?', 'How many grams?'));
      if (isNaN(ee)) ee = 0;
      if (ee < 0) return snack(L('Prix négatif ? Belle affaire 😅', 'Negative price? Nice deal 😅'));
      var a = { id: form.edit ? form.edit.id : uid(), date: date, heure: heure, g: gg, eur: ee, reste: isNaN(rr) ? null : Math.max(0, rr), note: note || undefined };
      upsert(data.achats, a);
      snack(pick(q(form.edit ? 'edit' : 'achat')));
    } else {
      if (isNaN(gg) || gg < 0) return snack(L('Combien il te reste ?', 'How much is left?'));
      var p = { id: form.edit ? form.edit.id : uid(), date: date, heure: heure, g: gg };
      upsert(data.pesees, p);
      snack(pick(q(form.edit ? 'edit' : 'pesee')));
    }
    state.bump = true;
    save(); closeSheet(); render(false);
  }
  function upsert(arr, o) {
    for (var i = 0; i < arr.length; i++) if (arr[i].id === o.id) { arr[i] = o; return; }
    arr.push(o);
  }
  function closeSheet() {
    $('#scrim').classList.remove('on'); $('#sheet').classList.remove('on'); form = null;
    if (document.activeElement) document.activeElement.blur();
  }

  // ---------------------------------------------------------------- dialogs
  var dlgResolve = null;
  function dialog(opt) {
    return new Promise(function (resolve) {
      dlgResolve = resolve;
      var h = '<h4>' + opt.title + '</h4>' + (opt.text ? '<p>' + opt.text + '</p>' : '');
      (opt.inputs || []).forEach(function (inp, i) {
        h += inp.type === 'range'
          ? '<div class="fl" style="font-size:12px;font-weight:700;color:var(--on-surface-variant)">' + inp.label + '</div><input id="dlg-' + i + '" type="range" ' + (inp.attrs || '') + '>'
          : '<label class="field"><div class="fl">' + inp.label + '</div><input id="dlg-' + i + '" type="' + (inp.type || 'text') + '" autocomplete="off"></label>';
      });
      h += '<div class="da">' + (opt.cancel !== false ? '<button class="btn text" data-act="dlgno">' + (opt.cancel || L('Annuler', 'Cancel')) + '</button>' : '') +
        '<button class="btn text' + (opt.danger ? ' danger' : '') + '" data-act="dlgok">' + (opt.ok || 'OK') + '</button></div>';
      $('#dialog').innerHTML = h; $('#dialog').classList.add('on'); $('#dscrim').classList.add('on');
      clearTimeout(applyLens.s); applyLens.s = setTimeout(applyLens, 380);
      dialog.count = (opt.inputs || []).length;
      if (dialog.count && (opt.inputs[0].type || 'text') !== 'range') setTimeout(function () { $('#dlg-0').focus(); }, 300);
    });
  }
  function closeDialog(val) {
    $('#dialog').classList.remove('on'); $('#dscrim').classList.remove('on');
    var r = dlgResolve; dlgResolve = null; if (r) r(val);
  }

  // ---------------------------------------------------------------- calendar
  function heatMax() {
    if (res._heat) return res._heat;
    var vals = Object.keys(res.days).map(function (k) { return res.days[k].g; }).filter(function (x) { return x > 0; }).sort(function (a, b) { return a - b; });
    if (!vals.length) return 1;
    return (res._heat = vals[Math.min(vals.length - 1, Math.floor(vals.length * 0.95))] || 1);
  }
  var HEAT = [0, 20, 42, 66, 90];
  function level(x, mx) { return x <= 0.001 ? 0 : Math.max(1, Math.min(4, Math.ceil(x / mx * 4))); }
  function heatStyle(lv) {
    if (!lv) return 'background:var(--cell-base)';
    return 'background:color-mix(in srgb,var(--primary) ' + HEAT[lv] + '%,var(--cell-base));' + (lv >= 3 ? 'color:var(--on-primary)' : '');
  }
  function vCal() {
    var y = state.calY, m = state.calM, today = res.today;
    var first = Math.floor(Date.UTC(y, m, 1) / 864e5), nDays = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    var wd = (new Date(first * 864e5).getUTCDay() + 6) % 7, mx = heatMax();
    if (state.calSel == null) state.calSel = (today >= first && today < first + nDays) ? today : first;
    var h = '<div class="card"><div class="calhead"><button class="iconbtn" data-act="mprev">' + ic('left') + '</button>' +
      '<div class="m">' + DFm.format(new Date(first * 864e5)) + '</div><button class="iconbtn" data-act="mnext">' + ic('right') + '</button></div>';
    h += '<div class="wk">' + L('LMMJVSD', 'MTWTFSS').split('').map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="grid">';
    for (var i = 0; i < wd; i++) h += '<div class="cell out"></div>';
    var mG = 0, mEur = 0;
    for (var d = 0; d < nDays; d++) {
      var dn = first + d, o = res.days[dn], lv = o && dn <= today ? level(o.g, mx) : 0;
      if (o && dn <= today) { mG += o.g; mEur += o.eur; }
      var cls = 'cell' + (dn === today ? ' today' : '') + (dn === state.calSel ? ' sel' : '') + (dn > res.measuredDay && dn <= today && res.measuredDay != null ? ' unk' : '');
      h += '<button class="' + cls + '" style="' + heatStyle(lv) + ';--r:' + Math.floor((wd + d) / 7) + '" data-act="day" data-d="' + dn + '"><span>' + (d + 1) + '</span><span class="dots">' +
        (o && o.achat ? '<i class="a"></i>' : '') + (o && o.pesee ? '<i class="p"></i>' : '') + '</span></button>';
    }
    h += '</div><div class="legend">' + L('moins', 'less') + [0, 1, 2, 3, 4].map(function (l) { return '<span class="sw" style="' + heatStyle(l) + '"></span>'; }).join('') + L('plus', 'more') +
      '<span class="sp"></span>' + L('● achat ○ pesée', '● buy ○ weigh-in') + '</div>' +
      (res.measuredDay != null && res.measuredDay < today ? '<div class="legend"><span class="sw unk"></span>' + L('pas encore mesuré : une pesée remplit ces cases', 'not measured yet: a weigh-in fills these in') + '</div>' : '') + '</div>';
    h += '<div class="card"><h2>' + L('Ce mois-ci', 'This month') + '</h2><div class="kv"><span>' + L('Conso mesurée', 'Measured use') + '</span><b>' + g(mG) + ' g</b></div>' +
      '<div class="kv"><span>' + L('Valeur fumée', 'Value smoked') + '</span><b>' + eur0(mEur) + ' €</b></div>' +
      '<div class="kv"><span>' + L('Dépensé en achats', 'Spent on buys') + '</span><b>' + eur0(monthEur(y, m)) + ' €</b></div></div>';
    h += dayDetail(state.calSel);
    return h;
  }
  function monthEur(y, m) {
    var key = y + '-' + ('0' + (m + 1)).slice(-2), s = 0;
    data.achats.forEach(function (a) { if (a.date.slice(0, 7) === key) s += +a.eur || 0; });
    return s;
  }
  function dayDetail(dn) {
    var o = res.days[dn], str = C.dayStr(dn), h = '<div class="card daycard"><h2 style="color:var(--on-surface);font-size:20px">' + cap(dl(dn)) + '</h2>';
    if (dn > res.today) h += '<div class="kv"><span>' + L('Dans le futur', 'In the future') + '</span><b>🔮</b></div>';
    else if (res.measuredDay != null && dn > res.measuredDay) h += '<div class="kv"><span>' + L('Pas encore mesuré', 'Not measured yet') + '</span><b>?</b></div>' +
      '<div class="cap" style="margin:2px 0 6px">' + L('Une pesée (ou ton prochain achat avec « il m’en restait ») donne le chiffre exact.', 'A weigh-in (or your next buy with “I still had some”) gives the exact number.') + '</div>';
    else if (o && o.g > 0) {
      h += '<div class="kv"><span>' + L('Conso mesurée', 'Measured use') + '</span><b>' + g2(o.g) + ' g</b></div>';
      if (o.eur > 0) h += '<div class="kv"><span>' + L('Valeur', 'Value') + '</span><b>' + eur(o.eur) + ' €</b></div>';
    } else h += '<div class="kv"><span>' + L('Conso', 'Use') + '</span><b>0 g</b></div>';
    res.segments.forEach(function (s) {
      if (s.t0 < dn + 1 && s.t1 > dn && s.t1 > s.t0) {
        var len = s.t1 - s.t0;
        h += '<div class="kv"><span>' + L('Période ', 'Period ') + ds(Math.floor(s.t0)) + ' → ' + ds(Math.floor(s.t1 - 1e-9)) + '</span><b>' + g(s.g) + ' g · ' + g2(s.g / len) + ' ' + GJ() + '</b></div>';
      }
    });
    var items = data.achats.filter(function (a) { return a.date === str; }).map(function (a) { return { k: 'achat', o: a }; })
      .concat(data.pesees.filter(function (p) { return p.date === str; }).map(function (p) { return { k: 'pesee', o: p }; }));
    if (items.length) h += '<div class="list" style="margin-top:10px">' + items.map(rowHtml).join('') + '</div>';
    h += '<div class="two" style="margin-top:12px"><button class="btn tonal small" data-act="new" data-k="achat" data-date="' + str + '">' + ic('add') + L('Achat', 'Buy') + '</button>' +
      '<button class="btn outline small" data-act="new" data-k="pesee" data-date="' + str + '">' + ic('add') + L('Pesée', 'Weigh-in') + '</button></div></div>';
    return h;
  }

  // ---------------------------------------------------------------- charts
  var RANGES = { '1m': 30, '3m': 91, '1a': 365, tout: 0 };
  function niceMax(x) {
    if (!(x > 0)) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(x))), n = x / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  }
  function smoothPath(pts) {
    if (!pts.length) return '';
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6, c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function axisY(W, LM, T, H, mx, fmt) {
    var s = '';
    [0, 0.5, 1].forEach(function (f) {
      var y = T + H - f * H;
      s += '<line class="gl" x1="' + LM + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text x="' + (LM - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + fmt(mx * f) + '</text>';
    });
    return s;
  }
  // Groups days into weeks (or fortnights) over long periods: fewer shapes, same reading.
  function bucket(ser) {
    var k = ser.length > 400 ? 14 : ser.length > 120 ? 7 : 1;
    if (k === 1) return { k: 1, pts: ser };
    var out = [];
    for (var i = 0; i < ser.length; i += k) {
      var sl = ser.slice(i, i + k), s = 0, est = false;
      sl.forEach(function (x) { s += x.g; est = est || x.est; });
      out.push({ day: sl[0].day, g: s / sl.length, est: est });
    }
    return { k: k, pts: out };
  }
  function chartDaily(ser) {
    var bk = bucket(ser), pts0 = bk.pts;
    var W = 340, LM = 34, T = 10, H = 150, B = 24, n = pts0.length, iw = W - LM;
    var vals = pts0.map(function (s) { return s.g; }), roll = C.rolling(vals, Math.min(bk.k === 1 ? 7 : 3, n));
    var mx = niceMax(Math.max.apply(null, vals.concat(roll)) * 1.05);
    var bw = iw / n, svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (T + H + B) + '">' + axisY(W, LM, T, H, mx, function (x) { return g2(x); });
    var delay = Math.max(2, Math.min(25, 400 / n));
    pts0.forEach(function (s, i) {
      if (s.g <= 0) return;
      var hh = s.g / mx * H;
      svg += '<rect class="bar" style="--i:' + Math.round(i * delay) + '" x="' + (LM + i * bw + bw * 0.15).toFixed(1) + '" y="' + (T + H - hh).toFixed(1) + '" width="' + Math.max(1, bw * 0.7).toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="' + Math.min(3, bw * 0.35).toFixed(1) + '" fill="var(--primary)" opacity="' + (s.est ? 0.12 : 0.22) + '"/>';
    });
    var pts = roll.map(function (r, i) { return [LM + (i + 0.5) * bw, T + H - r / mx * H]; });
    var ei = pts0.findIndex(function (s) { return s.est; });
    if (ei < 0) ei = n;
    var solid = pts.slice(0, Math.max(1, ei)), dash = pts.slice(Math.max(0, ei - 1));
    if (solid.length > 1) svg += '<path class="ln" pathLength="1" d="' + smoothPath(solid) + '" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round"/>';
    if (ei < n && dash.length > 1) svg += '<path class="vl" d="' + smoothPath(dash) + '" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 6"/>';
    var nl = 4;
    for (var k = 0; k < nl; k++) {
      var idx = Math.round(k * (n - 1) / (nl - 1)), x = LM + (idx + 0.5) * bw;
      svg += '<text x="' + x.toFixed(1) + '" y="' + (T + H + 17) + '" text-anchor="' + (k === 0 ? 'start' : k === nl - 1 ? 'end' : 'middle') + '">' + ds(pts0[idx].day) + '</text>';
    }
    return svg + '</svg>' + (bk.k > 1 ? '<div class="cap">' + (bk.k === 7 ? L('Moyenne par semaine sur cette période.', 'Weekly average over this period.') : L('Moyenne par quinzaine sur cette période.', 'Two-week average over this period.')) + '</div>' : '');
  }
  function chartMonths(months) {
    var W = 340, LM = 34, T = 18, H = 140, B = 24, n = months.length, iw = W - LM;
    var mx = niceMax(Math.max.apply(null, months.map(function (m) { return m.eur; })) * 1.1);
    var bw = iw / n, svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (T + H + B) + '">' + axisY(W, LM, T, H, mx, function (x) { return NF0.format(x); });
    months.forEach(function (m, i) {
      var hh = Math.max(0, m.eur / mx * H), x = LM + i * bw + bw * 0.14, w = bw * 0.72, r = Math.min(10, w / 2, hh);
      if (hh > 0) svg += '<path class="bar" style="--i:' + i * 60 + '" d="M' + x.toFixed(1) + ' ' + (T + H) + 'V' + (T + H - hh + r).toFixed(1) + 'q0 -' + r.toFixed(1) + ' ' + r.toFixed(1) + ' -' + r.toFixed(1) + 'h' + (w - 2 * r).toFixed(1) + 'q' + r.toFixed(1) + ' 0 ' + r.toFixed(1) + ' ' + r.toFixed(1) + 'V' + (T + H) + 'z" fill="var(--' + (i === n - 1 ? 'primary' : 'primary-container') + ')"/>';
      if (n <= 8 && m.eur > 0) svg += '<text class="vl" x="' + (x + w / 2).toFixed(1) + '" y="' + (T + H - hh - 5).toFixed(1) + '" text-anchor="middle" style="font-weight:700;fill:var(--on-surface)">' + NF0.format(m.eur) + '</text>';
      if (n <= 12 || i % Math.ceil(n / 12) === 0) svg += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (T + H + 17) + '" text-anchor="middle">' + DFms.format(new Date(Date.UTC(+m.month.slice(0, 4), +m.month.slice(5) - 1, 1))).replace('.', '') + '</text>';
    });
    return svg + '</svg>';
  }
  function chartPpg(ps, from, to) {
    var W = 340, LM = 34, T = 10, H = 120, B = 24, iw = W - LM - 8;
    var vals = ps.map(function (p) { return p.ppg; }), lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var pad = Math.max(0.5, (hi - lo) * 0.25); lo = Math.max(0, Math.floor(lo - pad)); hi = Math.ceil(hi + pad);
    var X = function (d) { return LM + 4 + (to === from ? iw / 2 : (d - from) / (to - from) * iw); }, Y = function (v2) { return T + H - (v2 - lo) / (hi - lo) * H; };
    var svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (T + H + B) + '">';
    [0, 0.5, 1].forEach(function (f) {
      var val = lo + (hi - lo) * f, y = Y(val);
      svg += '<line class="gl" x1="' + LM + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text x="' + (LM - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + NF1.format(val) + '</text>';
    });
    var pts = ps.map(function (p) { return [X(p.day), Y(p.ppg)]; });
    if (pts.length > 1) svg += '<path class="ln" pathLength="1" d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('') + '" fill="none" stroke="var(--outline)" stroke-width="1.5"/>';
    pts.forEach(function (p, i) { svg += '<circle class="pt" style="--i:' + Math.min(i, 20) + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5.5" fill="var(--tertiary-container)" stroke="var(--on-tertiary-container)" stroke-width="2"/>'; });
    svg += '<text x="' + LM + '" y="' + (T + H + 17) + '">' + ds(from) + '</text><text x="' + W + '" y="' + (T + H + 17) + '" text-anchor="end">' + ds(to) + '</text>';
    return svg + '</svg>';
  }
  function vGraph() {
    var r = res, h = '<div class="seg mini">' + [['1m', L('1 mois', '1 mo')], ['3m', L('3 mois', '3 mo')], ['1a', L('1 an', '1 yr')], ['tout', L('Tout', 'All')]].map(function (x) {
      return '<button data-act="range" data-k="' + x[0] + '" class="' + (state.range === x[0] ? 'on' : '') + '">' + x[1] + '</button>';
    }).join('') + '</div>';
    if (r.empty || r.notEnough) {
      return h + '<div class="empty">' + emptyArt() + '<b>' + L('Pas encore de courbe', 'No curve yet') + '</b>' + L('Il faut au moins deux achats (ou un achat et une pesée) pour calculer une conso.', 'You need at least two buys (or a buy and a weigh-in) to work out your use.') + '</div>';
    }
    var to = r.measuredDay, from = RANGES[state.range] ? Math.max(r.firstDay, r.today - RANGES[state.range] + 1) : r.firstDay;
    if (from > to) from = to;
    if (to - from < 6) from = to - 6;
    var ser = C.series(r, from, to);
    var tot = ser.reduce(function (s, x) { return s + x.g; }, 0), val = ser.reduce(function (s, x) { return s + x.eur; }, 0);
    var nd = to - Math.max(from, r.firstDay) + 1;
    h += '<div class="card"><h2>' + L('Conso ' + esc(subName().de) + ' par jour', cap(esc(subName().de)) + ' use per day') + '</h2>' + chartDaily(ser) + '<div class="cap">' + L('Barres : grammes par jour · courbe : moyenne sur 7 jours. ', 'Bars: grams per day · line: 7-day average. ') + upTo(r) + '.</div></div>';
    var fm = C.dayStr(from).slice(0, 7), months = r.months.filter(function (m) { return m.month >= fm; });
    if (months.length) h += '<div class="card"><h2>' + L('Dépenses par mois (€)', 'Spending per month (€)') + '</h2>' + chartMonths(months) + '</div>';
    var ps = r.purchases.filter(function (p) { return p.day >= from && p.ppg != null; });
    if (ps.length) h += '<div class="card"><h2>' + L('Prix au gramme (€/g)', 'Price per gram (€/g)') + '</h2>' + chartPpg(ps, from, to) + '</div>';
    var spent = r.purchases.filter(function (p) { return p.day >= from; }).reduce(function (s, p) { return s + p.eur; }, 0);
    h += '<div class="card"><h2>' + L('Sur la période', 'Over this period') + '</h2><div class="statgrid">' +
      stat(L('Conso totale', 'Total use'), g(tot) + ' g') + stat(L('Moyenne', 'Average'), g2(tot / nd) + ' ' + GJ()) +
      stat(L('Dépensé', 'Spent'), eur0(spent) + ' €') + stat(L('Valeur fumée', 'Value smoked'), eur0(val) + ' €') +
      stat(L('Achats', 'Buys'), String(ps.length)) + stat(L('Plus longue pause', 'Longest break'), r.longestGap ? r.longestGap.days + L(' j', ' d') : '—') + '</div>' +
      (r.longestGap ? '<div class="cap">' + L('Plus longue pause entre deux achats : du ' + ds(r.longestGap.from) + ' au ' + ds(r.longestGap.to) + '.', 'Longest break between two buys: ' + ds(r.longestGap.from) + ' to ' + ds(r.longestGap.to) + '.') + '</div>' : '') + '</div>';
    return h;
  }
  function stat(l, v2) { return '<div class="stat"><div class="l">' + l + '</div><div class="v">' + v2 + '</div></div>'; }

  // ---------------------------------------------------------------- settings
  function vSet() {
    var s = data.settings, lock = !!nget('isLock', false), disc = !!nget('isDiscreet', false);
    var h = '<div class="section-t">' + L('Langue', 'Language') + '</div><div class="card"><div class="seg mini" style="margin:0">' +
      [['fr', 'Français'], ['en', 'English']].map(function (x) { return '<button data-act="lang" data-k="' + x[0] + '" class="' + (LANG === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div></div>';
    h += '<div class="section-t">' + L('Sécurité', 'Security') + '</div><div class="group">' +
      setRow('lock', L('Verrouillage', 'Lock'), L('Code, schéma ou empreinte du téléphone à chaque ouverture', 'Your phone’s PIN, pattern or fingerprint every time you open it'), '<span class="switch' + (lock ? ' on' : '') + '"></span>') +
      setRow('secure', L('Bloquer les captures', 'Block screenshots'), L('Écran noir dans les applis récentes et pas de capture d’écran', 'Black screen in recent apps and no screenshots'), '<span class="switch' + (nget('isSecure', true) ? ' on' : '') + '"></span>') +
      setRow('discret', L('Mode discret', 'Discreet mode'), L('Icône neutre « Carnet » sur l’écran d’accueil', 'Plain “Notebook” icon on your home screen'), '<span class="switch' + (disc ? ' on' : '') + '"></span>') + '</div>';
    {
    h += '<div class="section-t">' + L('Apparence', 'Look') + '</div><div class="card"><h2>' + L('Matière', 'Material') + '</h2><div class="mats">' +
      MATS().map(function (x) {
        return '<button class="mat m-' + x[0] + ((s.mat || 'plein') === x[0] ? ' on' : '') + '" data-act="mat" data-k="' + x[0] + '"><div class="pv"><b></b></div>' + x[1] + '</button>';
      }).join('') + '</div>';
    if ((s.mat || 'plein') !== 'plein') {
      var hasImg = !!(bgUrl || loadBg());
      h += '<h2>' + L('Fond', 'Background') + '</h2><div class="chips">' + [['gradient', L('Dégradé animé', 'Animated gradient')], ['aurora', L('Aurore', 'Aurora')]].concat(SH_LIST()).concat([['image', L('Ton image', 'Your picture')]]).map(function (x) {
        return '<button class="chip' + ((s.bg || 'gradient') === x[0] && (x[0] !== 'image' || hasImg) ? ' on' : '') + '" data-act="bg" data-k="' + x[0] + '">' + x[1] + '</button>';
      }).join('') + (s.bg === 'image' && hasImg ? '<button class="chip" data-act="bgpick">' + L('Changer d’image', 'Change picture') + '</button>' : '') + '</div>' +
        '<div class="cap" style="margin:-4px 0 14px">' + (s.mat === 'mica' ? L('Mica : le fond est flouté et teinté, façon Windows 11.', 'Mica: blurred, tinted background, Windows 11 style.') : L('Verre liquide : surfaces translucides qui déforment le fond. Plus gourmand en batterie.', 'Liquid glass: see-through surfaces that bend the background. A bit hungrier on battery.')) + '</div>';
    }
    h += '<h2>' + L('Thème', 'Theme') + '</h2><div class="seg mini" style="margin-bottom:6px">' +
      [['auto', 'Auto'], ['light', L('Clair', 'Light')], ['dark', L('Sombre', 'Dark')], ['amoled', 'AMOLED']].map(function (x) { return '<button data-act="theme" data-k="' + x[0] + '" class="' + (s.theme === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="cap" style="margin:4px 0 12px">' + L('AMOLED : noir pur, marche aussi avec Mica et Verre liquide.', 'AMOLED: pure black, works with Mica and Liquid glass too.') + '</div>' +
      '<h2 style="margin-top:8px">' + L('Couleur', 'Colour') + '</h2><div class="swatches">' + (dyn ? '<button class="swatch dyn' + (s.color === 'dynamic' ? ' on' : '') + '" data-act="color" data-k="dynamic" aria-label="' + L('Couleurs du fond d’écran', 'Wallpaper colours') + '"></button>' : '') +
      Object.keys(HUES).map(function (k) { return '<button class="swatch' + (s.color === k ? ' on' : '') + '" style="background:' + hsl(HUES[k], 48, 45) + '" data-act="color" data-k="' + k + '" aria-label="' + k + '"></button>'; }).join('') +
      '<button class="swatch custom' + (s.color === 'custom' ? ' on' : '') + '" style="background:' + (s.color === 'custom' ? hsl(+s.hue, 48, 45) : 'var(--surface-highest)') + ';' + (s.color === 'custom' ? '' : 'color:var(--on-surface)') + '" data-act="hue" aria-label="' + L('Couleur perso', 'Custom colour') + '">' + ic('edit') + '</button>' +
      '</div>' + (dyn ? '<div class="cap">' + L('L’arc-en-ciel = couleurs de ton fond d’écran (Material You). Le crayon = ta teinte.', 'Rainbow = your wallpaper colours (Material You). Pencil = your own hue.') + '</div>' : '<div class="cap">' + L('Le crayon = choisis ta propre teinte.', 'Pencil = pick your own hue.') + '</div>') +
      '<button class="opt" data-act="pattern" style="margin-top:6px"><span class="tx"><div class="t1">' + L('Motif de fond', 'Background pattern') + '</div><div class="t2">' + L('Des bédos et des bouts de shit en filigrane', 'Faint joints and bits of hash in the back') + '</div></span><span class="switch' + (s.pattern !== false ? ' on' : '') + '"></span></button>' +
      '<button class="opt" data-act="calm"><span class="tx"><div class="t1">' + L('Animations réduites', 'Reduced motion') + '</div><div class="t2">' + L('Moins de mouvement, plus d’autonomie', 'Less movement, more battery') + '</div></span><span class="switch' + (s.calm ? ' on' : '') + '"></span></button>' +
      '<button class="opt" data-act="adv"><span class="tx"><div class="t1">' + L('Customisation avancée', 'Advanced customisation') + '</div><div class="t2">' + L('Flou, transparence, reflets, motif : tout se règle au potard', 'Blur, transparency, reflections, pattern: all on knobs') + '</div></span>' + ic('right') + '</button></div>';
    }
    var cur = subName();
    var SL = subList();
    h += '<div class="section-t">' + L('Ta conso', 'What you track') + '</div><div class="card"><div class="subnow">' + esc(cur.n) + '</div>' +
      '<div class="cap" style="margin:-2px 0 12px">' + L('Juste le nom affiché : le calcul ne regarde que les grammes.', 'Just the name shown: the maths only looks at grams.') + '</div>' +
      Object.keys(SL).map(function (grp) {
        return '<h2>' + grp + '</h2><div class="chips">' + SL[grp].map(function (x) {
          return '<button class="chip' + (s.sub === x[0] || (!s.sub && x[0] === subDefault()) ? ' on' : '') + '" data-act="sub" data-k="' + esc(x[0]) + '">' + esc(x[0]) + '</button>';
        }).join('') + '</div>';
      }).join('') + '<div class="chips">' +
      '<button class="chip' + (s.sub === 'surprise' ? ' on' : '') + '" data-act="sub" data-k="surprise">🎲 ' + L('Surprise à chaque ouverture', 'Surprise every launch') + '</button>' +
      '<button class="chip' + (s.sub === 'custom' ? ' on' : '') + '" data-act="subcustom">✏️ ' + (s.sub === 'custom' && s.subCustom ? esc(s.subCustom) : L('Mon propre nom…', 'My own name…')) + '</button></div></div>';
    var rem = getRem();
    h += '<div class="section-t">' + L('Rappels', 'Reminders') + '</div><div class="card">' +
      '<button class="opt" data-act="rem"><span class="tx"><div class="t1">' + L('Rappel de pesée', 'Weigh-in reminder') + '</div><div class="t2">' + L('Une notif pour peser ce qui te reste. Sautée si tu as déjà pesé.', 'A notification to weigh what’s left. Skipped if you already did.') + '</div></span><span class="switch' + (rem.on ? ' on' : '') + '"></span></button>';
    if (rem.on) {
      h += '<h2 style="margin-top:8px">' + L('Fréquence', 'How often') + '</h2><div class="chips">' + [1, 2, 3, 7].map(function (d) {
        return '<button class="chip' + (rem.days === d ? ' on' : '') + '" data-act="remdays" data-k="' + d + '">' + (d === 1 ? L('Chaque jour', 'Every day') : L('Tous les ' + d + ' j', 'Every ' + d + ' days')) + '</button>';
      }).join('') + '</div><label class="field" style="margin:0"><div class="fl">' + L('À quelle heure', 'At what time') + '</div><input id="rem-time" type="time" value="' + esc(rem.time) + '"></label>';
    }
    h += '</div><div class="section-t">Widget</div><div class="group">' +
      setRow('widgethide', L('Widget discret', 'Discreet widget'), L('Cache les chiffres sur l’écran d’accueil, garde les boutons', 'Hides the numbers on your home screen, keeps the buttons'), '<span class="switch' + (s.widgetHide ? ' on' : '') + '"></span>') + '</div>' +
      '<div class="cap" style="margin:0 6px 8px">' + L('Ajoute-le depuis ton écran d’accueil : appui long → Widgets → Topé.', 'Add it from your home screen: long press → Widgets → Topé.') + '</div>';
    h += '<div class="section-t">' + L('Données', 'Data') + '</div><div class="group">' +
      setRow('export', L('Exporter une sauvegarde', 'Export a backup'), L('Fichier chiffré par mot de passe', 'Password-encrypted file'), ic('down')) +
      setRow('import', L('Importer une sauvegarde', 'Import a backup'), L('Remplace les données actuelles', 'Replaces the current data'), ic('up')) +
      setRow('wipe', L('Tout effacer', 'Erase everything'), L('Achats et pesées, sans retour', 'Buys and weigh-ins, no way back'), ic('trash')) + '</div>';
    h += '<div class="section-t">' + L('Aide', 'Help') + '</div><div class="group">' +
      setRow('help', L('Se faire aider', 'Get help'), L('Réduire ou arrêter : des contacts gratuits et anonymes', 'Cutting down or stopping: free, confidential contacts'), ic('right')) +
      setRow('intro', L('Revoir la présentation', 'Replay the intro'), L('Le petit tour des fonctions, en 1 minute', 'The quick tour of the features, in 1 minute'), ic('right')) + '</div>';
    h += '<div class="about"><b>Topé</b> · v3.8<br>' +
      L(data.achats.length + ' achat' + (data.achats.length > 1 ? 's' : '') + ' · ' + data.pesees.length + ' pesée' + (data.pesees.length > 1 ? 's' : ''),
        data.achats.length + ' buy' + (data.achats.length !== 1 ? 's' : '') + ' · ' + data.pesees.length + ' weigh-in' + (data.pesees.length !== 1 ? 's' : '')) + '</div>';
    return h;
  }
  function pot(k) {
    var p = POT[k], v = adv(k), pc = ((v - p.min) / (p.max - p.min) * 100).toFixed(1);
    return '<label class="pot"><div class="pl"><span>' + L(p.l[0], p.l[1]) + '</span><b id="pv-' + k + '">' + v + unit(p.u) + '</b></div>' +
      '<input type="range" class="potr" data-k="' + k + '" min="' + p.min + '" max="' + p.max + '" step="1" value="' + v + '" style="--p:' + pc + '%"></label>';
  }
  // ---------------------------------------------------------------- getting help
  function helpCard(t, sub, lines, btns) {
    return '<div class="card helpc"><h2>' + t + '</h2>' + (sub ? '<div class="hsub">' + sub + '</div>' : '') +
      lines.map(function (l) { return '<div class="cap" style="margin:4px 0 0">' + l + '</div>'; }).join('') +
      (btns.length ? '<div class="hbtns">' + btns.map(function (b) { return '<button class="btn ' + (b[2] || 'tonal') + ' small" data-act="link" data-k="' + b[1] + '">' + b[0] + '</button>'; }).join('') + '</div>' : '') + '</div>';
  }
  function vHelp() {
    var h = '<button class="btn text back" data-act="advback">' + ic('left') + L('Réglages', 'Settings') + '</button>';
    h += '<div class="card"><div class="cap" style="margin:0;font-size:14.5px;line-height:1.5">' +
      L('Réduire, faire une pause ou arrêter : des professionnels peuvent t’accompagner, gratuitement et anonymement. Tes stats de Topé (moyenne, tendance, calendrier) peuvent aussi servir de base pour en parler.',
        'Cutting down, taking a break or stopping: professionals can help, for free and confidentially. Your Topé stats (average, trend, calendar) can be a starting point for that talk.') + '</div></div>';
    var dis = helpCard('Drogues Info Service', '<b>0 800 23 13 13</b> · ' + L('tous les jours de 8 h à 2 h', 'every day, 8 am to 2 am (France)'),
      [L('Appel gratuit et anonyme. Chat et questions-réponses sur le site.', 'Free, anonymous call (in French). Chat and Q&A on the website.')],
      [[ic('phone') + L('Appeler', 'Call'), 'tel:0800231313', 'filled'], [L('Site et chat', 'Website & chat'), 'https://www.drogues-info-service.fr']]);
    var cjc = helpCard(L('Consultations Jeunes Consommateurs', 'Young users’ clinics (CJC, France)'), L('Jusqu’à 25 ans · gratuit et anonyme', 'Up to age 25 · free and anonymous'),
      [L('Plus de 400 lieux en France, pour faire le point en face à face. L’entourage peut venir aussi.', 'Over 400 places in France to talk it through face to face. Family and friends can come too.')],
      [[L('Trouver une adresse', 'Find an address'), 'https://www.drogues-info-service.fr/Adresses-utiles']]);
    var doc = helpCard(L('Ton médecin', 'Your doctor'), null,
      [L('Un généraliste peut faire le point avec toi et t’orienter vers un centre spécialisé (CSAPA), lui aussi gratuit.', 'A GP can go through it with you and refer you to specialised services.')], []);
    if (LANG === 'en') {
      h += helpCard('FRANK (UK)', '<b>0300 123 6600</b> · 24/7', ['Free and confidential. Text 82111, live chat on the website.'],
        [[ic('phone') + 'Call', 'tel:03001236600', 'filled'], ['Website', 'https://www.talktofrank.com']]);
      h += helpCard('SAMHSA National Helpline (US)', '<b>1-800-662-4357</b> · 24/7', ['Free, confidential treatment referral and information, in English and Spanish.'],
        [[ic('phone') + 'Call', 'tel:18006624357', 'filled'], ['Find treatment', 'https://findtreatment.gov']]);
      h += dis + doc;
    } else h += dis + cjc + doc;
    h += '<div class="cap" style="margin:6px 8px 0">' + L('Ces boutons ouvrent ton téléphone ou ton navigateur : Topé, lui, reste hors ligne.', 'These buttons open your phone or browser: Topé itself stays offline.') + '</div>';
    return h;
  }
  function openLink(u) {
    try { if (NATIVE && Android.openLink && Android.openLink(u)) return; } catch (e) { }
    if (!NATIVE) { window.open(u, '_blank'); return; }
    snack(L('Impossible d’ouvrir ce lien', 'Can’t open this link'));
  }
  function unit(u) { return LANG === 'en' && u === ' %' ? '%' : u; }
  function vAdv() {
    var s = data.settings, mat = s.mat || 'plein';
    var h = '<button class="btn text back" data-act="advback">' + ic('left') + L('Réglages', 'Settings') + '</button>';
    h += '<div class="advprev"><div class="hero">' + BLOB + '<div class="lbl">' + L('Aperçu en direct', 'Live preview') + '</div><div class="big">' + NFg2.format(1.27) + '<small>' + GJ() + '</small></div></div>' +
      '<div class="tiles">' + tile(L('Prix moyen', 'Average price'), NF2.format(7.39), '€/g') + tile(L('Conso du mois', 'Used this month'), NF1.format(26.6), 'g') + '</div></div>';
    h += '<div class="card"><h2>' + L('Matière', 'Material') + '</h2><div class="seg mini">' + MATS().map(function (x) {
      return '<button data-act="mat" data-k="' + x[0] + '" class="' + (mat === x[0] ? 'on' : '') + '">' + x[1] + '</button>';
    }).join('') + '</div></div>';
    if (mat === 'glass') {
      h += '<div class="card"><h2>' + L('Verre liquide', 'Liquid glass') + '</h2>' + ['gBlur', 'gA', 'gSat', 'gRim', 'gSheen', 'gLens', 'gPrism'].map(pot).join('') +
        '<button class="opt" data-act="gyro"><span class="tx"><div class="t1">' + L('Reflets au gyroscope', 'Gyroscope reflections') + '</div><div class="t2">' + L('La lumière suit l’inclinaison du téléphone', 'The light follows how you tilt the phone') + '</div></span><span class="switch' + (s.gyro === true ? ' on' : '') + '"></span></button>' +
        '<div class="cap">' + L('Plus de flou et de loupe = un poil plus de batterie.', 'More blur and lens = a touch more battery.') + '</div></div>';
    } else if (mat === 'mica') {
      h += '<div class="card"><h2>Mica</h2>' + ['mBlur', 'mTint', 'mA', 'mCBlur', 'mGrain'].map(pot).join('') + '</div>';
    } else {
      h += '<div class="card"><div class="cap" style="margin:0">' + L('En Plein, les panneaux sont opaques. Passe en Mica ou en Verre liquide pour débloquer leurs potards.', 'In Solid, panels are opaque. Switch to Mica or Liquid glass to unlock their knobs.') + '</div></div>';
    }
    h += '<div class="card"><h2>' + L('Motif de fond', 'Background pattern') + '</h2>' + (s.pattern === false
      ? '<div class="cap" style="margin:0 0 6px">' + L('Le motif est coupé.', 'The pattern is off.') + '</div><button class="btn tonal small" data-act="pattern">' + L('Le remettre', 'Turn it back on') + '</button>'
      : ['patA', 'patS', 'patV'].map(pot).join('') + '<div class="cap">' + L('Vitesse à 0 : le motif reste immobile.', 'Speed at 0: the pattern stays still.') + '</div>') + '</div>';
    if ((s.bg || '').indexOf('sh-') === 0 && mat !== 'plein') h += '<div class="card"><h2>' + L('Fond animé', 'Animated background') + '</h2>' + pot('shV') + '<div class="cap">' + L('Vitesse à 0 : le fond se fige (zéro calcul).', 'Speed at 0: the background freezes (no work at all).') + '</div></div>';
    h += '<button class="btn outline wide" data-act="advreset">' + L('Tout remettre par défaut', 'Reset everything') + '</button>';
    return h;
  }
  function MATS() { return [['plein', L('Plein', 'Solid')], ['mica', 'Mica'], ['glass', L('Verre liquide', 'Liquid glass')]]; }
  function setRow(act, t1, t2, end) {
    return '<button class="set" data-act="' + act + '"><span class="tx"><div class="t1">' + t1 + '</div><div class="t2">' + t2 + '</div></span>' + end + '</button>';
  }

  function doExport() {
    dialog({ title: L('Exporter', 'Export'), text: L('Choisis un mot de passe. Sans lui, la sauvegarde est illisible : ne l’oublie pas.', 'Pick a password. Without it the backup can’t be read: don’t forget it.'),
      inputs: [{ label: L('Mot de passe', 'Password'), type: 'password' }, { label: L('Confirmer', 'Confirm'), type: 'password' }], ok: L('Exporter', 'Export') })
      .then(function (vals) {
        if (!vals) return;
        if (vals[0].length < 4) return snack(L('4 caractères minimum', '4 characters minimum'));
        if (vals[0] !== vals[1]) return snack(L('Les mots de passe ne collent pas', 'Passwords don’t match'));
        var payload = JSON.stringify({ app: 'tope', v: 1, achats: data.achats, pesees: data.pesees });
        if (NATIVE) Android.exportData(payload, vals[0]);
        else snack(L('L’export chiffré marche dans l’appli Android', 'Encrypted export works in the Android app'));
      });
  }
  function doImport() {
    dialog({ title: L('Importer', 'Import'), text: L('Tu vas choisir un fichier de sauvegarde. Il remplacera tout ce qu’il y a ici.', 'You’re about to pick a backup file. It will replace everything here.'),
      inputs: [{ label: L('Mot de passe de la sauvegarde', 'Backup password'), type: 'password' }], ok: L('Choisir le fichier', 'Pick the file') })
      .then(function (vals) {
        if (!vals) return;
        if (NATIVE) Android.importData(vals[0]);
        else snack(L('L’import marche dans l’appli Android', 'Import works in the Android app'));
      });
  }
  // Callbacks from the native side
  window.onNative = function (ev) {
    if (!ev) return;
    if (ev.type === 'export') snack(ev.ok ? L('Sauvegarde exportée 💾', 'Backup exported 💾') : (ev.msg || L('Export annulé', 'Export cancelled')));
    if (ev.type === 'import') {
      if (!ev.ok) return snack(ev.msg || L('Import annulé', 'Import cancelled'));
      var d; try { d = JSON.parse(ev.data); } catch (e) { return snack(L('Fichier illisible', 'Unreadable file')); }
      if (!d || d.app !== 'tope') return snack(L('Ce n’est pas une sauvegarde Topé', 'That’s not a Topé backup'));
      var okDate = function (x) { return x && /^\d{4}-\d{2}-\d{2}$/.test(x.date) && !isNaN(C.dayNum(x.date)); };
      var okH = function (h) { return /^\d{2}:\d{2}$/.test(h || '') ? h : undefined; };
      var ach = (Array.isArray(d.achats) ? d.achats : []).filter(function (x) { return okDate(x) && +x.g > 0; }).map(function (x) {
        return { id: String(x.id || uid()), date: x.date, heure: okH(x.heure), g: +x.g, eur: Math.max(0, +x.eur || 0), reste: x.reste != null && x.reste !== '' && !isNaN(+x.reste) ? Math.max(0, +x.reste) : null, note: x.note ? String(x.note).slice(0, 60) : undefined };
      });
      var pes = (Array.isArray(d.pesees) ? d.pesees : []).filter(function (x) { return okDate(x) && +x.g >= 0; }).map(function (x) {
        return { id: String(x.id || uid()), date: x.date, heure: okH(x.heure), g: +x.g };
      });
      var skipped = ((d.achats || []).length + (d.pesees || []).length) - (ach.length + pes.length);
      data.achats = ach; data.pesees = pes;
      if (skipped > 0) setTimeout(function () { snack(L(skipped + ' entrée(s) illisible(s) ignorée(s)', skipped + ' unreadable entr' + (skipped > 1 ? 'ies' : 'y') + ' skipped')); }, 2800);
      save(); render(false); snack(L('Sauvegarde restaurée : ' + data.achats.length + ' achats', 'Backup restored: ' + data.achats.length + ' buys'));
    }
    if (ev.type === 'insets') {
      var st = document.documentElement.style;
      st.setProperty('--sat', (ev.top || 0) + 'px'); st.setProperty('--sab', (ev.bottom || 0) + 'px');
      st.setProperty('--sal', (ev.left || 0) + 'px'); st.setProperty('--sar', (ev.right || 0) + 'px');
      st.setProperty('--kb', (ev.kb || 0) + 'px');
      document.documentElement.classList.toggle('kb-open', (ev.kb || 0) > 0);
      return;
    }
    if (ev.type === 'resume') { applyTheme(); lastWidget = ''; render(false); }
    if (ev.type === 'action' && (ev.k === 'achat' || ev.k === 'pesee')) {
      if (dlgResolve) closeDialog(null);
      if (state.tab !== 'home') go('home');
      openEntry(ev.k);
    }
    if (ev.type === 'notifperm') {
      render(false);
      snack(ev.ok ? L('Rappels activés 🔔', 'Reminders on 🔔') : NOTIF_DENIED());
    }
    if (ev.type === 'bg') {
      if (!ev.ok) return snack(ev.msg || L('Aucune image choisie', 'No picture picked'));
      bgUrl = null; data.settings.bg = 'image'; save(); applyTheme(); render(false); snack(L('Fond appliqué 🖼️', 'Background set 🖼️'));
    }
  };

  // ---------------------------------------------------------------- events
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act],[data-tab]');
    if (!el) return;
    if (el.dataset.tab) { if (el.dataset.tab !== state.tab) go(el.dataset.tab); return; }
    var act = el.dataset.act, k = el.dataset.k;
    switch (act) {
      case 'new': openEntry(k, null, el.dataset.date); break;
      case 'edit': openEntry(k, el.dataset.id); break;
      case 'kind': keepForm(); form.kind = k; form.edit = null; drawSheet(); restoreDraft(); break;
      case 'qg': $('#f-g').value = el.dataset.v; updHint(); break;
      case 'reste': keepForm(); form.showReste = true; drawSheet(); restoreDraft(); setTimeout(function () { $('#f-reste').focus(); }, 50); break;
      case 'close': closeSheet(); break;
      case 'notime': $('#f-time').value = ''; form.heure = ''; form.autoTime = false; break;
      case 'saveentry': saveEntry(); break;
      case 'delentry':
        var f = form;
        dialog({ title: L('Supprimer ?', 'Delete?'), text: L('Cette saisie disparaît pour de bon.', 'This entry will be gone for good.'), ok: L('Supprimer', 'Delete'), danger: true }).then(function (ok) {
          if (!ok) return;
          var arr = f.kind === 'achat' ? data.achats : data.pesees;
          for (var i = 0; i < arr.length; i++) if (arr[i].id === f.edit.id) { arr.splice(i, 1); break; }
          save(); closeSheet(); render(false); snack(pick(q('del')));
        });
        break;
      case 'all': state.showAll = !state.showAll; render(false); break;
      case 'mprev': case 'mnext':
        state.calM += act === 'mprev' ? -1 : 1;
        if (state.calM < 0) { state.calM = 11; state.calY--; } if (state.calM > 11) { state.calM = 0; state.calY++; }
        state.calSel = null; render('cal'); break;
      case 'day': state.calSel = +el.dataset.d; render(false); break;
      case 'range': state.range = k; render('charts'); break;
      case 'theme': data.settings.theme = k; save(); applyTheme(); render(false); break;
      case 'sub': data.settings.sub = k; save(); lastWidget = ''; render(false); break;
      case 'subcustom':
        dialog({ title: L('Ton nom à toi', 'Your own name'), text: L('Comment tu l’appelles ?', 'What do you call it?'), inputs: [{ label: L('Nom', 'Name'), type: 'text' }], ok: L('Garder', 'Keep') }).then(function (vals) {
          if (!vals) return; var n = (vals[0] || '').trim().slice(0, 30); if (!n) return;
          data.settings.sub = 'custom'; data.settings.subCustom = n; save(); lastWidget = ''; render(false);
        }); break;
      case 'mat':
        data.settings.mat = k; save(); applyTheme(); render(false);
        if (k !== 'plein') snack(k === 'glass' ? L('Verre liquide activé ✨', 'Liquid glass on ✨') : L('Mica activé 🪟', 'Mica on 🪟'));
        break;
      case 'bg':
        if (k === 'image' && !(bgUrl || loadBg())) { pickBg(); break; }
        data.settings.bg = k; save(); applyTheme(); render(false); break;
      case 'bgpick': pickBg(); break;
      case 'widgethide': data.settings.widgetHide = !data.settings.widgetHide; save(); lastWidget = ''; render(false);
        snack(data.settings.widgetHide ? L('Widget en mode discret 🤫', 'Widget in discreet mode 🤫') : L('Chiffres visibles sur le widget', 'Numbers visible on the widget')); break;
      case 'rem': var r0 = getRem(); setRem(!r0.on, r0.days, r0.time); break;
      case 'remdays': var r1 = getRem(); setRem(true, +k, r1.time); break;
      case 'pattern': data.settings.pattern = data.settings.pattern === false; save(); applyTheme(); render(false); break;
      case 'adv': go('adv'); break;
      case 'help': go('help'); break;
      case 'link': openLink(k); break;
      case 'lang':
        data.settings.lang = k; save(); setLang(k); go('set');
        snack(L('Langue : français 🇫🇷', 'Language: English 🇬🇧')); break;
      case 'intro': openOb(); break;
      case 'oblang':
        data.settings.lang = k; save(); setLang(k);
        var keep = ob.i; obRender(); obGo(keep, true); go(state.tab); break;
      case 'obnext': obNext(); break;
      case 'obprev': if (ob) obGo(ob.i - 1); break;
      case 'obskip': obDone(); break;
      case 'obbuy': obPlay('buy', true); break;
      case 'obweigh': obPlay('weigh', true); break;
      case 'obcalc': obPlay('calc', true); break;
      case 'obcell': obCell(+el.dataset.i); break;
      case 'obmat':
        var lk = el.closest('.obl'); lk.className = 'obl m-' + k;
        el.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === el); }); break;
      case 'obhue': el.closest('.obl').style.setProperty('--dh', k); break;
      case 'advback': go('set'); break;
      case 'gyro':
        data.settings.gyro = data.settings.gyro !== true; save();
        if (!data.settings.gyro) { var rs = document.documentElement.style; rs.removeProperty('--la'); rs.removeProperty('--lx'); rs.removeProperty('--ly'); }
        render(false); break;
      case 'advreset':
        dialog({ title: L('Tout remettre ?', 'Reset everything?'), text: L('Les potards reviennent à leurs réglages d’origine.', 'The knobs go back to their original settings.'), ok: L('Remettre', 'Reset') }).then(function (v) {
          if (v === null || v === false) return;
          data.settings.adv = {}; save(); applyTheme(); render(false); snack(L('Retour aux réglages d’usine.', 'Back to factory settings.'));
        }); break;
      case 'calm': data.settings.calm = !data.settings.calm; save(); applyTheme(); render(false); break;
      case 'hue':
        var prev = { color: data.settings.color, hue: data.settings.hue };
        dialog({ title: L('Ta couleur', 'Your colour'), text: L('Fais glisser pour choisir la teinte de toute l’appli.', 'Slide to pick the hue for the whole app.'),
          inputs: [{ label: L('Teinte', 'Hue'), type: 'range', attrs: 'class="huebar" min="0" max="359" value="' + (+data.settings.hue || 0) + '"' }], ok: L('Garder', 'Keep') })
          .then(function (vals) {
            if (!vals) { data.settings.color = prev.color; data.settings.hue = prev.hue; }
            save(); applyTheme(); render(false);
          });
        break;
      case 'color': data.settings.color = k; save(); applyTheme(); render(false); break;
      case 'lock':
        if (!NATIVE) { snack(L('Dispo dans l’appli Android', 'Available in the Android app')); break; }
        var want = !nget('isLock', false), ok = Android.setLock(want);
        if (want && !ok) snack(L('Active d’abord un verrouillage d’écran sur ton téléphone', 'Set up a screen lock on your phone first'));
        else snack(want ? L('Verrouillage activé 🔒', 'Lock on 🔒') : L('Verrouillage désactivé', 'Lock off'));
        render(false); break;
      case 'secure':
        if (!NATIVE) { snack(L('Dispo dans l’appli Android', 'Available in the Android app')); break; }
        var sec = !nget('isSecure', true); Android.setSecure(sec);
        snack(sec ? L('Captures bloquées 🔒', 'Screenshots blocked 🔒') : L('Captures autorisées', 'Screenshots allowed')); render(false); break;
      case 'discret':
        if (!NATIVE) { snack(L('Dispo dans l’appli Android', 'Available in the Android app')); break; }
        var wd = !nget('isDiscreet', false); Android.setDiscreet(wd);
        snack(wd ? L('L’icône devient « Carnet » (quelques secondes)', 'The icon becomes “Notebook” (a few seconds)') : L('L’icône Topé revient', 'The Topé icon is back'));
        render(false); break;
      case 'export': doExport(); break;
      case 'import': doImport(); break;
      case 'wipe':
        dialog({ title: L('Tout effacer ?', 'Erase everything?'), text: L('Tous les achats et toutes les pesées seront supprimés. Exporte une sauvegarde avant si tu veux les garder.', 'All buys and weigh-ins will be deleted. Export a backup first if you want to keep them.'), ok: L('Tout effacer', 'Erase everything'), danger: true })
          .then(function (ok) { if (!ok) return; data.achats = []; data.pesees = []; save(); render(false); snack(L('Carnet remis à zéro', 'Book reset')); });
        break;
      case 'dlgok':
        var vals = []; for (var i2 = 0; i2 < (dialog.count || 0); i2++) vals.push($('#dlg-' + i2).value);
        closeDialog(dialog.count ? vals : true); break;
      case 'dlgno': closeDialog(null); break;
    }
  });
  function restoreDraft() {
    var o = form && form.draft; if (!o) return;
    if (o.g != null && $('#f-g')) $('#f-g').value = o.g;
    if (o.eur != null && $('#f-eur')) $('#f-eur').value = o.eur;
    if (o.reste != null && $('#f-reste')) $('#f-reste').value = o.reste;
    if (o.note != null && $('#f-note')) $('#f-note').value = o.note;
    if ($('#f-date')) $('#f-date').value = form.date;
    if ($('#f-time')) $('#f-time').value = form.heure || '';
    updHint();
  }
  document.addEventListener('input', function (e) {
    if (e.target.id === 'f-g' || e.target.id === 'f-eur') updHint();
    if (e.target.classList && e.target.classList.contains('potr')) {
      var pk = e.target.dataset.k, pp = POT[pk], pval = +e.target.value;
      data.settings.adv = data.settings.adv || {}; data.settings.adv[pk] = pval;
      e.target.style.setProperty('--p', ((pval - pp.min) / (pp.max - pp.min) * 100).toFixed(1) + '%');
      var lab = document.getElementById('pv-' + pk); if (lab) lab.textContent = pval + unit(pp.u);
      if (pk === 'patA') applyTheme(); else applyAdv();
      if (pk === 'shV') shWake();
      if (pk === 'gLens' || pk === 'gPrism') { clearTimeout(applyLens.t); applyLens.t = setTimeout(applyLens, 60); }
    }
    if (e.target.classList && e.target.classList.contains('huebar')) { data.settings.color = 'custom'; data.settings.hue = +e.target.value; applyTheme(); }
  });
  document.addEventListener('change', function (e) {
    if (form && e.target.id === 'f-time') form.autoTime = false;
    if (form && e.target.id === 'f-date' && form.autoTime && $('#f-time')) {
      var nw = new Date(), isToday = e.target.value === C.dayStr(C.todayNum());
      $('#f-time').value = isToday ? ('0' + nw.getHours()).slice(-2) + ':' + ('0' + nw.getMinutes()).slice(-2) : '';
      form.heure = $('#f-time').value;
    }
    if (e.target.classList && e.target.classList.contains('potr')) save();
    if (e.target.id === 'rem-time' && /^\d{2}:\d{2}/.test(e.target.value)) { var r = getRem(); setRem(true, r.days, e.target.value.slice(0, 5)); }
  });
  // ---- reminders (stored on the native side: the system must be able to reschedule them without opening the app)
  function NOTIF_DENIED() { return L('Notifications refusées : autorise-les dans les réglages Android', 'Notifications blocked: allow them in Android settings'); }
  function getRem() {
    var d = { on: false, days: 2, time: '20:00' };
    try { if (NATIVE && Android.getReminder) return Object.assign(d, JSON.parse(Android.getReminder())); } catch (e) { }
    return Object.assign(d, data.settings.rem || {});
  }
  function setRem(on, days, time) {
    data.settings.rem = { on: on, days: days, time: time }; save();
    if (NATIVE && Android.setReminder) {
      var st = Android.setReminder(on, days, time);
      if (st === 'asking') return;            // the answer comes back through onNative('notifperm')
      if (st === 'denied') { snack(NOTIF_DENIED()); render(false); return; }
    }
    render(false);
    if (on) snack(L('Rappel tous les ' + (days === 1 ? 'jours' : days + ' jours') + ' à ' + time.replace(':', 'h'), 'Reminder ' + (days === 1 ? 'every day' : 'every ' + days + ' days') + ' at ' + time));
  }
  // ---- widget: push a summary when the figures change
  var lastWidget = '';
  function pushWidget() {
    if (!NATIVE || !Android.updateWidget || !res) return;
    var cs = getComputedStyle(document.documentElement), col = function (n) { return rgbHex(resolveColor(cs.getPropertyValue('--' + n).trim())); };
    var lp = data.pesees.reduce(function (m, p) { var k = p.date + 'T' + (p.heure || '23:59'); return k > m ? k : m; }, '');
    var w = { empty: res.empty, notEnough: res.notEnough, stock: res.stock, rate: res.rate, avg30: res.avg30, month: res.monthSpend, daysLeft: res.daysLeft,
      rupture: res.ruptureDay != null ? dl(res.ruptureDay) : null, hide: !!data.settings.widgetHide, lastPesee: lp, subDe: subName().de, lang: LANG,
      c: { bg: col('surface-c'), fg: col('on-surface'), sub: col('on-surface-variant'), hero: col('primary-container'), onHero: col('on-primary-container'),
        acc: col('primary'), onAcc: col('on-primary'), ton: col('secondary-container'), onTon: col('on-secondary-container') } };
    var key = JSON.stringify(w);
    if (key === lastWidget) return;
    lastWidget = key; w.at = Date.now();
    try { Android.updateWidget(JSON.stringify(w)); } catch (e) { }
  }
  function resolveColor(c) {
    var pr = document.createElement('div'); pr.style.color = c; document.body.appendChild(pr);
    var out = getComputedStyle(pr).color; pr.remove(); return out;
  }
  function pickBg() {
    if (NATIVE) { try { Android.pickBackground(); } catch (e) { snack(L('Impossible d’ouvrir les images', 'Can’t open pictures')); } return; }
    $('#bgfile').click();
  }
  // Browser fallback: downscale the image in a canvas, then keep it locally
  $('#bgfile').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    var img = new Image(), url = URL.createObjectURL(f);
    img.onload = function () {
      var k = Math.min(1, 1440 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      try { localStorage.setItem('tope_bg', c.toDataURL('image/jpeg', 0.82)); } catch (e) { return snack(L('Image trop lourde', 'Picture too heavy')); }
      bgUrl = null; data.settings.bg = 'image'; save(); applyTheme(); render(false); snack(L('Fond appliqué 🖼️', 'Background set 🖼️'));
    };
    img.src = url; this.value = '';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && form && e.target.tagName === 'INPUT') { e.preventDefault(); saveEntry(); }
    if (e.key === 'Enter' && dlgResolve && e.target.id && e.target.id.indexOf('dlg-') === 0) {
      var vals = []; for (var i = 0; i < (dialog.count || 0); i++) vals.push($('#dlg-' + i).value); closeDialog(vals);
    }
  });
  $('#scrim').addEventListener('click', closeSheet);
  $('#dscrim').addEventListener('click', function () { closeDialog(null); });

  // The title stays fixed behind: main starts just below it and cards scroll over it.
  var topH = 96;
  function measureTop() {
    var tb = document.querySelector('.topbar'); if (!tb) return;
    topH = Math.ceil(tb.getBoundingClientRect().height);
    fadeLoose();
  }
  // Only panels pass over the title: loose text (subheadings, captions…) fades out as it reaches it.
  var LOOSE = ':scope > :is(.section-t,.cap,.about,.back,.empty,.btn.text)';
  function fadeLoose() {
    var w = $('#main').firstElementChild; if (!w) return;
    var els = w.querySelectorAll(LOOSE), lim = topH + 8;
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect(), f = (r.top - (lim - 30)) / 30;
      f = f >= 1 ? '' : f <= 0 ? '0' : f.toFixed(2);
      if (els[i].style.opacity !== f) els[i].style.opacity = f;
    }
  }
  $('#main').addEventListener('scroll', function () {
    if (fadeLoose.raf) return;
    fadeLoose.raf = requestAnimationFrame(function () { fadeLoose.raf = 0; fadeLoose(); });
  }, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(measureTop).observe(document.querySelector('.topbar'));
  window.addEventListener('resize', measureTop);

  // ---------------------------------------------------------------- onboarding (first launch)
  // 7 screens: hello + language, disclaimer, then 5 interactive mini demos.
  // Everything animates with transform/opacity (GPU); numbers count up with requestAnimationFrame.
  var ob = null;
  var OB_N = 7;
  function obCount(el, from, to, dur, fmt) {
    if (!el) return;
    var t0 = performance.now(), quiet = calm();
    if (quiet) { el.textContent = fmt(to); return; }
    (function step(t) {
      var p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1 && el.isConnected) requestAnimationFrame(step);
    })(t0);
  }
  function obLater(fn, ms) { if (!ob) return; ob.timers.push(setTimeout(fn, ms)); }
  function obClear() { if (!ob) return; ob.timers.forEach(clearTimeout); ob.timers = []; }
  function obRestart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function obSlides() {
    var leaf = '<svg viewBox="0 0 100 100" class="ob-leaf"><ellipse cx="50" cy="66.0" rx="4.6" ry="22.0" transform="rotate(-78 50 88)"/><ellipse cx="50" cy="58.0" rx="5.9" ry="30.0" transform="rotate(-52 50 88)"/><ellipse cx="50" cy="51.2" rx="7.0" ry="36.8" transform="rotate(-26 50 88)"/><ellipse cx="50" cy="48.0" rx="7.5" ry="40.0" transform="rotate(0 50 88)"/><ellipse cx="50" cy="51.2" rx="7.0" ry="36.8" transform="rotate(26 50 88)"/><ellipse cx="50" cy="58.0" rx="5.9" ry="30.0" transform="rotate(52 50 88)"/><ellipse cx="50" cy="66.0" rx="4.6" ry="22.0" transform="rotate(78 50 88)"/><rect x="48.5" y="84" width="3" height="14" rx="1.5"/></svg>';
    var s = [];
    // 0 — hello
    s.push('<div class="obs" data-s="hello"><div class="ob-art"><div class="ob-halo"></div>' + leaf +
      '<div class="ob-logo">' + 'Topé'.split('').map(function (c, i) { return '<span style="--i:' + i + '">' + c + '</span>'; }).join('') + '</div></div>' +
      '<h2>' + L('Salut !', 'Hey there!') + '</h2><p>' + L('Topé, c’est le carnet de ta conso : tu notes ce que tu achètes, l’appli fait les calculs.', 'Topé is your consumption logbook: you note what you buy, the app does the maths.') + '</p>' +
      '<div class="seg mini ob-lang">' + [['fr', 'Français'], ['en', 'English']].map(function (x) {
        return '<button data-act="oblang" data-k="' + x[0] + '" class="' + (LANG === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div></div>');
    // 1 — disclaimer
    s.push('<div class="obs" data-s="warn"><div class="ob-art"><div class="ob-badge">' + ic('info') + '</div></div>' +
      '<h2>' + L('Avant de commencer', 'Before you start') + '</h2>' +
      '<p><b>' + L('Topé n’incite pas à consommer.', 'Topé doesn’t encourage consumption.') + '</b> ' +
      L('C’est un outil de suivi : il t’aide à y voir clair sur ta conso. Ce que tu en fais te regarde.', 'It’s a tracking tool: it helps you see your use clearly. What you do with that is your call.') + '</p>' +
      '<p>' + L('Réservé aux personnes majeures. Le cannabis est encadré par la loi, et elle change d’un pays à l’autre.', 'Adults only. Cannabis is regulated by law, and the rules change from one country to another.') + '</p>' +
      '<p class="ob-small">' + L('Envie d’en parler à quelqu’un ? Drogues Info Service : 0 800 23 13 13, gratuit et anonyme.', 'Want to talk to someone? Look for a local drug info line (in France: Drogues Info Service, 0 800 23 13 13).') + '</p></div>');
    // 2 — purchases
    s.push('<div class="obs" data-s="buy"><div class="ob-art"><div class="obp">' +
      '<div class="obp-hero"><span>' + L('Stock', 'Stash') + '</span><b><i class="obp-stock">' + NF1.format(2.5) + '</i> g</b></div>' +
      '<div class="obp-win"><div class="obp-list">' +
        '<div class="obp-row obp-new">' + ic('cart') + '<span>10 g · 80 €</span><em>' + L('à l’instant', 'just now') + '</em></div>' +
        '<div class="obp-row">' + ic('scale') + '<span>' + L('Pesée', 'Weigh-in') + ' · ' + NF1.format(2.5) + ' g</span><em>' + L('hier', 'yesterday') + '</em></div>' +
        '<div class="obp-row">' + ic('cart') + '<span>5 g · 40 €</span><em>' + L('lun.', 'Mon') + '</em></div>' +
        '<div class="obp-row">' + ic('cart') + '<span>10 g · 75 €</span><em>' + L('il y a 9 j', '9 days ago') + '</em></div>' +
      '</div></div>' +
      '<button class="obp-btn" data-act="obbuy">' + ic('cart') + L('J’ai topé', 'Scored') + '</button>' +
      '<div class="obp-sheet"><div class="obp-f"><small>' + L('Combien', 'How much') + '</small><b><i class="obp-g">0</i> g</b></div><div class="obp-f"><small>' + L('Pour combien', 'For how much') + '</small><b><i class="obp-e">0</i> €</b></div></div>' +
      '</div></div>' +
      '<h2>' + L('Note tes achats', 'Log your buys') + '</h2><p>' + L('Un appui sur « J’ai topé » : les grammes, le prix, c’est noté. Pas besoin de compter chaque joint.', 'One tap on “Scored”: grams, price, done. No need to count every joint.') + '</p>' +
      '<div class="ob-hint">' + L('Essaie : appuie sur le bouton', 'Try it: tap the button') + '</div></div>');
    // 3 — weigh-in
    s.push('<div class="obs" data-s="weigh"><div class="ob-art" data-act="obweigh"><div class="obw">' +
      '<div class="obw-piece"><i></i><i></i><i></i></div><div class="obw-plate"></div>' +
      '<div class="obw-body"><div class="obw-screen"><i class="obw-v">0' + (LANG === 'en' ? '.' : ',') + '00</i> g</div></div></div></div>' +
      '<h2>' + L('Pèse si tu veux', 'Weigh if you like') + '</h2><p>' + L('Pèse ce qui te reste, le soir par exemple : tes stats deviennent exactes, jour par jour. Rien n’est inventé entre deux mesures.', 'Weigh what’s left, say every evening: your stats become exact, day by day. Nothing is made up between two readings.') + '</p>' +
      '<div class="ob-hint">' + L('Touche la balance', 'Tap the scale') + '</div></div>');
    // 4 — calculation
    var bars = ''; for (var i = 0; i < 18; i++) bars += '<i style="--i:' + i + '"></i>';
    s.push('<div class="obs" data-s="calc"><div class="ob-art" data-act="obcalc"><div class="obc">' +
      '<div class="obc-l">' + L('Conso · 30 jours', 'Use · 30 days') + '</div><div class="obc-big"><i class="obc-v">0</i><small>' + GJ() + '</small></div>' +
      '<div class="obc-sub"><i class="obc-e">0</i> ' + L('€ par jour', '€ a day') + ' · <span class="obc-tr"></span></div><div class="obc-bars">' + bars + '</div></div></div>' +
      '<h2>' + L('Le calcul se fait tout seul', 'The maths does itself') + '</h2><p>' + L('Entre deux mesures (achats, pesées), Topé répartit ce qui est parti sur les jours : moyenne, € par jour, tendance.', 'Between two readings (buys, weigh-ins), Topé spreads what’s gone over the days: average, € a day, trend.') + '</p>' +
      '<div class="ob-hint">' + L('Touche la carte pour simuler un autre mois', 'Tap the card to simulate another month') + '</div></div>');
    // 5 — calendar
    var cells = ''; for (var c = 0; c < 35; c++) cells += '<button class="obk-c" data-act="obcell" data-i="' + c + '" style="--i:' + c + '"></button>';
    s.push('<div class="obs" data-s="cal"><div class="ob-art"><div class="obk"><div class="obk-g">' + cells + '</div><div class="obk-tip"></div></div></div>' +
      '<h2>' + L('Calendrier et graphiques', 'Calendar and charts') + '</h2><p>' + L('Chaque jour a sa case : plus elle est foncée, plus ça a fumé. Les graphiques montrent la tendance et ce que ça coûte.', 'Every day gets a square: the darker, the smokier. Charts show the trend and what it costs.') + '</p>' +
      '<div class="ob-hint">' + L('Touche une case', 'Tap a square') + '</div></div>');
    // 6 — customization
    s.push('<div class="obs" data-s="look"><div class="ob-art"><div class="obl m-glass"><i class="obl-b1"></i><i class="obl-b2"></i>' +
      '<div class="obl-card"><small>' + L('Aperçu', 'Preview') + '</small><b>' + NFg2.format(1.27) + ' <span>' + GJ() + '</span></b></div>' +
      '<div class="obl-ctl"><div class="obl-mats">' + MATS().map(function (x) { return '<button data-act="obmat" data-k="' + x[0] + '" class="' + (x[0] === 'glass' ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="obl-sw">' + [140, 272, 28, 212, 335].map(function (h0) { return '<button data-act="obhue" data-k="' + h0 + '" style="background:' + hsl(h0, 52, 52) + '"></button>'; }).join('') + '</div></div></div></div>' +
      '<h2>' + L('À ta sauce', 'Make it yours') + '</h2><p>' + L('Thème, couleurs, Mica, Verre liquide, le nom de ta substance, rappels, widgets : tout se règle dans Réglages.', 'Theme, colours, Mica, Liquid glass, what you call it, reminders, widgets: it’s all in Settings.') + '</p>' +
      '<div class="ob-hint">' + L('Change la matière et la couleur', 'Switch the material and colour') + '</div></div>');
    return s;
  }
  function openOb() {
    obClear();
    ob = { i: 0, timers: [], ok: !!data.settings.onboarded };
    var el = $('#ob');
    el.innerHTML = '<div class="ob-bg"><i></i><i></i><i></i></div>' +
      '<button class="ob-skip" data-act="obskip"></button><div class="ob-track"></div>' +
      '<div class="ob-foot"><button class="ob-prev" data-act="obprev" aria-label="' + L('Retour', 'Back') + '">' + ic('left') + '</button><div class="ob-dots"></div>' +
      '<button class="btn filled ob-next" data-act="obnext"></button></div>';
    obRender();
    el.classList.remove('out'); el.classList.add('on');
    document.documentElement.classList.add('ob-open');
    obGo(0, true);
    obSwipe(el.querySelector('.ob-track'));
    el.scrollLeft = 0;
  }
  function obRender() {
    var el = $('#ob');
    el.querySelector('.ob-track').innerHTML = obSlides().join('');
    el.querySelector('.ob-dots').innerHTML = Array.apply(null, Array(OB_N)).map(function (_, i) { return '<i data-i="' + i + '"></i>'; }).join('');
  }
  function obGo(i, first) {
    if (!ob) return;
    if (i > 1 && !ob.ok) i = 1;                               // the disclaimer has to be read
    ob.i = Math.max(0, Math.min(OB_N - 1, i));
    obClear();
    var el = $('#ob'), tr = el.querySelector('.ob-track');
    tr.style.transform = 'translate3d(' + (-ob.i * 100) + '%,0,0)';
    el.querySelectorAll('.obs').forEach(function (s, k) { s.classList.toggle('play', k === ob.i); s.setAttribute('aria-hidden', k === ob.i ? 'false' : 'true'); });
    el.querySelectorAll('.ob-dots i').forEach(function (d, k) { d.classList.toggle('on', k === ob.i); d.classList.toggle('done', k < ob.i); });
    el.querySelector('.ob-prev').classList.toggle('hide', ob.i === 0);
    var sk = el.querySelector('.ob-skip'); sk.textContent = L('Passer', 'Skip'); sk.classList.toggle('hide', ob.i < 2 || ob.i === OB_N - 1);
    el.querySelector('.ob-next').textContent = ob.i === 1 && !ob.ok ? L('J’ai compris', 'Got it') : ob.i === OB_N - 1 ? L('C’est parti !', 'Let’s go!') : L('Suivant', 'Next');
    var name = el.querySelectorAll('.obs')[ob.i].dataset.s;
    obLater(function () { obPlay(name, false); }, first ? 350 : 420);
  }
  function obPlay(name, user) {
    if (!ob) return;
    var s = $('#ob').querySelectorAll('.obs')[ob.i];
    if (name === 'buy') obBuy(s, user);
    if (name === 'weigh') obWeigh(s);
    if (name === 'calc') obCalc(s);
    if (name === 'cal') obCal(s);
  }
  function obBuy(s, user) {
    var p = s.querySelector('.obp');
    p.classList.add('reset'); p.classList.remove('sheet', 'added'); void p.offsetWidth; p.classList.remove('reset');
    s.querySelector('.obp-stock').textContent = NF1.format(2.5);
    s.querySelector('.obp-g').textContent = '0'; s.querySelector('.obp-e').textContent = '0';
    if (!user) { obRestart(s.querySelector('.obp-btn'), 'pulse'); return; }
    s.querySelector('.obp-btn').classList.remove('pulse');
    p.classList.add('sheet');
    obLater(function () { obCount(s.querySelector('.obp-g'), 0, 10, 450, function (x) { return NF0.format(x); }); }, 300);
    obLater(function () { obCount(s.querySelector('.obp-e'), 0, 80, 450, function (x) { return NF0.format(x); }); }, 650);
    obLater(function () { p.classList.remove('sheet'); p.classList.add('added'); }, 1500);
    obLater(function () { obCount(s.querySelector('.obp-stock'), 2.5, 12.5, 700, function (x) { return NF1.format(x); }); }, 1700);
  }
  function obWeigh(s) {
    var w = s.querySelector('.obw'), v = 1.8 + Math.random() * 2.8, dec = function (x) { return NF2.format(x); };
    s.querySelector('.obw-v').textContent = dec(0);
    obRestart(w, 'drop');
    obLater(function () { obCount(s.querySelector('.obw-v'), 0, v, 650, dec); }, 520);
  }
  function obCalc(s) {
    var vals = [], sum = 0, base = 0.7 + Math.random() * 1.1;
    for (var i = 0; i < 18; i++) { var x = Math.max(0.08, base * (0.55 + Math.random() * 0.9)); vals.push(x); sum += x; }
    var mx = Math.max.apply(null, vals), avg = sum / vals.length, ppg = 6.5 + Math.random() * 2.5;
    s.querySelectorAll('.obc-bars i').forEach(function (b, k) { b.style.setProperty('--h', (vals[k] / mx).toFixed(3)); });
    var c = s.querySelector('.obc'); obRestart(c, 'go');
    var prev = ob.lastAvg || avg * 1.1; ob.lastAvg = avg;
    obCount(s.querySelector('.obc-v'), 0, avg, 800, function (x) { return NF2.format(x); });
    obCount(s.querySelector('.obc-e'), 0, avg * ppg, 800, function (x) { return NF2.format(x); });
    var tr = Math.round((avg / prev - 1) * 100);
    s.querySelector('.obc-tr').textContent = Math.abs(tr) < 3 ? L('→ stable', '→ steady') : (tr < 0 ? '↘ ' : '↗ ') + Math.abs(tr) + (LANG === 'en' ? '%' : ' %');
  }
  function obCal(s) {
    ob.cal = [];
    s.querySelectorAll('.obk-c').forEach(function (c, k) {
      var r = Math.random(), lv = k > 30 ? 0 : r < 0.18 ? 0 : r < 0.45 ? 1 : r < 0.72 ? 2 : r < 0.9 ? 3 : 4;
      ob.cal.push(lv ? +(lv * 0.45 + Math.random() * 0.4).toFixed(2) : 0);
      c.style.background = lv ? 'color-mix(in srgb,var(--primary) ' + HEAT[lv] + '%,var(--surface-high))' : 'var(--surface-high)';
      c.classList.toggle('lit', lv >= 3);
      c.textContent = k < 31 ? k + 1 : '';
    });
    obRestart(s.querySelector('.obk'), 'go');
    s.querySelector('.obk-tip').classList.remove('on');
  }
  function obCell(i) {
    var s = $('#ob').querySelectorAll('.obs')[ob.i], c = s.querySelectorAll('.obk-c')[i], tip = s.querySelector('.obk-tip');
    if (!c || i > 30 || !ob.cal) return;
    s.querySelectorAll('.obk-c.sel').forEach(function (x) { x.classList.remove('sel'); });
    c.classList.add('sel');
    tip.textContent = ob.cal[i] ? NF2.format(ob.cal[i]) + ' g' : L('pause', 'break');
    tip.style.left = (c.offsetLeft + c.offsetWidth / 2) + 'px'; tip.style.top = c.offsetTop + 'px';
    obRestart(tip, 'on');
  }
  function obSwipe(tr) {
    var x0 = null, y0 = 0, dx = 0, lock = null, w = 1;
    tr.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-act]')) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; lock = null; w = tr.offsetWidth || 1;
    });
    tr.addEventListener('pointermove', function (e) {
      if (x0 == null) return;
      var ddx = e.clientX - x0, ddy = e.clientY - y0;
      if (lock == null && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) lock = Math.abs(ddx) > Math.abs(ddy);
      if (!lock) return;
      dx = ddx;
      if ((ob.i === 0 && dx > 0) || (ob.i === OB_N - 1 && dx < 0) || (ob.i === 1 && !ob.ok && dx < 0)) dx *= 0.3;   // edge resistance
      tr.classList.add('drag');
      tr.style.transform = 'translate3d(calc(' + (-ob.i * 100) + '% + ' + dx + 'px),0,0)';
    });
    var end = function () {
      if (x0 == null) return;
      x0 = null; tr.classList.remove('drag');
      if (lock && Math.abs(dx) > w * 0.18) obGo(ob.i + (dx < 0 ? 1 : -1));
      else if (lock) obGo(ob.i);
    };
    tr.addEventListener('pointerup', end); tr.addEventListener('pointercancel', end);
  }
  function obNext() {
    if (!ob) return;
    if (ob.i === 1 && !ob.ok) ob.ok = true;
    if (ob.i === OB_N - 1) return obDone();
    obGo(ob.i + 1);
  }
  function obDone() {
    data.settings.onboarded = 1; save();
    obClear(); ob = null;
    var el = $('#ob'); el.classList.add('out');
    document.documentElement.classList.remove('ob-open');
    setTimeout(function () { el.classList.remove('on', 'out'); el.innerHTML = ''; }, 450);
    go('home');
  }

  // Android back button: true = handled here
  window.onBack = function () {
    if (ob) { if (ob.i > 0) { obGo(ob.i - 1); return true; } return false; }
    if (dlgResolve) { closeDialog(null); return true; }
    if (form) { closeSheet(); return true; }
    if (state.tab === 'adv' || state.tab === 'help') { go('set'); return true; }
    if (state.tab !== 'home') { go('home'); return true; }
    return false;
  };
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', function () { applyTheme(); });
  }

  // ---------------------------------------------------------------- startup
  load();
  applyTheme();
  go('home');
  if (!data.settings.onboarded) openOb();
  // test hook: reloads the data (and closes the onboarding if it's open)
  window.__tope = { data: function () { return data; }, reload: function () {
    load(); applyTheme();
    if (ob) { obClear(); ob = null; $('#ob').classList.remove('on'); $('#ob').innerHTML = ''; document.documentElement.classList.remove('ob-open'); }
    go(state.tab);
  } };
})();
