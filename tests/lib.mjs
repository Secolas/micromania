// Shared helpers for the tests.
export function assert(cond, msg) { if (!cond) throw new Error(msg); }
export function eq(a, b, msg) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// A page on the game with the frame loop stopped (unless live), so a test steps
// the engine itself. Page errors fail the test.
export async function openGame(launch, url, { args = [], context = {}, viewport = { width: 360, height: 640 }, wait = 600, query = '', live = false } = {}) {
  const browser = await launch(args);
  const ctx = await browser.newContext({ viewport, ...context });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url + query);
  await page.waitForTimeout(wait);
  if (!live) await page.evaluate(() => { running = false; });   // live: leave the real frame loop on
  const done = async () => {
    await browser.close();
    if (errors.length) throw new Error('page errors: ' + errors.slice(0, 3).join(' | '));
  };
  return { browser, ctx, page, errors, done };
}
