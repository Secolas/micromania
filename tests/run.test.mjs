// RUN: stage card, games, the tally, STAGE CLEAR and its bones, the shop (buy,
// NEXT), the next stage, and RUN OVER after losing.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true);   // seen it already
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9;
    Engine.release({ x: CX, y: Engine.BTN_RUN.y + 10 });
    const st0 = [Engine.state, Engine.mode];
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); FX.update(STEP); } Engine.draw(); };
    const until = (c, m = 3000) => { for (let i = 0; i < m && !c(); i++) step(); return c(); };
    const tap = (x, y) => { Input._pendingTaps.push({ x, y }); Input._justDownRaw = true; step(); };
    const sawStage = until(() => Engine.state === 'STAGE');
    let cleared = false;
    for (let g = 0; g < 8 && !cleared; g++) {
      until(() => Engine.state === 'PLAYING'); step(20);
      if (g === 1) Engine.game.lose(); else Engine.game.succeed();
      step(2);
      until(() => ['PLAYING', 'CLEAR', 'GAMEOVER', 'PHOTO'].includes(Engine.state));
      if (Engine.state === 'PHOTO') until(() => Engine.state !== 'PHOTO');
      until(() => ['PROMPT', 'PLAYING', 'CLEAR', 'GAMEOVER'].includes(Engine.state));
      cleared = Engine.state === 'CLEAR';
    }
    step(30); const bones = Run.bones;
    const sawShop = until(() => Engine.state === 'SHOP'); step(30);
    Run.bones = 20;
    const c = Run.CARD(0); tap(c.x + 10, c.y + 10);
    const bought = Run.treats.length;
    tap(Run.NEXT.x + 5, Run.NEXT.y + 5); step(2);
    const next = [Engine.state, Run.label()];
    for (let i = 0; i < 12 && Engine.state !== 'GAMEOVER'; i++) {
      until(() => Engine.state === 'PLAYING' || Engine.state === 'GAMEOVER'); if (Engine.state === 'GAMEOVER') break;
      step(5); Engine.game.lose(); step(2); until(() => Engine.state !== 'RESULT');
    }
    step(30);
    return { st0, sawStage, cleared, bones, sawShop, bought, next, over: Engine.state };
  });
  eq(r.st0, ['READY', 'run'], 'RUN button starts a run');
  assert(r.sawStage, 'a run opens on the stage card');
  assert(r.cleared, 'winning the stage reaches STAGE CLEAR');
  assert(r.bones > 0, 'clearing a stage pays bones');
  assert(r.sawShop, 'the shop follows the clear');
  assert(r.bought >= 1, 'a treat can be bought');
  eq(r.next, ['STAGE', '1-2'], 'NEXT goes on to stage 1-2');
  eq(r.over, 'GAMEOVER', 'missing the target ends the run');
  await done();
}
