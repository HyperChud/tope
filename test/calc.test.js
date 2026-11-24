const C = require('../assets/calc.js');
const assert = require('assert');
const near = (a, b, e = 1e-6) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);
const D = C.dayNum;
let n = 0; const t = (name, f) => { f(); n++; console.log('ok -', name); };

t('empty', () => {
  const r = C.compute({ achats: [], pesees: [] }, D('2026-11-21'));
  assert.ok(r.empty); assert.strictEqual(r.stock, null);
});

t('single purchase: not enough data', () => {
  const r = C.compute({ achats: [{ id: 'a', date: '2026-11-20', g: 10, eur: 80 }], pesees: [] }, D('2026-11-21'));
  assert.ok(r.notEnough); assert.strictEqual(r.stock, 10); assert.strictEqual(r.avg30, null);
  near(r.monthSpend, 80); near(r.ppgAvg, 8);
});

t('doc example without weigh-in: 10 g over 7 days', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-08', g: 10, eur: 80 }], pesees: [] }, D('2026-11-08'));
  near(r.segments[0].g, 10); near(r.segments[0].t1 - r.segments[0].t0, 7);
  near(r.rate, 10 / 7);
  near(r.days[D('2026-11-03')].g, 10 / 7);
  near(r.days[D('2026-11-01')].g, 5 / 7);
  near(r.days[D('2026-11-03')].eur, 80 / 7);
  assert.strictEqual(r.longestGap.days, 7);
});

t('doc example with weigh-ins: 4 + 10 - 9 = 5 g over 4 days', () => {
  const r = C.compute({ achats: [{ id: 'a', date: '2026-11-18', g: 10, eur: 80 }],
    pesees: [{ id: 'p1', date: '2026-11-16', g: 4 }, { id: 'p2', date: '2026-11-20', g: 9 }] }, D('2026-11-20'));
  const tot = r.segments.reduce((s, x) => s + x.g, 0);
  near(tot, 5); near(r.segments.at(-1).t1 - r.segments[0].t0, 4);
  near(r.rate, 5 / 4); near(r.stock, 9);
});

t('leftover entered with the purchase', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-06', g: 10, eur: 100, reste: 3 }], pesees: [] }, D('2026-11-06'), 0.5);
  near(r.segments[0].g, 7);        // 10 - 3
  near(r.stock, 13);
  near(r.currentPpg, (3 * 8 + 100) / 13);
});

t('nothing simulated after the last point + projection', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-11', g: 10, eur: 80 }], pesees: [] }, D('2026-11-15'));
  near(r.rate, 1); near(r.avg30, 1);       // 10 g measured over 10 days
  near(r.stock, 10);                       // last known stock, no estimate
  assert.ok(!r.days[D('2026-11-14')]);     // no made-up days after the purchase
  near(r.daysLeft, 10 - 4.5);              // at this rate: 5.5 days of stock left
  assert.strictEqual(C.dayStr(r.ruptureDay), '2026-11-21');
  assert.strictEqual(C.dayStr(r.measuredDay), '2026-11-11');
});

t('weigh-in every evening: real day-by-day stats', () => {
  const r = C.compute({ achats: [{ id: 'a', date: '2026-11-10', heure: '18:00', g: 10, eur: 80 }],
    pesees: [{ id: 'p1', date: '2026-11-10', heure: '23:00', g: 9.5 }, { id: 'p2', date: '2026-11-11', heure: '23:00', g: 8.3 },
             { id: 'p3', date: '2026-11-12', heure: '23:00', g: 7.8 }] }, D('2026-11-13'), 0.6);
  near(r.segments.at(-1).g, 0.5); near(r.stock, 7.8);
  near(r.days[D('2026-11-12')].g, 0.5 * 23 / 24); near(r.days[D('2026-11-11')].g, 1.2 * 23 / 24 + 0.5 / 24);
  assert.ok(!r.days[D('2026-11-13')] || r.days[D('2026-11-13')].g === 0);
  assert.strictEqual(C.dayStr(r.measuredDay), '2026-11-12');
});

t('exhausted projection: no run-out date', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-10-01', g: 10, eur: 80 },
    { id: 'b', date: '2026-10-11', g: 5, eur: 40 }], pesees: [] }, D('2026-11-01'));
  near(r.stock, 5); assert.strictEqual(r.ruptureDay, null); assert.ok(r.daysLeft <= 0);
  assert.ok(!r.days[D('2026-10-25')]);
});

t('inconsistent weigh-in (more than expected): never negative', () => {
  const r = C.compute({ achats: [{ id: 'a', date: '2026-11-01', g: 5, eur: 40 }],
    pesees: [{ id: 'p', date: '2026-11-03', g: 7 }] }, D('2026-11-03'));
  near(r.segments[0].g, 0);
});

t('two purchases on the same day', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', g: 5, eur: 40 },
    { id: 'b', date: '2026-11-01', g: 5, eur: 40, reste: 5 },
    { id: 'c', date: '2026-11-11', g: 10, eur: 80 }], pesees: [] }, D('2026-11-11'));
  near(r.segments.reduce((s, x) => s + x.g, 0), 10);
  near(r.rate, 1);
});

t('months and rolling average', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-10-20', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-05', g: 10, eur: 90 }], pesees: [] }, D('2026-11-21'));
  assert.deepStrictEqual(r.months.map(m => m.month), ['2026-10', '2026-11']);
  near(r.monthSpend, 90);
  const roll = C.rolling([0, 2, 4, 6], 2); assert.deepStrictEqual(roll, [0, 1, 3, 5]);
});
t('exact times', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', heure: '08:00', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-02', heure: '20:00', g: 10, eur: 80 }], pesees: [] }, D('2026-11-02'), 20 / 24);
  near(r.segments[0].t1 - r.segments[0].t0, 1.5);
  near(r.rate, 10 / 1.5);
  near(r.days[D('2026-11-01')].g, 10 * (16 / 24) / 1.5);
});

t('timed weigh-in before a purchase on the same day', () => {
  const r = C.compute({ achats: [
    { id: 'a', date: '2026-11-01', g: 10, eur: 80 },
    { id: 'b', date: '2026-11-05', heure: '18:00', g: 10, eur: 80 }],
    pesees: [{ id: 'p', date: '2026-11-05', heure: '09:00', g: 2 }] }, D('2026-11-05'), 0.8);
  near(r.segments[0].g, 8);   // 10 -> 2 at the 9 am weigh-in
  near(r.segments[1].g, 2);   // 2 -> 0 (no leftover entered) before the 6 pm purchase
  assert.strictEqual(C.hourFrac('25:00', 0.5), 0.5);
});
console.log(n + ' tests OK');
