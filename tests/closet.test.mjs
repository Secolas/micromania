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
    Closet.won('steer', false); out.sled = Closet.owns('beanie');                  // beat SLED, where the rider wears it
    Closet.won('rock', false); out.rock = Closet.owns('shades');                   // beat HEADBANG, where the rocker wears them
    for (const C of BOSSES) Closet.won(C.meta.id, true); out.bossesOverTime = Closet.owns('crown');   // not in one game: no crown
    Closet.allBosses(); out.crown = Closet.owns('crown');
    Engine.best = 30; Closet.check(); out.halo = Closet.owns('halo');
    for (let i = 0; i < 5; i++) Closet.photo(); out.photos = Closet.owns('flower');
    Run.best = 3; Closet.check(); out.world2 = Closet.owns('propeller');
    Run.wins = 1; Closet.check(); out.runWon = Closet.owns('wizard');
    out.all = Closet.stats.owned.length === Closet.ITEMS.length;
    // the crown in a real Classic game: every boss beaten in one
    Closet.resetAll(); Engine.reset(); Engine.mode = 'classic';
    for (const C of BOSSES) { Engine.startRound(C, 3, true); Engine.state = 'PLAYING'; Engine.game.succeed(); Input.beginStep(); Engine.update(STEP); }
    out.crownInGame = Closet.owns('crown');
    Closet.unlockAll(); out.dev = Closet.stats.owned.length === Closet.ITEMS.length;
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
  eq(r.classic, ['cowboy', 'party'], 'a Classic best of 10 earns the cowboy hat');
  assert(r.wins && r.sled && r.rock && r.crown && r.halo && r.photos && r.world2 && r.runWon && r.all, 'each item is earned: ' + JSON.stringify(r));
  eq(r.bossesOverTime, false, 'every boss over different games is not the crown');
  eq(r.crownInGame, true, 'every boss in one Classic game earns the crown');
  eq(r.dev, true, 'the dev menu can unlock everything');
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
