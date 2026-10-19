// Pausing: leaving the app (or the pause button) freezes a game; RESUME counts
// 3-2-1 back in, with the round clock where it was; QUIT goes to the title.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { live: true, wait: 300 });
  const hide = h => page.evaluate(h => { Object.defineProperty(document, 'hidden', { value: h, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }, h);
  await page.evaluate(() => { Prefs.set('tutorial', true); Engine.mode = 'classic'; Engine.startRound(TapBug, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; Engine.game.paused = false; });
  await page.waitForTimeout(300);
  await hide(true); await hide(false);
  const t0 = await page.evaluate(() => [Engine.paused, Engine.state, Engine.timer]);
  await page.waitForTimeout(700);
  const t1 = await page.evaluate(() => [Engine.paused, Engine.state, Engine.timer]);
  eq([t0[0], t0[1]], [true, 'PLAYING'], 'leaving the app pauses the game');
  eq(t1[2], t0[2], 'nothing ticks while paused');
  await page.evaluate(() => { const R = Engine.PAUSE_RESUME; Engine.press({ x: R.x + 5, y: R.y + 5 }); Engine.permRelease({ x: R.x + 5, y: R.y + 5 }); });
  const mid = await page.evaluate(() => [Engine.paused, Engine.resumeT > 0]);
  eq(mid, [true, true], 'RESUME counts back in first');
  await page.waitForTimeout(1800);
  const t2 = await page.evaluate(() => [Engine.paused, Engine.state, Engine.timer]);
  eq([t2[0], t2[1]], [false, 'PLAYING'], 'then the game carries on');
  assert(t2[2] < t0[2] && t2[2] > t0[2] - 0.6, 'the round clock picked up where it was: ' + t0[2] + ' -> ' + t2[2]);
  // the pause button, then QUIT
  await page.evaluate(() => { const B = Engine.PAUSE_BTN; Engine.press({ x: B.x + 5, y: B.y + 5 }); Engine.permRelease({ x: B.x + 5, y: B.y + 5 }); });
  eq(await page.evaluate(() => Engine.paused), true, 'the pause button pauses');
  await page.evaluate(() => { const Q = Engine.PAUSE_QUIT; Engine.press({ x: Q.x + 5, y: Q.y + 5 }); Engine.permRelease({ x: Q.x + 5, y: Q.y + 5 }); });
  eq(await page.evaluate(() => [Engine.paused, Engine.state]), [false, 'TITLE'], 'QUIT goes back to the title');
  // menus don't pause
  await hide(true); await hide(false);
  eq(await page.evaluate(() => Engine.paused), false, 'the title never pauses');
  await done();
}
