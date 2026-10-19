// REVERSE rounds mirror the finger's path about where it went down (taps still
// land where you touch), tap/camera/mic games never flip, and the first time
// you meet a game its prompt waits for a tap on READY.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { readyGate: true });
  const box = await page.locator('#game').boundingBox();
  const at = (x, y) => [box.x + x * box.width / 180, box.y + y * box.height / 320];
  const step = n => page.evaluate(n => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); } }, n);

  eq(await page.evaluate(() => [Engine.canReverse(Dodge.meta), Engine.canReverse(Squeeze.meta), Engine.canReverse(TapBug.meta), Engine.canReverse(MoveCam.meta), Engine.canReverse(BlowSail.meta)]),
    [true, true, false, false, false], 'drag bosses can flip; tap, camera and mic games cannot');

  // first meeting: the prompt holds until READY, then remembers
  await page.evaluate(() => { Prefs.set('tutorial', true); localStorage.removeItem('micromania.learned.catch'); Engine.mode = 'classic'; Engine.lives = 4; Engine.startRound(CatchCoin, 1); });
  // startRound(Class) is a forced pick, like RUN's — the gate still applies
  eq(await page.evaluate(() => Engine.waitReady), true, 'a game you have never played waits for READY');
  await step(300);
  eq(await page.evaluate(() => Engine.state), 'PROMPT', 'and keeps waiting');
  await page.mouse.move(...at(90, 200)); await page.mouse.down(); await page.mouse.up();
  await step(60);
  eq(await page.evaluate(() => [Engine.state, Prefs.get('learned.catch', false)]), ['PLAYING', true], 'a tap starts it and it is learned');
  await page.evaluate(() => Engine.startRound(CatchCoin, 1));
  eq(await page.evaluate(() => Engine.waitReady), false, 'next time no wait');

  // REVERSE: the drag goes the other way
  await page.evaluate(() => { Engine.forceReverse = true; Prefs.set('learned.dodge', true); Engine.startRound(Dodge, 1); });
  await step(200);
  eq(await page.evaluate(() => [Engine.state, Engine.reverse, Input.rev]), ['PLAYING', true, true], 'a reversed round plays reversed');
  await page.mouse.move(...at(90, 200)); await page.mouse.down();
  await step(1);
  const x0 = await page.evaluate(() => Input.x);
  await page.mouse.move(...at(130, 200), { steps: 4 }); await step(1);
  const x1 = await page.evaluate(() => Input.x);
  await page.mouse.up();
  assert(Math.abs(x0 - 90) < 2, 'the press lands where you touch: ' + x0);
  assert(Math.abs(x1 - 50) < 2, 'moving right moves left: ' + x1);
  eq(await page.evaluate(() => { Engine.forceReverse = null; Engine.state = 'RESULT'; Engine.update(STEP); return Input.rev; }), false, 'off again outside the round');
  await done();
}
