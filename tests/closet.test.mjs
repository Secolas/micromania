// The closet and the toy room: each thing to wear is earned by what it says,
// what you wear is kept and drawn on the shiba, and a toy-room game is
// practice (no lives, no best score) that comes back to the toy room.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true;
    const out = {}, owned = () => Closet.stats.owned.slice().sort();
    Closet.check(); out.start = owned();
    Engine.best = 10; Closet.check(); out.classic = owned();
    for (let i = 0; i < 10; i++) Closet.won('tap', false); out.wins = Closet.owns('bow');
    Closet.won('redlight', true); out.boss = Closet.owns('viking') && !Closet.owns('halo');
    for (const C of BOSSES) Closet.won(C.meta.id, true); out.allBosses = Closet.owns('halo');
    for (let i = 0; i < 5; i++) Closet.photo(); out.photos = Closet.owns('flower');
    [...POOL].slice(0, 25).forEach(C => Closet.met(C.meta.id)); Closet.check(); out.met = Closet.owns('phones');
    Run.best = 3; Closet.check(); out.world2 = Closet.owns('propeller');
    Run.wins = 1; Closet.check(); out.runWon = Closet.owns('crown');
    out.toasts = Toast.q.length;
    // wearing: only what you own; drawn on the mascot without trouble
    Closet.wear('cowboy'); out.wearing = Closet.hat && Closet.hat.id;
    Closet.stats.hat = 'nope'; out.notOwned = Closet.hat; Closet.wear('cowboy');
    Engine.state = 'PLAYING'; Engine.startRound(TapBug, 1); Engine.draw(); out.head = !!Closet.head('shiba', 0);
    // a toy-room game: practice, then back
    Engine.reset(); Engine.best = 10; Engine.openToy('games'); Engine.toyLv = 2;
    const i = [...POOL, ...BOSSES].indexOf(TapBug), c = Engine.toyCard(i);
    Engine.toyRelease({ x: c.x + 5, y: c.y + 5 });
    out.playing = [Engine.state, Engine.game && Engine.game.meta.id, !!Engine.toy];
    for (let k = 0; k < 400 && Engine.state !== 'PLAYING'; k++) { Input.beginStep(); Engine.update(STEP); }
    Engine.game.lose();
    for (let k = 0; k < 900 && Engine.state !== 'TOYROOM'; k++) { Input.beginStep(); Engine.update(STEP); }
    out.afterLoss = [Engine.state, Engine.lives, Engine.best, Closet.stats.toy.tap || 0];
    Engine.toyRelease({ x: c.x + 5, y: c.y + 5 });
    for (let k = 0; k < 400 && Engine.state !== 'PLAYING'; k++) { Input.beginStep(); Engine.update(STEP); }
    Engine.game.succeed();
    for (let k = 0; k < 900 && Engine.state !== 'TOYROOM'; k++) { Input.beginStep(); Engine.update(STEP); }
    out.afterWin = [Engine.state, Closet.stats.toy.tap || 0, Engine.best];
    // a game you haven't met can't be played yet
    const j = [...POOL, ...BOSSES].findIndex(C => !Closet.stats.met.includes(C.meta.id)), cj = Engine.toyCard(j % Engine.TOY_PER);
    Engine.toyPage = Math.floor(j / Engine.TOY_PER); Engine.toyRelease({ x: cj.x + 5, y: cj.y + 5 });
    out.locked = Engine.state;
    // QUIT from the pause menu in a toy game goes back to the toy room
    Engine.toyPage = 0; Engine.toyRelease({ x: c.x + 5, y: c.y + 5 });
    for (let k = 0; k < 400 && Engine.state !== 'PLAYING'; k++) { Input.beginStep(); Engine.update(STEP); }
    Engine.pause(); const Q = Engine.PAUSE_QUIT; Engine.pauseRelease ? Engine.pauseRelease({ x: Q.x + 5, y: Q.y + 5 }) : Engine.release({ x: Q.x + 5, y: Q.y + 5 });
    out.quit = [Engine.state, !!Engine.toy];
    return out;
  });
  eq(r.start, ['party'], 'only the party hat to start');
  eq(r.classic, ['beanie', 'cowboy', 'party'], 'a Classic best of 10 earns the beanie and the cowboy hat');
  assert(r.wins && r.boss && r.allBosses && r.photos && r.met && r.world2 && r.runWon, 'each item is earned: ' + JSON.stringify(r));
  assert(r.toasts >= 8, 'a NEW! note for each: ' + r.toasts);
  eq([r.wearing, r.notOwned, r.head], ['cowboy', null, true], 'wear what you own, and it finds the head');
  eq(r.playing, ['PROMPT', 'tap', true], 'a toy-room card starts that game');
  eq(r.afterLoss, ['TOYROOM', 4, 10, 0], 'a toy-room loss: back to the toy room, no life lost, best untouched');
  eq(r.afterWin, ['TOYROOM', 2, 10], 'a toy-room win at level 2 is noted');
  eq(r.locked, 'TOYROOM', 'a game you have not met stays locked');
  eq(r.quit, ['TOYROOM', false], 'QUIT from a toy game goes back to the toy room');
  // what you wear is kept
  await page.reload(); await page.waitForTimeout(800);
  eq(await page.evaluate(() => Closet.hat && Closet.hat.id), 'cowboy', 'still wearing it after a reload');
  await done();
}
