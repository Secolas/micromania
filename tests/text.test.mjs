// No text smaller than 8px or drawn grey, and none running off the screen (or
// out of the frame on the menu screens), on every screen and in every game.
import { assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const bad = await page.evaluate(() => {
    Engine.sensors = false; Input.camDenied = Input.micDenied = true;
    const found = new Map(); let where = '';
    const orig = g.text.bind(g);
    g.text = function (str, x, y, size = 8, c, align = 'center', bold = true) {
      const s = Math.max(8, size);
      ctx.font = (bold ? 'bold ' : '') + s + 'px ui-monospace, monospace';
      const w = ctx.measureText(String(str)).width, m = ctx.getTransform(), px = canvas.width / W;
      if (m.a === m.d && Math.abs(m.b) < 1e-6) {          // text drawn as-is (stamps are scaled on purpose)
        const k = m.a / px, ox = m.e / px;
        const L = ox + k * (align === 'center' ? x - w / 2 : align === 'right' ? x - w : x), R = L + k * w;
        const menu = Engine.MENU_SCREENS.includes(Engine.state), lo = menu ? 10 : 1, hi = menu ? W - 10 : W - 1;
        if (L < lo - 0.5 || R > hi + 0.5) found.set(where + ' | ' + str, [Math.round(L), Math.round(R)]);
      }
      const r = orig(str, x, y, size, c, align, bold);
      if (ctx.fillStyle.toLowerCase() === PAL.mid || ctx.fillStyle.toLowerCase() === TEXT_MID) found.set(where + ' | grey: ' + str, 0);
      return r;
    };
    const step = n => { for (let i = 0; i < n; i++) { Input.beginStep(); Engine.update(STEP); Engine.draw(); } };
    for (const st of ['TITLE', 'SETTINGS', 'ALBUM', 'PERMS']) { where = st; Engine.state = st; Engine.titleT = 9; Engine.draw(); }
    Engine.permWait = true; where = 'PERMS wait'; Engine.draw(); Engine.permWait = false;
    for (const st of ['TUTORIAL', 'TUTDONE']) { where = st; Engine.tut = { step: 0, tries: 0, mode: 'run' }; Engine.state = st; Engine.draw(); }
    Engine.startRound(TapBug, 1); Engine.state = 'PLAYING'; where = 'practice HUD'; Engine.draw(); Engine.tut = null;
    Engine.state = 'PLAYING'; Engine.paused = true; where = 'PAUSED'; Engine.draw(); Engine.resumeT = 1.2; where = 'resuming'; Engine.draw(); Engine.paused = false; Engine.resumeT = 0;
    Run.best = 20; Engine.best = 999; where = 'TITLE best'; Engine.state = 'TITLE'; Engine.draw();
    for (const m of ['classic', 'run']) { Engine.mode = m; if (m === 'run') Run.start(); where = 'GAMEOVER ' + m; Engine.state = 'GAMEOVER'; Engine.draw(); }
    for (const m of ['classic', 'run']) {
      Engine.mode = m; if (m === 'run') Run.start();
      for (const C of [...POOL, ...BOSSES]) for (const d of [1, 3]) {
        where = m + ' ' + C.meta.id + d;
        Engine.startRound(C, d); step(20);
        Engine.state = 'PLAYING'; Engine.timer = Engine.duration;
        for (let i = 0; i < 300 && Engine.state === 'PLAYING'; i++) {
          if (i % 11 === 0) { Input.x = 30 + (i * 37) % 120; Input.y = 60 + (i * 53) % 180; Input.justDown = true; Input.down = true; }
          Input.beginStep(); Engine.update(STEP); Engine.draw(); Input.justDown = false;
        }
        step(90);
      }
    }
    Engine.mode = 'run'; Run.start(); Run.shop = Run.TREATS.slice(0, 3).map(t => t.id);
    for (const st of ['STAGE', 'CLEAR', 'SHOP']) { where = 'run ' + st; Engine.state = st; Engine.draw(); }
    return [...found.entries()];
  });
  assert(!bad.length, bad.length + ' text problems:\n' + bad.slice(0, 12).map(([k, v]) => '  ' + k + ' ' + JSON.stringify(v)).join('\n'));
  await done();
}
