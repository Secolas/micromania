// The first-time tutorial: a first RUN goes to HOW TO PLAY, then three
// practice games where a miss costs nothing and gets one more go, YOU'RE READY!,
// and the run. It's remembered; SKIP and SETTINGS > HOW TO PLAY work.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    localStorage.removeItem('micromania.tutorial');
    Engine.sensors = false; Input.camDenied = Input.micDenied = true;
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); FX.update(STEP); } Engine.draw(); };
    const until = (c, m = 3000) => { for (let i = 0; i < m && !c(); i++) step(); return c(); };
    const out = {};
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9;
    Engine.release({ x: CX, y: Engine.BTN_RUN.y + 10 });
    out.first = [Engine.state, !!Engine.tut, Engine.tut && Engine.tut.mode];
    step(30); Engine.release({ x: CX, y: CY });
    const games = [];
    // game 1: lose it (no life lost, same game again), then win; games 2 and 3: win
    for (let k = 0; k < 4; k++) {
      until(() => Engine.state === 'PLAYING');
      games.push(Engine.game.meta.id + (k === 0 ? ':lose' : ':win'));
      step(5);
      if (k === 0) Engine.game.lose(); else Engine.game.succeed();
      step(2);
      out['lives' + k] = Engine.lives;
      until(() => Engine.state !== 'RESULT' && Engine.state !== 'PHOTO');
    }
    out.games = games;
    until(() => Engine.state === 'TUTDONE'); out.done = Engine.state;
    until(() => Engine.state !== 'TUTDONE');
    out.after = [Engine.state, Engine.mode, localStorage.getItem('micromania.tutorial'), Engine.tut];
    // a second start goes straight in
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9; Engine.release({ x: CX, y: Engine.BTN_CLASSIC.y + 10 });
    out.second = Engine.state;
    // SETTINGS > HOW TO PLAY replays it; SKIP goes back to the title
    Engine.state = 'SETTINGS'; Engine.release({ x: Engine.SET_TUT.x + 5, y: Engine.SET_TUT.y + 5 });
    out.replay = Engine.state;
    const K = Engine.TUT_SKIP_CARD; Engine.press({ x: K.x + 4, y: K.y + 4 }); Engine.permRelease({ x: K.x + 4, y: K.y + 4 });
    out.skip = Engine.state;
    return out;
  });
  eq(r.first, ['TUTORIAL', true, 'run'], 'the first RUN starts with HOW TO PLAY');
  eq(r.games, ['tap:lose', 'tap:win', 'catch:win', 'swipe:win'], 'a miss replays the game; then tap, drag and (no camera) swipe');
  eq([r.lives0, r.lives1, r.lives3], [4, 4, 4], 'practice costs no lives');
  eq(r.done, 'TUTDONE', "YOU'RE READY! at the end");
  eq(r.after.slice(0, 3), ['READY', 'run', '1'], 'then the run starts, and the tutorial is remembered');
  eq(r.second, 'READY', 'the next start goes straight in');
  eq(r.replay, 'TUTORIAL', 'SETTINGS > HOW TO PLAY replays it');
  eq(r.skip, 'TITLE', 'SKIP from there goes back to the title');
  await done();
}
