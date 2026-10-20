// SHIBA MANIA offline support. The whole game is one page, so it's cached on
// the first visit. Online, every request goes to the network first (so a new
// version shows up straight away) and refreshes the cache; offline, the cached
// copy is served.
const CACHE = 'shibamania-v1';
const CORE = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'art/couch.png', 'art/crate.png', 'art/slingshot.png', 'art/bone.png', 'art/fence.png', 'art/gatepost.png', 'art/pot.png', 'art/tub.png', 'art/lawn.png', 'art/choc.png', 'art/ball.png', 'art/doghouse.png', 'art/car.png', 'art/paw.png', 'art/cactus.png', 'art/bomb.png', 'art/frisbee.png', 'art/crowdarm.png', 'art/hole.png', 'art/sandpile.png', 'art/bigbed.png', 'art/cushion.png', 'art/cushion52.png', 'art/finish.png', 'art/slab.png', 'art/speaker.png', 'art/micstand.png', 'art/hedge.png', 'art/bathmat.png', 'art/laser.png', 'art/pipe.png', 'art/platform.png', 'art/gate.png', 'art/sled.png', 'art/hurdle.png', 'art/plank.png', 'art/stand.png', 'art/longcrate.png', 'art/bin.png', 'art/bowl.png', 'art/duck.png', 'art/suds.png', 'art/mud.png', 'art/firstaid.png', 'art/speech.png', 'art/beam.png', 'art/tissuebox.png', 'art/tissue.png', 'art/wand.png', 'art/bubble.png', 'art/cake.png', 'art/candle.png', 'art/trafficlight.png', 'art/jug.png', 'art/jar.png', 'art/seed.png', 'art/dandelion.png', 'art/rubdog.png', 'art/fullshiba.png', 'art/sleepdog.png', 'art/rocker.png', 'art/yesno.png', 'art/wag.png', 'art/feed.png', 'art/lean.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const page = req.mode === 'navigate';
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(page ? './' : req, copy)); }
      return res;
    }).catch(() => caches.match(page ? './' : req, { ignoreSearch: true }).then(hit => hit || caches.match('./')))
  );
});
