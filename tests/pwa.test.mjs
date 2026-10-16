// Install and offline: the manifest and icons load, the service worker takes
// over, and the game still starts with the network gone.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, ctx, done } = await openGame(launch, url, { live: true, wait: 300 });
  const man = await page.evaluate(async () => { const l = document.querySelector('link[rel=manifest]'); const r = await fetch(l.href); return r.json(); });
  eq([man.name, man.display, man.start_url], ['SHIBA MANIA', 'standalone', '/'], 'manifest');
  for (const i of man.icons) {
    const ok = await page.evaluate(async src => { const r = await fetch(src); const b = await r.blob(); const im = await createImageBitmap(b); return [r.ok, im.width + 'x' + im.height]; }, i.src);
    eq(ok, [true, i.sizes], 'icon ' + i.src);
  }
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.waitForTimeout(500);          // now controlled, and the page is cached
  assert(await page.evaluate(() => !!navigator.serviceWorker.controller), 'the service worker controls the page');
  await ctx.setOffline(true);
  await page.reload(); await page.waitForTimeout(800);
  const off = await page.evaluate(() => [document.title, typeof Engine, Engine.state, Object.keys(Assets.cache || {}).length > 0]);
  eq(off.slice(0, 3), ['SHIBA MANIA', 'object', 'TITLE'], 'the game loads offline');
  await ctx.setOffline(false);
  await done();
}
