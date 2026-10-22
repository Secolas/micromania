// CAMERA CHECK: before the session's first camera game the live picture is
// checked (light, you in view, movement); it never blocks, and the prompt
// carries on where it was. Not again that session; SETTINGS can open it.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Prefs.set('tutorial', true); Engine.sensors = true; Engine.mode = 'classic'; Engine.startRun();
    Input.camReady = true; Input.drawLive = () => true;   // a stand-in camera
    const step = n => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); Input.camReady = true; } Engine.draw(); };
    const tap = b => Engine.release({ x: b.x + 5, y: b.y + 5 });
    Prefs.set('learned.tap', true); Engine.startRound(TapBug, 1);
    const touchFirst = Engine.state;                         // a touch game: no check
    Prefs.set('learned.move', true); Engine.startRound(MoveCam, 1);
    const opened = [Engine.state, Engine.cc.back], timer = Engine.cc.timer;
    Input.bright = 0.1; Input.skin = 0; Input.motion = 0; step(5);
    const dark = Engine.camChecks();
    Input.bright = 0.5; Input.skin = 0.2; step(5);
    const lit = Engine.camChecks();
    for (let i = 0; i < 40; i++) { Input.motion = 0.4; Engine.update(STEP); }
    const waved = Engine.camChecks();
    tap(Engine.CC_GO);
    const back = [Engine.state, Engine.timer === timer];
    Engine.startRound(MoveCam, 1);
    const again = Engine.state;
    Engine.state = 'SETTINGS'; tap(Engine.SET_CAMCHK);
    const fromSet = [Engine.state, Engine.cc.back];
    step(30); tap(Engine.CC_GO);
    return { touchFirst, opened, dark, lit, waved, back, again, fromSet, end: Engine.state };
  });
  eq(r.touchFirst, 'PROMPT', 'a touch game goes straight to its prompt');
  eq(r.opened, ['CAMCHECK', 'PROMPT'], 'the first camera game of the session opens the check');
  eq(r.dark, { light: false, you: false, moved: false }, 'a dark, empty picture fails all three');
  eq(r.lit, { light: true, you: true, moved: false }, 'light and a face pass; movement waits for a wave');
  eq(r.waved.moved, true, 'waving passes movement');
  eq(r.back, ['PROMPT', true], 'the button goes on to the prompt, its clock where it was');
  eq(r.again, 'PROMPT', 'not again in the same session');
  eq(r.fromSet, ['CAMCHECK', 'SETTINGS'], 'SETTINGS opens it');
  eq(r.end, 'SETTINGS', 'and DONE goes back there');
  await done();
}
