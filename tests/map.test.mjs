// RUN's world map: the stage card is a map of one countryside drawn from
// Run.WORLDS, and the run follows that list, so worlds, stages and games can be
// added or changed there.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true; Prefs.set('tutorial', true);
    const step = (n = 1) => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); } Engine.draw(); };
    const out = {};
    // the three worlds as shipped: 1-1 ... 3-3, the shiba walking stop to stop
    Engine.mode = 'run'; Engine.startRun(); Run.beginStage();
    const labels = [], ends = [];
    for (let i = 0; i < 9; i++) {
      labels.push(Run.label()); step(70);
      const { b, j } = Run.here(), dog = Run.walker(b, j, 1), p = Run.stopAt(b, j);
      ends.push(dog.x === p.x && dog.y === p.y);
      if (i < 8) Run.nextStage();
    }
    out.labels = labels; out.ends = ends.every(Boolean);
    out.names = Run.WORLDS.map(w => w.name || null);
    // a bigger list: five worlds of two to four stages, a world's own games, a stop placed by hand
    Run.WORLDS = [
      { stages: [{}, {}, { boss: true }] },
      { name: 'BEACH', games: ['flick', 'dig'], stages: [{}, { boss: true }] },
      { stages: [{}, {}, {}, { boss: true, target: 300 }] },
      { name: 'TOWN', stages: [{ x: 0.25 }, { x: 0.75, boss: true }] },
      { ground: 'nowhere', stages: [{}, {}, { boss: true }] },
    ];
    Run.start(); const seen = [];
    for (let i = 0; i < 14; i++) { Run.beginStage(); seen.push(Run.label()); step(40); if (i < 13) Run.nextStage(); }
    out.big = seen;
    out.roundTrip = seen.every((l, i) => Run.label(i) === l);
    Run.world = 3; Run.stage = 3; out.setTarget = Run.target();   // 300 x 1.4^2
    Run.world = 4; Run.stage = 0; out.byHand = Run.stopAt(3, 0).x;
    // BEACH plays only its own games, but its boss stage still opens on a boss
    Run.world = 2; Run.stage = 0; Run.beginStage(); const ids = new Set();
    for (let i = 0; i < 12; i++) { Run.played = 1; Run.nextGame(); ids.add(Engine.game.meta.id); }
    out.beachGames = [...ids].sort();
    Run.stage = 1; Run.beginStage(); Run.played = 0; Run.nextGame(); out.beachBoss = BOSSES.some(C => C.meta.id === Engine.game.meta.id);
    // the last stage of the last world wins the run
    Run.world = 5; Run.stage = 1; Run.beginStage(); Run.score = Run.target(); Run.after(); out.midClear = Engine.state;
    Run.world = 5; Run.stage = 2; Run.beginStage(); Run.score = Run.target(); Run.after(); out.lastClear = Engine.state;
    return out;
  });
  eq(r.labels, ['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3'], 'three worlds of three stages');
  assert(r.ends, 'the shiba ends its walk on the stop it is playing');
  eq(r.names, [null, null, null], 'one countryside: the worlds go by number, WORLD 1 to 3');
  eq(r.big, ['1-1', '1-2', '1-3', '2-1', '2-2', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '5-1', '5-2', '5-3'], 'a longer list of worlds is played in order');
  assert(r.roundTrip, 'a stage count turns back into its label');
  eq(r.setTarget, 590, "a stage's own target, grown by the world");
  eq(r.byHand, 55, 'a stop placed by hand: a quarter of the way along the path');
  eq(r.beachGames, ['dig', 'flick'], "a world plays only its own games");
  assert(r.beachBoss, 'its boss stage opens on a boss');
  eq([r.midClear, r.lastClear], ['CLEAR', 'RUNWIN'], 'the last stage of the last world wins the run');
  await done();
}
