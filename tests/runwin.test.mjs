// RUN has an end: beating the world-3 boss wins the run (RUN COMPLETE!, the
// time, runs won). KEEP GOING carries on into ENDLESS from the shop; DONE goes home.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true);
    Engine.mode = 'run'; Engine.startRun();
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); FX.update(STEP); } Engine.draw(); };
    const tap = b => Engine.release({ x: b.x + 5, y: b.y + 5 });
    const targets = [];
    for (let w = 1; w <= 3; w++) for (let st = 0; st < 3; st++) { Run.world = w; Run.stage = st; targets.push(Run.target()); }
    // jump to the world-3 boss stage and win it
    Run.world = 3; Run.stage = 2; Run.beginStage(); Run.score = Run.target(); Run.after();
    const win = [Engine.state, Run.won, Run.wins >= 1, Run.label()];
    step(80);
    tap(Run.BTN_KEEP); step(2);
    const keep = [Engine.state, Run.endless];
    step(30); Input._pendingTaps.push({ x: Run.NEXT.x + 5, y: Run.NEXT.y + 5 }); step(1);   // the shop reads taps
    const next = [Engine.state, Run.world, Run.label()];
    // an ENDLESS stage cleared goes to the ordinary CLEAR, not another win
    Run.stage = 2; Run.beginStage(); Run.score = Run.target(); Run.after();
    const endlessClear = Engine.state;
    // a second win, then DONE
    Run.start(); Run.world = 3; Run.stage = 2; Run.beginStage(); Run.score = Run.target(); Run.after(); step(80);
    tap(Run.BTN_DONE);
    return { targets, win, keep, next, endlessClear, home: Engine.state, wins: +localStorage.getItem('micromania.runWins') };
  });
  eq(r.targets, [120, 190, 280, 170, 270, 390, 240, 370, 550], 'stage targets, three worlds');
  eq(r.win, ['RUNWIN', true, true, '3-3'], 'beating the world-3 boss wins the run');
  eq(r.keep, ['SHOP', true], 'KEEP GOING goes on, ENDLESS, through the shop');
  eq(r.next, ['STAGE', 4, '4-1'], 'and into world 4');
  eq(r.endlessClear, 'CLEAR', 'in ENDLESS a boss clear is a plain clear');
  eq([r.home, r.wins], ['TITLE', 2], 'DONE goes home; wins are counted');
  await done();
}
