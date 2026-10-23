// Every game at every difficulty plays to an end without throwing, a scripted
// player can win the games that need skill, and the fake-outs behave.
import { assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const out = await page.evaluate(() => {
  Engine.mode = 'classic'; Engine.sensors = false; Input.camDenied = Input.micDenied = true;
  const out = { crash: [], wins: {} };
  // 1) every game, every difficulty, idle — must finish without throwing
  for (const C of [...POOL, ...BOSSES]) for (const d of [1, 2, 3]) {
    try {
      Engine.startRound(C, d); Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
      for (let i = 0; i < 900 && Engine.state === 'PLAYING'; i++) { Input.beginStep(); Engine.update(STEP); Engine.draw(); }
      if (Engine.state === 'PLAYING') out.crash.push(C.meta.id + d + ':never ended');
    } catch (e) { out.crash.push(C.meta.id + d + ':' + e.message); }
  }
  // 2) a scripted player per changed game: run with a per-step brain until finished
  const play = (C, d, brain, n = 20) => {
    let w = 0;
    for (let k = 0; k < n; k++) {
      Engine.startRound(C, d); Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
      const gm = Engine.game;
      for (let i = 0; i < 900 && !gm.finished && Engine.state === 'PLAYING'; i++) {
        brain(gm, i); Input.beginStep(); Engine.update(STEP);
      }
      if (gm.won) w++;
    }
    return w + '/' + n;
  };
  const tapAt = (x, y) => { Input.x = x; Input.y = y; Input._justDownRaw = true; Input._pendingTaps.push({ x, y }); };
  const swipe = (x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0; Input._pendingSwipe = { dir: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'), dist: Math.hypot(dx, dy), vx: 0, vy: 0, x0, y0, x1, y1 }; };
  const hold = (x, y) => { Input.down = true; Input._rawDx += x - Input.x; Input._rawDy += y - Input.y; Input.x = x; Input.y = y; };
  const release = () => { if (Input.down) { Input.down = false; Input._justUpRaw = true; } };
  const W = 180;
  out.wins.odd = play(OddOneOut, 3, (gm, i) => { if (i === 10) { const c = gm.cells[gm.odd]; tapAt(c.x, c.y); } });
  // a slow drag to the right side (what a careful player does) ...
  out.wins.sort = play(SortTreats, 3, (gm, i) => {
    const k = i % 30, to = gm.want() === 'left' ? 30 : 150;
    if (k === 0) { release(); } else if (k === 1) { tapAt(90, 100); hold(90, 100); } else if (k < 26) hold(90 + (to - 90) * (k / 25), 110); else release();
  });
  // ... and a quick flick
  out.wins.sortFlick = play(SortTreats, 3, (gm, i) => { if (i % 12 === 6) { const d = gm.want(); swipe(90, 150, d === 'left' ? 30 : 150, 150); tapAt(90, 150); Input._justUpRaw = true; } });
  out.wins.boop = play(WhackMole, 3, (gm, i) => { if (i % 10 === 5) { const h = gm.holes[gm.cur]; tapAt(h.x, h.y - 4); } });
  out.wins.laser = play(FollowDot, 3, (gm) => hold(gm.x, gm.y));
  out.wins.rub = play(RubClean, 3, (gm, i) => { const m = gm.mud.find(m => m.dirt > 0); if (m) hold(m.x + Math.sin(i) * 9, m.y + Math.cos(i * 1.3) * 9); });
  // CUT: wait until a cut now would drop the swinging bone into the mouth, then swipe across its rope
  out.wins.cut = play(CutRope, 3, (gm, i) => {
    const r = gm.ropes[gm.target]; if (r.cut || i < 3) return;
    const it = gm.item(r), v = r.va * r.L; let x = it.x, y = it.y, vx = Math.cos(r.a) * v, vy = -Math.sin(r.a) * v;
    for (let k = 0; k < 200 && !(vy > 0 && y >= gm.mouthY - 6); k++) { vy += gm.G / 60; x += vx / 60; y += vy / 60; }
    if (Math.abs(x - gm.dogX) < 8) { const mx = (r.px + it.x) / 2, my = (gm.y0 + it.y) / 2; swipe(mx - 20, my, mx + 20, my); }
  });
  out.wins.walk = play(TracePath, 3, (gm, i) => { const k = Math.min(gm.nodes.length - 1, gm.i + 1), a = gm.nodes[gm.i], b = gm.nodes[k]; const t = gm.started ? Math.min(1, (gm._s = (gm._s || 0) + 0.08)) : 0; if (gm._last !== gm.i) { gm._s = 0; gm._last = gm.i; } hold(a.x + (b.x - a.x) * (gm._s || 0), a.y + (b.y - a.y) * (gm._s || 0)); });
  out.wins.paws = play(PianoTiles, 3, (gm) => { const t = gm.tiles.filter(t => !t.hit && t.y > 150).sort((a, b) => b.y - a.y)[0]; if (t) tapAt(t.col * gm.colW + gm.colW / 2, t.y + 10); });
  out.wins.charge = play(HoldRelease, 3, (gm) => { const c = (gm.bandLo + gm.bandHi) / 2, hw = Math.max(0.006, (gm.bandHi - gm.bandLo) / 4); if (gm.armed && Math.abs(gm.p - c) < hw) release(); else hold(90, 150); });
  out.wins.throw = play(StopBar, 3, (gm) => { if (Math.abs(gm.p - gm.at) < gm.band / 4) tapAt(90, 150); });
  out.wins.pour = play(PourCup, 3, (gm) => { if (gm.fill < (gm.lo + gm.hi) / 2) hold(90, 150); else release(); });
  out.wins.blow = play(BlowSail, 3, (gm, i) => { if (i % 4 === 0) tapAt(90, 150); });
  // STACK: drop each one right over the top of the tower (it sways, so aim at where the top is now)
  out.wins.stack = play(StackBlocks, 3, (gm) => { if (gm.drop || gm.endT || gm.tumble.length) return; const tx = gm.done ? gm.xAt(gm.done - 1) : gm.baseX; if (Math.abs(gm.bx - tx) <= 2) tapAt(90, 150); });
  // ... and a careless player who taps whenever: should lose most of the time
  out.losses = { stack: play(StackBlocks, 3, (gm, i) => { if (i % 25 === 10) tapAt(90, 150); }),
    // COOK: a cook who grabs whatever's in the wrong bin burns it
    cook: play(CookBurger, 3, (gm, i) => { if (i % 6 === 3) { const b = gm.bins.find(b => b.f !== gm.recipe[gm.i]); tapAt(b.x + b.w / 2, b.y + 20); } }) };
  // COOK: tap the ticket's next food, one at a time, a beat apart
  out.wins.cook = play(CookBurger, 3, (gm, i) => {
    const k = gm.i + gm.fly.filter(f => !f.bad).length;
    if (i % 8 === 4 && k < gm.recipe.length) { const b = gm.bins.find(b => b.f === gm.recipe[k]); tapAt(b.x + b.w / 2, b.y + 20); }
  });
  out.wins.shh = play(DontTap, 3, () => {});
  out.wins.dodge = play(Dodge, 3, (gm) => { const danger = gm.blocks.filter(b => b.y > gm.py - 80 && b.y < gm.py + 10); let best = gm.px, bs = -1; for (let x = 12; x < W - 12; x += 4) { const s = Math.min(...danger.map(b => Math.abs(b.x - x) - b.w / 2), 999); if (s > bs) { bs = s; best = x; } } hold(best, 250); });
  out.wins.squeeze = play(Squeeze, 3, (gm) => { const w = gm.walls.filter(w => w.y < gm.py).sort((a, b) => b.y - a.y)[0]; hold(w ? w.gx : 90, 250); });
  // CROSS: hop when the next lane stays clear for a moment, or when a car is about to reach you where you stand
  out.wins.crossy = play(Crossy, 3, (gm) => {
    if (gm.hopping > 0) return;
    const clear = (L, t0, t1) => L < 0 || L >= gm.lanes || gm.cars.filter(c => c.lane === L).every(c => {
      for (let t = t0; t <= t1; t += 0.02) { let x = c.x + c.sp * t; if (x < -16) x += W + 32; if (x > W + 16) x -= W + 32; if (Math.abs(x - gm.px) < c.w / 2 + 4) return false; }
      return true; });
    const next = clear(gm.row, 0.1, 0.55), here = clear(gm.row - 1, 0, 0.3);
    if (next || (!here && clear(gm.row, 0.1, 0.3))) tapAt(90, 150);
  });
  out.wins.sled = play(SteerRun, 3, (gm) => { const g0 = gm.gates.filter(g => !g.done).sort((a, b) => b.y - a.y)[0]; const tx = g0 ? g0.x : gm.px; if (Math.abs(tx - gm.px) > 3) hold(tx > gm.px ? 180 : 0, 150); else release(); });
  out.wins.fetch = play(FlickShot, 3, (gm, i) => { if (i === 8) { const t = (gm.oy - gm.dy) / 280; const lead = gm.dx + gm.dvx * t; swipe(gm.ox, gm.oy, gm.ox + (lead - gm.ox) * 0.25, gm.oy - (gm.oy - gm.dy) * 0.25); } });
  out.wins.dry = play(DryShiba, 3, (gm, i) => { if (i % 14 === 0) tapAt(90, 150); });
  out.wins.juggle = play(Juggle, 3, (gm) => { const b = gm.balls.filter(b => b.vy > 0 && b.y > 200).sort((a, b) => b.y - a.y)[0]; if (b) tapAt(b.x, b.y); });
  out.wins.pluck = play(Dandelion, 3, (gm, i) => {
    const s = gm.seeds.find(s => !s.gone); if (!s) return;
    if (!gm.held) { release(); if (i % 2 === 0) { tapAt(s.x, s.y); Input.down = true; } return; }
    const dx = s.x - CX, dy = s.y - (CY - 8), d = Math.hypot(dx, dy) || 1; hold(CX + dx / d * (d + 10), CY - 8 + dy / d * (d + 10));
  });
  // KNOCK IT: aim the slingshot at the bone on top of the tower (solve the arc), pull, let go
  out.wins.knock = play(KnockStack, 3, (gm, i) => {
    if (i === 2) {
      const t = gm.bone; let best = null;
      for (let a = 0; a < 6.28 && !best; a += 0.03) for (let r = 20; r <= gm.maxPull && !best; r += 3) {
        const x = gm.ox + Math.cos(a) * r, y = gm.oy + Math.sin(a) * r; if (y > gm.groundY - gm.ball.r || x < 6) continue;
        let px = x, py = y, vx = (gm.ox - x) * gm.K, vy = (gm.oy - y) * gm.K;
        for (let k = 0; k < 300; k++) { vy += 420 / 60; px += vx / 60; py += vy / 60; if (Math.abs(px - t.x) < t.w / 2 + 6 && Math.abs(py - t.y) < t.h / 2 + 6) { best = [x, y]; break; } if (py > BOT) break; }
      }
      gm._aim = best || [gm.ox - 40, gm.oy + 30];
    }
    if (i >= 2 && i < 8) hold(gm._aim[0], gm._aim[1]); else if (i === 8) release();
  });
  // CATCH: stand under each treat as it falls
  out.wins.catch = play(CatchCoin, 3, (gm) => { const c = gm.coins.filter(c => !c.done && c.delay <= 0).sort((a, b) => b.y - a.y)[0]; Input.x = c ? c.x : CX; });
  out.wins.pat = play(PatShiba, 3, (gm, i) => { if (!gm.fake && i % 3 === 0) tapAt(90, 150); });
  // fake-outs: forced on, a touch must lose and leaving it alone must win
  Engine.seen.add('pat'); Engine.seen.add('tap');
  // HIGH FIVE on touch: tap whichever paws are up (both, one after the other)
  out.wins.highfive = play(HighFive, 3, (gm, i) => {
    if (gm.cheer > 0 || gm.raiseT < 0.3 || i % 6) return;
    const k = gm.side === 'B' ? (gm.tapped.L ? 'R' : 'L') : gm.side, P = HighFive.PAW[k];
    tapAt(P.x, P.y);
  });
  let fakeSeen = 0; for (let k = 0; k < 60; k++) { Engine.startRound(PatShiba, 2); if (Engine.game.fake) fakeSeen++; }
  out.fakeRate = fakeSeen + '/60';
  const forceFake = (C) => { const o = Math.random; Math.random = () => 0.01; Engine.startRound(C, 2); Math.random = o; return Engine.game; };
  let gm = forceFake(PatShiba); Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
  out.fakePrompt = gm.meta.prompt;
  for (let i = 0; i < 900 && Engine.state === 'PLAYING'; i++) { Input.beginStep(); Engine.update(STEP); }
  out.fakeIdleWins = gm.won;
  gm = forceFake(TapBug); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; tapAt(gm.bug.x, gm.bug.y); Input.beginStep(); Engine.update(STEP);
  out.fakeTouchLoses = gm.finished && !gm.won;
  // TAP: follow the laughing face; tapping a calm or sleepy one loses, and doing nothing loses
  Engine.seen.delete('tap');   // no fake-outs here
  out.wins.tap = play(TapBug, 3, (gm, i) => { if (i % 12 === 6) tapAt(gm.bug.x, gm.bug.y); });
  { let wrong = 0, idle = 0;
    for (let k = 0; k < 10; k++) {
      Engine.startRound(TapBug, 3); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; let t = Engine.game;
      const o = t.faces.find(f => f !== t.bug); tapAt(o.x, o.y); Input.beginStep(); Engine.update(STEP);
      if (t.finished && !t.won) wrong++;   // (a fake-out loses on any face too)
      Engine.startRound(TapBug, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; t = Engine.game;
      for (let i = 0; i < 900 && !t.finished && Engine.state === 'PLAYING'; i++) { Input.beginStep(); Engine.update(STEP); }
      if (t.won && !t.fake) idle++;   // a DON'T TAP! fake-out is won by waiting
    }
    out.tapWrong = wrong; out.tapIdle = idle; }
  Engine.seen.add('tap');
  // HOP: steer under the next step (the lowest one not yet landed on); doing nothing loses as the start crumbles
  out.wins.hop = play(Doodle, 3, (gm) => { const p = gm.plats.find((p, k) => k && !p.used); if (p) hold(p.x, 150); });
  out.wins.hop1 = play(Doodle, 1, (gm) => { const p = gm.plats.find((p, k) => k && !p.used); if (p) hold(p.x, 150); });
  { let idle = 0; for (let k = 0; k < 6; k++) { Engine.startRound(Doodle, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; const d = Engine.game; release();
      for (let i = 0; i < 900 && !d.finished && Engine.state === 'PLAYING'; i++) { Input.beginStep(); Engine.update(STEP); } if (d.won) idle++; }
    out.hopIdle = idle; }
  // DRY OFF with no sensors: rubbing fast dries the shiba; leaving it wet loses
  out.wins.dry = play(DryShiba, 3, (gm, i) => hold(90 + Math.cos(i * 0.7) * 45, 180));
  { let idleWins = 0; for (let k = 0; k < 5; k++) { Engine.startRound(DryShiba, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; const d = Engine.game;
      for (let i = 0; i < 900 && !d.finished && Engine.state === 'PLAYING'; i++) { Input.beginStep(); Engine.update(STEP); } if (d.won) idleWins++; }
    out.dryIdle = idleWins; }
  // CANDLES with no mic: a tap is a puff, so tapping fast blows them all out
  out.wins.candles = play(BlowCandles, 3, (gm, i) => { if (i % 6 === 0) tapAt(90, 150); });
  // at top speed, the bosses and DIG can still be won, and a win isn't lost on the clock while it plays out
  Engine.speed = 2.6;
  out.wins.wakeFast = play(WakeUp, 3, (gm, i) => { if (i % 5 === 0) tapAt(90, 150); });
  out.wins.bathFast = play(BathTime, 3, (gm, i) => hold(90 + Math.cos(i * 0.5) * 40, 150 + Math.sin(i * 0.5) * 40));
  out.wins.digFast = play(BeachDig, 3, (gm, i) => { if (i % 6 === 0) swipe(90, 120, 90, 200); });
  Engine.speed = 1;
  // HIGH FIVE on touch: tapping the paw that isn't up loses (it used to jam the round)
  let wrong = 0;
  for (let k = 0; k < 10; k++) {
    Engine.startRound(HighFive, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; const h = Engine.game;
    for (let i = 0; i < 400 && !h.finished && Engine.state === 'PLAYING'; i++) {
      if (h.raiseT >= 0.3 && h.side !== 'B' && !h._tried) { h._tried = true; const P = HighFive.PAW[h.side === 'L' ? 'R' : 'L']; tapAt(P.x, P.y); }
      Input.beginStep(); Engine.update(STEP);
    }
    if (h._tried && h.finished && !h.won) wrong++;
  }
  out.highfiveWrong = wrong;
  return out;
  });
  assert(!out.crash.length, 'games crashed or never ended: ' + out.crash.join(', '));
  // a working game should be winnable most of the time by a player who reads it
  for (const [id, r] of Object.entries(out.wins)) { const [w, n] = r.split('/').map(Number); assert(w >= n * 0.4, `${id}: scripted player won only ${r}`); }
  { const [w, n] = out.losses.cook.split('/').map(Number); assert(w === 0, 'COOK: tapping the wrong food should never win, won ' + out.losses.cook); }
  assert(out.fakeIdleWins, 'fake-out: leaving it alone should win');
  assert(out.fakeTouchLoses, 'fake-out: touching it should lose');
  assert(out.tapWrong === 10, 'TAP: tapping a face that is not laughing should lose, lost ' + out.tapWrong + '/10');
  assert(out.tapIdle === 0, 'TAP: doing nothing should lose, won ' + out.tapIdle + '/10');
  assert(out.hopIdle === 0, 'HOP: doing nothing should lose, won ' + out.hopIdle + '/6');
  assert(out.dryIdle === 0, 'DRY OFF: leaving the shiba wet should lose, won ' + out.dryIdle + '/5');
  assert(out.highfiveWrong >= 5, 'HIGH FIVE: tapping the wrong paw should lose, lost ' + out.highfiveWrong + '/10');
  await done();
}
