// The title: a tap mid-intro only skips it; then the five menu options work
// (checked with real pointer clicks on the canvas); coming back doesn't replay
// the intro. Win/fail juice fires the same in every mode.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { live: true, wait: 300 });
  const clip = await page.locator('#game').boundingBox();
  const click = (vx, vy) => page.mouse.click(clip.x + vx / 180 * clip.width, clip.y + vy / 320 * clip.height);
  const B = await page.evaluate(() => ({ run: Engine.BTN_RUN, classic: Engine.BTN_CLASSIC, album: Engine.BTN_ALBUM, toy: Engine.BTN_TOY, set: Engine.BTN_SET }));
  await page.evaluate(() => { Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true); Engine._lastState = null; Engine.state = 'TITLE'; });
  await page.waitForTimeout(200);
  await click(90, B.run.y + 12); await page.waitForTimeout(100);
  eq(await page.evaluate(() => [Engine.state, Engine.titleT > 2]), ['TITLE', true], 'a tap mid-intro skips it and stays on the title');
  for (const [k, want] of [['album', 'ALBUM'], ['toy', 'TOYROOM'], ['set', 'SETTINGS']]) {
    await page.evaluate(() => { Engine.state = Engine._lastState = 'TITLE'; Engine.timer = 0; Engine.titleT = 9; }); await page.waitForTimeout(100);
    await click(90, B[k].y + 12); await page.waitForTimeout(150);
    eq(await page.evaluate(() => Engine.state), want, k + ' opens ' + want);
    await page.evaluate(() => { const b = Engine.ALB_BACK; Engine.release({ x: b.x + 5, y: b.y + 5 }); });
    eq(await page.evaluate(() => [Engine.state, Engine.titleT >= 9]), ['TITLE', true], 'BACK returns to a settled title');
  }
  for (const [k, mode] of [['classic', 'classic'], ['run', 'run']]) {
    await page.evaluate(() => { Engine.state = Engine._lastState = 'TITLE'; Engine.timer = 0; Engine.titleT = 9; }); await page.waitForTimeout(100);
    await click(90, B[k].y + 12); await page.waitForTimeout(150);
    eq(await page.evaluate(() => [Engine.state, Engine.mode]), ['READY', mode], k + ' starts ' + mode);
  }
  // the verdict juice
  await page.evaluate(() => { running = false; });
  const win = (mode, C, boss) => page.evaluate(([mode, C, boss]) => {
    Engine.mode = mode; if (mode === 'run') { Run.start(); Run.left = 5; }
    Engine.startRound(eval(C), 1, boss); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; Engine.game.paused = false;
    Engine.game.succeed(); Input.beginStep(); Engine.update(STEP); return [Engine.state, Juice.won, Juice.hitting];
  }, [mode, C, boss]);
  eq(await win('classic', 'TapBug', false), ['RESULT', true, true], 'classic win: GOOD! with the hit-stop');
  eq(await win('run', 'SliceTreats', false), ['RESULT', true, true], 'run win: GOOD! with the hit-stop');
  eq(await win('classic', 'Juggle', true), ['RESULT', true, true], 'boss win: GOOD! with the hit-stop');
  const fail = await page.evaluate(() => { Engine.mode = 'classic'; Engine.lives = 4; Engine.startRound(TapBug, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
    Juice.bits = []; Engine.game.lose(); Input.beginStep(); Engine.update(STEP); return [Engine.state, Juice.won, Juice.bits.length]; });
  eq(fail, ['RESULT', false, 0], 'a fail: FAIL!, no confetti');
  await done();
}
