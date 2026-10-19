// REPLAY: camera games record a short clip of the player; at game over WATCH
// REPLAY plays them back, with dots to pick one and back / pause / forward.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  // a stand-in camera: every snap is a small canvas
  await page.evaluate(() => {
    Prefs.set('tutorial', true); Input.camReady = true;
    Input.snapPhoto = () => { const c = document.createElement('canvas'); c.width = 96; c.height = 72; return c; };
    Engine.mode = 'classic'; Engine.sensors = true; Engine.startRun();
  });
  const play = (C, win) => page.evaluate(([name, win]) => {
    const C = window[name] || eval(name);
    Engine.startRound(C, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
    for (let i = 0; i < 90; i++) { Engine.game.paused = false; Input.beginStep(); Engine.update(STEP); if (Engine.state !== 'PLAYING') break; }   // the stand-in camera never 'arrives', so keep the game from waiting on it
    if (Engine.state === 'PLAYING') { win ? Engine.game.succeed() : Engine.game.lose(); Input.beginStep(); Engine.update(STEP); }
    return Engine.replay.length;
  }, [C, win]);
  eq(await play('MoveCam', true), 1, 'a camera game keeps a clip');
  eq(await play('TapBug', true) >= 1, true, 'and a touch game still plays (camera on, so it may record too)');
  const clip = await page.evaluate(() => { const c = Engine.replay[0]; return [c.prompt, c.won, c.frames.length]; });
  assert(clip[2] >= 6 && clip[2] <= 30, 'clip length in frames: ' + clip[2]);
  eq([clip[0], clip[1]], ['MOVE!', true], 'it remembers the game and the result');
  // game over -> WATCH REPLAY -> forward, pause, DONE
  await page.evaluate(() => { Engine.state = 'GAMEOVER'; Engine.timer = 0; });
  const tap = b => page.evaluate(b => { const B = typeof b === 'string' ? Engine[b] : b; Engine.release({ x: B.x + 4, y: B.y + 4 }); }, b);
  await tap('BTN_REPLAY');
  eq(await page.evaluate(() => Engine.state), 'REPLAY', 'WATCH REPLAY opens the replay');
  const n = await page.evaluate(() => Engine.replay.length);
  await page.evaluate(() => Engine.release({ x: Engine.RP_BTNS[2].x + 4, y: Engine.RP_BTNS[2].y + 4 }));
  eq(await page.evaluate(() => Engine.rp.i), n > 1 ? 1 : 0, 'forward goes to the next clip');
  await page.evaluate(() => Engine.release({ x: Engine.RP_BTNS[1].x + 4, y: Engine.RP_BTNS[1].y + 4 }));
  const t0 = await page.evaluate(() => { for (let i = 0; i < 30; i++) Engine.update(STEP); return [Engine.rp.paused, Engine.rp.t]; });
  eq(t0, [true, 0], 'pause holds the clip');
  await page.evaluate(() => Engine.draw());
  await tap('RP_DONE');
  eq(await page.evaluate(() => Engine.state), 'GAMEOVER', 'DONE goes back');
  await page.evaluate(() => { Engine.mode = 'classic'; Engine.startRun(); });
  eq(await page.evaluate(() => Engine.replay.length), 0, 'a new run starts with no clips');
  await done();
}
