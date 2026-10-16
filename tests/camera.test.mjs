// The live camera (a fake one): frames arrive, motion reads, a still can be
// taken; if the phone stops feeding the hidden video the picture keeps coming
// (track frames, where the browser has them), and a dead feed is restarted.
import { eq, assert, openGame } from './lib.mjs';

const MEDIA = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'];

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url, { args: MEDIA, context: { permissions: ['camera', 'microphone'] } });
  const sample = secs => page.evaluate(async secs => {
    let peak = 0, live = 0, n = 0; const t0 = performance.now(), c = document.createElement('canvas').getContext('2d');
    while (performance.now() - t0 < secs * 1000) { Input.beginStep(); peak = Math.max(peak, Input.motion); n++; if (Input.drawLive(c, 0, 0, 40, 30)) live++; await new Promise(r => setTimeout(r, 16)); }
    return { peak, live: live / n, ready: Input.camReady, snap: !!Input.snapPhoto() };
  }, secs);
  await page.evaluate(() => Input.enableCam());
  await page.waitForTimeout(1500);
  const a = await sample(2);
  assert(a.ready && a.live > 0.9 && a.peak > 0.05 && a.snap, 'camera live: ' + JSON.stringify(a));
  await page.evaluate(() => { HTMLVideoElement.prototype.play = function () { return Promise.resolve(); }; Input._camVideo.pause(); });
  const b = await sample(4);
  assert(b.ready && b.live > 0.9, 'picture keeps coming with the video paused: ' + JSON.stringify(b));
  await page.evaluate(() => { Input._camGen++; Input._dropFrame(); });   // the frames stop too
  const c = await sample(6);
  assert(c.ready && c.live > 0.5, 'a dead feed comes back: ' + JSON.stringify(c));
  await done();
}
