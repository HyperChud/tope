/* Topé — usage calculation engine.
 * Plain JS, no dependencies: used by the app and testable under Node.
 *
 * Model:
 *  - achat (purchase)  {id, date:'YYYY-MM-DD', g, eur, reste?:number|null, note?}
 *      placed in the middle of its day (t = day + 0.5).
 *      reste = what was left just before the purchase (optional).
 *      Without reste, nothing is assumed to be left.
 *  - pesee (weigh-in)  {id, date, g}  = measured stock, placed at the end of the day (t = day + 1),
 *      so after any purchase on the same day.
 *  - optional 'HH:MM' time on both: if set, t = day + time/24 (minute precision).
 * Between two known stock points, usage = stock after the 1st - stock before the 2nd,
 * spread evenly over time.
 */
(function (root) {
  'use strict';
  var DAY_MS = 86400000;

  function dayNum(s) {
    var p = s.split('-');
    return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / DAY_MS);
  }
  function dayStr(n) {
    return new Date(n * DAY_MS).toISOString().slice(0, 10);
  }
  function todayNum(now) {
    var d = now || new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
  }
  function num(x) { x = Number(x); return isFinite(x) ? x : 0; }
  function hourFrac(h, def) {
    var m = /^(\d{1,2}):(\d{2})/.exec(h || '');
    if (!m) return def;
    var f = (+m[1] * 60 + +m[2]) / 1440;
    return f >= 0 && f < 1 ? f : def;
  }

  function compute(data, today, frac) {
    if (today == null) {
      var nw = new Date(); today = todayNum(nw);
      if (frac == null) frac = (nw.getHours() * 60 + nw.getMinutes()) / 1440;
    }
    if (frac == null) frac = 1;
    var achats = (data && data.achats) || [];
    var pesees = (data && data.pesees) || [];

    var ev = [];
    achats.forEach(function (a) {
      var d = dayNum(a.date);
      ev.push({ kind: 'achat', t: d + hourFrac(a.heure, 0.5), day: d, src: a });
    });
    pesees.forEach(function (p) {
      var d = dayNum(p.date);
      ev.push({ kind: 'pesee', t: d + hourFrac(p.heure, 1), day: d, src: p });
    });
    ev.sort(function (x, y) { return x.t - y.t || String(x.src.id).localeCompare(String(y.src.id)); });

    var res = {
      today: today, empty: ev.length === 0,
      days: {},            // day -> {g, eur, est, achat, pesee}
      segments: [],
      stock: null, rate: null, ruptureDay: null, daysLeft: null, avgPrev: null, measuredTo: null, measuredDay: null,
      avg30: null, monthSpend: 0, monthGrams: 0,
      totalEur: 0, totalG: 0, ppgAvg: null,
      longestGap: null, firstDay: null,
      purchases: [], months: [], notEnough: true
    };
    if (res.empty) return res;
    res.firstDay = ev[0].day;

    function day(d) {
      return res.days[d] || (res.days[d] = { g: 0, eur: 0, est: false, achat: false, pesee: false });
    }
    function spread(t0, t1, g, ppg, est) {
      if (g <= 0) return;
      var eurTot = ppg != null ? g * ppg : 0;
      if (t1 - t0 <= 1e-9) {
        var dd = day(Math.floor(t0)); dd.g += g; dd.eur += eurTot; if (est) dd.est = true;
        return;
      }
      var len = t1 - t0;
      for (var d = Math.floor(t0); d < Math.ceil(t1); d++) {
        var ov = Math.min(t1, d + 1) - Math.max(t0, d);
        if (ov <= 0) continue;
        var o = day(d);
        o.g += g * ov / len;
        o.eur += eurTot * ov / len;
        if (est) o.est = true;
      }
    }

    var last = null;      // {t, stock}
    var ppg = null;       // price per gram of the current stock
    var lastAchatDay = null;
    ev.forEach(function (e) {
      if (e.kind === 'achat') {
        var a = e.src, g = num(a.g), eur = num(a.eur);
        var hasReste = a.reste != null && a.reste !== '';
        var before = hasReste ? Math.max(0, num(a.reste)) : 0;
        if (last) {
          var c = Math.max(0, last.stock - before);
          res.segments.push({ t0: last.t, t1: e.t, g: c, ppg: ppg, est: false, mesure: hasReste || last.mesure });
          spread(last.t, e.t, c, ppg, false);
        }
        var newPpg = g > 0 ? eur / g : null;
        // stock price: weighted average of what was left and the new purchase
        if (newPpg != null) ppg = (ppg != null && before > 0) ? (before * ppg + eur) / (before + g) : newPpg;
        last = { t: e.t, stock: before + g, mesure: hasReste, kind: 'achat' };
        var o = day(e.day); o.achat = true;
        res.totalEur += eur; res.totalG += g;
        res.purchases.push({ date: a.date, day: e.day, g: g, eur: eur, ppg: newPpg });
        if (lastAchatDay != null) {
          var gap = e.day - lastAchatDay;
          if (res.longestGap == null || gap > res.longestGap.days) res.longestGap = { days: gap, from: lastAchatDay, to: e.day };
        }
        lastAchatDay = e.day;
      } else {
        var p = e.src, s = Math.max(0, num(p.g));
        if (last) {
          var c2 = Math.max(0, last.stock - s);
          res.segments.push({ t0: last.t, t1: e.t, g: c2, ppg: ppg, est: false, mesure: true });
          spread(last.t, e.t, c2, ppg, false);
        }
        last = { t: e.t, stock: s, mesure: true, kind: 'pesee' };
        day(e.day).pesee = true;
      }
    });

    // Real data only: usage only exists between two known stock points
    // (purchase, purchase with "some was left", weigh-in). Nothing is simulated after the last point.
    function measured(a0, b0) {
      var gs = 0;
      res.segments.forEach(function (s) {
        var a = Math.max(s.t0, a0), b = Math.min(s.t1, b0);
        if (s.t1 > s.t0) { if (b > a) gs += s.g * (b - a) / (s.t1 - s.t0); }
        else if (s.t0 >= a0 && s.t0 <= b0) gs += s.g;
      });
      return gs;
    }
    // Average: the last 30 MEASURED days (window ending at the last stock point)
    var winStart = Math.max(ev[0].t, last.t - 30);
    var span = last.t - winStart;
    res.notEnough = res.segments.length === 0 || span < 1;
    if (!res.notEnough) { res.rate = measured(winStart, last.t) / span; res.avg30 = res.rate; res.avgSpan = span; }
    // the 30 measured days before that, for the trend (only if the history is complete)
    if (!res.notEnough && ev[0].t <= winStart - 30 + 1e-9) res.avgPrev = measured(winStart - 30, winStart) / 30;

    var now = today + frac;
    res.measuredTo = last.t;                                   // time of the last stock point
    res.measuredDay = Math.floor(last.t - 1e-9);               // last (at least partly) measured day
    res.stock = last.stock;                                    // last known stock, not an estimate
    res.stockKind = last.kind;
    res.stockMesure = last.mesure;
    res.currentPpg = ppg;
    // Projection (shown as such, never counted in the stats): "at this rate…"
    if (res.rate != null && res.rate > 0) {
      res.daysLeft = last.stock / res.rate - Math.max(0, now - last.t);
      if (res.daysLeft > 0) res.ruptureDay = Math.floor(now + res.daysLeft - 1e-9);
    }

    // Months
    var months = {};
    res.purchases.forEach(function (p) {
      var m = p.date.slice(0, 7);
      (months[m] || (months[m] = { month: m, eur: 0, g: 0, conso: 0 })).eur += p.eur;
      months[m].g += p.g;
    });
    Object.keys(res.days).forEach(function (k) {
      var m = dayStr(+k).slice(0, 7);
      (months[m] || (months[m] = { month: m, eur: 0, g: 0, conso: 0 })).conso += res.days[k].g;
    });
    res.months = Object.keys(months).sort().map(function (k) { return months[k]; });
    var curM = dayStr(today).slice(0, 7);
    if (months[curM]) { res.monthSpend = months[curM].eur; res.monthGrams = months[curM].g; }
    res.ppgAvg = res.totalG > 0 ? res.totalEur / res.totalG : null;
    return res;
  }

  /** Daily series [{day, g, est}] from `from` to `to` inclusive. */
  function series(res, from, to) {
    var out = [];
    for (var d = from; d <= to; d++) {
      var o = res.days[d];
      out.push({ day: d, g: o ? o.g : 0, eur: o ? o.eur : 0, est: o ? o.est : false });
    }
    return out;
  }
  /** Trailing rolling average over n days. */
  function rolling(arr, n) {
    var out = [], sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i];
      if (i >= n) sum -= arr[i - n];
      out.push(sum / Math.min(i + 1, n));
    }
    return out;
  }

  var api = { hourFrac: hourFrac, compute: compute, series: series, rolling: rolling, dayNum: dayNum, dayStr: dayStr, todayNum: todayNum };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(this);
