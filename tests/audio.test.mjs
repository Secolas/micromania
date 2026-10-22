// Sound and music: every effect and sting renders (offline) to something
// audible that doesn't clip, every song's parts line up in whole bars, and the
// right song is picked for each screen.
import { eq, assert, openGame } from './lib.mjs';

export default async function ({ url, launch }) {
  const { page, done } = await openGame(launch, url);
  const r = await page.evaluate(async () => {
    const SR = 22050, out = { quiet: [], loud: [], bars: [], picks: {} };
    const render = async (secs, fn) => {
      Sfx.ac = new OfflineAudioContext(2, Math.ceil(SR * secs), SR); Sfx.muted = false; Sfx.wire(); Music.bus = null;
      fn();
      const buf = await Sfx.ac.startRendering(); let peak = 0;
      for (let c = 0; c < 2; c++) for (const v of buf.getChannelData(c)) peak = Math.max(peak, Math.abs(v));
      return peak;
    };
    const fx = ['tap', 'tick', 'boop', 'squeak', 'bark', 'growl', 'crunch', 'chomp', 'splash', 'whoosh', 'thud', 'sniff', 'heart', 'snore', 'poof',
                'smack', 'clap', 'tissue', 'boing', 'clunk', 'creak', 'goal',
                'win', 'fail', 'go', 'speedup', 'clear', 'gameover'];
    for (const n of fx) { const p = await render(1.8, () => Sfx[n]()); if (p < 0.02) out.quiet.push(n + ' ' + p.toFixed(3)); if (p > 0.95) out.loud.push(n); }
    for (const [n, f] of [['prompt', () => Sfx.prompt(false)], ['promptBoss', () => Sfx.prompt(true)], ['step', () => Sfx.step(3)], ['fizz', () => Sfx.fizz(1)], ['roll', () => Sfx.roll(1)], ['bonk', () => Sfx.bonk(3)], ['fly', () => Sfx.fly(true)], ['hum', () => Sfx.hum(1)], ['foot', () => Sfx.foot(1)], ['chug', () => Sfx.chug(82, 0.06, 0.5)], ['hat', () => Sfx.hat()]]) {
      const p = await render(1, f); if (p < 0.01) out.quiet.push(n); if (p > 0.95) out.loud.push(n);
    }
    for (const [name, S] of Object.entries(Music.SONGS)) {
      const step = 15 / S.bpm;
      const p = await render(64 * step + 0.5, () => { Music.setup(); Music.bus.gain.value = Music.VOL; for (let i = 0; i < 64; i++) Music.play(S, i, 0.05 + i * step, step); });
      if (p < 0.05) out.quiet.push('song ' + name); if (p > 0.95) out.loud.push('song ' + name);
      for (const part of ['l', 'b', 'd', 'x']) if (S[part] && S[part].length % 16) out.bars.push(name + '.' + part + ' ' + S[part].length);
    }
    for (const st of ['TITLE', 'SETTINGS', 'ALBUM', 'SHOP', 'READY', 'SPEEDUP', 'CLEAR', 'GAMEOVER']) { Engine.state = st; out.picks[st] = Engine.musicTrack(); }
    Engine.startRound(TapBug, 1); Engine.state = 'PLAYING'; out.picks.PLAYING = Engine.musicTrack();
    Engine.startRound(Juggle, 1, true); Engine.state = 'PLAYING'; out.picks.BOSS = Engine.musicTrack();
    return out;
  });
  assert(!r.quiet.length, 'too quiet or silent: ' + r.quiet.join(', '));
  assert(!r.loud.length, 'clipping: ' + r.loud.join(', '));
  assert(!r.bars.length, 'song parts not in whole bars: ' + r.bars.join(', '));
  eq(r.picks, { TITLE: 'menu', SETTINGS: 'menu', ALBUM: 'menu', SHOP: 'shop', READY: null, SPEEDUP: null, CLEAR: null, GAMEOVER: null, PLAYING: 'game', BOSS: 'boss' }, 'songs per screen');
  await done();
}
