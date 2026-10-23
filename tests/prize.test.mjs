// Winning something to wear: the prompt only names the prize on HARD, and
// winning it brings up a YOU GOT card after the round, which holds the game
// still until a tap.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true);
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); } Engine.draw(); };
    const said = [], outline = g.outline.bind(g);
    g.outline = (str, ...a) => { said.push(String(str)); return outline(str, ...a); };
    const prompt = d => { said.length = 0; Engine.startRound(DinoRun, d); Engine.draw(); return said.filter(s => /COWBOY/.test(s)); };
    const out = {};
    Closet.resetAll(); Engine.reset(); Engine.mode = 'classic';
    out.easy = prompt(1); out.hard = prompt(3);
    // beat JUMP! on HARD
    Engine.startRound(DinoRun, 3); step(50); Engine.game.succeed(); step(2);
    out.queued = Prize.q.map(i => i.id);
    out.state = Engine.state; const tm = Engine.timer;
    step(90); out.held = [Engine.state === out.state, Engine.timer === tm, Prize.on()];
    said.length = 0; Engine.draw(); out.card = said.includes('COWBOY HAT');
    Input._pendingTaps.push({ x: CX, y: CY }); Input._justDownRaw = true; step(1);
    out.after = [Prize.q.length, Closet.owns('cowboy')];
    step(5); out.goesOn = Engine.timer < tm;
    return out;
  });
  eq(r.easy, [], 'below HARD the prompt names no prize');
  eq(r.hard, ['WIN: COWBOY HAT'], 'on HARD it says what winning it gets');
  eq(r.queued, ['cowboy'], 'beating JUMP! on HARD wins the cowboy hat');
  assert(r.state !== 'PLAYING', 'the card waits for the round to end: ' + r.state);
  eq(r.held, [true, true, true], 'the YOU GOT card holds the game still');
  assert(r.card, 'the card names the hat');
  eq(r.after, [0, true], 'a tap puts it away; the hat is in the doghouse');
  assert(r.goesOn, 'and the game goes on');
  await done();
}
