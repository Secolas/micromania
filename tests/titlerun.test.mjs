// The title's runner: it runs past the bushes, jumps for the bones floating
// about, and puts on the cowboy hat when it grabs one.
import { assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 0; Engine.runner = null;
    let hatAt = -1, bones = 0;
    for (let i = 0; i < 1500; i++) {
      Input.beginStep(); Engine.update(STEP);
      if (Engine.runner.hat && hatAt < 0) hatAt = i;
      if (i % 30 === 0) Engine.draw();
    }
    // every bone it has run past (after the intro, when it starts jumping)
    const R = Engine.runner, past = Engine.runThingAfter(R.scroll + Engine.RUN_X - 20);
    for (let k = 0; k < past; k++) if (Engine.runThing(k).kind === 'bone' && Engine.runThing(k).x > 200) bones++;
    return { got: R.got.size, bones, hatAt };
  });
  assert(r.bones >= 8 && r.got >= r.bones, 'it grabs every bone it passes, low or high: ' + r.got + ' of ' + r.bones);
  assert(r.hatAt > 0, 'and grabs the cowboy hat, and wears it');
  await done();
}
