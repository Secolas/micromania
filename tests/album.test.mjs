// The album: a camera win saves a photo, the grid pages, a photo opens, share
// downloads a card on desktop, delete takes two taps, and it survives a reload.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { context: { acceptDownloads: true } });
  const tap = (x, y) => page.evaluate(([x, y]) => Engine.release({ x, y }), [x, y]);
  const saved = await page.evaluate(() => {
    localStorage.removeItem('micromania.album'); Album.items = null;
    Input.camReady = true; Input.snapPhoto = () => { const c = document.createElement('canvas'); c.width = 90; c.height = 120; c.getContext('2d').fillRect(0, 0, 90, 120); return c; };
    Engine.mode = 'classic'; Engine.startRound(MoveCam, 1); Engine.state = 'PLAYING'; Engine.timer = Engine.duration; Engine.game.paused = false;
    for (let k = 0; k < 400 && Engine.state === 'PLAYING'; k++) { Input.beginStep(); Input.motion = 0.8; Engine.update(STEP); }
    Input.camReady = false;
    return { won: Engine.game.won, n: Album.load().length, game: Album.newest(0) && Album.newest(0).game, stored: JSON.parse(localStorage.getItem('micromania.album')).length };
  });
  eq(saved, { won: true, n: 1, game: 'MOVE!', stored: 1 }, 'a camera win saves one photo');
  await page.evaluate(() => { for (let i = 0; i < 9; i++) { const c = document.createElement('canvas'); c.width = 90; c.height = 120; Album.add(c, 'NICE MOVES!', 'MOVE!'); } });
  await page.evaluate(() => { Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9; });
  const A = await page.evaluate(() => ({ album: Engine.BTN_ALBUM, next: Engine.ALB_NEXT, prev: Engine.ALB_PREV, share: Engine.ALB_SHARE, del: Engine.ALB_DEL, cell: Engine.albumCell(0) }));
  await tap(CXv(), A.album.y + 10);
  eq(await page.evaluate(() => Engine.state), 'ALBUM', 'ALBUM opens the album');
  await tap(A.next.x + 5, A.next.y + 5);
  eq(await page.evaluate(() => Engine.albumPage), 1, 'the next arrow pages on');
  await tap(A.prev.x + 5, A.prev.y + 5);
  await tap(A.cell.x, A.cell.y);
  eq(await page.evaluate(() => Engine.albumSel), 0, 'tapping a photo opens it');
  await page.evaluate(() => Album.img(Album.newest(0))); await page.waitForTimeout(400);   // its picture decodes
  const dl = page.waitForEvent('download', { timeout: 4000 }).catch(() => null);
  await tap(A.share.x + 10, A.share.y + 5);
  const d = await dl;
  assert(d && d.suggestedFilename().endsWith('.png'), 'share falls back to downloading a picture');
  await tap(A.del.x + 10, A.del.y + 5);
  eq(await page.evaluate(() => Album.load().length), 10, 'the first DELETE tap only asks');
  await tap(A.del.x + 10, A.del.y + 5);
  eq(await page.evaluate(() => [Album.load().length, Engine.albumSel]), [9, -1], 'the second deletes and goes back to the grid');
  await page.reload(); await page.waitForTimeout(500);
  eq(await page.evaluate(() => Album.load().length), 9, 'the album survives a reload');
  await done();
}
const CXv = () => 90;
