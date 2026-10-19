// CLASSIC: losing every life ends the run on GAME OVER, a tap goes back to the
// title, and a RUN boss stage deals a boss.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true);   // seen it already
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9;
    Engine.release({ x: CX, y: Engine.BTN_CLASSIC.y + 10 });
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); } };
    const until = (c, m = 3000) => { for (let i = 0; i < m && !c(); i++) step(); };
    const mode = Engine.mode;
    for (let i = 0; i < 4; i++) { until(() => Engine.state === 'PLAYING'); step(5); Engine.game.lose(); step(2); until(() => Engine.state !== 'RESULT'); }
    until(() => Engine.state === 'GAMEOVER'); const lives = Engine.lives, over = Engine.state; step(60);
    Engine.release({ x: 90, y: 40 }); const afterTap = Engine.state;
    Engine.mode = 'run'; Engine.startRun(); Run.stage = 2; Run.beginStage(); until(() => Engine.state === 'PROMPT');
    return { mode, lives, over, afterTap, boss: Engine.isBoss };
  });
  eq(r.mode, 'classic', 'CLASSIC button starts classic');
  eq([r.over, r.lives], ['GAMEOVER', 0], 'four losses end the game');
  eq(r.afterTap, 'TITLE', 'a tap on GAME OVER goes back to the title');
  assert(r.boss, 'stage 3 of a world is a boss');
  await done();
}
