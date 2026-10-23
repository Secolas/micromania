// The title's runner: it jumps the games' props in its way, jumps for the
// bones floating about, and puts on the cowboy hat when it grabs one.
import { assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 0; Engine.runner = null;
    const kinds = new Set(); let hatAt = -1, clipped = 0;
    for (let i = 0; i < 1500; i++) {
      Input.beginStep(); Engine.update(STEP);
      const R = Engine.runner;
      if (R.hat && hatAt < 0) hatAt = i;
      // the shiba's paws are never below the top of a prop it is over
      for (let k = Engine.runThingAfter(R.scroll + Engine.RUN_X - 6); ; k++) {
        const th = Engine.runThing(k), dx = th.x - R.scroll - Engine.RUN_X; if (dx > 6) break;
        kinds.add(th.kind); if (th.h && Math.abs(dx) < 4 && R.y < th.h) clipped++;
      }
      if (i % 30 === 0) Engine.draw();
    }
    return { got: Engine.runner.got.size, hatAt, kinds: [...kinds], clipped };
  });
  assert(r.got >= 8, 'it grabs bones as it runs: ' + r.got);
  assert(r.hatAt > 0, 'and grabs the cowboy hat, and wears it');
  assert(r.kinds.filter(k => k !== 'bone' && k !== 'hat').length >= 3, 'it jumps the games\' props: ' + r.kinds);
  assert(r.clipped === 0, 'clearing each one: ' + r.clipped);
  await done();
}
