// The how-to animation on every prompt matches the control the player will
// really use: a tilt game shows paws tilting the phone (not the camera) when
// the phone tilts, and its touch fallback otherwise; every loop draws.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    const all = [...POOL, ...BOSSES];
    const kinds = sense => { Object.assign(Input, sense); return Object.fromEntries(all.map(C => [C.meta.id, Engine.demoKind(C.meta)])); };
    const off = { tiltReady: false, camReady: false, camPending: false, micReady: false, micPending: false, _motionOn: false };
    const tilt = kinds({ ...off, tiltReady: true }), touch = kinds(off), cam = kinds({ ...off, camReady: true });
    const tiltGames = all.filter(C => C.meta.how && C.meta.how.tilt).map(C => C.meta.id);
    const errs = [];
    for (const k of g.DEMOS) for (const s of [0.72, 1.15]) for (const t of [0, 0.4, 1.3, 2.2]) { try { g.demo(k, CX, CY, t, s); } catch (e) { errs.push(k + ': ' + e.message); } }
    const unknown = [...new Set([tilt, touch, cam].flatMap(o => Object.values(o)))].filter(k => !g.DEMOS.includes(k));
    return { tiltGames, tilt: tiltGames.map(id => tilt[id]), touch: tiltGames.map(id => touch[id]), swatCam: cam.swat, errs, unknown };
  });
  assert(r.tiltGames.length >= 4, 'tilt games found: ' + r.tiltGames.join(', '));
  eq(r.tilt, r.tiltGames.map(() => 'tilt'), 'a phone that tilts: every tilt game shows the tilting loop');
  assert(!r.touch.includes('tilt') && !r.touch.includes('move'), 'no tilt: the touch fallback loop, not the camera: ' + r.touch.join(', '));
  eq(r.swatCam, 'move', 'SWAT with only a camera shows the camera loop');
  eq(r.errs, [], 'every how-to loop draws');
  eq(r.unknown, [], 'every kind a prompt asks for has a loop');
  await done();
}
