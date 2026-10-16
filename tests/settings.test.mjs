// SETTINGS: each switch flips and is saved; camera and mic really turn on and
// off (a fake camera); a switched-off camera stays off after a reload and its
// games are skipped.
import { eq, assert, openGame } from './lib.mjs';

const MEDIA = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'];

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { args: MEDIA, context: { permissions: ['camera', 'microphone'] } });
  const tapRow = k => page.evaluate(k => { const r = Engine.SET_ROWS.find(r => r.k === k); Engine.release({ x: 150, y: r.y + 6 }); }, k);
  const states = () => page.evaluate(() => Object.fromEntries(Engine.SET_ROWS.map(r => [r.k, Engine.setState(r.k)])));
  await page.evaluate(() => { localStorage.clear(); Engine.state = 'TITLE'; Engine.timer = 0; Engine.titleT = 9; Engine.release({ x: CX, y: Engine.BTN_SET.y + 10 }); });
  eq(await page.evaluate(() => Engine.state), 'SETTINGS', 'SETTINGS opens');
  const s0 = await states();
  eq([s0.sound, s0.music, s0.vibe], ['ON', 'ON', 'ON'], 'sound, music and vibration start on');
  for (const k of ['sound', 'music', 'vibe']) await tapRow(k);
  const s1 = await states();
  eq([s1.sound, s1.music, s1.vibe], ['OFF', 'OFF', 'OFF'], 'the switches flip');
  eq(await page.evaluate(() => ['muted', 'music', 'vibe'].map(k => localStorage.getItem('micromania.' + k))), ['1', '0', '0'], 'and are saved');
  await tapRow('cam'); await tapRow('mic'); await page.waitForTimeout(1500);
  const s2 = await states();
  eq([s2.cam, s2.mic], ['ON', 'ON'], 'camera and mic switch on');
  await tapRow('cam');
  eq((await states()).cam, 'OFF', 'camera switches off');
  eq(await page.evaluate(() => [Input.camDenied, !!Input._cam]), [true, false], 'and the stream is stopped');
  await page.reload(); await page.waitForTimeout(600);
  eq(await page.evaluate(() => [Input.camDenied, Sfx.muted, Prefs.music, Prefs.vibe]), [true, true, false, false], 'choices survive a reload');
  assert(!(await page.evaluate(() => Engine.playable(POOL.find(c => c.meta.id === 'move')))), 'camera games are skipped while the camera is off');
  await done();
}
